const messageService = require('../services/messageService');

async function messageController(req, res) {
  const token = req.headers.authorization;
  const { userIdSend, userIdReceive, message } = req.body;
  if (!token || !userIdSend || !userIdReceive || !message) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  }
  try {
    await messageService.sendMessage({ token, userIdSend, userIdReceive, message });
    return res.json({ message: 'Mensagem enviada com sucesso' });
  } catch (error) {
    if (error.message === 'Usuário não autorizado') {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno ao enviar mensagem' });
  }
}

async function messageWorkerController(req, res) {
  const token = req.headers.authorization;
  const { userIdSend, userIdReceive } = req.body;
  if (!token || !userIdSend || !userIdReceive) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  }
  try {
    await messageService.processQueue({ token, userIdSend, userIdReceive });
    return res.json({ msg: 'ok' });
  } catch (error) {
    if (error.message === 'Usuário não autorizado') {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro ao processar fila' });
  }
}

async function getMessageController(req, res) {
  const token = req.headers.authorization;
  const userId = req.query.user;
  if (!token || !userId) {
    return res.status(400).json({ message: 'Token e userId são obrigatórios' });
  }
  try {
    const data = await messageService.getMessages({ token, userId });
    return res.json(data);
  } catch (error) {
    if (error.message === 'Usuário não autorizado') {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro ao buscar mensagens' });
  }
}

module.exports = {
  messageController,
  messageWorkerController,
  getMessageController,
};