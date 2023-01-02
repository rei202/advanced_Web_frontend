const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    const backendContainer = process.env.NAME_BACKEND_CONTAINER ?? 'localhost';
    console.log(backendContainer);
    app.use(
        '/lapi',
        createProxyMiddleware({
            // target: 'https://advancedwebbackend-production-1b23.up.railway.app/',
            target : `http://${backendContainer}:8080/`,
            changeOrigin: true,
            pathRewrite: {
                '^/lapi': '',
            },
        })
    );
};
