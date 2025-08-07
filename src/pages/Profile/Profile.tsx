import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonBadge,
  useIonViewWillEnter,
  IonSpinner,
  IonButtons,
  IonBackButton,
  IonAlert,
  useIonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { logOutOutline, personCircleOutline, documentTextOutline, heartOutline, trashOutline } from 'ionicons/icons';

// Importações do Firebase
import { db, auth } from '../../firebase/firebaseConfig';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

// Interface (em inglês) para uma pré-visualização do pedido
interface RequestPreview {
  id: string;
  titulo: string;
  status: 'aberto' | 'em_atendimento' | 'concluido';
}

const ProfilePage: React.FC = () => {
  const history = useHistory();
  const user = auth.currentUser;
  const [presentToast] = useIonToast();

  // Variáveis de estado (em inglês)
  const [myRequests, setMyRequests] = useState<RequestPreview[]>([]); // Lista dos pedidos do utilizador
  const [myHelps, setMyHelps] = useState<RequestPreview[]>([]); // Lista das ajudas oferecidas pelo utilizador
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState<{isOpen: boolean, requestId: string | null}>({isOpen: false, requestId: null});

  // Função para buscar todos os dados do perfil
  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // 1. Busca os pedidos criados pelo utilizador (onde userId é igual ao ID do utilizador atual)
      const requestsQuery = query(collection(db, "pedidosDeAjuda"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
      const requestsSnapshot = await getDocs(requestsQuery);
      const requestsList = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RequestPreview));
      setMyRequests(requestsList);

      // 2. Busca as ajudas oferecidas pelo utilizador (onde helperId é igual ao ID do utilizador atual)
      const helpsQuery = query(collection(db, "pedidosDeAjuda"), where("helperId", "==", user.uid), orderBy("createdAt", "desc"));
      const helpsSnapshot = await getDocs(helpsQuery);
      const helpsList = helpsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RequestPreview));
      setMyHelps(helpsList);
    } catch (error) {
      console.error("Error fetching profile data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Hook do Ionic para executar a busca de dados sempre que a página de perfil é exibida
  useIonViewWillEnter(() => {
    fetchData();
  });

  // Função para terminar a sessão do utilizador
  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.replace('/login'); // Redireciona para a página de login
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  // Função para cancelar (apagar) um pedido de ajuda
  const handleCancelRequest = async (requestId: string) => {
    try {
      // Apaga o documento do Firebase
      await deleteDoc(doc(db, "pedidosDeAjuda", requestId));
      // Remove o pedido da lista local para atualizar a interface imediatamente
      setMyRequests(prevRequests => prevRequests.filter(p => p.id !== requestId));
      presentToast({ message: 'Pedido cancelado com sucesso.', duration: 2000, color: 'success' });
    } catch (error) {
      console.error("Error canceling request: ", error);
      presentToast({ message: 'Ocorreu um erro ao cancelar o pedido.', duration: 3000, color: 'danger' });
    }
  };

  // Função para devolver uma cor com base no status do pedido
  const getStatusColor = (status: string) => {
    if (status === 'aberto') return 'success';
    if (status === 'em_atendimento') return 'warning';
    if (status === 'concluido') return 'medium';
    return 'primary';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Meu Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="ion-text-center">
              <IonIcon icon={personCircleOutline} style={{ fontSize: '4rem', verticalAlign: 'middle' }} />
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {user ? (
              <IonItem lines="none" className="ion-text-center">
                <IonLabel>
                  <h2>Bem-vindo(a)!</h2>
                  <p>{user.email}</p>
                </IonLabel>
              </IonItem>
            ) : null}
            <IonButton expand="block" color="danger" onClick={handleLogout} className="ion-margin-top">
              <IonIcon slot="start" icon={logOutOutline} />
              Terminar Sessão (Logout)
            </IonButton>
          </IonCardContent>
        </IonCard>

        {loading ? ( <div className="ion-text-center" style={{ marginTop: '20px' }}><IonSpinner /></div> ) : (
          <>
            <IonList>
              <IonListHeader>
                <IonLabel color="primary"><IonIcon icon={documentTextOutline} /> Meus Pedidos de Ajuda</IonLabel>
              </IonListHeader>
              {myRequests.length > 0 ? (
                myRequests.map(request => (
                  <IonItem key={request.id} routerLink={`/pedido/${request.id}`} detail={true}>
                    <IonLabel>{request.titulo}</IonLabel>
                    <IonBadge color={getStatusColor(request.status)} slot="end">
                      {(request.status || '').replace('_', ' ')}
                    </IonBadge>
                    {/* Botão de cancelar só aparece se o pedido estiver "aberto" */}
                    {request.status === 'aberto' && (
                      <IonButton fill="clear" color="danger" slot="end" onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        setShowAlert({isOpen: true, requestId: request.id});
                      }}>
                        <IonIcon icon={trashOutline} />
                      </IonButton>
                    )}
                  </IonItem>
                ))
              ) : ( <IonItem lines="none"><IonLabel className="ion-text-wrap">Você ainda não fez nenhum pedido de ajuda.</IonLabel></IonItem> )}
            </IonList>

            <IonList className="ion-margin-top">
              <IonListHeader>
                <IonLabel color="primary"><IonIcon icon={heartOutline} /> Ajudas que Ofereci</IonLabel>
              </IonListHeader>
              {myHelps.length > 0 ? (
                myHelps.map(request => (
                  <IonItem key={request.id} routerLink={`/pedido/${request.id}`} detail>
                    <IonLabel>{request.titulo}</IonLabel>
                    <IonBadge color={getStatusColor(request.status)} slot="end">
                      {(request.status || '').replace('_', ' ')}
                    </IonBadge>
                  </IonItem>
                ))
              ) : ( <IonItem lines="none"><IonLabel className="ion-text-wrap">Você ainda não ofereceu nenhuma ajuda.</IonLabel></IonItem> )}
            </IonList>
          </>
        )}
        
        <IonAlert
          isOpen={showAlert.isOpen}
          onDidDismiss={() => setShowAlert({isOpen: false, requestId: null})}
          header={'Confirmar Cancelamento'}
          message={'Tem a certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.'}
          buttons={[
            { text: 'Não', role: 'cancel' },
            { text: 'Sim, Cancelar', handler: () => { if(showAlert.requestId) { handleCancelRequest(showAlert.requestId); } } }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
