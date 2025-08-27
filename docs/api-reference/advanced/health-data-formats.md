# Health Data Formats

## Supported Data Formats

BondMCP accepts health data in various formats for analysis and processing.

### Lab Results Format
```json
{
  "test_name": "Complete Blood Count",
  "results": [
    {
      "marker": "WBC",
      "value": 7.2,
      "unit": "K/uL",
      "reference_range": "4.0-11.0"
    }
  ],
  "test_date": "2024-01-15"
}
```

### Fitness Data Format
```json
{
  "date": "2024-01-15",
  "steps": 8500,
  "heart_rate": {
    "resting": 65,
    "max": 145,
    "average": 85
  },
  "sleep": {
    "duration_hours": 7.5,
    "quality_score": 85
  }
}
```

For complete format specifications, see the API endpoint documentation.
