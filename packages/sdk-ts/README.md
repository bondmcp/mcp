# @bondmcp/sdk

Official TypeScript SDK for the BondMCP Healthcare Platform API.

## Installation

```bash
npm install @bondmcp/sdk
```

## Usage

```typescript
import { BondMCPClient } from '@bondmcp/sdk';

// Initialize with API key
const client = new BondMCPClient({
  apiKey: 'your-api-key'
});

// Or with bearer token
const client = new BondMCPClient({
  bearerToken: 'your-bearer-token'
});

// Ask a health question
const response = await client.askHealthQuestion({
  message: "What are the symptoms of diabetes?",
  includeReferences: true
});

console.log(response.response);
```

## API Reference

Full API documentation is available at [https://www.bondmcp.com/docs](https://www.bondmcp.com/docs).

## Features

- **Type Safety**: Full TypeScript type definitions
- **Authentication**: Support for API key and Bearer token authentication
- **Modern**: Built with modern ES6+ features
- **Well-documented**: Comprehensive JSDoc comments

## License

MIT