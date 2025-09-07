# Python SDK

The BondMCP Python SDK provides a convenient way to interact with the BondMCP API from your Python applications.

## Installation

```bash
pip install bondmcp
```

## Authentication

```python
from bondmcp import BondMCP

client = BondMCP(api_key="YOUR_API_KEY")
```

## Usage

### Ask a Health Question

```python
response = client.health.ask(question="What are the symptoms of diabetes?")
print(response.answer)
```

### Get Trust Certificate

```python
certificate = client.health.get_trust_certificate(response_id=response.id)
print(certificate)
```

### User Management

```python
# Register a new user
user = client.auth.register(email="user@example.com", password="password123", name="John Doe")

# Login
token = client.auth.login(email="user@example.com", password="password123")

# Set the token for subsequent requests
client.set_token(token.access_token)
```

### API Key Management

```python
# Create a new API key
new_key = client.auth.create_api_key(name="My App")

# List API keys
keys = client.auth.list_api_keys()

# Revoke an API key
client.auth.revoke_api_key(key_id=new_key.id)
```

## Error Handling

```python
from bondmcp.exceptions import BondMCPError

try:
    response = client.health.ask(question="")
except BondMCPError as e:
    print(f"Error: {e.message}")
```

