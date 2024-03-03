#!/bin/sh

set -e

if [ -n "$WORKER" ]; then
  linkhub start-worker
else
  linkhub start
fi
