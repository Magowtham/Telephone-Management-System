FROM mhart/alpine-node

RUN mkdir app

COPY package.json /app/

RUN npm cache clean --force

RUN cd app

RUN npm install

RUN cd ..

COPY . /app/

RUN cd app

EXPOSE 9000

CMD ["node", "app.js"]

