# TODO bump node version to latest LTS
FROM node:12.22.1

ENV APP_HOME /app

WORKDIR ${APP_HOME}

RUN npm install -g sass

COPY package.json ${APP_HOME}/package.json

# install necessary dependencies
RUN yarn install

# copy configs
COPY .env ${APP_HOME}/.env
COPY next.config.js ${APP_HOME}/next.config.js
COPY tailwind.config.js ${APP_HOME}/tailwind.config.js
COPY tsconfig.json ${APP_HOME}/tsconfig.json

# copy dirs
COPY layouts ${APP_HOME}/layouts
COPY lib ${APP_HOME}/lib
COPY page_content ${APP_HOME}/page_content
COPY pages ${APP_HOME}/pages
COPY public ${APP_HOME}/public
COPY src ${APP_HOME}/src

CMD ["yarn", "dev"]
