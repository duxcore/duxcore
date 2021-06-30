FROM node:14 AS base


WORKDIR /usr/duxcore-frontend
COPY . ./

FROM base AS dependencies

RUN yarn install --prod
RUN cp -R node_modules prod_node_modules
RUN yarn install