FROM node:20-alpine

WORKDIR /app

# ---- Optimize Docker cache ----
# 1) Copy package manifests first (cacheable layer when deps don't change)
COPY package.json yarn.lock ./

# 2) Copy only files needed by install-time scripts (prisma generate reads
#    the Prisma schema and prisma.config.ts which imports src/config).
COPY prisma/schema.prisma prisma.config.ts ./
COPY src/config ./src/config

# Install dependencies (this runs postinstall -> prisma generate)
RUN yarn install --frozen-lockfile

# 3) Copy the rest of the repository (source files, scripts)
COPY . .

# Generate Prisma client (safe no-op if already generated)
RUN npx prisma generate

# Build TypeScript
RUN yarn build

# Final production install: remove dev deps and avoid running scripts again
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline

# Setup entrypoint
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Align with your dev port
EXPOSE 3001

# JSON format prevents the shell-wrapping issue
ENTRYPOINT ["entrypoint.sh"]