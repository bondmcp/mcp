# Health Insights API

The `/api/v1/insights` endpoints provide AI-powered health insights based on user health data, lab results, and wearable metrics.

## Endpoints

### Generate Health Insights

```
POST /api/v1/insights/generate
```

#### Authentication

Requires API key authentication via the `X-API-Key` header.

#### Request Format

```json
{
  "user_id": "usr_456def789ghi",
  "data_sources": ["health_data", "labs", "wearables"],
  "time_range": {
    "start_date": "2025-05-01",
    "end_date": "2025-06-06"
  },
  "focus_areas": ["sleep", "energy", "stress", "nutrition"],
  "include_recommendations": true
}
```

##### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | Unique identifier for the user |
| `data_sources` | array | No | Specific data sources to include (defaults to all available sources) |
| `time_range` | object | No | Time range for data analysis (defaults to last 30 days) |
| `focus_areas` | array | No | Specific health areas to focus on (defaults to all areas) |
| `include_recommendations` | boolean | No | Whether to include actionable recommendations (default: `true`) |

#### Response Format

```json
{
  "request_id": "req_678hij901klm",
  "timestamp": "2025-06-06T11:29:00Z",
  "insights": [
    {
      "category": "sleep",
      "title": "Sleep Quality Declining",
      "description": "Your average deep sleep has decreased by 15% over the past two weeks, while sleep interruptions have increased.",
      "data_points": [
        {
          "metric": "deep_sleep",
          "trend": "decreasing",
          "change_percentage": -15,
          "time_period": "2 weeks"
        },
        {
          "metric": "sleep_interruptions",
          "trend": "increasing",
          "change_percentage": 30,
          "time_period": "2 weeks"
        }
      ],
      "confidence_score": 0.87,
      "recommendations": [
        {
          "title": "Consistent Sleep Schedule",
          "description": "Maintain a consistent sleep and wake time, even on weekends, to regulate your circadian rhythm.",
          "priority": "high"
        },
        {
          "title": "Evening Screen Reduction",
          "description": "Reduce screen time 1-2 hours before bed to minimize blue light exposure.",
          "priority": "medium"
        }
      ]
    },
    {
      "category": "energy",
      "title": "Afternoon Energy Dips",
      "description": "Your activity data shows consistent energy dips between 2-4 PM, correlating with higher carbohydrate intake at lunch.",
      "data_points": [
        {
          "metric": "activity_level",
          "trend": "pattern",
          "pattern": "afternoon_dip",
          "time_period": "weekdays"
        },
        {
          "metric": "lunch_composition",
          "trend": "correlation",
          "correlation": "high_carb_afternoon_dip",
          "confidence": 0.82
        }
      ],
      "confidence_score": 0.85,
      "recommendations": [
        {
          "title": "Balanced Lunch Composition",
          "description": "Include more protein and healthy fats in your lunch to maintain steady energy levels throughout the afternoon.",
          "priority": "high"
        },
        {
          "title": "Afternoon Movement Break",
          "description": "Take a 5-minute walk at the onset of the afternoon dip to boost circulation and energy.",
          "priority": "medium"
        }
      ]
    }
  ],
  "summary": "Your data indicates opportunities to improve sleep quality and afternoon energy levels. Sleep patterns show reduced deep sleep and more interruptions, while activity data reveals consistent afternoon energy dips correlated with lunch composition. Addressing these areas could significantly improve your overall well-being.",
  "data_coverage": {
    "health_data": 0.95,
    "labs": 0.75,
    "wearables": 0.90
  },
  "user_id": "usr_456def789ghi"
}
```

### Get Insight History

```
GET /api/v1/insights/history/{user_id}
```

#### Authentication

Requires API key authentication via the `X-API-Key` header.

#### Path Parameters

| Parameter | Description |
|-----------|-------------|
| `user_id` | Unique identifier for the user |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of insights to return (default: `10`, max: `100`) |
| `offset` | integer | No | Number of insights to skip (default: `0`) |
| `categories` | string | No | Comma-separated list of categories to filter by |
| `start_date` | string | No | ISO 8601 date to filter insights from |
| `end_date` | string | No | ISO 8601 date to filter insights to |

#### Response Format

```json
{
  "request_id": "req_234nop567qrs",
  "timestamp": "2025-06-06T11:29:30Z",
  "insights": [
    {
      "id": "ins_123abc456def",
      "category": "sleep",
      "title": "Sleep Quality Declining",
      "created_at": "2025-06-05T14:30:00Z",
      "confidence_score": 0.87
    },
    {
      "id": "ins_789ghi012jkl",
      "category": "energy",
      "title": "Afternoon Energy Dips",
      "created_at": "2025-06-05T14:30:00Z",
      "confidence_score": 0.85
    },
    {
      "id": "ins_345mno678pqr",
      "category": "nutrition",
      "title": "Protein Intake Below Target",
      "created_at": "2025-06-01T09:15:00Z",
      "confidence_score": 0.92
    }
  ],
  "pagination": {
    "total": 24,
    "limit": 10,
    "offset": 0,
    "next_offset": 10
  },
  "user_id": "usr_456def789ghi"
}
```

### Get Insight Details

```
GET /api/v1/insights/{insight_id}
```

#### Authentication

Requires API key authentication via the `X-API-Key` header.

#### Path Parameters

| Parameter | Description |
|-----------|-------------|
| `insight_id` | Unique identifier for the insight |

#### Response Format

```json
{
  "request_id": "req_890tuv123wxy",
  "timestamp": "2025-06-06T11:30:00Z",
  "insight": {
    "id": "ins_123abc456def",
    "category": "sleep",
    "title": "Sleep Quality Declining",
    "description": "Your average deep sleep has decreased by 15% over the past two weeks, while sleep interruptions have increased.",
    "created_at": "2025-06-05T14:30:00Z",
    "data_points": [
      {
        "metric": "deep_sleep",
        "trend": "decreasing",
        "change_percentage": -15,
        "time_period": "2 weeks"
      },
      {
        "metric": "sleep_interruptions",
        "trend": "increasing",
        "change_percentage": 30,
        "time_period": "2 weeks"
      }
    ],
    "confidence_score": 0.87,
    "recommendations": [
      {
        "title": "Consistent Sleep Schedule",
        "description": "Maintain a consistent sleep and wake time, even on weekends, to regulate your circadian rhythm.",
        "priority": "high"
      },
      {
        "title": "Evening Screen Reduction",
        "description": "Reduce screen time 1-2 hours before bed to minimize blue light exposure.",
        "priority": "medium"
      }
    ],
    "data_sources": ["oura_ring", "sleep_journal"],
    "related_insights": ["ins_789ghi012jkl", "ins_345mno678pqr"]
  },
  "user_id": "usr_456def789ghi"
}
```

## Example Usage

### Generate Health Insights

#### cURL

```bash
curl -X POST "https://api.bondmcp.com/api/v1/insights/generate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "user_id": "usr_456def789ghi",
    "data_sources": ["health_data", "labs", "wearables"],
    "focus_areas": ["sleep", "energy"],
    "include_recommendations": true
  }'
```

#### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});

async function generateHealthInsights() {
  try {
    const response = await client.insights.generate({
      user_id: "usr_456def789ghi",
      data_sources: ["health_data", "labs", "wearables"],
      focus_areas: ["sleep", "energy"],
      include_recommendations: true
    });
    
    console.log("Insights:", response.insights);
    console.log("Summary:", response.summary);
  } catch (error) {
    console.error("Error generating insights:", error);
  }
}

generateHealthInsights();
```

#### Python

```python
from bondmcp_sdk.client import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")

try:
    response = client.insights.generate(
        user_id="usr_456def789ghi",
        data_sources=["health_data", "labs", "wearables"],
        focus_areas=["sleep", "energy"],
        include_recommendations=True
    )
    
    print("Insights:", response.insights)
    print("Summary:", response.summary)
except Exception as e:
    print(f"Error generating insights: {e}")
```

### Get Insight History

#### cURL

```bash
curl -X GET "https://api.bondmcp.com/api/v1/insights/history/usr_456def789ghi?limit=5&categories=sleep,energy" \
  -H "X-API-Key: YOUR_API_KEY"
```

#### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});

async function getInsightHistory() {
  try {
    const response = await client.insights.history("usr_456def789ghi", {
      limit: 5,
      categories: "sleep,energy"
    });
    
    console.log("Insight History:", response.insights);
    console.log("Total Insights:", response.pagination.total);
  } catch (error) {
    console.error("Error retrieving insight history:", error);
  }
}

getInsightHistory();
```

#### Python

```python
from bondmcp_sdk.client import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")

try:
    response = client.insights.history(
        user_id="usr_456def789ghi",
        limit=5,
        categories="sleep,energy"
    )
    
    print("Insight History:", response.insights)
    print("Total Insights:", response.pagination.total)
except Exception as e:
    print(f"Error retrieving insight history: {e}")
```

## Supported Insight Categories

The API can generate insights for various health categories, including:

- `sleep` - Sleep quality, duration, and patterns
- `energy` - Energy levels and fatigue patterns
- `stress` - Stress levels and recovery
- `nutrition` - Dietary patterns and nutrient intake
- `activity` - Physical activity and exercise
- `recovery` - Recovery metrics and patterns
- `cardiovascular` - Heart health metrics
- `metabolic` - Metabolic health indicators
- `immune` - Immune system function indicators
- `cognitive` - Cognitive performance metrics

## Error Responses

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `invalid_request` | Invalid request parameters |
| 401 | `authentication_error` | Missing API key |
| 403 | `permission_denied` | Invalid API key or insufficient permissions |
| 404 | `not_found` | User or insight not found |
| 422 | `insufficient_data` | Not enough data to generate insights |
| 429 | `rate_limit_exceeded` | Rate limit exceeded |

For more details on error handling, see the [Error Handling Guide](../error-handling.md).

## Best Practices

1. **Provide sufficient data** for more accurate and meaningful insights
2. **Specify focus areas** to get more targeted insights
3. **Use consistent user IDs** to build a comprehensive health profile over time
4. **Implement caching** for insight history to reduce API calls
5. **Present recommendations** in a user-friendly, actionable format

## Limitations

- Insights are based on available data and may not capture all health factors
- Quality and accuracy of insights depend on the quality of input data
- The API provides informational content only, not medical advice
- Confidence scores indicate relative certainty but do not guarantee accuracy

## Related Endpoints

- [Health Data Analysis](./health-data.md)
- [Lab Result Interpretation](./labs.md)
- [Health Data Import](./import.md)
