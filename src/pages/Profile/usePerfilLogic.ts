import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc, 
  deleteDoc 
} from "firebase/firestore";
import { signOut, User } from "firebase/auth";

export interface Request {
  id: string;
  title: string;
  status: "open" | "in_progress" | "completed";
}

export const usePerfilLogic = (presentToast: any) => { 
  const [user, setUser] = useState<User | null>(auth.currentUser); 
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [myHelps, setMyHelps] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Função de Busca de Dados
  const fetchData = async (uid: string) => { 
    setLoading(true);
    try {
      const requestsQuery = query(
        collection(db, "helpRequests"),
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      setMyRequests(requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Request)));

      const helpsQuery = query(
        collection(db, "helpRequests"),
        where("helperId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const helpsSnapshot = await getDocs(helpsQuery);
      setMyHelps(helpsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Request)));
    } catch (error) {
      console.error("Error fetching profile data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Efeito para Carregar Dados
  useEffect(() => {
    // Escuta mudanças no estado de autenticação para obter o usuário
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Limpeza do listener ao desmontar o componente
  }, []);

  // 4. Funções de Manipulação
  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!requestId) return;
    try {
      await deleteDoc(doc(db, "helpRequests", requestId));
      setMyRequests(prev => prev.filter(p => p.id !== requestId));
      presentToast({
        message: 'Request successfully canceled!',
        duration: 3000,
        color: 'success',
      });
    } catch (error) {
      console.error("Error canceling the request:", error);
      presentToast({
        message: 'Error canceling the request.',
        duration: 3000,
        color: 'danger',
      });
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "open") return "success";
    if (status === "in_progress") return "warning";
    if (status === "completed") return "medium";
    return "primary";
  };

  // 5. Retorno do Hook
  return {
    user,
    myRequests,
    myHelps,
    loading,
    handleLogout,
    handleCancelRequest,
    getStatusColor
  };
};