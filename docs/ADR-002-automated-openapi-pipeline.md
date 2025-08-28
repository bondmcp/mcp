# ADR-002: Automated OpenAPI Ingestion & Multi-SDK Publishing Pipeline

## Status

**ACCEPTED** - Implemented in PR #[number]

## Context

The previous OpenAPI workflow relied on dynamic generation through endpoint probing and manual sync processes. This approach had several limitations:

1. **Reliability Issues**: Dynamic probing could fail or return inconsistent results
2. **Manual Overhead**: Sync processes required manual intervention and monitoring
3. **Version Control**: No immutable versioning or change tracking
4. **SDK Maintenance**: Manual SDK updates were error-prone and often delayed

## Decision

We have implemented a comprehensive automated pipeline that transforms the OpenAPI workflow from dynamic generation to a **code-first contract system** where the platform is the authoritative source.

### Key Components

1. **Repository Dispatch Integration**
   - Platform triggers updates via `repository_dispatch` events
   - Payload includes version, checksum, and spec URL for verification

2. **Immutable Versioning System**
   - Specs stored as `openapi/history/openapi-<version>.json`
   - Complete audit trail with checksums and timestamps
   - Semantic diff generation between versions

3. **Multi-SDK Auto-Publishing**
   - TypeScript SDK (`@bondmcp/sdk`) - Full type safety, modern ES modules
   - Python SDK (`bondmcp_sdk`) - Type hints, dataclasses, requests-based client
   - Automatic publishing to npm and PyPI on spec changes

4. **Quality Assurance**
   - Comprehensive validation and build testing
   - Checksum verification for spec integrity
   - Error handling and rollback capabilities

## Implementation Details

### Workflow Trigger

```yaml
on:
  repository_dispatch:
    types: [openapi_spec_updated]
```

### Directory Structure

```
openapi/
├── latest.json                      # Current version metadata
└── history/
    ├── openapi-1.0.0.json          # Immutable version snapshots
    ├── diff-1.0.0-to-1.1.0.json    # Semantic diffs (JSON)
    └── diff-1.0.0-to-1.1.0.md      # Semantic diffs (Markdown)

MIGRATIONS/
├── README.md                        # Migration guide overview
└── 1.0.0-to-1.1.0.md               # Version-specific migration guides
```

### Platform Integration

```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/bondmcp/mcp/dispatches \
  -d '{"event_type":"openapi_spec_updated","client_payload":{"version":"1.0.1","checksum":"sha256_hash","spec_url":"https://api.bondmcp.com/openapi.json"}}'
```

## Benefits

1. **Eliminates Dynamic Generation**: Authoritative specs from platform
2. **Automated SDK Publishing**: SDKs published automatically on every spec change
3. **Complete Version History**: Immutable snapshots with semantic diffs
4. **Quality Assurance**: Comprehensive validation and testing
5. **Developer Experience**: Rich tooling, documentation, and examples

## Migration Strategy

- **Phase 1** (Current): New pipeline active, old workflows deprecated but available
- **Phase 2** (Next): Platform integration complete, old system disabled
- **Phase 3** (Future): Remove deprecated workflows entirely

## Alternatives Considered

1. **Continue with Dynamic Generation**: Rejected due to reliability issues
2. **Manual Spec Management**: Rejected due to scalability concerns
3. **Third-party Pipeline Services**: Rejected due to vendor lock-in and cost

## Consequences

### Positive

- Reliable, automated SDK generation and publishing
- Complete audit trail of API changes
- Improved developer experience with better tooling
- Reduced manual intervention and human error

### Negative

- Initial complexity in setup and configuration
- Dependency on GitHub Actions for automation
- Need for platform team to implement dispatch triggers

## Compliance

- **Security**: No secrets leaked, proper token management
- **Permissions**: Minimal required permissions (contents: write, packages: write)
- **Determinism**: Re-running on same payload results in "No changes detected"

## References

- **Pipeline Implementation Guide**
- **Usage Examples**
- **Migration Guide**

---

**Date**: 2025-01-23  
**Authors**: BondMCP Engineering Team  
**Reviewers**: Platform Team, DevOps Team
