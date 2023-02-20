FROM node:16

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn

COPY . /app

EXPOSE 6006

CMD yarn storybook


