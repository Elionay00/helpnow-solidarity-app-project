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
import {
  logOutOutline,
  personCircleOutline,
  documentTextOutline,
  heartOutline,
  trashOutline,
} from 'ionicons/icons';

import { db, auth } from '../../firebase/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';

interface Pedido {
  id: string;
  titulo?: string;
  status?: 'aberto' | 'em_atendimento' | 'concluido';
}

const ProfileUser: React.FC = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [meusPedidos, setMeusPedidos] = useState<Pedido[]>([]);
  const [minhasAjudas, setMinhasAjudas] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState<{ isOpen: boolean; pedidoId: string | null }>({
    isOpen: false,
    pedidoId: null,
  });

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const pedidosQuery = query(
        collection(db, 'pedidosDeAjuda'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const pedidosSnapshot = await getDocs(pedidosQuery);
      const pedidosList: Pedido[] = pedidosSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          titulo: data.titulo || 'Sem título',
          status: data.status || 'aberto',
        };
      });
      setMeusPedidos(pedidosList);

      const ajudasQuery = query(
        collection(db, 'pedidosDeAjuda'),
        where('helperId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const ajudasSnapshot = await getDocs(ajudasQuery);
      const ajudasList: Pedido[] = ajudasSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          titulo: data.titulo || 'Sem título',
          status: data.status || 'aberto',
        };
      });
      setMinhasAjudas(ajudasList);
    } catch (error) {
      console.error('Erro ao buscar dados do perfil: ', error);
      presentToast({
        message: 'Erro ao carregar seus dados.',
        duration: 3000,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useIonViewWillEnter(() => {
    fetchData();
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.replace('/login');
    } catch (error) {
      console.error('Erro ao fazer logout: ', error);
    }
  };

  const handleCancelRequest = async (pedidoId: string) => {
    try {
      await deleteDoc(doc(db, 'pedidosDeAjuda', pedidoId));
      setMeusPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
      presentToast({
        message: 'Pedido cancelado com sucesso.',
        duration: 2000,
        color: 'success',
      });
    } catch (error) {
      console.error('Erro ao cancelar o pedido: ', error);
      presentToast({
        message: 'Ocorreu um erro ao cancelar o pedido.',
        duration: 3000,
        color: 'danger',
      });
    }
  };

  const getStatusColor = (status: string = 'aberto') => {
    if (status === 'aberto') return 'success';
    if (status === 'em_atendimento') return 'warning';
    if (status === 'concluido') return 'medium';
    return 'primary';
  };

  const user = auth.currentUser;

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
              <IonIcon
                icon={personCircleOutline}
                style={{ fontSize: '4rem', verticalAlign: 'middle' }}
              />
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
            ) : (
              <p className="ion-text-center">Não foi possível carregar os dados do utilizador.</p>
            )}
            <IonButton
              expand="block"
              color="danger"
              onClick={handleLogout}
              className="ion-margin-top"
            >
              <IonIcon slot="start" icon={logOutOutline} />
              Terminar Sessão (Logout)
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard className="ion-margin-top">
          <IonCardContent className="ion-text-center">
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Publicidade</p>
            <p>**Divulgue o seu serviço aqui!**</p>
            <IonButton expand="block" color="tertiary" size="small" href="#" className="ion-margin-top">
              Entre em Contato
            </IonButton>
          </IonCardContent>
        </IonCard>

        {loading ? (
          <div className="ion-text-center" style={{ marginTop: '20px' }}>
            <IonSpinner />
          </div>
        ) : (
          <>
            <IonList>
              <IonListHeader>
                <IonLabel color="primary">
                  <IonIcon icon={documentTextOutline} /> Meus Pedidos de Ajuda
                </IonLabel>
              </IonListHeader>
              {meusPedidos.length > 0 ? (
                meusPedidos.map((pedido) => (
                  <IonItem
                    key={pedido.id}
                    button
                    detail
                    onClick={() => history.push(`/pedido/${pedido.id}`)}
                  >
                    <IonLabel>{pedido.titulo}</IonLabel>
                    <IonBadge color={getStatusColor(pedido.status)} slot="end">
                      {(pedido.status || '').replace('_', ' ')}
                    </IonBadge>
                    {pedido.status === 'aberto' && (
                      <IonButton
                        fill="clear"
                        color="danger"
                        slot="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAlert({ isOpen: true, pedidoId: pedido.id });
                        }}
                      >
                        <IonIcon icon={trashOutline} />
                      </IonButton>
                    )}
                  </IonItem>
                ))
              ) : (
                <IonItem lines="none">
                  <IonLabel className="ion-text-wrap">
                    Você ainda não fez nenhum pedido de ajuda.
                  </IonLabel>
                </IonItem>
              )}
            </IonList>

            <IonList className="ion-margin-top">
              <IonListHeader>
                <IonLabel color="primary">
                  <IonIcon icon={heartOutline} /> Ajudas que Ofereci
                </IonLabel>
              </IonListHeader>
              {minhasAjudas.length > 0 ? (
                minhasAjudas.map((pedido) => (
                  <IonItem
                    key={pedido.id}
                    button
                    detail
                    onClick={() => history.push(`/pedido/${pedido.id}`)}
                  >
                    <IonLabel>{pedido.titulo}</IonLabel>
                    <IonBadge color={getStatusColor(pedido.status)} slot="end">
                      {(pedido.status || '').replace('_', ' ')}
                    </IonBadge>
                  </IonItem>
                ))
              ) : (
                <IonItem lines="none">
                  <IonLabel className="ion-text-wrap">
                    Você ainda não ofereceu nenhuma ajuda.
                  </IonLabel>
                </IonItem>
              )}
            </IonList>
          </>
        )}

        <IonAlert
          isOpen={showAlert.isOpen}
          onDidDismiss={() => setShowAlert({ isOpen: false, pedidoId: null })}
          header={'Confirmar Cancelamento'}
          message={'Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.'}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Confirmar',
              handler: () => {
                if (showAlert.pedidoId) {
                  handleCancelRequest(showAlert.pedidoId);
                }
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfileUser;git add .