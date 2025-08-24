# Changelog

## [1.0.1] - 2025-08-23

### API Changes
- Updated to OpenAPI specification version 1.0.1
- Added new `/api/v1/symptoms` endpoint for symptom analysis
- See `MIGRATIONS/1.0.0-to-1.0.1.md` for migration guide
- View semantic diff in `openapi/history/diff-1.0.0-to-1.0.1.md`

### SDK Updates
- TypeScript SDK (@bondmcp/sdk) version 1.0.1
- Python SDK (bondmcp_sdk) version 1.0.1



All notable changes to the BondMCP Python SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

