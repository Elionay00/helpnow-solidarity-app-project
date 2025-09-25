import type { CreateHelpRequest, HelpRequest } from './help-request';

export class ApiService {
  // Acessa a variável de ambiente. No Vite, isso será substituído pelo valor definido.
  // Para o React Native, você precisará de uma solução como 'react-native-dotenv'.
  private baseURL = process.env.API_URL || 'http://localhost:3001/api';

  async getHelpRequests(): Promise<HelpRequest[]> {
    try {
      const response = await fetch(`${this.baseURL}/help-requests`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error fetching help requests:', error);
      return [];
    }
  }

  async createHelpRequest(request: CreateHelpRequest): Promise<HelpRequest> {
    try {
      const response = await fetch(`${this.baseURL}/help-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error creating help request:', error);
      throw error; // Re-lança o erro para que o chamador possa tratá-lo
    }
  }
}