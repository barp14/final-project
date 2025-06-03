from pydantic import BaseModel

class MessageCreate(BaseModel):
    userIdSend: int
    userIdReceive: int
    message: str

class MessageOut(BaseModel):
    userId: int
    message: str
