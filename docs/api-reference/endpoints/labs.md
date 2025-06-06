# Lab Result Interpretation API

The `/api/v1/labs/interpret` endpoint provides AI-powered interpretation of laboratory test results, helping to understand medical lab data in plain language.

## Endpoint

```
POST /api/v1/labs/interpret
```

## Authentication

Requires API key authentication via the `X-API-Key` header.

## Request Format

```json
{
  "lab_results": {
    "hdl": 60,
    "ldl": 120,
    "triglycerides": 150,
    "glucose": 85
  },
  "patient_context": {
    "age": 45,
    "sex": "female",
    "conditions": ["hypertension"]
  },
  "include_references": true
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lab_results` | object | Yes | Key-value pairs of lab test names and their values |
| `patient_context` | object | No | Optional patient context to improve interpretation relevance |
| `include_references` | boolean | No | Whether to include medical references (default: `true`) |

## Response Format

```json
{
  "request_id": "req_789xyz123abc",
  "timestamp": "2025-06-06T11:09:00Z",
  "interpretation": {
    "summary": "Your cholesterol levels are within normal ranges. HDL (good cholesterol) is optimal, and LDL (bad cholesterol) is near optimal. Triglycerides and glucose are within normal ranges.",
    "details": [
      {
        "test": "hdl",
        "value": 60,
        "unit": "mg/dL",
        "reference_range": "≥ 40 mg/dL",
        "status": "optimal",
        "interpretation": "Your HDL cholesterol is at a healthy level, which helps protect against heart disease."
      },
      {
        "test": "ldl",
        "value": 120,
        "unit": "mg/dL",
        "reference_range": "< 100 mg/dL",
        "status": "near optimal",
        "interpretation": "Your LDL cholesterol is near optimal but could be lower, especially with your history of hypertension."
      }
    ]
  },
  "references": [
    {
      "title": "Clinical Guidelines",
      "citation": "National Cholesterol Education Program. ATP III Guidelines, 2022."
    }
  ],
  "confidence_score": 0.95
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `request_id` | string | Unique identifier for the request |
| `timestamp` | string | ISO 8601 timestamp of when the response was generated |
| `interpretation` | object | The AI-generated interpretation of lab results |
| `interpretation.summary` | string | Overall summary of the lab results |
| `interpretation.details` | array | Detailed interpretation of each lab test |
| `references` | array | List of medical references used (if `include_references` is `true`) |
| `confidence_score` | number | Confidence score between 0 and 1 |

## Example Usage

### cURL

```bash
curl -X POST "https://api.bondmcp.com/api/v1/labs/interpret" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "lab_results": {
      "hdl": 60,
      "ldl": 120,
      "triglycerides": 150,
      "glucose": 85
    },
    "patient_context": {
      "age": 45,
      "sex": "female",
      "conditions": ["hypertension"]
    }
  }'
```

### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});

async function interpretLabResults() {
  try {
    const response = await client.labs.interpret({
      lab_results: {
        hdl: 60,
        ldl: 120,
        triglycerides: 150,
        glucose: 85
      },
      patient_context: {
        age: 45,
        sex: "female",
        conditions: ["hypertension"]
      }
    });
    
    console.log(response.interpretation.summary);
    console.log("Details:", response.interpretation.details);
  } catch (error) {
    console.error("Error:", error);
  }
}

interpretLabResults();
```

### Python

```python
from bondmcp_sdk import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")

try:
    response = client.labs.interpret(
        lab_results={
            "hdl": 60,
            "ldl": 120,
            "triglycerides": 150,
            "glucose": 85
        },
        patient_context={
            "age": 45,
            "sex": "female",
            "conditions": ["hypertension"]
        }
    )
    
    print(response.interpretation.summary)
    print("Details:", response.interpretation.details)
except Exception as e:
    print(f"Error: {e}")
```

## Supported Lab Tests

The API supports a wide range of common laboratory tests, including but not limited to:

- **Lipid Panel**: HDL, LDL, Total Cholesterol, Triglycerides
- **Metabolic Panel**: Glucose, HbA1c, Sodium, Potassium, Calcium, Chloride, CO2, BUN, Creatinine
- **Liver Function**: ALT, AST, Alkaline Phosphatase, Bilirubin
- **Complete Blood Count**: WBC, RBC, Hemoglobin, Hematocrit, Platelets
- **Thyroid Function**: TSH, T3, T4, Free T4
- **Vitamins & Minerals**: Vitamin D, Vitamin B12, Folate, Iron, Ferritin
- **Inflammatory Markers**: CRP, ESR

For a complete list of supported tests, refer to our [Lab Test Reference Guide](../advanced/lab-test-reference.md).

## Error Responses

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `invalid_request` | Invalid request parameters |
| 401 | `authentication_error` | Missing API key |
| 403 | `permission_denied` | Invalid API key or insufficient permissions |
| 422 | `validation_error` | Request validation failed (e.g., invalid lab test names) |
| 429 | `rate_limit_exceeded` | Rate limit exceeded |

For more details on error handling, see the [Error Handling Guide](../error-handling.md).

## Best Practices

1. **Provide accurate units** for lab values when they differ from standard units
2. **Include patient context** when available for more personalized interpretations
3. **Group related tests** together in a single request for better contextual interpretation
4. **Implement caching** for identical lab result interpretations to reduce API calls
5. **Handle errors gracefully** in your user interface

## Limitations

- The API provides informational content only, not medical advice
- Interpretations are based on general medical guidelines and should not replace professional healthcare
- Unusual or complex lab result combinations may have lower confidence scores
- Not all specialized or rare lab tests may be supported

## Related Endpoints

- [Health Question Answering](./ask.md)
- [Health Data Analysis](./health-data.md)
