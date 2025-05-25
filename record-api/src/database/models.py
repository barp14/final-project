from sqlalchemy.dialects.mysql import BIGINT
from database.config import db

class Message(db.Model):
    __tablename__ = 'message'
    message_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    message = db.Column(db.Text, nullable=False)
    user_id_send = db.Column(BIGINT(unsigned=True), nullable=False)
    user_id_receive = db.Column(BIGINT(unsigned=True), nullable=False)
