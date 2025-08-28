# SDKs & Tools

Official SDKs and tools for the BondMCP Health AI platform.

## Available SDKs

### Python SDK
```bash
pip install bondmcp-python
```

Full-featured Python SDK with type hints and comprehensive examples.

### JavaScript/TypeScript SDK  
```bash
npm install @bondmcp/sdk
```

Universal SDK that works in Node.js and browsers with full TypeScript support.

### CLI Tools
```bash
pip install bondmcp-cli
```

Powerful command-line interface for health queries, scoring, and automation.

### Go SDK
```bash
go get github.com/bondmcp/bondmcp-go
```

High-performance Go SDK for enterprise applications.

## Getting Started

1. **Choose your SDK** based on your preferred language
2. **Install** using the package manager for your language  
3. **Get your API key** via CLI: `bondmcp keys create`
4. **Follow the quickstart** guide for your chosen SDK
5. **Explore examples** and build your health AI application

## Authentication

All SDKs use API key authentication:

```python
# Python
client = BondMCP(api_key="your-api-key")
```

```javascript
// JavaScript
const client = new BondMCP({ apiKey: 'your-api-key' });
```

```bash
# CLI
export BONDMCP_API_KEY="your-api-key"
bondmcp ask "health question"
```

## No Web Dashboard

BondMCP is . Use the CLI tools for all account management and API key operations.
