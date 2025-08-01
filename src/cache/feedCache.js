const redis = require('./redisClient');

const FEED_CACHE_KEY = 'feed_cache';
const TTL = 60; // seconds

async function getCachedFeed() {
  const data = await redis.get(FEED_CACHE_KEY);
  return data ? JSON.parse(data) : null;
}

async function setCachedFeed(data) {
  await redis.set(FEED_CACHE_KEY, JSON.stringify(data), 'EX', TTL);
}

async function invalidateFeedCache() {
  await redis.del(FEED_CACHE_KEY);
}

module.exports = {
  getCachedFeed,
  setCachedFeed,
  invalidateFeedCache
};
