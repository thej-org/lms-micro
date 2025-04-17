FROM node:18-alpine

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 4003

CMD ["node", "src/index.js"]