FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --production

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy application code
COPY server ./server/
COPY public ./public/

EXPOSE ${PORT:-3000}

CMD ["node", "server/index.js"]
