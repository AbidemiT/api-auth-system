FROM node:24-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN yarn build

EXPOSE 3000

# Capture stderr and show it
CMD sh -c "npx prisma db push --accept-data-loss --skip-generate && \
    echo '✅ Database synced' && \
    echo '🚀 Starting application...' && \
    node dist/src/index.js 2>&1 || \
    (echo '❌ Application crashed with exit code:' $? && exit 1)"