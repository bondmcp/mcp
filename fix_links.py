#!/usr/bin/env python3
import os
import re
import json
from pathlib import Path

def create_missing_files():
    """Create missing files that are referenced but don't exist"""
    
    missing_files = {
        # Core documentation files
        'ACTUAL_API_STATUS.md': '''# API Status

## Current Status: CLI/API Only

BondMCP is currently **CLI and API only**. There is no web-based dashboard, registration, or billing interface.

### Available Access Methods:
- **CLI Tools**: Use the BondMCP CLI for all operations
- **Direct API**: Make direct API calls with authentication
- **SDKs**: Use our Python, JavaScript, Go, or CLI SDKs

### Not Available:
- ❌ Web-based user registration
- ❌ Web dashboard
- ❌ Online billing interface
- ❌ Browser-based API key management

### Getting Started:
1. Install the CLI: `pip install bondmcp-cli`
2. Authenticate via CLI: `bondmcp auth login`
3. Generate API keys via CLI: `bondmcp keys create`

For full documentation, see the [CLI Tools guide](sdks/cli/README.md).
''',
        
        'SIGNUP_INTEGRATION.md': '''# CLI-Based Setup Guide

Since BondMCP is CLI/API only, all account management is done through the command line.

## Setup Process

### 1. Install CLI Tools
```bash
pip install bondmcp-cli
```

### 2. Authentication
```bash
# Login with your credentials
bondmcp auth login

# Or set API key directly
export BONDMCP_API_KEY="your-api-key"
```

### 3. API Key Management
```bash
# Create new API key
bondmcp keys create --name "my-app-key"

# List existing keys
bondmcp keys list

# Revoke a key
bondmcp keys revoke --key-id "key-id"
```

### 4. Usage Tracking
```bash
# Check usage
bondmcp usage show

# View billing information
bondmcp billing status
```

## No Web Interface
BondMCP does not provide web-based registration or dashboard. All operations must be performed via CLI or direct API calls.
''',

        'docs/openapi-pipeline.md': '''# OpenAPI Pipeline

The BondMCP platform uses an automated OpenAPI pipeline to generate SDKs and documentation.

## Pipeline Overview

1. **OpenAPI Specification**: Generated from the live API
2. **SDK Generation**: Automatic generation of Python, JavaScript, Go, and CLI SDKs
3. **Documentation**: Auto-generated API reference documentation
4. **Publishing**: Automated publishing to package repositories

## Generated SDKs

- **Python**: Published to PyPI as `bondmcp-python`
- **JavaScript**: Published to npm as `@bondmcp/sdk`
- **Go**: Available on GitHub as `github.com/bondmcp/bondmcp-go`
- **CLI**: Published to PyPI as `bondmcp-cli`

## Usage

All SDKs are automatically updated when the API changes. See the individual SDK documentation for usage examples.
''',

        'docs/api-reference/advanced/health-data-formats.md': '''# Health Data Formats

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
''',

        'docs/api-reference/advanced/lab-test-reference.md': '''# Lab Test Reference

## Common Lab Tests

### Complete Blood Count (CBC)
- **WBC**: White Blood Cell Count
- **RBC**: Red Blood Cell Count  
- **Hemoglobin**: Oxygen-carrying protein
- **Hematocrit**: Percentage of blood volume occupied by red blood cells
- **Platelets**: Blood clotting cells

### Basic Metabolic Panel (BMP)
- **Glucose**: Blood sugar level
- **Sodium**: Electrolyte balance
- **Potassium**: Muscle and nerve function
- **Chloride**: Acid-base balance
- **BUN**: Kidney function marker
- **Creatinine**: Kidney function marker

### Lipid Panel
- **Total Cholesterol**: Overall cholesterol level
- **LDL**: "Bad" cholesterol
- **HDL**: "Good" cholesterol
- **Triglycerides**: Blood fat levels

For interpretation of specific values, use the lab analysis endpoints.
''',

        'docs/api-reference/advanced/health-goals-reference.md': '''# Health Goals Reference

## Supported Health Goals

### Weight Management
- Weight loss
- Weight gain
- Weight maintenance
- Body composition improvement

### Fitness Goals
- Cardiovascular health
- Strength building
- Endurance improvement
- Flexibility enhancement

### Nutritional Goals
- Balanced nutrition
- Specific dietary requirements
- Supplement optimization
- Meal planning

### Health Optimization
- Energy improvement
- Sleep quality
- Stress management
- Longevity optimization

## Goal Setting API

Use the health goals endpoints to set, track, and optimize your health objectives.
''',

        'getting-started/authentication.md': '''# Authentication Setup

BondMCP uses API key authentication for all requests.

## CLI Authentication

### Install CLI
```bash
pip install bondmcp-cli
```

### Login
```bash
bondmcp auth login
```

### Generate API Key
```bash
bondmcp keys create --name "my-app"
```

## API Authentication

### Using API Key
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.bondmcp.com/v1/health
```

### Environment Variable
```bash
export BONDMCP_API_KEY="your-api-key"
```

## SDK Authentication

### Python
```python
from bondmcp import BondMCP

client = BondMCP(api_key="your-api-key")
```

### JavaScript
```javascript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({ apiKey: 'your-api-key' });
```

## No Web Dashboard

BondMCP does not provide a web-based dashboard. All authentication and key management is done via CLI or API.
''',

        'getting-started/first-api-call.md': '''# First API Call

Make your first call to the BondMCP API.

## Prerequisites

1. Install CLI: `pip install bondmcp-cli`
2. Authenticate: `bondmcp auth login`
3. Get API key: `bondmcp keys create`

## Health Check

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.bondmcp.com/v1/health
```

## Ask a Health Question

```bash
curl -X POST \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"question": "What are the benefits of vitamin D?"}' \\
  https://api.bondmcp.com/v1/ask
```

## Using SDKs

### Python
```python
from bondmcp import BondMCP

client = BondMCP(api_key="your-api-key")
response = client.ask("What are the benefits of vitamin D?")
print(response.answer)
```

### JavaScript
```javascript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({ apiKey: 'your-api-key' });
const response = await client.ask('What are the benefits of vitamin D?');
console.log(response.answer);
```

## Next Steps

- Explore the [API Reference](../api-reference/README.md)
- Try the [SDK Examples](../sdks/README.md)
- Read the [CLI Documentation](../sdks/cli/README.md)
''',

        'getting-started/quickstart.md': '''# Quick Start Guide

Get up and running with BondMCP in minutes.

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
''',
    }
    
    # Create missing files
    for filepath, content in missing_files.items():
        dirname = os.path.dirname(filepath); dirname and os.makedirs(dirname, exist_ok=True)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Created: {filepath}")

def fix_broken_links():
    """Fix broken links by updating them to correct paths or removing them"""
    
    # Load broken links
    with open('broken_links.json', 'r') as f:
        broken_links = json.load(f)
    
    # Group by file for efficient processing
    files_to_fix = {}
    for link in broken_links:
        filepath = link['file']
        if filepath not in files_to_fix:
            files_to_fix[filepath] = []
        files_to_fix[filepath].append(link)
    
    # Fix each file
    for filepath, links in files_to_fix.items():
        if not os.path.exists(filepath):
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Fix each broken link in the file
        for link in links:
            old_link = f"[{link['link_text']}]({link['link_url']})"
            
            # Determine the correct replacement
            new_link = fix_single_link(link['link_text'], link['link_url'], filepath)
            
            if new_link != old_link:
                content = content.replace(old_link, new_link)
                print(f"Fixed in {filepath}: {old_link} -> {new_link}")
        
        # Write back if changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

def fix_single_link(link_text, link_url, current_file):
    """Fix a single broken link"""
    
    # Remove empty links or placeholder links
    if not link_url.strip() or link_url == '()' or 'Coming Soon' in link_text:
        return f"**{link_text}** (CLI/API only - no web interface)"
    
    # Fix common broken links
    link_fixes = {
        'ACTUAL_API_STATUS.md': 'ACTUAL_API_STATUS.md',
        'SIGNUP_INTEGRATION.md': 'SIGNUP_INTEGRATION.md',
        './ENDPOINTS.md': '../api-reference/endpoints/README.md',
        'docs/openapi-pipeline.md': 'docs/openapi-pipeline.md',
        'PLATFORM_MIGRATION_GUIDE.md': '#cli-api-only-platform',
        '../guides/troubleshooting.md': '../resources/troubleshooting.md',
        'quickstart.md': 'quickstart.md',
        'authentication.md': 'authentication.md',
        'first-api-call.md': 'first-api-call.md',
    }
    
    # Apply fixes
    if link_url in link_fixes:
        return f"[{link_text}]({link_fixes[link_url]})"
    
    # For dashboard/signup links, replace with CLI instructions
    if any(word in link_text.lower() for word in ['dashboard', 'signup', 'sign up', 'register']):
        return f"**{link_text}** (Use CLI: `bondmcp auth login`)"
    
    # For API playground links
    if 'playground' in link_text.lower():
        return f"**{link_text}** (Use CLI: `bondmcp --help`)"
    
    # For missing endpoint files, link to main endpoints page
    if link_url.endswith('.md') and 'endpoint' in link_url:
        return f"[{link_text}](../endpoints/README.md)"
    
    # Default: remove the link but keep the text
    return f"**{link_text}** (CLI/API only)"

if __name__ == '__main__':
    print("=== CREATING MISSING FILES ===")
    create_missing_files()
    
    print("\n=== FIXING BROKEN LINKS ===")
    fix_broken_links()
    
    print("\n=== LINK FIXING COMPLETE ===")
