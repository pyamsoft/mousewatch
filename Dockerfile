FROM node:16

WORKDIR /mousewatch

RUN umask 0022

COPY package.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY .eslintrc.js ./
COPY .env.prod ./.env
COPY src ./src

RUN chmod 644 .env && yarn && yarn lint

CMD [ "node", "./src/index.js" ]
