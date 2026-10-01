# Guia de Configuração e Execução Local

> **Caderno de Delícias** (`cadernodedelicias.com.br`)  
> Instruções para configurar o ambiente de desenvolvimento local, banco de dados PostgreSQL e execução da aplicação.

---

## 📋 Pré-requisitos

- **Node.js**: Versão 20 LTS ou superior (recomendado 22+).
- **npm**, **pnpm** ou **yarn**.
- **PostgreSQL**: Instância local (PostgreSQL 14+) ou banco gerenciado (Supabase, Neon, Railway, Docker).

---

## ⚙️ 1. Instalação das Dependências

Clone o repositório e instale os pacotes:

```bash
npm install
```

---

## 🔑 2. Variáveis de Ambiente

Copie o arquivo de exemplo para `.env`:

```bash
cp .env.example .env
```

Principais variáveis:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | String de conexão com o banco PostgreSQL | `postgresql://user:pass@localhost:5432/caderno_delicias?schema=public` |
| `NEXTAUTH_URL` | URL base da aplicação web | `http://localhost:3000` |
| `AUTH_SECRET` | Chave secreta para assinatura dos tokens JWT | Chave aleatória de 32+ caracteres |
| `NEXT_PUBLIC_PIX_KEY` | Chave Pix oficial para apoios voluntários | UUID ou e-mail cadastrado no Banco Central |
| `GOOGLE_CLIENT_ID` | (Opcional) OAuth Google Client ID | `seu-client-id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | (Opcional) OAuth Google Client Secret | `seu-client-secret` |

---

## 🗄️ 3. Banco de Dados com Prisma

1. **Gerar os tipos do Prisma Client**:
   ```bash
   npm run db:generate
   ```

2. **Sincronizar o schema com o banco de dados**:
   ```bash
   npm run db:push
   ```
   *(Ou utilize `npm run db:migrate` para criar migrações formais em produção).*

3. **Popular o banco com receitas e cadernos de exemplo (Seed)**:
   ```bash
   npm run db:seed
   ```

4. **Visualizar e gerenciar dados no navegador (Prisma Studio)**:
   ```bash
   npm run db:studio
   ```

---

## 🚀 4. Executando a Aplicação

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🧪 5. Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local Next.js em modo desenvolvimento |
| `npm run build` | Compila o projeto e valida tipos para produção |
| `npm run start` | Inicia o servidor de produção compilado |
| `npm run lint` | Executa a verificação estática de tipos (`tsc --noEmit`) |
| `npm run db:generate` | Gera o Prisma Client com base em `prisma/schema.prisma` |
| `npm run db:push` | Atualiza o schema diretamente no PostgreSQL sem criar arquivos de migração |
| `npm run db:migrate` | Cria e aplica migrações do Prisma |
| `npm run db:seed` | Executa o script de carga inicial de receitas e cadernos (`prisma/seed.ts`) |
| `npm run db:studio` | Abre o painel visual do Prisma Studio no navegador |

---

## 🐳 6. Execução via Docker (Produção / Standalone)

Para construir a imagem de produção ultraleve (~185MB) com Alpine Linux, Next.js Standalone e migrações automáticas:

1. **Construir a imagem**:
   ```bash
   docker build -t caderno-de-delicias .
   ```

2. **Executar o container**:
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="postgresql://user:pass@host:5432/caderno_delicias?schema=public" \
     -e AUTH_SECRET="sua-chave-secreta" \
     -e RUN_SEED="false" \
     caderno-de-delicias
   ```
   *(Defina `RUN_SEED="true"` na primeira inicialização para popular automaticamente as receitas de exemplo).*
