#!/bin/bash

set -e
set -u
HOST=https://it210176.cloud.htl-leonding.ac.at
#HOST=http://localhost:9200

    # Load environment variables
    source .env


    pushd ./backend/src/main/opensearch

    # Step 2: Setup the Plugin
    echo "Setting up the plugin..."
    curl -X PUT "$HOST/_cluster/settings" -H "Content-Type: application/json" -d '{
      "persistent": {
        "plugins.ml_commons.memory_feature_enabled": true,
        "plugins.ml_commons.rag_pipeline_feature_enabled": true
      }
    }'

    sleep 1

    # Step 3: Create a Connector for OpenAI Chat and get the connector_id
    echo "Creating a connector for OpenAI Chat..."
    CONNECTOR_RESPONSE=$(curl -s -X POST "$HOST/_plugins/_ml/connectors/_create" \
      -H "Content-Type: application/json" -d '{
      "name": "OpenAI Chat Connector",
      "description": "The connector to public OpenAI model service for GPT 3.5",
      "version": 2,
      "protocol": "http",
      "parameters": {
        "endpoint": "api.openai.com",
        "model": "gpt-3.5-turbo",
        "temperature": 0
      },
      "credential": {
        "openAI_key": "'"$OPENAI_API_KEY"'"
      },
      "actions": [
        {
          "action_type": "predict",
          "method": "POST",
          "url": "https://${parameters.endpoint}/v1/chat/completions",
          "headers": {
            "Authorization": "Bearer ${credential.openAI_key}"
          },
          "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": ${parameters.messages}, \"temperature\": ${parameters.temperature} }"
        }
      ]
    }')

    sleep 1

    # Extract the connector_id from the response
    CONNECTOR_ID=$(echo "$CONNECTOR_RESPONSE" | jq -r '.connector_id')
    echo "Connector ID: $CONNECTOR_ID"

    # Step 4: Register the Model and get the model_id
    echo "Registering the model..."
    MODEL_RESPONSE=$(curl -s -X POST "$HOST/_plugins/_ml/models/_register" \
      -H "Content-Type: application/json" -d "{
      \"name\": \"openAI-gpt-3.5-turbo\",
      \"function_name\": \"remote\",
      \"description\": \"Eisbaer OpenAI GPT 3.5 Turbo Model\",
      \"connector_id\": \"$CONNECTOR_ID\"
    }")

    sleep 1

    # Extract the model_id from the response
    MODEL_ID=$(echo "$MODEL_RESPONSE" | jq -r '.model_id')
    echo "Model ID: $MODEL_ID"

    # Step 6: Deploy the Model
    echo "Deploying the model..."
    curl -X POST "$HOST/_plugins/_ml/models/$MODEL_ID/_deploy"

    sleep 1

    # Step 7: Create a Search Pipeline
    echo "Creating a search pipeline..."

    # Read the user instructions from file
    USER_INSTRUCTIONS=$(jq -Rs . < prompt.txt)

    curl -X PUT "$HOST/_search/pipeline/rag_pipeline" \
      -H "Content-Type: application/json" \
      -d "{
        \"response_processors\": [
          {
            \"retrieval_augmented_generation\": {
              \"tag\": \"openai_pipeline_eisbaer\",
              \"description\": \"Pipeline Using OpenAI Connector\",
              \"model_id\": \"$MODEL_ID\",
              \"context_field_list\": [\"name\", \"position\", \"text\"],
              \"system_prompt\": \"You are a helpful assistant\",
              \"user_instructions\": $USER_INSTRUCTIONS
            }
          }
        ]
      }"

    sleep 1

    # Step 8: Ingest RAG Data into the Index
    echo "Ingesting RAG data into the index..."
    curl -X PUT "$HOST/eisbaer_rag_data" -H "Content-Type: application/json" -d '{
      "settings": {
        "index.search.default_pipeline" : "rag_pipeline"
      },
      "mappings": {
        "properties": {
          "name": { "type": "text" },
          "position": { "type": "text" },
          "text": { "type": "text" }
        }
      }
    }'

    sleep 1

    # Step 9: Upload Data
    echo "Uploading data..."
    curl -X POST "$HOST/eisbaer_rag_data/_bulk" -H "Content-Type: application/json" --data-binary @new_bulk_data

    echo "All requests executed."

    popd || exit
