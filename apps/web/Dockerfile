# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.14
FROM node:${NODE_VERSION}-slim as base

WORKDIR /app

ENV NODE_ENV="production"

ARG PUBLIC_POCKETBASE_BASE_URL
ENV PUBLIC_POCKETBASE_BASE_URL=${PUBLIC_POCKETBASE_BASE_URL}


FROM base as build

RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY --link package.json ./
COPY --link svelte.config.js ./
RUN npm install --include=dev

COPY --link . .

RUN npm run build

RUN npm prune --omit=dev

FROM base

COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app

EXPOSE 3000
CMD [ "npm", "run", "start" ]
