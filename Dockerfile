FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN yarn build

# Verify build output
RUN echo "=== Build output structure ===" && \
    find dist -type f -name "*.js" | head -20

# Clean dev dependencies
RUN yarn install --frozen-lockfile --production=true

EXPOSE 3000

# Start with verbose logging
CMD ["sh", "-c", "\
    echo '1️⃣ Running migrations...' && \
    npx prisma migrate deploy && \
    echo '2️⃣ Migrations complete!' && \
    echo '3️⃣ Starting Node.js server...' && \
    echo '   Node version:' $(node --version) && \
    echo '   File exists:' && ls -la dist/src/index.js && \
    echo '4️⃣ Executing server...' && \
    node dist/src/index.js \
"]