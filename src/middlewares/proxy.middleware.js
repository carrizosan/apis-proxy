const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const { insertRequest } = require('../db/mongodb/statistics.repository');

const proxy = createProxyMiddleware({
  target: process.env.DESTINATION_API,
  changeOrigin: true, // Change origin headers in request
  logger: console,
  selfHandleResponse: true, // Used by responseInterceptor
  onProxyRes: responseInterceptor((responseBuffer, proxyRes, req, res) => {
    const { path, method, ip } = req;
    const { statusCode } = res;
    let errorMessage = null;

    if (statusCode && statusCode >= 400) {
      const body = JSON.parse(responseBuffer.toString('utf8'));
      errorMessage = `${body.error} - ${body.message}`;
    }
    insertRequest(path, ip, method, statusCode, errorMessage);
    return responseBuffer;
  }),
});

// Filter by path to avoid proxy function
const proxyMiddleware = (req, res, next) => {
  if (req.path.startsWith('/statistics')) {
    next();
  } else {
    proxy(req, res, next);
  }
};

module.exports = { proxyMiddleware };
