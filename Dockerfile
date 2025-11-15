FROM node:24-slim

WORKDIR /mousewatch

RUN umask 0022

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY eslint.config.mjs ./
COPY .env.prod ./.env
COPY src ./src

# Enable corepack
RUN chmod 644 .env && corepack enable

# build
RUN pnpm install

# run
CMD [ "pnpm", "start" ]
