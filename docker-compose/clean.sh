#!/usr/bin/env bash
# reset your docker to a clean state

docker container prune --force
docker image prune --force
docker volume prune --force
IMAGES=$(docker images -q)
for image in $IMAGES
do
    docker rmi -f $image
done

VOLUMES=$(docker volume ls -q)
for volume in $VOLUMES
do
    docker volume rm $volume
done

docker container ls
docker image ls
docker volume ls
