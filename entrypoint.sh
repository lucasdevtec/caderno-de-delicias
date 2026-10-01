#!/bin/sh
set -e

# Valida se a DATABASE_URL foi configurada e começa com o protocolo do PostgreSQL
case "$DATABASE_URL" in
  postgresql://*|postgres://*)
    echo "==> 🔄 Aplicando migrations do banco de dados..."
    MAX_RETRIES=10
    RETRY_COUNT=0

    until prisma migrate deploy || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
      RETRY_COUNT=$((RETRY_COUNT + 1))
      echo "==> ⏳ Aguardando banco de dados ficar pronto... tentativa ($RETRY_COUNT/$MAX_RETRIES)"
      sleep 2
    done

    if [ "$RUN_SEED" = "true" ]; then
      echo "==> 🌱 Flag RUN_SEED=true detectada: executando seed inicial..."
      prisma db seed || echo "==> ⚠️ Aviso: Seed não pôde ser executado ou já foi aplicado."
    fi
    ;;
  *)
    echo "==> ⚠️ ATENÇÃO: A variável DATABASE_URL está vazia ou não começa com postgresql:// ou postgres://"
    echo "==> Exemplo esperado: postgresql://usuario:senha@host:5432/nome_banco?schema=public"
    echo "==> Pulando execução das migrações do Prisma no momento."
    ;;
esac

echo "==> 🚀 Iniciando Caderno de Delícias (Next.js Standalone)..."
exec "$@"