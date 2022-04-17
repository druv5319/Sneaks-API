dockerfile
# specify the node base image with your desired version node:<version>
FROM node:16
# replace this with your application's default port
EXPOSE 8888

console
$ docker build -t my-nodejs-app .
$ docker run -it --rm --name my-running-app my-nodejs-app

yml
version: "2"
services:
  node:
    image: "node:8"
    user: "node"
    working_dir: /home/node/app
    environment:
      - NODE_ENV=production
    volumes:
      - ./:/home/node/app
    expose:
      - "8081"
    command: "npm start"

    console
$ docker-compose up -d
