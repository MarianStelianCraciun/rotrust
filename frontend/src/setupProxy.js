const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Setup proxy for API requests
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );
};