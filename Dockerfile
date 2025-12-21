FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY . .
RUN npx prisma generate
RUN yarn build

RUN yarn install --frozen-lockfile --production=true

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/index.js"]