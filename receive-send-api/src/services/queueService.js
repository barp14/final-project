const amqplib = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost';

let channel = null;

async function connect() {
  if (channel) return channel;
  const connection = await amqplib.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  return channel;
}

async function enviaParaFila(queueName, message) {
  const ch = await connect();
  await ch.assertQueue(queueName, { durable: true });
  ch.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
}

module.exports = {
  enviaParaFila,
};
