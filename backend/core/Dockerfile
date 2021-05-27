# TODO bump node version to latest LTS
FROM node:12.22.1

ENV APP_HOME /app
WORKDIR ${APP_HOME}

COPY package.json ${APP_HOME}/package.json

# install necessary dependencies
RUN yarn install

# copy configs
COPY .env ${APP_HOME}/.env
COPY index.ts ${APP_HOME}/index.ts
COPY ormconfig.ts ${APP_HOME}/ormconfig.ts
COPY ormconfig.test.ts ${APP_HOME}/ormconfig.test.ts
COPY tsconfig.json ${APP_HOME}/tsconfig.json
COPY tsconfig.build.json ${APP_HOME}/tsconfig.build.json

# copy dirs
COPY src ${APP_HOME}/src
COPY types ${APP_HOME}/types

CMD ["yarn", "dev"]
