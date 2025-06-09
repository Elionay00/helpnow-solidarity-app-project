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
import helpnowImg from '../images/helpnow.png'; // ajuste o caminho se necessário


// IMPORTAÇÕES DO SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination } from 'swiper';

// Ativa os módulos do Swiper
SwiperCore.use([Autoplay, Pagination]);

// CSS do Swiper
import 'swiper/css';
import 'swiper/css/pagination';

const Home: React.FC = () => {
  const history = useHistory();

  // Redireciona para a tela de login
  const goToLogin = () => {
    history.push('/login');
  };

  // Redireciona para a tela de cadastro
  const goToCadastro = () => {
    history.push('/cadastro');
  };

  // Redireciona para a área "Preciso de ajuda"
  const goToPrecisoDeAjuda = () => {
    history.push('/preciso-de-ajuda');
  };

  // ✅ NOVO: Redireciona para a área "Quero Ajudar"
  const goToQueroAjudar = () => {
    history.push('/quero-ajudar');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">Ajuda Já</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding ion-text-center" style={{ paddingBottom: '40px', fontFamily: 'Poppins, sans-serif' }}>

        {/* Logo do aplicativo */}
        <img
  src={helpnowImg}
  alt="Ajuda Já"
  style={{ width: '120px', margin: '20px auto', display: 'block' }}
/>

        {/* Swiper carrossel com slides informativos */}
        <Swiper
          autoplay={{ delay: 2500 }}
          pagination={{ clickable: true }}
          loop={true}
          style={{ height: '240px', marginBottom: '30px' }}
        >
          {/* Slide 1 - Boas-vindas */}
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
            <IonText>
              <h2>🙌 Bem-vindo ao Ajuda Já!</h2>
              <p>Conectamos você com quem pode ajudar, rápido e fácil.</p>
            </IonText>
          </SwiperSlide>

          {/* Slide 2 - Preciso de ajuda */}
          <SwiperSlide
            onClick={goToPrecisoDeAjuda}
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
            <IonText>
              <h2>🚨 Precisa de ajuda?</h2>
              <p>Peça agora e receba suporte imediato da comunidade.</p>
            </IonText>
          </SwiperSlide>

          {/* ✅ Slide 3 - Quero ajudar (agora redireciona para /quero-ajudar) */}
          <SwiperSlide
            onClick={goToQueroAjudar}
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
            <IonText>
              <h2>💖 Quer ajudar?</h2>
              <p>Faça a diferença na vida de alguém próximo de você.</p>
            </IonText>
          </SwiperSlide>
        </Swiper>

        {/* BOTÕES DE AÇÃO */}

        <IonButton expand="block" color="primary" onClick={goToPrecisoDeAjuda}>
          Preciso de ajuda
        </IonButton>

        {/* ✅ Botão agora chama goToQueroAjudar */}
        <IonButton expand="block" color="success" onClick={goToQueroAjudar} style={{ marginTop: 12 }}>
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
