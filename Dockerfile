# 1. Base com dependências de sistema necessárias para Prisma/Alpine (OpenSSL 3 e libc)
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# 2. Instalação das dependências
FROM base AS deps
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else npm install; \
  fi

# 3. Build do Next.js e geração do Prisma Client
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Gera o client do Prisma antes do build do Next
RUN npx prisma generate
RUN npm run build

# 4. Runner de produção super enxuto (~150MB)
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ferramentas globais para migrações e seed
RUN npm install -g prisma@6.4.1 tsx@4.23.15

# Usuário de sistema sem privilégios para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Cria diretório de uploads com permissão correta
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

# Copia dependências auxiliares para seed e runtime
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/bcryptjs ./node_modules/bcryptjs

# Copia os artefatos gerados pelo Next.js Standalone
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copia schema e migrations do Prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Script de entrada para migrações automáticas
COPY --chown=nextjs:nodejs entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

USER nextjs

EXPOSE 3000

# Execução nativa otimizada via entrypoint
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]