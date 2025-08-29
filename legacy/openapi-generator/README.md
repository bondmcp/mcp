# Legacy OpenAPI Generator (DEPRECATED)

> **⚠️ DEPRECATED as of 2025-01-23**  
> This directory contains the deprecated ad-hoc OpenAPI generation scripts.

## Migration Notice

The scripts in this directory have been **deprecated** in favor of the new automated OpenAPI ingestion pipeline. The new system provides:

- **Immutable versioning** with complete audit trail
- **Automated SDK generation and publishing** 
- **Semantic diff generation** between versions
- **Platform-driven authoritative specs** (not dynamic probing)
- **Repository dispatch integration** with bondmcp-platform

## New Workflow

Instead of using these scripts, use the new automated ingestion workflow:

- **Workflow**: `.github/workflows/openapi-ingest.yml`
- **Trigger**: `repository_dispatch` with `event_type: platform-openapi-published`
- **Documentation**: `docs/ADR-002-automated-openapi-pipeline.md`

## Platform Integration

The platform (bondmcp-platform) now triggers OpenAPI updates via repository dispatch events:

```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/bondmcp/mcp/dispatches \
  -d '{
    "event_type": "platform-openapi-published",
    "client_payload": {
      "version": "1.0.1",
      "checksum": "sha256_hash",
      "change_type": "minor",
      "download_url": "https://api.bondmcp.com/openapi.json",
      "source_repo": "bondmcp/bondmcp-platform"
    }
  }'
```

## Legacy Scripts

### `generate_openapi.js`

**Original Purpose**: Dynamically generated OpenAPI specifications by:
1. Scanning actual API endpoints at api.bondmcp.com
2. Extracting endpoint metadata, parameters, and response schemas
3. Generating a complete OpenAPI specification document
4. Publishing to documentation site and openapi.bondmcp.com

**Why Deprecated**: 
- Reliability issues with dynamic probing
- Manual overhead and intervention required
- No immutable versioning or change tracking
- Manual SDK updates were error-prone and delayed

### `deploy_openapi.js`

**Original Purpose**: Manual deployment of OpenAPI specifications to AWS infrastructure:
1. Validated OpenAPI specification files
2. Uploaded specs to S3 bucket (openapi.bondmcp.com)
3. Invalidated CloudFront cache for immediate updates
4. Manual infrastructure management

**Why Deprecated**:
- Manual deployment process prone to errors
- No integration with version control workflow
- Missing audit trail for deployments
- Infrastructure drift from manual changes

## Emergency Use Only

These scripts are preserved for emergency use only and will be **removed entirely in Phase 3** of the migration strategy documented in ADR-002.

To use (discouraged):
```bash
OVERRIDE_OPENAPI_DEPRECATION=true node legacy/openapi-generator/generate_openapi.js
```

## Migration Timeline

- **Phase 1** (Current): New pipeline active, old workflows deprecated but available
- **Phase 2** (Next): Platform integration complete, old system disabled  
- **Phase 3** (Future): Remove deprecated workflows entirely

## Support

For questions about the migration:
- Review `docs/ADR-002-automated-openapi-pipeline.md`
- Check `docs/openapi-examples.md` for usage examples
- Contact the development team via GitHub issues