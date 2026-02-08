FROM node:18-slim

# Prisma needs OpenSSL; slim may not have the version Prisma expects
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "src/app.js"]
