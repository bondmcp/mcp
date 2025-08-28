# CLI-Based Setup Guide

Since BondMCP is , all account management is done through the command line.

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
