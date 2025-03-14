FROM node:22.5.1-alpine3.20 as build

WORKDIR /usr

COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY src ./src
COPY prisma ./prisma/
COPY scripts ./scripts/
COPY static ./static

RUN --mount=type=cache,target=/root/.npm,sharing=locked npm ci
RUN npm run build


FROM node:22.5.1-alpine3.20 as app

WORKDIR /usr

COPY package*.json ./
COPY --from=build /usr/dist ./dist
COPY --from=build /usr/prisma ./prisma
COPY --from=build /usr/node_modules ./node_modules
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY src ./src
COPY prisma ./prisma/
COPY scripts ./scripts/
COPY static ./static

RUN --mount=type=cache,target=/root/.npm,sharing=locked npm ci --only=production


CMD ["npm","run", "start:prod"]