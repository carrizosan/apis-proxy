const rateLimit = require('express-rate-limit');

const DEFAULT_WINDOW_TIME = 60 * 60 * 1000; // 1 hour window default
const DEFAULT_MAX_REQUESTS = 1000; // 1000 requests by window default

const ipRateLimiter = rateLimit({
  windowMs: process.env.IP_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000 || DEFAULT_WINDOW_TIME,
  max: process.env.IP_RATE_LIMIT_MAX_REQUESTS || DEFAULT_MAX_REQUESTS, // Number of requests by window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const pathRateLimiter = rateLimit({
  windowMs: process.env.PATH_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000 || DEFAULT_WINDOW_TIME,
  max: process.env.PATH_RATE_LIMIT_MAX_REQUESTS || DEFAULT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.path,
});

const ipAndPathRateLimiter = rateLimit({
  windowMs: process.env.IP_PATH_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000 || DEFAULT_WINDOW_TIME,
  max: process.env.IP_PATH_RATE_LIMIT_MAX_REQUESTS || DEFAULT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${req.ip}:${req.path}`,
});

module.exports = { ipRateLimiter, pathRateLimiter, ipAndPathRateLimiter };
