import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

// IMPORTAÇÕES DO SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination } from 'swiper'; // <- IMPORTAÇÃO CORRETA PARA SWIPER 9

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

      <IonContent fullscreen className="ion-padding ion-text-center">

        {/* Swiper Carrossel */}

        <Swiper
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          loop={true}
          style={{ height: '240px', marginBottom: '30px' }}
        >
          <SwiperSlide onClick={goToLogin} style={{ cursor: 'pointer' }}>
            <h2>🙌 Bem-vindo ao Ajuda Já!</h2>
            <p>Conectamos você com quem pode ajudar, rápido e fácil.</p>
          </SwiperSlide>
          <SwiperSlide onClick={goToLogin} style={{ cursor: 'pointer' }}>
            <h2>🚨 Precisa de ajuda?</h2>
            <p>Peça agora e receba suporte imediato da comunidade.</p>
          </SwiperSlide>
          <SwiperSlide onClick={goToCadastro} style={{ cursor: 'pointer' }}>
            <h2>💖 Quer ajudar?</h2>
            <p>Faça a diferença na vida de alguém próximo de você.</p>
          </SwiperSlide>
        </Swiper>

        {/* Botões de ação */}
        <IonButton expand="block" color="primary" onClick={goToLogin}>
          Preciso de ajuda
        </IonButton>

        <IonButton expand="block" color="success" onClick={goToCadastro} style={{ marginTop: 12 }}>
          Quero ajudar
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Home;
