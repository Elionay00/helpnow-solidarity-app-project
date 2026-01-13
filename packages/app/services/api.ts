import axios from 'axios';

const api = axios.create({
  // Mudamos de 3333 para 3000 para bater com o seu servidor
  baseURL: 'http://localhost:3000', 
});

export default api;