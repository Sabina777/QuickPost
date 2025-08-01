const Redis = require('ioredis');

// Use Docker service name "redis" as host
const redis = new Redis({
  host: 'redis',
  port: 6379,
});

redis.on('connect', () => console.log(' Redis connected'));
redis.on('error', (err) => console.error(' Redis error !!', err));

module.exports = redis;
