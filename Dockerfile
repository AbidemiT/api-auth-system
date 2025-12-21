FROM node:20-alpine

WORKDIR /app

# Install all deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN npx prisma generate
RUN yarn build

# Clean up dev dependencies (ONLY if prisma is in 'dependencies')
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline

# Final script setup
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3001

# JSON form for Docker Build Checks
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]