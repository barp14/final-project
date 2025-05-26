const axios = require('axios');
const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672';
const AUTH_API_URL = 'http://localhost:8000/api/token';
const RECORD_API_URL = 'http://localhost:5000/message';

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

async function processQueue(queueName) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  let msg;
  while ((msg = await channel.get(queueName, { noAck: false }))) {
    const content = JSON.parse(msg.content.toString());

    try {
      await axios.post(RECORD_API_URL, content);
      channel.ack(msg);
    } catch (err) {
      channel.nack(msg, false, true);
    }
  }

  await channel.close();
  await connection.close();
}

async function messageWorkerController(req, res) {
  const token = req.headers.authorization;
  const { userIdSend, userIdReceive } = req.body;

  if (!token || !userIdSend || !userIdReceive) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  }

  const authorized = await verifyAuth(token, userIdSend);
  if (!authorized) {
    return res.status(401).json({ message: 'Usuário não autorizado' });
  }

  const queueName = `usuario${userIdSend}usuario${userIdReceive}`;

  try {
    await processQueue(queueName);
    return res.json({ msg: 'ok' });
  } catch (error) {
    console.error('Erro processando fila:', error);
    return res.status(500).json({ message: 'Erro ao processar fila' });
  }
}

module.exports = { messageWorkerController };
