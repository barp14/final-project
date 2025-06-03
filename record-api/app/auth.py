import httpx
from app.config import AUTH_API_URL

async def is_authenticated(token: str, user_id: int) -> bool:
    if not token.startswith("Bearer "):
        token = f"Bearer {token}"
    headers = {"Authorization": token}
    params = {"user": user_id}
    async with httpx.AsyncClient(timeout=10.0) as client:
        print(f"Checking authentication for user {user_id} with token {token}")
        print(f"Requesting {AUTH_API_URL} with headers {headers} and params {params}")
        try:
            resp = await client.get(AUTH_API_URL, headers=headers, params=params)
            print(f"Response status code: {resp.status_code}")
            print(f"Response content: {resp.text}")
        except httpx.RequestError as exc:
            print(f"HTTPX RequestError: {exc}")
            return False
    if resp.status_code == 200:
        data = resp.json()
        return data.get("auth", False)
    return False
