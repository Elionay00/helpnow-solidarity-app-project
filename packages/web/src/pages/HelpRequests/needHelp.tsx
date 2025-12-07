// packages/web/src/pages/HelpRequests/needHelp.tsx
import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  useIonToast,
  IonSpinner,
  IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { firestore, auth, storage } from '../../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { cameraOutline, closeOutline } from 'ionicons/icons';

const NeedHelp: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [urgencia, setUrgencia] = useState('media');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CORES DEFINITIVAS - MESMAS DA HOME
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

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      present({ 
        message: 'Você precisa estar logado para criar um pedido.', 
        duration: 3000, 
        color: 'danger' 
      });
      history.push('/login');
      return;
    }

    if (!titulo || !descricao || !categoria) {
      present({ 
        message: 'Por favor, preencha todos os campos obrigatórios.', 
        duration: 3000, 
        color: 'warning' 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let photoURL = '';
      if (photo) {
        const photoRef = ref(storage, `pedidosDeAjuda/${user.uid}/${Date.now()}_${photo.name}`);
        const snapshot = await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(snapshot.ref);
      }
      
      await addDoc(collection(firestore, 'pedidosDeAjuda'), {
        titulo,
        descricao,
        categoria,
        urgencia,
        photoURL,
        requesterId: user.uid,
        requesterName: user.displayName || 'Anônimo',
        requesterPhotoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        status: 'aberto',
      });

      present({ 
        message: 'Seu pedido de ajuda foi enviado com sucesso!', 
        duration: 2000, 
        color: 'success' 
      });
      history.push('/feed');
    
    } catch (error) {
      console.error("Erro ao criar pedido: ", error);
      present({ 
        message: 'Ocorreu um erro ao enviar seu pedido. Tente novamente.', 
        duration: 3000, 
        color: 'danger' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <IonBackButton defaultHref="/tabs/home" style={{ '--color': colors.primary }} />
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
              <span>Pedir Ajuda</span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': colors.gray50 }}>
        {/* HERO SECTION */}
        <div style={{
          background: gradients.primary,
          color: colors.white,
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            marginBottom: '12px',
            lineHeight: '1.2'
          }}>
            Precisa de Ajuda?
          </h1>
          <p style={{
            fontSize: '1rem',
            opacity: '0.9',
            lineHeight: '1.5'
          }}>
            Conte-nos sobre sua situação. Nossa comunidade está aqui para apoiar você.
          </p>
        </div>

        {/* FORM SECTION */}
        <div style={{ padding: '24px 16px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            background: colors.white,
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            border: `1px solid ${colors.gray200}`
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: colors.gray900,
              textAlign: 'center'
            }}>
              Criar Pedido de Ajuda
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* TÍTULO */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: colors.gray700,
                    fontSize: '0.9rem'
                  }}>
                    Título do Pedido *
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Preciso de alimentos para minha família"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: `2px solid ${colors.gray300}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.gray300;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* DESCRIÇÃO */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: colors.gray700,
                    fontSize: '0.9rem'
                  }}>
                    Descreva sua necessidade *
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva em detalhes o que você precisa..."
                    rows={4}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: `2px solid ${colors.gray300}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.gray300;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* CATEGORIA */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: colors.gray700,
                    fontSize: '0.9rem'
                  }}>
                    Categoria *
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: `2px solid ${colors.gray300}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: colors.white,
                      color: colors.gray800,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.gray300;
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="" disabled>Selecione uma categoria</option>
                    <option value="alimentacao">🍎 Alimentação</option>
                    <option value="moradia">🏠 Moradia</option>
                    <option value="saude">🏥 Saúde</option>
                    <option value="educacao">📚 Educação</option>
                    <option value="transporte">🚗 Transporte</option>
                    <option value="outros">🔧 Outros</option>
                  </select>
                </div>

                {/* URGÊNCIA */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: colors.gray700,
                    fontSize: '0.9rem'
                  }}>
                    Nível de Urgência
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['baixa', 'media', 'alta'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setUrgencia(level)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: `2px solid ${urgencia === level ? getUrgencyColor(level) : colors.gray300}`,
                          borderRadius: '12px',
                          background: urgencia === level ? getUrgencyColor(level) + '20' : colors.white,
                          color: urgencia === level ? getUrgencyColor(level) : colors.gray600,
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: urgencia === level ? getUrgencyColor(level) : colors.gray300,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: colors.white,
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {level === 'alta' ? '!' : level === 'media' ? '!!' : '✓'}
                        </div>
                        {level === 'alta' ? 'Alta' : level === 'media' ? 'Média' : 'Baixa'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FOTO */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: colors.gray700,
                    fontSize: '0.9rem'
                  }}>
                    Foto (Opcional)
                  </label>
                  <div style={{
                    border: `2px dashed ${colors.gray300}`,
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    background: photo ? `${colors.primary}10` : colors.gray50
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      id="photo-upload"
                      style={{ display: 'none' }}
                    />
                    {photo ? (
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px'
                        }}>
                          <span style={{
                            color: colors.gray700,
                            fontSize: '14px',
                            fontWeight: '500'
                          }}>
                            {photo.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setPhoto(null)}
                            style={{
                              background: colors.error,
                              color: colors.white,
                              border: 'none',
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <IonIcon icon={closeOutline} />
                          </button>
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: colors.gray500
                        }}>
                          Clique para alterar
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="photo-upload" style={{ cursor: 'pointer' }}>
                        <IonIcon icon={cameraOutline} style={{ fontSize: '32px', color: colors.gray400, marginBottom: '8px' }} />
                        <div style={{ color: colors.gray600, fontWeight: '500' }}>
                          Clique para adicionar uma foto
                        </div>
                        <div style={{ fontSize: '12px', color: colors.gray500, marginTop: '4px' }}>
                          PNG, JPG ou GIF (max. 5MB)
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* BOTÃO ENVIAR */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: gradients.success,
                    color: colors.white,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    opacity: isSubmitting ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <IonSpinner name="crescent" style={{ color: colors.white }} />
                      Enviando...
                    </>
                  ) : (
                    '📤 Enviar Pedido de Ajuda'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );

  // Função auxiliar para cor de urgência
  function getUrgencyColor(level: string): string {
    switch(level) {
      case 'alta': return colors.error;
      case 'media': return colors.warning;
      case 'baixa': return colors.success;
      default: return colors.gray400;
    }
  }
};

export default NeedHelp;