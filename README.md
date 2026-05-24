# ?? AjudaJá — Conexão Solidária

Aplicativo que conecta pessoas em situação de vulnerabilidade com voluntários, ONGs e prefeituras dispostos a ajudar.

## ?? Stack

- **Ionic + React** — UI multiplataforma (Web, Android, iOS)
- **Capacitor** — Build nativo
- **Firebase** — Auth, Firestore, Storage
- **Leaflet** — Mapa interativo gratuito
- **TypeScript** — Tipagem estática
- **Vite** — Build tool

## ? Funcionalidades implementadas

- Autenticação completa (login, cadastro, recuperação de senha)
- Rotas protegidas por autenticação
- Criar pedido de ajuda (com foto, categoria, urgência e geolocalização)
- Listar pedidos abertos com filtro por categoria
- Ver detalhes do pedido e oferecer ajuda
- Mapa com pedidos reais do Firestore

## ??? Roadmap

- [ ] Chat em tempo real entre usuários (Firestore Realtime)
- [ ] Notificações push
- [ ] Painel de gestão para ONGs
- [ ] Botão de emergência

## ?? Como rodar

```bash
git clone https://github.com/Elionay00/helpnow-solidarity-app-project.git
cd helpnow-solidarity-app-project
npm install
```

Crie um arquivo `.env` baseado no `.env.example` e preencha com suas credenciais do Firebase.

```bash
ionic serve
```

## ?? Estrutura
src/
+-- auth/          # Login, cadastro, recuperação de senha
+-- components/    # Componentes reutilizáveis
+-- firebase/      # Configuração do Firebase
+-- hooks/         # useAuth
+-- pages/         # Telas do app
+-- services/      # Serviços externos
+-- theme/         # Estilos globais
+-- utils/         # Máscaras e validações
