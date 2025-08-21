import React, { useState } from "react";
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton,
  IonIcon, IonBadge, IonFab, IonFabButton, IonButtons,
  IonList, IonItem, IonLabel, IonText, IonPopover,
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

  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(undefined);

  const handleLogout = async () => {
    // Fecha o popover e depois navega
    setPopoverEvent(undefined);
    // Atraso de 300ms para dar tempo ao popover de fechar completamente
    setTimeout(async () => {
      try {
        await signOut(auth);
        history.replace('/login');
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        history.replace('/login');
      }
    }, 300);
  };

  const goToProfile = () => {
    // Fecha o popover e depois navega
    setPopoverEvent(undefined);
    // Atraso de 300ms para dar tempo ao popover de fechar completamente
    setTimeout(() => {
      history.push('/perfil');
    }, 300);
  };

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
            <IonButton onClick={() => goTo('/home')} title="Home">
              <IonIcon icon={homeOutline} />
            </IonButton>
            <IonButton onClick={() => goTo('/feed')} title="Notificações" style={{ position: "relative" }}>
              <IonIcon icon={notificationsOutline} />
              {notificationCount > 0 && (
                <IonBadge color="danger" style={{ position: "absolute", top: "-4px", right: "-4px", fontSize: "0.7rem", padding: "0 5px" }}>
                  {notificationCount}
                </IonBadge>
              )}
            </IonButton>
            <IonButton
              onClick={(e) => {
                const mouseEvent = e.nativeEvent as MouseEvent;
                setPopoverEvent(mouseEvent);
              }}
            >
              <IonIcon slot="icon-only" icon={ellipsisVertical} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ "--background": "linear-gradient(to bottom, #003366, #00b3c6)" }}>
        
        <IonPopover
          isOpen={popoverEvent !== undefined}
          event={popoverEvent}
          onDidDismiss={() => setPopoverEvent(undefined)}
        >
          <IonList>
            <IonItem button detail={false} onClick={goToProfile}>
              <IonIcon slot="start" icon={personCircleOutline} />
              <IonLabel>Meu Perfil</IonLabel>
            </IonItem>
            <IonItem button detail={false} lines="none" onClick={handleLogout}>
              <IonIcon slot="start" icon={logOutOutline} color="danger" />
              <IonLabel color="danger">Sair</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>

        <img
          src={familyreceivinghelp}
          alt="Ajuda Já"
          style={{
            width: "130px",
            margin: "30px auto 25px",
            display: "block",
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
          }}
        />

        <Swiper
          effect="fade"
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          style={{ marginBottom: "30px" }}
        >
          {slides.map((slide) => (
            <SwiperSlide
              key={slide.title}
              style={{
                background: slide.background,
                borderRadius: "20px",
                padding: "30px 25px",
                boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "240px",
                textAlign: "center",
                cursor: "pointer"
              }}
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