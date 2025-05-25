from flask import Flask, request, jsonify
from database.config import db, init_db
from database.models import Message

app = Flask(__name__)
init_db(app)

@app.route('/message', methods=['POST'])
def post_message():
    data = request.get_json()
    message_text = data.get('message') or data.get('message_text')
    user_id_send = data.get('userIdSend') or data.get('user_id_send')
    user_id_receive = data.get('userIdReceive') or data.get('user_id_receive')

    if not message_text or not user_id_send or not user_id_receive:
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400

    new_message = Message(message=message_text, user_id_send=user_id_send, user_id_receive=user_id_receive)
    db.session.add(new_message)
    db.session.commit()

    return jsonify({'ok': True}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
