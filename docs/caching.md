🧠 Redis Caching in QuickPost

This document explains how Redis caching has been integrated into the QuickPost project (ByteByteGo-based system design) to improve performance and reduce database load.

📌 Why Redis?

Redis is used to cache frequently accessed data like feed/posts to:

Decrease database query overhead

Improve response time

Reduce latency for high-traffic endpoints

🚀 Redis + Docker Setup

Redis is configured as a service in docker-compose.yml.

docker-compose.yml

version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    depends_on:
      - redis

  redis:
    image: redis:7
    container_name: quickpost-redis
    ports:
      - "6379:6379"

Start Everything

docker-compose up --build

⚙️ Redis Caching Implementation (Posts Feed)

TTL (Time-To-Live)

const TTL = 60; // cache expires after 60 seconds

In Controller (getAllPosts)

exports.getAllPosts = async (req, res) => {
  const redisKey = 'posts_feed';
  try {
    const cachedPosts = await redisClient.get(redisKey);
    if (cachedPosts) {
      return res.status(200).json(JSON.parse(cachedPosts));
    }

    const posts = await Post.find().populate('createdBy', 'username email');
    await redisClient.setEx(redisKey, TTL, JSON.stringify(posts));

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

🧪 Testing Redis Caching

Open Redis CLI

docker exec -it quickpost-redis redis-cli

Useful Commands

keys *               # See all cached keys
get posts_feed       # View cached data
ttl posts_feed       # Time left before cache expires
flushall             # Clear all Redis keys

After hitting the endpoint (e.g. GET /posts), check Redis CLI:

keys *

You should see:

1) "posts_feed"

🧼 Clearing Cache (Development Only)

flushall

Use this command in Redis CLI to clear all keys when testing manually.

✅ Summary

Redis improves performance by caching expensive DB queries.

TTL is configurable.

Keys are accessible via Redis CLI.

Everything runs in Docker for easy local setup.