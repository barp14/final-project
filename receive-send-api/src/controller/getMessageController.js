const axios = require('axios');

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

async function getMessageController(req, res) {
  const token = req.headers.authorization;
  const userId = req.query.user;

  if (!token || !userId) {
    return res.status(400).json({ message: 'Token e userId são obrigatórios' });
  }

  const authorized = await verifyAuth(token, userId);
  if (!authorized) {
    return res.status(401).json({ message: 'Usuário não autorizado' });
  }

  try {
    const response = await axios.get(RECORD_API_URL, {
      headers: { Authorization: token },
      params: { user: userId }
    });
    return res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error.message);
    return res.status(500).json({ message: 'Erro ao buscar mensagens' });
  }
}

module.exports = { getMessageController };
