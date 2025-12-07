// packages/web/src/pages/StartPage/Home.tsx
import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonIcon,
  IonBadge,
  IonFab,
  IonFabButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonPopover,
  IonSearchbar,
  IonTitle,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import {
  helpCircleOutline,
  heartOutline,
  listOutline,
  homeOutline,
  notificationsOutline,
  mapOutline,
  ellipsisVertical,
  settingsOutline,
  logOutOutline,
  giftOutline,
  briefcaseOutline,
  searchOutline,
  personOutline,
} from "ionicons/icons";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import familyreceivinghelp from "../../images/familyreceivinghelp.jpeg";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

const Home: React.FC = () => {
  const history = useHistory();
  const [notificationCount, setNotificationCount] = useState(3);
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(undefined);
  const [searchText, setSearchText] = useState("");

  // PALETA DE CORES DEFINITIVA
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

  const handleLogout = async () => {
    setPopoverEvent(undefined);
    setTimeout(async () => {
      try {
        await signOut(auth);
        history.replace("/logout");
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        history.replace("/logout");
      }
    }, 300);
  };

  const goToProfile = () => {
    setPopoverEvent(undefined);
    setTimeout(() => {
      history.push("/tabs/perfil");
    }, 300);
  };

  const goTo = (path: string) => {
    if (path === "/feed") setNotificationCount(0);
    history.push(path);
  };

  const slides = [
    {
      title: "🙌 Conectando Solidariedade",
      text: "Uma rede do bem para ajudar quem mais precisa.",
      background: gradients.primary,
      path: "/feed",
    },
    {
      title: "🚨 Precisa de Ajuda?",
      text: "Descreva sua necessidade. Vamos te conectar com quem pode ajudar.",
      background: gradients.warning,
      path: "/preciso-de-ajuda",
    },
    {
      title: "💖 Quer Ajudar?",
      text: "Transforme vidas com pequenos gestos. Faça parte!",
      background: gradients.success,
      path: "/quero-ajudar",
    },
  ];

  const quickActions = [
    {
      title: "Encontrar Profissionais",
      icon: searchOutline,
      path: "/encontrar-profissionais",
      gradient: gradients.primary
    },
    {
      title: "Doar Cesta Básica",
      icon: giftOutline,
      path: "/doar-afiliado",
      gradient: gradients.success
    },
    {
      title: "Preciso de Ajuda",
      icon: helpCircleOutline,
      path: "/preciso-de-ajuda", 
      gradient: gradients.warning
    },
    {
      title: "Quero Ajudar",
      icon: heartOutline,
      path: "/quero-ajudar",
      gradient: gradients.primary
    },
    {
      title: "Ver Pedidos",
      icon: listOutline,
      path: "/feed",
      gradient: gradients.primary
    },
    {
      title: "Sou Profissional",
      icon: briefcaseOutline,
      path: "/cadastro-profissional",
      gradient: gradients.primary
    },
  ];

  return (
    <IonPage>
      {/* HEADER */}
      <IonHeader style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <IonToolbar style={{ '--background': 'transparent' }}>
          <IonTitle>
            <div style={{
              display: 'flex',
              alignItems: 'center', 
              gap: '12px',
              fontWeight: '700',
              color: colors.primary,
              fontSize: '1.25rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px', 
                background: gradients.primary,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.white,
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}>
                AJ
              </div>
              <span>AjudaJá</span>
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton 
              onClick={() => history.push('/tabs/home')} 
              style={{
                '--background': 'transparent',
                '--color': colors.gray700,
                '--border-radius': '8px',
                '--padding-start': '8px',
                '--padding-end': '8px',
                'margin': '0 4px'
              }}
            >
              <IonIcon icon={homeOutline} />
            </IonButton>
            <IonButton
              onClick={() => goTo("/feed")}
              style={{
                '--background': 'transparent', 
                '--color': colors.gray700,
                '--border-radius': '8px',
                '--padding-start': '8px',
                '--padding-end': '8px',
                'margin': '0 4px',
                'position': 'relative'
              }}
            >
              <IonIcon icon={notificationsOutline} />
              {notificationCount > 0 && (
                <IonBadge
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: colors.error,
                    color: colors.white,
                    borderRadius: '10px'
                  }}
                >
                  {notificationCount}
                </IonBadge>
              )}
            </IonButton>
            <IonButton
              onClick={(e) => {
                const mouseEvent = e.nativeEvent as MouseEvent;
                setPopoverEvent(mouseEvent);
              }}
              style={{
                '--background': 'transparent',
                '--color': colors.gray700, 
                '--border-radius': '8px',
                '--padding-start': '8px',
                '--padding-end': '8px',
                'margin': '0 4px'
              }}
            >
              <IonIcon slot="icon-only" icon={ellipsisVertical} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        
        {/* SEARCH BAR */}
        <IonToolbar style={{ '--background': 'transparent', padding: '0 16px 8px' }}>
          <div style={{
            background: colors.white,
            borderRadius: '12px',
            padding: '4px 16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: `1px solid ${colors.gray200}`
          }}>
            <input
              type="text"
              placeholder="Buscar pedidos de ajuda..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                padding: '12px 0',
                fontSize: '16px',
                background: 'transparent',
                color: colors.gray800
              }}
            />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{
        '--background': `linear-gradient(135deg, ${colors.gray50} 0%, ${colors.white} 100%)`
      }}>
        <IonPopover
          isOpen={popoverEvent !== undefined}
          event={popoverEvent}
          onDidDismiss={() => setPopoverEvent(undefined)}
        >
          <IonList style={{
            background: colors.white,
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            padding: '8px 0'
          }}>
            <IonItem 
              button 
              detail={false} 
              onClick={goToProfile}
              style={{
                '--background': 'transparent',
                '--border-color': colors.gray200,
                'font-size': '14px'
              }}
            >
              <IonIcon slot="start" icon={personOutline} style={{ color: colors.gray600 }} />
              <IonLabel>Meu Perfil</IonLabel>
            </IonItem>
            <IonItem 
              button 
              detail={false} 
              onClick={goToProfile}
              style={{
                '--background': 'transparent',
                '--border-color': colors.gray200,
                'font-size': '14px'
              }}
            >
              <IonIcon slot="start" icon={settingsOutline} style={{ color: colors.gray600 }} />
              <IonLabel>Configurações</IonLabel>
            </IonItem>
            <IonItem 
              button 
              detail={false} 
              lines="none" 
              onClick={handleLogout}
              style={{
                '--background': 'transparent',
                'font-size': '14px'
              }}
            >
              <IonIcon slot="start" icon={logOutOutline} style={{ color: colors.error }} />
              <IonLabel style={{ color: colors.error }}>Sair</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>

        {/* HERO SECTION */}
        <section style={{
          background: gradients.primary,
          color: colors.white,
          padding: '60px 20px 80px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
            <div>
              <div style={{ marginBottom: '24px' }}>
                <img
                  src={familyreceivinghelp}
                  alt="Família recebendo ajuda"
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
              <h1 style={{
                fontSize: '2.25rem',
                fontWeight: '700',
                marginBottom: '16px',
                lineHeight: '1.2'
              }}>
                Juntos pela Solidariedade
              </h1>
              <p style={{
                fontSize: '1.1rem',
                opacity: '0.95',
                lineHeight: '1.6',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                Conectamos pessoas que precisam de ajuda com quem pode fazer a diferença. 
                Sua solidariedade transforma vidas.
              </p>
            </div>
          </div>
        </section>

        {/* SLIDES SECTION */}
        <section style={{ padding: '0 16px', marginTop: '-40px', marginBottom: '40px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              height: '200px'
            }}>
              <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                loop={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                style={{ height: '100%' }}
              >
                {slides.map((slide, index) => (
                  <SwiperSlide
                    key={slide.title}
                    style={{ 
                      background: slide.background,
                      padding: '40px 30px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => goTo(slide.path)}
                  >
                    <IonText>
                      <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        marginBottom: '12px',
                        color: colors.white
                      }}>
                        {slide.title}
                      </h2>
                      <p style={{
                        fontSize: '1rem',
                        fontWeight: '400',
                        color: colors.white,
                        lineHeight: '1.4',
                        maxWidth: '90%',
                        margin: '0 auto',
                        opacity: '0.95'
                      }}>
                        {slide.text}
                      </p>
                    </IonText>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS SECTION */}
        <section style={{ padding: '40px 0', background: colors.white }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              marginBottom: '32px',
              textAlign: 'center',
              color: colors.gray900
            }}>
              Como você pode ajudar?
            </h2>
            
            {/* GRID DEFINITIVO */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {quickActions.map((action, index) => (
                <div 
                  key={action.title}
                  style={{
                    background: colors.white,
                    borderRadius: '16px',
                    padding: '24px 20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    border: `2px solid ${colors.gray100}`,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = colors.gray100;
                  }}
                  onClick={() => goTo(action.path)}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: colors.white,
                    background: action.gradient
                  }}>
                    <IonIcon icon={action.icon} />
                  </div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600', 
                    color: colors.gray800,
                    margin: '0',
                    lineHeight: '1.4'
                  }}>
                    {action.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section style={{ padding: '60px 0', background: colors.gray50 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
            <div style={{
              background: colors.white,
              borderRadius: '20px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              border: `1px solid ${colors.gray200}`
            }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                marginBottom: '16px',
                color: colors.gray900
              }}>
                Pronto para fazer a diferença?
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: colors.gray600,
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                Junte-se à nossa comunidade e comece a ajudar agora mesmo.
              </p>
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => goTo("/quero-ajudar")}
                  style={{
                    background: gradients.success,
                    color: colors.white,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                  }}
                >
                  <IonIcon icon={heartOutline} />
                  Quero Ajudar
                </button>
                <button
                  onClick={() => goTo("/preciso-de-ajuda")}
                  style={{
                    background: 'transparent',
                    color: colors.primary,
                    border: `2px solid ${colors.primary}`,
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.primary + '10';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <IonIcon icon={helpCircleOutline} />
                  Preciso de Ajuda
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MAP FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton 
            style={{
              '--background': gradients.primary,
              '--box-shadow': '0 10px 15px -3px rgba(0,0,0,0.1)',
              'margin': '16px',
              'width': '56px',
              'height': '56px'
            }}
            onClick={() => history.push('/tabs/mapa')} 
          >
            <IonIcon icon={mapOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;