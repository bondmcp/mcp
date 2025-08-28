# Contract Automation Stack

This directory contains the batched automation stack for contract ingestion, SDK generation, and publishing workflows.

## Overview

The automation stack provides:

1. **Deterministic spec handling** - Normalizes OpenAPI specs before diff & SDK generation
2. **Safe publishing** - Registry existence preflight checks (npm & PyPI) with explicit SKIP semantics
3. **Automatic readiness lifecycle** - Checklist insertion, label-based targeting, draft promotion
4. **Breaking change guardrails** - Migration note requirements for minor/major changes
5. **Automated labeling** - Applies `contract` labels to relevant PRs

## Scripts

### `normalize_spec.js`
Normalizes OpenAPI specifications for stable diffs by:
- Sorting object keys deterministically
- Removing ephemeral metadata fields (x-generated-at, timestamps, etc.)
- Ordering top-level sections consistently

**Usage:**
```bash
node normalize_spec.js <input-file> [output-file]
```

**Example:**
```bash
node normalize_spec.js spec/openapi.json spec/openapi.normalized.json
```

### `publish_preflight.js`
Checks if packages already exist in npm or PyPI registries before publishing.

**Exit Codes:**
- `0` - Package version is available for publishing
- `20` - Package already exists in npm registry (SKIP)
- `21` - Package already exists in PyPI registry (SKIP)
- `>1` - Error occurred

**Usage:**
```bash
node publish_preflight.js <registry> <version> [package-name]
```

**Examples:**
```bash
node publish_preflight.js npm 1.0.0 @bondmcp/sdk
node publish_preflight.js pypi 1.0.0 bondmcp-sdk
```

### `apply_label.js`
Adds `contract` label to pull requests, creating the label if it doesn't exist.

**Environment Variables:**
- `GITHUB_TOKEN` - Required GitHub API token
- `GITHUB_REPOSITORY` - Repository in owner/repo format
- `GITHUB_PR_NUMBER` - Pull request number

**Usage:**
```bash
GITHUB_TOKEN=token GITHUB_REPOSITORY=owner/repo GITHUB_PR_NUMBER=123 node apply_label.js [label-name]
```

### `assert_migration_file.js`
Ensures migration documentation exists for minor or major contract changes.

**Usage:**
```bash
node assert_migration_file.js [classification-file] [migrations-directory]
```

**Input:** JSON file or `DIFF_CLASSIFICATION` environment variable with:
```json
{
  "semanticChange": "patch|minor|major",
  "summary": "Description of changes",
  "breakingChanges": ["list of breaking changes"],
  "addedEndpoints": ["new endpoints"],
  "removedEndpoints": ["removed endpoints"]
}
```

**Behavior:**
- `patch` changes: No migration file required
- `minor`/`major` changes: Validates or generates migration documentation

## Workflows

### `ensure_pr_checklist.yml`
**Trigger:** `pull_request` (opened, edited, synchronize, ready_for_review)

Automatically injects a standardized "## ✅ Readiness Checklist" into PR descriptions if not present.

### `auto_ready_on_green.yml`
**Trigger:** `workflow_run` completion of "Contract Ingest & SDK Pipeline"

For successful pipeline runs:
1. Finds draft PRs with `contract` label or `[WIP]` title pattern
2. Removes `[WIP]` prefix from title
3. Converts from draft to ready for review
4. Adds `ready-for-review` label
5. Posts success comment

### `contract_ingest.yml`
**Trigger:** Push to main or PR with contract-related file changes

**Main Pipeline Jobs:**

1. **normalize-and-diff** - Normalizes specs and detects changes
2. **generate-sdks** - Builds JavaScript, Python, and Go SDKs
3. **assert-migration** - Validates migration docs for minor/major changes
4. **publish-preflight** - Checks registry existence before publishing
5. **publish** - Publishes packages to npm and PyPI (main branch only)
6. **apply-labels** - Adds contract labels to PRs
7. **summarize** - Generates pipeline summary

**Key Features:**
- Fork-safe: No publishing on forked repositories
- Conditional execution: Only runs relevant jobs based on changes
- Artifact management: Preserves normalized specs and classification results
- Error handling: Graceful failures with detailed logging

## Security & Permissions

The workflows use minimal required permissions:
- `contents: read` - Basic repository access
- `packages: write` - Publishing to registries (publish job only)
- `pull-requests: write` - Label management and PR updates

**Required Secrets:**
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions
- `NPM_TOKEN` - npm registry authentication
- `PYPI_TOKEN` - PyPI registry authentication

## Migration Directory Structure

When migration files are required, they are stored in `MIGRATIONS/`:

```
MIGRATIONS/
├── v1.1.0.md       # Minor version migration
├── v2.0.0.md       # Major version migration
└── README.md       # Migration directory documentation
```

**Migration File Requirements:**
- Minimum 50 characters of content
- Must include migration/upgrade guidance
- Major versions must document breaking changes
- Should specify version information

## Testing

To test the scripts locally:

```bash
# Test normalization
node scripts/contract/normalize_spec.js spec/openapi.json

# Test publish preflight
node scripts/contract/publish_preflight.js npm 1.0.0 test-package

# Test migration assertion
echo '{"semanticChange": "minor"}' | DIFF_CLASSIFICATION='{"semanticChange": "minor"}' node scripts/contract/assert_migration_file.js

# Test label application (requires GitHub context)
GITHUB_TOKEN=token GITHUB_REPOSITORY=owner/repo GITHUB_PR_NUMBER=123 node scripts/contract/apply_label.js
```

## Rollback Procedures

If issues arise with the automation:

1. **Disable workflows** - Edit workflow files to add `if: false` condition
2. **Manual intervention** - Use GitHub CLI or API for manual label/status management
3. **Script fixes** - Test scripts locally before pushing changes
4. **Registry cleanup** - Use npm/PyPI admin tools to unpublish if needed

## Operational Notes

- Workflows run on `ubuntu-latest` with Node.js 18 and Python 3.11
- Normalization strips ephemeral fields to ensure deterministic diffs
- Publishing is idempotent - existing packages are skipped gracefully
- Draft PRs are only auto-promoted if they have contract labels or WIP prefixes
- Migration templates are auto-generated for missing documentation

## Future Enhancements

Potential improvements:
- OpenAPI diff analysis using specialized tools (e.g., openapi-diff)
- Slack/Discord notifications for pipeline events
- Automated changelog generation
- SDK compatibility testing across versions
- Performance benchmarking for breaking changes