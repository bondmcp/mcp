# OpenAPI Ingestion Pipeline Examples

This document provides practical examples of using the new OpenAPI ingestion and SDK publishing pipeline.

## Quick Start

### 1. Check Current Version

```bash
# Get the latest OpenAPI version
node scripts/openapi-utils.js latest

# List all available versions
node scripts/openapi-utils.js list
```

### 2. Validate an OpenAPI Spec

```bash
# Validate a local spec
node scripts/openapi-utils.js validate spec/openapi.json

# Calculate checksum for verification
node scripts/openapi-utils.js checksum spec/openapi.json
```

### 3. Generate Semantic Diff

```bash
# Compare two versions
node scripts/openapi-utils.js diff 1.0.0 1.1.0

# Generate migration notes
node scripts/openapi-utils.js migration 1.0.0 1.1.0
```

## Triggering the Pipeline

### Repository Dispatch Event

The platform can trigger the ingestion pipeline using GitHub's repository dispatch API:

```bash
#!/bin/bash
GITHUB_TOKEN="your_github_token"
VERSION="1.2.0"
SPEC_URL="https://api.bondmcp.com/openapi.json"

# Calculate checksum of the spec
CHECKSUM=$(curl -s "$SPEC_URL" | sha256sum | cut -d' ' -f1)

# Trigger the workflow
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/bondmcp/mcp/dispatches \
  -d "{
    \"event_type\": \"openapi_spec_updated\",
    \"client_payload\": {
      \"version\": \"$VERSION\",
      \"checksum\": \"$CHECKSUM\",
      \"spec_url\": \"$SPEC_URL\"
    }
  }"
```

### Manual Workflow Trigger

You can also trigger the workflow manually via GitHub Actions UI:

1. Go to GitHub Actions → OpenAPI Spec Ingestion & SDK Publishing
2. Click "Run workflow"
3. Enter:
   - **Version**: `1.2.0`
   - **Spec URL**: `https://api.bondmcp.com/openapi.json`
   - **Checksum**: `sha256_hash_of_spec`

## SDK Development

### Build SDKs Locally

```bash
# Check build environment
node scripts/build-sdks.js check

# Build both TypeScript and Python SDKs
node scripts/build-sdks.js all

# Build only TypeScript SDK
node scripts/build-sdks.js typescript

# Build only Python SDK  
node scripts/build-sdks.js python

# Test SDK imports
node scripts/build-sdks.js test

# Clean build artifacts
node scripts/build-sdks.js clean
```

### Generate SDKs from OpenAPI Spec

```bash
# Generate both SDKs from latest spec
node scripts/sdk-generator.js all openapi/latest.json 1.0.0

# Generate only TypeScript SDK
node scripts/sdk-generator.js typescript openapi/latest.json 1.0.0

# Generate only Python SDK
node scripts/sdk-generator.js python openapi/latest.json 1.0.0
```

## Using Generated SDKs

### TypeScript SDK

```typescript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'your-api-key'
});

// Ask a health question
const response = await client.health.ask({
  question: 'What are the symptoms of diabetes?',
  detailed: true
});

console.log(response.answer);
console.log(`Trust Score: ${response.trustScore}`);
```

### Python SDK

```python
from bondmcp_sdk import BondMCPClient

client = BondMCPClient(api_key='your-api-key')

# Ask a health question
response = client.health.ask(
    question='What are the symptoms of diabetes?',
    detailed=True
)

print(response.answer)
print(f'Trust Score: {response.trust_score}')
```

## Pipeline Monitoring

### Check Pipeline Status

```bash
# Test pipeline utilities
node scripts/test-pipeline.js test

# Show simulation instructions
node scripts/test-pipeline.js simulate
```

### View Generated Files

```bash
# Latest version metadata
cat openapi/latest.json

# Version history
ls openapi/history/

# Migration notes
ls MIGRATIONS/

# API changelog
cat docs/api/changelog.md
```

## Workflow Integration

### Platform Integration (bondmcp-platform)

When the platform updates its OpenAPI spec, it should:

1. Generate the new OpenAPI specification
2. Calculate SHA256 checksum
3. Deploy spec to public URL
4. Dispatch repository event to trigger ingestion

Example platform code:

```javascript
// In bondmcp-platform
const crypto = require('crypto');
const { Octokit } = require('@octokit/rest');

async function dispatchOpenAPIUpdate(version, specContent, specUrl) {
  const checksum = crypto.createHash('sha256')
    .update(specContent)
    .digest('hex');
  
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  await octokit.rest.repos.createDispatchEvent({
    owner: 'bondmcp',
    repo: 'mcp',
    event_type: 'openapi_spec_updated',
    client_payload: {
      version,
      checksum,
      spec_url: specUrl
    }
  });
}
```

## Error Handling

### Common Issues

1. **Checksum Mismatch**: Spec content doesn't match expected checksum
   - Solution: Recalculate checksum and retry

2. **Version Already Exists**: Attempting to ingest duplicate version
   - Solution: Use a new version number

3. **Invalid OpenAPI Spec**: Specification fails validation
   - Solution: Fix spec issues and retry

4. **SDK Generation Failure**: Tools not available or spec incompatible
   - Solution: Check dependencies and spec compatibility

### Debugging

```bash
# Enable verbose logging
export DEBUG=1

# Run utilities with detailed output
node scripts/test-pipeline.js test
```

## Migration Guide

When upgrading from the old dynamic generation system:

1. **Phase 1**: Both systems run in parallel
2. **Phase 2**: New system primary, old system fallback
3. **Phase 3**: Remove old system entirely

The deprecated workflows can still be triggered manually if needed:

```bash
# Manually trigger deprecated workflow
gh workflow run openapi-generation.yml --field force_run=true
```

## Best Practices

1. **Version Semantics**: Use semantic versioning (major.minor.patch)
2. **Breaking Changes**: Document in migration notes
3. **Testing**: Validate specs before dispatching
4. **Monitoring**: Check workflow success/failure
5. **Rollback**: Keep previous versions available

## Support

For issues with the ingestion pipeline:

- **Documentation**: [docs/openapi-pipeline.md](openapi-pipeline.md)
- **Testing**: `node scripts/test-pipeline.js test`
- **Support**: support@bondmcp.com