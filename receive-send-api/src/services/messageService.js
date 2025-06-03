const axios = require('axios');
const amqp = require('amqplib');

const AUTH_API_URL = process.env.AUTH_API_URL;
const RECORD_API_URL = process.env.RECORD_API_URL;
const RABBITMQ_URL = process.env.RABBITMQ_URL;

console.log('AUTH_API_URL:', process.env.AUTH_API_URL);

async function verifyAuth(token, userId) {
  console.log('Token:', token, 'UserId:', userId);
  try {
    // if (token && token.startsWith('Bearer ')) {
      //   token = token.slice(7);
      // }
      
      console.log('Token after slicing:', token);
      console.log('AUTH_API_URL:', process.env.AUTH_API_URL);

    const resp = await axios.get(`${AUTH_API_URL}/token`, {
      headers: { Authorization: token },
      params: { user: userId }
    });

    console.log('Response from auth API:', resp.data);

    return resp.data.auth === true;
  } catch (err) {
    console.error('Error verifying auth:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
    }
    return false;
  }
}

async function sendMessage({ token, userIdSend, userIdReceive, message }) {
  if (!await verifyAuth(token, userIdSend)) {
    throw new Error('Usuário não autorizado');
  }
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queueName = `usuario${userIdSend}usuario${userIdReceive}`;
  await channel.assertQueue(queueName, { durable: true });
  const content = JSON.stringify({ userIdSend, userIdReceive, message });
  channel.sendToQueue(queueName, Buffer.from(content), { persistent: true });
  await channel.close();
  await connection.close();
}

async function processQueue({ token, userIdSend, userIdReceive }) {
  if (!await verifyAuth(token, userIdSend)) {
    throw new Error('Usuário não autorizado');
  }
  const queueName = `usuario${userIdSend}usuario${userIdReceive}`;
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

async function getMessages({ token, userId }) {
  if (!await verifyAuth(token, userId)) {
    throw new Error('Usuário não autorizado');
  }
  const response = await axios.get(RECORD_API_URL, {
    headers: { Authorization: token },
    params: { user: userId }
  });
  return response.data;
}

module.exports = {
  sendMessage,
  processQueue,
  getMessages,
};