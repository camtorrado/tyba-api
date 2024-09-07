FROM node:20.17.0-alpine3.19

RUN npm install -g ts-node
WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN npm install
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
