---
description: Interactive OpenAPI specification for BondMCP Healthcare Platform
---

# OpenAPI Specification

## Interactive API Documentation

<div data-gb-custom-block data-tag="openapi" data-document="bondmcp-api">

</div>

## Specification Details

- **OpenAPI Version**: 3.1.0
- **API Version**: 2.1.0
- **Title**: BondMCP Healthcare Platform
- **Description**: Comprehensive healthcare AI and MCP platform with security-focused architecture

## Download Specification

- [JSON Format](https://api.bondmcp.com/openapi.json)
- [YAML Format](https://api.bondmcp.com/openapi.yaml)

## Using the Specification

### Import into Postman

1. Open Postman
2. Click "Import"
3. Enter URL: `https://api.bondmcp.com/openapi.json`
4. Configure authentication with your API key

### Generate SDK

```bash
# Install OpenAPI Generator
npm install @openapitools/openapi-generator-cli -g

# Generate Python client
openapi-generator-cli generate \
  -i https://api.bondmcp.com/openapi.json \
  -g python \
  -o ./bondmcp-python-client

# Generate JavaScript client
openapi-generator-cli generate \
  -i https://api.bondmcp.com/openapi.json \
  -g javascript \
  -o ./bondmcp-js-client
```

### Validate API Calls

```bash
# Install swagger-codegen
pip install swagger-spec-validator

# Validate the spec
swagger_spec_validator https://api.bondmcp.com/openapi.json
```

## Schema Definitions

The API includes comprehensive schema definitions for:

- **Authentication**: Login requests, API key management
- **Healthcare**: Patient data, prescriptions, programs
- **MCP Configuration**: Service capabilities and configuration
- **Vendors**: Third-party integrations and webhooks
- **System**: Health checks and deployment info

## Interactive Features

This documentation includes:

- ✅ **Try it out** functionality for all endpoints
- ✅ **Real-time validation** of request parameters
- ✅ **Example responses** with actual data structures
- ✅ **Authentication testing** with your API keys
- ✅ **Error simulation** for testing error handling

---

_Interactive documentation powered by GitBook OpenAPI integration_
