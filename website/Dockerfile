FROM node:16
WORKDIR /usr/duxcore-website

COPY package.json .
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000

CMD yarn start
