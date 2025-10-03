# Python SDK Integration Guide

This guide demonstrates how to integrate BondMCP Health AI APIs into your Python applications, including LangChain/LangGraph integration.

## Installation

```bash
pip install requests python-dotenv
```

For LangChain integration:

```bash
pip install langchain langchain-openai langgraph
```

## Basic Python Client

Create a reusable client class for BondMCP:

```python
import os
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class BondMCPClient:
    """
    BondMCP Health AI API Client
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("BONDMCP_API_KEY")
        self.base_url = "https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp"
        
        if not self.api_key:
            raise ValueError("API key is required. Set BONDMCP_API_KEY environment variable.")
    
    def _make_request(self, endpoint: str, data: Dict) -> Dict:
        """Make authenticated API request"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{self.base_url}/{endpoint}",
            headers=headers,
            json=data
        )
        
        response.raise_for_status()
        return response.json()
    
    def analyze_risk(self, patient_data: Dict, analysis_type: str = "general") -> Dict:
        """Analyze patient health risks"""
        return self._make_request("health-ai/risk-analysis", {
            "patient_data": patient_data,
            "analysis_type": analysis_type
        })
    
    def check_medications(self, medications: List[Dict], conditions: List[str] = None) -> Dict:
        """Check medication interactions"""
        return self._make_request("health-ai/medication-check", {
            "medications": medications,
            "patient_conditions": conditions or []
        })
    
    def assess_symptoms(self, symptoms: List[Dict], age: int = None, gender: str = None) -> Dict:
        """Assess patient symptoms"""
        payload = {"symptoms": symptoms}
        if age:
            payload["patient_age"] = age
        if gender:
            payload["patient_gender"] = gender
        
        return self._make_request("health-ai/symptom-assessment", payload)
    
    def get_treatment_recommendations(self, diagnosis: str, patient_profile: Dict, 
                                     lab_results: Dict = None) -> Dict:
        """Get treatment recommendations"""
        payload = {
            "diagnosis": diagnosis,
            "patient_profile": patient_profile
        }
        if lab_results:
            payload["lab_results"] = lab_results
        
        return self._make_request("health-ai/treatment-recommendations", payload)
    
    def extract_clinical_data(self, clinical_text: str, 
                             extract_fields: List[str] = None) -> Dict:
        """Extract structured data from clinical notes"""
        payload = {"clinical_text": clinical_text}
        if extract_fields:
            payload["extract_fields"] = extract_fields
        
        return self._make_request("health-ai/data-extraction", payload)
```

## Usage Examples

### Example 1: Risk Analysis

```python
from bondmcp_client import BondMCPClient

# Initialize client
client = BondMCPClient(api_key="your_api_key_here")

# Analyze cardiovascular risk
patient_data = {
    "age": 55,
    "gender": "male",
    "bmi": 29.0,
    "blood_pressure": "145/92",
    "cholesterol": 240,
    "smoking": True,
    "family_history": ["heart_disease", "stroke"]
}

result = client.analyze_risk(patient_data, analysis_type="cardiovascular")

print(f"Risk Level: {result['risk_level']}")
print(f"Risk Score: {result['risk_score']}")
print("\nRecommendations:")
for rec in result['recommendations']:
    print(f"  - {rec}")
```

### Example 2: Medication Interaction Check

```python
medications = [
    {"name": "Warfarin", "dosage": "5mg", "frequency": "daily"},
    {"name": "Aspirin", "dosage": "81mg", "frequency": "daily"},
    {"name": "Ibuprofen", "dosage": "400mg", "frequency": "as needed"}
]

result = client.check_medications(
    medications=medications,
    conditions=["atrial_fibrillation"]
)

for interaction in result['interactions']:
    print(f"⚠️  {interaction['severity'].upper()}: {interaction['interaction']}")
    print(f"   Drugs: {', '.join(interaction['drugs'])}")
    print(f"   Recommendation: {interaction['recommendation']}\n")
```

### Example 3: Symptom Assessment

```python
symptoms = [
    {
        "description": "severe headache",
        "severity": 9,
        "duration": "3 hours",
        "onset": "sudden"
    },
    {
        "description": "neck stiffness",
        "severity": 7,
        "duration": "2 hours"
    },
    {
        "description": "fever",
        "severity": 6,
        "duration": "6 hours"
    }
]

result = client.assess_symptoms(symptoms, age=35, gender="female")

print(f"Urgency: {result['urgency']} (Score: {result['urgency_score']})")
print(f"Triage Level: {result['triage_level']}\n")

print("Possible Conditions:")
for condition in result['possible_conditions']:
    print(f"  - {condition['condition']} ({condition['probability']*100:.0f}%)")
    print(f"    {condition['reasoning']}\n")
```

## Error Handling

Implement robust error handling:

```python
import time
from requests.exceptions import HTTPError, Timeout, RequestException

class BondMCPClientWithRetry(BondMCPClient):
    """Enhanced client with retry logic"""
    
    def _make_request(self, endpoint: str, data: Dict, max_retries: int = 3) -> Dict:
        """Make request with exponential backoff retry"""
        
        for attempt in range(max_retries):
            try:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                
                response = requests.post(
                    f"{self.base_url}/{endpoint}",
                    headers=headers,
                    json=data,
                    timeout=30
                )
                
                response.raise_for_status()
                return response.json()
                
            except HTTPError as e:
                if e.response.status_code == 429:
                    # Rate limit - wait and retry
                    wait_time = 2 ** attempt
                    print(f"Rate limited. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                elif e.response.status_code == 401:
                    raise ValueError("Invalid API key")
                elif e.response.status_code == 402:
                    raise ValueError("Insufficient credits")
                else:
                    raise
                    
            except Timeout:
                if attempt < max_retries - 1:
                    print(f"Request timeout. Retrying... ({attempt + 1}/{max_retries})")
                    time.sleep(2 ** attempt)
                    continue
                raise
                
            except RequestException as e:
                if attempt < max_retries - 1:
                    print(f"Request failed. Retrying... ({attempt + 1}/{max_retries})")
                    time.sleep(2 ** attempt)
                    continue
                raise
        
        raise Exception(f"Failed after {max_retries} retries")
```

## LangChain Integration

Integrate BondMCP with LangChain for AI-powered health workflows:

```python
from langchain.tools import Tool
from langchain.agents import initialize_agent, AgentType
from langchain_openai import ChatOpenAI

# Initialize BondMCP client
bondmcp = BondMCPClient()

# Create LangChain tools
tools = [
    Tool(
        name="HealthRiskAnalysis",
        func=lambda patient_data: bondmcp.analyze_risk(eval(patient_data)),
        description="Analyze patient health risks. Input: patient data as dict string"
    ),
    Tool(
        name="MedicationCheck",
        func=lambda meds: bondmcp.check_medications(eval(meds)),
        description="Check medication interactions. Input: medications list as string"
    ),
    Tool(
        name="SymptomAssessment",
        func=lambda symptoms: bondmcp.assess_symptoms(eval(symptoms)),
        description="Assess patient symptoms. Input: symptoms list as string"
    )
]

# Initialize LangChain agent
llm = ChatOpenAI(temperature=0, model="gpt-4")
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Run agent
result = agent.run(
    "A 45-year-old patient has chest pain and shortness of breath. "
    "Assess the symptoms and analyze cardiovascular risk."
)
print(result)
```

## LangGraph Workflow

Create a clinical decision support workflow with LangGraph:

```python
from langgraph.graph import Graph, END
from typing import TypedDict

class ClinicalState(TypedDict):
    symptoms: List[Dict]
    patient_age: int
    assessment: Dict
    risk_analysis: Dict
    recommendations: List[str]

def assess_symptoms(state: ClinicalState) -> ClinicalState:
    """Step 1: Assess symptoms"""
    result = bondmcp.assess_symptoms(
        symptoms=state["symptoms"],
        age=state["patient_age"]
    )
    state["assessment"] = result
    return state

def analyze_risk(state: ClinicalState) -> ClinicalState:
    """Step 2: Analyze health risks"""
    # Extract patient data from assessment
    patient_data = {
        "age": state["patient_age"],
        "symptoms": state["symptoms"]
    }
    
    result = bondmcp.analyze_risk(patient_data)
    state["risk_analysis"] = result
    return state

def generate_recommendations(state: ClinicalState) -> ClinicalState:
    """Step 3: Generate final recommendations"""
    recommendations = []
    
    # Add urgent recommendations
    if state["assessment"]["urgency"] == "emergency":
        recommendations.append("🚨 URGENT: Seek immediate emergency care")
    
    # Add symptom-based recommendations
    recommendations.extend(state["assessment"]["recommended_actions"])
    
    # Add risk-based recommendations
    recommendations.extend(state["risk_analysis"]["recommendations"])
    
    state["recommendations"] = recommendations
    return state

# Build workflow graph
workflow = Graph()

workflow.add_node("assess_symptoms", assess_symptoms)
workflow.add_node("analyze_risk", analyze_risk)
workflow.add_node("generate_recommendations", generate_recommendations)

workflow.add_edge("assess_symptoms", "analyze_risk")
workflow.add_edge("analyze_risk", "generate_recommendations")
workflow.add_edge("generate_recommendations", END)

workflow.set_entry_point("assess_symptoms")

# Compile and run
app = workflow.compile()

# Example usage
initial_state = {
    "symptoms": [
        {"description": "chest pain", "severity": 8, "duration": "1 hour"}
    ],
    "patient_age": 55
}

result = app.invoke(initial_state)
print("\n=== Clinical Decision Support Results ===")
for rec in result["recommendations"]:
    print(f"  • {rec}")
```

## Best Practices

### 1. Environment Variables

Store credentials securely:

```bash
# .env file
BONDMCP_API_KEY=your_api_key_here
```

```python
from dotenv import load_dotenv
load_dotenv()

client = BondMCPClient()  # Auto-loads from env
```

### 2. Cost Tracking

Monitor API costs:

```python
class CostTracker:
    def __init__(self):
        self.total_cost = 0.0
    
    def track_request(self, result: Dict):
        if "cost" in result:
            self.total_cost += result["cost"]
    
    def get_total(self):
        return f"${self.total_cost:.2f}"

tracker = CostTracker()
result = client.analyze_risk(patient_data)
tracker.track_request(result)
print(f"Total spend: {tracker.get_total()}")
```

### 3. Response Caching

Cache responses to reduce costs:

```python
from functools import lru_cache
import hashlib
import json

@lru_cache(maxsize=100)
def cached_risk_analysis(patient_data_hash: str):
    patient_data = json.loads(patient_data_hash)
    return client.analyze_risk(patient_data)

# Usage
patient_hash = json.dumps(patient_data, sort_keys=True)
result = cached_risk_analysis(patient_hash)
```

## Complete Example Application

```python
#!/usr/bin/env python3
"""
Clinical Decision Support System using BondMCP
"""
import os
from bondmcp_client import BondMCPClientWithRetry

def main():
    # Initialize client
    api_key = os.getenv("BONDMCP_API_KEY")
    if not api_key:
        print("Error: Set BONDMCP_API_KEY environment variable")
        return
    
    client = BondMCPClientWithRetry(api_key)
    
    # Patient case
    print("=== Patient Case: 55-year-old Male ===\n")
    
    # 1. Assess symptoms
    symptoms = [
        {"description": "chest pain", "severity": 7, "duration": "2 hours"},
        {"description": "shortness of breath", "severity": 6, "duration": "1 hour"}
    ]
    
    print("1. Assessing symptoms...")
    symptom_result = client.assess_symptoms(symptoms, age=55, gender="male")
    print(f"   Urgency: {symptom_result['urgency']}")
    print(f"   Triage: {symptom_result['triage_level']}\n")
    
    # 2. Analyze cardiovascular risk
    print("2. Analyzing cardiovascular risk...")
    patient_data = {
        "age": 55,
        "gender": "male",
        "bmi": 28.5,
        "blood_pressure": "140/90",
        "smoking": True
    }
    
    risk_result = client.analyze_risk(patient_data, "cardiovascular")
    print(f"   Risk Level: {risk_result['risk_level']}")
    print(f"   Risk Score: {risk_result['risk_score']}\n")
    
    # 3. Final recommendations
    print("3. Final Recommendations:")
    all_recommendations = (
        symptom_result['recommended_actions'] +
        risk_result['recommendations']
    )
    
    for i, rec in enumerate(all_recommendations, 1):
        print(f"   {i}. {rec}")
    
    # Cost summary
    total_cost = symptom_result.get('cost', 0) + risk_result.get('cost', 0)
    print(f"\nTotal API Cost: ${total_cost:.2f}")

if __name__ == "__main__":
    main()
```

## Support

- Documentation: https://docs.bondmcp.com
- Python examples: https://github.com/bondmcp/examples (coming soon)
- Technical support: support@bondmcp.com
