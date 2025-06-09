# SDK Version Compatibility

## Overview
This document outlines the compatibility between different versions of the BondMCP SDKs and the BondMCP API.

## Python SDK

| SDK Version | API Version | Compatible | Notes |
|-------------|-------------|------------|-------|
| 1.0.x       | v1          | ✅         | Initial release |
| 1.1.x       | v1          | ✅         | Added wearable data integration |
| 1.2.x       | v1, v2      | ✅         | Added support for v2 endpoints |
| 2.0.x       | v2          | ✅         | Requires API v2, not backward compatible |

## TypeScript SDK

| SDK Version | API Version | Compatible | Notes |
|-------------|-------------|------------|-------|
| 0.9.x       | v1          | ✅         | Beta release |
| 1.0.x       | v1          | ✅         | Initial stable release |
| 1.1.x       | v1, v2      | ✅         | Added support for v2 endpoints |

## Version Selection Guide

### When to use v1 API and compatible SDKs
- For basic healthcare data analysis
- When working with existing integrations
- For maximum stability

### When to use v2 API and compatible SDKs
- For advanced wearable data integration
- For medical records analysis
- For supplement interaction checking
- For access to the latest features

## Upgrading Guide

### Python SDK
To upgrade from 1.x to 2.x:
```bash
pip install bondmcp-sdk==2.0.0
```

### TypeScript SDK
To upgrade to the latest version:
```bash
npm install @bondmcp/sdk@latest
```

## Deprecation Schedule
- v1 API: Supported until 2026-12-31
- Python SDK 1.x: Supported until 2026-12-31
- TypeScript SDK 0.9.x: Deprecated, upgrade to 1.x recommended
