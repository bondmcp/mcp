# Health Data Import API

The `/api/import` endpoints allow you to import health data from various sources, including wearable devices, health apps, and CSV files.

## Endpoints

### Import Oura Ring Data

```
POST /api/import/oura
```

#### Authentication

Requires API key authentication via the `X-API-Key` header.

#### Request Format

```json
{
  "data": {
    "sleep": [
      {
        "date": "2025-06-01",
        "duration_minutes": 432,
        "deep_sleep_minutes": 85,
        "rem_sleep_minutes": 120,
        "light_sleep_minutes": 227,
        "awake_minutes": 15,
        "sleep_score": 88
      }
    ],
    "activity": [
      {
        "date": "2025-06-01",
        "steps": 9500,
        "calories_active": 450,
        "calories_total": 2250,
        "activity_score": 85
      }
    ],
    "readiness": [
      {
        "date": "2025-06-01",
        "score": 82,
        "recovery_index": 78,
        "resting_heart_rate": 58
      }
    ]
  },
  "user_id": "usr_123abc456def",
  "generate_insights": true
}
```

##### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Oura Ring data organized by category |
| `data.sleep` | array | No | Sleep data records |
| `data.activity` | array | No | Activity data records |
| `data.readiness` | array | No | Readiness data records |
| `user_id` | string | No | Unique identifier for the user |
| `generate_insights` | boolean | No | Whether to generate insights from the imported data (default: `false`) |

#### Response Format

```json
{
  "request_id": "req_901pqr234stu",
  "timestamp": "2025-06-06T11:19:00Z",
  "import_summary": {
    "status": "success",
    "records_processed": 3,
    "records_imported": 3,
    "categories": ["sleep", "activity", "readiness"]
  },
  "insights": {
    "summary": "Your sleep quality is good with optimal deep sleep percentage. Your activity level is moderate with good daily step count. Your readiness score indicates good recovery.",
    "recommendations": [
      "Maintain your current sleep schedule for optimal recovery",
      "Consider increasing daily activity to reach the recommended 10,000 steps"
    ]
  },
  "user_id": "usr_123abc456def"
}
```

### Import CSV Lab Results

```
POST /api/import/labs/csv
```

#### Authentication

Requires API key authentication via the `X-API-Key` header.

#### Request Format

This endpoint accepts `multipart/form-data` with a CSV file upload.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | file | Yes | CSV file containing lab results |
| `user_id` | string | No | Unique identifier for the user |
| `generate_interpretation` | boolean | No | Whether to generate interpretation of the lab results (default: `false`) |

The CSV file should have the following format:
```
test_name,value,unit,reference_range,date
hdl,60,mg/dL,>40,2025-05-15
ldl,120,mg/dL,<100,2025-05-15
triglycerides,150,mg/dL,<150,2025-05-15
glucose,85,mg/dL,70-99,2025-05-15
```

#### Response Format

```json
{
  "request_id": "req_567vwx890yz1",
  "timestamp": "2025-06-06T11:19:30Z",
  "import_summary": {
    "status": "success",
    "records_processed": 4,
    "records_imported": 4,
    "categories": ["lipid_panel", "metabolic"]
  },
  "interpretation": {
    "summary": "Your cholesterol levels are within normal ranges. HDL (good cholesterol) is optimal, and LDL (bad cholesterol) is near optimal. Triglycerides and glucose are within normal ranges.",
    "details": [
      {
        "test": "hdl",
        "value": 60,
        "unit": "mg/dL",
        "reference_range": ">40 mg/dL",
        "status": "optimal",
        "interpretation": "Your HDL cholesterol is at a healthy level, which helps protect against heart disease."
      },
      {
        "test": "ldl",
        "value": 120,
        "unit": "mg/dL",
        "reference_range": "<100 mg/dL",
        "status": "near optimal",
        "interpretation": "Your LDL cholesterol is near optimal but could be lower."
      }
    ]
  },
  "user_id": "usr_123abc456def"
}
```

## Example Usage

### Import Oura Ring Data

#### cURL

```bash
curl -X POST "https://api.bondmcp.com/api/import/oura" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "data": {
      "sleep": [
        {
          "date": "2025-06-01",
          "duration_minutes": 432,
          "deep_sleep_minutes": 85,
          "rem_sleep_minutes": 120,
          "light_sleep_minutes": 227,
          "awake_minutes": 15,
          "sleep_score": 88
        }
      ]
    },
    "user_id": "usr_123abc456def",
    "generate_insights": true
  }'
```

#### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});

async function importOuraData() {
  try {
    const response = await client.import.oura({
      data: {
        sleep: [
          {
            date: "2025-06-01",
            duration_minutes: 432,
            deep_sleep_minutes: 85,
            rem_sleep_minutes: 120,
            light_sleep_minutes: 227,
            awake_minutes: 15,
            sleep_score: 88
          }
        ]
      },
      user_id: "usr_123abc456def",
      generate_insights: true
    });
    
    console.log("Import Status:", response.import_summary.status);
    console.log("Insights:", response.insights);
  } catch (error) {
    console.error("Error importing Oura data:", error);
  }
}

importOuraData();
```

#### Python

```python
from bondmcp_sdk.client import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")

try:
    response = client.import.oura(
        data={
            "sleep": [
                {
                    "date": "2025-06-01",
                    "duration_minutes": 432,
                    "deep_sleep_minutes": 85,
                    "rem_sleep_minutes": 120,
                    "light_sleep_minutes": 227,
                    "awake_minutes": 15,
                    "sleep_score": 88
                }
            ]
        },
        user_id="usr_123abc456def",
        generate_insights=True
    )
    
    print("Import Status:", response.import_summary.status)
    print("Insights:", response.insights)
except Exception as e:
    print(f"Error importing Oura data: {e}")
```

### Import CSV Lab Results

#### cURL

```bash
curl -X POST "https://api.bondmcp.com/api/import/labs/csv" \
  -H "X-API-Key: YOUR_API_KEY" \
  -F "file=@lab_results.csv" \
  -F "user_id=usr_123abc456def" \
  -F "generate_interpretation=true"
```

#### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';
import fs from 'fs';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});

async function importLabResults() {
  try {
    const file = fs.readFileSync('lab_results.csv');
    
    const response = await client.import.labsCsv({
      file: file,
      user_id: "usr_123abc456def",
      generate_interpretation: true
    });
    
    console.log("Import Status:", response.import_summary.status);
    console.log("Interpretation:", response.interpretation);
  } catch (error) {
    console.error("Error importing lab results:", error);
  }
}

importLabResults();
```

#### Python

```python
from bondmcp_sdk.client import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")

try:
    with open('lab_results.csv', 'rb') as file:
        response = client.import.labs_csv(
            file=file,
            user_id="usr_123abc456def",
            generate_interpretation=True
        )
    
    print("Import Status:", response.import_summary.status)
    print("Interpretation:", response.interpretation)
except Exception as e:
    print(f"Error importing lab results: {e}")
```

## Supported Data Sources

The API currently supports importing data from:

- **Oura Ring**: Sleep, activity, and readiness data
- **CSV Files**: Lab results in the specified format
- **Apple Health**: Coming soon
- **Whoop**: Coming soon
- **Garmin**: Coming soon
- **Fitbit**: Coming soon

For details on the expected format for each data source, refer to our **Health Data Format Guide** (CLI/API only).

## Error Responses

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `invalid_request` | Invalid request parameters |
| 401 | `authentication_error` | Missing API key |
| 403 | `permission_denied` | Invalid API key or insufficient permissions |
| 415 | `unsupported_media_type` | Invalid file format |
| 422 | `validation_error` | Request validation failed (e.g., invalid data format) |
| 429 | `rate_limit_exceeded` | Rate limit exceeded |

For more details on error handling, see the **Error Handling Guide** (CLI/API only).

## Best Practices

1. **Validate data format** before sending to ensure successful import
2. **Include user_id** to associate imported data with specific users
3. **Generate insights or interpretations** when immediate analysis is needed
4. **Import data in batches** for large datasets to avoid timeouts
5. **Handle errors gracefully** in your user interface

## Related Endpoints

- **Health Data Analysis** (CLI/API only)
- **Lab Result Interpretation** (CLI/API only)
- **Health Insights** (CLI/API only)
