FROM node:20.17.0-alpine3.19

RUN npm install -g ts-node
WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

ENV DATABASE_URL="postgresql://postgres:tyba04@db:5432/postgres?schema=public"
ENV JWT_SECRET="e3d225c799cc83055610f4dcd48a142c06f12acae74a2e5388cf9a47d3ba4e47"
ENV JWT_ACCESS_TOKEN_EXPIRE_TIME="1h"
ENV HERE_API_KEY="rkFSysgg43J9IMWsKnfvzSfSzgvQ6EGEZaZoW7cJgwk"

RUN npm install
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
