// Cole este código em src/pages/StartPage/Home.tsx - VERSÃO COM <IonPopover>

import React, { useState } from "react";
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton,
  IonIcon, IonBadge, IonFab, IonFabButton, IonButtons,
  IonList, IonItem, IonLabel, IonText,
  // A importação principal que muda:
  IonPopover,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import {
  helpCircleOutline, heartOutline, listOutline, homeOutline, notificationsOutline,
  mapOutline, ellipsisVertical, personCircleOutline, logOutOutline,
} from "ionicons/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, EffectFade } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import "./Home.css";
import familyreceivinghelp from "../../images/familyreceivinghelp.jpeg";
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

SwiperCore.use([Autoplay, Pagination, EffectFade]);

const Home: React.FC = () => {
  const history = useHistory();
  const [notificationCount, setNotificationCount] = useState(3);

  // ***** INÍCIO DA CORREÇÃO *****
  // 1. Usamos useState para controlar o estado do Popover
  const [popoverState, setPopoverState] = useState<{
    showPopover: boolean;
    event: Event | undefined;
  }>({
    showPopover: false,
    event: undefined,
  });

  // 2. Funções que serão chamadas diretamente pelos botões do Popover
  const handleLogout = async () => {
    setPopoverState({ showPopover: false, event: undefined }); // Fecha o popover
    try {
      await signOut(auth);
      history.replace('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      history.replace('/login');
    }
  };

  const goToProfile = () => {
    setPopoverState({ showPopover: false, event: undefined }); // Fecha o popover
    history.push('/perfil');
  };
  // ***** FIM DA CORREÇÃO *****

  const goTo = (path: string) => {
    if (path === '/feed') setNotificationCount(0);
    history.push(path);
  };
  
  const slides = [
    { title: "🙌 Conectando Solidariedade", text: "Uma rede do bem para ajudar quem mais precisa.", background: "linear-gradient(135deg, #ffffff, #ffffff)", path: "/feed" },
    { title: "🚨 Precisa de Ajuda?", text: "Descreva sua necessidade. Vamos te conectar com quem pode ajudar.", background: "linear-gradient(135deg, #fce4ec, #f8bbd0)", path: "/preciso-de-ajuda" },
    { title: "💖 Quer Ajudar?", text: "Transforme vidas com pequenos gestos. Faça parte!", background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)", path: "/quero-ajudar" },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontWeight: "bold", fontSize: "18px", paddingLeft: "16px" }}>
            Ajuda já
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => goTo('/home')} title="Home"><IonIcon icon={homeOutline} /></IonButton>
            <IonButton onClick={() => goTo('/feed')} title="Notificações" style={{ position: "relative" }}>
              <IonIcon icon={notificationsOutline} />
              {notificationCount > 0 && (
                <IonBadge color="danger" style={{ position: "absolute", top: "-4px", right: "-4px", fontSize: "0.7rem", padding: "0 5px" }}>
                  {notificationCount}
                </IonBadge>
              )}
            </IonButton>
            {/* 3. O botão de menu agora atualiza o estado para mostrar o Popover */}
            <IonButton onClick={(e) => setPopoverState({ showPopover: true, event: e.nativeEvent })}>
              <IonIcon slot="icon-only" icon={ellipsisVertical} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ "--background": "linear-gradient(to bottom, #003366, #00b3c6)" }}>
        
        {/* 4. O componente <IonPopover> é colocado diretamente no código */}
        <IonPopover
          isOpen={popoverState.showPopover}
          event={popoverState.event}
          onDidDismiss={() => setPopoverState({ showPopover: false, event: undefined })}
        >
          <IonList>
            <IonItem button={true} detail={false} onClick={goToProfile}>
              <IonIcon slot="start" icon={personCircleOutline} />
              <IonLabel>Meu Perfil</IonLabel>
            </IonItem>
            <IonItem button={true} detail={false} lines="none" onClick={handleLogout}>
              <IonIcon slot="start" icon={logOutOutline} color="danger" />
              <IonLabel color="danger">Sair</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>

        <img src={familyreceivinghelp} alt="Ajuda Já" style={{ width: "130px", margin: "30px auto 25px", display: "block", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.25)" }} />
        
        <Swiper
          effect="fade"
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          style={{ marginBottom: "30px" }}
        >
          {slides.map((slide) => (
            <SwiperSlide 
              key={slide.title} 
              style={{ background: slide.background, borderRadius: "20px", padding: "30px 25px", boxShadow: "0 12px 25px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "240px", textAlign: "center", cursor: 'pointer' }}
              onClick={() => goTo(slide.path)}
            >
              <IonText>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "14px", color: "#003366" }}>{slide.title}</h2>
                <p style={{ fontSize: "1.1rem", fontWeight: 400, color: "#003366", lineHeight: 1.4, maxWidth: "90%", margin: "0 auto" }}>{slide.text}</p>
              </IonText>
            </SwiperSlide>
          ))}
        </Swiper>

        <IonButton expand="block" color="light" onClick={() => goTo('/preciso-de-ajuda')} style={{ marginBottom: 16 }}>
          <IonIcon slot="start" icon={helpCircleOutline} />
          Preciso de ajuda
        </IonButton>
        <IonButton expand="block" color="light" onClick={() => goTo('/quero-ajudar')} style={{ marginBottom: 16 }}>
          <IonIcon slot="start" icon={heartOutline} />
          Quero ajudar
        </IonButton>
        <IonButton expand="block" color="light" onClick={() => goTo('/feed')}>
          <IonIcon slot="start" icon={listOutline} />
          Ver pedidos
        </IonButton>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => goTo('/mapa')} color="tertiary" title="Ver no Mapa">
            <IonIcon icon={mapOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;