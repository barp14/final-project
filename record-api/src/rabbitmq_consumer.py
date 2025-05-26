import pika
import json
import threading
from database.models import Message, db

RABBITMQ_URL = 'amqp://guest:guest@localhost:5672/'

def callback(ch, method, properties, body, app):
    data = json.loads(body)
    try:
        with app.app_context():
            new_message = Message(
                message=data['message'],
                user_id_send=data['userIdSend'],
                user_id_receive=data['userIdReceive']
            )
            db.session.add(new_message)
            db.session.commit()
        print(f"Mensagem salva da fila {method.routing_key}: {data}")
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"Erro ao salvar mensagem: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

def start_consumer_for_queue(app, queue_name):
    params = pika.URLParameters(RABBITMQ_URL)
    connection = pika.BlockingConnection(params)  # CONEXÃO NOVA POR THREAD
    channel = connection.channel()

    channel.queue_declare(queue=queue_name, durable=True)
    channel.basic_qos(prefetch_count=1)

    def callback_wrapper(ch, method, properties, body):
        callback(ch, method, properties, body, app)

    channel.basic_consume(queue=queue_name, on_message_callback=callback_wrapper)

    print(f'Consumidor iniciado na fila {queue_name}')
    channel.start_consuming()

def start_all_consumers(app):
    queue_names = [
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

    threads = []
    for queue_name in queue_names:
        thread = threading.Thread(target=start_consumer_for_queue, args=(app, queue_name), daemon=True)
        thread.start()
        threads.append(thread)
