#!/usr/bin/env bash
set -e
pushd ./backend
mvn clean quarkus:dev
popd
pushd ./docker-compose
. ./start.sh
popd