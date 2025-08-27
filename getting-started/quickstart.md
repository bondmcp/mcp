# Quick Start Guide

Get up and running with the **live BondMCP API** in minutes! The API is now fully operational at `api.bondmcp.com`.

## 1. Install CLI

```bash
pip install bondmcp-cli
```

## 2. Authenticate

```bash
bondmcp auth login
```

## 3. Create API Key

```bash
bondmcp keys create --name "quickstart"
```

## 4. Make Your First Call

```bash
bondmcp ask "What are the health benefits of exercise?"
```

## 5. Try Different Endpoints

### Health Analysis
```bash
bondmcp analyze --data "blood_pressure: 120/80, heart_rate: 70"
```

### Lab Results
```bash
bondmcp labs analyze --file "my_lab_results.json"
```

### Nutrition
```bash
bondmcp nutrition analyze --meal "grilled chicken, brown rice, broccoli"
```

## Using SDKs

### Python
```bash
pip install bondmcp-python
```

```python
from bondmcp import BondMCP

client = BondMCP(api_key="your-api-key")
response = client.ask("What should I eat for breakfast?")
print(response.answer)
```

### JavaScript
```bash
npm install @bondmcp/sdk
```

```javascript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({ apiKey: 'your-api-key' });
const response = await client.ask('What should I eat for breakfast?');
console.log(response.answer);
```

## No Web Interface

BondMCP is CLI/API only. There is no web dashboard or browser-based interface.

## Next Steps

- [Authentication Setup](authentication.md)
- [First API Call](first-api-call.md)
- [SDK Documentation](../sdks/README.md)
