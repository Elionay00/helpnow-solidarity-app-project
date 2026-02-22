import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonToast,
  IonLoading,
  useIonViewDidEnter,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import { 
  locateOutline, 
  homeOutline, 
  heartOutline, 
  locationOutline, 
  filterOutline,
  layersOutline,
  compassOutline,
  navigateOutline,
  starOutline,
  shieldOutline,
  alertCircleOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

// Importações do Leaflet
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importações do Firebase
import { firestore } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from 'firebase/firestore';

const MapPage: React.FC = () => {
  const history = useHistory();
  const [centerPosition] = useState<L.LatLngExpression>([-23.5505, -46.6333]); // São Paulo
  const [userPosition, setUserPosition] = useState<L.LatLngExpression | null>(null);
  
  const mapRef = useRef<L.Map>(null);
  const [helpRequests, setHelpRequests] = useState<any[]>([]);
  const [accessPoints, setAccessPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'help' | 'access'>('all');
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite'>('standard');

  const [present] = useIonToast();

  // CORES DO DESIGN SYSTEM
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

  // Ícones personalizados com estilo moderno
  const createCustomIcon = (color: string, iconChar: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 44px;
          height: 44px;
          background: white;
          border: 3px solid ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          position: relative;
        ">
          <div style="
            width: 32px;
            height: 32px;
            background: ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
          ">
            ${iconChar}
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -44]
    });
  };

  // Ícones personalizados
  const helpIcon = createCustomIcon(colors.error, '🙏');
  const inProgressIcon = createCustomIcon(colors.warning, '🛠️');
  const accessPointIcon = createCustomIcon(colors.success, '🏪');
  const userIcon = createCustomIcon(colors.primary, '📍');

  useIonViewDidEnter(() => {
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 200);
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Buscar pedidos de ajuda
        const requestsQuery = query(
          collection(firestore, "pedidosDeAjuda"), 
          where("localizacao", "!=", null)
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        const fetchedRequests = requestsSnapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            titulo: data.titulo || 'Pedido de Ajuda',
            descricao: data.descricao || '',
            categoria: data.categoria || 'outros',
            urgencia: data.urgencia || 'media',
            status: data.status || 'aberto',
            position: [data.localizacao.latitude, data.localizacao.longitude] as [number, number],
            requesterName: data.requesterName || 'Anônimo',
            createdAt: data.createdAt
          };
        });
        setHelpRequests(fetchedRequests);

        // Buscar pontos de acesso
        const accessPointsQuery = query(
          collection(firestore, "pontosDeAcesso"), 
          where("localizacao", "!=", null)
        );
        const accessPointsSnapshot = await getDocs(accessPointsQuery);
        const fetchedAccessPoints = accessPointsSnapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            nome: data.nome || 'Ponto de Acesso',
            endereco: data.endereco || '', 
            tipo: data.tipo || 'geral',
            telefone: data.telefone || '',
            horario: data.horario || '24h',
            position: [data.localizacao.latitude, data.localizacao.longitude] as [number, number]
          };
        });
        setAccessPoints(fetchedAccessPoints);

      } catch (error) {
        console.error("Erro ao buscar dados do Firebase: ", error);
        present({ 
          message: 'Erro ao carregar os dados do mapa.', 
          duration: 3000, 
          color: 'danger' 
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const findMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos: [number, number] = [latitude, longitude];
          setUserPosition(userPos);
          setShowUserLocation(true);
          
          if (mapRef.current) {
            mapRef.current.flyTo(userPos, 15);
          }

          present({
            message: 'Localização encontrada!',
            duration: 2000,
            color: 'success'
          });
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          present({
            message: 'Não foi possível obter sua localização.',
            duration: 3000,
            color: 'warning'
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const getFilteredMarkers = () => {
    const filteredHelpRequests = filterType === 'all' || filterType === 'help' ? helpRequests : [];
    const filteredAccessPoints = filterType === 'all' || filterType === 'access' ? accessPoints : [];
    
    return { filteredHelpRequests, filteredAccessPoints };
  };

  const { filteredHelpRequests, filteredAccessPoints } = getFilteredMarkers();

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

  const getUrgencyColor = (urgencia: string) => {
    switch(urgencia) {
      case 'alta': return colors.error;
      case 'media': return colors.warning;
      case 'baixa': return colors.success;
      default: return colors.gray400;
    }
  };

  return (
    <IonPage>
      {/* HEADER MODERNO */}
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
              <span>Mapa de Ajuda</span>
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton 
              onClick={() => setMapStyle(mapStyle === 'standard' ? 'satellite' : 'standard')}
              style={{
                '--background': 'transparent',
                '--color': colors.gray700,
                '--border-radius': '8px'
              }}
            >
              <IonIcon icon={layersOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        {/* FILTROS */}
        <div style={{
          padding: '0 16px 12px',
          background: 'transparent'
        }}>
          <div style={{
            background: colors.white,
            borderRadius: '12px',
            padding: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: `1px solid ${colors.gray200}`
          }}>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => setFilterType('all')}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: filterType === 'all' ? gradients.primary : colors.gray100,
                  color: filterType === 'all' ? colors.white : colors.gray700,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <IonIcon icon={compassOutline} style={{ fontSize: '16px' }} />
                Todos
              </button>
              
              <button
                onClick={() => setFilterType('help')}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: filterType === 'help' ? gradients.error : colors.gray100,
                  color: filterType === 'help' ? colors.white : colors.gray700,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <IonIcon icon={heartOutline} style={{ fontSize: '16px' }} />
                Pedidos
              </button>
              
              <button
                onClick={() => setFilterType('access')}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: filterType === 'access' ? gradients.success : colors.gray100,
                  color: filterType === 'access' ? colors.white : colors.gray700,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <IonIcon icon={shieldOutline} style={{ fontSize: '16px' }} />
                Pontos
              </button>
            </div>
          </div>
        </div>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': colors.gray900 }}>
        <IonLoading 
          isOpen={loading} 
          message={'Carregando mapa...'}
        />
        
        <div style={{ position: 'relative', height: '100%' }}>
          <MapContainer 
            ref={mapRef} 
            center={centerPosition} 
            zoom={12} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer 
              url={mapStyle === 'satellite' 
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
              }
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {/* Círculo de área de cobertura */}
            <Circle
              center={centerPosition}
              radius={5000}
              pathOptions={{
                fillColor: colors.primary + '20',
                color: colors.primary,
                weight: 2,
                opacity: 0.5,
                fillOpacity: 0.2
              }}
            />

            {/* Pedidos de ajuda */}
            {filteredHelpRequests.map(request => (
              <Marker 
                key={request.id} 
                position={request.position} 
                icon={request.status === 'em_atendimento' ? inProgressIcon : helpIcon}
                eventHandlers={{ 
                  click: () => { 
                    history.push(`/pedido/${request.id}`); 
                  } 
                }}
              >
                <Popup>
                  <div style={{
                    minWidth: '250px',
                    padding: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: colors.gray100,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>
                        {getCategoryIcon(request.categoria)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <strong style={{
                          color: colors.gray900,
                          fontSize: '1rem',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          {request.titulo}
                        </strong>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            fontSize: '0.8rem',
                            padding: '3px 8px',
                            background: getUrgencyColor(request.urgencia),
                            color: colors.white,
                            borderRadius: '12px',
                            fontWeight: '600'
                          }}>
                            {request.urgencia}
                          </span>
                          <span style={{
                            fontSize: '0.8rem',
                            color: colors.gray600
                          }}>
                            Por {request.requesterName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p style={{
                      color: colors.gray600,
                      fontSize: '0.9rem',
                      margin: '8px 0',
                      lineHeight: '1.4'
                    }}>
                      {request.descricao?.substring(0, 100)}...
                    </p>
                    <button
                      onClick={() => history.push(`/pedido/${request.id}`)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: gradients.primary,
                        color: colors.white,
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        marginTop: '8px'
                      }}
                    >
                      Ver detalhes
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Pontos de acesso */}
            {filteredAccessPoints.map(point => (
              <Marker 
                key={point.id} 
                position={point.position} 
                icon={accessPointIcon}
              >
                <Popup>
                  <div style={{
                    minWidth: '250px',
                    padding: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: colors.success + '20',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.success,
                        fontSize: '1.2rem'
                      }}>
                        🏪
                      </div>
                      <div>
                        <strong style={{
                          color: colors.gray900,
                          fontSize: '1rem',
                          marginBottom: '2px',
                          display: 'block'
                        }}>
                          {point.nome}
                        </strong>
                        <div style={{
                          fontSize: '0.8rem',
                          color: colors.success,
                          fontWeight: '600'
                        }}>
                          Ponto de Ajuda
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: colors.gray600,
                      margin: '8px 0',
                      lineHeight: '1.4'
                    }}>
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Endereço:</strong> {point.endereco}
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Horário:</strong> {point.horario}
                      </div>
                      {point.telefone && (
                        <div>
                          <strong>Telefone:</strong> {point.telefone}
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Localização do usuário */}
            {showUserLocation && userPosition && (
              <Marker 
                position={userPosition} 
                icon={userIcon}
              >
                <Popup>
                  <div style={{ padding: '8px' }}>
                    <strong style={{ color: colors.primary }}>Você está aqui!</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: colors.gray600 }}>
                      Sua localização atual
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* CONTROLES DO MAPA */}
          <div style={{
            position: 'absolute',
            bottom: '80px',
            right: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 1000
          }}>
            <button
              onClick={() => mapRef.current?.flyTo(centerPosition, 12)}
              style={{
                width: '44px',
                height: '44px',
                background: colors.white,
                border: `2px solid ${colors.gray200}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.gray700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.gray100;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.white;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="Centralizar mapa"
            >
              <IonIcon icon={homeOutline} style={{ fontSize: '20px' }} />
            </button>

            <button
              onClick={() => mapRef.current?.zoomIn()}
              style={{
                width: '44px',
                height: '44px',
                background: colors.white,
                border: `2px solid ${colors.gray200}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.gray700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.gray100;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.white;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="Aumentar zoom"
            >
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>+</span>
            </button>

            <button
              onClick={() => mapRef.current?.zoomOut()}
              style={{
                width: '44px',
                height: '44px',
                background: colors.white,
                border: `2px solid ${colors.gray200}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.gray700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.gray100;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.white;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="Diminuir zoom"
            >
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>-</span>
            </button>
          </div>

          {/* LEGENDA */}
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '16px',
            background: colors.white,
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            border: `1px solid ${colors.gray200}`,
            zIndex: 1000,
            maxWidth: '200px'
          }}>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: colors.gray900,
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <IonIcon icon={filterOutline} />
              Legenda do Mapa
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: colors.error,
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '0.8rem', color: colors.gray600 }}>Pedidos de ajuda</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: colors.warning,
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '0.8rem', color: colors.gray600 }}>Em atendimento</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: colors.success,
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '0.8rem', color: colors.gray600 }}>Pontos de acesso</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: colors.primary,
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '0.8rem', color: colors.gray600 }}>Sua localização</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAB PARA LOCALIZAÇÃO */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ marginBottom: '80px' }}>
          <IonFabButton 
            onClick={findMyLocation}
            title="Minha Localização"
            style={{
              '--background': gradients.primary,
              '--box-shadow': '0 4px 12px rgba(124, 58, 237, 0.3)',
              'margin': '16px'
            }}
          >
            <IonIcon icon={locateOutline} />
          </IonFabButton>
        </IonFab>

        {/* ESTATÍSTICAS */}
        {!loading && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            zIndex: 1000,
            pointerEvents: 'none'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '12px 16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: `1px solid rgba(255,255,255,0.2)`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: colors.error,
                  marginBottom: '2px'
                }}>
                  {helpRequests.length}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: colors.gray600,
                  fontWeight: '600'
                }}>
                  Pedidos
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: colors.success,
                  marginBottom: '2px'
                }}>
                  {accessPoints.length}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: colors.gray600,
                  fontWeight: '600'
                }}>
                  Pontos
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: colors.primary,
                  marginBottom: '2px'
                }}>
                  {helpRequests.filter(r => r.status === 'em_atendimento').length}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: colors.gray600,
                  fontWeight: '600'
                }}>
                  Em ajuda
                </div>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MapPage;