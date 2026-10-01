#!/bin/sh
set -e

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

echo "==> 🚀 Iniciando Caderno de Delícias (Next.js Standalone)..."
exec "$@"