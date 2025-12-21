FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN yarn build

RUN yarn install --frozen-lockfile --production=true

EXPOSE 3000

CMD npx prisma migrate deploy && node dist/src/index.js