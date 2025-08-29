# Integration Lifecycle

This document describes the end-to-end integration lifecycle for the BondMCP OpenAPI/SDK pipeline, including automated ingestion, SDK generation, and downstream distribution.

## Overview

The integration lifecycle transforms OpenAPI specification changes from the platform into published SDKs and downstream updates through a fully automated pipeline.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ bondmcp-platform │    │    mcp repo     │    │ anna.community  │
│                 │    │                 │    │                 │
│ 1. Generate     │───▶│ 2. Ingest       │───▶│ 3. Update       │
│    OpenAPI      │    │    & Publish    │    │    Dependencies │
│    Spec         │    │    SDKs         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Responsibilities Matrix

| Stage | Owner | System | Responsibility |
|-------|-------|---------|----------------|
| **Spec Generation** | Platform Team | bondmcp-platform | Generate authoritative OpenAPI spec |
| **Ingestion** | DevOps Team | mcp (GitHub Actions) | Validate, store, and version specs |
| **SDK Generation** | DevOps Team | mcp (GitHub Actions) | Generate and publish SDKs |
| **Frontend Integration** | Frontend Team | anna.community | Update dependencies and test |

## Pipeline Stages

### Stage 1: Platform Spec Generation

**Trigger**: Code changes in bondmcp-platform
**Owner**: Platform Team
**Location**: bondmcp-platform repository

1. **Spec Generation**: Platform generates OpenAPI spec from live endpoints
2. **Checksum Calculation**: SHA256 hash calculated for integrity verification
3. **Publication**: Spec deployed to public HTTPS endpoint
4. **Dispatch**: Repository dispatch event sent to mcp repository

**Payload Example**:
```json
{
  "event_type": "openapi_spec_updated",
  "client_payload": {
    "version": "1.2.0",
    "checksum": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    "change_type": "minor",
    "download_url": "https://api.bondmcp.com/openapi.json",
    "source_repo": "bondmcp-platform"
  }
}
```

### Stage 2: Spec Ingestion & SDK Publishing

**Trigger**: repository_dispatch event from platform
**Owner**: DevOps Team  
**Location**: mcp repository (`.github/workflows/openapi-ingestion.yml`)

#### 2.1 Validation Phase
1. **Payload Validation**: Validate dispatch payload schema
2. **Checksum Verification**: Download spec and verify SHA256 checksum
3. **OpenAPI Validation**: Ensure spec compliance with OpenAPI 3.1
4. **Duplicate Check**: Prevent re-ingestion of existing versions

#### 2.2 Storage Phase
1. **Immutable Storage**: Store spec as `openapi/history/openapi-{version}.json`
2. **Latest Update**: Update `openapi/latest.json` metadata
3. **Diff Generation**: Generate semantic diff from previous version
4. **Migration Notes**: Create migration guide template

#### 2.3 SDK Generation Phase
1. **TypeScript SDK**: Generate using openapi-generator-cli
2. **Python SDK**: Generate using openapi-generator-cli  
3. **Build & Test**: Compile and validate generated SDKs
4. **Version Tagging**: Tag with semantic version from spec

#### 2.4 Publishing Phase
1. **npm Publishing**: Publish TypeScript SDK to npm registry
2. **PyPI Publishing**: Publish Python SDK to PyPI registry
3. **Documentation**: Update changelogs and migration guides
4. **Commit & Push**: Store all changes in repository

### Stage 3: Frontend Dependency Updates

**Trigger**: Successful SDK publication
**Owner**: Frontend Team (with automation assistance)
**Location**: anna.community repository

1. **Auto-PR Creation**: Stub script creates PR to bump SDK dependency
2. **Compatibility Testing**: Automated tests verify integration
3. **Manual Review**: Frontend team reviews changes and migration notes
4. **Deployment**: Merge and deploy updated application

## Workflow Diagram

```
Platform Changes
      │
      ▼
 Generate Spec ──────────────────────────┐
      │                                  │
      ▼                                  │
 Calculate Checksum                      │
      │                                  │
      ▼                                  │
 Deploy to Public URL                    │
      │                                  │
      ▼                                  │
 Dispatch Event ─────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────┐
│          MCP Repository                 │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     Payload Validation          │    │
│  └─────────────────────────────────┘    │
│              │                          │
│              ▼                          │
│  ┌─────────────────────────────────┐    │
│  │    Download & Verify Spec       │    │
│  └─────────────────────────────────┘    │
│              │                          │
│              ▼                          │
│  ┌─────────────────────────────────┐    │
│  │      Store Immutably            │    │
│  └─────────────────────────────────┘    │
│              │                          │
│              ▼                          │
│  ┌─────────────────────────────────┐    │
│  │    Generate Semantic Diff       │    │
│  └─────────────────────────────────┘    │
│              │                          │
│              ▼                          │
│  ┌─────────────────────────────────┐    │
│  │     Generate SDKs               │    │
│  └─────────────────────────────────┘    │
│              │                          │
│              ▼                          │
│  ┌─────────────────────────────────┐    │
│  │      Publish SDKs               │    │
│  └─────────────────────────────────┘    │
│              │                          │
│              ▼                          │
│  ┌─────────────────────────────────┐    │
│  │    Update Documentation         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│       Frontend Repository              │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      Create Auto-PR             │    │
│  └─────────────────────────────────┘    │
│              │                          │
│              ▼                          │
│  ┌─────────────────────────────────┐    │
│  │      Manual Review              │    │
│  └─────────────────────────────────┘    │
│              │                          │
│              ▼                          │
│  ┌─────────────────────────────────┐    │
│  │       Deploy Changes            │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## Quality Gates

### Pre-Ingestion
- ✅ Valid repository_dispatch payload
- ✅ SHA256 checksum verification
- ✅ OpenAPI 3.1 compliance
- ✅ Version not already ingested

### Pre-Publication
- ✅ SDK generation successful
- ✅ Build tests pass
- ✅ No duplicate version on registries
- ✅ Migration guide created (if breaking)

### Pre-Deployment
- ✅ Compatibility tests pass
- ✅ Manual review completed
- ✅ Migration steps documented

## Error Handling & Rollback

### Ingestion Failures
- **Invalid Payload**: Workflow fails fast with clear error message
- **Checksum Mismatch**: Workflow halts, alerts platform team
- **Duplicate Version**: Workflow skips gracefully with warning

### Publication Failures
- **SDK Build Error**: Workflow fails, preserves spec but skips publication
- **Registry Unavailable**: Workflow retries with exponential backoff
- **Permission Error**: Workflow fails with actionable error message

### Rollback Procedures
1. **Spec Rollback**: Not recommended (immutable storage principle)
2. **SDK Rollback**: Unpublish from registries (rare, coordinated effort)
3. **Frontend Rollback**: Standard git revert + deployment

## Monitoring & Observability

### Metrics
- **Ingestion Success Rate**: Percentage of successful ingestions
- **SDK Publication Latency**: Time from spec to published SDK
- **Frontend Update Cadence**: Time from SDK to frontend deployment

### Alerts
- **Failed Ingestion**: Immediate alert to DevOps team
- **Checksum Mismatch**: Critical alert to Platform team
- **SDK Build Failure**: Alert to SDK maintainers

### Dashboards
- **Pipeline Health**: Real-time status of ingestion pipeline
- **Version Tracking**: Visual timeline of spec and SDK versions
- **Dependency Graph**: Downstream impact visualization

## Security Considerations

### Integrity
- **Checksum Verification**: Mandatory SHA256 verification
- **Source Validation**: Optional strict source repository checking
- **Immutable Storage**: Specs never modified once stored

### Access Control
- **GitHub Tokens**: Minimal required permissions (contents: write, packages: write)
- **Registry Tokens**: Scoped to specific packages only
- **Cross-Repo**: Explicit permission for anna.community automation

### Future Enhancements
- **Signature Verification**: Cryptographic signing with sigstore/cosign
- **Vulnerability Scanning**: Automated security scanning of generated SDKs
- **Audit Logging**: Comprehensive audit trail for compliance

## Performance Characteristics

### Latency Targets
- **Ingestion**: < 2 minutes from dispatch to stored spec
- **SDK Generation**: < 5 minutes per SDK language
- **Publication**: < 1 minute to registries
- **End-to-End**: < 10 minutes from platform change to published SDK

### Throughput
- **Concurrent Versions**: Handle up to 5 parallel ingestions
- **Rate Limiting**: Respect npm/PyPI rate limits
- **Batch Processing**: Group related changes when possible

## Related Documentation

- **[SDK Release Runbook](runbooks/sdk-release.md)** - Manual procedures and troubleshooting
- **[OpenAPI Examples](openapi-examples.md)** - Usage examples and testing
- **[ADR-002](ADR-002-automated-openapi-pipeline.md)** - Architecture decisions
- **[Contract Ingest Pipeline](adr/ADR-002-contract-ingest-pipeline.md)** - Implementation details

---

**Last Updated**: 2025-01-23  
**Next Review**: Q2 2025  
**Owner**: DevOps Team