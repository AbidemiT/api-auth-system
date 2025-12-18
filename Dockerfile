FROM node:24-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN yarn build

EXPOSE 3000

CMD sh -c "npx prisma db push --accept-data-loss --skip-generate && \
    echo '✅ Database synced' && \
    echo '📄 Checking index.js exists...' && \
    test -f dist/src/index.js && echo '✓ File exists' || echo '✗ File missing' && \
    echo '📄 First 20 lines of index.js:' && \
    head -20 dist/src/index.js && \
    echo '🚀 Starting application...' && \
    node dist/src/index.js"