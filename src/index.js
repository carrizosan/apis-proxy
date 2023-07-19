require('dotenv').config();
const express = require('express');
const _ = require('lodash');
const statisticsRoute = require('./routes/statistics.routes');
const { proxyMiddleware } = require('./middlewares/proxy.middleware');
const {
  ipRateLimiter,
  pathRateLimiter,
  ipAndPathRateLimiter,
} = require('./middlewares/rate-limiters.middleware');
const mongoDB = require('./db/mongodb/init-mongo');
const { logRequests } = require('./middlewares/logger.middleware');
const { Settings } = require('luxon');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

Settings.defaultZone = 'America/Argentina/Buenos_Aires';

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

// Rate limit middlewares
app.use(ipAndPathRateLimiter);
app.use(pathRateLimiter);
app.use(ipRateLimiter);

app.use(logRequests);
app.use(proxyMiddleware);

app.listen(PORT, async () => {
  await mongoDB.connect();
  console.log(`Server listening on port ${PORT}`);
});
