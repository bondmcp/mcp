#!/bin/bash
# Wrapper script for normalize_spec.ts
cd "$(dirname "$0")/../.." && npx ts-node scripts/contract/normalize_spec.ts "$@"