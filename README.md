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

The source for the CLI lives in the `bondmcp_cli/` package.

Generate an API key from the [developer portal](https://api.bondmcp.com) and export it (optional):

```bash
export BONDMCP_PUBLIC_API_KEY=your_key
```

If the environment variable is omitted, the CLI will ask for the key the first
time it runs and save it to `~/.bondmcp_cli` for future use.

## Using the CLI

Send a question to the API:

```bash
bondmcp-cli ask "What can BondMCP do?"
```

The CLI uses `BONDMCP_PUBLIC_API_BASE_URL` if you need to target a different host (defaults to `https://api.bondmcp.com`).

## API Reference

The latest OpenAPI schema is available at [api.bondmcp.com/openapi.json](https://api.bondmcp.com/openapi.json).
For complete guides and SDK information see [docs.bondmcp.com](https://docs.bondmcp.com).

## API Overview

See [API_OVERVIEW.md](./API_OVERVIEW.md) for a summary of available endpoints. Always check the link above for the most up-to-date schema.

## Running Tests

Install the optional test dependencies and run `pytest`:

```bash
pip install -e .[test]
pytest
```
