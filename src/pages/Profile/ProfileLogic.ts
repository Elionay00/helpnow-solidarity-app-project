// src/pages/Profile/ProfileLogic.ts

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useIonToast, useIonViewWillEnter } from '@ionic/react';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';

// Interface para a estrutura dos dados que vamos buscar
interface RequestPreview {
  id: string;
  titulo: string;
  status: 'aberto' | 'em_atendimento' | 'concluido';
}

export function useProfileLogic() {
  const history = useHistory();
  const user = auth.currentUser;
  const [presentToast] = useIonToast();

  const [myRequests, setMyRequests] = useState<RequestPreview[]>([]);
  const [myHelps, setMyHelps] = useState<RequestPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState<{ isOpen: boolean; requestId: string | null }>({
    isOpen: false,
    requestId: null,
  });

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Busca os pedidos criados pelo usuário
      const requestsQuery = query(collection(db, "pedidosDeAjuda"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
      const requestsSnapshot = await getDocs(requestsQuery);
      const requestsList = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RequestPreview));
      setMyRequests(requestsList);

      // Busca as ajudas oferecidas pelo usuário
      const helpsQuery = query(collection(db, "pedidosDeAjuda"), where("helperId", "==", user.uid), orderBy("createdAt", "desc"));
      const helpsSnapshot = await getDocs(helpsQuery);
      const helpsList = helpsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RequestPreview));
      setMyHelps(helpsList);
    } catch (error) {
      console.error("Error fetching profile data: ", error);
      presentToast({ message: 'Erro ao carregar dados do perfil.', duration: 3000, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Hook do Ionic para buscar os dados sempre que a página for visitada
  useIonViewWillEnter(() => {
    fetchData();
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.replace('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
      presentToast({ message: 'Erro ao sair da conta.', duration: 3000, color: 'danger' });
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, "pedidosDeAjuda", requestId));
      // Atualiza a lista de pedidos removendo o que foi cancelado
      setMyRequests(prevRequests => prevRequests.filter(p => p.id !== requestId));
      presentToast({ message: 'Pedido cancelado com sucesso.', duration: 2000, color: 'success' });
    } catch (error) {
      console.error("Error canceling request: ", error);
      presentToast({ message: 'Ocorreu um erro ao cancelar o pedido.', duration: 3000, color: 'danger' });
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'aberto') return 'success';
    if (status === 'em_atendimento') return 'warning';
    if (status === 'concluido') return 'medium';
    return 'primary';
  };

  // Retorna todos os estados e funções que a interface (UI) vai precisar
  return {
    user,
    myRequests,
    myHelps,
    loading,
    showAlert,
    setShowAlert,
    handleLogout,
    handleCancelRequest,
    getStatusColor,
  };
}