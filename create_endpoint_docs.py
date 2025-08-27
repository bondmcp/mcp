#!/usr/bin/env python3
"""
Generate comprehensive endpoint documentation from OpenAPI spec
"""
import json
import os

def create_endpoint_docs():
    """Create detailed endpoint documentation"""
    
    # Load OpenAPI spec
    with open('openapi/bondmcp-api.json', 'r') as f:
        spec = json.load(f)
    
    # Create endpoints documentation
    endpoints_content = """---
description: Complete API endpoints reference with interactive examples
---

# API Endpoints

## Base URL
```
https://api.bondmcp.com
```

## Authentication
All endpoints (except health checks) require Bearer token authentication:
```bash
Authorization: Bearer YOUR_API_KEY
```

## Available Endpoints

"""
    
    # Group endpoints by category
    categories = {
        'MCP': [],
        'System': [],
        'Authentication': [],
        'Healthcare': [],
        'Vendors': [],
        'API Keys': []
    }
    
    # Process each endpoint
    for path, methods in spec['paths'].items():
        for method, details in methods.items():
            tags = details.get('tags', ['Other'])
            category = tags[0] if tags else 'Other'
            
            if category not in categories:
                categories[category] = []
            
            endpoint_info = {
                'method': method.upper(),
                'path': path,
                'summary': details.get('summary', 'No summary'),
                'description': details.get('description', 'No description'),
                'auth_required': 'security' in details,
                'parameters': details.get('parameters', []),
                'requestBody': details.get('requestBody', {}),
                'responses': details.get('responses', {})
            }
            
            categories[category].append(endpoint_info)
    
    # Generate documentation for each category
    for category, endpoints in categories.items():
        if not endpoints:
            continue
            
        endpoints_content += f"### {category}\n\n"
        
        for endpoint in endpoints:
            auth_badge = "🔒" if endpoint['auth_required'] else "🔓"
            endpoints_content += f"#### {auth_badge} `{endpoint['method']} {endpoint['path']}`\n\n"
            endpoints_content += f"**{endpoint['summary']}**\n\n"
            endpoints_content += f"{endpoint['description']}\n\n"
            
            # Parameters
            if endpoint['parameters']:
                endpoints_content += "**Parameters:**\n"
                for param in endpoint['parameters']:
                    required = "✅" if param.get('required') else "❌"
                    endpoints_content += f"- `{param['name']}` ({param['in']}) {required} - {param.get('schema', {}).get('type', 'unknown')}\n"
                endpoints_content += "\n"
            
            # Request body
            if endpoint['requestBody']:
                endpoints_content += "**Request Body:**\n"
                content = endpoint['requestBody'].get('content', {})
                if 'application/json' in content:
                    schema = content['application/json'].get('schema', {})
                    endpoints_content += f"- Content-Type: `application/json`\n"
                    endpoints_content += f"- Schema: {schema.get('type', 'object')}\n"
                endpoints_content += "\n"
            
            # Example usage
            endpoints_content += "**Example:**\n"
            endpoints_content += "```bash\n"
            if endpoint['auth_required']:
                endpoints_content += f"curl -H \"Authorization: Bearer YOUR_API_KEY\" \\\n"
            else:
                endpoints_content += f"curl \\\n"
            
            if endpoint['method'] == 'GET':
                endpoints_content += f"  https://api.bondmcp.com{endpoint['path']}\n"
            else:
                endpoints_content += f"  -X {endpoint['method']} \\\n"
                endpoints_content += f"  -H \"Content-Type: application/json\" \\\n"
                if endpoint['requestBody']:
                    endpoints_content += f"  -d '{{\"example\": \"data\"}}' \\\n"
                endpoints_content += f"  https://api.bondmcp.com{endpoint['path']}\n"
            
            endpoints_content += "```\n\n"
            
            # Response
            responses = endpoint['responses']
            if '200' in responses:
                endpoints_content += "**Success Response (200):**\n"
                response_content = responses['200'].get('content', {})
                if 'application/json' in response_content:
                    endpoints_content += "```json\n"
                    endpoints_content += "{\n"
                    endpoints_content += "  \"status\": \"success\",\n"
                    endpoints_content += "  \"data\": {...}\n"
                    endpoints_content += "}\n"
                    endpoints_content += "```\n\n"
            
            endpoints_content += "---\n\n"
    
    # Add interactive testing section
    endpoints_content += """
## Interactive Testing

### Using the GitBook API Explorer
1. Navigate to any endpoint above
2. Click "Try it out" 
3. Fill in required parameters
4. Add your API key in the Authorization header
5. Click "Execute" to test

### Using curl
```bash
# Set your API key
export BONDMCP_API_KEY="your-api-key-here"

# Test health endpoint
curl https://api.bondmcp.com/health

# Test authenticated endpoint
curl -H "Authorization: Bearer $BONDMCP_API_KEY" \\
  https://api.bondmcp.com/healthcare/programs
```

### Using Python SDK
```python
from bondmcp import BondMCP

client = BondMCP(api_key="your-api-key")
response = client.get_programs()
print(response)
```

## Rate Limits
- **Default**: 120 requests per minute
- **Authenticated**: Higher limits based on plan
- **Headers**: Rate limit info in response headers

## Error Handling
All endpoints return consistent error responses:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {...}
  }
}
```

Common error codes:
- `401` - Unauthorized (invalid API key)
- `403` - Forbidden (insufficient permissions)
- `429` - Rate limit exceeded
- `500` - Internal server error

---
*Documentation auto-generated from OpenAPI specification*
"""
    
    # Write the documentation
    with open('api-reference/endpoints.md', 'w') as f:
        f.write(endpoints_content)
    
    print(f"Created comprehensive endpoint documentation with {len(spec['paths'])} endpoints")
    
    # Also create OpenAPI specification page
    openapi_content = f"""---
description: Interactive OpenAPI specification for BondMCP Healthcare Platform
---

# OpenAPI Specification

## Interactive API Documentation

<div data-gb-custom-block data-tag="openapi" data-document="bondmcp-api">

</div>

## Specification Details

- **OpenAPI Version**: {spec['openapi']}
- **API Version**: {spec['info']['version']}
- **Title**: {spec['info']['title']}
- **Description**: {spec['info']['description']}

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
openapi-generator-cli generate \\
  -i https://api.bondmcp.com/openapi.json \\
  -g python \\
  -o ./bondmcp-python-client

# Generate JavaScript client  
openapi-generator-cli generate \\
  -i https://api.bondmcp.com/openapi.json \\
  -g javascript \\
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
*Interactive documentation powered by GitBook OpenAPI integration*
"""
    
    with open('api-reference/openapi-specification-cli-api-only.md', 'w') as f:
        f.write(openapi_content)
    
    print("Created interactive OpenAPI specification page")

if __name__ == '__main__':
    create_endpoint_docs()
