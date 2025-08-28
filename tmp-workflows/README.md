# Temporary Workflows

This directory contains GitHub Actions workflow files that should be moved to `.github/workflows/` directory.

## Files

### `verify-api-status.yml`

Automated workflow that:

- Tests API endpoint availability daily
- Verifies documentation accuracy against actual API status
- Updates `ACTUAL_API_STATUS.md` with test results
- Creates GitHub issues when documentation/API misalignment is detected

## Manual Action Required

**Move this file to enable the workflow:**

```bash
# Move the workflow file to the correct location
mv tmp-workflows/verify-api-status.yml .github/workflows/

# Remove this temporary directory
rm -rf tmp-workflows/
```

## Why This Directory Exists

The automated agent cannot directly modify `.github/workflows/` directory due to security restrictions. The workflow file has been created here and must be manually moved by a repository maintainer.

## Workflow Features

- **Daily Monitoring**: Runs automatically at 6 AM UTC
- **Manual Trigger**: Can be run on-demand via GitHub Actions UI
- **Documentation Trigger**: Runs when documentation files change
- **Automated Updates**: Updates API status documentation
- **Issue Creation**: Creates GitHub issues for misalignments
- **Artifact Storage**: Saves test results for historical tracking
