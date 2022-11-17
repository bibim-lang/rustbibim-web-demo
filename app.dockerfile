FROM node:19-alpine

RUN mkdir -p /home/node/rustbibim-wasm
COPY rustbibim-wasm/pkg /home/node/rustbibim-wasm
WORKDIR /home/node/rustbibim-wasm

RUN npm link

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY app/package.json app/package-lock.json ./
RUN npm ci && npm link rustbibim-wasm

COPY app .

# RUN npm run build