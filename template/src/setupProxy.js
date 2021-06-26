const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://atlas.mapmyindia.com',
            changeOrigin: true,
        })
    );
    app.use(
        '/apis',
        createProxyMiddleware({
            target: 'https://explore.mapmyindia.com',
            changeOrigin: true,
        })
    );
};