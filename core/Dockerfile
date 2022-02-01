FROM node:16 AS base

WORKDIR /usr/duxcore-core
COPY package.json .env ./

FROM base AS dependencies

RUN yarn install --prod
RUN cp -R node_modules prod_node_modules
RUN yarn install

FROM base as release
COPY --from=dependencies /usr/duxcore-core/prod_node_modules ./node_modules
COPY . .

RUN yarn build
CMD yarn db:migrate && yarn start