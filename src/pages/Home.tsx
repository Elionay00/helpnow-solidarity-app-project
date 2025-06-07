import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

// IMPORTAÇÕES DO SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination } from 'swiper';

// Ativa os módulos
SwiperCore.use([Autoplay, Pagination]);

// CSS do Swiper
import 'swiper/css';
import 'swiper/css/pagination';

const Home: React.FC = () => {
  const history = useHistory();

  const goToLogin = () => {
    history.push('/login');
  };

  const goToCadastro = () => {
    history.push('/cadastro');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">Ajuda Já</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding ion-text-center" style={{ paddingBottom: '40px', fontFamily: 'Poppins, sans-serif' }}>

        {/* Logo opcional */}
        <img
          src="/assets/logo-ajuda-ja.png"
          alt="Ajuda Já"
          style={{ width: '120px', margin: '20px auto' }}
        />

        {/* Swiper Carrossel com estilo aprimorado */}
        <Swiper
          autoplay={{ delay: 2500 }}
          pagination={{ clickable: true }}
          loop={true}
          style={{ height: '240px', marginBottom: '30px' }}
        >
          <SwiperSlide
            onClick={goToLogin}
            style={{
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              borderRadius: '12px',
            }}
          >
            <IonText className="fade-in">
              <h2 className="title-slide">🙌 Bem-vindo ao Ajuda Já!</h2>
              <p className="text-slide">Conectamos você com quem pode ajudar, rápido e fácil.</p>
            </IonText>
          </SwiperSlide>

          <SwiperSlide
            onClick={goToLogin}
            style={{
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              borderRadius: '12px',
            }}
          >
            <IonText className="fade-in">
              <h2 className="title-slide">🚨 Precisa de ajuda?</h2>
              <p className="text-slide">Peça agora e receba suporte imediato da comunidade.</p>
            </IonText>
          </SwiperSlide>

          <SwiperSlide
            onClick={goToCadastro}
            style={{
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              borderRadius: '12px',
            }}
          >
            <IonText className="fade-in">
              <h2 className="title-slide">💖 Quer ajudar?</h2>
              <p className="text-slide">Faça a diferença na vida de alguém próximo de você.</p>
            </IonText>
          </SwiperSlide>
        </Swiper>

        {/* Botões de ação sem ícones */}
        <IonButton expand="block" color="primary" onClick={goToLogin}>
          Preciso de ajuda
        </IonButton>

        <IonButton expand="block" color="success" onClick={goToCadastro} style={{ marginTop: 12 }}>
          Quero ajudar
        </IonButton>
        <IonButton expand="block" color="tertiary" routerLink="/feed" style={{ marginTop: 12 }}>
  Ver pedidos
</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Home;
