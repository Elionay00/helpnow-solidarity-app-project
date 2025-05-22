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
} from "@ionic/react"; // Importação dos componentes principais do Ionic React usados na tela

import { useState, useEffect, useRef } from "react"; // React hooks para estado, efeitos colaterais e referências
import { useHistory } from "react-router-dom"; // Hook para navegação entre rotas
import { registerSchema } from "../utils/validationSchemas";
import IMask from 'imask'; // Esquema de formato de campos
import helpnowLogo from "../images/helpnow.png"; // Importação do logo da aplicação (imagem)

const Register: React.FC = () => {
  const history = useHistory(); // Hook para navegação

  // Estados para armazenar os valores dos inputs do formulário
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  // Estado para armazenar os erros de validação dos campos
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Referências para inputs específicos para aplicar máscaras
  const cpfInputRef = useRef<HTMLIonInputElement>(null);
  const telInputRef = useRef<HTMLIonInputElement>(null);

  // useEffect para aplicar as máscaras assim que os inputs estiverem disponíveis no DOM
  useEffect(() => {
   const cpfElement = cpfInputRef.current; // seleciona o input interno do IonInput do CPF
   const telElement = telInputRef.current; // seleciona o input interno do IonInput do telefone

     const cpfMask = IMask(cpfElement!, {
      mask: '000.000.000-00'
    });

    cpfMask.on('accept', () => {
      setCpf(cpfMask.value);
    });

    const telMask = IMask(telElement!, {
      mask: ['(00) 0000-0000', '(00) 00000-0000']
    });

    telMask.on('accept', () => {
      setTelefone(telMask.value);
    });

    return () => {
      cpfMask.destroy();
      telMask.destroy();
    };
  }, []);


  // Função que será chamada quando o usuário tentar se cadastrar
  const handleCadastro = async () => {
    const data = { nomeCompleto, email, cpf, telefone, senha, confirmaSenha };

    try {
      // Valida os dados usando o esquema importado, abortando só no final para pegar todos os erros
      await registerSchema.validate(data, { abortEarly: false });
      setErrors({}); // limpa os erros caso a validação passe
      history.push("/home"); // redireciona para a tela principal após cadastro bem sucedido
    } catch (err: any) {
      const validationErrors: Record<string, string> = {};
      // percorre os erros retornados pela validação e armazena no estado errors para exibir
      err.inner.forEach((e: any) => {
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors); // atualiza o estado com os erros para mostrar no formulário
    }
  };

  // Início da tela de cadastro
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cadastro</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow
            className="ion-justify-content-center ion-align-items-center"
            style={{ height: "100%" }}
          >
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard className="ion-padding">
                <IonCardContent>
                  {/* Logo */}
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
                        Nome Completo
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
                        Email
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

                  {/* CPF */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel
                        position="floating"
                        style={{ marginBottom: "10px" }}
                      >
                        CPF
                      </IonLabel>
                      <IonInput
                        ref={cpfInputRef}
                        value={cpf}
                        onIonChange={(e) => setCpf(e.detail.value!)}
                        placeholder="Digite seu CPF"
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

                  {/* Telefone */}
                  <div className="ion-margin-top">
                    <IonItem>
                      <IonLabel
                        position="floating"
                        style={{ marginBottom: "10px" }}
                      >
                        Telefone
                      </IonLabel>
                      <IonInput
                        ref={telInputRef}
                        value={telefone}
                        onIonChange={(e) => setTelefone(e.detail.value!)}
                        placeholder="Digite seu telefone"
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
                      <IonLabel
                        position="floating"
                        style={{ marginBottom: "10px" }}
                      >
                        Senha
                      </IonLabel>
                      <IonInput
                        type="password"
                        value={senha}
                        onIonChange={(e) => setSenha(e.detail.value!)}
                        placeholder="Crie uma senha segura"
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
                      <IonLabel
                        position="floating"
                        style={{ marginBottom: "10px" }}
                      >
                        Confirme a senha
                      </IonLabel>
                      <IonInput
                        type="password"
                        value={confirmaSenha}
                        onIonChange={(e) => setConfirmaSenha(e.detail.value!)}
                        placeholder="Repita a senha digitada"
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
                  {/* Se tiver conta, é redirecionado para o login */}
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
