const express = require('express');
const app = express();

const messageRoutes = require('./routes/messageRoutes');

app.use(express.json());
app.use('/', messageRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Receive-Send-API rodando na porta ${PORT}`);
});
