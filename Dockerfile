FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm i -g nodemon

COPY . .


CMD ["npm", "run", "dev"]