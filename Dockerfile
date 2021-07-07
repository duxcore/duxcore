# -------- Step 1 - Base node --------

FROM node:alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /duxcore
COPY package.json yarn.lock ./
COPY frontend/package.json ./frontend/
COPY wrapper/package.json ./wrapper/

# -------- Step 2 - Dependencies --------

FROM base AS dependencies

# Ideally this would have --frozen-lockfile, but it crashes for some reason
RUN yarn install

# -------- Step 3 - Build wrapper --------

FROM base AS wrapper-builder

COPY wrapper ./wrapper
COPY --from=dependencies /duxcore/node_modules ./node_modules

WORKDIR /duxcore/wrapper
RUN yarn build

# -------- Step 4 - Build frontend --------

FROM base AS frontend-builder

COPY frontend ./frontend
COPY --from=wrapper-builder /duxcore/wrapper/lib ./wrapper/lib
COPY --from=dependencies /duxcore/node_modules ./node_modules

WORKDIR /duxcore/frontend
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# -------- Step 5 - Start frontend --------

FROM node:alpine as frontend-runner

WORKDIR /duxcore

# Copy wrapper
COPY --from=wrapper-builder /duxcore/wrapper/lib ./wrapper/lib

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=frontend-builder /duxcore/frontend/public ./frontend/public
COPY --from=frontend-builder --chown=nextjs:nodejs /duxcore/frontend/.next ./frontend/.next
COPY --from=frontend-builder /duxcore/node_modules ./node_modules
COPY --from=frontend-builder /duxcore/frontend/package.json ./frontend/package.json

USER nextjs

WORKDIR /duxcore/frontend

EXPOSE 3000

CMD [ "yarn", "start" ]



