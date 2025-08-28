
# Endpoints

Complete API endpoints documentation for the BondMCP Healthcare Platform.

## Base URL
All API requests should be made to:
```
https://api.bondmcp.com
```

## Authentication
All endpoints require authentication using an API key in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

## Core Endpoints

### Health Check
**GET /health**

Check the API service status and version information.

**Response:**
```json
{
  "status": "operational",
  "version": "2.1.0",
  "timestamp": "2025-08-28T10:30:00Z",
  "services": {
    "ai_engine": "operational",
    "database": "operational", 
    "cache": "operational"
  }
}
```

### Ask Health Questions
**POST /ask**

Submit health-related questions to the AI system.

**Request Body:**
```json
{
  "question": "What are the benefits of vitamin D?",
  "context": "optional additional context",
  "user_id": "optional user identifier"
}
```

**Response:**
```json
{
  "answer": "Vitamin D provides several important health benefits...",
  "confidence": 0.95,
  "sources": ["source1", "source2"],
  "timestamp": "2025-08-28T10:30:00Z"
}
```

## MCP Discovery Endpoints

### MCP Configuration
**GET /.well-known/mcp-configuration**

Returns Model Context Protocol configuration for AI assistants.

**Response:**
```json
{
  "mcpVersion": "2024-11-05",
  "capabilities": {
    "tools": true,
    "resources": true,
    "prompts": true
  },
  "serverInfo": {
    "name": "BondMCP Healthcare Platform",
    "version": "2.1.0"
  }
}
```

### MCP Manifest
**GET /mcp-manifest.json**

Returns the complete MCP manifest with available tools and resources.

## Rate Limiting

- **Rate Limit**: 100 requests per minute per API key
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

## Error Responses

All endpoints return standard HTTP status codes:

- **200**: Success
- **400**: Bad Request - Invalid parameters
- **401**: Unauthorized - Invalid or missing API key
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error

**Error Response Format:**
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request parameters are invalid",
    "details": "Additional error details"
  }
}
```

## Interactive Testing

Use the BondMCP CLI for interactive testing:
```bash
# Install CLI
pip install bondmcp-cli

# Test health endpoint
bondmcp health

# Ask a question
bondmcp ask "What should I eat for breakfast?"
```

## SDK Integration

- **Python SDK**: `pip install bondmcp-python`
- **JavaScript SDK**: `npm install @bondmcp/sdk`
- **Go SDK**: Available in the Go SDK section
- **CLI Tools**: `pip install bondmcp-cli`

For detailed SDK usage examples, see the respective SDK documentation sections.
