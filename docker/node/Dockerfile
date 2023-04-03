FROM node:16-alpine

WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

USER node

EXPOSE 3000