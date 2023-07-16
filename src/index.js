require('dotenv').config();
const express = require('express');
const { proxyMiddleware } = require('./middlewares/proxy.middleware');
const rateLimit = require('express-rate-limit');
const _ = require('lodash');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

const PORT = process.env.PORT || 3000;

if (process.env.TRUST_PROXY && _.isInteger(+process.env.TRUST_PROXY)) {
  console.log(`Trust ${process.env.TRUST_PROXY} proxy`);
  app.set('trust proxy', 1);
}

app.use('/', (req, res, next) => {
  console.log(`Request IP: ${req.ip} to ${req.path}`);
  next();
});

app.use(limiter);
app.use('/', proxyMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
