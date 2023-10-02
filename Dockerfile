FROM node:18-slim

WORKDIR /mousewatch

RUN umask 0022

COPY package.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY .eslintrc.cjs ./
COPY .env.prod ./.env
COPY src ./src

RUN chmod 644 .env && yarn && yarn build

CMD [ "node", "./dist/index.js" ]
