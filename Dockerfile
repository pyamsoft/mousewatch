FROM node:18-slim

WORKDIR /mousewatch

RUN umask 0022

COPY package.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .eslintrc.cjs ./
COPY .env.prod ./.env
COPY src ./src

# Enable corepack
RUN chmod 644 .env && corepack enable

# build
RUN yarn && yarn build

# run
CMD [ "node", "./dist/index.js" ]
