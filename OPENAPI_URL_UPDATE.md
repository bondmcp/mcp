# OpenAPI URL Update

## Overview

This document outlines the changes made to update all references to the BondMCP OpenAPI specification URL throughout the codebase.

## Changes Made

The OpenAPI specification URL has been updated from:

- Old URL: `https://api.bondmcp.com/openapi.json`
- New URL: `https://openapi.bondmcp.com/openapi.bondmcp`

## Files Updated

The following files have been updated to reference the new OpenAPI URL:

1. **GitHub Workflows**
   - `.github/workflows/gitbook-sync.yml`
   - `.github/workflows/openapi-generation.yml`

2. **Documentation**
   - `docs/api-reference/openapi.md`

3. **Scripts**
   - `scripts/deploy/deploy_openapi.js`
   - `scripts/generate_openapi.js`

## Auto-Generation Process

The OpenAPI JSON is automatically generated based on the AWS infrastructure via a Git workflow. This ensures that the documentation is always up-to-date with the latest API changes.

Key points about the auto-generation process:

1. The OpenAPI specification is generated from the live API endpoints
2. Updates are triggered automatically through the Git workflow
3. The specification is published to `https://openapi.bondmcp.com/openapi.bondmcp`
4. The documentation reflects the current state of the production API

## Next Steps

1. Verify the new OpenAPI endpoint is accessible
2. Update any frontend or client applications to reference the new URL
3. Monitor for any issues related to the URL change

## Contact

For questions or issues related to the API or its documentation, please contact the BondMCP support team.
