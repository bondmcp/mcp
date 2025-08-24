#!/bin/bash
# Wrapper script for publish_preflight.ts
cd "$(dirname "$0")/../.." && npx ts-node scripts/contract/publish_preflight.ts "$@"