FROM node:20-alpine
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN yarn build

# Clean up dev dependencies
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline

# Make the entrypoint executable
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Use 3001 to match your current dev setup
EXPOSE 3001

# Correct JSON format for the build-check
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]