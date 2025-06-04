FROM node:22-slim

WORKDIR /mousewatch

RUN umask 0022

COPY package.json ./
COPY tsconfig.json ./

COPY pnpm-lock.yaml ./

COPY eslint.config.mjs ./

COPY .env.prod ./.env
COPY src ./src

# Enable corepack
RUN chmod 644 .env && corepack enable

# build
RUN pnpm install && pnpm run build

# run
CMD [ "node", "./dist/index.js" ]
