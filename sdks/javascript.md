# JavaScript SDK

The BondMCP JavaScript SDK provides a convenient way to interact with the BondMCP API from your JavaScript applications.

## Installation

```bash
npm install @bondmcp/sdk
```

## Authentication

```javascript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({ apiKey: 'YOUR_API_KEY' });
```

## Usage

### Ask a Health Question

```javascript
const response = await client.health.ask({ question: 'What are the symptoms of diabetes?' });
console.log(response.answer);
```

### Get Trust Certificate

```javascript
const certificate = await client.health.getTrustCertificate({ responseId: response.id });
console.log(certificate);
```

### User Management

```javascript
// Register a new user
const user = await client.auth.register({ email: 'user@example.com', password: 'password123', name: 'John Doe' });

// Login
const token = await client.auth.login({ email: 'user@example.com', password: 'password123' });

// Set the token for subsequent requests
client.setToken(token.access_token);
```

### API Key Management

```javascript
// Create a new API key
const newKey = await client.auth.createApiKey({ name: 'My App' });

// List API keys
const keys = await client.auth.listApiKeys();

// Revoke an API key
await client.auth.revokeApiKey({ keyId: newKey.id });
```

## Error Handling

```javascript
try {
    const response = await client.health.ask({ question: '' });
} catch (error) {
    console.error(`Error: ${error.message}`);
}
```

