# SDK Release Runbook

This runbook provides step-by-step procedures for manual SDK release operations, emergency overrides, rollback procedures, and verification steps.

## Quick Reference

| Operation | Command | Purpose |
|-----------|---------|---------|
| **Validate Spec** | `node scripts/validate_openapi.mjs <spec>` | Local spec validation |
| **Generate Diff** | `node scripts/generate_spec_diff.mjs --latest` | Compare latest versions |
| **Update Changelog** | `node scripts/update_changelog.mjs <ver> <type>` | Add changelog entry |
| **Check Quarantine** | `node scripts/check_legacy_quarantine.js` | Verify legacy isolation |
| **Create Frontend PR** | `node scripts/create_frontend_bump_pr.mjs` | Stub frontend update |

## Emergency Procedures

### 🚨 Emergency Manual SDK Release

When the automated pipeline is unavailable, follow these steps for emergency release:

#### Prerequisites
```bash
# Verify required tools
npm list -g openapi-generator-cli
npm list -g @redocly/cli
pip list | grep hatch
pip list | grep twine

# Set environment variables
export NPM_TOKEN="your_npm_token"
export PYPI_TOKEN="your_pypi_token"
export GITHUB_TOKEN="your_github_token"
```

#### Step 1: Prepare OpenAPI Spec
```bash
# Download and verify spec manually
curl -o temp_spec.json "https://api.bondmcp.com/openapi.json"

# Calculate checksum
sha256sum temp_spec.json

# Validate spec
node scripts/validate_openapi.mjs temp_spec.json
```

#### Step 2: Store Spec Version
```bash
# Set version variables
VERSION="1.2.0"
CHECKSUM="actual_sha256_hash_here"

# Store immutable snapshot
cp temp_spec.json "openapi/history/openapi-${VERSION}.json"

# Update latest pointer
cat > openapi/latest.json << EOF
{
  "version": "${VERSION}",
  "checksum": "${CHECKSUM}",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "spec_url": "https://api.bondmcp.com/openapi.json"
}
EOF
```

#### Step 3: Generate TypeScript SDK
```bash
# Create output directory
mkdir -p sdks/typescript

# Generate SDK
openapi-generator-cli generate \
  -i "openapi/history/openapi-${VERSION}.json" \
  -g typescript-axios \
  -o sdks/typescript \
  --additional-properties=supportsES6=true,npmName=@bondmcp/sdk,npmVersion=${VERSION}

# Update package.json
cd sdks/typescript
npm version ${VERSION} --no-git-tag-version

# Build and test
npm install
npm run build
npm test

# Publish to npm (if tests pass)
npm publish --access public
```

#### Step 4: Generate Python SDK
```bash
# Create output directory
mkdir -p sdks/python

# Generate SDK
openapi-generator-cli generate \
  -i "openapi/history/openapi-${VERSION}.json" \
  -g python \
  -o sdks/python \
  --additional-properties=packageName=bondmcp_sdk,packageVersion=${VERSION}

# Update pyproject.toml
cd sdks/python
sed -i "s/version = \"[^\"]*\"/version = \"${VERSION}\"/" pyproject.toml

# Build and test
python -m hatch build
python -m hatch run test

# Publish to PyPI (if tests pass)
python -m twine upload dist/*
```

#### Step 5: Update Documentation
```bash
# Generate changelog entry
node scripts/update_changelog.mjs ${VERSION} minor

# Generate migration guide (if needed)
node scripts/generate_spec_diff.mjs --latest

# Commit changes
git add openapi/ CHANGELOG.md MIGRATIONS/ docs/
git commit -m "feat: emergency release v${VERSION}

- Manual SDK release due to pipeline unavailability
- Validated spec and generated SDKs
- Updated documentation and migration guides

[emergency]"

git push origin main
```

### 🚨 Emergency Rollback

If an SDK release causes critical issues:

#### Step 1: Assess Impact
```bash
# Check current published versions
npm view @bondmcp/sdk versions --json
pip search bondmcp-sdk  # or check PyPI manually

# Review error reports and impact scope
```

#### Step 2: Unpublish SDKs (If Within 72 Hours)
```bash
# TypeScript SDK
npm unpublish @bondmcp/sdk@${VERSION}

# Python SDK (contact PyPI support if needed)
# PyPI doesn't allow unpublishing after 72 hours
```

#### Step 3: Revert Frontend Dependencies
```bash
# Create emergency revert PR in anna.community
# Update package.json to previous working version
# Deploy immediately after testing
```

#### Step 4: Notify Stakeholders
```bash
# Send alerts to:
# - Platform team
# - Frontend team  
# - DevOps team
# Include timeline and resolution steps
```

## Manual Override Procedures

### Override Quarantine (Emergency Only)
```bash
# Only use in critical situations
OVERRIDE_OPENAPI_DEPRECATION=true node legacy/openapi-generator/generate_openapi.js

# Alternative: trigger platform re-export
curl -X POST https://api.bondmcp.com/admin/regenerate-spec \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### Force Re-ingestion
```bash
# Manually trigger workflow
gh workflow run openapi-ingestion.yml \
  -f spec_version="1.2.0" \
  -f spec_url="https://api.bondmcp.com/openapi.json" \
  -f checksum="sha256_hash_here"
```

### Skip Duplicate Check
```bash
# Edit workflow file temporarily to skip version check
# NOT RECOMMENDED - breaks immutability principle
```

## Verification Procedures

### Pre-Release Verification
```bash
# 1. Validate OpenAPI spec
node scripts/validate_openapi.mjs openapi/latest.json

# 2. Check for breaking changes
node scripts/generate_spec_diff.mjs --latest

# 3. Verify SDK generation
npm run sdk:generate

# 4. Run integration tests
npm test
python -m pytest tests/
```

### Post-Release Verification
```bash
# 1. Verify npm publication
npm view @bondmcp/sdk@${VERSION}

# 2. Verify PyPI publication
pip show bondmcp-sdk==${VERSION}

# 3. Test installation
npm install @bondmcp/sdk@${VERSION}
pip install bondmcp-sdk==${VERSION}

# 4. Basic functionality test
node -e "const sdk = require('@bondmcp/sdk'); console.log(sdk);"
python -c "import bondmcp_sdk; print(bondmcp_sdk.__version__)"
```

### Example Invocation Tests
```bash
# Create test script
cat > test_sdk.js << 'EOF'
const { BondMCPClient } = require('@bondmcp/sdk');

const client = new BondMCPClient({
  baseURL: 'https://api.bondmcp.com',
  apiKey: 'test_key'
});

// Test basic endpoint
client.getHealth()
  .then(response => console.log('✅ Health check passed:', response.status))
  .catch(error => console.error('❌ Health check failed:', error.message));
EOF

node test_sdk.js
```

```python
# Create Python test
cat > test_sdk.py << 'EOF'
from bondmcp_sdk import BondMCPClient

client = BondMCPClient(
    base_url="https://api.bondmcp.com",
    api_key="test_key"
)

try:
    response = client.get_health()
    print(f"✅ Health check passed: {response.status_code}")
except Exception as error:
    print(f"❌ Health check failed: {error}")
EOF

python test_sdk.py
```

## Troubleshooting

### Common Issues

#### 1. Checksum Mismatch
```bash
# Problem: Downloaded spec doesn't match expected checksum
# Solution: Verify source spec hasn't changed during download

# Re-download spec
curl -o fresh_spec.json "https://api.bondmcp.com/openapi.json"

# Calculate fresh checksum
sha256sum fresh_spec.json

# Compare with expected
echo "Expected: ${EXPECTED_CHECKSUM}"
echo "Actual:   $(sha256sum fresh_spec.json | cut -d' ' -f1)"
```

#### 2. SDK Generation Failure
```bash
# Problem: openapi-generator-cli fails
# Solution: Check spec validity and tool versions

# Validate spec format
node scripts/validate_openapi.mjs spec.json

# Check generator version
openapi-generator-cli version

# Try with different generator version
npm install -g @openapitools/openapi-generator-cli@latest
```

#### 3. Publication Permission Error
```bash
# Problem: npm/PyPI publication fails
# Solution: Verify tokens and package permissions

# Check npm token
npm whoami

# Check PyPI token
pip config list

# Verify package ownership
npm owner ls @bondmcp/sdk
```

#### 4. Legacy Script Resurrection
```bash
# Problem: Legacy script detected outside quarantine
# Solution: Move back to quarantine and run checks

# Check violations
node scripts/check_legacy_quarantine.js

# Move script back if needed
mv scripts/generate_openapi.js legacy/openapi-generator/

# Re-run verification
node scripts/check_legacy_quarantine.js
```

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Set debug environment
export DEBUG=1
export VERBOSE=1

# Run commands with extra logging
node scripts/validate_platform_dispatch.mjs payload.json
node scripts/validate_openapi.mjs spec.json
```

## Health Checks

### Daily Health Check
```bash
#!/bin/bash
# Run daily to verify pipeline health

echo "🏥 Daily SDK Pipeline Health Check"
echo "=================================="

# Check legacy quarantine
echo "1. Checking legacy quarantine..."
node scripts/check_legacy_quarantine.js

# Check latest spec validity
echo "2. Validating latest spec..."
node scripts/validate_openapi.mjs openapi/latest.json

# Check SDK versions alignment
echo "3. Checking SDK version alignment..."
LATEST_SPEC_VERSION=$(jq -r '.version' openapi/latest.json)
NPM_VERSION=$(npm view @bondmcp/sdk version)
echo "   Spec version: ${LATEST_SPEC_VERSION}"
echo "   npm version:  ${NPM_VERSION}"

if [ "$LATEST_SPEC_VERSION" = "$NPM_VERSION" ]; then
    echo "   ✅ Versions aligned"
else
    echo "   ⚠️ Version mismatch detected"
fi

echo "4. Health check complete"
```

### Weekly Deep Check
```bash
#!/bin/bash
# Run weekly for comprehensive verification

echo "🔍 Weekly Deep Pipeline Check"
echo "============================="

# Check all historical specs
echo "1. Validating historical specs..."
for spec in openapi/history/openapi-*.json; do
    echo "   Checking $(basename "$spec")..."
    node scripts/validate_openapi.mjs "$spec"
done

# Verify migration guides exist
echo "2. Checking migration guides..."
for migration in MIGRATIONS/*.md; do
    echo "   Found: $(basename "$migration")"
done

# Test SDK installation
echo "3. Testing SDK installation..."
npm install @bondmcp/sdk@latest
pip install bondmcp-sdk --upgrade

echo "4. Deep check complete"
```

## Contact Information

### Emergency Contacts
- **DevOps Team**: #devops-alerts (Slack)
- **Platform Team**: platform-team@bondmcp.com
- **Frontend Team**: frontend-team@bondmcp.com

### Escalation Path
1. **L1**: DevOps on-call engineer
2. **L2**: Platform team lead
3. **L3**: Engineering manager

---

**Last Updated**: 2025-01-23  
**Next Review**: Q2 2025  
**Owner**: DevOps Team