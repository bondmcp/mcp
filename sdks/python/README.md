# BondMCP Python SDK

The BondMCP Python SDK provides a simple and intuitive interface to integrate BondMCP's healthcare AI capabilities into your Python applications.

## Installation

```bash
pip install bondmcp
```

## Quick Start

```python
from bondmcp import BondMCPClient

# Initialize client with your API key
client = BondMCPClient(api_key="your_api_key")

# Ask a health question
response = client.ask("What are the best supplements for joint health?")
print(response.answer)

# Interpret lab results
lab_results = [
    {"name": "Vitamin D", "value": 25, "unit": "ng/mL", "reference_range": "30-100"},
    {"name": "Ferritin", "value": 15, "unit": "ng/mL", "reference_range": "20-200"}
]
interpretation = client.labs.interpret(lab_results)
print(interpretation.insights)

# Get supplement recommendations
recommendations = client.supplement.recommend(health_goals=["joint health", "energy"])
print(recommendations.supplements)
```

## Core Features

### Health Question Answering

```python
# Ask a simple question
response = client.ask("What are the symptoms of high blood pressure?")

# Ask with context
response = client.ask(
    "Is this medication safe for me?",
    context="I'm pregnant and have been prescribed lisinopril"
)

# Get sources
response = client.ask(
    "What's the recommended vitamin D dosage?",
    include_sources=True
)
print(response.sources)  # List of medical sources
```

### Lab Result Interpretation

```python
# Interpret a single lab result
result = client.labs.interpret_single(
    name="Vitamin D",
    value=25,
    unit="ng/mL",
    reference_range="30-100"
)

# Interpret multiple lab results
results = [
    {"name": "Glucose", "value": 110, "unit": "mg/dL", "reference_range": "70-99"},
    {"name": "HbA1c", "value": 5.9, "unit": "%", "reference_range": "4.0-5.6"}
]
interpretation = client.labs.interpret(results)

# Access insights and recommendations
print(interpretation.insights)
print(interpretation.recommendations)
print(interpretation.risk_factors)
```

### Health Data Analysis

```python
# Analyze sleep data
sleep_data = {
    "data_type": "sleep",
    "data": [
        {"date": "2025-06-01", "duration": 7.5, "deep_sleep": 1.2},
        {"date": "2025-06-02", "duration": 6.8, "deep_sleep": 0.9},
        {"date": "2025-06-03", "duration": 8.2, "deep_sleep": 1.5}
    ]
}
analysis = client.health_data.analyze(sleep_data)

# Analyze nutrition data
nutrition_data = {
    "data_type": "nutrition",
    "data": [
        {"date": "2025-06-01", "calories": 2100, "protein": 95, "carbs": 240, "fat": 70},
        {"date": "2025-06-02", "calories": 1950, "protein": 110, "carbs": 200, "fat": 65}
    ]
}
analysis = client.health_data.analyze(nutrition_data)
```

### Supplement Recommendations

```python
# Get recommendations based on health goals
recommendations = client.supplement.recommend(
    health_goals=["joint health", "energy", "sleep"]
)

# Get recommendations based on lab results
recommendations = client.supplement.recommend_for_labs(
    lab_results=[
        {"name": "Vitamin D", "value": 25, "unit": "ng/mL", "reference_range": "30-100"},
        {"name": "Iron", "value": 40, "unit": "μg/dL", "reference_range": "50-170"}
    ]
)

# Get detailed information about a specific supplement
info = client.supplement.get_info("Vitamin D3")
```

## Error Handling

The SDK provides comprehensive error handling:

```python
from bondmcp.exceptions import BondMCPError, AuthError, RateLimitError

try:
    response = client.ask("What are the symptoms of high blood pressure?")
except AuthError:
    print("Authentication failed. Check your API key.")
except RateLimitError:
    print("Rate limit exceeded. Please try again later.")
except BondMCPError as e:
    print(f"An error occurred: {e}")
```

## Pagination

For endpoints that return large collections of data:

```python
# Get all health data entries
all_entries = []
for page in client.health_data.list_all():
    all_entries.extend(page.entries)

# Manual pagination
page1 = client.health_data.list(page=1, limit=10)
page2 = client.health_data.list(page=2, limit=10)
```

## Advanced Configuration

```python
# Custom configuration
client = BondMCPClient(
    api_key="your_api_key",
    base_url="https://api.custom-domain.com",  # Custom base URL
    timeout=30,  # Custom timeout in seconds
    max_retries=3,  # Number of retry attempts
    retry_delay=2  # Delay between retries in seconds
)

# Custom HTTP client
import httpx
custom_client = httpx.Client(timeout=30)
client = BondMCPClient(
    api_key="your_api_key",
    http_client=custom_client
)
```

## Async Support

The SDK also provides async support for use with asyncio:

```python
import asyncio
from bondmcp.async_client import AsyncBondMCPClient

async def main():
    client = AsyncBondMCPClient(api_key="your_api_key")
    
    # Concurrent requests
    response1, response2 = await asyncio.gather(
        client.ask("What are the symptoms of high blood pressure?"),
        client.labs.interpret([
            {"name": "Glucose", "value": 110, "unit": "mg/dL"}
        ])
    )
    
    print(response1.answer)
    print(response2.insights)
    
    await client.close()  # Close the client when done

asyncio.run(main())
```

## Webhook Integration

```python
# Register a webhook
webhook = client.webhooks.create(
    url="https://your-server.com/webhook",
    events=["lab_result.interpreted", "health_data.analyzed"]
)

# List registered webhooks
webhooks = client.webhooks.list()

# Delete a webhook
client.webhooks.delete(webhook_id="webhook_123")
```

## API Reference

For complete API documentation, visit [docs.bondmcp.com](https://docs.bondmcp.com).

## License

This SDK is distributed under the MIT License. See the [LICENSE](https://github.com/bondmcp/mcp/blob/main/LICENSE) file for details.
