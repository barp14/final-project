import asyncio
import json
from aio_pika import connect_robust, IncomingMessage, ExchangeType
from app.models import Message
from app.database import SessionLocal
from sqlalchemy.exc import SQLAlchemyError

RABBITMQ_URL = "amqp://guest:guest@rabbitmq:5672/"

QUEUE_NAMES = [
    'usuario1usuario2',
    'usuario1usuario3',
    'usuario1usuario4',
    'usuario2usuario1',
    'usuario2usuario3',
    'usuario2usuario4',
    'usuario3usuario1',
    'usuario3usuario2',
    'usuario3usuario4',
    'usuario4usuario1',
    'usuario4usuario2',
    'usuario4usuario3',
]

async def handle_message(message: IncomingMessage):
    async with message.process(requeue=True):
        try:
            data = json.loads(message.body.decode())
            db = SessionLocal()
            msg = Message(
                message=data['message'],
                user_id_send=data['userIdSend'],
                user_id_receive=data['userIdReceive']
            )
            db.add(msg)
            db.commit()
            db.close()
            print(f"Mensagem salva da fila: {data}")
        except (KeyError, SQLAlchemyError, Exception) as e:
            print(f"Erro ao salvar mensagem: {e}")
            raise

async def consume_queue(queue_name):
    connection = await connect_robust(RABBITMQ_URL)
    channel = await connection.channel()
    await channel.set_qos(prefetch_count=1)
    queue = await channel.declare_queue(queue_name, durable=True)
    print(f"Consumidor iniciado na fila {queue_name}")
    await queue.consume(handle_message, no_ack=False)

async def start_all_consumers():
    await asyncio.gather(*(consume_queue(q) for q in QUEUE_NAMES))