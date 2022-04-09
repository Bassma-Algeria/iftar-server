FROM node:latest
WORKDIR /home/app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build


FROM node:latest
WORKDIR /home/app
COPY package.json ./
RUN npm install --only=production
COPY --from=0 /build .
RUN npm install pm2 -g
EXPOSE 80
CMD ["pm2-runtime","index.js"]