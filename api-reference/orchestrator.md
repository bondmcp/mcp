# Multi-Model Orchestration API

The `/api/v1/orchestrator/multi-llm` endpoint provides access to BondMCP's advanced multi-model consensus system, which combines responses from multiple specialized healthcare AI models to deliver highly accurate and reliable answers.

## Endpoint

```
POST /api/v1/orchestrator/multi-llm
```

## Authentication

Requires API key authentication via the `X-API-Key` header.

## Request Format

```json
{
  "query": "What are the potential drug interactions between metformin and lisinopril?",
  "context": "patient_medication_review",
  "consensus_threshold": 0.8,
  "include_model_responses": true,
  "max_tokens": 800
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | The health-related query to process |
| `context` | string | No | Context for the query (e.g., "patient_medication_review", "clinical_decision_support") |
| `consensus_threshold` | number | No | Minimum agreement threshold between models (0.0-1.0, default: 0.8) |
| `include_model_responses` | boolean | No | Whether to include individual model responses (default: `false`) |
| `max_tokens` | integer | No | Maximum length of the response (default: `500`, max: `2000`) |

## Response Format

```json
{
  "request_id": "req_234bcd567efg",
  "timestamp": "2025-06-06T11:18:00Z",
  "consensus_response": "Metformin and lisinopril are generally considered safe to take together and are often prescribed for patients with diabetes and hypertension. There are no significant pharmacokinetic interactions between these medications. However, both drugs can affect kidney function, so patients with renal impairment should be monitored closely. Additionally, both medications can rarely cause lactic acidosis, particularly in patients with significant renal dysfunction. Regular monitoring of kidney function is recommended when these medications are used together.",
  "confidence_score": 0.94,
  "sources": [
    {
      "title": "Drug Interaction Database",
      "citation": "National Institute of Health Drug Interaction Database, 2025."
    },
    {
      "title": "Clinical Guidelines",
      "citation": "American Diabetes Association. Standards of Medical Care in Diabetes—2025."
    }
  ],
  "model_responses": [
    {
      "model_id": "medical_model_1",
      "response": "Metformin and lisinopril do not have significant pharmacokinetic interactions and are commonly prescribed together for patients with diabetes and hypertension. However, both medications can affect kidney function, so renal monitoring is recommended.",
      "confidence": 0.92
    },
    {
      "model_id": "medical_model_2",
      "response": "There are no major interactions between metformin and lisinopril. These medications are often used together in patients with diabetes and hypertension. Both drugs can impact kidney function, so regular monitoring is advised, especially in patients with existing renal impairment.",
      "confidence": 0.95
    },
    {
      "model_id": "medical_model_3",
      "response": "Metformin and lisinopril can be safely co-administered. Both medications can rarely cause lactic acidosis in patients with significant kidney dysfunction, so renal function should be monitored regularly when these medications are used together.",
      "confidence": 0.93
    }
  ],
  "consensus_metrics": {
    "agreement_score": 0.94,
    "variance": 0.02,
    "confidence_interval": [0.91, 0.97]
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `request_id` | string | Unique identifier for the request |
| `timestamp` | string | ISO 8601 timestamp of when the response was generated |
| `consensus_response` | string | The unified response generated from multiple models |
| `confidence_score` | number | Overall confidence score between 0 and 1 |
| `sources` | array | List of medical sources referenced |
| `model_responses` | array | Individual responses from each model (if `include_model_responses` is `true`) |
| `consensus_metrics` | object | Metrics about the consensus process |

## Example Usage

### cURL

```bash
curl -X POST "https://api.bondmcp.com/api/v1/orchestrator/multi-llm" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "query": "What are the potential drug interactions between metformin and lisinopril?",
    "context": "patient_medication_review",
    "include_model_responses": true
  }'
```

### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});

async function getConsensusResponse() {
  try {
    const response = await client.orchestrator.multiLlm({
      query: "What are the potential drug interactions between metformin and lisinopril?",
      context: "patient_medication_review",
      include_model_responses: true
    });
    
    console.log("Consensus Response:", response.consensus_response);
    console.log("Confidence Score:", response.confidence_score);
    
    if (response.model_responses) {
      console.log("Individual Model Responses:", response.model_responses);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

getConsensusResponse();
```

### Python

```python
from bondmcp_sdk.client import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")

try:
    response = client.orchestrator.multi_llm(
        query="What are the potential drug interactions between metformin and lisinopril?",
        context="patient_medication_review",
        include_model_responses=True
    )
    
    print("Consensus Response:", response.consensus_response)
    print("Confidence Score:", response.confidence_score)
    
    if response.model_responses:
        print("Individual Model Responses:", response.model_responses)
except Exception as e:
    print(f"Error: {e}")
```

## Benefits of Multi-Model Consensus

The multi-model orchestration endpoint offers several advantages over single-model approaches:

1. **Higher Accuracy**: By combining multiple specialized healthcare models, the system achieves higher accuracy than any single model
2. **Reduced Hallucinations**: Cross-validation between models significantly reduces the risk of AI hallucinations
3. **Confidence Metrics**: Provides detailed confidence scores and agreement metrics to assess response reliability
4. **Specialized Expertise**: Leverages models with different strengths and specializations in medical knowledge
5. **Transparent Reasoning**: When including individual model responses, provides insight into how the consensus was reached

## Use Cases

- **Medication Reviews**: Identifying potential drug interactions and contraindications
- **Treatment Planning**: Evaluating treatment options for specific conditions
- **Clinical Decision Support**: Providing evidence-based information to support clinical decisions
- **Medical Education**: Generating comprehensive and accurate educational content
- **Research Assistance**: Analyzing medical literature and research findings

## Error Responses

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `invalid_request` | Invalid request parameters |
| 401 | `authentication_error` | Missing API key |
| 403 | `permission_denied` | Invalid API key or insufficient permissions |
| 422 | `validation_error` | Request validation failed |
| 429 | `rate_limit_exceeded` | Rate limit exceeded |

For more details on error handling, see the **Error Handling Guide** .

## Best Practices

1. **Provide clear, specific queries** for more accurate consensus responses
2. **Include relevant context** to improve response relevance
3. **Adjust the consensus threshold** based on your accuracy requirements
4. **Use include_model_responses** when transparency into individual model outputs is needed
5. **Implement caching** for frequently asked questions to reduce API calls

## Limitations

- The API provides informational content only, not medical advice
- Responses are based on medical literature and should not replace professional healthcare
- Higher consensus thresholds may result in more conservative or general responses
- Processing time may be longer than single-model endpoints due to the consensus process

## Related Endpoints

- **Health Question Answering** 
- **Lab Result Interpretation** 
