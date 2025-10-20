// /packages/_web/src/pages/Profile/Profile.tsx 

import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel,
  IonButton,
  IonSpinner,
  IonIcon,
  useIonToast // 1. IMPORTAR O HOOK DE TOAST
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { auth, firestore as db } from '../../firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
// 2. IMPORTAR 'updateDoc' e 'Timestamp'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'; 
// 3. IMPORTAR ÍCONE DE ESTRELA
import { logOutOutline, personCircleOutline, mailOutline, callOutline, briefcaseOutline, star } from 'ionicons/icons';

// 4. ATUALIZAR A INTERFACE
interface ProfileData {
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  isPremium: boolean; // Campo novo
  premiumExpiresAt: Timestamp | null; // Campo novo
}

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [presentToast] = useIonToast(); // 5. INICIAR O HOOK DE TOAST

  // useEffect (O mesmo de antes, está correto)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Usuário encontrado:', user.uid);
        const docRef = doc(db, "profissionais", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Os dados (incluindo isPremium) serão carregados aqui
          setProfileData(docSnap.data() as ProfileData);
        } else {
          console.error("Não foram encontrados dados no Firestore para este usuário!");
        }
      } else {
        console.log('Nenhum usuário logado. Redirecionando para login.');
        history.replace('/login');
      }
      setLoading(false); 
    });
    return () => unsubscribe();
  }, [history]);

  // handleLogout (O mesmo de antes, está correto)
  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.replace('/logout'); 
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // ---
  // 6. FUNÇÃO NOVA ADICIONADA AQUI
  // ---
  const handleUpgradePremium = async () => {
    const user = auth.currentUser;
    if (!user) {
      presentToast({ message: "Você precisa estar logado.", duration: 3000, color: "danger" });
      return;
    }

    // Define a data de expiração (30 dias a partir de hoje)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const expirationTimestamp = Timestamp.fromDate(expirationDate);

    const docRef = doc(db, "profissionais", user.uid);

    try {
      // 1. Atualiza no Firestore
      await updateDoc(docRef, {
        isPremium: true,
        premiumExpiresAt: expirationTimestamp
      });

      // 2. Atualiza o estado local (para a tela mudar na hora, sem recarregar)
      setProfileData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          isPremium: true,
          premiumExpiresAt: expirationTimestamp
        };
      });

      // 3. Mostra o alerta de sucesso
      presentToast({
        message: "Parabéns! Você agora é um Assinante Premium.",
        duration: 4000,
        color: "success",
      });

    } catch (error) {
      console.error("Erro ao atualizar para premium:", error);
      presentToast({
        message: "Erro ao tentar se tornar premium.",
        duration: 3000,
        color: "danger",
      });
    }
  };
  // --- FIM DA FUNÇÃO NOVA ---


  // Tela de Carregamento (A mesma de antes)
  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-text-center">
          <IonSpinner name="crescent" style={{ marginTop: '50%' }} />
        </IonContent>
      </IonPage>
    );
  }

  // ---
  // 7. ATUALIZAÇÃO NO VISUAL (JSX)
  // ---
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Meu Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {profileData && (
          <IonList>
            {/* Item Nome */}
            <IonItem>
              <IonIcon icon={personCircleOutline} slot="start" />
              <IonLabel>
                <h2>Nome</h2>
                <p>{profileData.nome}</p>
              </IonLabel>
            </IonItem>
            {/* Item Email */}
            <IonItem>
              <IonIcon icon={mailOutline} slot="start" />
              <IonLabel>
                <h2>Email</h2>
                <p>{profileData.email}</p>
              </IonLabel>
            </IonItem>
            {/* Item Telefone */}
            <IonItem>
              <IonIcon icon={callOutline} slot="start" />
              <IonLabel>
                <h2>Telefone</h2>
                <p>{profileData.telefone}</p>
              </IonLabel>
            </IonItem>
            {/* Item Especialidade */}
            <IonItem>
              <IonIcon icon={briefcaseOutline} slot="start" />
              <IonLabel>
                <h2>Especialidade</h2>
                <p style={{ textTransform: 'capitalize' }}>{profileData.especialidade}</p>
              </IonLabel>
            </IonItem>

            {/* --- ITEM DE STATUS PREMIUM ADICIONADO --- */}
            <IonItem lines="none">
              <IonIcon 
                icon={star} 
                slot="start" 
                color={profileData.isPremium ? "warning" : "medium"} // Cor do ícone
              />
              <IonLabel>
                <h2>Status da Conta</h2>
                <p>{profileData.isPremium ? "Profissional Premium" : "Conta Gratuita"}</p>
              </IonLabel>
              {profileData.isPremium && (
                <IonButton slot="end" size="small" fill="clear" color="warning">
                  👑
                </IonButton>
              )}
            </IonItem>
            {/* --- FIM DO ITEM DE STATUS --- */}

          </IonList>
        )}
        
        {/* --- BOTÃO DE UPGRADE CONDICIONAL ADICIONADO --- */}
        {profileData && !profileData.isPremium && (
          <IonButton 
            expand="block" 
            color="success" 
            onClick={handleUpgradePremium}
            style={{ marginTop: '20px', marginBottom: '10px' }}
          >
            <IonIcon icon={star} slot="start" />
            Testar Assinatura Premium (R$ 9,90)
          </IonButton>
        )}

        {/* Botão de Logout (existente) */}
        <IonButton expand="block" color="danger" onClick={handleLogout} style={{ marginTop: '10px' }}>
          <IonIcon icon={logOutOutline} slot="start" />
          Sair da Conta
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;