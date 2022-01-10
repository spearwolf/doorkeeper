FROM node:16-alpine

WORKDIR /app

COPY lib /app/lib
COPY scripts /app/scripts

COPY package*.json /app/
COPY doorkeeper.js /app/
COPY nodemon.json /app/

RUN npm install --only=production

ENV NODE_ENV production

RUN mkdir -p /app/config
COPY config/default.json /app/config/
COPY config/custom-environment-variables.json /app/config/
COPY config/production.json /app/config/
COPY config/users.json /app/config/

RUN mkdir -p /app/keys
COPY keys/private.pem /app/keys/private.pem
COPY keys/public.pem /app/keys/public.pem

EXPOSE 6100
CMD npm exec nodemon
