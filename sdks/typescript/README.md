# BondMCP TypeScript SDK

Official TypeScript/JavaScript SDK for BondMCP - The #1 MCP (Model Context Protocol) in Health.

[![npm version](https://badge.fury.io/js/%40bondmcp%2Ftypescript-sdk.svg)](https://badge.fury.io/js/%40bondmcp%2Ftypescript-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Modern TypeScript/JavaScript** - Full type safety with comprehensive TypeScript definitions
- 🔄 **Async/Await Support** - Promise-based API with async/await support
- 🛡️ **Runtime Validation** - Request/response validation using Zod schemas
- 🔁 **Automatic Retries** - Built-in retry logic with exponential backoff
- 📊 **Usage Tracking** - Built-in request counting and cost tracking
- 🎯 **Comprehensive Coverage** - Support for all 30+ BondMCP API endpoints
- 🔧 **Developer Friendly** - Excellent IntelliSense and autocomplete support
- 📱 **Universal** - Works in Node.js, browsers, and React Native

## Installation

```bash
npm install @bondmcp/typescript-sdk
# or
yarn add @bondmcp/typescript-sdk
# or
pnpm add @bondmcp/typescript-sdk
```

## Quick Start

```typescript
import { BondMCPClient, UserTier } from '@bondmcp/typescript-sdk';

// Initialize the client
const client = new BondMCPClient({
  apiKey: 'your-api-key-here',
  userTier: UserTier.PROFESSIONAL,
  enableLogging: true
});

// Check API health
const healthCheck = await client.health.check();
console.log('API Status:', healthCheck.data.status);

// Ask a health question
const response = await client.ask.query({
  prompt: "What are the benefits of vitamin D supplementation?",
  include_citations: true
});

console.log('AI Response:', response.data.answer);
console.log('Citations:', response.data.citations);
```

## Configuration Options

```typescript
interface BondMCPConfig {
  apiKey: string;                    // Required: Your BondMCP API key
  baseURL?: string;                  // Optional: Custom API base URL
  timeout?: number;                  // Optional: Request timeout (default: 30000ms)
  maxRetries?: number;               // Optional: Max retry attempts (default: 3)
  retryDelay?: number;               // Optional: Retry delay (default: 1000ms)
  enableLogging?: boolean;           // Optional: Enable debug logging (default: false)
  userTier?: UserTier;              // Optional: Your subscription tier
}
```

## API Reference

### Health Endpoints

```typescript
// Check API health
const health = await client.health.check();
```

### AI Question Answering

```typescript
// Ask a health question
const response = await client.ask.query({
  prompt: "What are the symptoms of vitamin B12 deficiency?",
  context: "Patient is vegetarian, age 35",
  include_citations: true,
  model_preference: ModelPreference.CONSENSUS
});
```

### Lab Result Interpretation

```typescript
// Interpret lab results
const interpretation = await client.labs.interpret({
  lab_results: {
    "Vitamin D": { value: 15, unit: "ng/mL" },
    "B12": { value: 200, unit: "pg/mL" }
  },
  patient_context: "35-year-old vegetarian",
  include_recommendations: true
});
```

### Supplement Recommendations

```typescript
// Get supplement recommendations
const recommendations = await client.supplements.recommend({
  health_goals: ["immune support", "energy"],
  current_supplements: ["multivitamin"],
  dietary_restrictions: ["vegetarian"],
  age: 35,
  gender: "female"
});

// Check supplement interactions
const interactions = await client.supplements.checkInteractions({
  supplements: ["vitamin D", "magnesium"],
  medications: ["levothyroxine"]
});
```

### Wearable Data Analysis

```typescript
// Analyze wearable data
const insights = await client.wearables.analyzeData({
  wearable_data: {
    heart_rate: [65, 68, 72, 70],
    steps: [8500, 9200, 7800, 10500],
    sleep_hours: [7.5, 6.8, 8.2, 7.1]
  },
  timeframe: "week",
  metrics: ["heart_rate_variability", "sleep_quality"]
});
```

### Chat and Conversations

```typescript
// Create a new conversation
const conversation = await client.chat.createConversation({
  initial_message: "I'd like to discuss my recent lab results",
  context: { patient_age: 35, gender: "female" }
});

// Send a message
const response = await client.chat.sendMessage(conversation.data.id, {
  message: "My vitamin D level is 15 ng/mL. What should I do?"
});

// Get conversation history
const history = await client.chat.getConversation(conversation.data.id);
```

### API Key Management

```typescript
// List API keys
const keys = await client.apiKeys.list();

// Create a new API key
const newKey = await client.apiKeys.create({
  name: "Production Key",
  scopes: ["ask", "labs", "supplements"],
  expires_at: "2024-12-31T23:59:59Z"
});

// Revoke an API key
await client.apiKeys.revoke("key-id");
```

### Usage and Billing

```typescript
// Get usage statistics
const usage = await client.payments.getUsage({
  start_date: "2024-01-01",
  end_date: "2024-01-31"
});

// Get client usage stats
const stats = client.getUsageStats();
console.log(`Made ${stats.requestCount} requests`);
```

## Error Handling

The SDK provides comprehensive error handling with specific error types:

```typescript
import { 
  AuthenticationError, 
  RateLimitError, 
  ValidationError, 
  APIError 
} from '@bondmcp/typescript-sdk';

try {
  const response = await client.ask.query({
    prompt: "What is the recommended dosage of vitamin D?"
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded, please wait');
  } else if (error instanceof ValidationError) {
    console.error('Invalid request data:', error.message);
  } else if (error instanceof APIError) {
    console.error('API error:', error.message, error.statusCode);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## TypeScript Support

The SDK is built with TypeScript and provides comprehensive type definitions:

```typescript
import { 
  AskRequest, 
  AskResponse, 
  LabInterpretationRequest,
  SupplementRecommendationRequest,
  APIResponse 
} from '@bondmcp/typescript-sdk';

// Full type safety
const request: AskRequest = {
  prompt: "What are the benefits of omega-3?",
  include_citations: true
};

const response: APIResponse<AskResponse> = await client.ask.query(request);
```

## Advanced Usage

### Custom Request Configuration

```typescript
// Custom timeout for specific request
const response = await client.request('POST', '/custom-endpoint', data, {
  timeout: 60000  // 60 seconds
});
```

### Request Validation

```typescript
import { AskRequestSchema } from '@bondmcp/typescript-sdk';

// Validate request data
const validatedRequest = client.validateRequest(AskRequestSchema, requestData);
```

### Usage Tracking

```typescript
// Monitor usage
setInterval(() => {
  const stats = client.getUsageStats();
  console.log(`Requests: ${stats.requestCount}, Cost: $${stats.totalCost}`);
}, 60000);
```

## Browser Usage

The SDK works in browsers with proper CORS configuration:

```html
<script type="module">
  import { BondMCPClient } from 'https://unpkg.com/@bondmcp/typescript-sdk@latest/dist/index.esm.js';
  
  const client = new BondMCPClient({
    apiKey: 'your-api-key'
  });
  
  // Use the client...
</script>
```

## React Integration

```tsx
import React, { useState, useEffect } from 'react';
import { BondMCPClient, UserTier } from '@bondmcp/typescript-sdk';

const client = new BondMCPClient({
  apiKey: process.env.REACT_APP_BONDMCP_API_KEY!,
  userTier: UserTier.PROFESSIONAL
});

function HealthChat() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async (question: string) => {
    setLoading(true);
    try {
      const result = await client.ask.query({
        prompt: question,
        include_citations: true
      });
      setResponse(result.data.answer);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => askQuestion("What is a healthy BMI range?")}>
        Ask Health Question
      </button>
      {loading && <p>Loading...</p>}
      {response && <p>{response}</p>}
    </div>
  );
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@bondmcp.com
- 📖 Documentation: https://docs.bondmcp.com
- 🐛 Issues: https://github.com/bondmcp/mcp/issues
- 💬 Discord: https://discord.gg/bondmcp

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by the BondMCP Team

