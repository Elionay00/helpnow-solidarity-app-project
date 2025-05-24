# 📖 AjudaJá App: Conexão Solidária 🤝

Bem-vindo ao repositório do **AjudaJá – Conexão Solidária**, um aplicativo inovador que visa **conectar pessoas em situação de vulnerabilidade com quem deseja ajudar**. Nossa missão é promover a solidariedade de forma rápida, segura e geolocalizada, facilitando pedidos e ofertas de ajuda essenciais.

Este README detalha a estrutura do projeto, as funcionalidades implementadas até o momento e como a navegação por abas foi configurada para otimizar a usabilidade, tudo dentro do contexto da **conexão solidária** que o AjudaJá propõe.

**Slogan: AjudaJá. 🌟**

---

## 🚀 Visão Geral do Projeto

O **AjudaJá** é construído com **Ionic React**, combinando a robustez do React com os componentes de UI de alta performance do Ionic, garantindo uma aplicação com visual nativo e excelente desempenho em diversas plataformas (Web, iOS e Android).

Nosso principal foco inicial tem sido estabelecer uma **navegação fluida e acessível** através de **Tabs (abas)** na parte inferior do aplicativo, permitindo que os usuários alternem entre as seções principais de forma rápida e eficiente.

### O Que é o AjudaJá? 🤔

O **AjudaJá – Conexão Solidária** é um aplicativo projetado para ser uma ponte entre a necessidade e a generosidade. Ele permite que usuários solicitem ou ofereçam diversos tipos de ajuda, como:

* **Doações:** 🥫 Alimentos, 👕 roupas, 🧼 itens de higiene, etc.
* **Apoio:** 🛋️ Suporte psicológico, acompanhamento.
* **Serviços Básicos:** 🔧 Pequenos reparos, auxílio em tarefas.

O app é voltado para um público amplo, incluindo **famílias de baixa renda, voluntários, ONGs e prefeituras**, buscando integrar esforços para construir uma comunidade mais solidária.

### Principais Funções do App: 📱

* **Cadastro Simples:** Processo de registro intuitivo, com opção para cadastro anônimo.
* **Pedidos e Ofertas por Categoria:** Organização clara das necessidades e das ajudas disponíveis.
* **Mapa Interativo:** 📍 Ajuda geolocalizada para conectar pessoas próximas.
* **Chat Seguro:** 💬 Comunicação direta e protegida entre quem pede e quem oferece.
* **Botão de Emergência:** 🚨 Acesso rápido a ajuda em situações críticas.
* **Painel de Gestão:** 📊 Ferramenta para ONGs e prefeituras gerenciarem e acompanharem as demandas.

### Segurança em Primeiro Lugar: 🔒

A segurança dos nossos usuários é primordial. Para isso, o AjudaJá incorpora:

* **Análise de Pedidos:** Pedidos podem ser analisados por ONGs parceiras antes da divulgação.
* **Limite de Solicitações:** Controle para evitar abusos e garantir a distribuição justa.
* **Avaliações entre Usuários:** Sistema de feedback para construir confiança na comunidade.
* **Verificação Opcional:** Opção de verificação de identidade para maior credibilidade.
* **Sistema de Denúncia e Bloqueio:** Ferramentas para reportar e bloquear perfis suspeitos, mantendo o ambiente seguro.

A ideia central é **promover solidariedade, reduzir o tempo de resposta em emergências e apoiar políticas públicas com dados reais** sobre as necessidades e ofertas de ajuda.

---

## ✨ Funcionalidades Implementadas

Até o momento, as seguintes funcionalidades e estruturas foram desenvolvidas:

### 1. Navegação por Tabs (Abas) 🧭

A espinha dorsal da navegação do AjudaJá é a barra de abas inferior, que proporciona uma experiência de usuário similar à de aplicativos móveis modernos. As abas configuradas são:

* **Início (Home):** A página principal do aplicativo, servindo como ponto de partida para o usuário.
* **Login:** Dedicada à autenticação de usuários existentes.
* **Cadastro:** Para novos usuários se registrarem no aplicativo.

A implementação utiliza os componentes `IonTabs`, `IonTabBar`, `IonTabButton`, `IonRouterOutlet` e `Route` do Ionic React e React Router para gerenciar o roteamento e a renderização das páginas dentro da estrutura de abas. Isso garante que, ao tocar em uma aba, o usuário é direcionado para a página correspondente de forma **fluida e sem recarregamentos completos da tela**.

### 2. Página de Cadastro (Register) ✍️

A página de cadastro (`Register.tsx`) é uma funcionalidade robusta que permite que novos usuários criem suas contas. Ela inclui:

* **Formulário Completo:** Campos para **Nome Completo, Email, CPF, Telefone, Senha** e **Confirmação de Senha**.
* **Validação de Dados:** Utiliza um esquema de validação (`registerSchema`, provavelmente com Yup) para garantir a integridade dos dados inseridos, exibindo mensagens de erro claras para o usuário.
* **Máscaras de Input:** Máscaras automáticas são aplicadas aos campos de **CPF** e **Telefone**, melhorando a experiência de digitação e a formatação dos dados.
* **Navegação Dinâmica:** Após um cadastro bem-sucedido, o usuário é **redirecionado automaticamente para a página de Início**. Há também um botão para **redirecionar para a página de Login** caso o usuário já possua uma conta.
* **Componentes Ionic:** A interface é construída com componentes Ionic como `IonInput`, `IonItem`, `IonLabel`, `IonButton` e `IonCard`, garantindo um design responsivo e consistente.
* **Integração Visual:** O logo do AjudaJá (`helpnowLogo.png`) é exibido de forma proeminente para reforçar a identidade visual do aplicativo.

---

## 🛠️ Como Começar

Para rodar o projeto localmente, siga os passos abaixo:

1.  **Clone o Repositório:**

    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd AjudaJa
    ```

2.  **Instale as Dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Inicie o Aplicativo:**

    ```bash
    ionic serve
    ```

    Isso abrirá o aplicativo no seu navegador padrão. Você poderá ver a navegação por abas funcionando e interagir com o formulário de cadastro.

---

## 🗺️ Próximos Passos

Os próximos passos no desenvolvimento do AjudaJá incluem:

* **Integração com Backend:** 🚀 Conectar a página de cadastro e login a uma API real para persistência de dados e funcionalidades específicas do AjudaJá (pedidos, ofertas, chat).
* **Feedback ao Usuário:** 💬 Implementar mensagens de sucesso/erro e indicadores de carregamento durante as operações com o backend.
* **Outras Páginas:** ➕ Desenvolver o conteúdo e a funcionalidade das páginas de Início e outras seções futuras, como o mapa interativo e o chat.
* **Testes:** ✅ Adicionar testes unitários e de integração para garantir a estabilidade e qualidade do código.

---
