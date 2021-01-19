FROM node:14

WORKDIR /usr/src/app

COPY ./api/package.json ./api/package.json
COPY ./api/package-lock.json ./api/package-lock.json

COPY ./app/package.json ./app/package.json
COPY ./app/package-lock.json ./app/package-lock.json

WORKDIR /usr/src/app/api
RUN npm ci --loglevel verbose

WORKDIR /usr/src/app/app
RUN npm ci --loglevel verbose

COPY ./api ../api
COPY ./app .

RUN npm run build --loglevel verbose

WORKDIR /usr/src/app/api

EXPOSE 3080
CMD ["npm", "run", "dev"]
