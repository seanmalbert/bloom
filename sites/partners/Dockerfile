# TODO bump node version to latest LTS
FROM node:12.22.1

WORKDIR /app
EXPOSE 3001

# RUN npm install -g sass

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

# install necessary dependencies
RUN yarn install

COPY . /app

# copy ui-components
COPY --from=bloom_ui-components /app/ ./ui-components

CMD ["yarn", "dev"]
