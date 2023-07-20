const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const { getClient } = require('../db/redis/init-redis');
const { insertRequest } = require('../db/mongodb/statistics.repository');

const DEFAULT_WINDOW_TIME = 60 * 60 * 1000; // 1 hour window default
const DEFAULT_MAX_REQUESTS = 1000; // 1000 requests by window default

const redisClient = getClient();

const createRateLimiter = (
  keyGenerator,
  windowMs = DEFAULT_WINDOW_TIME,
  max = DEFAULT_MAX_REQUESTS,
  standardHeaders = true,
  legacyHeaders = false
) => {
  const errorMessage = 'Too many requests, please try again later.';
  return rateLimit({
    windowMs,
    max, // Number of requests by window
    standardHeaders, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders, // Disable the `X-RateLimit-*` headers
    keyGenerator, // Key to identify limiter and count limits
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    }),
    handler: (req, res, next, options) => {
      // Handle response when client reached limit
      const { path, ip, method } = req;
      insertRequest(path, ip, method, options.statusCode, errorMessage);
      return res.status(options.statusCode).send(options.message);
    },
    message: {
      error: errorMessage,
      statusCode: 429,
    },
  });
};

// Rate limits by IP Adress
const ipRateLimiter = createRateLimiter(
  (req) => req.ip,
  +process.env.IP_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  +process.env.IP_RATE_LIMIT_MAX_REQUESTS
);

// Rate limits by path (include path params, not includes query params).
const pathRateLimiter = createRateLimiter(
  (req) => req.path,
  +process.env.PATH_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  +process.env.PATH_RATE_LIMIT_MAX_REQUESTS
);

// Rate limits by IP Address and path
const ipAndPathRateLimiter = createRateLimiter(
  (req) => `${req.ip}:${req.path}`,
  +process.env.IP_PATH_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  +process.env.IP_PATH_RATE_LIMIT_MAX_REQUESTS
);

module.exports = { ipRateLimiter, pathRateLimiter, ipAndPathRateLimiter };
