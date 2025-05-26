const axios = require('axios');
const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672';
const AUTH_API_URL = 'http://localhost:8000/api/token';

async function verifyAuth(token, userId) {
  try {
    const res = await axios.get(AUTH_API_URL, {
      headers: { Authorization: token },
      params: { user: userId }
    });
    return res.data.auth === true;
  } catch {
    return false;
  }
}

async function messageController(req, res) {
  const token = req.headers.authorization;
  const { userIdSend, userIdReceive, message } = req.body;

  if (!token || !userIdSend || !userIdReceive || !message) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  }

  const authorized = await verifyAuth(token, userIdSend);
  if (!authorized) {
    return res.status(401).json({ message: 'Usuário não autorizado' });
  }

  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queueName = `usuario${userIdSend}usuario${userIdReceive}`;
    await channel.assertQueue(queueName, { durable: true });

    const content = JSON.stringify({ userIdSend, userIdReceive, message });
    channel.sendToQueue(queueName, Buffer.from(content), { persistent: true });

    await channel.close();
    await connection.close();

    return res.json({ message: 'message sended with success' });
  } catch (error) {
    console.error('Erro ao enviar mensagem para a fila:', error);
    return res.status(500).json({ message: 'Erro interno ao enviar mensagem' });
  }
}

module.exports = { messageController };
