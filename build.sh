#!/usr/bin/env bash
set -e
pushd ./docker-compose
. ./start.sh
popd
pushd ./backend
mvn clean quarkus:dev
popd
