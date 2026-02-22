// packages/web/src/pages/RequestDetails/RequestDetails.tsx - VERSÃO CORRIGIDA
import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonSpinner,
  IonBadge,
  IonChip,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonAlert,
  IonToast
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { firestore, auth } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { 
  locationOutline, 
  timeOutline, 
  personCircleOutline, 
  heartOutline, 
  heart,
  shareOutline,
  checkmarkCircleOutline,
  callOutline,
  chatbubbleOutline,
  logInOutline
} from 'ionicons/icons';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface HelpRequest {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  urgencia: 'baixa' | 'media' | 'alta';
  photoURL?: string;
  requesterName?: string;
  requesterPhotoURL?: string;
  requesterId?: string;
  createdAt: any;
  localizacao?: string | Location;
  ajudasRecebidas?: string[];
  status?: 'pendente' | 'em_andamento' | 'resolvido';
  contato?: string;
}

interface AlertConfig {
  isOpen: boolean;
  header: string;
  message: string;
  buttons: any[];
}

const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Alertas configuráveis
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    isOpen: false,
    header: '',
    message: '',
    buttons: []
  });

  // CORES
  const colors = {
    primary: '#7C3AED',
    primaryLight: '#8B5CF6',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    white: '#FFFFFF',
    gray50: '#FAFAFA',
    gray100: '#F4F4F5',
    gray200: '#E4E4E7',
    gray300: '#D4D4D8',
    gray400: '#A1A1AA',
    gray500: '#71717A',
    gray600: '#52525B',
    gray700: '#3F3F46',
    gray800: '#27272A',
    gray900: '#18181B',
  };

  const gradients = {
    primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
    success: `linear-gradient(135deg, ${colors.success} 0%, #10B981 100%)`,
    warning: `linear-gradient(135deg, ${colors.warning} 0%, #F59E0B 100%)`,
    error: `linear-gradient(135deg, ${colors.error} 0%, #EF4444 100%)`,
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        if (!id) return;
        
        const requestDoc = doc(firestore, 'pedidosDeAjuda', id);
        const requestSnapshot = await getDoc(requestDoc);
        
        if (requestSnapshot.exists()) {
          const requestData = requestSnapshot.data() as HelpRequest;
          
          // SANITIZAÇÃO DOS DADOS
          const sanitizedRequest: HelpRequest = {
            ...requestData,
            id: requestSnapshot.id,
            requesterName: requestData.requesterName || 'Anônimo',
            titulo: requestData.titulo || 'Sem título',
            descricao: requestData.descricao || 'Sem descrição',
            categoria: requestData.categoria || 'outros',
            urgencia: requestData.urgencia || 'baixa',
            status: requestData.status || 'pendente',
            ajudasRecebidas: requestData.ajudasRecebidas || [],
            // Se localizacao for objeto, converte para string
            localizacao: typeof requestData.localizacao === 'string' 
              ? requestData.localizacao 
              : (requestData.localizacao as Location)?.address 
                ? (requestData.localizacao as Location).address
                : undefined,
          };
          
          console.log('✅ Dados sanitizados:', sanitizedRequest);
          setRequest(sanitizedRequest);
        } else {
          console.log('⚠️ Pedido não encontrado');
        }
      } catch (error) {
        console.error('❌ Erro ao buscar pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    // Verificar usuário atual
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('👤 Usuário logado:', user.uid);
        setCurrentUserId(user.uid);
      } else {
        console.log('👤 Usuário não logado');
        setCurrentUserId(null);
      }
    });

    fetchRequest();
    return () => unsubscribe();
  }, [id]);

  // Função segura para formatar localização
  const getFormattedLocation = (localizacao?: string | Location): string | null => {
    try {
      if (!localizacao) return null;
      
      if (typeof localizacao === 'string') {
        return localizacao;
      }
      
      if (typeof localizacao === 'object' && localizacao !== null) {
        // Se for objeto Location, tenta pegar o address
        if ('address' in localizacao && localizacao.address) {
          return localizacao.address;
        }
        // Ou formata coordenadas
        if ('latitude' in localizacao && 'longitude' in localizacao) {
          return `${localizacao.latitude.toFixed(4)}, ${localizacao.longitude.toFixed(4)}`;
        }
      }
      
      return null;
    } catch (error) {
      console.warn('⚠️ Erro ao formatar localização:', error);
      return null;
    }
  };

  // FUNÇÃO handleHelp CORRIGIDA - REMOVENDO updatedAt
  const handleHelp = async () => {
    console.log('🔄 Iniciando processo de ajuda...');
    
    // Verificação 1: Dados básicos existem
    if (!request) {
      console.error('❌ Pedido não encontrado');
      setAlertConfig({
        isOpen: true,
        header: 'Erro',
        message: 'Pedido não encontrado.',
        buttons: ['OK']
      });
      return;
    }
    
    // Verificação 2: Usuário está logado
    if (!currentUserId) {
      console.warn('⚠️ Usuário não está logado');
      
      setAlertConfig({
        isOpen: true,
        header: 'Login Necessário',
        message: 'Você precisa fazer login para oferecer ajuda.',
        buttons: [
          {
            text: 'Fazer Login',
            handler: () => {
              history.push('/login', { 
                from: `/pedido/${request.id}`,
                message: 'Faça login para ajudar neste pedido'
              });
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel'
          }
        ]
      });
      return;
    }

    // Verificação 3: Usuário não é o solicitante
    if (currentUserId === request.requesterId) {
      console.warn('⚠️ Usuário tentando ajudar no próprio pedido');
      
      setAlertConfig({
        isOpen: true,
        header: 'Ação não permitida',
        message: 'Você não pode oferecer ajuda no seu próprio pedido.',
        buttons: ['OK']
      });
      return;
    }

    // Verificação 4: Usuário já ajudou
    const currentHelps = request.ajudasRecebidas || [];
    if (currentHelps.includes(currentUserId)) {
      console.warn('⚠️ Usuário já ajudou neste pedido');
      
      setAlertConfig({
        isOpen: true,
        header: 'Você já está ajudando',
        message: 'Você já ofereceu ajuda para este pedido.',
        buttons: ['OK']
      });
      return;
    }

    // Verificação 5: Pedido já resolvido
    if (request.status === 'resolvido') {
      console.warn('⚠️ Pedido já foi resolvido');
      
      setAlertConfig({
        isOpen: true,
        header: 'Pedido Resolvido',
        message: 'Este pedido já foi marcado como resolvido.',
        buttons: ['OK']
      });
      return;
    }

    try {
      console.log('📝 Preparando dados para atualização...');
      
      const requestRef = doc(firestore, 'pedidosDeAjuda', request.id);
      
      // Dados que serão atualizados - APENAS 2 CAMPOS (como exigem as regras)
      const updateData = {
        ajudasRecebidas: arrayUnion(currentUserId),
        status: 'em_andamento'
        // REMOVIDO: updatedAt - não é permitido pelas regras atuais
      };
      
      console.log('📤 Enviando atualização para Firestore:', {
        pedidoId: request.id,
        usuarioId: currentUserId,
        dados: updateData
      });

      // Atualizar o documento
      await updateDoc(requestRef, updateData);
      
      console.log('✅ Pedido atualizado com sucesso!');

      // Mostrar toast de sucesso
      setToastMessage('✅ Sua ajuda foi registrada com sucesso!');
      setShowToast(true);

      // Atualizar estado local imediatamente (para UX)
      setRequest(prev => prev ? {
        ...prev,
        ajudasRecebidas: [...currentHelps, currentUserId],
        status: 'em_andamento'
      } : null);

      // Se houver contato, oferecer opção de contato após 1 segundo
      if (request.contato) {
        setTimeout(() => {
          setAlertConfig({
            isOpen: true,
            header: 'Contatar Solicitante',
            message: 'Deseja entrar em contato com o solicitante?',
            buttons: [
              {
                text: 'Ligar',
                handler: () => {
                  window.location.href = `tel:${request!.contato}`;
                }
              },
              {
                text: 'WhatsApp',
                handler: () => {
                  window.open(`https://wa.me/55${request!.contato}`, '_blank');
                }
              },
              {
                text: 'Não agora',
                role: 'cancel'
              }
            ]
          });
        }, 1000);
      }

    } catch (error: any) {
      console.error('❌ Erro ao oferecer ajuda:', error);
      console.error('❌ Código do erro:', error.code);
      console.error('❌ Mensagem:', error.message);
      
      // Tratamento específico por tipo de erro
      let errorMessage = 'Não foi possível registrar sua ajuda. Tente novamente.';
      let errorHeader = 'Erro ao Ajudar';
      
      if (error.code === 'permission-denied') {
        errorHeader = 'Permissão Negada 🔒';
        errorMessage = `Seu pedido foi bloqueado pelas regras de segurança.\n\nSoluções:\n1. Certifique-se de que o campo "ajudasRecebidas" existe no documento (pode ser array vazio [])\n2. Use regras simplificadas durante o desenvolvimento\n3. Verifique se está enviando APENAS os campos: ajudasRecebidas e status`;
        console.error('🔒 Erro de permissão. Verifique regras do Firestore.');
      } else if (error.code === 'not-found') {
        errorMessage = 'Pedido não encontrado. Pode ter sido removido.';
      } else if (error.code === 'failed-precondition') {
        errorMessage = 'O pedido foi modificado. Recarregue a página e tente novamente.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Serviço indisponível. Verifique sua conexão com a internet.';
      }
      
      setAlertConfig({
        isOpen: true,
        header: errorHeader,
        message: errorMessage,
        buttons: [
          {
            text: 'Ver Regras Atuais',
            handler: () => {
              navigator.clipboard.writeText(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pedidosDeAjuda/{requestId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.requesterId ||
        (
          request.auth.uid != resource.data.requesterId &&
          (
            request.resource.data.ajudasRecebidas != null ||
            request.resource.data.status != null
          )
        )
      );
      allow delete: if request.auth != null && 
                     request.auth.uid == resource.data.requesterId;
    }
  }
}`);
              alert('Regras copiadas para a área de transferência!\nCole no Firebase Console → Firestore → Rules');
            }
          },
          {
            text: 'Recarregar Página',
            handler: () => {
              window.location.reload();
            }
          },
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'alta': return colors.error;
      case 'media': return colors.warning;
      case 'baixa': return colors.success;
      default: return colors.gray400;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch(urgency) {
      case 'alta': return 'Alta Urgência';
      case 'media': return 'Média Urgência';
      case 'baixa': return 'Baixa Urgência';
      default: return 'Urgência';
    }
  };

  const getCategoryIcon = (categoria: string) => {
    const icons: { [key: string]: string } = {
      alimentacao: '🍎',
      moradia: '🏠',
      saude: '🏥',
      educacao: '📚',
      transporte: '🚗',
      outros: '🔧'
    };
    return icons[categoria] || '🙏';
  };

  const getCategoryName = (categoria: string) => {
    const names: { [key: string]: string } = {
      alimentacao: 'Alimentação',
      moradia: 'Moradia',
      saude: 'Saúde',
      educacao: 'Educação',
      transporte: 'Transporte',
      outros: 'Outros'
    };
    return names[categoria] || 'Outros';
  };

  const getTimeAgo = (timestamp: any) => {
    try {
      let date: Date;
      
      // Se for Timestamp do Firestore
      if (timestamp && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } 
      // Se já for Date
      else if (timestamp instanceof Date) {
        date = timestamp;
      }
      // Se for string
      else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      }
      // Se for objeto com seconds/nanoseconds
      else if (timestamp && typeof timestamp === 'object' && timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      }
      else {
        return 'Data desconhecida';
      }
      
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Agora mesmo';
      if (diffInHours < 24) return `Há ${diffInHours} horas`;
      if (diffInHours < 168) return `Há ${Math.floor(diffInHours / 24)} dias`;
      return `Há ${Math.floor(diffInHours / 168)} semanas`;
    } catch (error) {
      console.warn('⚠️ Erro ao calcular tempo:', error);
      return 'Recentemente';
    }
  };

  const handleShare = () => {
    if (navigator.share && request) {
      navigator.share({
        title: `Ajuda: ${request.titulo}`,
        text: request.descricao,
        url: window.location.href,
      });
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('📋 Link copiado para a área de transferência!');
      setShowToast(true);
    }
  };

  const handleContact = () => {
    if (request?.contato) {
      window.location.href = `tel:${request.contato}`;
    } else {
      setToastMessage('📞 Contato não disponível');
      setShowToast(true);
    }
  };

  const isRequester = currentUserId === request?.requesterId;
  const hasHelped = request?.ajudasRecebidas?.includes(currentUserId || '');
  const canHelp = !isRequester && !hasHelped && currentUserId;

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/feed" />
            </IonButtons>
            <IonTitle>Carregando...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <IonSpinner name="crescent" style={{ width: '48px', height: '48px', color: colors.primary }} />
            <p style={{ color: colors.gray500, fontSize: '0.9rem' }}>Carregando detalhes do pedido...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!request) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/feed" />
            </IonButtons>
            <IonTitle>Pedido não encontrado</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: colors.gray500
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😔</div>
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: colors.gray700
            }}>
              Pedido não encontrado
            </h3>
            <p style={{ color: colors.gray500, marginBottom: '24px' }}>
              O pedido que você está procurando não existe ou foi removido.
            </p>
            <IonButton 
              fill="solid" 
              style={{ 
                marginTop: '20px',
                '--background': colors.primary,
                '--background-activated': colors.primaryLight
              }}
              onClick={() => history.push('/tabs/feed')}
            >
              Voltar para o Feed
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Obter localização formatada de forma segura
  const formattedLocation = getFormattedLocation(request.localizacao);

  return (
    <IonPage>
      <IonHeader style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${colors.gray200}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <IonToolbar style={{ '--background': 'transparent' }}>
          <IonButtons slot="start">
            <IonBackButton 
              defaultHref="/tabs/feed" 
              style={{ '--color': colors.primary }}
            />
          </IonButtons>
          <IonTitle>
            <div style={{
              display: 'flex',
              alignItems: 'center', 
              gap: '12px',
              fontWeight: '600',
              color: colors.primary,
              fontSize: '1rem'
            }}>
              <div style={{
                width: '28px',
                height: '28px', 
                background: gradients.primary,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.white,
                fontWeight: '700',
                fontSize: '12px'
              }}>
                AJ
              </div>
              <span>Detalhes do Pedido</span>
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleShare} style={{ '--color': colors.primary }}>
              <IonIcon icon={shareOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': colors.gray50 }}>
        {/* IMAGEM PRINCIPAL */}
        {request.photoURL && (
          <div style={{
            height: '250px',
            width: '100%',
            position: 'relative'
          }}>
            <img 
              src={request.photoURL} 
              alt={request.titulo}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div style={{ padding: '20px' }}>
          {/* CABEÇALHO */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: colors.gray900,
                  margin: '0 0 8px 0',
                  lineHeight: '1.3'
                }}>
                  {request.titulo}
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <IonIcon icon={timeOutline} style={{ 
                      fontSize: '16px', 
                      color: colors.gray500 
                    }} />
                    <span style={{
                      fontSize: '0.9rem',
                      color: colors.gray600
                    }}>
                      {getTimeAgo(request.createdAt)}
                    </span>
                  </div>
                  
                  {formattedLocation && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <IonIcon icon={locationOutline} style={{ 
                        fontSize: '16px', 
                        color: colors.gray500 
                      }} />
                      <span style={{
                        fontSize: '0.9rem',
                        color: colors.gray600
                      }}>
                        {formattedLocation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{
                background: getUrgencyColor(request.urgencia),
                color: colors.white,
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {request.urgencia}
              </div>
            </div>

            {/* CATEGORIA E STATUS */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <IonChip style={{
                background: colors.gray100,
                color: colors.gray700,
                fontWeight: '500'
              }}>
                <span style={{ marginRight: '4px' }}>
                  {getCategoryIcon(request.categoria)}
                </span>
                {getCategoryName(request.categoria)}
              </IonChip>
              
              {request.status && (
                <IonChip style={{
                  background: request.status === 'resolvido' ? colors.success : 
                            request.status === 'em_andamento' ? colors.warning : 
                            colors.gray200,
                  color: request.status === 'resolvido' ? colors.white : 
                        request.status === 'em_andamento' ? colors.gray900 : 
                        colors.gray700,
                  fontWeight: '500'
                }}>
                  {request.status === 'resolvido' ? '✅ Resolvido' :
                   request.status === 'em_andamento' ? '🔄 Em andamento' :
                   '⏳ Pendente'}
                </IonChip>
              )}
            </div>
          </div>

          {/* DESCRIÇÃO */}
          <IonCard style={{
            background: colors.white,
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            marginBottom: '24px'
          }}>
            <IonCardHeader>
              <IonCardSubtitle style={{ 
                color: colors.gray600,
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Descrição
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p style={{
                color: colors.gray700,
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0,
                whiteSpace: 'pre-line'
              }}>
                {request.descricao}
              </p>
            </IonCardContent>
          </IonCard>

          {/* INFORMAÇÕES DO SOLICITANTE */}
          <IonCard style={{
            background: colors.white,
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            marginBottom: '24px'
          }}>
            <IonCardHeader>
              <IonCardSubtitle style={{ 
                color: colors.gray600,
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Solicitante
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {request.requesterPhotoURL ? (
                  <img 
                    src={request.requesterPhotoURL} 
                    alt={request.requesterName}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div style="
                          width: 56px;
                          height: 56px;
                          background: ${gradients.primary};
                          border-radius: 50%;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: white;
                          font-size: 1.2rem;
                          font-weight: 600;
                        ">
                          ${request.requesterName?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <h3 style="
                            font-size: 1.1rem;
                            font-weight: 600;
                            color: ${colors.gray900};
                            margin: 0 0 4px 0;
                          ">
                            ${request.requesterName}
                          </h3>
                          <p style="
                            color: ${colors.gray500};
                            font-size: 0.9rem;
                            margin: 0;
                          ">
                            Precisa de ajuda
                          </p>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: gradients.primary,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.white,
                    fontSize: '1.2rem',
                    fontWeight: '600'
                  }}>
                    {request.requesterName?.charAt(0) || 'A'}
                  </div>
                )}
                
                <div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: colors.gray900,
                    margin: '0 0 4px 0'
                  }}>
                    {request.requesterName}
                  </h3>
                  <p style={{
                    color: colors.gray500,
                    fontSize: '0.9rem',
                    margin: 0
                  }}>
                    Precisa de ajuda
                  </p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* ESTATÍSTICAS */}
          <IonCard style={{
            background: colors.white,
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            marginBottom: '24px'
          }}>
            <IonCardHeader>
              <IonCardSubtitle style={{ 
                color: colors.gray600,
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Estatísticas
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-around',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: colors.primary,
                    marginBottom: '4px'
                  }}>
                    {request.ajudasRecebidas?.length || 0}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: colors.gray600
                  }}>
                    Ajudas
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: getUrgencyColor(request.urgencia),
                    marginBottom: '4px'
                  }}>
                    {getUrgencyText(request.urgencia)}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: colors.gray600
                  }}>
                    Prioridade
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* BOTÕES DE AÇÃO */}
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <IonButton 
                fill={isLiked ? 'solid' : 'outline'}
                style={{
                  flex: 1,
                  '--border-color': colors.gray300,
                  '--color': isLiked ? colors.error : colors.gray600,
                  '--background': isLiked ? colors.error : 'transparent'
                }}
                onClick={() => setIsLiked(!isLiked)}
              >
                <IonIcon 
                  icon={isLiked ? heart : heartOutline} 
                  slot="start"
                  style={{ color: isLiked ? colors.white : colors.error }}
                />
                {isLiked ? 'Curtido' : 'Curtir'}
              </IonButton>
              
              {canHelp ? (
                <IonButton 
                  fill="solid"
                  style={{
                    flex: 2,
                    '--background': gradients.primary,
                    '--background-activated': colors.primaryLight,
                    fontWeight: '600'
                  }}
                  onClick={handleHelp}
                >
                  <IonIcon icon={checkmarkCircleOutline} slot="start" />
                  Oferecer Ajuda
                </IonButton>
              ) : !currentUserId ? (
                <IonButton 
                  fill="solid"
                  style={{
                    flex: 2,
                    '--background': colors.warning,
                    '--background-activated': '#F59E0B',
                    fontWeight: '600'
                  }}
                  onClick={() => {
                    history.push('/login', { 
                      from: `/pedido/${request.id}`,
                      message: 'Faça login para ajudar'
                    });
                  }}
                >
                  <IonIcon icon={logInOutline} slot="start" />
                  Login para Ajudar
                </IonButton>
              ) : hasHelped ? (
                <IonButton 
                  fill="solid"
                  style={{
                    flex: 2,
                    '--background': colors.success,
                    '--background-activated': '#10B981',
                    fontWeight: '600'
                  }}
                  disabled
                >
                  <IonIcon icon={checkmarkCircleOutline} slot="start" />
                  Já está ajudando
                </IonButton>
              ) : isRequester ? (
                <IonButton 
                  fill="solid"
                  style={{
                    flex: 2,
                    '--background': colors.gray600,
                    '--background-activated': colors.gray700,
                    fontWeight: '600'
                  }}
                  disabled
                >
                  <IonIcon icon={personCircleOutline} slot="start" />
                  Seu pedido
                </IonButton>
              ) : null}
            </div>

            {request.contato && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <IonButton 
                  fill="outline"
                  style={{
                    flex: 1,
                    '--border-color': colors.success,
                    '--color': colors.success
                  }}
                  onClick={handleContact}
                >
                  <IonIcon icon={callOutline} slot="start" />
                  Ligar
                </IonButton>
                
                <IonButton 
                  fill="outline"
                  style={{
                    flex: 1,
                    '--border-color': colors.primary,
                    '--color': colors.primary
                  }}
                  onClick={() => {
                    if (request.contato) {
                      window.open(`https://wa.me/55${request.contato}`, '_blank');
                    }
                  }}
                >
                  <IonIcon icon={chatbubbleOutline} slot="start" />
                  WhatsApp
                </IonButton>
              </div>
            )}
          </div>
        </div>
      </IonContent>

      {/* ALERTA CONFIGURÁVEL */}
      <IonAlert
        isOpen={alertConfig.isOpen}
        onDidDismiss={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        header={alertConfig.header}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
      />

      {/* TOAST PARA MENSAGENS RÁPIDAS */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="bottom"
        color="primary"
      />
    </IonPage>
  );
};

export default RequestDetailsPage;