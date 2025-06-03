from app.models import Message
from app.database import SessionLocal
from sqlalchemy.orm import Session
import json
from app.cache import cache_get, cache_set

class MessageService:

    def __init__(self):
        self.db: Session = SessionLocal()

    def save_message(self, user_id_send: int, user_id_receive: int, message_text: str):
        msg = Message(
            user_id_send=user_id_send,
            user_id_receive=user_id_receive,
            message=message_text
        )
        self.db.add(msg)
        self.db.commit()
        self.db.refresh(msg)
        # Invalida o cache do usuário que recebeu e enviou a mensagem
        from app.cache import get_redis
        import asyncio
        async def invalidate():
            r = await get_redis()
            await r.delete(f"user_messages:{user_id_send}")
            await r.delete(f"user_messages:{user_id_receive}")
        asyncio.create_task(invalidate())
        return msg

    async def get_messages_by_user(self, user_id: int):
        cache_key = f"user_messages:{user_id}"
        cached = await cache_get(cache_key)
        if cached:
            return json.loads(cached)

        messages = self.db.query(Message).filter(
            (Message.user_id_send == user_id) | (Message.user_id_receive == user_id)
        ).order_by(Message.created_at.asc()).all()

        result = [
            {"userId": msg.user_id_send, "message": msg.message}
            for msg in messages
        ]

        await cache_set(cache_key, json.dumps(result))
        return result