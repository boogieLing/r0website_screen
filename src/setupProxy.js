const path = require('path');
const {createPromoStateStore, normalizeIp} = require('../server/tsugiePromoState');

const promoDataFile = path.join(__dirname, 'static/data/promocodes.js');
const promoStateFile = path.join(process.cwd(), '.tsugie-promo-state.json');

const promoStore = createPromoStateStore({
    promoDataFile,
    stateFile: promoStateFile
});

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

    return normalizeIp(req.socket?.remoteAddress || req.ip);
};

module.exports = (app) => {
    app.get('/api/tsugie/promo/state', (req, res) => {
        const ip = extractClientIp(req);
        res.json(promoStore.getState(ip));
    });

    app.post('/api/tsugie/promo/claim', (req, res) => {
        const ip = extractClientIp(req);
        const result = promoStore.claim(ip);
        res.status(result.status).json(result.body);
    });
};
