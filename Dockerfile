FROM node:24-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript
RUN yarn build

# Verify build output
RUN ls -la dist/

EXPOSE 3000

# Run compiled JavaScript
CMD ["sh", "-c", "npx prisma db push --accept-data-loss --skip-generate && node dist/src/index.js"]