import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonIcon,
} from '@ionic/react';

import { useHistory } from 'react-router-dom';

import {
  helpCircleOutline,
  heartOutline,
  listOutline,
  homeOutline,
  personOutline,
} from 'ionicons/icons';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination, EffectFade } from 'swiper';
SwiperCore.use([Autoplay, Pagination, EffectFade]);

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import helpnowImg from "../../images/helpnow.png";

const Home: React.FC = () => {
  const history = useHistory();

  const goToPrecisoDeAjuda = () => history.push('/preciso-de-ajuda');
  const goToQueroAjudar = () => history.push('/quero-ajudar');
  const goToFeed = () => history.push('/feed');
  const goToHome = () => history.push('/');
  const goToPerfil = () => history.push('/perfil');

  return (
    <IonPage>
      {/* Navbar original - sem mudanças */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ajuda Já</IonTitle>

          <IonButton slot="end" fill="clear" onClick={goToHome} title="Home">
            <IonIcon icon={homeOutline} />
          </IonButton>

          <IonButton slot="end" fill="clear" onClick={goToFeed} title="Pedidos">
            <IonIcon icon={listOutline} />
          </IonButton>

          <IonButton slot="end" fill="clear" onClick={goToPerfil} title="Perfil">
            <IonIcon icon={personOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">

        <img
          src={helpnowImg}
          alt="Ajuda Já"
          style={{
            width: '130px',
            margin: '30px auto 25px',
            display: 'block',
            borderRadius: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          }}
        />

        {/* Slider com autoplay, loop, efeito fade */}
        <Swiper
          effect="fade"
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          style={{ marginBottom: '30px' }}
          fadeEffect={{ crossFade: true }}
        >
          <SwiperSlide style={{
            background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
            borderRadius: '20px',
            padding: '30px 25px',
            margin: '0 20px',
            boxShadow: '0 12px 25px rgba(0,0,0,0.2)',
            color: '#222',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '240px',
            fontWeight: '500',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}>
            <IonText>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '14px', color: '#003366' }}>🙌 Conectando Solidariedade</h2>
              <p style={{ fontSize: '1.2rem', fontWeight: 400, color: '#003366', lineHeight: 1.3 }}>
                Uma rede do bem para ajudar quem mais precisa.
              </p>
            </IonText>
          </SwiperSlide>

          <SwiperSlide style={{
            background: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
            borderRadius: '20px',
            padding: '30px 25px',
            margin: '0 20px',
            boxShadow: '0 12px 25px rgba(0,0,0,0.2)',
            color: '#222',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '240px',
            fontWeight: '500',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}>
            <IonText>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '14px', color: '#003366' }}>🚨 Precisa de Ajuda?</h2>
              <p style={{ fontSize: '1.2rem', fontWeight: 400, color: '#003366', lineHeight: 1.3 }}>
                Descreva sua necessidade. Vamos te conectar com quem pode ajudar.
              </p>
            </IonText>
          </SwiperSlide>

          <SwiperSlide style={{
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            borderRadius: '20px',
            padding: '30px 25px',
            margin: '0 20px',
            boxShadow: '0 12px 25px rgba(0,0,0,0.2)',
            color: '#222',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '240px',
            fontWeight: '500',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}>
            <IonText>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '14px', color: '#003366' }}>💖 Quer Ajudar?</h2>
              <p style={{ fontSize: '1.2rem', fontWeight: 400, color: '#003366', lineHeight: 1.3 }}>
                Transforme vidas com pequenos gestos. Faça parte!
              </p>
            </IonText>
          </SwiperSlide>
        </Swiper>

        <IonButton expand="block" color="primary" onClick={goToPrecisoDeAjuda} style={{ marginBottom: 16 }}>
          <IonIcon slot="start" icon={helpCircleOutline} />
          Preciso de ajuda
        </IonButton>

        <IonButton expand="block" color="success" onClick={goToQueroAjudar} style={{ marginBottom: 16 }}>
          <IonIcon slot="start" icon={heartOutline} />
          Quero ajudar
        </IonButton>

        <IonButton expand="block" color="tertiary" onClick={goToFeed}>
          <IonIcon slot="start" icon={listOutline} />
          Ver pedidos
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Home;