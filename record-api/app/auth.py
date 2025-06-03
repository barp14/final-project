import httpx
from app.config import AUTH_API_URL

async def is_authenticated(token: str, user_id: int) -> bool:
    headers = {"Authorization": token}
    params = {"user": user_id}
    async with httpx.AsyncClient() as client:
        resp = await client.get(AUTH_API_URL, headers=headers, params=params)
    if resp.status_code == 200:
        data = resp.json()
        return data.get("auth", False)
    return False
