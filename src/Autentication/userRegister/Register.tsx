import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonText,
  useIonToast,
} from "@ionic/react";

import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { registerSchema } from "../../utils/validationSchemas";
import IMask, { InputMask } from 'imask';
import helpnowLogo from "../../images/helpnow.png";
import { IonIcon } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';


const Register: React.FC = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");


  const [errors, setErrors] = useState<Record<string, string>>({});

  const cpfInputRef = useRef<HTMLIonInputElement>(null);
  const telInputRef = useRef<HTMLIonInputElement>(null);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);


  const cpfIMaskInstance = useRef<InputMask<any> | null>(null);
  const telIMaskInstance = useRef<InputMask<any> | null>(null);


  const showToast = (message: string, color: string = 'danger') => {
    presentToast({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
  };

  useEffect(() => {
    const setupMasks = async () => {
      const cpfNativeInput = await cpfInputRef.current?.getInputElement();
      const telNativeInput = await telInputRef.current?.getInputElement();

      if (cpfNativeInput) {
        cpfIMaskInstance.current = IMask(cpfNativeInput, {
          mask: '000.000.000-00'
        });
        cpfIMaskInstance.current.on('accept', () => {
          setCpf(cpfIMaskInstance.current!.unmaskedValue);
        });
      }

      if (telNativeInput) {
        telIMaskInstance.current = IMask(telNativeInput, {
          mask: ['(00) 0000-0000', '(00) 00000-0000']
        });
        telIMaskInstance.current.on('accept', () => {
          setTelefone(telIMaskInstance.current!.unmaskedValue);
        });
      }
    };

    setupMasks();

    return () => {
      if (cpfIMaskInstance.current) {
        cpfIMaskInstance.current.destroy();
        cpfIMaskInstance.current = null;
      }
      if (telIMaskInstance.current) {
        telIMaskInstance.current.destroy();
        telIMaskInstance.current = null;
      }
    };
  }, []);


  const handleCadastro = async () => {
    const data = { nomeCompleto, email, cpf, telefone, senha, confirmaSenha };
    console.log('Dados do formulário para cadastro (ANTES DE TUDO):', data);

    try {
      // **DEBUG: COMENTADO TEMPORARIAMENTE para isolar o problema no Firebase Auth**
      // await registerSchema.validate(data, { abortEarly: false });
      // setErrors({});
      console.log('Validação YUP COMENTADA ou supostamente passada.'); // Log para confirmar que esta linha é alcançada

      // **ADICIONE ESTE LOG BEM ANTES DA CHAMADA AO FIREBASE AUTH**
      console.log('PREPARANDO PARA CHAMAR createUserWithEmailAndPassword...');

      // **DEBUG: Adicionando verificação explícita de email e senha**
      if (!email || !senha) {
        console.error('Email ou senha estão vazios antes da chamada ao Firebase Auth!');
        showToast('Email e senha são obrigatórios para cadastro.', 'danger');
        return; // Interrompe a execução se estiverem vazios
      }
      console.log(`Tentando criar usuário com email: "${email}" e senha (parcial): "${senha.substring(0, 3)}..."`); // Log da tentativa

      // Tente criar o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      console.log('Usuário criado no Auth:', user); // Este log precisa aparecer!

      // Se o usuário for criado, tente salvar no Firestore
      if (user) {
        console.log('Tentando salvar dados no Firestore para UID:', user.uid);
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: nomeCompleto,
          cpf: cpf,
          phone: telefone,
          createdAt: new Date(),
        });
        console.log('Dados salvos no Firestore.');
      }

      showToast('Cadastro realizado com sucesso!', 'success');
      history.push("/home");

    } catch (err: any) {
      // **MODIFIQUE ESTE LOG PARA SER MAIS DETALHADO**
      console.error('ERRO CATCH - handleCadastro:', err);
      console.error('Código do erro:', err.code);
      console.error('Mensagem do erro:', err.message);

      // **DEBUG: Mantendo o tratamento de erro YUP caso você queira descomentar a validação**
      if (err.name === 'ValidationError') {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((e: any) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
        showToast('Por favor, corrija os erros do formulário.', 'warning');
      } else {
        let errorMessage = 'Erro ao cadastrar. Tente novamente.';
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Este email já está cadastrado. Tente fazer login ou redefinir a senha.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'O formato do email é inválido. Por favor, verifique.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'A criação de contas com e-mail e senha está desabilitada. Verifique as configurações no Firebase Console.';
            break;
          case 'auth/weak-password':
            errorMessage = 'A senha é muito fraca. Ela deve ter pelo menos 6 caracteres.';
            break;
          default:
            errorMessage = `Erro desconhecido: ${err.message}`;
            break;
        }
        showToast(errorMessage);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{fontWeight: 'bold', fontSize: '18px' }}>Cadastro</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow
            className="ion-justify-content-center ion-align-items-center"
            style={{ height: "100%" }}>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard className="ion-padding">
                <IonCardContent>
                  <IonText color="primary">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <img
                        src={helpnowLogo}
                        alt="Logo Ajuda Já"
                        style={{ height: "150px", objectFit: "contain" }}
                      />
                    </div>
                  </IonText>

                  {/* Nome Completo */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel
                        position="floating"
                        style={{ marginBottom: "10px" }}
                      >
                        <strong>Nome Completo</strong>
                      </IonLabel>
                      <IonInput
                        value={nomeCompleto}
                        onIonChange={(e) => setNomeCompleto(e.detail.value!)}
                        placeholder="Digite seu nome completo"
                      />
                    </IonItem>
                    {errors.nomeCompleto && (
                      <IonText color="danger">
                        <p style={{ marginLeft: "16px", fontSize: "0.75rem" }}>
                          {errors.nomeCompleto}
                        </p>
                      </IonText>
                    )}
                  </div>

                  {/* Email */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel
                        position="floating"
                        style={{ marginBottom: "10px" }}
                      >
                        <strong>Email</strong>
                      </IonLabel>
                      <IonInput
                        type="email"
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                        placeholder="Digite um email válido"
                      />
                    </IonItem>
                    {errors.email && (
                      <IonText color="danger">
                        <p style={{ marginLeft: "16px", fontSize: "0.75rem" }}>
                          {errors.email}
                        </p>
                      </IonText>
                    )}
                  </div>

                  {/* CPF (com máscara) */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel
                        position="floating"
                        style={{ marginBottom: "10px" }}
                      >
                        <strong>CPF</strong>
                      </IonLabel>
                      <IonInput
                        ref={cpfInputRef}
                        onIonChange={(e) => { /* IMask já está atualizando o estado 'cpf' via on('accept') */ }}
                        placeholder="Digite seu CPF"
                        inputmode="numeric"
                      />
                    </IonItem>
                    {errors.cpf && (
                      <IonText color="danger">
                        <p style={{ marginLeft: "16px", fontSize: "0.75rem" }}>
                          {errors.cpf}
                        </p>
                      </IonText>
                    )}
                  </div>

                  {/* Telefone (com máscara) */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel
                        position="floating"
                        style={{ marginBottom: "10px" }}
                      >
                        <strong>Telefone</strong>
                      </IonLabel>
                      <IonInput
                        ref={telInputRef}
                        onIonChange={(e) => { /* IMask já está atualizando o estado 'telefone' via on('accept') */ }}
                        placeholder="Digite seu telefone"
                        type="tel"
                        inputmode="numeric"
                      />
                    </IonItem>
                    {errors.telefone && (
                      <IonText color="danger">
                        <p style={{ marginLeft: "16px", fontSize: "0.75rem" }}>
                          {errors.telefone}
                        </p>
                      </IonText>
                    )}
                  </div>

                  {/* Senha */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel position="floating" style={{ marginBottom: "10px" }}>
                        <strong>Senha</strong>
                      </IonLabel>
                      <IonInput
                        type={mostrarSenha ? "text" : "password"}
                        value={senha}
                        onIonChange={(e) => setSenha(e.detail.value!)}
                        placeholder="Crie uma senha segura"
                        style={{ width: '90%' }}
                      />
                      {/* Ícone do "olhinho" que alterna a visibilidade da senha */}
                      <IonIcon
                        icon={mostrarSenha ? eyeOff : eye}
                        slot="end"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '8px', marginTop: '45px' }}
                      />
                    </IonItem>

                    {errors.senha && (
                      <IonText color="danger">
                        <p style={{ marginLeft: "16px", fontSize: "0.75rem" }}>
                          {errors.senha}
                        </p>
                      </IonText>
                    )}
                  </div>

                  {/* Confirma Senha */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel position="floating" style={{ marginBottom: "10px" }}>
                        <strong>Confirme a senha</strong>
                      </IonLabel>
                      <IonInput
                        type={mostrarConfirmaSenha ? "text" : "password"}
                        value={confirmaSenha}
                        onIonChange={(e) => setConfirmaSenha(e.detail.value!)}
                        placeholder="Repita a senha digitada"
                        style={{ width: '90%' }}
                      />
                      {/* Ícone do "olhinho" que alterna a visibilidade da senha */}
                      <IonIcon
                        icon={mostrarConfirmaSenha ? eyeOff : eye}
                        slot="end"
                        onClick={() => setMostrarConfirmaSenha(!mostrarConfirmaSenha)}
                        style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '8px', marginTop: '45px' }}
                      />
                    </IonItem>

                    {errors.confirmaSenha && (
                      <IonText color="danger">
                        <p style={{ marginLeft: "16px", fontSize: "0.75rem" }}>
                          {errors.confirmaSenha}
                        </p>
                      </IonText>
                    )}
                  </div>

                  {/* Botões */}
                  <IonButton
                    expand="block"
                    className="ion-margin-top"
                    onClick={handleCadastro}
                  >
                    Cadastrar
                  </IonButton>
                  <IonButton
                    expand="block"
                    fill="clear"
                    onClick={() => history.push("/login")}
                  >
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

export default Register;