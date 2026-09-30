# 🍲 Caderno de Delícias

[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-orange.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![React Native / Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo)](https://expo.dev)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://postgresql.org)

> **Domínio oficial:** [cadernodedelicias.com.br](https://cadernodedelicias.com.br)  
> Monorepo open source para criar, organizar, ordenar e compartilhar receitas em cadernos temáticos, com cópia atribuída e sem anúncios invasivos na hora de cozinhar.

---

## ✨ Principais Funcionalidades

- 📖 **Cadernos Temáticos (Públicos ou Privados)**:
  - Agrupe pratos por tema (*"Doces de Domingo"*, *"Massas de Família"*, *"Almoço Rápido"*).
  - Controle de visibilidade: mantenha cadernos privados para uso pessoal ou públicos para a comunidade.
- 🔢 **Gerenciamento de Ordem das Receitas**:
  - Reordene a sequência exata em que as receitas aparecem no caderno (entradas primeiro, pratos principais e sobremesas).
- 🌿 **Cópia / Fork com Atribuição Mandatória**:
  - Encontrou um caderno inspirador de outro chef na comunidade? Copie para a sua conta com um clique.
  - **Regra do Open Source**: Apenas cadernos públicos podem ser copiados, e o novo caderno exibe em destaque o badge com link permanente e menção honrosa ao caderno e autor de origem.
- 🔐 **Autenticação Flexível**:
  - Login clássico com **E-mail e Senha** (criptografia `bcryptjs`, validação `zod` e sessão segura via JWT em cookie HTTP-only).
  - Login social em 1 clique com **Google OAuth**.
- 📱 **Mobile Ready (Expo / React Native)**:
  - Pasta `apps/mobile` configurada com WebView acelerada para `cadernodedelicias.com.br`.
  - Suporte a Safe Area (iPhone notch e Dynamic Island), status bar temática, recarga por gesto (*pull-to-refresh*), histórico de navegação com botão Voltar físico do Android e tela de fallback offline.
- 💖 **Modelo Sustentável & Ético (Sem Anúncios Invasivos)**:
  - Mantido inicialmente com apoio e doações comunitárias via Pix.
  - Diretrizes e ideias de monetização que **nunca** prejudicam a experiência do usuário detalhadas em [`/docs/MONETIZATION.md`](docs/MONETIZATION.md).

---

## 🏗️ Estrutura do Monorepo

```
caderno-de-delicias/
├── apps/
│   ├── web/                     # Next.js 16 (App Router, Tailwind CSS v4, Lucide, APIs)
│   └── mobile/                  # Expo / React Native (WebView shell + scaffolding nativo)
├── packages/
│   └── database/                # Schema Prisma, Seeds com dados reais e Client singleton
├── docs/
│   ├── MONETIZATION.md          # Manifesto ético de sustentabilidade e monetização
│   └── ARCHITECTURE.md          # Arquitetura detalhada e modelo relacional
├── docker-compose.yml           # PostgreSQL 16 pronto para rodar com 1 comando
├── .env.example                 # Exemplo completo de variáveis de ambiente
├── AGENTS.md                    # Diretrizes para desenvolvimento e commits atômicos
├── LICENSE                      # Licença MIT
└── package.json                 # Workspaces raiz do monorepo
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js (v20 ou superior)
- npm (v10 ou superior)
- Docker e Docker Compose (para o PostgreSQL local)

### 2. Clonar e Instalar Dependências
```bash
git clone https://github.com/seu-usuario/caderno-de-delicias.git
cd caderno-de-delicias

# Instalar dependências em todos os workspaces
npm install
```

### 3. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

### 4. Subir o Banco de Dados (PostgreSQL)
```bash
docker compose up -d
```

### 5. Executar Migrações e Dados Iniciais (Seed)
O comando de seed popula o banco com receitas clássicas brasileiras (Bolo de Cenoura com Brigadeiro Crocante, Pão de Queijo Mineiro, Mousse de Maracujá) e cadernos com exemplo prático de cópia/atribuição:
```bash
# Sincronizar o schema com o banco
npm run db:push

# Popular com dados de exemplo
npm run db:seed
```

### 6. Iniciar a Aplicação Web
```bash
npm run dev
```
Acesse no seu navegador: **`http://localhost:3000`**

---

## 📱 Executando o App Mobile (Expo)

Na raiz do projeto:
```bash
npm run dev:mobile
```
Abra o app **Expo Go** no seu celular Android ou iOS e escaneie o QR Code exibido no terminal.

Para testar apontando para seu Next.js local na mesma rede Wi-Fi, defina no seu `.env`:
```env
EXPO_PUBLIC_WEB_URL=http://<SEU_IP_LOCAL>:3000
```

---

## 📄 Scripts Disponíveis na Raiz

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento do Next.js (`apps/web`) |
| `npm run dev:mobile` | Inicia o Metro bundler do Expo (`apps/mobile`) |
| `npm run build` | Compila o projeto Next.js para produção |
| `npm run db:push` | Sincroniza o schema Prisma com o banco de dados |
| `npm run db:seed` | Popula o banco com usuários, receitas e cadernos de teste |
| `npm run db:studio` | Abre a interface gráfica do Prisma Studio no navegador |

---

## 💖 Como Apoiar o Projeto

O Caderno de Delícias é sustentado pelo carinho da comunidade. Conheça as formas de apoiar na página `/doar`:
- **Chave Pix**: `pix@cadernodedelicias.com.br`
- **GitHub Sponsors**: Apoio contínuo aos mantenedores de código aberto
- **Transparência**: Veja nosso plano de custos e sustentabilidade em [`/docs/MONETIZATION.md`](docs/MONETIZATION.md)

---

## 📜 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [`LICENSE`](LICENSE) para mais detalhes.
