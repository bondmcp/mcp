# BondMCP API Reference

Welcome to the comprehensive API reference for BondMCP - the premier healthcare Model Context Protocol. This documentation provides everything you need to integrate BondMCP into your applications quickly and effectively.

## Getting Started

- [Quick Start Guide](./quick-start.md) - Get up and running in under 5 minutes
- [Authentication](./authentication.md) - API key setup and management
- [Error Handling](./error-handling.md) - Common errors and resolution strategies
- [Rate Limiting](./rate-limiting.md) - Understanding usage limits and optimization

## Core Endpoints

| Endpoint | Description | Authentication |
|----------|-------------|----------------|
| [`/health`](./endpoints/health.md) | Health check and API status | None |
| [`/api/v1/orchestrator/multi-llm`](./endpoints/orchestrator.md) | Multi-model consensus | API Key |
| [`/api/v1/labs/interpret`](./endpoints/labs.md) | Lab result analysis | API Key |
| [`/api/v1/health-data/analyze`](./endpoints/health-data.md) | Health data insights | API Key |
| [`/api/v1/keys`](./endpoints/api-keys.md) | API key management | API Key |
| [`/api/v1/ask`](./endpoints/ask.md) | Health question answering | API Key |
| [`/api/v1/supplement/recommend`](./endpoints/supplement.md) | Supplement recommendations | API Key |
| [`/api/v1/import/oura`](./endpoints/import.md) | Import health device data | API Key |
| [`/api/v1/insights`](./endpoints/insights.md) | Generate health insights | API Key |

## SDK Integration

- [JavaScript/TypeScript SDK](../sdks/typescript/README.md)
- [Python SDK](../sdks/python/README.md)
- [Go SDK](../sdks/go/README.md)
- [Ruby SDK](../sdks/ruby/README.md)
- [Java SDK](../sdks/java/README.md)
- [C# SDK](../sdks/csharp/README.md)

## Integration Examples

- [React Web Application](../examples/react-web-app/README.md)
- [Node.js Backend](../examples/nodejs-backend/README.md)
- [Python Flask Application](../examples/python-flask/README.md)
- [Mobile Integration (React Native)](../examples/react-native/README.md)
- [Mobile Integration (Swift)](../examples/swift/README.md)
- [Mobile Integration (Kotlin)](../examples/kotlin/README.md)

## Advanced Topics

- [Webhook Configuration](./advanced/webhooks.md)
- [Multi-Model Consensus](./advanced/multi-model-consensus.md)
- [HIPAA Compliance](./advanced/hipaa-compliance.md)
- [Custom Tool Integration](./advanced/custom-tools.md)
- [Enterprise Integration](./advanced/enterprise.md)

## Support & Community

- [Troubleshooting Guide](./support/troubleshooting.md)
- [FAQ](./support/faq.md)
- [Community Examples](./support/community-examples.md)
- [Contributing](../CONTRIBUTING.md)

## API Changelog

See our [Changelog](../CHANGELOG.md) for API updates and new features.
