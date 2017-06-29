FROM node:7.2-alpine

RUN mkdir /code
WORKDIR /code

RUN npm install
RUN npm install -g supervisor

ADD . /code

CMD supervisor app.js
