from flask import Flask, request, jsonify
from database.config import db, init_db
from database.models import Message
import jwt

app = Flask(__name__)
init_db(app)

JWT_SECRET = '9kGQghr74PH3299XmHlZqVHefMHcdJOw3FKgzfEXj5jHUOwbS9nVLX8ZpO8XUfBi'  

@app.route('/message', methods=['POST'])
def post_message():
    data = request.get_json()
    message_text = data.get('message')
    user_id_send = data.get('userIdSend')
    user_id_receive = data.get('userIdReceive')

    if not message_text or not user_id_send or not user_id_receive:
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400

    new_message = Message(
        message=message_text,
        user_id_send=user_id_send,
        user_id_receive=user_id_receive
    )
    db.session.add(new_message)
    db.session.commit()

    return jsonify({'ok': True}), 201

@app.route('/message', methods=['GET'])
def get_messages():
    token = request.headers.get('Authorization', None)
    user_id = request.args.get('user')

    if not token or not user_id:
        return jsonify({'error': 'Token e user são obrigatórios'}), 400

    if token.startswith('Bearer '):
        token = token[7:]

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        print("Payload JWT completo:", payload)
        if str(payload.get('userId')) != str(user_id) and str(payload.get('sub')) != str(user_id):
            print(f"UserId no token: {payload.get('userId')} - sub no token: {payload.get('sub')} - user_id da query: {user_id}")
            return jsonify({'error': 'Usuário não autorizado'}), 401
    except Exception as e:
        print(f"Erro ao decodificar token: {e}")
        return jsonify({'error': 'Token inválido', 'details': str(e)}), 401

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'error': 'user_id inválido'}), 400

    messages = Message.query.filter(
        (Message.user_id_send == user_id) | (Message.user_id_receive == user_id)
    ).all()

    result = [
        {
            'userIdSend': m.user_id_send,
            'userIdReceive': m.user_id_receive,
            'message': m.message
        } for m in messages
    ]

    return jsonify(result), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
