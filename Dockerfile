FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy everything including migrations
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN yarn build

# Production dependencies only
RUN yarn install --frozen-lockfile --production=true

EXPOSE 3001

# Start server with proper migrations
CMD npx prisma migrate deploy && echo "✅ Migrations complete" && node dist/src/index.js