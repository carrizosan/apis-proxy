const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');
const _ = require('lodash');
const statisticsRoute = require('./routes/statistics.routes');
const { proxyMiddleware } = require('./middlewares/proxy.middleware');
const {
  ipRateLimiter,
  pathRateLimiter,
  ipAndPathRateLimiter,
} = require('./middlewares/rate-limiters.middleware');
const { logRequests } = require('./middlewares/logger.middleware');

const app = express();
app.use(express.json());

/**
 * Trust proxy is used to get de correct IP Address when there is some proxy
 * app between client and server, like load balancer.
 * The number represents the number of proxies, optional.
 * */
if (process.env.TRUST_PROXY && _.isInteger(+process.env.TRUST_PROXY)) {
  console.log(`Trust ${process.env.TRUST_PROXY} proxy`);
  app.set('trust proxy', +process.env.TRUST_PROXY);
}

app.use('/statistics', statisticsRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rate limit middlewares
app.use(ipAndPathRateLimiter);
app.use(pathRateLimiter);
app.use(ipRateLimiter);

app.use(logRequests);
app.use(proxyMiddleware);

module.exports = app;
