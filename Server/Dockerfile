FROM node:20.6.0-alpine

WORKDIR /usr/app

COPY package* .

RUN npm install

COPY . .

EXPOSE 9000

CMD ["node","app.js"]

