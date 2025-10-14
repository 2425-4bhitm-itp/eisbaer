#!/usr/bin/env bash
echo 'downing containers...'
. ./down.sh
echo 'successfully downed containers!'
set -e
pushd ./frontend
npm install
npm run build
popd
docker build -t eisbaer-frontend:latest ./frontend
pushd ./docker-compose
. ./start.sh
popd
pushd ./backend/src/main/opensearch
until curl -s -X GET "http://localhost:9200/_cluster/health?wait_for_status=green" | grep -q "green"; do
  sleep 1
  echo 'waiting...'
done
echo 'creating index...'
curl -X PUT "http://localhost:9200/articles" -H "Content-Type: application/json" -d '{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "Bezeichnung1": {
        "type": "text"
      },
      "Bezeichnung2": {
        "type": "text"
      },
      "Laenge": {
        "type": "integer"
      },
      "Breite": {
        "type": "integer"
      },
      "Hoehe": {
        "type": "integer"
      },
      "Durchmesser": {
        "type": "integer"
      },
      "Lagerort": {
        "type": "text"
      },
      "Lagerstand": {
        "type": "float"
      },
      "LagereinheitBez": {
        "type": "keyword"
      },
      "Stellplatz": {
        "type": "text"
      }
    }
  }
}'
echo 'index created'
echo 'inserting bulk data...'
curl -X POST "http://localhost:9200/articles/_bulk" -H 'Content-Type: application/json' --data-binary @bulk_data
echo 'bulk data inserted'
echo 'searching data for GET...'
curl -X GET "http://localhost:9200/articles/_search?pretty=true&q=*"
popd
. ./buildLLM.sh
#pushd ./backend
#mvn clean quarkus:dev
#popd

#docker run -p 4200:80 eisbaer-frontend
