# BondMCP

This repository hosts the public command line interface (CLI) and minimal setup instructions for the BondMCP API.

BondMCP provides a trusted health AI platform. For all detailed documentation please visit [docs.bondmcp.com](https://docs.bondmcp.com).

## Getting Started

```bash
# Clone the repo
git clone https://github.com/bondmcp/mcp.git
cd mcp

# Install the CLI (requires Python 3.8+)
pip install -e .
```

Generate an API key from the [developer portal](https://api.bondmcp.com) and export it:

```bash
export BONDMCP_PUBLIC_API_KEY=your_key
```

## Using the CLI

Send a question to the API:

```bash
bondmcp-cli ask "What can BondMCP do?"
```

The CLI uses `BONDMCP_PUBLIC_API_BASE_URL` if you need to target a different host (defaults to `https://api.bondmcp.com`).

## API Reference

The latest OpenAPI schema is available at [api.bondmcp.com/openapi.json](https://api.bondmcp.com/openapi.json).
For complete guides and SDK information see [docs.bondmcp.com](https://docs.bondmcp.com).
