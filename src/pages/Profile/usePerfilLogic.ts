// packages/_web/src/hooks/usePerfilLogic.ts (ARQUIVO ATUALIZADO)

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
  // ADICIONADO AQUI
  updateDoc, 
  Timestamp // Timestamp é bom para a data de expiração
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

  // ... (a função fetchData continua a mesma) ...
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

  // ... (o useEffect continua o mesmo) ...
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

  // ... (o handleLogout continua o mesmo) ...
  const handleLogout = async () => {
    await signOut(auth);
  };

  // ... (o handleCancelRequest continua o mesmo) ...
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

  // ... (o getStatusColor continua o mesmo) ...
  const getStatusColor = (status: string) => {
    if (status === "open") return "success";
    if (status === "in_progress") return "warning";
    if (status === "completed") return "medium";
    return "primary";
  };

  // ---
  // --- FUNÇÃO NOVA ADICIONADA AQUI ---
  // ---
  const handleUpgradePremium = async () => {
    if (!user) {
      presentToast({ message: "Você precisa estar logado.", duration: 3000, color: "danger" });
      return;
    }

    // Define a data de expiração (ex: 30 dias a partir de hoje)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    // Pega a referência do documento do PROFISSIONAL
    const userDocRef = doc(db, "profissionais", user.uid);

    try {
      console.log("Atualizando usuário para Premium...");
      await updateDoc(userDocRef, {
        isPremium: true,
        premiumExpiresAt: Timestamp.fromDate(expirationDate) // Salva a data de expiração
      });
      
      console.log("Usuário atualizado com sucesso!");
      presentToast({
        message: "Parabéns! Você agora é um Assinante Premium.",
        duration: 4000,
        color: "success",
      });
      
      // Opcional: Recarregar os dados do usuário para refletir a mudança
      // Se você guardar o isPremium no estado (useState), precisará atualizar aqui.

    } catch (error) {
      console.error("Erro ao atualizar para premium:", error);
      presentToast({
        message: "Erro ao tentar se tornar premium. Tente novamente.",
        duration: 3000,
        color: "danger",
      });
    }
  };

  return {
    user,
    myRequests,
    myHelps,
    loading,
    handleLogout,
    handleCancelRequest,
    getStatusColor,
    // ADICIONADO AQUI:
    handleUpgradePremium, // Exporta a nova função
  };
};