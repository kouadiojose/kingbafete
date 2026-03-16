FROM node:20-alpine

WORKDIR /app

# Copy prisma schema first (needed by postinstall)
COPY prisma ./prisma/

# Install dependencies (postinstall runs prisma generate)
COPY package.json ./
RUN npm install --omit=dev

# Copy application code
COPY start.sh ./
COPY server ./server/
COPY public ./public/

EXPOSE ${PORT:-3000}

CMD ["node", "server/index.js"]
