FROM node:24-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy everything
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Push schema AND start app
CMD npx prisma db push --force-reset --accept-data-loss --skip-generate && npx ts-node src/index.ts