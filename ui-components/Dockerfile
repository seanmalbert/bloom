# TODO bump node version to latest LTS
FROM node:12.22.1

COPY package.json /app/package.json

# install necessary dependencies
RUN cd /app && yarn install

COPY . /app
