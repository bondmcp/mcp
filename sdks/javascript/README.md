# BondMCP JavaScript SDK

[![npm version](https://badge.fury.io/js/%40bondmcp%2Fsdk.svg)](https://badge.fury.io/js/%40bondmcp%2Fsdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

> **TypeScript-first SDK for Node.js and browser environments**

## 🚀 Quick Start

### Installation

```bash
npm install @bondmcp/sdk
# or
yarn add @bondmcp/sdk
# or
pnpm add @bondmcp/sdk
```

### Basic Usage

```typescript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({
  apiKey: 'your_api_key_here',
  environment: 'production' // or 'staging'
});

// Ask a health question
const response = await client.ask({
  query: "What are the potential causes of elevated liver enzymes?",
  includeCitations: true,
  modelPreference: 'consensus'
});

console.log(response.answer);
console.log(`Confidence: ${response.confidenceScore}`);
```

## 📚 Features

### ✅ **Full TypeScript Support**
- Complete type definitions
- IntelliSense support
- Compile-time error checking

### 🌐 **Universal Compatibility**
- Node.js 16+ support
- Modern browsers (ES2020+)
- React/Vue/Angular compatible
- Next.js/Nuxt.js ready

### ⚡ **Advanced Features**
- Automatic retry logic
- Request/response interceptors
- Built-in rate limiting
- Streaming responses
- WebSocket support

## 🔧 Configuration

### Environment Setup

```typescript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({
  apiKey: process.env.BONDMCP_API_KEY,
  environment: 'production',
  timeout: 30000,
  retries: 3,
  rateLimit: {
    requests: 100,
    window: 60000 // 1 minute
  }
});
```

### Browser Usage

```html
<script type="module">
  import { BondMCP } from 'https://cdn.skypack.dev/@bondmcp/sdk';
  
  const client = new BondMCP({
    apiKey: 'your_public_api_key',
    environment: 'production'
  });
</script>
```

## 📖 API Reference

### Core Methods

#### `client.ask(options)`
Multi-model consensus health AI query.

```typescript
const response = await client.ask({
  query: string,
  conversationId?: string,
  includeCitations?: boolean,
  modelPreference?: 'consensus' | 'claude' | 'gpt4' | 'medlm'
});
```

#### `client.labs.interpret(options)`
Interpret laboratory results.

```typescript
const interpretation = await client.labs.interpret({
  labResults: [
    {
      testName: 'Total Cholesterol',
      value: 240,
      unit: 'mg/dL',
      referenceRange: '< 200 mg/dL'
    }
  ],
  patientContext?: {
    age: 45,
    gender: 'male',
    medicalHistory: ['hypertension']
  }
});
```

#### `client.supplements.recommend(options)`
Get personalized supplement recommendations.

```typescript
const recommendations = await client.supplements.recommend({
  healthGoals: ['cardiovascular_health', 'energy'],
  currentLabs: {
    vitaminD: { value: 25, unit: 'ng/mL' }
  },
  dietaryRestrictions: ['vegetarian']
});
```

### Streaming Responses

```typescript
const stream = client.askStream({
  query: "Explain the cardiovascular system"
});

for await (const chunk of stream) {
  console.log(chunk.content);
}
```

### WebSocket Real-time

```typescript
const ws = client.createWebSocket();

ws.on('message', (data) => {
  console.log('Real-time update:', data);
});

ws.send({
  type: 'subscribe',
  channel: 'health_alerts'
});
```

## 🧪 Examples

### React Hook

```typescript
import { useState, useEffect } from 'react';
import { BondMCP } from '@bondmcp/sdk';

const useBondMCP = () => {
  const [client] = useState(() => new BondMCP({
    apiKey: process.env.REACT_APP_BONDMCP_API_KEY
  }));

  return client;
};

function HealthQuery() {
  const client = useBondMCP();
  const [response, setResponse] = useState(null);

  const askQuestion = async (query: string) => {
    const result = await client.ask({ query });
    setResponse(result);
  };

  return (
    <div>
      <button onClick={() => askQuestion("What is diabetes?")}>
        Ask about diabetes
      </button>
      {response && <p>{response.answer}</p>}
    </div>
  );
}
```

### Node.js Express Server

```typescript
import express from 'express';
import { BondMCP } from '@bondmcp/sdk';

const app = express();
const client = new BondMCP({
  apiKey: process.env.BONDMCP_API_KEY
});

app.post('/health-query', async (req, res) => {
  try {
    const { query } = req.body;
    const response = await client.ask({ query });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### Vue.js Composition API

```typescript
import { ref } from 'vue';
import { BondMCP } from '@bondmcp/sdk';

export function useHealthAI() {
  const client = new BondMCP({
    apiKey: import.meta.env.VITE_BONDMCP_API_KEY
  });

  const loading = ref(false);
  const response = ref(null);

  const askQuestion = async (query: string) => {
    loading.value = true;
    try {
      response.value = await client.ask({ query });
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    response,
    askQuestion
  };
}
```

## 🔒 Security

### API Key Management

```typescript
// ✅ Good - Environment variables
const client = new BondMCP({
  apiKey: process.env.BONDMCP_API_KEY
});

// ❌ Bad - Hardcoded keys
const client = new BondMCP({
  apiKey: 'bmcp_live_...' // Never do this!
});
```

### Rate Limiting

```typescript
const client = new BondMCP({
  apiKey: process.env.BONDMCP_API_KEY,
  rateLimit: {
    requests: 50,    // 50 requests
    window: 60000    // per minute
  }
});
```

## 🧪 Testing

### Jest Setup

```typescript
// __tests__/setup.ts
import { BondMCP } from '@bondmcp/sdk';

// Mock the SDK for testing
jest.mock('@bondmcp/sdk', () => ({
  BondMCP: jest.fn().mockImplementation(() => ({
    ask: jest.fn().mockResolvedValue({
      answer: 'Mocked response',
      confidenceScore: 0.95
    })
  }))
}));
```

### Unit Test Example

```typescript
import { BondMCP } from '@bondmcp/sdk';

describe('BondMCP Client', () => {
  let client: BondMCP;

  beforeEach(() => {
    client = new BondMCP({
      apiKey: 'test_key',
      environment: 'staging'
    });
  });

  it('should ask health questions', async () => {
    const response = await client.ask({
      query: 'What is hypertension?'
    });

    expect(response.answer).toBeDefined();
    expect(response.confidenceScore).toBeGreaterThan(0.8);
  });
});
```

## 📦 Build & Development

### Development Setup

```bash
# Clone the repository
git clone https://github.com/bondmcp/mcp.git
cd mcp/javascript

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Package Scripts

```json
{
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  }
}
```

## 🚀 Deployment

### NPM Publishing

```bash
# Build the package
npm run build

# Publish to NPM
npm publish --access public
```

### CDN Usage

```html
<!-- ES Modules -->
<script type="module">
  import { BondMCP } from 'https://cdn.skypack.dev/@bondmcp/sdk';
</script>

<!-- UMD -->
<script src="https://unpkg.com/@bondmcp/sdk/dist/index.umd.js"></script>
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the **LICENSE**  file for details.

## 🔗 Links

- **📚 Main Repository**: [bondmcp/mcp](https://github.com/bondmcp/mcp)
- **🌐 Website**: [bondmcp.com](https://bondmcp.com)
- **📖 API Documentation**: [docs.bondmcp.com](https://docs.bondmcp.com)
- **🎮 Try It Live**: [bondmcp.com/try](https://bondmcp.com/try)

---

<div align="center">
  <strong>Built with ❤️ for JavaScript developers</strong>
</div>

