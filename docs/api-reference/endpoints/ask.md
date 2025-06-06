# Health Question Answering API

The `/api/v1/ask` endpoint allows you to query the BondMCP AI with health-related questions and receive medically-informed responses.

## Endpoint

```
POST /api/v1/ask
```

## Authentication

API Key required in header: `X-API-Key: your-api-key`

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | The health question to ask |
| `context` | string | No | Context for the question (e.g., "general-health", "nutrition", "fitness") |
| `user_id` | string | No | Optional user identifier for personalization |
| `include_sources` | boolean | No | Whether to include reference sources in the response (default: true) |
| `max_tokens` | integer | No | Maximum response length (default: 500) |

## Example Request

```json
{
  "message": "What are the symptoms of high blood pressure?",
  "context": "general-health",
  "include_sources": true
}
```

## Response

| Field | Type | Description |
|-------|------|-------------|
| `answer` | string | The AI-generated answer to the health question |
| `confidence` | float | Confidence score (0-1) |
| `sources` | array | List of medical sources referenced |
| `timestamp` | string | ISO 8601 timestamp of the response |

## Example Response

```json
{
  "answer": "High blood pressure (hypertension) is often called a 'silent killer' because it typically doesn't cause symptoms until it reaches severe or life-threatening stages. Most people with high blood pressure don't experience any symptoms, which is why regular blood pressure checks are important.\n\nHowever, in cases of severely elevated blood pressure, symptoms may include:\n\n- Headaches, particularly in the morning\n- Nosebleeds\n- Irregular heartbeat\n- Vision changes or blurred vision\n- Buzzing in the ears\n- Fatigue or confusion\n- Chest pain\n- Difficulty breathing\n- Blood in the urine\n- Pounding in the chest, neck, or ears\n\nIf you experience these symptoms, especially if you know you have high blood pressure, seek medical attention immediately as they could indicate a hypertensive crisis.",
  "confidence": 0.96,
  "sources": ["American Heart Association", "Mayo Clinic", "CDC"],
  "timestamp": "2024-06-04T04:45:00Z"
}
```

## Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `INVALID_REQUEST` | Missing required parameters or invalid format |
| 401 | `INVALID_AUTH` | Invalid API key |
| 429 | `RATE_LIMIT_EXCEEDED` | Rate limit exceeded |
| 500 | `SERVER_ERROR` | Internal server error |

## SDK Examples

### JavaScript/TypeScript

```javascript
import { BondMCPClient } from 'bondmcp';

const client = new BondMCPClient({ apiKey: 'your-api-key' });

const response = await client.ask('What are the symptoms of high blood pressure?');
console.log(response.answer);
```

### Python

```python
from bondmcp import BondMCPClient

client = BondMCPClient(api_key='your-api-key')

response = client.ask('What are the symptoms of high blood pressure?')
print(response.answer)
```

### Go

```go
package main

import (
    "fmt"
    "github.com/bondmcp/bondmcp-go"
)

func main() {
    client := bondmcp.NewClient("your-api-key")
    
    response, err := client.Ask("What are the symptoms of high blood pressure?")
    if err != nil {
        panic(err)
    }
    
    fmt.Println(response.Answer)
}
```

## Notes

- Responses are generated using a multi-model consensus approach for high accuracy
- All responses are for informational purposes only and do not constitute medical advice
- For detailed SDK documentation, visit [docs.bondmcp.com/sdks](https://docs.bondmcp.com/sdks)
