FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN yarn build

# Clean up dev dependencies
RUN yarn install --frozen-lockfile --production=true

# Copy the entrypoint script and make it executable
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

# Use the JSON (exec) form for the ENTRYPOINT
ENTRYPOINT ["entrypoint.sh"]