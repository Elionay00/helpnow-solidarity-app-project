import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/forgot-password', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <div>
      <h2>Esqueci a Senha</h2>
      <p>Digite seu e-mail para enviarmos um link de recuperação.</p>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Digite seu e-mail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar Link</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ForgotPassword;