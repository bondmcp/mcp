# Health AI Endpoints - Complete API Reference

> **Live API:** https://t9xbkyb7mg.us-east-1.awsapprunner.com  
> **Generated:** 2025-10-03T17:11:33.156332  
> **Test User:** test_health_ai_1759511479@bondmcp.test

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Health Check Endpoints](#health-check-endpoints)
- [AI Analysis Endpoints](#ai-analysis-endpoints)
- [Data Endpoints](#data-endpoints)
- [Testing Summary](#testing-summary)

## Overview

BondMCP Platform provides comprehensive health AI analysis capabilities powered by OpenAI GPT-4o-mini with multi-model consensus support.

**Total Endpoints Documented:** 17  
**Successfully Tested:** 17  
**Failed:** 0

## Authentication

All AI analysis endpoints require JWT Bearer token authentication.

### Get Access Token

```bash
# Register
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "Your Name"
  }'

# Login
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

Response includes `access_token` for subsequent requests.

---

## Health Check Endpoints

System health and readiness probes.

### `GET /health`

Basic health check

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/health \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-10-03T17:11:20.579976",
  "version": "2.1.0"
}
```

**Performance:**

- **Response Time:** 0.42s
- **Status Code:** 200

---

### `GET /v2/health`

V2 health check

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/v2/health \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "status": "healthy",
  "message": "All systems operational",
  "version": "2.1.0",
  "timestamp": "2025-10-03T17:11:21.408635Z",
  "probes": {
    "liveness": "ok",
    "readiness": {
      "database": "ok",
      "ai_services": "ok"
    }
  },
  "services": {
    "api": "operational",
    "authentication": "operational",
    "billing": "operational"
  }
}
```

**Performance:**

- **Response Time:** 0.40s
- **Status Code:** 200

---

### `POST /health/fitness`

AI-powered fitness activity analysis

**Request:**

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/fitness \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "activity": "running",
  "duration": 30,
  "intensity": "high"
}'
```

**Response:**

```json
{
  "analysis_id": "d220356e-547d-468f-8c44-3c5a51d045b0",
  "user_id": "user_8",
  "activity": "running",
  "duration": 30,
  "intensity": "high",
  "analysis": "### 1. Estimated Calories Burned\nThe number of calories burned while running can vary based on factors such as weight, speed, and metabolism. However, on average:\n\n- A person weighing 155 pounds (70 kg) burns approximately 298 calories in 30 minutes of running at a pace of 6 mph (10-minute mile).\n- A person weighing 185 pounds (84 kg) burns around 355 calories in the same duration and intensity.\n\nFor high-intensity running (e.g., sprints or interval training), these numbers can increase significantly, potentially reaching 400-600 calories depending on effort and body composition.\n\n### 2. Health Benefits of Running\n- **Cardiovascular Improvement**: Running strengthens the heart, improves circulation, and enhances overall cardiovascular health.\n- **Weight Management**: It effectively burns calories, aiding in weight loss or maintenance.\n- **Muscle Strengthening**: Engages various muscle groups, particularly in the legs, core, and even arms, contributing to muscle toning.\n- **Mental Health**: Running releases endorphins, which can reduce stress, anxiety, and symptoms of depression, often referred to as the \"runner's high.\"\n- **Bone Density**: Weight-bearing exercise like running can improve bone density, reducing the risk of osteoporosis.\n- **Enhanced Endurance**: Regular running builds aerobic capacity
  ...
}
```

**AI Metadata:**

- **Model:** gpt-4o-mini
- **Tokens Used:** 689
- **Cost:** $0.000373 USD

**Performance:**

- **Response Time:** 0.57s
- **Status Code:** 200

---

### `POST /health/nutrition`

AI-powered nutrition analysis

**Request:**

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/nutrition \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "food_items": [
    "grilled chicken breast",
    "brown rice",
    "steamed broccoli",
    "olive oil"
  ],
  "meal_type": "dinner"
}'
```

**Response:**

```json
{
  "analysis_id": "14b4ed45-dbc9-4903-91b6-c4b01ff446c9",
  "user_id": "user_8",
  "food_items": [
    "grilled chicken breast",
    "brown rice",
    "steamed broccoli",
    "olive oil"
  ],
  "meal_type": "dinner",
  "analysis": "Sure! Let\u2019s analyze the nutritional content of your dinner consisting of grilled chicken breast, brown rice, steamed broccoli, and olive oil.\n\n### 1. Estimated Nutritional Breakdown\n\n**Grilled Chicken Breast (4 oz / 113g)**\n- Calories: ~165\n- Protein: ~31g\n- Carbohydrates: 0g\n- Fat: ~3.6g\n\n**Brown Rice (1 cup cooked / 195g)**\n- Calories: ~215\n- Protein: ~5g\n- Carbohydrates: ~45g\n- Fat: ~1.5g\n\n**Steamed Broccoli (1 cup / 156g)**\n- Calories: ~55\n- Protein: ~4g\n- Carbohydrates: ~11g\n- Fat: ~0.6g\n\n**Olive Oil (1 tablespoon / 15ml)**\n- Calories: ~120\n- Protein: 0g\n- Carbohydrates: 0g\n- Fat: ~14g\n\n### Total Nutritional Breakdown\n- **Total Calories:** ~555\n- **Total Protein:** ~40g\n- **Total Carbohydrates:** ~56g\n- **Total Fat:** ~20.7g\n\n### 2. Micronutrient Highlights\n- **Vitamins:**\n  - **Chicken:** B vitamins (especially niacin and B6), which are important for energy metabolism.\n  - **Brown Rice:** Contains B vitamins, particularly thiamine and niacin.\n  - **Broccoli:** High in Vitamin C, Vitamin K, and folate.\n  - **Olive Oil:** Contains Vitamin E and K.\n\n- **Minerals:**\n  - **Chicken:** Good source of phosphorus and selenium.\n  - **Brown Rice:** Contains magnesium, manganese, and some iron.\n  - **Broc
  ...
}
```

**AI Metadata:**

- **Model:** gpt-4o-mini
- **Tokens Used:** 803
- **Cost:** $0.000435 USD

**Performance:**

- **Response Time:** 0.82s
- **Status Code:** 200

---

### `POST /health/bloodwork`

AI-powered bloodwork/lab results analysis

**Request:**

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/bloodwork \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "lab_results": {
    "glucose": 95,
    "hemoglobin": 14.2,
    "cholesterol": {
      "total": 185,
      "ldl": 110,
      "hdl": 55,
      "triglycerides": 100
    },
    "white_blood_cells": 7.5,
    "red_blood_cells": 4.8
  }
}'
```

**Response:**

```json
{
  "analysis_id": "c03cf927-a900-4cdc-b260-ed92c0c19157",
  "user_id": "user_8",
  "results": {
    "lab_results": {
      "glucose": 95,
      "hemoglobin": 14.2,
      "cholesterol": {
        "total": 185,
        "ldl": 110,
        "hdl": 55,
        "triglycerides": 100
      },
      "white_blood_cells": 7.5,
      "red_blood_cells": 4.8
    }
  },
  "analysis": "### Bloodwork Analysis\n\n#### 1. Key Insights About the Results\n- **Glucose**: 95 mg/dL\n  - Normal range: 70-99 mg/dL (fasting)\n  - Interpretation: This value is within the normal range, indicating normal blood sugar levels.\n\n- **Hemoglobin**: 14.2 g/dL\n  - Normal range: 13.5-17.5 g/dL for men; 12.0-15.5 g/dL for women\n  - Interpretation: This value is within the normal range, suggesting adequate oxygen-carrying capacity of the blood.\n\n- **Cholesterol**:\n  - **Total Cholesterol**: 185 mg/dL\n    - Normal range: Less than 200 mg/dL\n    - Interpretation: This value is within the desirable range.\n  - **LDL (Low-Density Lipoprotein)**: 110 mg/dL\n    - Optimal range: Less than 100 mg/dL; near optimal: 100-129 mg/dL\n    - Interpretation: This value is near optimal but slightly above the ideal level.\n  - **HDL (High-Density Lipoprotein)**: 55 mg/dL\n    - Normal range: Greater than 40 mg/dL for men; greater than 50 mg/dL for women\n    - Interpretation: This value is within the normal range and is considered protective against heart disease.\n  - **Triglycerides**: 100 mg/dL\n    - Normal range: Less
  ...
}
```

**AI Metadata:**

- **Model:** gpt-4o-mini
- **Tokens Used:** 982
- **Cost:** $0.000507 USD

**Performance:**

- **Response Time:** 0.62s
- **Status Code:** 200

---

### `POST /health/dna`

AI-powered genetic/DNA analysis

**Request:**

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/dna \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "dna_data": {
    "markers": {
      "APOE": "e3/e3",
      "BRCA1": "wild-type",
      "MTHFR": "C677T heterozygous"
    },
    "ancestry": "European",
    "sequencing_type": "23andMe"
  }
}'
```

**Response:**

```json
{
  "analysis_id": "512ad425-80a0-4300-8339-b10634720592",
  "user_id": "user_8",
  "dna_data_summary": "Genetic data analyzed",
  "analysis": "Based on the genetic data provided, here are some insights regarding health predispositions, lifestyle recommendations, preventive health measures, and areas to monitor. Please remember that genetics is just one factor among many influencing health, and it is advisable to consult with a genetic counselor for personalized guidance.\n\n### 1. Health Predispositions Based on Genetic Markers\n\n- **APOE (e3/e3)**: This genotype is considered neutral in terms of Alzheimer's disease risk. While the e4 allele is associated with an increased risk, having the e3/e3 genotype does not indicate a heightened risk for this condition.\n  \n- **BRCA1 (wild-type)**: A wild-type result indicates that there are no mutations in the BRCA1 gene associated with an increased risk of breast or ovarian cancer. This suggests a lower genetic predisposition to these cancers compared to individuals with pathogenic mutations.\n\n- **MTHFR (C677T heterozygous)**: This variant may influence folate metabolism and has been associated with a slightly increased risk of certain conditions, such as cardiovascular disease and neural tube defects in pregnancy. However, the heterozygous state typically has a milder impact compared to homozygous variants.\n\n### 2. Lifestyle Recommendations\n\n- **Diet**: Focus on a balanced diet rich in fruits, vegetables, whole grains, and l
  ...
}
```

**AI Metadata:**

- **Model:** gpt-4o-mini
- **Tokens Used:** 772
- **Cost:** $0.000400 USD

**Performance:**

- **Response Time:** 1.92s
- **Status Code:** 200

---

### `POST /health/risk`

AI-powered health risk assessment

**Request:**

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/risk \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "medical_history": {
    "age": 35,
    "sex": "male",
    "conditions": [
      "hypertension"
    ],
    "family_history": [
      "diabetes",
      "heart disease"
    ]
  },
  "lifestyle_factors": {
    "smoking": false,
    "alcohol": "moderate",
    "exercise": "3-4 times per week",
    "diet": "balanced"
  }
}'
```

**Response:**

```json
{
  "assessment_id": "da6b9b92-3f82-4349-8b21-bd8582048230",
  "user_id": "user_8",
  "analysis": "Based on the provided medical history and lifestyle factors, here is an assessment of health risks and recommendations:\n\n### 1. Identified Risk Factors\n- **Age**: At 35, you are in a relatively low-risk age group for many chronic diseases, but this can change as you age.\n- **Sex**: Males generally have a higher risk for certain conditions, such as heart disease, compared to females.\n- **Medical Conditions**: \n  - **Hypertension**: This is a significant risk factor for cardiovascular disease and can lead to complications if not managed properly.\n- **Family History**: \n  - **Diabetes**: A family history increases your risk of developing type 2 diabetes.\n  - **Heart Disease**: A family history of heart disease also elevates your risk for cardiovascular issues.\n- **Lifestyle Factors**: \n  - **Smoking**: Non-smoker, which is positive for overall health.\n  - **Alcohol Consumption**: Moderate alcohol consumption can be acceptable, but it should be monitored.\n  - **Exercise**: Regular exercise (3-4 times per week) is beneficial for cardiovascular health and weight management.\n  - **Diet**: A balanced diet is crucial for maintaining overall health and preventing chronic diseases.\n\n### 2. Risk Assessment for Common Conditions\n- **Cardiovascular Disease**: Given your hypertension and family history of heart disease, you may have an elevated risk. Regular monitoring of bloo
  ...
}
```

**AI Metadata:**

- **Model:** gpt-4o-mini
- **Tokens Used:** 844
- **Cost:** $0.000441 USD

**Performance:**

- **Response Time:** 2.67s
- **Status Code:** 200

---

### `GET /health/vitals`

Get vitals data

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/vitals \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "vitals": [],
  "message": "No vitals recorded yet"
}
```

**Performance:**

- **Response Time:** 1.29s
- **Status Code:** 200

---

### `GET /health/symptoms`

Get symptoms data

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/symptoms \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "symptoms": [],
  "message": "No symptoms recorded yet"
}
```

**Performance:**

- **Response Time:** 0.49s
- **Status Code:** 200

---

### `GET /health/medications`

Get medications data

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/medications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "medications": [],
  "message": "No medications recorded yet"
}
```

**Performance:**

- **Response Time:** 0.42s
- **Status Code:** 200

---

### `GET /health/conditions`

Get conditions data

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/conditions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "conditions": [],
  "message": "No conditions recorded yet"
}
```

**Performance:**

- **Response Time:** 0.57s
- **Status Code:** 200

---

### `GET /health/allergies`

Get allergies data

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/allergies \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "allergies": [],
  "message": "No allergies recorded yet"
}
```

**Performance:**

- **Response Time:** 0.51s
- **Status Code:** 200

---

### `GET /health/check`

Get check data

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/check \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-10-03T17:11:32.525312",
  "service": "bondmcp-api"
}
```

**Performance:**

- **Response Time:** 0.43s
- **Status Code:** 200

---

### `GET /health/status`

Get status data

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "status": "operational",
  "services": {
    "bloodwork_analysis": "available",
    "dna_analysis": "available",
    "supplement_recommendations": "available",
    "fitness_planning": "available",
    "nutrition_optimization": "available",
    "emergency_triage": "available",
    "health_scoring": "available",
    "risk_assessment": "available"
  },
  "message": "All Health AI services are operational",
  "timestamp": "2025-10-03T17:11:32.914914"
}
```

**Performance:**

- **Response Time:** 0.59s
- **Status Code:** 200

---


## AI Analysis Endpoints

Advanced health analysis powered by AI.

### `POST /health/fitness`

AI-powered fitness activity analysis

**Request:**

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/fitness \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "activity": "running",
  "duration": 30,
  "intensity": "high"
}'
```

**Response:**

```json
{
  "analysis_id": "d220356e-547d-468f-8c44-3c5a51d045b0",
  "user_id": "user_8",
  "activity": "running",
  "duration": 30,
  "intensity": "high",
  "analysis": "### 1. Estimated Calories Burned\nThe number of calories burned while running can vary based on factors such as weight, speed, and metabolism. However, on average:\n\n- A person weighing 155 pounds (70 kg) burns approximately 298 calories in 30 minutes of running at a pace of 6 mph (10-minute mile).\n- A person weighing 185 pounds (84 kg) burns around 355 calories in the same duration and intensity.\n\nFor high-intensity running (e.g., sprints or interval training), these numbers can increase significantly, potentially reaching 400-600 calories depending on effort and body composition.\n\n### 2. Health Benefits of Running\n- **Cardiovascular Improvement**: Running strengthens the heart, improves circulation, and enhances overall cardiovascular health.\n- **Weight Management**: It effectively burns calories, aiding in weight loss or maintenance.\n- **Muscle Strengthening**: Engages various muscle groups, particularly in the legs, core, and even arms, contributing to muscle toning.\n- **Mental Health**: Running releases endorphins, which can reduce stress, anxiety, and symptoms of depression, often referred to as the \"runner's high.\"\n- **Bone Density**: Weight-bearing exercise like running can improve bone density, reducing the risk of osteoporosis.\n- **Enhanced Endurance**: Regular running builds aerobic capacity
  ...
}
```

**AI Metadata:**

- **Model:** gpt-4o-mini
- **Tokens Used:** 689
- **Cost:** $0.000373 USD

**Performance:**

- **Response Time:** 0.57s
- **Status Code:** 200

---

### `POST /health/nutrition`

AI-powered nutrition analysis

**Request:**

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/nutrition \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "food_items": [
    "grilled chicken breast",
    "brown rice",
    "steamed broccoli",
    "olive oil"
  ],
  "meal_type": "dinner"
}'
```

**Response:**

```json
{
  "analysis_id": "14b4ed45-dbc9-4903-91b6-c4b01ff446c9",
  "user_id": "user_8",
  "food_items": [
    "grilled chicken breast",
    "brown rice",
    "steamed broccoli",
    "olive oil"
  ],
  "meal_type": "dinner",
  "analysis": "Sure! Let\u2019s analyze the nutritional content of your dinner consisting of grilled chicken breast, brown rice, steamed broccoli, and olive oil.\n\n### 1. Estimated Nutritional Breakdown\n\n**Grilled Chicken Breast (4 oz / 113g)**\n- Calories: ~165\n- Protein: ~31g\n- Carbohydrates: 0g\n- Fat: ~3.6g\n\n**Brown Rice (1 cup cooked / 195g)**\n- Calories: ~215\n- Protein: ~5g\n- Carbohydrates: ~45g\n- Fat: ~1.5g\n\n**Steamed Broccoli (1 cup / 156g)**\n- Calories: ~55\n- Protein: ~4g\n- Carbohydrates: ~11g\n- Fat: ~0.6g\n\n**Olive Oil (1 tablespoon / 15ml)**\n- Calories: ~120\n- Protein: 0g\n- Carbohydrates: 0g\n- Fat: ~14g\n\n### Total Nutritional Breakdown\n- **Total Calories:** ~555\n- **Total Protein:** ~40g\n- **Total Carbohydrates:** ~56g\n- **Total Fat:** ~20.7g\n\n### 2. Micronutrient Highlights\n- **Vitamins:**\n  - **Chicken:** B vitamins (especially niacin and B6), which are important for energy metabolism.\n  - **Brown Rice:** Contains B vitamins, particularly thiamine and niacin.\n  - **Broccoli:** High in Vitamin C, Vitamin K, and folate.\n  - **Olive Oil:** Contains Vitamin E and K.\n\n- **Minerals:**\n  - **Chicken:** Good source of phosphorus and selenium.\n  - **Brown Rice:** Contains magnesium, manganese, and some iron.\n  - **Broc
  ...
}
```

**AI Metadata:**

- **Model:** gpt-4o-mini
- **Tokens Used:** 803
- **Cost:** $0.000435 USD

**Performance:**

- **Response Time:** 0.82s
- **Status Code:** 200

---

### `POST /health/bloodwork`

AI-powered bloodwork/lab results analysis

**Request:**

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/bloodwork \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "lab_results": {
    "glucose": 95,
    "hemoglobin": 14.2,
    "cholesterol": {
      "total": 185,
      "ldl": 110,
      "hdl": 55,
      "triglycerides": 100
    },
    "white_blood_cells": 7.5,
    "red_blood_cells": 4.8
  }
}'
```

**Response:**

```json
{
  "analysis_id": "c03cf927-a900-4cdc-b260-ed92c0c19157",
  "user_id": "user_8",
  "results": {
    "lab_results": {
      "glucose": 95,
      "hemoglobin": 14.2,
      "cholesterol": {
        "total": 185,
        "ldl": 110,
        "hdl": 55,
        "triglycerides": 100
      },
      "white_blood_cells": 7.5,
      "red_blood_cells": 4.8
    }
  },
  "analysis": "### Bloodwork Analysis\n\n#### 1. Key Insights About the Results\n- **Glucose**: 95 mg/dL\n  - Normal range: 70-99 mg/dL (fasting)\n  - Interpretation: This value is within the normal range, indicating normal blood sugar levels.\n\n- **Hemoglobin**: 14.2 g/dL\n  - Normal range: 13.5-17.5 g/dL for men; 12.0-15.5 g/dL for women\n  - Interpretation: This value is within the normal range, suggesting adequate oxygen-carrying capacity of the blood.\n\n- **Cholesterol**:\n  - **Total Cholesterol**: 185 mg/dL\n    - Normal range: Less than 200 mg/dL\n    - Interpretation: This value is within the desirable range.\n  - **LDL (Low-Density Lipoprotein)**: 110 mg/dL\n    - Optimal range: Less than 100 mg/dL; near optimal: 100-129 mg/dL\n    - Interpretation: This value is near optimal but slightly above the ideal level.\n  - **HDL (High-Density Lipoprotein)**: 55 mg/dL\n    - Normal range: Greater than 40 mg/dL for men; greater than 50 mg/dL for women\n    - Interpretation: This value is within the normal range and is considered protective against heart disease.\n  - **Triglycerides**: 100 mg/dL\n    - Normal range: Less
  ...
}
```

**AI Metadata:**

- **Model:** gpt-4o-mini
- **Tokens Used:** 982
- **Cost:** $0.000507 USD

**Performance:**

- **Response Time:** 0.62s
- **Status Code:** 200

---

### `POST /health/dna`

AI-powered genetic/DNA analysis

**Request:**

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/dna \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "dna_data": {
    "markers": {
      "APOE": "e3/e3",
      "BRCA1": "wild-type",
      "MTHFR": "C677T heterozygous"
    },
    "ancestry": "European",
    "sequencing_type": "23andMe"
  }
}'
```

**Response:**

```json
{
  "analysis_id": "512ad425-80a0-4300-8339-b10634720592",
  "user_id": "user_8",
  "dna_data_summary": "Genetic data analyzed",
  "analysis": "Based on the genetic data provided, here are some insights regarding health predispositions, lifestyle recommendations, preventive health measures, and areas to monitor. Please remember that genetics is just one factor among many influencing health, and it is advisable to consult with a genetic counselor for personalized guidance.\n\n### 1. Health Predispositions Based on Genetic Markers\n\n- **APOE (e3/e3)**: This genotype is considered neutral in terms of Alzheimer's disease risk. While the e4 allele is associated with an increased risk, having the e3/e3 genotype does not indicate a heightened risk for this condition.\n  \n- **BRCA1 (wild-type)**: A wild-type result indicates that there are no mutations in the BRCA1 gene associated with an increased risk of breast or ovarian cancer. This suggests a lower genetic predisposition to these cancers compared to individuals with pathogenic mutations.\n\n- **MTHFR (C677T heterozygous)**: This variant may influence folate metabolism and has been associated with a slightly increased risk of certain conditions, such as cardiovascular disease and neural tube defects in pregnancy. However, the heterozygous state typically has a milder impact compared to homozygous variants.\n\n### 2. Lifestyle Recommendations\n\n- **Diet**: Focus on a balanced diet rich in fruits, vegetables, whole grains, and l
  ...
}
```

**AI Metadata:**

- **Model:** gpt-4o-mini
- **Tokens Used:** 772
- **Cost:** $0.000400 USD

**Performance:**

- **Response Time:** 1.92s
- **Status Code:** 200

---

### `POST /health/risk`

AI-powered health risk assessment

**Request:**

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/risk \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "medical_history": {
    "age": 35,
    "sex": "male",
    "conditions": [
      "hypertension"
    ],
    "family_history": [
      "diabetes",
      "heart disease"
    ]
  },
  "lifestyle_factors": {
    "smoking": false,
    "alcohol": "moderate",
    "exercise": "3-4 times per week",
    "diet": "balanced"
  }
}'
```

**Response:**

```json
{
  "assessment_id": "da6b9b92-3f82-4349-8b21-bd8582048230",
  "user_id": "user_8",
  "analysis": "Based on the provided medical history and lifestyle factors, here is an assessment of health risks and recommendations:\n\n### 1. Identified Risk Factors\n- **Age**: At 35, you are in a relatively low-risk age group for many chronic diseases, but this can change as you age.\n- **Sex**: Males generally have a higher risk for certain conditions, such as heart disease, compared to females.\n- **Medical Conditions**: \n  - **Hypertension**: This is a significant risk factor for cardiovascular disease and can lead to complications if not managed properly.\n- **Family History**: \n  - **Diabetes**: A family history increases your risk of developing type 2 diabetes.\n  - **Heart Disease**: A family history of heart disease also elevates your risk for cardiovascular issues.\n- **Lifestyle Factors**: \n  - **Smoking**: Non-smoker, which is positive for overall health.\n  - **Alcohol Consumption**: Moderate alcohol consumption can be acceptable, but it should be monitored.\n  - **Exercise**: Regular exercise (3-4 times per week) is beneficial for cardiovascular health and weight management.\n  - **Diet**: A balanced diet is crucial for maintaining overall health and preventing chronic diseases.\n\n### 2. Risk Assessment for Common Conditions\n- **Cardiovascular Disease**: Given your hypertension and family history of heart disease, you may have an elevated risk. Regular monitoring of bloo
  ...
}
```

**AI Metadata:**

- **Model:** gpt-4o-mini
- **Tokens Used:** 844
- **Cost:** $0.000441 USD

**Performance:**

- **Response Time:** 2.67s
- **Status Code:** 200

---


## Data Endpoints

Health data retrieval endpoints.

### `GET /api/v1/health`

V1 API health check

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/health \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "status": "healthy",
  "message": "BondMCP Platform V2 is operational",
  "version": {
    "api_version": "2.1.0",
    "git_sha": null,
    "build_time": null,
    "environment": "production"
  },
  "timestamp": "2025-10-03T17:11:21.005734",
  "system": {
    "api": "operational",
    "database": "operational",
    "ai_services": "operational",
    "authentication": "operational",
    "billing": "operational",
    "security": "enhanced"
  },
  "features": {
    "billing_enforcement": "active",
    "api_versioning": "v1",
    "authentication": "required",
    "rate_limiting": "enabled",
    "security_headers": "implemented"
  },
  "endpoints": {
    "total": "52+",
    "categories": [
      "Authentication",
      "Health AI",
      "Healthcare",
      "Admin",
      "Integrations"
    ],
    "documentation": "/docs",
    "openapi": "/openapi.json"
  }
}
```

**Performance:**

- **Response Time:** 0.43s
- **Status Code:** 200

---

### `GET /v2/health/live`

V2 liveness probe

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/v2/health/live \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "status": "alive",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Performance:**

- **Response Time:** 0.40s
- **Status Code:** 200

---

### `GET /v2/health/ready`

V2 readiness probe

**Request:**

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/v2/health/ready \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "status": "ready",
  "components": {
    "database": "ok",
    "ai_services": "ok"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Performance:**

- **Response Time:** 0.40s
- **Status Code:** 200

---


## Testing Summary

**Total Endpoints:** 17  
**Successful:** 17  
**Failed:** 0  
**Average Response Time:** 0.76s  

### Detailed Results

| Endpoint | Status | Time | AI Model | Cost |
|----------|--------|------|----------|------|
| `GET /health` | ✅ | 0.42s | - | - |
| `GET /api/v1/health` | ✅ | 0.43s | - | - |
| `GET /v2/health` | ✅ | 0.40s | - | - |
| `GET /v2/health/live` | ✅ | 0.40s | - | - |
| `GET /v2/health/ready` | ✅ | 0.40s | - | - |
| `POST /health/fitness` | ✅ | 0.57s | gpt-4o-mini | $0.000373 |
| `POST /health/nutrition` | ✅ | 0.82s | gpt-4o-mini | $0.000435 |
| `POST /health/bloodwork` | ✅ | 0.62s | gpt-4o-mini | $0.000507 |
| `POST /health/dna` | ✅ | 1.92s | gpt-4o-mini | $0.000400 |
| `POST /health/risk` | ✅ | 2.67s | gpt-4o-mini | $0.000441 |
| `GET /health/vitals` | ✅ | 1.29s | - | - |
| `GET /health/symptoms` | ✅ | 0.49s | - | - |
| `GET /health/medications` | ✅ | 0.42s | - | - |
| `GET /health/conditions` | ✅ | 0.57s | - | - |
| `GET /health/allergies` | ✅ | 0.51s | - | - |
| `GET /health/check` | ✅ | 0.43s | - | - |
| `GET /health/status` | ✅ | 0.59s | - | - |

---

*Documentation auto-generated from live API testing*
