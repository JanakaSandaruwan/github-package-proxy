FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
USER 10014
EXPOSE 5000
CMD [ "node", "server.js" ]
