import { useState, useEffect, useCallback } from "react";
import { type User } from "firebase/auth";
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
import { signOut } from "firebase/auth";

export interface Request {
  id: string;
  title: string;
  status: "open" | "in_progress" | "completed";
  [key: string]: unknown;
}

export const usePerfilLogic = (presentToast: (options: { message: string; duration: number; color: string; }) => Promise<void>) => {
  const [user, setUser] = useState<User | null>(null);
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [myHelps, setMyHelps] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (uid: string) => {
    try {
      // CORREÇÃO APLICADA AQUI
      const requestsQuery = query(
        collection(db, "pedidosDeAjuda"),
        where("requesterId", "==", uid), // Corrigido para requesterId
        orderBy("createdAt", "desc")
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      setMyRequests(
        requestsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Request)
        )
      );
      
      // CORREÇÃO APLICADA AQUI
      const helpsQuery = query(
        collection(db, "pedidosDeAjuda"),
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
  }, [presentToast]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchData]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!requestId) return;
    try {
      // CORREÇÃO APLICADA AQUI
      await deleteDoc(doc(db, "pedidosDeAjuda", requestId));
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