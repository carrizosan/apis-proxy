const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyMiddleware = createProxyMiddleware({
  target: process.env.DESTINATION_API,
  changeOrigin: true,
  logger: console,
});

module.exports = { proxyMiddleware };
