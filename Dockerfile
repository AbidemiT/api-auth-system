FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy everything and build
COPY . .
RUN npx prisma generate
RUN yarn build

# Final production cleanup
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline

# Setup entrypoint
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Align with your dev port
EXPOSE 3001

# JSON format prevents the shell-wrapping issue
ENTRYPOINT ["entrypoint.sh"]