FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN yarn build

# Clean up dev deps BUT keep prisma if it's in dependencies
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# This is the "JSON Args" form recommended by Docker
ENTRYPOINT ["entrypoint.sh"]