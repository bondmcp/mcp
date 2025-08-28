# Contract Utilities

This directory contains utility scripts for contract ingestion and SDK generation workflows.

## Scripts

### normalize_spec.ts

Normalizes OpenAPI specifications for diff stability by:

- Recursively sorting object keys
- Removing volatile metadata fields (timestamps, build info, etc.)
- Cleaning version-specific information

**Usage:**

```bash
# Normalize in place
./scripts/contract/normalize_spec.sh openapi/latest.json

# Normalize to new file
./scripts/contract/normalize_spec.sh openapi/latest.json openapi/normalized.json

# Using TypeScript directly
npx ts-node scripts/contract/normalize_spec.ts spec/openapi.json
```

**Removed Fields:**

- `x-generated-at`
- `x-timestamp`
- `x-build-time`
- `x-commit-sha`
- `x-pipeline-id`
- `x-generation-timestamp`

### publish_preflight.ts

Checks for duplicate package versions before publishing to prevent collisions.

**Usage:**

```bash
# Auto-detect packages from project files
./scripts/contract/publish_preflight.sh --auto

# Check specific npm package
./scripts/contract/publish_preflight.sh --npm @bondmcp/sdk@1.0.0

# Check specific PyPI package
./scripts/contract/publish_preflight.sh --pypi bondmcp-sdk@1.0.0

# Check both
./scripts/contract/publish_preflight.sh --npm @bondmcp/sdk@1.0.0 --pypi bondmcp-sdk@1.0.0
```

**Exit Codes:**

- `0`: Safe to publish (package versions don't exist)
- `20`: Package version(s) already exist (skip publish gracefully)
- `1`: Error occurred during check

**Auto-Detection:**
The script automatically detects packages from:

- `package.json` files (npm packages)
- `pyproject.toml` files (PyPI packages)

## Integration with Workflows

These scripts are designed to be used in GitHub Actions workflows:

```yaml
- name: Normalize OpenAPI specification
  run: ./scripts/contract/normalize_spec.sh openapi/latest.json

- name: Check for duplicate packages
  id: preflight
  run: ./scripts/contract/publish_preflight.sh --auto
  continue-on-error: true

- name: Skip publish if package exists
  if: steps.preflight.outputs.exit_code == '20'
  run: echo "Package already exists, skipping publish"

- name: Publish packages
  if: steps.preflight.outputs.exit_code == '0'
  run: npm publish
```

## Dependencies

- Node.js 18+
- TypeScript (`npx ts-node`)
- Internet connection (for package registry checks)
