import React, { useState, useEffect } from "react";
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonButton, IonSpinner, IonIcon,
  useIonToast
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { firestore, auth, storage } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { cameraOutline, closeOutline, locationOutline } from "ionicons/icons";

const NeedHelp: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [urgencia, setUrgencia] = useState("media");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localizacao, setLocalizacao] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const colors = {
    primary: "#7C3AED", primaryLight: "#8B5CF6",
    success: "#059669", warning: "#D97706", error: "#DC2626",
    white: "#FFFFFF", gray50: "#FAFAFA", gray100: "#F4F4F5",
    gray200: "#E4E4E7", gray300: "#D4D4D8", gray400: "#A1A1AA",
    gray500: "#71717A", gray600: "#52525B", gray700: "#3F3F46",
    gray800: "#27272A", gray900: "#18181B",
  };

  const gradients = {
    primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
    success: `linear-gradient(135deg, ${colors.success} 0%, #10B981 100%)`,
  };

  const getUrgencyColor = (level: string) => {
    if (level === "alta") return colors.error;
    if (level === "media") return colors.warning;
    return colors.success;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      present({ message: "Geolocalização não suportada neste dispositivo.", duration: 3000, color: "warning" });
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const address = data.display_name?.split(",").slice(0, 3).join(", ") || "Localização obtida";
          setLocalizacao({ lat: latitude, lng: longitude, address });
          present({ message: "Localização capturada!", duration: 2000, color: "success" });
        } catch {
          setLocalizacao({ lat: latitude, lng: longitude, address: "Localização obtida" });
        }
        setGettingLocation(false);
      },
      () => {
        present({ message: "Não foi possivel obter sua localização.", duration: 3000, color: "warning" });
        setGettingLocation(false);
      }
    );
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) setPhoto(event.target.files[0]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      present({ message: "Voce precisa estar logado.", duration: 3000, color: "danger" });
      history.push("/login");
      return;
    }
    if (!titulo || !descricao || !categoria) {
      present({ message: "Preencha todos os campos obrigatarios.", duration: 3000, color: "warning" });
      return;
    }
    setIsSubmitting(true);
    try {
      let photoURL = "";
      if (photo) {
        const photoRef = ref(storage, `pedidosDeAjuda/${user.uid}/${Date.now()}_${photo.name}`);
        const snapshot = await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(snapshot.ref);
      }
      await addDoc(collection(firestore, "pedidosDeAjuda"), {
        titulo, descricao, categoria, urgencia, photoURL,
        requesterId: user.uid,
        requesterName: user.displayName || "Anonimo",
        requesterPhotoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
        status: "aberto",
        ajudasRecebidas: [],
        localizacao: localizacao ? {
          lat: localizacao.lat,
          lng: localizacao.lng,
          address: localizacao.address
        } : null,
      });
      present({ message: "Pedido enviado com sucesso!", duration: 2000, color: "success" });
      history.push("/support");
    } catch (error) {
      present({ message: "Erro ao enviar pedido. Tente novamente.", duration: 3000, color: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader style={{ borderBottom: `1px solid ${colors.gray200}` }}>
        <IonToolbar style={{ "--background": colors.white }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" style={{ "--color": colors.primary }} />
          </IonButtons>
          <IonTitle style={{ color: colors.primary, fontWeight: "700" }}>Pedir Ajuda</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ "--background": colors.gray50 }}>
        <div style={{ background: gradients.primary, color: colors.white, padding: "32px 20px", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "8px" }}>Precisa de Ajuda?</h1>
          <p style={{ opacity: 0.9 }}>Conte sua situação. Nossa comunidade esta aqui para voce.</p>
        </div>

        <div style={{ padding: "24px 16px", maxWidth: "600px", margin: "0 auto" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Titulo */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: colors.gray700 }}>Titulo *</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Preciso de alimentos para minha famalia" required
                style={{ width: "100%", padding: "14px 16px", border: `2px solid ${colors.gray300}`, borderRadius: "12px", fontSize: "16px", outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* Descrição */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: colors.gray700 }}>Descrição *</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva em detalhes o que voce precisa..." rows={4} required
                style={{ width: "100%", padding: "14px 16px", border: `2px solid ${colors.gray300}`, borderRadius: "12px", fontSize: "16px", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>

            {/* Categoria */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: colors.gray700 }}>Categoria *</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required
                style={{ width: "100%", padding: "14px 16px", border: `2px solid ${colors.gray300}`, borderRadius: "12px", fontSize: "16px", background: colors.white, outline: "none", boxSizing: "border-box" }}>
                <option value="" disabled>Selecione uma categoria</option>
                <option value="alimentacao">?? Alimentação</option>
                <option value="moradia">?? Moradia</option>
                <option value="saude">?? Saude</option>
                <option value="educacao">?? Educação</option>
                <option value="transporte">?? Transporte</option>
                <option value="outros">?? Outros</option>
              </select>
            </div>

            {/* Urgencia */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: colors.gray700 }}>Urgencia</label>
              <div style={{ display: "flex", gap: "12px" }}>
                {["baixa", "media", "alta"].map((level) => (
                  <button key={level} type="button" onClick={() => setUrgencia(level)}
                    style={{
                      flex: 1, padding: "12px",
                      border: `2px solid ${urgencia === level ? getUrgencyColor(level) : colors.gray300}`,
                      borderRadius: "12px",
                      background: urgencia === level ? getUrgencyColor(level) + "20" : colors.white,
                      color: urgencia === level ? getUrgencyColor(level) : colors.gray600,
                      fontWeight: "600", cursor: "pointer"
                    }}>
                    {level === "alta" ? "?? Alta" : level === "media" ? "?? Media" : "?? Baixa"}
                  </button>
                ))}
              </div>
            </div>

            {/* Localização */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: colors.gray700 }}>
                Localização (Opcional)
              </label>
              <button type="button" onClick={handleGetLocation} disabled={gettingLocation}
                style={{
                  width: "100%", padding: "14px 16px",
                  border: `2px solid ${localizacao ? colors.success : colors.gray300}`,
                  borderRadius: "12px", fontSize: "16px", cursor: "pointer",
                  background: localizacao ? colors.success + "10" : colors.white,
                  color: localizacao ? colors.success : colors.gray600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}>
                {gettingLocation
                  ? <><IonSpinner name="crescent" style={{ width: "20px", height: "20px" }} /> Obtendo localização...</>
                  : <><IonIcon icon={locationOutline} /> {localizacao ? localizacao.address : "Usar minha localização atual"}</>
                }
              </button>
            </div>

            {/* Foto */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: colors.gray700 }}>Foto (Opcional)</label>
              <div style={{ border: `2px dashed ${colors.gray300}`, borderRadius: "12px", padding: "24px", textAlign: "center", background: colors.gray50 }}>
                <input type="file" accept="image/*" onChange={handlePhotoChange} id="photo-upload" style={{ display: "none" }} />
                {photo ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: colors.gray700, fontSize: "14px" }}>{photo.name}</span>
                    <button type="button" onClick={() => setPhoto(null)}
                      style={{ background: colors.error, color: colors.white, border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer" }}>
                      <IonIcon icon={closeOutline} />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="photo-upload" style={{ cursor: "pointer" }}>
                    <IonIcon icon={cameraOutline} style={{ fontSize: "32px", color: colors.gray400 }} />
                    <div style={{ color: colors.gray600, fontWeight: "500", marginTop: "8px" }}>Clique para adicionar foto</div>
                  </label>
                )}
              </div>
            </div>

            {/* Botão */}
            <button type="submit" disabled={isSubmitting}
              style={{
                background: gradients.success, color: colors.white, border: "none",
                borderRadius: "12px", padding: "16px", fontWeight: "600", fontSize: "16px",
                cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
              }}>
              {isSubmitting ? <><IonSpinner name="crescent" style={{ color: colors.white }} /> Enviando...</> : "?? Enviar Pedido"}
            </button>

          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NeedHelp;
