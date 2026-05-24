import React, { useState, useEffect } from "react";
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonSpinner, IonRefresher,
  IonRefresherContent, IonBadge, IonButton
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { firestore } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

interface Pedido {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  urgencia: "baixa" | "media" | "alta";
  requesterName: string;
  createdAt: any;
  status: string;
  ajudasRecebidas: string[];
  photoURL?: string;
}

const WantToSupport: React.FC = () => {
  const history = useHistory();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");

  const colors = {
    primary: "#7C3AED", primaryLight: "#8B5CF6",
    success: "#059669", warning: "#D97706", error: "#DC2626",
    white: "#FFFFFF", gray50: "#FAFAFA", gray100: "#F4F4F5",
    gray200: "#E4E4E7", gray300: "#D4D4D8", gray500: "#71717A",
    gray600: "#52525B", gray700: "#3F3F46", gray900: "#18181B",
  };

  const categorias = [
    { value: "todos", label: "Todos" },
    { value: "alimentacao", label: "?? Alimentação" },
    { value: "moradia", label: "?? Moradia" },
    { value: "saude", label: "?? Saúde" },
    { value: "educacao", label: "?? Educação" },
    { value: "transporte", label: "?? Transporte" },
    { value: "outros", label: "?? Outros" },
  ];

  const getUrgencyColor = (urgencia: string) => {
    if (urgencia === "alta") return colors.error;
    if (urgencia === "media") return colors.warning;
    return colors.success;
  };

  const getTimeAgo = (timestamp: any) => {
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      const diff = Math.floor((Date.now() - date.getTime()) / 3600000);
      if (diff < 1) return "Agora mesmo";
      if (diff < 24) return `Há ${diff}h`;
      return `Há ${Math.floor(diff / 24)} dias`;
    } catch {
      return "Recentemente";
    }
  };

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(firestore, "pedidosDeAjuda"),
        where("status", "==", "aberto"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Pedido[];
      setPedidos(lista);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const pedidosFiltrados = filtroCategoria === "todos"
    ? pedidos
    : pedidos.filter((p) => p.categoria === filtroCategoria);

  return (
    <IonPage>
      <IonHeader style={{ borderBottom: `1px solid ${colors.gray200}` }}>
        <IonToolbar style={{ "--background": colors.white }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" style={{ "--color": colors.primary }} />
          </IonButtons>
          <IonTitle style={{ color: colors.primary, fontWeight: "700" }}>Pedidos de Ajuda</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ "--background": colors.gray50 }}>
        <IonRefresher slot="fixed" onIonRefresh={(e) => fetchPedidos().then(() => e.detail.complete())}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Filtros */}
        <div style={{ padding: "16px", overflowX: "auto", display: "flex", gap: "8px", background: colors.white, borderBottom: `1px solid ${colors.gray200}` }}>
          {categorias.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFiltroCategoria(cat.value)}
              style={{
                padding: "8px 16px", borderRadius: "20px", border: "none", whiteSpace: "nowrap",
                background: filtroCategoria === cat.value ? colors.primary : colors.gray100,
                color: filtroCategoria === cat.value ? colors.white : colors.gray700,
                fontWeight: "600", cursor: "pointer", fontSize: "14px"
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <IonSpinner name="crescent" style={{ color: colors.primary, width: "48px", height: "48px" }} />
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: colors.gray500 }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>??</div>
            <h3 style={{ fontWeight: "600", color: colors.gray700 }}>Nenhum pedido encontrado</h3>
            <p>Não há pedidos abertos nesta categoria.</p>
          </div>
        ) : (
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {pedidosFiltrados.map((pedido) => (
              <div
                key={pedido.id}
                onClick={() => history.push(`/need-help/${pedido.id}`)}
                style={{
                  background: colors.white, borderRadius: "16px", padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer",
                  borderLeft: `4px solid ${getUrgencyColor(pedido.urgencia)}`,
                  transition: "transform 0.2s"
                }}
              >
                {/* Header do card */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "700", color: colors.gray900, margin: 0, flex: 1, marginRight: "12px" }}>
                    {pedido.titulo}
                  </h3>
                  <span style={{
                    background: getUrgencyColor(pedido.urgencia), color: colors.white,
                    padding: "4px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "600", whiteSpace: "nowrap"
                  }}>
                    {pedido.urgencia === "alta" ? "?? Alta" : pedido.urgencia === "media" ? "?? Média" : "?? Baixa"}
                  </span>
                </div>

                {/* Descrição */}
                <p style={{ color: colors.gray600, fontSize: "0.9rem", lineHeight: "1.5", margin: "0 0 12px 0",
                  overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                  {pedido.descricao}
                </p>

                {/* Footer do card */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: colors.white, fontSize: "12px", fontWeight: "600"
                    }}>
                      {pedido.requesterName?.charAt(0) || "A"}
                    </div>
                    <span style={{ fontSize: "0.85rem", color: colors.gray600 }}>{pedido.requesterName}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "0.8rem", color: colors.gray500 }}>{getTimeAgo(pedido.createdAt)}</span>
                    <IonBadge style={{ background: colors.gray100, color: colors.gray600 }}>
                      {pedido.ajudasRecebidas?.length || 0} ajudas
                    </IonBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default WantToSupport;
