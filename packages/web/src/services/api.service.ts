// Código para src/services/api.service.ts
export class ApiService {
  private static apiUrl = 'http://localhost:3000/api';

  public static async createPaymentSession(data: Record<string, unknown>) {
    const response = await fetch(`${this.apiUrl}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao iniciar o pagamento.');
    }

    return response.json();
  }

  // NOVO MÉTODO: Adicione este código aqui
  public static async getAffiliateLink(produto: string) {
    const response = await fetch(`${this.apiUrl}/afiliados/link?produto=${produto}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar o link de afiliado.');
    }

    return response.json();
  }
}