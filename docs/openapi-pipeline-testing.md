# OpenAPI Pipeline Testing & Simulation Guide

This document provides comprehensive instructions for testing the automated OpenAPI ingestion and SDK publishing pipeline.

## Quick Test Commands

### 1. Local Pipeline Testing

```bash
# Run comprehensive pipeline tests
node scripts/test-pipeline.js test

# Show simulation instructions
node scripts/test-pipeline.js simulate
```

### 2. Repository Dispatch Simulation

#### Using curl (with GitHub token)

```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/bondmcp/mcp/dispatches \
  -d '{
    "event_type": "openapi_spec_updated",
    "client_payload": {
      "version": "1.0.2",
      "checksum": "your_sha256_checksum_here",
      "spec_url": "https://api.bondmcp.com/openapi.json"
    }
  }'
```

#### Using GitHub CLI

```bash
gh api repos/bondmcp/mcp/dispatches \
  --method POST \
  --field event_type=openapi_spec_updated \
  --field client_payload='{"version":"1.0.2","checksum":"your_checksum","spec_url":"https://api.bondmcp.com/openapi.json"}'
```

### 3. Manual Workflow Trigger

1. Go to GitHub Actions tab
2. Select "OpenAPI Spec Ingestion & SDK Publishing" workflow
3. Click "Run workflow"
4. Fill in:
   - **Spec Version**: `1.0.2`
   - **Spec URL**: `https://api.bondmcp.com/openapi.json`
   - **Checksum**: Calculate using `sha256sum openapi.json`

## Verification Steps

### After Pipeline Execution

1. **Check Contract Artifacts**

```bash
# Verify immutable snapshot
ls -la openapi/history/openapi-*.json

# Check latest.json points to new version
cat openapi/latest.json

# Verify diff files generated
ls -la openapi/history/diff-*.{json,md}

# Check migration guide created
ls -la MIGRATIONS/*.md
```

2. **Verify SDK Generation**

```bash
# TypeScript SDK
ls -la javascript/src/generated/
cat javascript/package.json | grep version

# Python SDK
ls -la python/generated/
cat pyproject.toml | grep version
```

3. **Test SDK Builds**

```bash
# TypeScript
cd javascript && npm run build

# Python
python -m hatch build
```

4. **Check Documentation Updates**

```bash
# Verify changelogs updated
head -20 CHANGELOG.md
head -20 docs/api/changelog.md
```

## Test Scenarios

### Scenario 1: New Minor Version

- Add new endpoint to spec
- Version bump: 1.0.0 → 1.0.1
- Expected: Minor classification, migration guide created

### Scenario 2: Breaking Change

- Remove endpoint or change required parameters
- Version bump: 1.0.0 → 2.0.0
- Expected: Major classification, detailed migration guide

### Scenario 3: Patch Version

- Fix typos, improve descriptions
- Version bump: 1.0.0 → 1.0.1
- Expected: Patch classification, minimal changes

### Scenario 4: Duplicate Version

- Resend same version and checksum
- Expected: "Version already exists, skipping ingestion"

### Scenario 5: Checksum Mismatch

- Send different checksum for same spec
- Expected: Workflow fails with checksum error

## Expected Outcomes

### ✅ Success Indicators

- Workflow completes without errors
- All artifacts created in correct locations
- SDK versions match spec version
- Builds succeed for both TypeScript and Python
- Documentation updated correctly
- No duplicate publishes attempted

### ⚠️ Warning Indicators

- Network timeouts (common in CI)
- Missing publish tokens (expected if not configured)
- Minor build warnings (usually acceptable)

### ❌ Failure Indicators

- Checksum verification fails
- OpenAPI spec validation errors
- TypeScript compilation errors
- Missing required artifacts
- Workflow crashes or times out

## Troubleshooting

### Common Issues

1. **Checksum Mismatch**

   ```bash
   # Calculate correct checksum
   curl -s https://api.bondmcp.com/openapi.json | sha256sum
   ```

2. **Version Already Exists**
   - This is expected behavior for duplicate triggers
   - Check existing version: `ls openapi/history/`

3. **Build Failures**
   - Check generated SDK code syntax
   - Verify OpenAPI spec is valid
   - Review TypeScript compilation errors

4. **Network Timeouts**
   - Common in CI environments
   - Usually doesn't affect final outcome
   - Check if artifacts were created despite timeout

### Debug Commands

```bash
# Validate OpenAPI spec manually
npx swagger-cli validate your-spec.json

# Test SDK generation locally
npx openapi-generator-cli generate -i spec.json -g typescript-axios -o test-output

# Check workflow logs
gh run list --workflow="OpenAPI Spec Ingestion & SDK Publishing"
gh run view RUN_ID --log
```

## Security Considerations

- Never commit real API keys or tokens
- Use GitHub Secrets for NPM_TOKEN and PYPI_TOKEN
- Verify no secrets are leaked in workflow logs
- Ensure minimal required permissions

## Integration Testing

For full end-to-end testing:

1. Deploy spec to staging API
2. Trigger pipeline with staging spec URL
3. Test generated SDKs against staging
4. Verify publishing to test registries
5. Validate rollback procedures

---

For questions or issues, contact the DevOps team or create an issue in the repository.
