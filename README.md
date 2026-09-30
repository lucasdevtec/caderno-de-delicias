# 🍲 Caderno de Delícias

[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-orange.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://postgresql.org)

> **Domínio oficial:** [cadernodedelicias.com.br](https://cadernodedelicias.com.br)  
> Plataforma open source para criar, organizar, ordenar e compartilhar receitas em cadernos temáticos, com cópia atribuída e sem anúncios invasivos na hora de cozinhar.

---

## ✨ Principais Funcionalidades

- 📖 **Cadernos Temáticos (Públicos ou Privados)**:
  - Agrupe pratos por tema (_"Doces de Domingo"_, _"Massas de Família"_, _"Almoço Rápido"_).
  - Controle de visibilidade: mantenha cadernos privados para uso pessoal ou públicos para a comunidade.
- 🔢 **Gerenciamento de Ordem das Receitas**:
  - Reordene a sequência exata em que as receitas aparecem no caderno (entradas primeiro, pratos principais e sobremesas).
- 🌿 **Cópia / Fork com Atribuição Mandatória**:
  - Encontrou um caderno inspirador de outro chef na comunidade? Copie para a sua conta com um clique.
  - **Regra Open Source**: Apenas cadernos públicos podem ser copiados, e o novo caderno exibe em destaque o badge com link permanente e menção honrosa ao caderno e autor de origem.
- 🔐 **Autenticação Flexível**:
  - Login clássico com **E-mail e Senha** (criptografia `bcryptjs`, validação `zod` e sessão segura via JWT em cookie HTTP-only).
  - Login social em 1 clique com **Google OAuth**.
- 📱 **Mobile-First & Responsivo**:
  - Navegação inferior nativa (`MobileBottomNav`), otimização para notch/ilha dinâmica e inputs sem zoom involuntário no iOS Safari.
- 💖 **Modelo Sustentável & Ético (Sem Anúncios Invasivos)**:
  - Mantido com apoio e doações comunitárias via Pix direto na plataforma.
  - Banner interativo com cópia em 1 clique e modal de QR Code.
  - Diretrizes éticas detalhadas em [`/docs/MONETIZATION.md`](docs/MONETIZATION.md).

---

## 🏗️ Estrutura do Projeto

```
web/
├── src/
│   ├── app/                     # App Router: Páginas, layouts e rotas de API REST (/api/*)
│   │   ├── (auth)/              # Rotas de login e registro
│   │   ├── api/                 # Endpoints REST (auth, cadernos, receitas, categorias)
│   │   ├── cadernos/            # Listagem, criação, edição e detalhe de cadernos
│   │   ├── descobrir/           # Feed público e busca global de receitas e cadernos
│   │   ├── doar/                # Página de doação via Pix e transparência de custos
│   │   └── receitas/            # Gerenciamento de receitas e criação passo a passo
│   ├── components/              # Componentes de interface (Navbar, Footer, Cards, Banners)
│   └── lib/                     # Utilitários, auth (JWT/bcryptjs) e client do Prisma
│       └── prisma/              # Singleton do PrismaClient e exportação de tipos/enums
├── prisma/
│   ├── schema.prisma            # Modelagem do banco relacional PostgreSQL
│   └── seed.ts                  # Carga inicial com dados realistas da comunidade
├── public/                      # Assets estáticos (ícones, logos, QR Code Pix)
├── docs/                        # Documentações técnicas e de negócio
│   ├── ARCHITECTURE.md          # Arquitetura completa, modelo de dados e fluxos
│   ├── MONETIZATION.md          # Manifesto ético de sustentabilidade e custos
│   └── SETUP.md                 # Guia de configuração e execução local
├── .env.example                 # Exemplo completo de variáveis de ambiente
├── AGENTS.md                    # Diretrizes de desenvolvimento e commits atômicos
├── LICENSE                      # Licença MIT
└── package.json                 # Dependências e scripts
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos

- Node.js (v20 ou superior, recomendado v22+)
- PostgreSQL (local ou serviço na nuvem como Supabase/Neon)

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Ajuste a variável `DATABASE_URL` com as credenciais do seu PostgreSQL.

### 4. Sincronizar o Banco e Popular Dados (Seed)

```bash
# Sincronizar o schema com o banco
npm run db:push

# Popular com dados de exemplo (usuários, receitas e cadernos)
npm run db:seed
```

### 5. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse no seu navegador: **`http://localhost:3000`**

---

## 📄 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor Next.js em modo desenvolvimento |
| `npm run build` | Compila o projeto para produção e valida tipos |
| `npm run start` | Inicia o servidor em modo produção |
| `npm run lint` | Executa a verificação estática de tipos (`tsc --noEmit`) |
| `npm run db:generate` | Gera os tipos do Prisma Client |
| `npm run db:push` | Sincroniza o schema diretamente com o PostgreSQL |
| `npm run db:migrate` | Cria e executa migrações do Prisma |
| `npm run db:seed` | Popula o banco com receitas e cadernos de teste |
| `npm run db:studio` | Abre o painel visual do Prisma Studio no navegador |

---

## 💖 Como Apoiar o Projeto

O Caderno de Delícias é sustentado pelo carinho da comunidade. Conheça as formas de apoiar na página `/doar`:

- **Chave Pix (Aleatória)**: `782b5623-0afa-4035-bbb6-7452045fddf3`
- **GitHub Sponsors**: Apoio contínuo aos mantenedores de código aberto
- **Transparência**: Veja nosso plano de custos e metas em [`/docs/MONETIZATION.md`](docs/MONETIZATION.md) e na seção `/doar#transparencia`

---

## 📜 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [`LICENSE`](LICENSE) para mais detalhes.
