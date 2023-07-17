const RedisClient = require('ioredis');

const client = new RedisClient({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST,
});

module.exports = { redisClient: client };
