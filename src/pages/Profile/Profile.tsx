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

// Interface para definir a estrutura de um pedido 
interface Pedido {
    id: string;
    titulo: string;
    status: 'aberto' | 'em_atendimento' | 'concluido';
}

const Perfil: React.FC = () => {
    const history = useHistory();
    const user = auth.currentUser;
    const [presentToast] = useIonToast();

    const [meusPedidos, setMeusPedidos] = useState<Pedido[]>([]);
    const [minhasAjudas, setMinhasAjudas] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState<{ isOpen: boolean, pedidoId: string | null }>({ isOpen: false, pedidoId: null });

    const fetchData = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            // Busca os pedidos criados pelo utilizador 
            const pedidosQuery = query(collection(db, "pedidosDeAjuda"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
            const pedidosSnapshot = await getDocs(pedidosQuery);
            const pedidosList = pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pedido));
            setMeusPedidos(pedidosList);

            // Busca as ajudas oferecidas pelo utilizador 
            const ajudasQuery = query(collection(db, "pedidosDeAjuda"), where("helperId", "==", user.uid), orderBy("createdAt", "desc"));
            const ajudasSnapshot = await getDocs(ajudasQuery);
            const ajudasList = ajudasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pedido));
            setMinhasAjudas(ajudasList);
        } catch (error) {
            console.error("Erro ao buscar dados do perfil: ", error);
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
            console.error("Erro ao fazer logout: ", error);
        }
    };

    // Função para cancelar/apagar um pedido 
    const handleCancelRequest = async (pedidoId: string) => {
        try {
            // Apaga o documento do Firebase 
            await deleteDoc(doc(db, "pedidosDeAjuda", pedidoId));

            // Atualiza a lista na interface para dar feedback imediato 
            setMeusPedidos(prevPedidos => prevPedidos.filter(p => p.id !== pedidoId));

            presentToast({
                message: 'Pedido cancelado com sucesso.',
                duration: 2000,
                color: 'success'
            });
        } catch (error) {
            console.error("Erro ao cancelar o pedido: ", error);
            presentToast({
                message: 'Ocorreu um erro ao cancelar o pedido.',
                duration: 3000,
                color: 'danger'
            });
        }
    };

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
                        ) : (
                            <p className="ion-text-center">Não foi possível carregar os dados do utilizador.</p>
                        )}
                        <IonButton expand="block" color="danger" onClick={handleLogout} className="ion-margin-top">
                            <IonIcon slot="start" icon={logOutOutline} />
                            Terminar Sessão (Logout)
                        </IonButton>
                    </IonCardContent>
                </IonCard>

                {loading ? (
                    <div className="ion-text-center" style={{ marginTop: '20px' }}>
                        <IonSpinner />
                    </div>
                ) : (
                    <>
                        {/* Lista de Meus Pedidos */}
                        <IonList>
                            <IonListHeader>
                                <IonLabel color="primary">
                                    <IonIcon icon={documentTextOutline} /> Meus Pedidos de Ajuda
                                </IonLabel>
                            </IonListHeader>
                            {meusPedidos.length > 0 ? (
                                meusPedidos.map(pedido => (
                                    <IonItem key={pedido.id} routerLink={`/pedido/${pedido.id}`} detail={true}>
                                        <IonLabel>
                                            {pedido.titulo}
                                        </IonLabel>
                                        <IonBadge color={getStatusColor(pedido.status)} slot="end">
                                            {(pedido.status || '').replace('_', ' ')}
                                        </IonBadge>
                                        {/* Botão de cancelar, visível apenas para pedidos abertos */}
                                        {pedido.status === 'aberto' && (
                                            <IonButton fill="clear" color="danger" slot="end" onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setShowAlert({ isOpen: true, pedidoId: pedido.id });
                                            }}>
                                                <IonIcon icon={trashOutline} />
                                            </IonButton>
                                        )}
                                    </IonItem>
                                ))
                            ) : (
                                <IonItem lines="none">
                                    <IonLabel className="ion-text-wrap">Você ainda não fez nenhum pedido de ajuda.</IonLabel>
                                </IonItem>
                            )}
                        </IonList>

                        {/* Lista de Ajudas que Ofereci */}
                        <IonList className="ion-margin-top">
                            <IonListHeader>
                                <IonLabel color="primary">
                                    <IonIcon icon={heartOutline} /> Ajudas que Ofereci
                                </IonLabel>
                            </IonListHeader>
                            {minhasAjudas.length > 0 ? (
                                minhasAjudas.map(pedido => (
                                    <IonItem key={pedido.id} routerLink={`/pedido/${pedido.id}`} detail>
                                        <IonLabel>{pedido.titulo}</IonLabel>
                                        <IonBadge color={getStatusColor(pedido.status)} slot="end">
                                            {(pedido.status || '').replace('_', ' ')}
                                        </IonBadge>
                                    </IonItem>
                                ))
                            ) : (
                                <IonItem lines="none">
                                    <IonLabel className="ion-text-wrap">Você ainda não ofereceu nenhuma ajuda.</IonLabel>
                                </IonItem>
                            )}
                        </IonList>
                    </>
                )}

                {/* Alerta de confirmação para o cancelamento */}
                <IonAlert
                    isOpen={showAlert.isOpen}
                    onDidDismiss={() => setShowAlert({ isOpen: false, pedidoId: null })}
                    header={'Confirmar Cancelamento'}
                    message={'Tem a certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.'}
                    buttons={[
                        { text: 'Não', role: 'cancel' },
                        {
                            text: 'Sim, Cancelar', handler: () => {
                                if (showAlert.pedidoId) {
                                    handleCancelRequest(showAlert.pedidoId);
                                }
                            }
                        }
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default Perfil;