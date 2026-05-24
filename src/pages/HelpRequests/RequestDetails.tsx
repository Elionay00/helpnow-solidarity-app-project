import React, { useState, useEffect } from "react";
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonButton, IonSpinner,
  IonIcon, IonAlert, IonToast, IonChip
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import { firestore, auth } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { checkmarkCircleOutline, heartOutline, heart, shareOutline, callOutline, chatbubbleOutline } from "ionicons/icons";

interface HelpRequest {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  urgencia: "baixa" | "media" | "alta";
  photoURL?: string;
  requesterName: string;
  requesterPhotoURL?: string;
  requesterId: string;
  createdAt: any;
  ajudasRecebidas: string[];
  status: string;
  contato?: string;
}

const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [pedido, setPedido] = useState<HelpRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ header: "", message: "" });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [offering, setOffering] = useState(false);

  const user = auth.currentUser;

  const colors = {
    primary: "#7C3AED", primaryLight: "#8B5CF6",
    success: "#059669", warning: "#D97706", error: "#DC2626",
    white: "#FFFFFF", gray50: "#FAFAFA", gray100: "#F4F4F5",
    gray200: "#E4E4E7", gray500: "#71717A", gray600: "#52525B",
    gray700: "#3F3F46", gray900: "#18181B",
  };

  const getUrgencyColor = (u: string) => {
    if (u === "alta") return colors.error;
    if (u === "media") return colors.warning;
    return colors.success;
  };

  const getTimeAgo = (timestamp: any) => {
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      const diff = Math.floor((Date.now() - date.getTime()) / 3600000);
      if (diff < 1) return "Agora mesmo";
      if (diff < 24) return `Há ${diff} horas`;
      return `Há ${Math.floor(diff / 24)} dias`;
    } catch { return "Recentemente"; }
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      alimentacao: "?? Alimentação", moradia: "?? Moradia",
      saude: "?? Saúde", educacao: "?? Educação",
      transporte: "?? Transporte", outros: "?? Outros"
    };
    return map[cat] || "?? Outros";
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!id) return;
        const snap = await getDoc(doc(firestore, "pedidosDeAjuda", id));
        if (snap.exists()) {
          setPedido({ id: snap.id, ...snap.data() } as HelpRequest);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleOffer = async () => {
    if (!user) {
      history.push("/login");
      return;
    }
    if (!pedido) return;
    if (user.uid === pedido.requesterId) {
      setAlertMsg({ header: "Ação não permitida", message: "Você não pode oferecer ajuda no seu próprio pedido." });
      setShowAlert(true);
      return;
    }
    if (pedido.ajudasRecebidas?.includes(user.uid)) {
      setAlertMsg({ header: "Já registrado", message: "Você já ofereceu ajuda para este pedido." });
      setShowAlert(true);
      return;
    }

    try {
      setOffering(true);
      await updateDoc(doc(firestore, "pedidosDeAjuda", pedido.id), {
        ajudasRecebidas: arrayUnion(user.uid),
        status: "em_andamento",
      });
      setPedido((prev) => prev ? {
        ...prev,
        ajudasRecebidas: [...prev.ajudasRecebidas, user.uid],
        status: "em_andamento"
      } : prev);
      setToastMsg("? Ajuda registrada com sucesso!");
      setShowToast(true);
    } catch (e) {
      setToastMsg("Erro ao registrar ajuda. Tente novamente.");
      setShowToast(true);
    } finally {
      setOffering(false);
    }
  };

  const handleShare = () => {
    if (navigator.share && pedido) {
      navigator.share({ title: pedido.titulo, text: pedido.descricao, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMsg("?? Link copiado!");
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-text-center ion-padding">
          <IonSpinner name="crescent" style={{ marginTop: "40vh", color: colors.primary }} />
        </IonContent>
      </IonPage>
    );
  }

  if (!pedido) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start"><IonBackButton defaultHref="/support" /></IonButtons>
            <IonTitle>Não encontrado</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <div style={{ padding: "60px 20px" }}>
            <div style={{ fontSize: "3rem" }}>??</div>
            <h3 style={{ color: colors.gray700 }}>Pedido não encontrado</h3>
            <IonButton onClick={() => history.push("/support")} style={{ "--background": colors.primary, marginTop: "20px" }}>
              Ver outros pedidos
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const isRequester = user?.uid === pedido.requesterId;
  const hasHelped = pedido.ajudasRecebidas?.includes(user?.uid || "");

  return (
    <IonPage>
      <IonHeader style={{ borderBottom: `1px solid ${colors.gray200}` }}>
        <IonToolbar style={{ "--background": colors.white }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/support" style={{ "--color": colors.primary }} />
          </IonButtons>
          <IonTitle style={{ color: colors.primary, fontWeight: "700" }}>Detalhes do Pedido</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleShare} style={{ "--color": colors.primary }}>
              <IonIcon icon={shareOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ "--background": colors.gray50 }}>

        {/* Imagem */}
        {pedido.photoURL && (
          <img src={pedido.photoURL} alt={pedido.titulo} style={{ width: "100%", height: "220px", objectFit: "cover" }} />
        )}

        <div style={{ padding: "20px" }}>

          {/* Título e urgência */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <h1 style={{ fontSize: "1.4rem", fontWeight: "700", color: colors.gray900, margin: 0, flex: 1, marginRight: "12px" }}>
              {pedido.titulo}
            </h1>
            <span style={{
              background: getUrgencyColor(pedido.urgencia), color: colors.white,
              padding: "6px 12px", borderRadius: "10px", fontSize: "0.8rem", fontWeight: "600", whiteSpace: "nowrap"
            }}>
              {pedido.urgencia === "alta" ? "?? Alta" : pedido.urgencia === "media" ? "?? Média" : "?? Baixa"}
            </span>
          </div>

          {/* Meta */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
            <IonChip style={{ background: colors.gray100, color: colors.gray700 }}>
              {getCategoryLabel(pedido.categoria)}
            </IonChip>
            <IonChip style={{ background: colors.gray100, color: colors.gray500, fontSize: "0.8rem" }}>
              ?? {getTimeAgo(pedido.createdAt)}
            </IonChip>
            <IonChip style={{
              background: pedido.status === "resolvido" ? colors.success : pedido.status === "em_andamento" ? colors.warning : colors.gray100,
              color: pedido.status === "aberto" ? colors.gray600 : colors.white
            }}>
              {pedido.status === "resolvido" ? "? Resolvido" : pedido.status === "em_andamento" ? "?? Em andamento" : "? Aberto"}
            </IonChip>
          </div>

          {/* Descrição */}
          <div style={{ background: colors.white, borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: colors.gray600, fontSize: "0.85rem", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase" }}>Descrição</h3>
            <p style={{ color: colors.gray700, lineHeight: "1.6", margin: 0 }}>{pedido.descricao}</p>
          </div>

          {/* Solicitante */}
          <div style={{ background: colors.white, borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: colors.gray600, fontSize: "0.85rem", fontWeight: "600", marginBottom: "12px", textTransform: "uppercase" }}>Solicitante</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: colors.white, fontWeight: "700", fontSize: "1.1rem"
              }}>
                {pedido.requesterName?.charAt(0) || "A"}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "600", color: colors.gray900 }}>{pedido.requesterName}</p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: colors.gray500 }}>
                  {pedido.ajudasRecebidas?.length || 0} pessoas ajudando
                </p>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <IonButton
              fill={isLiked ? "solid" : "outline"}
              style={{ "--border-color": colors.gray300, "--color": colors.error, flex: 1 }}
              onClick={() => setIsLiked(!isLiked)}
            >
              <IonIcon icon={isLiked ? heart : heartOutline} slot="start" />
              {isLiked ? "Curtido" : "Curtir"}
            </IonButton>

            {isRequester ? (
              <IonButton fill="solid" disabled style={{ flex: 2, "--background": colors.gray500 }}>
                Seu pedido
              </IonButton>
            ) : hasHelped ? (
              <IonButton fill="solid" disabled style={{ flex: 2, "--background": colors.success }}>
                <IonIcon icon={checkmarkCircleOutline} slot="start" />
                Já ajudando
              </IonButton>
            ) : (
              <IonButton
                fill="solid"
                style={{ flex: 2, "--background": `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})` }}
                onClick={handleOffer}
                disabled={offering}
              >
                {offering
                  ? <IonSpinner name="crescent" />
                  : <><IonIcon icon={checkmarkCircleOutline} slot="start" /> Oferecer Ajuda</>
                }
              </IonButton>
            )}
          </div>

          {/* Contato */}
          {pedido.contato && (
            <div style={{ display: "flex", gap: "12px" }}>
              <IonButton fill="outline" style={{ flex: 1, "--border-color": colors.success, "--color": colors.success }}
                onClick={() => window.location.href = `tel:${pedido.contato}`}>
                <IonIcon icon={callOutline} slot="start" /> Ligar
              </IonButton>
              <IonButton fill="outline" style={{ flex: 1, "--border-color": colors.primary, "--color": colors.primary }}
                onClick={() => window.open(`https://wa.me/55${pedido.contato}`, "_blank")}>
                <IonIcon icon={chatbubbleOutline} slot="start" /> WhatsApp
              </IonButton>
            </div>
          )}

        </div>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={alertMsg.header}
        message={alertMsg.message}
        buttons={["OK"]}
      />

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMsg}
        duration={3000}
        position="bottom"
      />
    </IonPage>
  );
};

export default RequestDetails;
