#! /bin/bash

set -o errexit
cd "$(dirname "$0")"

docker run -t  --name backfuzzer-test-upstream  --rm -p 4444:4000 backfuzzer-test-upstream 
