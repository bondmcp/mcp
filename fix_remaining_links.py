#!/usr/bin/env python3
import os

# Create missing directories and files
missing_files = {
    'api-reference/README.md': '''# API Reference

Complete API documentation for the BondMCP Health AI platform.

## Overview

BondMCP provides a REST API for health AI functionality. All endpoints require API key authentication.

## Base URL
```
https://api.bondmcp.com/v1
```

## Authentication
All API requests require an API key in the Authorization header:
```bash
Authorization: Bearer YOUR_API_KEY
```

## Core Endpoints

### Health Question Answering
- `POST /ask` - Ask health questions and get AI-powered answers

### Lab Analysis  
- `POST /labs/interpret` - Analyze and interpret lab results

### Health Data
- `POST /health-data/analyze` - Analyze health metrics and data

### Nutrition
- `POST /nutrition/analyze` - Analyze meals and nutrition data

### Supplements
- `POST /supplement/recommend` - Get personalized supplement recommendations

### Data Import
- `POST /import/oura` - Import data from Oura ring
- `POST /import/fitbit` - Import data from Fitbit
- `POST /import/apple-health` - Import data from Apple Health

### System
- `GET /health` - API health check
- `GET /status` - System status

## Rate Limits
- Free tier: 1,000 requests/month
- Pro tier: 50,000 requests/month
- Enterprise: Custom limits

## Error Handling
All errors return JSON with error details:
```json
{
  "error": "error_code",
  "message": "Human readable error message",
  "details": {}
}
```

## CLI Access
All API functionality is also available via CLI:
```bash
pip install bondmcp-cli
bondmcp --help
```
''',

    'api-reference/authentication.md': '''# Authentication

BondMCP uses API key authentication for all requests.

## API Key Authentication

### Getting an API Key
```bash
# Install CLI
pip install bondmcp-cli

# Login
bondmcp auth login

# Create API key
bondmcp keys create --name "my-app"
```

### Using API Keys

#### HTTP Header
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.bondmcp.com/v1/health
```

#### Environment Variable
```bash
export BONDMCP_API_KEY="your-api-key"
bondmcp ask "What are the benefits of exercise?"
```

### SDK Authentication

#### Python
```python
from bondmcp import BondMCP

client = BondMCP(api_key="your-api-key")
```

#### JavaScript
```javascript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({ apiKey: 'your-api-key' });
```

## Key Management

### Create Keys
```bash
bondmcp keys create --name "production-app"
```

### List Keys
```bash
bondmcp keys list
```

### Revoke Keys
```bash
bondmcp keys revoke --key-id "key-id"
```

## Security Best Practices

1. **Keep keys secure** - Never commit API keys to version control
2. **Use environment variables** - Store keys in environment variables
3. **Rotate keys regularly** - Create new keys and revoke old ones
4. **Use specific key names** - Name keys by application/purpose
5. **Monitor usage** - Check key usage with `bondmcp usage show`

## No Web Interface

All key management is done via CLI. There is no web-based dashboard for API key management.
''',

    'sdks/README.md': '''# SDKs & Tools

Official SDKs and tools for the BondMCP Health AI platform.

## Available SDKs

### Python SDK
```bash
pip install bondmcp-python
```

Full-featured Python SDK with type hints and comprehensive examples.

### JavaScript/TypeScript SDK  
```bash
npm install @bondmcp/sdk
```

Universal SDK that works in Node.js and browsers with full TypeScript support.

### CLI Tools
```bash
pip install bondmcp-cli
```

Powerful command-line interface for health queries, scoring, and automation.

### Go SDK
```bash
go get github.com/bondmcp/bondmcp-go
```

High-performance Go SDK for enterprise applications.

## Getting Started

1. **Choose your SDK** based on your preferred language
2. **Install** using the package manager for your language  
3. **Get your API key** via CLI: `bondmcp keys create`
4. **Follow the quickstart** guide for your chosen SDK
5. **Explore examples** and build your health AI application

## Authentication

All SDKs use API key authentication:

```python
# Python
client = BondMCP(api_key="your-api-key")
```

```javascript
// JavaScript
const client = new BondMCP({ apiKey: 'your-api-key' });
```

```bash
# CLI
export BONDMCP_API_KEY="your-api-key"
bondmcp ask "health question"
```

## No Web Dashboard

BondMCP is CLI/API only. Use the CLI tools for all account management and API key operations.
''',

    'sdks/cli/README.md': '''# CLI Tools

Command-line interface for the BondMCP Health AI platform.

## Installation

```bash
pip install bondmcp-cli
```

## Authentication

### Login
```bash
bondmcp auth login
```

### Set API Key
```bash
export BONDMCP_API_KEY="your-api-key"
```

### Check Status
```bash
bondmcp auth status
```

## Core Commands

### Health Questions
```bash
bondmcp ask "What are the benefits of vitamin D?"
```

### Lab Analysis
```bash
bondmcp labs analyze --file "lab_results.json"
```

### Nutrition Analysis
```bash
bondmcp nutrition analyze --meal "grilled chicken, brown rice, broccoli"
```

### Health Data Analysis
```bash
bondmcp analyze --data "blood_pressure: 120/80, heart_rate: 70"
```

### Supplement Recommendations
```bash
bondmcp supplements recommend --goals "energy, immunity"
```

## API Key Management

### Create Key
```bash
bondmcp keys create --name "my-app"
```

### List Keys
```bash
bondmcp keys list
```

### Revoke Key
```bash
bondmcp keys revoke --key-id "key-id"
```

## Usage & Billing

### Check Usage
```bash
bondmcp usage show
```

### Billing Status
```bash
bondmcp billing status
```

## Configuration

### Set Default Options
```bash
bondmcp config set --format json
bondmcp config set --verbose true
```

### View Configuration
```bash
bondmcp config show
```

## Help

### General Help
```bash
bondmcp --help
```

### Command-Specific Help
```bash
bondmcp ask --help
bondmcp labs --help
```

## Examples

### Basic Health Query
```bash
bondmcp ask "Should I take vitamin D supplements?"
```

### Analyze Lab Results
```bash
bondmcp labs analyze --file my_bloodwork.json --format detailed
```

### Get Meal Recommendations
```bash
bondmcp nutrition recommend --goals "weight_loss" --restrictions "gluten_free"
```

### Health Risk Assessment
```bash
bondmcp assess --age 35 --gender male --family_history "diabetes"
```

## No Web Interface

The CLI is the primary interface for BondMCP. There is no web-based dashboard or GUI application.
''',
}

# Create the missing files
for filepath, content in missing_files.items():
    dirname = os.path.dirname(filepath)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Created: {filepath}")

print("Missing files created successfully!")
