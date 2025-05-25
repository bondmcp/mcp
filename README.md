# BondMCP

This repository hosts the public command line interface (CLI) and minimal setup instructions for the BondMCP API.

BondMCP provides a trusted health AI platform. For all detailed documentation please visit [docs.bondmcp.com](https://docs.bondmcp.com).

**Disclaimer:** The BondMCP platform and CLI are provided for informational purposes only and do not constitute medical advice.

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

Interpret lab results from a JSON payload:

```bash
bondmcp-cli labs interpret '{"lab_results": [...]}'
```

Get supplement recommendations:

```bash
bondmcp-cli supplements recommend '{"health_goals": [...]}'
```

The CLI uses `BONDMCP_PUBLIC_API_BASE_URL` if you need to target a different host (defaults to `https://api.bondmcp.com`).

## Node SDK

Install dependencies:

```bash
npm install
```

Create a client and call an endpoint:

```javascript
const BondMCPClient = require('./sdk/bondmcp-node');

const client = new BondMCPClient('YOUR_API_KEY');

async function main() {
  const health = await client.health.check();
  console.log(health);
}

main();
```

## API Reference

The latest OpenAPI schema is available at [api.bondmcp.com/openapi.json](https://api.bondmcp.com/openapi.json).
For complete guides and SDK information see [docs.bondmcp.com](https://docs.bondmcp.com).

## API Overview

See [API_OVERVIEW.md](./API_OVERVIEW.md) for a summary of available endpoints. Always check the link above for the most up-to-date schema.

## SDK Usage

The `sdk/` directory contains minimal Node.js and Python SDKs. These are
single-file helpers that wrap the public API and can be dropped into your own
project.

### Node.js

1. Install the required dependency:

   ```bash
   npm install axios
   ```

2. Copy `sdk/bondmcp-node.js` into your project and require it:

   ```javascript
   const { Client } = require('./bondmcp-node'); // adjust the path as needed

   const client = new Client('YOUR_API_KEY');

   async function main() {
     const status = await client.health.check();
     console.log(status);
   }

   main().catch(console.error);
   ```

### Python

1. Install the `requests` dependency:

   ```bash
   pip install requests
   ```

2. Copy `sdk/bondmcp-python.py` into your project (renaming it to
   `bondmcp.py` if desired) and import `BondMCPClient`:

   ```python
   from bondmcp import BondMCPClient  # from bondmcp.py

   client = BondMCPClient('YOUR_API_KEY')
   print(client.health.check())
   ```

## License

This project is licensed under the [MIT License](./LICENSE).
## License

This project is licensed under the [MIT License](LICENSE).

## Running Tests

Install the optional test dependencies and run `pytest`:

```bash
pip install -e .[test]
pytest
```
