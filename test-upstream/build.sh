#! /bin/bash

set -o errexit
cd "$(dirname "$0")"

cd ../test-upstream
docker build -t backfuzzer-test-upstream .
