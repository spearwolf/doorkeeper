FROM node:16-alpine

WORKDIR /app

COPY config /app/config
COPY lib /app/lib
COPY scripts /app/scripts

COPY package*.json /app/
COPY doorkeeper.js /app/
COPY nodemon.json /app/

RUN npm install

ENV NODE_ENV production

RUN mkdir -p /app/keys
COPY keys/private-dev.pem /app/keys/private.pem
COPY keys/public-dev.pem /app/keys/public.pem

EXPOSE 6100
CMD npm start
