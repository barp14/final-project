import aioredis
from app.config import REDIS_URL

redis = None

async def get_redis():
    global redis
    if not redis:
        redis = await aioredis.from_url(REDIS_URL)
    return redis

async def cache_set(key: str, value: str, expire: int = 300):
    r = await get_redis()
    await r.set(key, value, ex=expire)

async def cache_get(key: str):
    r = await get_redis()
    value = await r.get(key)
    if value:
        print("HIT CACHE")
    else:
        print("MISS CACHE")
    return value