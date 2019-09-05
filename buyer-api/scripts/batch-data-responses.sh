#!/bin/bash
curl -H "Authorization: Bearer $1" \
     -H "Content-Type: application/json" \
     -X POST "$2/batch-data-responses"
