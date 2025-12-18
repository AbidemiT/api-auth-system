FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Push schema and start
CMD ["sh", "-c", "npx prisma db push --accept-data-loss --skip-generate && npx ts-node src/index.ts"]