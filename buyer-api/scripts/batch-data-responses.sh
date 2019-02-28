#!/bin/bash
CURL='/usr/bin/curl'
ENDPOINT="http://localhost:9100/batch-data-responses"

PWD=passphrase
if [ -z PWD_BULK_REGISTER ]
then
  PWD=$PWD_BULK_REGISTER
fi

raw="$CURL -X POST $ENDPOINT -H 'Authorization: Bearer ${PWD}' -H 'Content-Type: application/json'"

eval $raw
