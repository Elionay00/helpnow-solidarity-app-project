// packages/web/src/pages/Profile/Profile.tsx
import React, { useState, useEffect } from 'react';
import { locationOutline } from 'ionicons/icons';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButton,
  IonSpinner,
  IonIcon,
  IonFab,
  IonFabButton,
  useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { auth, firestore as db } from '../../firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'; 
import { 
  logOutOutline, 
  personCircleOutline, 
  mailOutline, 
  callOutline, 
  briefcaseOutline, 
  star,
  settingsOutline,
  trophyOutline,
  calendarOutline,
  shieldCheckmarkOutline,
  helpCircleOutline,
  heartOutline,
  giftOutline,
  ribbonOutline,
  sparklesOutline,
  chevronForwardOutline,
  pencilOutline,
  cameraOutline
} from 'ionicons/icons';

interface ProfileData {
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  isPremium: boolean;
  premiumExpiresAt: Timestamp | null;
  photoURL?: string;
  reputacao?: number;
  ajudasRealizadas?: number;
  cidade?: string;
  bio?: string;
}

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [presentToast] = useIonToast();

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
    premium: `linear-gradient(135deg, #FFD700 0%, #FFA500 100%)`,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Usuário encontrado:', user.uid);
        const docRef = doc(db, "profissionais", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          // Adicionar dados mock para demonstração
          setProfileData({
            ...data,
            reputacao: data.reputacao || 4.8,
            ajudasRealizadas: data.ajudasRealizadas || 12,
            cidade: data.cidade || 'São Paulo, SP',
            bio: data.bio || 'Apaixonado por ajudar pessoas e fazer a diferença na comunidade.',
            photoURL: data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nome)}&background=${colors.primary.replace('#', '')}&color=fff`
          });
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.replace('/logout'); 
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleUpgradePremium = async () => {
    const user = auth.currentUser;
    if (!user) {
      presentToast({ message: "Você precisa estar logado.", duration: 3000, color: "danger" });
      return;
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const expirationTimestamp = Timestamp.fromDate(expirationDate);

    const docRef = doc(db, "profissionais", user.uid);

    try {
      await updateDoc(docRef, {
        isPremium: true,
        premiumExpiresAt: expirationTimestamp
      });

      setProfileData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          isPremium: true,
          premiumExpiresAt: expirationTimestamp
        };
      });

      presentToast({
        message: "🎉 Parabéns! Você agora é um Assinante Premium.",
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

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen style={{ '--background': colors.gray50 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}>
            <IonSpinner 
              name="crescent" 
              style={{ 
                color: colors.primary,
                width: '48px',
                height: '48px'
              }} 
            />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const premiumBenefits = [
    { icon: star, text: 'Badge de profissional premium' },
    { icon: shieldCheckmarkOutline, text: 'Verificação de perfil' },
    { icon: trophyOutline, text: 'Destaque nos resultados de busca' },
    { icon: giftOutline, text: 'Acesso a recursos exclusivos' },
  ];

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
              <span>Meu Perfil</span>
            </div>
          </IonTitle>
          <IonButton 
            slot="end"
            style={{
              '--background': 'transparent',
              '--color': colors.gray700,
              '--border-radius': '8px'
            }}
          >
            <IonIcon icon={settingsOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': colors.gray50 }}>
        
        {/* HERO SECTION DO PERFIL */}
        <div style={{
          background: gradients.primary,
          color: colors.white,
          padding: '40px 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* DECORAÇÃO BACKGROUND */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* AVATAR DO USUÁRIO */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
              <img
                src={profileData?.photoURL}
                alt={profileData?.nome}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
              />
              <button
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  background: colors.white,
                  color: colors.primary,
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                <IonIcon icon={cameraOutline} />
              </button>
            </div>

            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '8px',
              lineHeight: '1.2'
            }}>
              {profileData?.nome}
            </h1>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              {profileData?.isPremium && (
                <div style={{
                  background: gradients.premium,
                  color: '#8B4513',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <IonIcon icon={star} style={{ fontSize: '12px' }} />
                  Premium
                </div>
              )}
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                {profileData?.especialidade}
              </div>
            </div>

            <p style={{
              fontSize: '0.95rem',
              opacity: '0.9',
              lineHeight: '1.5',
              maxWidth: '500px',
              margin: '0 auto 16px'
            }}>
              {profileData?.bio}
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  {profileData?.ajudasRealizadas}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: '0.9' }}>
                  Ajudas
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  {profileData?.reputacao}
                  <span style={{ fontSize: '1rem', opacity: '0.8' }}>/5</span>
                </div>
                <div style={{ fontSize: '0.8rem', opacity: '0.9' }}>
                  Reputação
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  🏆
                </div>
                <div style={{ fontSize: '0.8rem', opacity: '0.9' }}>
                  Nível
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INFORMAÇÕES DO PERFIL */}
        <div style={{ padding: '24px 16px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            background: colors.white,
            borderRadius: '20px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            border: `1px solid ${colors.gray200}`,
            overflow: 'hidden',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: `1px solid ${colors.gray200}`
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: colors.gray900,
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <IonIcon icon={personCircleOutline} style={{ color: colors.primary }} />
                Informações Pessoais
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: `${colors.primary}20`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.primary
                  }}>
                    <IonIcon icon={mailOutline} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: colors.gray500, marginBottom: '2px' }}>
                      Email
                    </div>
                    <div style={{ fontWeight: '500', color: colors.gray800 }}>
                      {profileData?.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: `${colors.success}20`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.success
                  }}>
                    <IonIcon icon={callOutline} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: colors.gray500, marginBottom: '2px' }}>
                      Telefone
                    </div>
                    <div style={{ fontWeight: '500', color: colors.gray800 }}>
                      {profileData?.telefone}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: `${colors.warning}20`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.warning
                  }}>
                    <IonIcon icon={locationOutline} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: colors.gray500, marginBottom: '2px' }}>
                      Localização
                    </div>
                    <div style={{ fontWeight: '500', color: colors.gray800 }}>
                      {profileData?.cidade}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÃO EDITAR PERFIL */}
            <button
              style={{
                width: '100%',
                padding: '16px',
                background: 'transparent',
                border: 'none',
                color: colors.primary,
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${colors.primary}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <IonIcon icon={pencilOutline} />
              Editar Perfil
              <IonIcon icon={chevronForwardOutline} style={{ marginLeft: 'auto' }} />
            </button>
          </div>

          {/* SEÇÃO PREMIUM */}
          {!profileData?.isPremium ? (
            <div style={{
              background: `linear-gradient(135deg, ${colors.gray900} 0%, ${colors.gray800} 100%)`,
              borderRadius: '20px',
              padding: '24px',
              color: colors.white,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              marginBottom: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* EFEITOS VISUAIS */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: gradients.premium,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    <IonIcon icon={sparklesOutline} />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      margin: '0 0 4px 0'
                    }}>
                      Seja Premium
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      opacity: '0.9',
                      margin: 0
                    }}>
                      Desbloqueie recursos exclusivos
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  {premiumBenefits.map((benefit, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px'
                      }}
                    >
                      <IonIcon icon={benefit.icon} style={{ color: '#FFD700' }} />
                      <span style={{ fontSize: '0.9rem' }}>{benefit.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleUpgradePremium}
                  style={{
                    width: '100%',
                    background: gradients.premium,
                    color: '#8B4513',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
                  }}
                >
                  <IonIcon icon={star} />
                  Testar Premium - R$ 9,90/mês
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              background: gradients.premium,
              borderRadius: '20px',
              padding: '24px',
              color: '#8B4513',
              boxShadow: '0 10px 25px rgba(255, 215, 0, 0.2)',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <IonIcon icon={star} style={{ fontSize: '1.5rem' }} />
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  margin: 0
                }}>
                  Conta Premium Ativa
                </h3>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem' }}>
                Sua assinatura premium está ativa. Aproveite todos os benefícios!
              </p>
              <div style={{
                background: 'rgba(255,255,255,0.3)',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <IonIcon icon={calendarOutline} />
                  Válido até: {profileData?.premiumExpiresAt?.toDate().toLocaleDateString() || '30 dias'}
                </div>
              </div>
            </div>
          )}

          {/* AÇÕES RÁPIDAS */}
          <div style={{
            background: colors.white,
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            border: `1px solid ${colors.gray200}`,
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: colors.gray900,
              margin: '0 0 16px 0'
            }}>
              Ações Rápidas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                style={{
                  padding: '14px',
                  background: colors.gray50,
                  border: `1px solid ${colors.gray200}`,
                  borderRadius: '12px',
                  color: colors.gray800,
                  fontWeight: '500',
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.gray100;
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.gray50;
                  e.currentTarget.style.borderColor = colors.gray200;
                  e.currentTarget.style.color = colors.gray800;
                }}
              >
                <IonIcon icon={heartOutline} style={{ color: colors.error }} />
                Minhas Ajudas
                <IonIcon icon={chevronForwardOutline} style={{ marginLeft: 'auto', color: colors.gray400 }} />
              </button>

              <button
                style={{
                  padding: '14px',
                  background: colors.gray50,
                  border: `1px solid ${colors.gray200}`,
                  borderRadius: '12px',
                  color: colors.gray800,
                  fontWeight: '500',
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.gray100;
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.gray50;
                  e.currentTarget.style.borderColor = colors.gray200;
                  e.currentTarget.style.color = colors.gray800;
                }}
              >
                <IonIcon icon={ribbonOutline} style={{ color: colors.primary }} />
                Histórico de Contribuições
                <IonIcon icon={chevronForwardOutline} style={{ marginLeft: 'auto', color: colors.gray400 }} />
              </button>

              <button
                style={{
                  padding: '14px',
                  background: colors.gray50,
                  border: `1px solid ${colors.gray200}`,
                  borderRadius: '12px',
                  color: colors.gray800,
                  fontWeight: '500',
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.gray100;
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.gray50;
                  e.currentTarget.style.borderColor = colors.gray200;
                  e.currentTarget.style.color = colors.gray800;
                }}
              >
                <IonIcon icon={helpCircleOutline} style={{ color: colors.warning }} />
                Ajuda e Suporte
                <IonIcon icon={chevronForwardOutline} style={{ marginLeft: 'auto', color: colors.gray400 }} />
              </button>
            </div>
          </div>

          {/* BOTÃO DE LOGOUT */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '16px',
              background: `${colors.error}10`,
              border: `2px solid ${colors.error}`,
              borderRadius: '12px',
              color: colors.error,
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.error;
              e.currentTarget.style.color = colors.white;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${colors.error}10`;
              e.currentTarget.style.color = colors.error;
            }}
          >
            <IonIcon icon={logOutOutline} />
            Sair da Conta
          </button>
        </div>

        {/* FAB PARA VOLTAR AO TOPO */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton 
            style={{
              '--background': gradients.primary,
              'margin': '16px'
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <IonIcon icon={chevronForwardOutline} style={{ transform: 'rotate(-90deg)' }} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;