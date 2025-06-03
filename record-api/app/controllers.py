from fastapi import APIRouter, Request, Header, HTTPException
from app.schemas import MessageCreate, MessageOut
from app.services import MessageService
from app.auth import is_authenticated

router = APIRouter()
service = MessageService()

@router.post("/message")
async def post_message(msg: MessageCreate, authorization: str = Header(...)):
    # Validar auth
    if not await is_authenticated(authorization, msg.userIdSend):
        raise HTTPException(status_code=401, detail="Not authenticated")

    service.save_message(msg.userIdSend, msg.userIdReceive, msg.message)
    return {"message": "message sent with success"}

@router.get("/message")
async def get_messages(user: int, authorization: str = Header(...)):
    if not await is_authenticated(authorization, user):
        raise HTTPException(status_code=401, detail="Not authenticated")

    messages = await service.get_messages_by_user(user)
    return messages
