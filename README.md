# BondMCP - Healthcare Model Context Protocol

BondMCP provides a healthcare-optimized implementation of the Model Context Protocol (MCP), enabling secure and compliant AI integration with health data sources.

## Quick Start

### Installation

```bash
npm install @bondmcp/typescript-sdk
# or
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

- [TypeScript/JavaScript SDK](https://docs.bondmcp.com/sdks/typescript)
- [Go SDK](https://docs.bondmcp.com/sdks/go)
- [Python SDK](https://docs.bondmcp.com/sdks/python)

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

## Support

- 📖 [Documentation](https://docs.bondmcp.com)
- 💬 [Discord Community](https://discord.gg/bondmcp)
- 📧 [Email Support](mailto:support@bondmcp.com)

## License

MIT License - see [LICENSE](https://github.com/bondmcp/mcp/blob/main/LICENSE) for details.

---

**Disclaimer**: BondMCP is for informational purposes only and does not constitute medical advice. Always consult with healthcare professionals for medical decisions.
