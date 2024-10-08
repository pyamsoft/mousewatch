FROM node:20-slim

WORKDIR /mousewatch

RUN umask 0022

COPY package.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .eslintrc.cjs ./
COPY .env.prod ./.env
COPY src ./src

# Yarn build file
COPY .yarn/releases/yarn-*.cjs ./.yarn/releases/

# Enable corepack
RUN chmod 644 .env && corepack enable

# build
RUN yarn && yarn build

# run
CMD [ "node", "./dist/index.js" ]
