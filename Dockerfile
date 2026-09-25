FROM node:20-alpine AS builder

WORKDIR /app

# OpenSSL e bibliotecas necessárias para o motor Prisma em Linux Alpine
RUN apk add --no-cache openssl libc6-compat

# Copia manifestos do monorepo
COPY package.json package-lock.json .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/landing/package.json ./apps/landing/
COPY packages/database/package.json ./packages/database/

# Instala dependências do monorepo
RUN npm install --legacy-peer-deps

# Copia código-fonte e schema do banco de dados
COPY packages/database ./packages/database
COPY apps/api ./apps/api
COPY tsconfig.json ./

# Gera cliente Prisma
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# Compila o backend da API TypeScript
RUN npm run build:api

# Estágio de Execução (Runner leve e seguro)
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/package.json /app/package-lock.json /app/.npmrc ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/apps/api ./apps/api

EXPOSE 8080

CMD ["node", "apps/api/dist/server.js"]
