import React from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonItem, IonLabel, IonButton, IonGrid, IonRow,
  IonCol, IonCard, IonCardContent, IonText, IonIcon,
} from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import helpnowLogo from "../../../images/helpnow.png";
import { useRegisterLogic } from "../logicLayer/RegisterLogic";

const RegisterPresentation: React.FC = () => {
  const {
    fullName, setFullName,
    email, setEmail,
    telInputRef,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    loading, errors,
    handleRegister,
    handleGoToLogin,
  } = useRegisterLogic();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontWeight: "bold", fontSize: "18px" }}>Cadastro</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard className="ion-padding">
                <IonCardContent>

                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                    <img src={helpnowLogo} alt="Logo AjudaJá" style={{ height: "150px", objectFit: "contain" }} />
                  </div>

                  {/* Nome */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel position="floating"><strong>Nome completo</strong></IonLabel>
                      <IonInput
                        placeholder="Digite seu nome completo"
                        value={fullName}
                        onIonChange={(e) => setFullName(e.detail.value!)}
                        style={{ width: "90%", marginTop: "8px" }}
                      />
                    </IonItem>
                    {errors.fullName && (
                      <IonText color="danger">
                        <p style={{ marginLeft: "16px", fontSize: "0.75rem" }}>{errors.fullName}</p>
                      </IonText>
                    )}
                  </div>

                  {/* Email */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel position="floating"><strong>Email</strong></IonLabel>
                      <IonInput
                        type="email"
                        placeholder="Digite um email valido"
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                        style={{ width: "90%", marginTop: "8px" }}
                      />
                    </IonItem>
                    {errors.email && (
                      <IonText color="danger">
                        <p style={{ marginLeft: "16px", fontSize: "0.75rem" }}>{errors.email}</p>
                      </IonText>
                    )}
                  </div>

                  {/* Telefone */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel position="floating"><strong>Telefone</strong></IonLabel>
                      <IonInput
                        ref={telInputRef}
                        placeholder="(00) 00000-0000"
                        style={{ marginTop: "8px", width: "90%" }}
                      />
                    </IonItem>
                    {errors.phone && (
                      <IonText color="danger">
                        <p style={{ marginLeft: "16px", fontSize: "0.75rem" }}>{errors.phone}</p>
                      </IonText>
                    )}
                  </div>

                  {/* Senha */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel position="floating"><strong>Senha</strong></IonLabel>
                      <IonInput
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onIonChange={(e) => setPassword(e.detail.value!)}
                        placeholder="Crie uma senha segura"
                        style={{ width: "90%", marginTop: "8px" }}
                      />
                      <IonIcon
                        icon={showPassword ? eyeOff : eye}
                        slot="end"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ fontSize: "20px", cursor: "pointer", marginTop: "45px" }}
                      />
                    </IonItem>
                    {errors.password && (
                      <IonText color="danger">
                        <p style={{ marginLeft: "16px", fontSize: "0.75rem" }}>{errors.password}</p>
                      </IonText>
                    )}
                  </div>

                  {/* Confirmar Senha */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel position="floating"><strong>Confirme a senha</strong></IonLabel>
                      <IonInput
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                        placeholder="Repita a senha digitada"
                        style={{ width: "90%", marginTop: "8px" }}
                      />
                      <IonIcon
                        icon={showConfirmPassword ? eyeOff : eye}
                        slot="end"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ fontSize: "20px", cursor: "pointer", marginTop: "45px" }}
                      />
                    </IonItem>
                    {errors.confirmPassword && (
                      <IonText color="danger">
                        <p style={{ marginLeft: "16px", fontSize: "0.75rem" }}>{errors.confirmPassword}</p>
                      </IonText>
                    )}
                  </div>

                  <IonButton expand="block" className="ion-margin-top" onClick={handleRegister} disabled={loading}>
                    {loading ? "Cadastrando..." : "Cadastrar"}
                  </IonButton>

                  <IonButton expand="block" fill="clear" onClick={handleGoToLogin}>
                    Já tem uma conta? Entrar
                  </IonButton>

                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPresentation;
