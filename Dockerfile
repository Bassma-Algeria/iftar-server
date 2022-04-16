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

# Set the privileges for our built app executable to run on privileged ports
RUN apk add --no-cache libcap
RUN setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

WORKDIR /home/app

RUN mkdir /usr/local/bin/pm2 && chown -R node:node /home/app /usr/local/lib/node_modules /usr/local/bin/pm2 && chown -R u+rwx /home/app /usr/local/lib/node_modules /usr/local/bin/pm2
USER node

COPY package.json ./

RUN npm install --only=production
RUN npm install --force pm2 -g

COPY --from=appBuild /home/app/build .

EXPOSE 80

CMD ["pm2-runtime","index.js"]