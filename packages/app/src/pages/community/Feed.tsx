// packages/web/src/pages/Feed/Feed.tsx - VERSÃO COMPLETA ATUALIZADA
import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonButtons,
  IonBackButton,
  IonBadge,
  IonIcon,
  IonChip,
} from '@ionic/react';
import { firestore, auth } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore'; 
import { 
  heartOutline, 
  locationOutline, 
  timeOutline, 
  peopleOutline,
  heart,
  checkmarkCircleOutline,
  personCircleOutline
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
  createdAt: Timestamp;
  localizacao?: string | Location;
  ajudasRecebidas?: string[];
  status?: 'pendente' | 'em_andamento' | 'resolvido';
}

interface Partner {
  id: string;
  nome: string;
  logoUrl: string;
  siteUrl: string;
  descricao: string;
  status: 'active' | 'inactive';
}

const Feed: React.FC = () => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [likedRequests, setLikedRequests] = useState<Set<string>>(new Set());

  // CORES DEFINITIVAS
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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    const fetchAllData = async () => {
      try {
        // Buscar Pedidos
        const requestsCollection = collection(firestore, 'pedidosDeAjuda');
        const qReq = query(requestsCollection, orderBy('createdAt', 'desc'));
        const reqSnapshot = await getDocs(qReq);
        const requestsData = reqSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as HelpRequest[];
        
        // Sanitizar dados
        const safeRequestsData = requestsData.map(request => ({
          ...request,
          requesterName: request.requesterName || 'Anônimo',
          titulo: request.titulo || 'Sem título',
          descricao: request.descricao || 'Sem descrição',
          categoria: request.categoria || 'outros',
          urgencia: request.urgencia || 'baixa',
          status: request.status || 'pendente',
          ajudasRecebidas: request.ajudasRecebidas || [],
          localizacao: typeof request.localizacao === 'string' 
            ? request.localizacao 
            : (request.localizacao as Location)?.address 
              ? (request.localizacao as Location).address
              : undefined,
        }));
        
        setRequests(safeRequestsData);

        // Buscar Parceiros
        const partnersCollection = collection(firestore, 'parceiros');
        const qPar = query(partnersCollection, where('status', '==', 'active'));
        const parSnapshot = await getDocs(qPar);
        const partnersData = parSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Partner[];
        
        // Sanitizar dados dos parceiros
        const safePartnersData = partnersData.map(partner => ({
          ...partner,
          nome: partner.nome || 'Parceiro',
          logoUrl: partner.logoUrl || 'https://via.placeholder.com/40',
          siteUrl: partner.siteUrl || '#',
          descricao: partner.descricao || ''
        }));
        
        setPartners(safePartnersData);

      } catch (error) {
        console.error("❌ Erro ao buscar dados: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
    return () => unsubscribe();
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'alta': return colors.error;
      case 'media': return colors.warning;
      case 'baixa': return colors.success;
      default: return colors.gray400;
    }
  };

  const getUrgencyGradient = (urgency: string) => {
    switch(urgency) {
      case 'alta': return gradients.error;
      case 'media': return gradients.warning;
      case 'baixa': return gradients.success;
      default: return gradients.primary;
    }
  };

  const getTimeAgo = (timestamp: Timestamp) => {
    try {
      const now = new Date();
      const date = timestamp.toDate();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Agora mesmo';
      if (diffInHours < 24) return `Há ${diffInHours}h`;
      if (diffInHours < 168) return `Há ${Math.floor(diffInHours / 24)}d`;
      return `Há ${Math.floor(diffInHours / 168)}sem`;
    } catch (error) {
      return 'Recentemente';
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

  const filteredRequests = activeFilter === 'todos' 
    ? requests 
    : requests.filter(request => request.categoria === activeFilter);

  const categories = [
    { id: 'todos', name: 'Todos', icon: '🌐' },
    { id: 'alimentacao', name: 'Alimentação', icon: '🍎' },
    { id: 'moradia', name: 'Moradia', icon: '🏠' },
    { id: 'saude', name: 'Saúde', icon: '🏥' },
    { id: 'educacao', name: 'Educação', icon: '📚' },
    { id: 'transporte', name: 'Transporte', icon: '🚗' },
    { id: 'outros', name: 'Outros', icon: '🔧' },
  ];

  // Função segura para obter a primeira letra do nome
  const getRequesterInitial = (requesterName?: string): string => {
    try {
      if (!requesterName || typeof requesterName !== 'string') return 'A';
      const trimmedName = requesterName.trim();
      if (trimmedName === '') return 'A';
      return trimmedName.charAt(0).toUpperCase();
    } catch (error) {
      return 'A';
    }
  };

  // Função segura para formatar localização
  const getFormattedLocation = (localizacao?: string | Location): string | null => {
    try {
      if (!localizacao) return null;
      
      if (typeof localizacao === 'string') {
        return localizacao;
      }
      
      if (typeof localizacao === 'object' && localizacao !== null) {
        if ('address' in localizacao && localizacao.address) {
          return localizacao.address;
        }
        if ('latitude' in localizacao && 'longitude' in localizacao) {
          return `${localizacao.latitude.toFixed(2)}, ${localizacao.longitude.toFixed(2)}`;
        }
      }
      
      return null;
    } catch (error) {
      console.warn('⚠️ Erro ao formatar localização:', error);
      return null;
    }
  };

  const handleLike = (requestId: string) => {
    const newLiked = new Set(likedRequests);
    if (newLiked.has(requestId)) {
      newLiked.delete(requestId);
    } else {
      newLiked.add(requestId);
    }
    setLikedRequests(newLiked);
  };

  const handleHelpClick = (request: HelpRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) {
      // Redirecionar para login
      window.location.href = `/login?from=/pedido/${request.id}`;
      return;
    }
    
    if (currentUserId === request.requesterId) {
      alert('Você não pode ajudar no seu próprio pedido!');
      return;
    }
    
    if (request.ajudasRecebidas?.includes(currentUserId)) {
      alert('Você já está ajudando neste pedido!');
      return;
    }
    
    // Navegar para a página de detalhes para ajudar
    window.location.href = `/pedido/${request.id}`;
  };

  // Verificar se usuário está ajudando em um pedido
  const isHelping = (request: HelpRequest) => {
    return currentUserId && request.ajudasRecebidas?.includes(currentUserId);
  };

  // Verificar se usuário é o solicitante
  const isRequester = (request: HelpRequest) => {
    return currentUserId === request.requesterId;
  };

  return (
    <IonPage>
      {/* HEADER */}
      <IonHeader style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${colors.gray200}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <IonToolbar style={{ '--background': 'transparent' }}>
          <IonButtons slot="start">
            <IonBackButton 
              defaultHref="/tabs/home" 
              style={{ '--color': colors.primary }}
            />
          </IonButtons>
          <IonTitle>
            <div style={{
              display: 'flex',
              alignItems: 'center', 
              gap: '12px',
              fontWeight: '700',
              color: colors.primary,
              fontSize: '1.1rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px', 
                background: gradients.primary,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.white,
                fontWeight: '700',
                fontSize: '14px'
              }}>
                AJ
              </div>
              <span>Feed da Comunidade</span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': colors.gray50 }}>
        
        {/* SEÇÃO DE PARCEIROS */}
        {partners.length > 0 && (
          <div style={{
            background: colors.white,
            padding: '20px 16px',
            borderBottom: `1px solid ${colors.gray200}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: colors.gray900,
                margin: 0
              }}>
                🤝 Empresas Parceiras
              </h2>
              <div style={{
                background: colors.primary,
                color: colors.white,
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '12px',
                fontWeight: '600'
              }}>
                {partners.length}
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '8px'
            }}>
              {partners.map(partner => (
                <a 
                  href={partner.siteUrl} 
                  key={partner.id} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    background: colors.white,
                    border: `2px solid ${colors.gray200}`,
                    borderRadius: '12px',
                    padding: '16px 12px',
                    minWidth: '100px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <img 
                    src={partner.logoUrl} 
                    alt={`Logo de ${partner.nome}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/40';
                    }}
                  />
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: colors.gray800,
                    lineHeight: '1.2'
                  }}>
                    {partner.nome}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* FILTROS DE CATEGORIA */}
        <div style={{
          background: colors.white,
          padding: '16px',
          borderBottom: `1px solid ${colors.gray200}`,
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                style={{
                  background: activeFilter === category.id ? gradients.primary : colors.gray100,
                  color: activeFilter === category.id ? colors.white : colors.gray700,
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* LISTA DE PEDIDOS */}
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <IonSpinner 
              name="crescent" 
              style={{ 
                color: colors.primary,
                width: '48px',
                height: '48px'
              }} 
            />
            <p style={{ color: colors.gray500, fontSize: '0.9rem' }}>
              Carregando pedidos...
            </p>
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: colors.gray900,
                margin: 0
              }}>
                Pedidos de Ajuda
              </h2>
              <div style={{
                background: colors.primary,
                color: colors.white,
                fontSize: '0.8rem',
                padding: '6px 12px',
                borderRadius: '12px',
                fontWeight: '600'
              }}>
                {filteredRequests.length} pedidos
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredRequests.map(request => {
                const formattedLocation = getFormattedLocation(request.localizacao);
                const helping = isHelping(request);
                const requester = isRequester(request);
                const canHelp = currentUserId && !helping && !requester;
                
                return (
                  <div
                    key={request.id}
                    style={{
                      background: colors.white,
                      borderRadius: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: `1px solid ${colors.gray200}`,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => window.location.href = `/pedido/${request.id}`}
                  >
                    {/* BARRA DE URGÊNCIA */}
                    <div style={{
                      height: '4px',
                      background: getUrgencyGradient(request.urgencia),
                      width: '100%'
                    }}></div>

                    {/* BADGE DE STATUS */}
                    {request.status && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: request.status === 'resolvido' ? colors.success :
                                  request.status === 'em_andamento' ? colors.warning :
                                  colors.gray200,
                        color: request.status === 'resolvido' ? colors.white :
                              request.status === 'em_andamento' ? colors.gray900 :
                              colors.gray700,
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        zIndex: 2
                      }}>
                        {request.status === 'resolvido' ? '✅ Resolvido' :
                         request.status === 'em_andamento' ? '🔄 Em andamento' :
                         '⏳ Pendente'}
                      </div>
                    )}

                    <div style={{ padding: '20px' }}>
                      {/* CABEÇALHO DO CARD */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            background: colors.gray100,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem'
                          }}>
                            {getCategoryIcon(request.categoria)}
                          </div>
                          <div>
                            <h3 style={{
                              fontSize: '1.1rem',
                              fontWeight: '700',
                              color: colors.gray900,
                              margin: '0 0 4px 0',
                              lineHeight: '1.3'
                            }}>
                              {request.titulo}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '0.8rem',
                                color: colors.gray600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <IonIcon icon={timeOutline} style={{ fontSize: '14px', color: colors.gray500 }} />
                                {getTimeAgo(request.createdAt)}
                              </span>
                              {formattedLocation && (
                                <span style={{
                                  fontSize: '0.8rem',
                                  color: colors.gray600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <IonIcon icon={locationOutline} style={{ fontSize: '14px', color: colors.gray500 }} />
                                  {formattedLocation}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{
                          background: getUrgencyColor(request.urgencia),
                          color: colors.white,
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {request.urgencia}
                        </div>
                      </div>

                      {/* DESCRIÇÃO */}
                      <p style={{
                        color: colors.gray600,
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        margin: '0 0 16px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {request.descricao}
                      </p>

                      {/* ESTATÍSTICAS DO PEDIDO */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px',
                        padding: '12px',
                        background: colors.gray50,
                        borderRadius: '8px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <IonIcon icon={peopleOutline} style={{ fontSize: '16px', color: colors.primary }} />
                          <span style={{
                            fontSize: '0.9rem',
                            color: colors.gray700,
                            fontWeight: '600'
                          }}>
                            {request.ajudasRecebidas?.length || 0} ajuda{request.ajudasRecebidas?.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <div style={{
                          fontSize: '0.9rem',
                          color: colors.gray600,
                          fontWeight: '500'
                        }}>
                          {getCategoryName(request.categoria)}
                        </div>
                      </div>

                      {/* RODAPÉ DO CARD */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '16px',
                        borderTop: `1px solid ${colors.gray200}`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {request.requesterPhotoURL ? (
                            <img 
                              src={request.requesterPhotoURL} 
                              alt={request.requesterName || 'Anônimo'}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `
                                  <div style="
                                    width: 32px;
                                    height: 32px;
                                    background: ${gradients.primary};
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: white;
                                    font-size: 0.8rem;
                                    font-weight: 600;
                                  ">
                                    ${getRequesterInitial(request.requesterName)}
                                  </div>
                                  <span style="
                                    font-size: 0.8rem;
                                    color: ${colors.gray600};
                                    font-weight: 500;
                                  ">
                                    Por ${request.requesterName || 'Anônimo'}
                                  </span>
                                `;
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '32px',
                              height: '32px',
                              background: gradients.primary,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: colors.white,
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}>
                              {getRequesterInitial(request.requesterName)}
                            </div>
                          )}
                          <span style={{
                            fontSize: '0.8rem',
                            color: colors.gray600,
                            fontWeight: '500'
                          }}>
                            Por {request.requesterName || 'Anônimo'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(request.id);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: likedRequests.has(request.id) ? colors.error : colors.gray500,
                              borderRadius: '8px',
                              padding: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <IonIcon 
                              icon={likedRequests.has(request.id) ? heart : heartOutline} 
                              style={{ fontSize: '18px' }} 
                            />
                          </button>
                          
                          {helping ? (
                            <button
                              style={{
                                background: colors.success,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                cursor: 'default',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                              disabled
                            >
                              <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '16px' }} />
                              Ajudando
                            </button>
                          ) : requester ? (
                            <button
                              style={{
                                background: colors.gray400,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                cursor: 'default',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                              disabled
                            >
                              <IonIcon icon={personCircleOutline} style={{ fontSize: '16px' }} />
                              Seu pedido
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleHelpClick(request, e)}
                              style={{
                                background: canHelp ? gradients.primary : colors.gray300,
                                color: canHelp ? colors.white : colors.gray600,
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                cursor: canHelp ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              {currentUserId ? 'Ajudar' : 'Login para ajudar'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredRequests.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: colors.gray500,
                  background: colors.white,
                  borderRadius: '16px',
                  border: `1px solid ${colors.gray200}`
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    color: colors.gray700
                  }}>
                    Nenhum pedido encontrado
                  </h3>
                  <p style={{ 
                    color: colors.gray500,
                    fontSize: '0.9rem',
                    marginBottom: '24px'
                  }}>
                    {activeFilter === 'todos' 
                      ? 'Ainda não há pedidos de ajuda na comunidade.' 
                      : `Não há pedidos na categoria ${categories.find(c => c.id === activeFilter)?.name?.toLowerCase()}.`
                    }
                  </p>
                  <button
                    onClick={() => window.location.href = '/criar-pedido'}
                    style={{
                      background: gradients.primary,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Criar Primeiro Pedido
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default Feed;