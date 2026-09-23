FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json package-lock.json ./
COPY packages/database ./packages/database
COPY apps/api ./apps/api

# Instalar dependências e compilar
RUN npm ci
RUN npm run build --workspace=@omni/api

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/apps/api ./apps/api

EXPOSE 8080

CMD ["npm", "run", "start", "--workspace=@omni/api"]
