# Legacy OpenAPI Generator - DEPRECATED

⚠️ **This directory contains deprecated OpenAPI generation tools that are no longer supported.**

## Deprecation Notice

As of **2025-01-23**, the dynamic OpenAPI generation script (`generate_openapi.js`) has been **deprecated** and replaced with the new automated OpenAPI ingestion pipeline.

### Why was this deprecated?

The legacy approach had several critical issues:
- **Reliability Issues**: Dynamic probing could fail or return inconsistent results
- **Manual Overhead**: Sync processes required manual intervention and monitoring  
- **Version Control**: No immutable versioning or change tracking
- **SDK Maintenance**: Manual SDK updates were error-prone and often delayed

### New Approach

The new pipeline provides:
- ✅ **Immutable versioning** with complete audit trail
- ✅ **Automated SDK generation and publishing**  
- ✅ **Semantic diff generation** between versions
- ✅ **Platform-driven authoritative specs** (not dynamic probing)
- ✅ **Deterministic, reproducible results**

## Migration Instructions

**Instead of using the legacy script, use:**

1. **Repository Dispatch Workflow**: `.github/workflows/openapi-ingestion.yml`
2. **Authoritative Specs**: From bondmcp-platform via repository_dispatch events
3. **Official Documentation**: See `docs/ADR-002-automated-openapi-pipeline.md`

### For Platform Integration

```bash
# Trigger the new pipeline
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/bondmcp/mcp/dispatches \
  -d '{
    "event_type": "openapi_spec_updated",
    "client_payload": {
      "version": "1.0.1",
      "checksum": "sha256_hash",
      "spec_url": "https://api.bondmcp.com/openapi.json",
      "change_type": "minor",
      "source_repo": "bondmcp-platform"
    }
  }'
```

## Removal Timeline

🗓️ **Target Removal**: Q4 2025 (after compliance audit completion)

This directory will be completely removed after:
- [ ] Platform team confirms full migration to new pipeline
- [ ] Q4 compliance audit completed
- [ ] All downstream consumers updated
- [ ] Legacy workflow documentation archived

## Emergency Override

⚠️ **For emergency use only** - The legacy script can still be executed with:

```bash
OVERRIDE_OPENAPI_DEPRECATION=true node legacy/openapi-generator/generate_openapi.js
```

**Warning**: This override should only be used in critical situations where the new pipeline is unavailable. Contact the platform team before using.

## Support

For questions or migration assistance:
- 📖 Read: `docs/integration-lifecycle.md`
- 🏃 Quick Start: `docs/openapi-examples.md` 
- 🔧 Runbook: `docs/runbooks/sdk-release.md`
- 💬 Contact: Platform Team via Slack #mcp-platform

---

**Related Issues**: 
- Migration tracking: [Issue #TBD - Remove legacy OpenAPI generator Q4 2025]
- ADR Document: `docs/ADR-002-automated-openapi-pipeline.md`