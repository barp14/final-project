const { createClient } = require('redis');
const client = createClient({ url: process.env.REDIS_URL || 'redis://redis:6379/0' });

client.connect();

async function cacheGet(key) {
  const value = await client.get(key);
  if (value) {
    console.log('HIT CACHE');
    return JSON.parse(value);
  }
  console.log('MISS CACHE');
  return null;
}

async function cacheSet(key, value, expire = 300) {
  await client.set(key, JSON.stringify(value), { EX: expire });
}

module.exports = { cacheGet, cacheSet };