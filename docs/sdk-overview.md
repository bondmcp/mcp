# SDK Overview

BondMCP is developing official SDKs in multiple languages to help you integrate with our API quickly and easily once deployed. These SDKs will handle authentication, error handling, rate limiting, and provide a clean interface to all BondMCP endpoints.

> **Development Status**: All SDKs are currently in development and not yet available. The API infrastructure at api.bondmcp.com is not yet deployed. The examples below show the planned SDK interfaces.

## Planned SDKs

### Python SDK (In Development)

```bash
# Will be available when platform launches
pip install bondmcp
```

```python
# Planned SDK interface
from bondmcp import BondMCPClient

# Initialize client with your API key
client = BondMCPClient(api_key="your_api_key")

# Ask a health question
response = client.ask("What are the best supplements for joint health?")
print(response.answer)

# Interpret lab results
lab_results = [
    {"name": "Vitamin D", "value": 25, "unit": "ng/mL", "reference_range": "30-100"},
    {"name": "Ferritin", "value": 15, "unit": "ng/mL", "reference_range": "20-200"}
]
interpretation = client.labs.interpret(lab_results)
print(interpretation.insights)

# Get supplement recommendations
recommendations = client.supplement.recommend(health_goals=["joint health", "energy"])
print(recommendations.supplements)
```

### JavaScript/TypeScript SDK (In Development)

```bash
# Will be available when platform launches
npm install bondmcp
# or
yarn add bondmcp
```

```javascript
// Planned SDK interface
import { BondMCPClient } from 'bondmcp';

// Initialize client with your API key
const client = new BondMCPClient({ apiKey: 'your_api_key' });

// Ask a health question
const response = await client.ask('What are the best supplements for joint health?');
console.log(response.answer);

// Interpret lab results
const labResults = [
  { name: 'Vitamin D', value: 25, unit: 'ng/mL', referenceRange: '30-100' },
  { name: 'Ferritin', value: 15, unit: 'ng/mL', referenceRange: '20-200' }
];
const interpretation = await client.labs.interpret(labResults);
console.log(interpretation.insights);

// Get supplement recommendations
const recommendations = await client.supplement.recommend({
  healthGoals: ['joint health', 'energy']
});
console.log(recommendations.supplements);
```

### Go SDK (In Development)

```bash
# Will be available when platform launches
go get github.com/bondmcp/bondmcp-go
```

```go
// Planned SDK interface
package main

import (
    "fmt"
    "github.com/bondmcp/bondmcp-go"
)

func main() {
    // Initialize client with your API key
    client := bondmcp.NewClient("your_api_key")

    // Ask a health question
    response, err := client.Ask("What are the best supplements for joint health?")
    if err != nil {
        panic(err)
    }
    fmt.Println(response.Answer)

    // Interpret lab results
    labResults := []bondmcp.LabResult{
        {Name: "Vitamin D", Value: 25, Unit: "ng/mL", ReferenceRange: "30-100"},
        {Name: "Ferritin", Value: 15, Unit: "ng/mL", ReferenceRange: "20-200"},
    }
    interpretation, err := client.Labs.Interpret(labResults)
    if err != nil {
        panic(err)
    }
    fmt.Println(interpretation.Insights)

    // Get supplement recommendations
    recommendations, err := client.Supplement.Recommend([]string{"joint health", "energy"})
    if err != nil {
        panic(err)
    }
    fmt.Println(recommendations.Supplements)
}
```

## Planned Error Handling

All SDKs will provide consistent error handling patterns. Errors will be categorized into:

- **Authentication errors**: Issues with your API key
- **Validation errors**: Problems with your request parameters
- **Rate limit errors**: You've exceeded your usage limits
- **Server errors**: Issues on our end

Each SDK will follow the idiomatic error handling pattern for its language.

### Python Example (Planned Interface)

```python
# Planned SDK interface
from bondmcp import BondMCPClient, BondMCPAPIError, BondMCPNetworkError

client = BondMCPClient(api_key="your_api_key")

try:
    client.ask("What are the symptoms of high blood pressure?")
except BondMCPAPIError as e:
    print(f"API error {e.status_code} ({e.code}): {e}")
except BondMCPNetworkError as e:
    print(f"Network error: {e}")
```

Sample output when the API key is invalid:

```text
API error 401 (authentication_error): Invalid API key
```

Sample output for a network issue:

```text
Network error: Connection timed out
```

### JavaScript Example

```javascript
import { BondMCPClient, BondMCPAPIError, BondMCPNetworkError } from 'bondmcp';

const client = new BondMCPClient({ apiKey: 'your_api_key' });

try {
  await client.ask('What are the symptoms of high blood pressure?');
} catch (error) {
  if (error instanceof BondMCPAPIError) {
    console.log(`API error ${error.statusCode} (${error.code}): ${error.message}`);
  } else if (error instanceof BondMCPNetworkError) {
    console.log('Network error:', error.message);
  } else {
    console.log('Unexpected error:', error);
  }
}
```

Sample output for a missing endpoint:

```text
API error 404 (not_found): Endpoint not found
```

## Planned Pagination

For endpoints that return large collections of data, our SDKs will provide pagination helpers:

```python
# Planned Python interface
all_results = []
for page in client.health_data.list_all():
    all_results.extend(page.results)
```

```javascript
// Planned JavaScript interface
const allResults = [];
for await (const page of client.healthData.listAll()) {
    allResults.push(...page.results);
}
```

## Planned Advanced Configuration

All SDKs will support additional configuration options:

- Custom base URL
- Request timeouts
- Retry policies
- Custom HTTP clients

Refer to each SDK's documentation for language-specific configuration details once available.

## Planned SDK Source Code

All our SDKs will be open source and available in the [BondMCP/mcp](https://github.com/bondmcp/mcp) repository once development is complete. We welcome contributions and feedback to improve our developer experience.

> **Development Status**: SDKs are currently in development and not yet available. All interfaces shown above are planned and subject to change during development.
