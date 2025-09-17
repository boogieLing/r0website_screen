#!/bin/bash

docker container stop r0website_screen; docker container rm r0website_screen ; docker image rm r0website_screen;

docker build -f ./Dockerfile -t r0website_screen . &&
docker run --name r0website_screen -d -p 3001:3000 r0website_screen:latest

docker container ls -a

# chmod +x ./docker-build.sh && ./docker-build.sh