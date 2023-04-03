FROM node:16-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

USER node

EXPOSE 3000