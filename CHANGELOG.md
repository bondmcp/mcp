# Changelog

All notable changes to the BondMCP platform and SDKs will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-08-24

### Added
- **MCP Discovery Endpoints**: New `/.well-known/mcp-configuration` and `/.well-known/mcp-manifest.json` endpoints for dynamic capability discovery
- **MCP Component Schemas**: Added `MCPConfiguration`, `MCPCapability`, and `MCPManifest` schemas for structured capability management
- **Bearer Authentication**: Added `BearerAuth` security scheme supporting JWT tokens alongside existing API key authentication
- **Standardized Error Envelope**: Implemented consistent error response format with `{ "error": { "code": string, "message": string } }` structure
- **Rate Limit Header Exposure**: All responses now include standardized rate limiting headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`)
- **Capability Versioning**: Introduced `:v1` suffix policy for endpoint versioning with deprecation tracking
- **Cryptographic Verification**: SHA256 hashes for capability integrity verification
- **Comprehensive MCP Documentation**: Added detailed guides for MCP overview and consuming capabilities with language-specific examples

### Changed
- **OpenAPI Version**: Bumped specification version from 1.0.0 to 2.1.0
- **SDK Versions**: Updated JavaScript and Python SDKs to version 2.1.0 for alignment with MCP features
- **Error Handling**: Enhanced error responses for auth endpoints with standardized envelope format

### Enhanced
- **Discovery Flow**: Applications can now dynamically discover available endpoints instead of hardcoding endpoint lists
- **Integration Patterns**: Improved support for future-proof integrations with automatic capability detection
- **Security**: Added manifest hash verification for automated clients to detect potential tampering

### Backward Compatibility
- All existing endpoints and schemas remain unchanged - this is an additive-only release
- Existing API key authentication continues to work alongside new bearer token support
- Success response formats are unchanged; only error response format standardization may affect error handling code

## [1.0.0] - 2025-06-03

### Added
- Complete Python SDK with comprehensive API coverage
- CLI tool with health endpoint testing
- Support for all 30+ BondMCP API endpoints
- Multi-model AI consensus integration
- HIPAA-compliant security practices
- Comprehensive error handling and type hints
- Modern build system with hatchling
- Development tools configuration (black, isort, mypy, pytest)
- Comprehensive documentation and examples

### Fixed
- pyproject.toml syntax errors preventing installation
- Package metadata and versioning issues
- Build backend compatibility for editable installs
- Missing dependencies in CLI optional extras

### Changed
- Upgraded to modern hatchling build backend
- Improved package metadata and classifiers
- Enhanced error handling with specific exception types
- Better type hints and documentation
- Optimized package structure and imports

### Security
- Secure API key handling with keyring support
- Proper authentication headers and timeout handling
- Input validation and sanitization

## [0.1.0] - 2025-06-02

### Added
- Initial SDK implementation
- Basic CLI functionality
- Core API client with authentication
- Health, Labs, Supplements, and Wearables resources
- Basic error handling

### Known Issues
- Package installation issues due to pyproject.toml syntax errors
- Missing package metadata
- Build backend limitations

