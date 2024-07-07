FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
USER 10014
CMD [ "node", "server.js" ]
