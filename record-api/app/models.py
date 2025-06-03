from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Message(Base):
    __tablename__ = 'message'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id_send = Column(Integer, nullable=False)
    user_id_receive = Column(Integer, nullable=False)
    message = Column(String(1000), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
