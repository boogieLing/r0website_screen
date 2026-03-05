const fs = require('fs');
const http = require('http');
const path = require('path');

const buildPromoStoreFallback = ({promoDataFile, stateFile}) => {
    const loadPromoCodes = () => {
        try {
            const source = fs.readFileSync(promoDataFile, 'utf8');
            const matches = source.match(/"([A-Z0-9]+)"/g) || [];
            return Array.from(new Set(matches.map((item) => item.replace(/"/g, ''))));
        } catch (error) {
            return [];
        }
    };

    const normalizeIpInner = (ip) => {
        if (!ip) {
            return '';
        }
        const raw = String(ip).trim();
        if (!raw) {
            return '';
        }
        if (raw.startsWith('::ffff:')) {
            return raw.slice(7);
        }
        return raw;
    };

    const allPromoCodes = loadPromoCodes();
    const claimedIpToCode = (() => {
        try {
            if (!fs.existsSync(stateFile)) {
                return new Map();
            }
            const raw = fs.readFileSync(stateFile, 'utf8');
            const parsed = JSON.parse(raw);
            const source = parsed && typeof parsed === 'object' && parsed.claimedByIp && typeof parsed.claimedByIp === 'object'
                ? parsed.claimedByIp
                : {};
            const map = new Map();
            Object.keys(source).forEach((ip) => {
                const code = source[ip];
                if (!ip || typeof code !== 'string' || !allPromoCodes.includes(code)) {
                    return;
                }
                map.set(ip, code);
            });
            return map;
        } catch (error) {
            return new Map();
        }
    })();

    const persist = () => {
        try {
            const payload = {
                version: 1,
                updatedAt: new Date().toISOString(),
                claimedByIp: Object.fromEntries(claimedIpToCode.entries())
            };
            const tempFile = `${stateFile}.tmp`;
            fs.writeFileSync(tempFile, JSON.stringify(payload, null, 4), 'utf8');
            fs.renameSync(tempFile, stateFile);
            return true;
        } catch (error) {
            return false;
        }
    };

    const usedCount = () => new Set(claimedIpToCode.values()).size;
    const available = () => {
        const used = new Set(claimedIpToCode.values());
        return allPromoCodes.filter((code) => !used.has(code));
    };
    const state = (ip) => {
        const total = allPromoCodes.length;
        const remaining = Math.max(0, total - usedCount());
        const code = ip ? (claimedIpToCode.get(ip) || '') : '';
        return {total, remaining, code};
    };

    return {
        normalizeIp: normalizeIpInner,
        getState: (ip) => state(ip),
        claim: (ip) => {
            if (!allPromoCodes.length) {
                return {
                    status: 500,
                    body: {total: 0, remaining: 0, code: '', exhausted: true}
                };
            }
            if (!ip) {
                return {
                    status: 400,
                    body: {...state(''), code: '', message: 'ip-unavailable'}
                };
            }
            const exists = claimedIpToCode.get(ip);
            if (exists) {
                return {
                    status: 200,
                    body: {...state(ip), code: exists, alreadyClaimed: true}
                };
            }

            const list = available();
            if (!list.length) {
                return {
                    status: 409,
                    body: {...state(ip), code: '', exhausted: true}
                };
            }

            const code = list[Math.floor(Math.random() * list.length)];
            claimedIpToCode.set(ip, code);
            if (!persist()) {
                claimedIpToCode.delete(ip);
                return {
                    status: 500,
                    body: {...state(ip), code: '', message: 'persist-failed'}
                };
            }

            return {
                status: 200,
                body: {...state(ip), code, alreadyClaimed: false}
            };
        }
    };
};

let createPromoStateStore;
let normalizeIp;
try {
    const promoModule = require('./server/tsugiePromoState');
    createPromoStateStore = promoModule.createPromoStateStore;
    normalizeIp = promoModule.normalizeIp;
} catch (error) {
    const fallback = buildPromoStoreFallback;
    createPromoStateStore = (options) => fallback(options);
    normalizeIp = (ip) => {
        if (!ip) {
            return '';
        }
        const raw = String(ip).trim();
        if (!raw) {
            return '';
        }
        if (raw.startsWith('::ffff:')) {
            return raw.slice(7);
        }
        return raw;
    };
}

const HOST = '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);
const buildDir = path.join(__dirname, 'build');
const promoDataFile = path.join(__dirname, 'src/static/data/promocodes.js');
const promoStateFile = process.env.TSUGIE_PROMO_STATE_FILE || path.join(__dirname, '.tsugie-promo-state.json');

const promoStore = createPromoStateStore({
    promoDataFile,
    stateFile: promoStateFile
});

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const sendJson = (res, statusCode, body) => {
    const text = JSON.stringify(body);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Content-Length': Buffer.byteLength(text)
    });
    res.end(text);
};

const extractClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim()) {
        const first = forwarded.split(',')[0];
        const normalized = normalizeIp(first);
        if (normalized) {
            return normalized;
        }
    }

    const realIp = normalizeIp(req.headers['x-real-ip']);
    if (realIp) {
        return realIp;
    }

    return normalizeIp(req.socket?.remoteAddress);
};

const sendFile = (res, filePath) => {
    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end('Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
    });
};

const resolveStaticFile = (pathname) => {
    const cleaned = decodeURIComponent(pathname.split('?')[0]);
    const target = cleaned === '/' ? '/index.html' : cleaned;
    const normalizedPath = path.normalize(target).replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(buildDir, normalizedPath);
    const safePrefix = `${buildDir}${path.sep}`;

    if (filePath !== buildDir && !filePath.startsWith(safePrefix)) {
        return path.join(buildDir, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return filePath;
    }

    return path.join(buildDir, 'index.html');
};

const server = http.createServer((req, res) => {
    const method = req.method || 'GET';
    const url = req.url || '/';
    const pathname = url.split('?')[0];

    if (pathname === '/api/tsugie/promo/state' && method === 'GET') {
        const ip = extractClientIp(req);
        sendJson(res, 200, promoStore.getState(ip));
        return;
    }

    if (pathname === '/api/tsugie/promo/claim' && method === 'POST') {
        const ip = extractClientIp(req);
        const result = promoStore.claim(ip);
        sendJson(res, result.status, result.body);
        return;
    }

    if (pathname.startsWith('/api/')) {
        sendJson(res, 404, {message: 'not-found'});
        return;
    }

    const filePath = resolveStaticFile(pathname);
    sendFile(res, filePath);
});

server.listen(PORT, HOST, () => {
    console.log(`[tsugie-server] listening at http://${HOST}:${PORT}`);
});
