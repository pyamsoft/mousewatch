FROM node:24-slim

WORKDIR /mousewatch

# Permissive umask
RUN umask 0022

# Copy src files
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY eslint.config.mjs ./
COPY src ./src

# Copy environment for production
COPY .env.prod ./.env

# Build
RUN corepack enable && pnpm install

# run
CMD [ "pnpm", "start" ]
