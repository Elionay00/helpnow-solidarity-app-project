import axios from 'axios';

const api = axios.create({
  // Substitua pelo IP da sua máquina para testar no celular/emulador
  // Exemplo: 'http://192.168.0.10:3000' ou 'http://localhost:3000'
  baseURL: 'http://192.168.0.10:3000',
});

export default api;