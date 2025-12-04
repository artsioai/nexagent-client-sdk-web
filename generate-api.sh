#!/usr/bin/env bash
set -euo pipefail

API_JSON="./api-extended-json.json"
SWAGGER_URL="https://nexagent.api.newcast.ai/openapi.json"

curl -fSL "$SWAGGER_URL" -o "$API_JSON"

if [[ "${OSTYPE:-}" == darwin* ]]; then
  sed -i '' 's/transcript\[transcriptType=\\"final\\"\]/transcript[transcriptType='\''final'\'']/g' "$API_JSON"
else
  sed -i 's/transcript\[transcriptType=\\"final\\"\]/transcript[transcriptType='\''final'\'']/g' "$API_JSON"
fi

npx swagger-typescript-api generate -p "$API_JSON" -o . -n api.ts

rm -f "$API_JSON"
