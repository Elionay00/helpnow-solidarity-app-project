// src/pages/Profile/Profile.tsx - ATUALIZADO (APENAS UI)

import React from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon,
  IonItem, IonLabel, IonList, IonListHeader, IonBadge, IonSpinner,
  IonButtons, IonBackButton, IonAlert,
} from '@ionic/react';
import {
  logOutOutline, personCircleOutline, documentTextOutline, heartOutline,
  trashOutline, chatbubblesOutline, storefrontOutline, logoInstagram
} from 'ionicons/icons';
import { useProfileLogic } from './ProfileLogic'; // 1. Importar o hook com a lógica

const ProfilePage: React.FC = () => {
  // 2. Chamar o hook para obter todos os dados e funções necessárias
  const {
    user,
    myRequests,
    myHelps,
    loading,
    showAlert,
    setShowAlert,
    handleLogout,
    handleCancelRequest,
    getStatusColor,
  } = useProfileLogic();

  // 3. O resto do componente é apenas a interface (JSX)
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

        <IonList>
          <IonListHeader>
            <IonLabel color="primary">Navegação</IonLabel>
          </IonListHeader>
          <IonItem routerLink="/contact" detail={true}>
            <IonIcon icon={chatbubblesOutline} slot="start" color="primary" />
            <IonLabel>Chat Fale Conosco</IonLabel>
          </IonItem>
          <IonItem routerLink="/sponsors" detail={true}>
            <IonIcon icon={storefrontOutline} slot="start" color="primary" />
            <IonLabel>Lojas Parceiras</IonLabel>
          </IonItem>
          <IonItem href="https://www.instagram.com/ajudaja_oficial?igsh=cXB0bWhlOGdyZ2Y2" target="_blank" detail={true}>
            <IonIcon icon={logoInstagram} slot="start" color="primary" />
            <IonLabel>Nosso Instagram</IonLabel>
          </IonItem>
        </IonList>

        {loading ? (
          <div className="ion-text-center" style={{ marginTop: '20px' }}><IonSpinner /></div>
        ) : (
          <>
            <IonList className="ion-margin-top">
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
                    {request.status === 'aberto' && (
                      <IonButton fill="clear" color="danger" slot="end" onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        setShowAlert({ isOpen: true, requestId: request.id });
                      }}>
                        <IonIcon icon={trashOutline} />
                      </IonButton>
                    )}
                  </IonItem>
                ))
              ) : (
                <IonItem lines="none"><IonLabel className="ion-text-wrap">Você ainda não fez nenhum pedido de ajuda.</IonLabel></IonItem>
              )}
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
              ) : (
                <IonItem lines="none"><IonLabel className="ion-text-wrap">Você ainda não ofereceu nenhuma ajuda.</IonLabel></IonItem>
              )}
            </IonList>
          </>
        )}
        
        <IonAlert
          isOpen={showAlert.isOpen}
          onDidDismiss={() => setShowAlert({ isOpen: false, requestId: null })}
          header={'Confirmar Cancelamento'}
          message={'Tem a certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.'}
          buttons={[
            { text: 'Não', role: 'cancel' },
            { text: 'Sim, Cancelar', handler: () => { if (showAlert.requestId) { handleCancelRequest(showAlert.requestId); } } }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;