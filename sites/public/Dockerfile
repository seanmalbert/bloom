# TODO bump node version to latest LTS
FROM node:12.22.1

# RUN npm install -g sass

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock


# install necessary dependencies
RUN ls
RUN cd /app && yarn install

EXPOSE 3000

# copy ui-components
COPY --from=bloom_ui-components /app/ /app/ui-components
RUN cd /app/ui-components && npm link
COPY . /app

WORKDIR /app

CMD ["yarn", "dev"]
