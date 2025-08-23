# BondMCP Python SDK

The official Python SDK for the BondMCP health AI protocol.

## Installation

```bash
pip install bondmcp
```

## Quick Start

```python
from bondmcp import BondMCPClient

# Initialize the client
client = BondMCPClient(api_key="your-api-key")

# Ask a health question
response = client.ask.query(
    query="What are the symptoms of diabetes?",
    include_citations=True
)

print(response.answer)
print(f"Confidence: {response.confidence_score}")
```

## MCP Discovery (New in v2.1.0)

```python
from bondmcp import BondMCPClient

client = BondMCPClient(api_key="your-api-key")

# Discover available capabilities dynamically
config = client.get_mcp_configuration()
print(f"Service: {config['service']['name']} v{config['service']['version']}")

# Get capability manifest for verification
manifest = client.get_mcp_manifest()
print(f"Capabilities hash: {manifest['capabilities_sha256']}")

# Find specific capabilities
health_capabilities = [
    cap for cap in config["capabilities"] 
    if "health" in cap["path"] and not cap.get("deprecated", False)
]

print("Available health endpoints:")
for cap in health_capabilities:
    auth_indicator = "🔐" if cap["auth_required"] else "🌐"
    print(f"  {auth_indicator} {cap['method']} {cap['path']} - {cap['name']}")
```

## Features

- **Health Queries**: Ask medical questions with AI consensus validation
- **Lab Analysis**: Analyze lab results and get insights
- **Supplement Recommendations**: Get personalized supplement suggestions
- **Wearable Data Integration**: Connect and analyze wearable device data
- **Medical Records**: Manage and analyze medical records
- **Real-time Chat**: Interactive health consultations

## Authentication

Get your API key from the [BondMCP Dashboard](https://www.bondmcp.com/dashboard).

## Documentation

For full documentation, visit [docs.bondmcp.com](https://docs.bondmcp.com).

## Support

- Email: support@bondmcp.com
- GitHub Issues: [github.com/bondmcp/mcp/issues](https://github.com/bondmcp/mcp/issues)

## License

MIT License - see LICENSE file for details.

