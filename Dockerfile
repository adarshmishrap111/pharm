FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .
COPY frontend/ ./frontend/

RUN mkdir -p ./frontend/assets/uploads

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]