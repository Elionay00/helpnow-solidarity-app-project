import axios from 'axios';

// IP ATUALIZADO: 10.0.0.178
const api = axios.create({ 
  baseURL: 'http://10.0.0.178:3000' 
});

export default api;