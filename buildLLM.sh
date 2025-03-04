#!/bin/bash

    # Load environment variables
    source .env

    pushd ./backend/src/main/opensearch

    # Step 2: Setup the Plugin
    echo "Setting up the plugin..."
    curl -X PUT "http://localhost:9200/_cluster/settings" -H "Content-Type: application/json" -d '{
      "persistent": {
        "plugins.ml_commons.memory_feature_enabled": true,
        "plugins.ml_commons.rag_pipeline_feature_enabled": true
      }
    }'

    sleep 1

    # Step 3: Create a Connector for OpenAI Chat and get the connector_id
    echo "Creating a connector for OpenAI Chat..."
    CONNECTOR_RESPONSE=$(curl -s -X POST "http://localhost:9200/_plugins/_ml/connectors/_create" \
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
    MODEL_RESPONSE=$(curl -s -X POST "http://localhost:9200/_plugins/_ml/models/_register" \
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
    curl -X POST "http://localhost:9200/_plugins/_ml/models/$MODEL_ID/_deploy"

    sleep 1

    # Step 7: Create a Search Pipeline
    echo "Creating a search pipeline..."
    curl -X PUT "http://localhost:9200/_search/pipeline/rag_pipeline" -H "Content-Type: application/json" -d "{
      \"response_processors\": [
        {
          \"retrieval_augmented_generation\": {
            \"tag\": \"openai_pipeline_eisbaer\",
            \"description\": \"Pipeline Using OpenAI Connector\",
            \"model_id\": \"$MODEL_ID\",
            \"context_field_list\": [\"text\"],
            \"system_prompt\": \"You are a helpful assistent\",
            \"user_instructions\": \"Generate a concise and informative answer in less than 75 words for the given question in german. Your primary role is to provide answers exclusively based on the information.   1. Reference Restriction: You must only use the content from the provided documents to generate your responses. Do not incorporate any general knowledge, common facts, or information not explicitly mentioned in the documents. 2. Information Confirmation: Before answering any question, you must first verify whether the information is present within the documents. If the required information is not found in the files, respond with: - Tut mir leid, darüber habe ich keine Informationen 4. Clarification and Transparency: If the document provides information that might be different or context-specific (e.g., boiling point of water in a specific location), include this context in your response to ensure accuracy. 5. No Guessing: If a question cannot be answered based on the documents alone, do not guess or provide speculative answers. Instead, acknowledge the limitation by stating- Tut mir leid, darüber habe ich keine Informationen. - User Question: Wer ist Antonio Vivaldi? - Appropriate Response: Tut mir leid, darüber habe ich keine Informationen. - User Question: Wo ist die Gestellschraube - Appropriate Response: Die Gestellschraube befindet sich am Stellplatz ... (insert the Stellplatz here) - By following these instructions, you will ensure that all outputs are strictly aligned with the information within the provided documents, avoiding any use of external or general knowledge. If multiple products are in the database that fit the asked name, dont say the Stellplatz and list items to the user and tell them, that they should ask for a specific item. 6. If the user asks for an item, that is not present in the provided documents or does not have a Stellplatz asigned to it, dont come up with any inaccurate answers, but acknowledge the limitations ans say: Tut mir leid, darüber habe ich keine Informationen. 7. If the user asks for a product, in your answer, you should never include any other locational data other than the Stellplatz that you can find in the provided documents. Do not up with a Stellplatz on your own. \"
          }
        }
      ]
    }"

    sleep 1

    # Step 8: Ingest RAG Data into the Index
    echo "Ingesting RAG data into the index..."
    curl -X PUT "http://localhost:9200/eisbaer_rag_data" -H "Content-Type: application/json" -d '{
      "settings": {
        "index.search.default_pipeline" : "rag_pipeline"
      },
      "mappings": {
        "properties": {
          "text": {
            "type": "text"
          }
        }
      }
    }'

    sleep 1

    # Step 9: Upload Data
    echo "Uploading data..."
    curl -X POST "http://localhost:9200/eisbaer_rag_data/_bulk" -H "Content-Type: application/json" --data-binary @bulk_data_llm

    echo "All requests executed."

    popd || exit
