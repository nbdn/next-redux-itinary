FROM node:8.11.3

WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . /app

CMD [ "npm", "run", "dev" ]
