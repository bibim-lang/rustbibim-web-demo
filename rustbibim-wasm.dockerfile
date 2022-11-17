FROM rust:1.65.0-alpine3.16

RUN apk add --no-cache libc-dev curl && curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

WORKDIR /usr/src/rustbibim-wasm
COPY rustbibim-wasm .

RUN cargo fetch

ENTRYPOINT ["wasm-pack"]