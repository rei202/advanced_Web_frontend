const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/lapi',
        createProxyMiddleware({
            target: 'https://advancedwebbackend-production-1b23.up.railway.app/',
            changeOrigin: true,
            pathRewrite: {
                '^/lapi': '',
            },
        })
    );
};
