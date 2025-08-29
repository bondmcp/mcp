# Release Documentation

This document describes the release process for BondMCP SDKs and API specifications.

## Overview

The BondMCP project uses automated versioning and publishing with [Changesets](https://github.com/changesets/changesets) to manage releases across multiple packages.

## Packages

- `@bondmcp/sdk` - TypeScript SDK
- `bondmcp-sdk` - Python SDK (PyPI)
- `github.com/bondmcp/sdk` - Go SDK

## Release Process

### 1. Making Changes

When making changes that should trigger a release:

1. Make your changes to the codebase
2. Add a changeset describing the changes:
   ```bash
   pnpm changeset
   ```
3. Follow the prompts to select which packages are affected and the type of change (major, minor, patch)
4. Commit the changeset file along with your changes

### 2. Creating a Release

When ready to create a release:

1. **Update Versions**: Run the version command to bump package versions based on changesets:
   ```bash
   pnpm changeset:version
   ```
   This will:
   - Update package.json versions
   - Update CHANGELOG.md files
   - Remove consumed changeset files

2. **Review Changes**: Review the version bumps and changelog updates

3. **Commit and Push**: Commit the version changes and push to main branch

4. **Automated Publishing**: GitHub Actions will automatically:
   - Build and test the packages
   - Publish to npm (TypeScript SDK)
   - Publish to PyPI (Python SDK)
   - Create GitHub releases
   - Update documentation

### 3. Manual Publishing (if needed)

If automated publishing fails, you can manually publish:

```bash
# Build packages
pnpm build

# Publish to npm (from packages/sdk-ts)
cd packages/sdk-ts
npm publish

# Publish to PyPI (from python/)
cd python
python -m build
python -m twine upload dist/*
```

## OpenAPI Specification Updates

When the OpenAPI specification is updated:

1. The specification should be updated in `openapi/bondmcp.v1.yaml`
2. Run validation: `pnpm openapi:validate`
3. Regenerate SDKs: `pnpm sdk:generate`
4. Add a changeset for the affected SDKs
5. Follow the normal release process

## Version Strategy

- **Major** (1.0.0 → 2.0.0): Breaking changes to the API or SDK interfaces
- **Minor** (1.0.0 → 1.1.0): New features, new endpoints, backwards-compatible changes
- **Patch** (1.0.0 → 1.0.1): Bug fixes, documentation updates, internal improvements

## Automated Workflows

### SDK Release Workflow (`.github/workflows/sdk-release.yml`)

Triggers on:
- Push to main branch when OpenAPI spec changes
- Manual workflow dispatch

Actions:
1. Detect changes to OpenAPI specification
2. Regenerate SDKs
3. Run tests and validation
4. Create changesets if missing
5. Publish packages with provenance
6. Update documentation

### OpenAPI Validation Workflow (`.github/workflows/openapi-validate.yml`)

Triggers on:
- Pull requests affecting OpenAPI specs
- Push to main branch

Actions:
1. Validate OpenAPI specification
2. Check for breaking changes with oasdiff
3. Generate diff reports
4. Ensure semantic versioning compliance

## Configuration

### NPM Publishing

Set the following secrets in GitHub:
- `NPM_TOKEN`: npm authentication token for @bondmcp organization

### PyPI Publishing

Set the following secrets in GitHub:
- `PYPI_TOKEN`: PyPI API token for bondmcp-sdk package

### Go Modules

Go modules are published automatically via GitHub releases and tags.

## Migration Notes

### Future v2 Introduction

When introducing API v2:

1. Create new specification: `openapi/bondmcp.v2.yaml`
2. Update SDK generation configs to support both versions
3. Maintain backwards compatibility in v1
4. Provide migration documentation
5. Deprecate v1 endpoints gradually
6. Use semantic versioning to indicate breaking changes

### Breaking Changes

When introducing breaking changes:

1. Document all breaking changes in the changeset
2. Update migration guides in `MIGRATIONS/` directory
3. Bump major version numbers
4. Provide clear migration path in documentation
5. Support both old and new versions for a transition period

## Support

For questions about the release process:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section in the documentation