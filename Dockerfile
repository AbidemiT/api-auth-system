FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Copy Prisma files
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src/config ./src/config

# Install ALL dependencies (including tsx for seeding)
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma
RUN npx prisma generate

# Build
RUN yarn build

# DON'T remove dev deps yet - we need tsx for seeding!

# Setup entrypoint
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["entrypoint.sh"]