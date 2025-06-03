require('dotenv').config();

const express = require('express');
const app = express();

const { createClient } = require('redis');
const redisClient = createClient({ url: 'redis://redis:6379/0' });

redisClient.connect().catch(console.error);

const messageRoutes = require('./routes/messageRoutes');

app.use(express.json());
app.use('/', messageRoutes);

app.get('/health', async (req, res) => {
  try {
    await redisClient.ping();
    res.json({ status: 'Receive-Send-API is Healthy', redis: 'connected' });
  } catch (e) {
    res.status(500).json({ status: 'error', redis: 'not connected' });
  }
});

// Example usage in a route
app.get('/cache-test', async (req, res) => {
  await redisClient.set('test-key', 'hello redis', { EX: 60 });
  const value = await redisClient.get('test-key');
  res.json({ value });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Receive-Send-API rodando na porta ${PORT}`);
});