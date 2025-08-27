# OpenAPI Ingestion & SDK Publishing Pipeline

This document describes the new automated pipeline for ingesting OpenAPI specifications from the platform and publishing SDKs.

## Overview

The pipeline replaces the previous dynamic OpenAPI generation system with a **code-first contract pipeline** where:

1. **Platform** (bondmcp-platform) is the authoritative source for OpenAPI specifications
2. **Docs/SDK repo** (bondmcp/mcp) is the distribution point for immutable versioned snapshots and auto-generated SDKs

## How It Works

### 1. Platform Dispatch

The platform repository dispatches `repository_dispatch` events with type `openapi_spec_updated` containing:

```json
{
  "version": "1.2.3",
  "checksum": "sha256_hash_of_spec",
  "spec_url": "https://api.bondmcp.com/openapi.json"
}
```

### 2. Automatic Ingestion

The `.github/workflows/openapi-ingestion.yml` workflow:

1. **Downloads** the OpenAPI spec from the provided URL
2. **Verifies** the checksum for integrity
3. **Validates** the OpenAPI specification
4. **Stores** an immutable snapshot in `openapi/history/openapi-<version>.json`
5. **Updates** `openapi/latest.json` with current version metadata

### 3. Semantic Diff Generation

For each new version:

- Generates JSON and Markdown semantic diffs: `openapi/history/diff-<from>-to-<to>.{json,md}`
- Creates migration notes stub: `MIGRATIONS/<from>-to-<to>.md`

### 4. SDK Generation & Publishing

Automatically generates and publishes:

- **TypeScript SDK** (`@bondmcp/sdk`) to npm
- **Python SDK** (`bondmcp_sdk`) to PyPI

### 5. Documentation Updates

Updates:
- `CHANGELOG.md` with version history
- `docs/api/changelog.md` with API changes
- Migration guides in `MIGRATIONS/`

## Directory Structure

```
openapi/
├── latest.json                      # Current version metadata
└── history/
    ├── openapi-1.0.0.json          # Immutable version snapshots
    ├── openapi-1.1.0.json
    ├── diff-1.0.0-to-1.1.0.json    # Semantic diffs (JSON)
    └── diff-1.0.0-to-1.1.0.md      # Semantic diffs (Markdown)

MIGRATIONS/
├── README.md                        # Migration guide overview
└── 1.0.0-to-1.1.0.md               # Version-specific migration guides

docs/api/
└── changelog.md                     # API changelog
```

## Secrets Configuration

The workflow requires these GitHub Secrets:

- `NPM_TOKEN`: npm authentication token for publishing TypeScript SDK
- `PYPI_TOKEN`: PyPI authentication token for publishing Python SDK

If tokens are not present, publishing is skipped with a warning.

## Manual Testing

### Simulate Repository Dispatch

```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/bondmcp/mcp/dispatches \
  -d '{"event_type":"openapi_spec_updated","client_payload":{"version":"1.0.1","checksum":"sha256_here","spec_url":"https://api.bondmcp.com/openapi.json"}}'
```

### Manual Workflow Trigger

Use GitHub Actions UI with:
- Version: `1.0.1`
- Spec URL: `https://api.bondmcp.com/openapi.json`
- Checksum: (calculate from actual spec)

### Test Utilities

```bash
# Test the pipeline utilities
node scripts/test-pipeline.js test

# Validate an OpenAPI spec
node scripts/openapi-utils.js validate spec.json

# List available versions
node scripts/openapi-utils.js list

# Generate semantic diff
node scripts/openapi-utils.js diff 1.0.0 1.1.0

# Test SDK generation (requires tools)
node scripts/sdk-generator.js all openapi/latest.json 1.0.0
```

## Migration from Old System

### Deprecated Workflows

The following workflows are deprecated:
- `.github/workflows/openapi-generation.yml` (dynamic generation)
- `.github/workflows/openapi-s3-to-repo-sync.yml` (S3 sync)

They are disabled by default but can be manually triggered for backward compatibility.

### Transition Plan

1. **Phase 1**: New pipeline operates alongside existing system
2. **Phase 2**: Platform integration complete, old system disabled
3. **Phase 3**: Remove deprecated workflows and scripts

## SDK Publishing

### TypeScript SDK (@bondmcp/sdk)

- Generated from OpenAPI spec using `openapi-generator-cli`
- Built with TypeScript and bundled with `tsup`
- Published to npm with public access
- Includes type definitions and ESM/CJS support

### Python SDK (bondmcp_sdk)

- Generated from OpenAPI spec using `openapi-generator-cli`
- Built with `hatch` build system
- Published to PyPI
- Includes type hints and dataclasses

## Error Handling

The workflow includes comprehensive error handling:

- **Checksum verification** prevents corrupted specs
- **Version deduplication** prevents duplicate processing
- **Validation** ensures spec quality
- **Graceful fallbacks** when optional tools/tokens missing
- **Detailed logging** for troubleshooting

## Monitoring

Success/failure notifications are logged in workflow output. Key metrics:

- Processing time per version
- SDK build/publish success rates
- Diff generation success
- Documentation update completion

## Support

For issues with the ingestion pipeline:

1. Check workflow logs in GitHub Actions
2. Review `scripts/test-pipeline.js` output
3. Validate OpenAPI spec manually
4. Contact BondMCP team: support@bondmcp.com