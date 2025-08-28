# SDK Publishing Guide

This guide covers the SDK publishing process for BondMCP, including environment setup, automation, and adding new languages.

## Overview

BondMCP uses automated workflows to build and publish SDKs to multiple package registries:

- **TypeScript**: Published to npm as `@bondmcp/sdk`
- **Python**: Published to PyPI as `bondmcp-sdk`
- **Go**: Published as Git tags for Go modules

## Automated Publishing (Recommended)

### Prerequisites

To enable automated publishing, ensure these secrets are configured in the GitHub repository:

```bash
# Required for npm publishing
NPM_TOKEN=<npm-access-token>
NPM_PUBLISH_ENABLED=1

# Required for PyPI publishing
PYPI_TOKEN=<pypi-api-token>
PYPI_PUBLISH_ENABLED=1
```

### Triggering a Release

1. **Update Version Numbers**:

   ```bash
   # Update package.json
   npm version 1.2.3 --no-git-tag-version

   # Update TypeScript SDK
   cd sdks/typescript
   npm version 1.2.3 --no-git-tag-version

   # Update Python SDK (if exists)
   cd sdks/python
   # Edit pyproject.toml version = "1.2.3"
   ```

2. **Update CHANGELOG.md**:
   Add your changes following [Keep a Changelog](https://keepachangelog.com/) format:

   ```markdown
   ## [1.2.3] - 2025-01-23

   ### Added

   - New API endpoints for user management

   ### Changed

   - Improved error handling in authentication

   ### Fixed

   - Fixed pagination issue in list endpoints
   ```

3. **Create and Push Tag**:

   ```bash
   git add .
   git commit -m "chore: bump version to 1.2.3"
   git tag v1.2.3
   git push origin main
   git push origin v1.2.3
   ```

4. **Monitor Release**:
   The [Release SDKs workflow](../.github/workflows/release-sdks.yml) will automatically:
   - Validate version consistency
   - Build and test SDKs
   - Publish to registries
   - Create GitHub release

## Dry Run vs Real Publishing

### Testing with Dry Run

Use workflow dispatch to test without publishing:

1. Go to **Actions** → **Release SDKs** → **Run workflow**
2. Set parameters:
   - `version`: `1.2.3`
   - `dry_run`: `true`
3. Review the workflow output

### Enabling Real Publishing

Set these repository secrets to enable actual publishing:

- `NPM_PUBLISH_ENABLED=1`
- `PYPI_PUBLISH_ENABLED=1`

Without these flags, the workflow runs in dry-run mode.

## Manual Publishing (Emergency)

### TypeScript SDK

```bash
cd sdks/typescript

# Build the SDK
npm install
npm run build

# Verify package contents
npm pack --dry-run

# Publish (requires npm authentication)
npm publish --access public
```

### Python SDK

```bash
cd sdks/python

# Build the package
python -m hatch build

# Verify package contents
python -m twine check dist/*

# Publish (requires PyPI authentication)
python -m twine upload dist/*
```

### Go SDK

Go SDKs use Git tags for versioning:

```bash
# Tag the specific SDK version
git tag sdks/go/v1.2.3

# Push the tag
git push origin sdks/go/v1.2.3
```

Users import with:

```go
import "github.com/bondmcp/mcp/sdks/go/v1.2.3"
```

## Environment Setup

### Local Development

Install required tools:

```bash
# Node.js and npm tools
npm install -g @openapitools/openapi-generator-cli
npm install -g @redocly/cli @stoplight/spectral-cli

# Python tools
pip install hatch twine build

# Go tools (if needed)
go install golang.org/x/tools/cmd/goimports@latest
```

### CI/CD Environment

The workflows automatically install dependencies. For custom runners, ensure:

- Node.js 20+
- Python 3.11+
- Go 1.21+ (if using Go SDKs)
- Git with appropriate permissions

## Adding New Language SDKs

### 1. Create SDK Structure

```bash
mkdir -p sdks/newlang
cd sdks/newlang
```

### 2. Add to SDK Generation Workflow

Edit `.github/workflows/sdk-regenerate.yml`:

```yaml
- name: Generate NewLang SDK
  if: github.event.inputs.enable_newlang == 'true'
  run: |
    openapi-generator-cli generate \
      -i .sdk-temp/openapi.json \
      -g newlang-generator \
      -o ${{ env.NEWLANG_SDK_PATH }}/generated \
      --additional-properties=packageName=bondmcp_newlang
```

### 3. Add to Release Workflow

Edit `.github/workflows/release-sdks.yml`:

```yaml
- name: Build NewLang SDK
  run: |
    cd ${{ env.NEWLANG_SDK_PATH }}
    # Build commands specific to the language
    make build  # or equivalent
```

### 4. Configure Package Registry

Add publishing steps for the language's package registry (e.g., crates.io for Rust, pub.dev for Dart).

### 5. Update Documentation

- Add the new SDK to this guide
- Update README.md badges
- Add language-specific examples

## Package Registry Configuration

### npm Configuration

Package details in `sdks/typescript/package.json`:

```json
{
  "name": "@bondmcp/sdk",
  "repository": {
    "type": "git",
    "url": "https://github.com/bondmcp/mcp.git",
    "directory": "sdks/typescript"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

### PyPI Configuration

Package details in `sdks/python/pyproject.toml`:

```toml
[project]
name = "bondmcp-sdk"
authors = [{name = "BondMCP Team", email = "support@bondmcp.com"}]

[project.urls]
"Homepage" = "https://github.com/bondmcp/mcp"
"Repository" = "https://github.com/bondmcp/mcp.git"
"Bug Tracker" = "https://github.com/bondmcp/mcp/issues"
```

## Troubleshooting

### Common Issues

1. **Version Mismatch**:

   ```bash
   # Fix: Update all package versions to match
   npm run release:prepare  # Validates versions
   ```

2. **Build Failures**:

   ```bash
   # Debug locally
   npm run sdk:gen
   npm run sdk:verify
   ```

3. **Publishing Permissions**:
   - Verify npm token has publish permissions for `@bondmcp` scope
   - Verify PyPI token has publish permissions for `bondmcp-sdk`

4. **Spec Validation Errors**:
   ```bash
   npm run spec:lint
   npm run spec:bundle
   ```

### Recovery Procedures

**If automated release fails:**

1. Check workflow logs for specific errors
2. Fix issues and re-run workflow with same version
3. For urgent fixes, use manual publishing process
4. Update automation for future releases

**If package is corrupted:**

1. For npm: Unpublish if within 24 hours, otherwise publish patch version
2. For PyPI: Cannot unpublish, must publish new version
3. Update documentation with corrected version info

## Security Considerations

- **Token Management**: Rotate tokens regularly
- **Scope Limitation**: Use minimal-scope tokens
- **Branch Protection**: Require PR reviews for version changes
- **Audit Trail**: All releases logged in GitHub Actions
- **Rollback Plan**: Keep previous working versions available

## Monitoring and Metrics

Track SDK adoption and issues:

- **Download Statistics**: npm and PyPI provide download metrics
- **GitHub Releases**: Track download counts for release assets
- **Issue Tracking**: Monitor SDK-related issues in the repository
- **Version Usage**: Analyze which SDK versions are most used

For questions or issues with SDK publishing, contact the BondMCP team or open an issue in the repository.
