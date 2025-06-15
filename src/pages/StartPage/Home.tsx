import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonIcon,
  IonBadge,
} from "@ionic/react";

import { useHistory } from "react-router-dom";

import {
  helpCircleOutline,
  heartOutline,
  listOutline,
  homeOutline,
  notificationsOutline,
  manOutline,
} from "ionicons/icons";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, EffectFade } from "swiper";
SwiperCore.use([Autoplay, Pagination, EffectFade]);

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import familyreceivinghelp from "../../images/familyreceivinghelp.jpeg";

  const Home: React.FC = () => {
  const history = useHistory();

  const goToPrecisoDeAjuda = () => history.push("/preciso-de-ajuda");
  const goToQueroAjudar = () => history.push("/quero-ajudar");
  const goToFeed = () => {
    setNotificationCount(0); // Zera notificações quando abre feed
    history.push("/feed");
  };
  const goToHome = () => history.push("/");
  const goToPerfil = () => history.push("/perfil");

  // Exemplo de estado para notificações no badge
  const [notificationCount, setNotificationCount] = useState(3);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontWeight: "bold", fontSize: "18px" }}>
            Ajuda já
          </IonTitle>

          <IonButton slot="end" fill="clear" onClick={goToHome} title="Home">
            <IonIcon icon={homeOutline} />
          </IonButton>

          <IonButton
            slot="end"
            fill="clear"
            onClick={goToFeed}
            title="Notificações"
            style={{ position: "relative" }}
          >
            <IonIcon icon={notificationsOutline} />
            {notificationCount > 0 && (
              <IonBadge
                color="danger"
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  fontSize: "0.7rem",
                  padding: "0 5px",
                }}
              >
                {notificationCount}
              </IonBadge>
            )}
          </IonButton>

          <IonButton
            slot="end"
            fill="clear"
            onClick={goToPerfil}
            title="Perfil"
          >
            <IonIcon icon={manOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent
        fullscreen
        className="ion-padding"
        style={{
          "--background": "linear-gradient(to bottom, #003366, #00b3c6)", // Fundo do app
        }}
      >
        <img
          src={familyreceivinghelp}
          alt="Ajuda Já"
          style={{
            width: "130px",
            margin: "30px auto 25px",
            display: "block",
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          }}
        />

        <Swiper
          effect="fade"
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          fadeEffect={{ crossFade: true }}
          style={{ marginBottom: "30px" }}
        >
          {[
            {
              title: "🙌 Conectando Solidariedade",
              text: "Uma rede do bem para ajudar quem mais precisa.",
              background: "linear-gradient(135deg, #ffffff, #ffffff)",
            },
            {
              title: "🚨 Precisa de Ajuda?",
              text:
                "Descreva sua necessidade. Vamos te conectar com quem pode ajudar.",
              background: "linear-gradient(135deg, #fce4ec, #f8bbd0)",
            },
            {
              title: "💖 Quer Ajudar?",
              text: "Transforme vidas com pequenos gestos. Faça parte!",
              background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
            },
          ].map((slide, index) => (
            <SwiperSlide
              key={index}
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
                fontWeight: 500,
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              <IonText>
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    marginBottom: "14px",
                    color: "#003366",
                  }}
                >
                  {slide.title}
                </h2>
                <p
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 400,
                    color: "#003366",
                    lineHeight: 1.4,
                    maxWidth: "90%",
                    margin: "0 auto",
                  }}
                >
                  {slide.text}
                </p>
              </IonText>
            </SwiperSlide>
          ))}
        </Swiper>

        <IonButton
          expand="block"
          color="light"
          onClick={goToPrecisoDeAjuda}
          style={{ marginBottom: 16 }}
        >
          <IonIcon slot="start" icon={helpCircleOutline} />
          Preciso de ajuda
        </IonButton>

        <IonButton
          expand="block"
          color="light"
          onClick={goToQueroAjudar}
          style={{ marginBottom: 16 }}
        >
          <IonIcon slot="start" icon={heartOutline} />
          Quero ajudar
        </IonButton>

        <IonButton expand="block" color="light" onClick={goToFeed}>
          <IonIcon slot="start" icon={listOutline} />
          Ver pedidos
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
