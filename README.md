# BondMCP - Healthcare Model Context Protocol

BondMCP provides a healthcare-optimized implementation of the Model Context Protocol (MCP), enabling secure and compliant AI integration with health data sources.

## Quick Start

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/bondmcp/mcp.git
cd mcp
```

2. Run the automated setup script:
```bash
./scripts/ONBOARDING-SETUP.sh
```

3. Configure your API key:
```bash
cp .env.example .env
```
Edit `.env` and set `BONDMCP_PUBLIC_API_KEY` and optional `BONDMCP_PUBLIC_API_BASE_URL`.

### Installation

```bash
# TypeScript/JavaScript
npm install @bondmcp/typescript-sdk

# Python
pip install bondmcp
```

The Python package was previously published as `bondmcp-sdk`. That legacy name
is still available on PyPI but is no longer maintained. Use `bondmcp` for new
projects.

### Basic Usage

```javascript
import { BondMCPClient } from '@bondmcp/typescript-sdk';

const client = new BondMCPClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.bondmcp.com'
});

// Ask a health question
const response = await client.ask({
  message: "What are the symptoms of high blood pressure?",
  context: "general-health"
});

console.log(response.answer);
```

### Docker Usage

Build the image and run the CLI without installing Python locally:

```bash
docker build -t bondmcp-cli .
docker run --rm -e BONDMCP_PUBLIC_API_KEY=YOUR_KEY bondmcp-cli ask "What are the symptoms of high blood pressure?"
```

## Features

- 🏥 **Healthcare-Optimized**: Built specifically for medical and health applications
- 🔒 **HIPAA Compliant**: Enterprise-grade security and compliance
- ⚡ **Fast Responses**: Sub-3 second response times
- 🎯 **High Accuracy**: 99.97% accuracy through multi-model consensus
- 🔧 **Easy Integration**: Simple SDK for multiple programming languages

## API Endpoints

### Health Chat
```
POST /api/v1/ask
```
Query the AI with health-related questions.

### Health Data Analysis
```
POST /api/v1/analyze
```
Analyze health data and receive insights.

For complete API documentation, visit [docs.bondmcp.com](https://docs.bondmcp.com).

The full OpenAPI specification for all endpoints is provided in
[`spec/openapi.yaml`](spec/openapi.yaml). You can generate client SDKs from the
specification using [OpenAPI Generator](https://openapi-generator.tech):

```bash
openapi-generator-cli generate -i spec/openapi.yaml -g python -o sdks/python
```

## SDKs

Our SDKs are now organized in a unified structure under the `sdks/` directory:

- [Python SDK](sdks/python/) - For Python applications
- [TypeScript/JavaScript SDK](sdks/typescript/) - For web and Node.js applications
- [Other Language SDKs](sdks/other-languages/) - Additional language implementations

For SDK version compatibility information, see [Version Compatibility](sdks/common/VERSION_COMPATIBILITY.md).

## Authentication

All SDKs use the `Authorization: Bearer {api_key}` header format for authentication. For detailed information on authentication methods and error handling, see [Authentication Methods](docs/AUTHENTICATION_METHODS.md).

## Development Requirements

Before contributing to this project, please review the [Environment Requirements](docs/ENVIRONMENT_REQUIREMENTS.md) for detailed information on required software, operating system compatibility, and hardware requirements.

## Examples

Run the sample programs in the `examples/` directory to see basic API usage:

```bash
# Python example
python examples/python_basic.py

# Node example
node examples/node_basic.js
```

Each example performs a simple health check and sends a question to the API. Replace
`YOUR_API_KEY` in the code with your actual key before running.

## Development Setup

This project uses [pre-commit](https://pre-commit.com) to run formatting and linting tools. After installing the development dependencies, install the pre-commit hooks:

```bash
pip install -e .[dev]
pre-commit install
```

## Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details on reporting issues, running tests, and submitting pull requests.

## Support

- 📖 [Documentation](https://docs.bondmcp.com)
- 💬 [Discord Community](https://discord.gg/bondmcp)
- 📧 [Email Support](mailto:support@bondmcp.com)

## License

MIT License - see [LICENSE](https://github.com/bondmcp/mcp/blob/main/LICENSE) for details.

---

**Disclaimer**: BondMCP is for informational purposes only and does not constitute medical advice. Always consult with healthcare professionals for medical decisions.
