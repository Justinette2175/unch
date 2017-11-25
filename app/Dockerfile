FROM node:4.4.7

#configure node
RUN mkdir /node
RUN npm install nodemon -g
ADD package.json /node/package.json
WORKDIR /node
RUN npm install
ENV NODE_PATH=/node/node_modules

#configure app
RUN mkdir /app
WORKDIR /app
ADD nodemon.json /app/nodemon.json
EXPOSE 8080

#run nodemon on container start
CMD ["nodemon", "/app/server.js", "-L"]
