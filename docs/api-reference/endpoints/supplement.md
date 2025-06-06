# Supplement Recommendations API

The `/api/v1/supplement/recommend` endpoint provides personalized supplement recommendations based on health goals, lab results, and user context.

## Endpoint

```
POST /api/v1/supplement/recommend
```

## Authentication

Requires API key authentication via the `X-API-Key` header.

## Request Format

```json
{
  "goals": ["immune_support", "energy"],
  "lab_results": {
    "vitamin_d": 25,
    "ferritin": 30,
    "b12": 400
  },
  "user_context": {
    "age": 42,
    "sex": "female",
    "conditions": ["hypothyroidism"],
    "medications": ["levothyroxine"],
    "diet": "vegetarian",
    "activity_level": "moderate"
  },
  "include_evidence": true
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `goals` | array | Yes | Health goals for supplement recommendations |
| `lab_results` | object | No | Key-value pairs of relevant lab test results |
| `user_context` | object | No | User health context to improve recommendation relevance |
| `include_evidence` | boolean | No | Whether to include scientific evidence (default: `true`) |

## Response Format

```json
{
  "request_id": "req_567jkl890mno",
  "timestamp": "2025-06-06T11:11:00Z",
  "recommendations": [
    {
      "supplement": "Vitamin D3",
      "dosage": "2000-4000 IU",
      "frequency": "daily",
      "priority": "high",
      "rationale": "Your lab results show insufficient vitamin D levels (25 ng/mL, optimal range is 30-50 ng/mL). Vitamin D is essential for immune function and energy metabolism.",
      "evidence": [
        {
          "type": "clinical_study",
          "citation": "Martineau AR, et al. Vitamin D supplementation to prevent acute respiratory infections: systematic review and meta-analysis of individual participant data. BMJ. 2024."
        }
      ],
      "considerations": [
        "Take with food containing healthy fats for better absorption",
        "Consider retesting levels after 3 months of supplementation"
      ]
    },
    {
      "supplement": "Iron",
      "dosage": "15-30 mg",
      "frequency": "daily",
      "priority": "medium",
      "rationale": "Your ferritin levels (30 ng/mL) are at the lower end of the normal range. As a vegetarian, you may benefit from iron supplementation to support energy levels.",
      "evidence": [
        {
          "type": "clinical_guideline",
          "citation": "National Institutes of Health. Iron Dietary Supplement Fact Sheet. 2024."
        }
      ],
      "considerations": [
        "Take on an empty stomach if tolerated",
        "Avoid taking with calcium supplements or thyroid medication",
        "Consider a gentle form like iron bisglycinate for better tolerance"
      ]
    }
  ],
  "general_guidance": "These recommendations are based on your specific goals, lab results, and health context. Always consult with a healthcare provider before starting new supplements, especially given your hypothyroidism and current medication.",
  "confidence_score": 0.89
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `request_id` | string | Unique identifier for the request |
| `timestamp` | string | ISO 8601 timestamp of when the response was generated |
| `recommendations` | array | List of supplement recommendations |
| `recommendations[].supplement` | string | Name of the recommended supplement |
| `recommendations[].dosage` | string | Suggested dosage range |
| `recommendations[].frequency` | string | How often to take the supplement |
| `recommendations[].priority` | string | Priority level ("high", "medium", "low") |
| `recommendations[].rationale` | string | Explanation for the recommendation |
| `recommendations[].evidence` | array | Scientific evidence supporting the recommendation (if `include_evidence` is `true`) |
| `recommendations[].considerations` | array | Important considerations for taking the supplement |
| `general_guidance` | string | Overall guidance about the recommendations |
| `confidence_score` | number | Confidence score between 0 and 1 |

## Example Usage

### cURL

```bash
curl -X POST "https://api.bondmcp.com/api/v1/supplement/recommend" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "goals": ["immune_support", "energy"],
    "lab_results": {
      "vitamin_d": 25,
      "ferritin": 30,
      "b12": 400
    },
    "user_context": {
      "age": 42,
      "sex": "female",
      "conditions": ["hypothyroidism"],
      "medications": ["levothyroxine"],
      "diet": "vegetarian",
      "activity_level": "moderate"
    }
  }'
```

### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});

async function getSupplementRecommendations() {
  try {
    const response = await client.supplement.recommend({
      goals: ["immune_support", "energy"],
      lab_results: {
        vitamin_d: 25,
        ferritin: 30,
        b12: 400
      },
      user_context: {
        age: 42,
        sex: "female",
        conditions: ["hypothyroidism"],
        medications: ["levothyroxine"],
        diet: "vegetarian",
        activity_level: "moderate"
      }
    });
    
    console.log("Recommendations:", response.recommendations);
    console.log("General guidance:", response.general_guidance);
  } catch (error) {
    console.error("Error:", error);
  }
}

getSupplementRecommendations();
```

### Python

```python
from bondmcp_sdk import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")

try:
    response = client.supplement.recommend(
        goals=["immune_support", "energy"],
        lab_results={
            "vitamin_d": 25,
            "ferritin": 30,
            "b12": 400
        },
        user_context={
            "age": 42,
            "sex": "female",
            "conditions": ["hypothyroidism"],
            "medications": ["levothyroxine"],
            "diet": "vegetarian",
            "activity_level": "moderate"
        }
    )
    
    print("Recommendations:", response.recommendations)
    print("General guidance:", response.general_guidance)
except Exception as e:
    print(f"Error: {e}")
```

## Supported Health Goals

The API supports recommendations for various health goals, including:

- `immune_support` - Strengthen immune system function
- `energy` - Improve energy levels and reduce fatigue
- `sleep` - Enhance sleep quality and duration
- `stress` - Support stress management and resilience
- `cognitive` - Support brain health and cognitive function
- `heart_health` - Support cardiovascular health
- `joint_health` - Support joint comfort and mobility
- `digestive_health` - Support gut health and digestion
- `skin_health` - Support skin appearance and health
- `athletic_performance` - Support physical performance and recovery
- `hormone_balance` - Support healthy hormone levels
- `longevity` - Support healthy aging and longevity

For a complete list of supported goals, refer to our [Health Goals Reference Guide](../advanced/health-goals-reference.md).

## Error Responses

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `invalid_request` | Invalid request parameters |
| 401 | `authentication_error` | Missing API key |
| 403 | `permission_denied` | Invalid API key or insufficient permissions |
| 422 | `validation_error` | Request validation failed (e.g., invalid goals) |
| 429 | `rate_limit_exceeded` | Rate limit exceeded |

For more details on error handling, see the [Error Handling Guide](../error-handling.md).

## Best Practices

1. **Provide comprehensive context** for more personalized recommendations
2. **Include relevant lab results** when available
3. **Specify all health conditions and medications** to avoid potential interactions
4. **Limit goals to 2-3 at a time** for more focused recommendations
5. **Present recommendations with appropriate disclaimers** in your application

## Limitations

- The API provides informational content only, not medical advice
- Recommendations are based on general guidelines and scientific literature
- Individual responses to supplements may vary
- The API does not account for all possible drug-supplement interactions
- Users should consult healthcare providers before starting any supplement regimen

## Related Endpoints

- [Health Question Answering](./ask.md)
- [Lab Result Interpretation](./labs.md)
- [Health Data Analysis](./health-data.md)
