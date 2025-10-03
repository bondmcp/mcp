# Health AI APIs

BondMCP provides 5 specialized Health AI endpoints powered by advanced language models. All endpoints use the same authentication and return structured JSON responses.

## Base URL

```
https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp
```

## Authentication

All requests require a Bearer token:

```http
Authorization: Bearer YOUR_API_KEY
```

See [Authentication Guide](../getting-started/authentication.md) for details.

---

## 1. Health Risk Analysis

Analyze patient health risks based on demographics, symptoms, and medical history.

### Endpoint

```http
POST /health-ai/risk-analysis
```

### Request

```json
{
  "patient_data": {
    "age": 45,
    "gender": "male",
    "bmi": 28.5,
    "blood_pressure": "140/90",
    "cholesterol": 220,
    "smoking": true,
    "family_history": ["diabetes", "heart_disease"]
  },
  "analysis_type": "cardiovascular"
}
```

### Response

```json
{
  "risk_level": "moderate",
  "risk_score": 0.68,
  "factors": [
    {
      "factor": "elevated_blood_pressure",
      "impact": "high",
      "recommendation": "Monitor BP daily, consider medication"
    },
    {
      "factor": "smoking",
      "impact": "high",
      "recommendation": "Smoking cessation program"
    }
  ],
  "recommendations": [
    "Schedule cardiology consultation",
    "Start lipid panel monitoring",
    "Implement lifestyle modifications"
  ],
  "cost": 0.05
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| patient_data | object | Yes | Patient demographics and vitals |
| analysis_type | string | Yes | Type: `cardiovascular`, `diabetes`, `general` |

### Cost

**$0.05 per request**

### Use Cases

- Pre-screening for chronic diseases
- Risk stratification for patient populations
- Clinical decision support
- Preventive care planning

---

## 2. Medication Interaction Check

Check for drug-drug interactions and contraindications.

### Endpoint

```http
POST /health-ai/medication-check
```

### Request

```json
{
  "medications": [
    {
      "name": "Warfarin",
      "dosage": "5mg",
      "frequency": "daily"
    },
    {
      "name": "Aspirin",
      "dosage": "81mg",
      "frequency": "daily"
    }
  ],
  "patient_conditions": ["atrial_fibrillation", "hypertension"]
}
```

### Response

```json
{
  "interactions": [
    {
      "severity": "high",
      "drugs": ["Warfarin", "Aspirin"],
      "interaction": "Increased bleeding risk",
      "recommendation": "Monitor INR closely. Consider alternative antiplatelet."
    }
  ],
  "contraindications": [],
  "safety_score": 0.65,
  "cost": 0.03
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| medications | array | Yes | List of current medications |
| patient_conditions | array | No | Existing medical conditions |

### Cost

**$0.03 per request**

### Use Cases

- Medication reconciliation
- E-prescribing safety checks
- Pharmacy consultation support
- Patient education

---

## 3. Symptom Assessment

Evaluate patient symptoms and provide differential diagnosis suggestions.

### Endpoint

```http
POST /health-ai/symptom-assessment
```

### Request

```json
{
  "symptoms": [
    {
      "description": "chest pain",
      "severity": 8,
      "duration": "2 hours",
      "onset": "sudden"
    },
    {
      "description": "shortness of breath",
      "severity": 7,
      "duration": "1 hour"
    }
  ],
  "patient_age": 55,
  "patient_gender": "male"
}
```

### Response

```json
{
  "urgency": "emergency",
  "urgency_score": 0.95,
  "possible_conditions": [
    {
      "condition": "Acute Myocardial Infarction",
      "probability": 0.72,
      "reasoning": "Sudden chest pain with dyspnea in middle-aged male"
    },
    {
      "condition": "Pulmonary Embolism",
      "probability": 0.45,
      "reasoning": "Acute onset chest pain and shortness of breath"
    }
  ],
  "recommended_actions": [
    "Call 911 immediately",
    "Administer aspirin if available",
    "Monitor vital signs"
  ],
  "triage_level": "immediate",
  "cost": 0.04
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symptoms | array | Yes | List of symptoms with details |
| patient_age | integer | No | Patient age |
| patient_gender | string | No | Patient gender |

### Cost

**$0.04 per request**

### Use Cases

- Triage support
- Telehealth consultations
- Patient symptom checkers
- Emergency department intake

---

## 4. Treatment Recommendations

Generate evidence-based treatment recommendations for diagnosed conditions.

### Endpoint

```http
POST /health-ai/treatment-recommendations
```

### Request

```json
{
  "diagnosis": "Type 2 Diabetes",
  "patient_profile": {
    "age": 52,
    "weight": 95,
    "height": 175,
    "comorbidities": ["hypertension", "obesity"],
    "current_medications": ["Lisinopril"]
  },
  "lab_results": {
    "hba1c": 8.5,
    "fasting_glucose": 165
  }
}
```

### Response

```json
{
  "treatment_plan": {
    "pharmacological": [
      {
        "medication": "Metformin",
        "dosage": "500mg",
        "frequency": "twice daily",
        "rationale": "First-line therapy for T2DM with weight-neutral profile"
      }
    ],
    "non_pharmacological": [
      {
        "intervention": "Medical nutrition therapy",
        "details": "Reduce carbohydrate intake to 45-60g per meal"
      },
      {
        "intervention": "Physical activity",
        "details": "150 minutes moderate exercise weekly"
      }
    ],
    "monitoring": [
      "HbA1c every 3 months",
      "Home glucose monitoring twice daily"
    ]
  },
  "goals": {
    "hba1c_target": "<7.0%",
    "weight_loss_target": "10% body weight"
  },
  "cost": 0.06
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| diagnosis | string | Yes | Primary diagnosis |
| patient_profile | object | Yes | Patient demographics and comorbidities |
| lab_results | object | No | Relevant lab values |

### Cost

**$0.06 per request**

### Use Cases

- Clinical decision support
- Care plan development
- Patient education materials
- Quality improvement initiatives

---

## 5. Clinical Data Extraction

Extract structured data from unstructured clinical notes using NLP.

### Endpoint

```http
POST /health-ai/data-extraction
```

### Request

```json
{
  "clinical_text": "Patient is a 62-year-old male presenting with complaints of progressive dyspnea on exertion over the past 3 months. Past medical history significant for CAD s/p MI in 2018, hypertension, and hyperlipidemia. Current medications include aspirin 81mg daily, atorvastatin 40mg daily, and metoprolol 50mg BID. Physical exam reveals bilateral lower extremity edema and bibasilar crackles. EF 35% on recent echo.",
  "extract_fields": ["demographics", "conditions", "medications", "vital_signs"]
}
```

### Response

```json
{
  "extracted_data": {
    "demographics": {
      "age": 62,
      "gender": "male"
    },
    "conditions": [
      {
        "name": "Coronary Artery Disease",
        "status": "chronic",
        "onset": "2018"
      },
      {
        "name": "Hypertension",
        "status": "active"
      },
      {
        "name": "Hyperlipidemia",
        "status": "active"
      },
      {
        "name": "Heart Failure",
        "status": "suspected",
        "evidence": "dyspnea, edema, reduced EF"
      }
    ],
    "medications": [
      {
        "name": "Aspirin",
        "dosage": "81mg",
        "frequency": "daily"
      },
      {
        "name": "Atorvastatin",
        "dosage": "40mg",
        "frequency": "daily"
      },
      {
        "name": "Metoprolol",
        "dosage": "50mg",
        "frequency": "BID"
      }
    ],
    "vital_signs": {
      "ejection_fraction": "35%"
    }
  },
  "confidence_score": 0.94,
  "cost": 0.08
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| clinical_text | string | Yes | Unstructured clinical note text |
| extract_fields | array | No | Fields to extract (default: all) |

### Cost

**$0.08 per request**

### Use Cases

- EHR data migration
- Clinical documentation improvement
- Research data collection
- Quality reporting automation

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: patient_data",
    "details": {
      "field": "patient_data",
      "expected": "object"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_REQUEST | 400 | Missing or invalid parameters |
| UNAUTHORIZED | 401 | Invalid or missing API key |
| INSUFFICIENT_CREDITS | 402 | Not enough credits for request |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

## Rate Limiting

See [Pricing & Plans](../getting-started/pricing-and-plans.md) for rate limits per tier.

## Best Practices

1. **Batch Requests**: Group multiple patients when possible
2. **Cache Results**: Store responses to avoid duplicate requests
3. **Handle Errors**: Implement retry logic with exponential backoff
4. **Monitor Costs**: Track usage via dashboard or API
5. **Validate Input**: Sanitize patient data before sending

## Need Help?

- Technical support: support@bondmcp.com
- API issues: Check our [status page](https://status.bondmcp.com)
- Feature requests: product@bondmcp.com
