# BondMCP CLI

This package provides a simple command line interface for the public BondMCP API.

## Installation

```bash
pip install bondmcp-cli
```

Alternatively, clone this repository and install locally:

```bash
pip install -e .
```

## Configuration

Set your API key and base URL (if different) via environment variables:

```bash
export BONDMCP_PUBLIC_API_KEY="<your key>"
export BONDMCP_PUBLIC_API_BASE_URL="https://api.bondmcp.com"  # optional
```

## Usage

Run a query against the `/ask` endpoint:

```bash
bondmcp-cli ask "What are the latest health insights?"
```

The command prints the response text.
