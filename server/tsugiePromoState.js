const fs = require('fs');

const loadPromoCodes = (promoDataFile) => {
    try {
        const source = fs.readFileSync(promoDataFile, 'utf8');
        const matches = source.match(/"([A-Z0-9]+)"/g) || [];
        return Array.from(new Set(matches.map((item) => item.replace(/"/g, ''))));
    } catch (error) {
        return [];
    }
};

const normalizeIp = (ip) => {
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

const createPromoStateStore = ({promoDataFile, stateFile}) => {
    const allPromoCodes = loadPromoCodes(promoDataFile);

    const loadClaimedMapFromDisk = () => {
        try {
            if (!fs.existsSync(stateFile)) {
                return new Map();
            }

            const raw = fs.readFileSync(stateFile, 'utf8');
            const parsed = JSON.parse(raw);
            const source = parsed && typeof parsed === 'object' && parsed.claimedByIp && typeof parsed.claimedByIp === 'object'
                ? parsed.claimedByIp
                : {};

            const next = new Map();
            Object.keys(source).forEach((ip) => {
                const code = source[ip];
                if (!ip || typeof code !== 'string' || !allPromoCodes.includes(code)) {
                    return;
                }
                next.set(ip, code);
            });
            return next;
        } catch (error) {
            return new Map();
        }
    };

    const claimedIpToCode = loadClaimedMapFromDisk();

    const persistClaimedMapToDisk = () => {
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

    const getUsedCount = () => new Set(claimedIpToCode.values()).size;

    const getAvailableCodes = () => {
        const usedCodes = new Set(claimedIpToCode.values());
        return allPromoCodes.filter((code) => !usedCodes.has(code));
    };

    const buildState = (ip) => {
        const total = allPromoCodes.length;
        const remaining = Math.max(0, total - getUsedCount());
        const code = ip ? (claimedIpToCode.get(ip) || '') : '';
        return {total, remaining, code};
    };

    const pickRandomCode = (codes) => {
        if (!codes.length) {
            return '';
        }
        const index = Math.floor(Math.random() * codes.length);
        return codes[index];
    };

    const claim = (ip) => {
        if (!allPromoCodes.length) {
            return {
                status: 500,
                body: {
                    total: 0,
                    remaining: 0,
                    code: '',
                    exhausted: true
                }
            };
        }

        if (!ip) {
            return {
                status: 400,
                body: {
                    ...buildState(''),
                    code: '',
                    message: 'ip-unavailable'
                }
            };
        }

        const claimedCode = claimedIpToCode.get(ip);
        if (claimedCode) {
            return {
                status: 200,
                body: {
                    ...buildState(ip),
                    code: claimedCode,
                    alreadyClaimed: true
                }
            };
        }

        const availableCodes = getAvailableCodes();
        if (!availableCodes.length) {
            return {
                status: 409,
                body: {
                    ...buildState(ip),
                    code: '',
                    exhausted: true
                }
            };
        }

        const code = pickRandomCode(availableCodes);
        claimedIpToCode.set(ip, code);
        if (!persistClaimedMapToDisk()) {
            claimedIpToCode.delete(ip);
            return {
                status: 500,
                body: {
                    ...buildState(ip),
                    code: '',
                    message: 'persist-failed'
                }
            };
        }

        return {
            status: 200,
            body: {
                ...buildState(ip),
                code,
                alreadyClaimed: false
            }
        };
    };

    return {
        normalizeIp,
        getState: (ip) => buildState(ip),
        claim
    };
};

module.exports = {
    createPromoStateStore,
    normalizeIp,
};
