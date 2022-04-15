# Build Stage 1
# This build created a staging docker image
#
FROM node:16.14-alpine AS appBuild

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

RUN chown -R node:node /home
USER node

COPY package.json ./

RUN npm install --only=production
RUN npm install pm2 -g

COPY --from=appBuild /home/app/build .

EXPOSE 5000

CMD ["pm2-runtime","index.js"]