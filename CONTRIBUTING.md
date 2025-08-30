# Contributing to BondMCP

Welcome to the BondMCP project! We appreciate your interest in contributing. This guide will help you understand our development process, coding standards, and how to submit contributions effectively.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contract Change Workflow](#contract-change-workflow)
- [Code Style & Standards](#code-style--standards)
- [Testing Guidelines](#testing-guidelines)
- [Submission Process](#submission-process)
- [Review Process](#review-process)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+ and pip
- Git
- Basic understanding of OpenAPI/Swagger specifications

### Development Tools

Install development dependencies:

```bash
# Node.js dependencies
npm install

# Python dependencies (for SDK testing)
pip install -r requirements-dev.txt

# Global tools
npm install -g @redocly/cli @openapitools/openapi-generator-cli
```

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bondmcp/mcp.git
   cd mcp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify setup**:
   ```bash
   npm test
   npm run openapi:validate
   ```

4. **Run quality checks**:
   ```bash
   node scripts/check_legacy_quarantine.js
   node scripts/validate_openapi.mjs openapi/bondmcp.v1.yaml
   ```

## Contract Change Workflow

When making changes that affect the OpenAPI specification or API contracts, follow this workflow:

### Classification of Changes

Understanding change types helps determine the required process:

| Change Type | Description | Version Impact | Process Required |
|-------------|-------------|----------------|------------------|
| **Patch** | Bug fixes, documentation updates | `x.y.Z` | Standard review |
| **Minor** | New endpoints, optional fields | `x.Y.0` | Enhanced review + migration notes |
| **Major** | Breaking changes, removed fields | `X.0.0` | Full review + migration guide + stakeholder approval |

### Step-by-Step Process

#### 1. Planning Phase
- [ ] Identify the type of change (patch/minor/major)
- [ ] Check if change affects existing integrations
- [ ] Review existing patterns and consistency requirements
- [ ] Plan backwards compatibility strategy (if applicable)

#### 2. Implementation Phase

##### For OpenAPI Specification Changes:

```bash
# 1. Edit the specification
vim openapi/bondmcp.v1.yaml

# 2. Validate changes
npm run openapi:validate
node scripts/validate_openapi.mjs openapi/bondmcp.v1.yaml

# 3. Generate diff (if comparing to existing version)
node scripts/generate_spec_diff.mjs 1.0.0 1.1.0

# 4. Update examples and documentation
# Edit files in docs/api-reference/
# Update Postman collection if needed
```

##### For Breaking Changes:

```bash
# 1. Create migration guide
mkdir -p MIGRATIONS
cat > MIGRATIONS/1.0.0-to-2.0.0.md << 'EOF'
# Migration Guide: 1.0.0 to 2.0.0

## Breaking Changes
- Describe what changed
- Explain impact on existing code

## Migration Steps
1. Update client code to handle new response format
2. Test with new API version
3. Deploy changes
EOF

# 2. Update changelog
node scripts/update_changelog.mjs 2.0.0 major --breaking --migration MIGRATIONS/1.0.0-to-2.0.0.md

# 3. Add deprecation warnings (if applicable)
# Update spec with deprecated: true for removed endpoints
```

#### 3. Testing Phase

```bash
# 1. Validate specification
npm run openapi:validate

# 2. Run contract tests
npm run test:contract

# 3. Test SDK generation (if available)
npm run sdk:generate

# 4. Manual API testing
npm run openapi:mock  # Start mock server for testing
```

#### 4. Documentation Phase

- [ ] Update API reference documentation
- [ ] Add/update code examples
- [ ] Update integration guides
- [ ] Refresh Postman collection
- [ ] Update SDK documentation (if auto-generated)

### Required Artifacts by Change Type

#### Patch Changes
- [ ] Updated specification
- [ ] Validation passing
- [ ] Basic testing completed

#### Minor Changes
- [ ] Updated specification
- [ ] New examples added
- [ ] Integration guide updated
- [ ] Changelog entry
- [ ] Migration notes (if any compatibility concerns)

#### Major Changes
- [ ] Updated specification
- [ ] Comprehensive migration guide
- [ ] Deprecation strategy documented
- [ ] Stakeholder approval obtained
- [ ] Detailed changelog entry
- [ ] Updated examples and integration guides
- [ ] SDK impact assessment

## Code Style & Standards

### OpenAPI Specification Standards

1. **Naming Conventions**:
   - Use kebab-case for endpoint paths: `/api/v1/health-data`
   - Use camelCase for property names: `userId`, `createdAt`
   - Use PascalCase for schema names: `UserProfile`, `HealthData`

2. **Documentation**:
   - Every endpoint must have a clear description
   - All parameters must be documented
   - Response schemas must include examples
   - Error responses must be documented

3. **Consistency**:
   - Follow existing patterns for authentication
   - Use standard HTTP status codes
   - Maintain consistent error response format
   - Follow RESTful conventions

### Example Good Specification:

```yaml
/api/v1/health-data:
  post:
    summary: Analyze health data
    description: |
      Analyzes uploaded health data and provides insights and recommendations.
      Supports various data formats including CSV, JSON, and direct device imports.
    operationId: analyzeHealthData
    tags:
      - Health Data
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/HealthDataRequest'
          example:
            dataType: "bloodwork"
            values: [
              { "metric": "cholesterol", "value": 180, "unit": "mg/dL" }
            ]
    responses:
      '200':
        description: Analysis completed successfully
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HealthDataAnalysis'
      '400':
        $ref: '#/components/responses/BadRequest'
      '401':
        $ref: '#/components/responses/Unauthorized'
```

### Script Development Standards

1. **File Organization**:
   - Use `.mjs` extension for ES modules
   - Include proper shebang: `#!/usr/bin/env node`
   - Make scripts executable: `chmod +x script.mjs`

2. **Error Handling**:
   - Always validate inputs
   - Provide clear error messages
   - Use appropriate exit codes
   - Include help text

3. **Documentation**:
   - Include header comment explaining purpose
   - Document function parameters and return values
   - Provide usage examples

## Testing Guidelines

### Contract Testing

```bash
# Validate OpenAPI specification
npm run openapi:validate

# Run schema validation tests
npm run test:contract

# Test against live API (staging)
npm run test:contract -- --base-url https://staging-api.bondmcp.com
```

### SDK Testing

```bash
# Generate SDKs and test
npm run sdk:generate
npm run sdk:test

# Test specific SDK
cd sdks/typescript && npm test
cd sdks/python && python -m pytest
```

### Integration Testing

```bash
# Start mock server
npm run openapi:mock

# Run integration tests against mock
npm run test:integration

# Test with real API (requires auth)
API_KEY=your_key npm run test:integration:real
```

## Submission Process

### 1. Create Feature Branch

```bash
git checkout -b feature/add-new-endpoint
# or
git checkout -b fix/correct-response-schema
# or  
git checkout -b docs/update-integration-guide
```

### 2. Make Changes

Follow the contract change workflow above, ensuring all required artifacts are created.

### 3. Quality Checks

```bash
# Run all quality checks
npm run lint
npm run test
npm run openapi:validate
node scripts/check_legacy_quarantine.js

# For contract changes, also run:
npm run test:contract
```

### 4. Commit Changes

Use conventional commit format:

```bash
git commit -m "feat: add health data analysis endpoint

- Add POST /api/v1/health-data/analyze endpoint
- Include request/response schemas
- Add examples and documentation
- Update Postman collection

Closes #123"
```

### 5. Create Pull Request

- Use the PR template (automatically loaded)
- Fill out all relevant sections, especially OpenAPI contract impact
- Include testing evidence (screenshots, test output)
- Link to related issues

## Review Process

### Review Checklist

**For all PRs:**
- [ ] Code quality and style compliance
- [ ] Test coverage adequate
- [ ] Documentation updated
- [ ] No security vulnerabilities introduced

**For contract changes:**
- [ ] OpenAPI specification valid
- [ ] Changes follow established patterns
- [ ] Breaking changes properly documented
- [ ] Migration guide accurate and complete
- [ ] Backwards compatibility considered
- [ ] SDK impact assessed

### Review Timeline

- **Standard PRs**: 1-2 business days
- **Minor contract changes**: 2-3 business days
- **Major contract changes**: 1 week (includes stakeholder review)

### Approval Requirements

- **Patch changes**: 1 maintainer approval
- **Minor changes**: 2 maintainer approvals
- **Major changes**: 2 maintainer approvals + platform team approval

## Getting Help

### Resources

- **Documentation**: [docs/integration-lifecycle.md](docs/integration-lifecycle.md)
- **Runbook**: [docs/runbooks/sdk-release.md](docs/runbooks/sdk-release.md)
- **Examples**: [docs/openapi-examples.md](docs/openapi-examples.md)
- **ADR Documents**: [docs/ADR-002-automated-openapi-pipeline.md](docs/ADR-002-automated-openapi-pipeline.md)

### Support Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Slack**: #mcp-development (internal contributors)
- **Email**: dev-team@bondmcp.com

### Common Issues

1. **OpenAPI validation fails**: Check YAML syntax and required fields
2. **SDK generation fails**: Ensure specification follows OpenAPI 3.1 standards
3. **Contract tests fail**: Verify response schemas match specification
4. **Legacy script resurrection**: Run quarantine check and move script back

## Recognition

Contributors who make significant improvements to the API, documentation, or tooling will be recognized in our changelog and may be invited to join the maintainer team.

---

Thank you for contributing to BondMCP! Your efforts help make our API better for everyone.