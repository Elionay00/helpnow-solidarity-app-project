import React, { useState } from 'react';
import './ForgotPasswordPage.css'; // Importa o arquivo de estilos

function ForgotPasswordPage() {
  // 1. Estado para armazenar o email digitado pelo usuário
  const [email, setEmail] = useState('');
  
  // 2. Estado para mostrar mensagens ao usuário (sucesso ou erro)
  const [message, setMessage] = useState('');
  
  // 3. Estado para controlar se a requisição está sendo enviada
  const [isSending, setIsSending] = useState(false);

  // Função que será chamada quando o formulário for enviado
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    setIsSending(true); // Inicia o estado de envio
    setMessage(''); // Limpa mensagens anteriores

    try {
      // 4. Aqui, a lógica real de envio para a API seria implementada.
      // Por enquanto, vamos simular uma chamada com um pequeno delay.
      console.log('Enviando e-mail para:', email);

      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Se a resposta for um sucesso
      setMessage('Se um e-mail válido for encontrado, as instruções de recuperação serão enviadas para ele.');
      setEmail(''); // Limpa o campo de email

    } catch (error) {
      // Se houver um erro
      console.error('Erro na solicitação:', error);
      setMessage('Ocorreu um erro. Por favor, tente novamente.');

    } finally {
      setIsSending(false); // Finaliza o estado de envio
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Esqueceu a senha?</h2>
      <p>Digite seu e-mail para receber as instruções de recuperação.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={isSending}>
          {isSending ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      
      {/* Exibe a mensagem de feedback para o usuário */}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ForgotPasswordPage;