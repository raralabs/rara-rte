FROM node:16

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn

COPY . /app

EXPOSE 3000

CMD yarn storybook


