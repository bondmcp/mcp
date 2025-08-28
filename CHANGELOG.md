# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- OpenAPI change management workflows with diff guard
- Automated SDK regeneration on specification changes
- Spectral linting and schema validation
- Semver enforcement based on API change classification
- Pre-commit hooks for specification validation
- Comprehensive documentation for API change process

### Changed

- Enhanced contributing guidelines with spec change workflow
- Updated package scripts for OpenAPI operations

## [0.1.0] - 2025-01-23

### Added

- Initial project setup
- Basic OpenAPI contract ingestion pipeline
- TypeScript, Python, and Go SDK scaffolding
- Contract normalization and preflight scripts
- Repository dispatch workflows for automated ingestion

### Security

- Preflight checks to prevent duplicate package publications
- Secure token management for publishing workflows
