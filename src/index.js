require('dotenv').config();
const express = require('express');
const _ = require('lodash');
const { proxyMiddleware } = require('./middlewares/proxy.middleware');
const {
  ipRateLimiter,
  pathRateLimiter,
  ipAndPathRateLimiter,
} = require('./middlewares/rate-limiters.middleware');

const app = express();

const PORT = process.env.PORT || 3000;

if (process.env.TRUST_PROXY && _.isInteger(+process.env.TRUST_PROXY)) {
  console.log(`Trust ${process.env.TRUST_PROXY} proxy`);
  app.set('trust proxy', +process.env.TRUST_PROXY);
}

app.use('/', (req, res, next) => {
  console.log(`Request IP: ${req.ip} to ${req.path}`);
  next();
});

// Rate limit middlewares
app.use(ipAndPathRateLimiter);
app.use(ipRateLimiter);
app.use(pathRateLimiter);

app.use(proxyMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
