#!/bin/bash

K8S_DIR="."

echo "🔍 Suche Kubernetes YAML-Dateien in $K8S_DIR ..."
YAML_FILES=$(ls $K8S_DIR/*.yaml)

echo "🗑️   Lösche bestehende Deployments..."
for FILE in $YAML_FILES; do
    echo "kubectl delete -f $FILE"
    kubectl delete -f "$FILE" --ignore-not-found
done

echo ""
echo "🚀  Rolle YAML-Dateien neu aus..."
for FILE in $YAML_FILES; do
    echo "kubectl apply -f $FILE"
    kubectl apply -f "$FILE"
done

echo ""
echo "✅ Fertig!"
