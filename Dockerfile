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

RUN apk add --no-cache libcap

WORKDIR /home/app

COPY package.json ./

RUN npm install --only=production
RUN npm install -g pm2

COPY --from=appBuild /home/app/build .

ENV PORT=80 NODE_ENV=PROD

# Set the privileges for our built app executable to run on privileged ports
RUN setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

RUN chown -R node:node /home/app
USER node

EXPOSE 80

CMD ["pm2-runtime", "index.js"]