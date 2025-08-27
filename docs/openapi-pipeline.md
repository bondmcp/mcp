# OpenAPI Pipeline

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
