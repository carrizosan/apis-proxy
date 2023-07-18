const RedisClient = require('ioredis');

let client = null;

const getClient = () => {
  if (!client) {
    client = new RedisClient({
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_HOST,
    });
  }
  return client;
};

module.exports = { getClient };
