# ADR-002: Contract Ingest Pipeline with Spec Normalization and Publishing Safeguards

## Status
Accepted

## Context
The BondMCP project requires a robust, autonomous contract ingest pipeline that can:
- Normalize OpenAPI specifications for consistent diff generation
- Perform preflight checks to prevent duplicate publications
- Automatically manage contract-related pull requests
- Ensure migration documentation for breaking changes
- Provide idempotent and safe publishing workflows

## Decision
We will implement a contract ingest pipeline consisting of:

### 1. Spec Normalization (`normalize_spec.ts`)
- Standardizes OpenAPI JSON formatting before diff generation
- Sorts object keys alphabetically for consistent output
- Removes timestamp suffixes from versions
- Ensures consistent property ordering

### 2. Publish Preflight Checks (`publish_preflight.ts`)  
- Checks npm and PyPI registries for existing versions
- Returns distinct exit codes (20 for npm, 21 for PyPI) when versions exist
- Enables conditional publishing in workflows
- Prevents accidental duplicate publications

### 3. Label Automation (`apply_label.ts`)
- Automatically applies `contract` label to PRs involving API changes
- Integrates with GitHub REST API using GITHUB_TOKEN
- Creates labels if they don't exist
- Supports auto-detection of PR context from GitHub Actions

### 4. Migration Assertions (`assert_migration_file.ts`)
- Ensures migration documentation exists for major/minor API changes
- Reads classification results from diff generation
- Auto-generates migration templates when needed
- Enforces documentation requirements before merge

### 5. Workflow Integration
- **Contract Ingest Pipeline** (`contract_ingest.yml`): Main workflow for processing contract changes
- **Auto-Ready on Green** (`auto_ready_on_green.yml`): Automatically promotes draft PRs when conditions are met

## Consequences

### Positive
- **Autonomous Operation**: Fully automated contract processing reduces manual intervention
- **Idempotent Publishing**: Prevents duplicate publications and failed deployments
- **Consistent Specifications**: Normalization ensures reliable diff generation
- **Enhanced Safety**: Migration assertions prevent breaking changes without documentation
- **Improved Developer Experience**: Automatic labeling and PR promotion streamlines workflows

### Negative
- **Additional Complexity**: More scripts and workflows to maintain
- **Dependency on External Services**: npm/PyPI availability affects preflight checks
- **GitHub Token Requirements**: Workflows need appropriate permissions for automation

## Implementation Details

### Exit Code Convention
- `0`: Success/Safe to proceed
- `1`: Error occurred
- `20`: Version exists on npm (skip npm publish)
- `21`: Version exists on PyPI (skip PyPI publish)

### Required Environment Variables
- `GITHUB_TOKEN`: For label management and PR operations
- `NPM_TOKEN`: For npm publishing (optional)
- `PYPI_TOKEN`: For PyPI publishing (optional)

### Workflow Triggers
- Push to main/develop branches with spec changes
- Pull requests affecting spec files
- Manual dispatch for forced operations

### Label-Based Filtering
- PRs must have `contract` label for auto-ready promotion
- Reduces risk of accidental promotion of unrelated changes
- Enables targeted automation for contract-specific workflows

## Alternatives Considered
1. **Manual Process**: Rejected due to high error rate and time investment
2. **Separate Pipelines**: Rejected due to coordination complexity
3. **Version-Based Triggers**: Rejected due to lack of granular control

## Related Documents
- GitHub Actions Workflow Documentation
- OpenAPI Specification Guidelines
- Package Publishing Procedures