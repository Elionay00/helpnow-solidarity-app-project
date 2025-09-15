import { useState, useEffect } from "react";
import { firestore as db, auth } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut, User } from "firebase/auth";

export interface Request {
  id: string;
  title: string;
  status: "open" | "in_progress" | "completed";
  // Adicione outras propriedades que seus documentos possam ter
  [key: string]: any;
}

export const usePerfilLogic = (presentToast: any) => {
  // CORREÇÃO: Iniciar o usuário como 'null' e deixar o useEffect cuidar da verificação.
  const [user, setUser] = useState<User | null>(null);
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [myHelps, setMyHelps] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (uid: string) => {
    // Não precisa de setLoading(true) aqui, pois o estado geral já controla isso
    try {
      const requestsQuery = query(
        collection(db, "helpRequests"),
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      setMyRequests(
        requestsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Request)
        )
      );

      const helpsQuery = query(
        collection(db, "helpRequests"),
        where("helperId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const helpsSnapshot = await getDocs(helpsQuery);
      setMyHelps(
        helpsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Request)
        )
      );
    } catch (error) {
      console.error("Error fetching profile data: ", error);
      presentToast({
        message: 'Erro ao carregar os dados do perfil.',
        duration: 3000,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData(currentUser.uid);
      } else {
        // Se não houver usuário, paramos o loading e as listas ficam vazias.
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []); // A dependência vazia está correta aqui

  const handleLogout = async () => {
    await signOut(auth);
    // O onAuthStateChanged vai detectar o logout e limpar o estado do usuário automaticamente
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!requestId) return;
    try {
      await deleteDoc(doc(db, "helpRequests", requestId));
      setMyRequests((prev) => prev.filter((p) => p.id !== requestId));
      presentToast({
        message: "Pedido cancelado com sucesso!",
        duration: 3000,
        color: "success",
      });
    } catch (error) {
      console.error("Error canceling the request:", error);
      presentToast({
        message: "Erro ao cancelar o pedido.",
        duration: 3000,
        color: "danger",
      });
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "open") return "success";
    if (status === "in_progress") return "warning";
    if (status === "completed") return "medium";
    return "primary";
  };

  return {
    user,
    myRequests,
    myHelps,
    loading,
    handleLogout,
    handleCancelRequest,
    getStatusColor,
  };
};