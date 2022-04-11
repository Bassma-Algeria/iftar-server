# Build Stage 1
# This build created a staging docker image
#
FROM node:16.14-alpine as appBuild

WORKDIR /home/app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm run build 


# Build Stage 2
# This build takes the production build from staging build
#
FROM node:16.14-alpine

WORKDIR /home/app

COPY package.json ./
COPY --from=appBuild /home/app/build .

RUN npm install --only=production
RUN npm install pm2 -g

EXPOSE 5000

CMD ["pm2-runtime","index.js"]