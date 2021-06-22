FROM node:14 AS base

WORKDIR /usr/duxcore-backend
COPY package.json .env ./

FROM base AS dependencies

RUN yarn install --prod
RUN cp -R node_modules prod_node_modules
RUN yarn install

FROM base as release
COPY --from=dependencies /usr/duxcore-backend/prod_node_modules ./node_modules
COPY . .

RUN yarn build
CMD npx prisma db push && yarn start