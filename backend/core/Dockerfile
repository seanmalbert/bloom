# TODO bump node version to latest LTS
FROM node:12.22.1

WORKDIR /app
EXPOSE 3100

# psql
RUN apt-get update && apt-get install -y postgresql-client

COPY package.json /app/package.json

# install necessary dependencies
RUN yarn install

COPY . /app

ENTRYPOINT ["sh", "./entrypoint.sh"]
