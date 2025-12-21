FROM node:20-alpine

WORKDIR /app

# 1. Install all dependencies (including devDeps for building)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2. Copy source and generate Prisma Client
COPY . .
RUN npx prisma generate
RUN yarn build

# 3. Prune dev dependencies (Optional but recommended for size)
# We use --production and --ignore-scripts to keep the build artifacts (dist) safe
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline

# 4. Setup Entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3001

# This JSON format satisfies the Docker build-check
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]