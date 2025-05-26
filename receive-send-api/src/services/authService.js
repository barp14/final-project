const axios = require('axios');

const AUTH_API_URL = 'http://localhost:8000/api/token'; 

async function verificaAutenticacao(token, userId) {
  try {
    const response = await axios.get(AUTH_API_URL, {
      headers: { Authorization: token },
      params: { user: userId },
    });
    return response.data.auth === true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  verificaAutenticacao,
};
