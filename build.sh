#!/usr/bin/env bash
set -e
pushd ./backend
mvn clean package
popd
pushd ./docker-compose
. ./start.sh
popd