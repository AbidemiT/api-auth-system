FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy prisma schema
COPY prisma ./prisma/

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start command
CMD ["sh", "-c", "npx ts-node src/index.ts"]
