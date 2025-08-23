// src/auth/forgotPassword/forgotPasswordService.ts

// Esta URL deve apontar para o seu backend.
// É uma boa prática armazená-la em um arquivo de configuração.
const API_BASE_URL = 'https://api.suaempresa.com'; 

/**
 * Envia uma requisição ao backend para iniciar o processo de recuperação de senha.
 * @param email O e-mail do usuário para o qual a senha será resetada.
 * @returns Um objeto com o status da operação (sucesso ou falha) e a mensagem de retorno.
 */
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    // Se a resposta não for OK (status 200-299), lança um erro.
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha na solicitação. Verifique o e-mail e tente novamente.');
    }

    const result = await response.json();
    return { success: true, message: 'As instruções de recuperação foram enviadas para o seu e-mail.' };

  } catch (error) {
    console.error('Erro ao tentar resetar a senha:', error);

    // Linha corrigida para tratar o erro de forma segura
    let errorMessage = 'Ocorreu um erro de conexão. Tente novamente.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    
    return { success: false, message: errorMessage };
  }
};