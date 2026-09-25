FROM node:20-alpine

WORKDIR /app

# OpenSSL e bibliotecas nativas para o Prisma no Alpine Linux
RUN apk add --no-cache openssl libc6-compat

# Manifestos e configurações do monorepo
COPY package.json package-lock.json .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/landing/package.json ./apps/landing/
COPY packages/database/package.json ./packages/database/

# Instalação limpa com flags de compatibilidade
RUN npm install --legacy-peer-deps

# Copia código do backend e banco de dados
COPY packages/database ./packages/database
COPY apps/api ./apps/api
COPY tsconfig.json ./

# Gera o cliente Prisma com os binários Linux
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["npx", "tsx", "apps/api/src/server.ts"]
