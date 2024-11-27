#!/usr/bin/env bash

docker compose up --detach
#docker compose logs postgres

cat << EOF


# ====== add the following to src/main/resources/quarkus.properties ======
quarkus.datasource.db-kind=postgresql
quarkus.datasource.username=demo
quarkus.datasource.password=demo
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/demo
%prod.quarkus.datasource.jdbc.url=jdbc:postgresql://postgres:5432/demo

quarkus.hibernate-orm.database.generation=drop-and-create
%prod.quarkus.hibernate-orm.database.generation=none
quarkus.hibernate-orm.database.generation.halt-on-error=false
%dev.quarkus.hibernate-orm.sql-load-script=db/import.sql
quarkus.datasource.devservices.enabled=false
quarkus.hibernate-orm.log.sql=true
quarkus.http.access-log.enabled=true
# ======


EOF

echo "to stop the database enter the following:"
echo "./down.sh"
echo "to see the postgresql logs enter the following:"
echo "docker compose logs -f postgres"
