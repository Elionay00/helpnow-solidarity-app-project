
// packages/mobile/services/api.service.ts
import { firestore } from '../firebase/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export class ApiService {
  public static async getHelpRequests() {
    const helpRequestsCollection = collection(firestore, 'help_requests');
    const helpRequestsSnapshot = await getDocs(helpRequestsCollection);
    const helpRequestsList = helpRequestsSnapshot.docs.map(doc => doc.data());
    return helpRequestsList;
  }

  public static async createHelpRequest(data: object) {
    const helpRequestsCollection = collection(firestore, 'help_requests');
    await addDoc(helpRequestsCollection, data);
  }
}
