# Health Data Analysis API

The `/api/health-data/analyze` endpoint provides AI-powered analysis of health data from wearables, medical devices, and other health tracking sources.

## Endpoint

```
POST /api/health-data/analyze
```

## Authentication

Requires API key authentication via the `X-API-Key` header.

## Request Format

```json
{
  "data_type": "sleep",
  "data": [
    {
      "date": "2025-06-01",
      "duration_minutes": 432,
      "deep_sleep_minutes": 85,
      "rem_sleep_minutes": 120,
      "light_sleep_minutes": 227,
      "awake_minutes": 15,
      "sleep_score": 88
    },
    {
      "date": "2025-06-02",
      "duration_minutes": 395,
      "deep_sleep_minutes": 65,
      "rem_sleep_minutes": 105,
      "light_sleep_minutes": 210,
      "awake_minutes": 25,
      "sleep_score": 76
    }
  ],
  "user_context": {
    "age": 35,
    "sex": "male",
    "activity_level": "moderate",
    "goals": ["improve_sleep_quality", "increase_deep_sleep"]
  },
  "analysis_type": "comprehensive"
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data_type` | string | Yes | Type of health data (e.g., "sleep", "activity", "heart_rate", "glucose") |
| `data` | array | Yes | Array of data points with relevant metrics |
| `user_context` | object | No | Optional user context to improve analysis relevance |
| `analysis_type` | string | No | Type of analysis: "basic", "comprehensive", or "trends" (default: "comprehensive") |

## Response Format

```json
{
  "request_id": "req_456def789ghi",
  "timestamp": "2025-06-06T11:10:00Z",
  "analysis": {
    "summary": "Your sleep data shows moderate quality sleep with room for improvement. Your deep sleep percentage (19.7%) is slightly below the recommended range (20-25%), and your sleep duration is inconsistent.",
    "insights": [
      {
        "type": "observation",
        "description": "Your deep sleep percentage is slightly below optimal levels",
        "importance": "high",
        "metrics": {
          "average_deep_sleep_percentage": 19.7,
          "recommended_range": "20-25%"
        }
      },
      {
        "type": "observation",
        "description": "Your sleep duration varies significantly between days",
        "importance": "medium",
        "metrics": {
          "average_duration": 413.5,
          "variation": 37
        }
      }
    ],
    "recommendations": [
      {
        "description": "Maintain a more consistent sleep schedule",
        "rationale": "Reducing variation in sleep timing helps regulate your circadian rhythm",
        "action_items": [
          "Aim to go to bed and wake up at the same time each day",
          "Create a pre-sleep routine to signal your body it's time for rest"
        ]
      },
      {
        "description": "Optimize your sleep environment",
        "rationale": "Environmental factors can significantly impact deep sleep quality",
        "action_items": [
          "Keep your bedroom cool (65-68°F/18-20°C)",
          "Minimize noise and light disruptions",
          "Consider blackout curtains or a white noise machine"
        ]
      }
    ],
    "trends": {
      "direction": "declining",
      "significance": "moderate",
      "metrics_of_concern": ["deep_sleep_minutes", "sleep_score"]
    }
  },
  "confidence_score": 0.92
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `request_id` | string | Unique identifier for the request |
| `timestamp` | string | ISO 8601 timestamp of when the response was generated |
| `analysis` | object | The AI-generated analysis of health data |
| `analysis.summary` | string | Overall summary of the health data analysis |
| `analysis.insights` | array | Detailed insights extracted from the data |
| `analysis.recommendations` | array | Actionable recommendations based on the insights |
| `analysis.trends` | object | Trend analysis if multiple data points are provided |
| `confidence_score` | number | Confidence score between 0 and 1 |

## Example Usage

### cURL

```bash
curl -X POST "https://api.bondmcp.com/api/health-data/analyze" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "data_type": "sleep",
    "data": [
      {
        "date": "2025-06-01",
        "duration_minutes": 432,
        "deep_sleep_minutes": 85,
        "rem_sleep_minutes": 120,
        "light_sleep_minutes": 227,
        "awake_minutes": 15,
        "sleep_score": 88
      },
      {
        "date": "2025-06-02",
        "duration_minutes": 395,
        "deep_sleep_minutes": 65,
        "rem_sleep_minutes": 105,
        "light_sleep_minutes": 210,
        "awake_minutes": 25,
        "sleep_score": 76
      }
    ],
    "user_context": {
      "age": 35,
      "sex": "male",
      "activity_level": "moderate",
      "goals": ["improve_sleep_quality", "increase_deep_sleep"]
    }
  }'
```

### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});

async function analyzeHealthData() {
  try {
    const response = await client.healthData.analyze({
      data_type: "sleep",
      data: [
        {
          date: "2025-06-01",
          duration_minutes: 432,
          deep_sleep_minutes: 85,
          rem_sleep_minutes: 120,
          light_sleep_minutes: 227,
          awake_minutes: 15,
          sleep_score: 88
        },
        {
          date: "2025-06-02",
          duration_minutes: 395,
          deep_sleep_minutes: 65,
          rem_sleep_minutes: 105,
          light_sleep_minutes: 210,
          awake_minutes: 25,
          sleep_score: 76
        }
      ],
      user_context: {
        age: 35,
        sex: "male",
        activity_level: "moderate",
        goals: ["improve_sleep_quality", "increase_deep_sleep"]
      }
    });
    
    console.log(response.analysis.summary);
    console.log("Recommendations:", response.analysis.recommendations);
  } catch (error) {
    console.error("Error:", error);
  }
}

analyzeHealthData();
```

### Python

```python
from bondmcp_sdk.client import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")

try:
    response = client.health_data.analyze(
        data_type="sleep",
        data=[
            {
                "date": "2025-06-01",
                "duration_minutes": 432,
                "deep_sleep_minutes": 85,
                "rem_sleep_minutes": 120,
                "light_sleep_minutes": 227,
                "awake_minutes": 15,
                "sleep_score": 88
            },
            {
                "date": "2025-06-02",
                "duration_minutes": 395,
                "deep_sleep_minutes": 65,
                "rem_sleep_minutes": 105,
                "light_sleep_minutes": 210,
                "awake_minutes": 25,
                "sleep_score": 76
            }
        ],
        user_context={
            "age": 35,
            "sex": "male",
            "activity_level": "moderate",
            "goals": ["improve_sleep_quality", "increase_deep_sleep"]
        }
    )
    
    print(response.analysis.summary)
    print("Recommendations:", response.analysis.recommendations)
except Exception as e:
    print(f"Error: {e}")
```

## Supported Data Types

The API supports analysis of various health data types:

- **Sleep**: Sleep stages, duration, quality metrics
- **Activity**: Steps, exercise, calories burned, active minutes
- **Heart Rate**: Resting heart rate, heart rate variability, zones
- **Glucose**: Blood glucose readings, trends, patterns
- **Blood Pressure**: Systolic, diastolic readings and patterns
- **Nutrition**: Caloric intake, macronutrients, meal timing
- **Stress**: Stress scores, recovery metrics, meditation minutes
- **Weight**: Weight measurements, body composition, BMI

For details on the expected format for each data type, refer to our **Health Data Format Guide** (CLI/API only).

## Error Responses

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `invalid_request` | Invalid request parameters |
| 401 | `authentication_error` | Missing API key |
| 403 | `permission_denied` | Invalid API key or insufficient permissions |
| 422 | `validation_error` | Request validation failed (e.g., invalid data format) |
| 429 | `rate_limit_exceeded` | Rate limit exceeded |

For more details on error handling, see the **Error Handling Guide** (CLI/API only).

## Best Practices

1. **Provide sufficient data points** for more accurate trend analysis (7+ days recommended)
2. **Include user context** when available for more personalized insights
3. **Group related metrics** together in a single request for better contextual analysis
4. **Use consistent units** across all data points
5. **Handle errors gracefully** in your user interface

## Limitations

- The API provides informational content only, not medical advice
- Analysis is based on general health guidelines and should not replace professional healthcare
- Accuracy improves with more data points and complete context
- Not all specialized health metrics may be supported

## Related Endpoints

- **Health Question Answering** (CLI/API only)
- **Lab Result Interpretation** (CLI/API only)
- **Import Health Data** (CLI/API only)
