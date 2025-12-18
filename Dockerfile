FROM node:24-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy all source files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript and show what was created
RUN echo "🔨 Building TypeScript..." && \
    yarn build && \
    echo "📁 Build output:" && \
    ls -la dist/ && \
    echo "📁 dist/src contents:" && \
    ls -la dist/src/ || echo "❌ dist/src does not exist"

EXPOSE 3000

# Run with explicit path check
CMD sh -c "npx prisma db push --accept-data-loss --skip-generate && \
    echo '✅ Database synced' && \
    echo '📂 Checking for compiled files...' && \
    ls -la dist/src/ && \
    echo '🚀 Starting application...' && \
    node dist/src/index.js"