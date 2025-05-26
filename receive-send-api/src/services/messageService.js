const axios = require('axios');

const RECORD_API_URL = 'http://localhost:5000/message';

async function salvaMensagemNoHistorico({ message, userIdSend, userIdReceive }) {
  await axios.post(RECORD_API_URL, {
    message,
    userIdSend,
    userIdReceive,
  });
}

async function consultaMensagensDoUsuario(userId) {
  const response = await axios.get(RECORD_API_URL, {
    params: { user: userId },
  });
  return response.data;
}

module.exports = {
  salvaMensagemNoHistorico,
  consultaMensagensDoUsuario,
};
