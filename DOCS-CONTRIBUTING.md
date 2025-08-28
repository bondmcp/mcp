# API Documentation Contributing Guide

This guide covers how to contribute to the BondMCP API documentation and manage API changes.

## Overview

The BondMCP API follows a contract-first approach using OpenAPI 3.1 specifications. All API changes should be made to the OpenAPI specification first, then implemented in the backend.

## Repository Structure

```
├── openapi/
│   ├── bondmcp.v1.yaml          # Main OpenAPI 3.1 specification
│   ├── bundled.yaml             # Generated bundled specification
│   └── history/                 # Historical versions and diffs
├── packages/
│   └── sdk-ts/                  # TypeScript SDK
├── python/                      # Python SDK (generated)
├── go/                         # Go SDK (generated)
├── sdk-generator/
│   └── config/                 # SDK generation configurations
├── docs/
│   └── api/                    # Generated documentation
└── .changeset/                 # Version management
```

## Making API Changes

### 1. Before Making Changes

1. **Understand the Impact**: Consider backwards compatibility and breaking changes
2. **Check Existing Issues**: Look for related feature requests or bug reports
3. **Discuss Major Changes**: Create an issue for significant API changes

### 2. Making Changes to the OpenAPI Specification

1. **Clone and Branch**:
   ```bash
   git clone https://github.com/bondmcp/mcp.git
   cd mcp
   git checkout -b feature/your-api-change
   ```

2. **Edit the Specification**:
   - Main spec file: `openapi/bondmcp.v1.yaml`
   - Follow OpenAPI 3.1 standards
   - Include comprehensive examples
   - Add proper descriptions and documentation

3. **Validate Your Changes**:
   ```bash
   pnpm install
   pnpm openapi:validate
   pnpm openapi:lint
   ```

4. **Test the Specification**:
   ```bash
   # Start mock server for testing
   pnpm openapi:mock
   
   # Generate documentation to preview
   pnpm docs:build
   ```

### 3. Types of Changes

#### Adding New Endpoints

1. Add the new path and operations to the `paths` section
2. Define request/response schemas in `components.schemas`
3. Use appropriate HTTP methods and status codes
4. Include comprehensive examples
5. Add proper security requirements

Example:
```yaml
/health/wellness-score:
  post:
    tags:
      - Health AI
    summary: Calculate wellness score
    description: Calculate overall wellness score based on health metrics
    operationId: calculateWellnessScore
    security:
      - ApiKeyAuth: []
      - BearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/WellnessScoreRequest"
    responses:
      "200":
        description: Wellness score calculated successfully
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/WellnessScoreResponse"
```

#### Modifying Existing Endpoints

1. **Non-breaking changes** (safe):
   - Adding optional properties to request schemas
   - Adding new response properties
   - Adding new optional query parameters
   - Adding new response status codes

2. **Breaking changes** (require major version bump):
   - Removing endpoints or operations
   - Removing request/response properties
   - Making optional properties required
   - Changing property types or formats
   - Changing response status codes

#### Adding New Schemas

1. Add schemas to `components.schemas`
2. Use descriptive names and comprehensive documentation
3. Include examples for all properties
4. Use appropriate types, formats, and validation rules

Example:
```yaml
WellnessScoreRequest:
  type: object
  required:
    - metrics
  properties:
    metrics:
      type: object
      description: Health metrics for wellness calculation
      properties:
        steps:
          type: integer
          minimum: 0
          description: Daily step count
          example: 8500
        sleepHours:
          type: number
          minimum: 0
          maximum: 24
          description: Hours of sleep
          example: 7.5
        heartRate:
          type: integer
          minimum: 30
          maximum: 220
          description: Resting heart rate (BPM)
          example: 65
    timeframe:
      type: string
      enum: [daily, weekly, monthly]
      default: daily
      description: Timeframe for wellness calculation
      example: "daily"
```

### 4. Version Management

#### Semantic Versioning

- **Major** (2.0.0): Breaking changes
- **Minor** (1.1.0): New features, backwards compatible
- **Patch** (1.0.1): Bug fixes, documentation updates

#### Creating Changesets

After making changes, create a changeset:

```bash
pnpm changeset
```

Select the appropriate packages and change type:
- Choose `@bondmcp/sdk` for SDK changes
- Select `major` for breaking changes, `minor` for new features, `patch` for fixes
- Write a clear description of the changes

#### Breaking Changes

For breaking changes:

1. **Document the breaking change** in the changeset description
2. **Create migration documentation** in `MIGRATIONS/` directory
3. **Update examples** to reflect the new API
4. **Consider backwards compatibility** options

### 5. Documentation Standards

#### OpenAPI Documentation

- **Comprehensive descriptions**: Every operation, parameter, and schema should have clear descriptions
- **Examples**: Include realistic examples for all request/response schemas
- **Error scenarios**: Document all possible error responses
- **Security**: Clearly specify authentication requirements

#### Schema Documentation

```yaml
HealthQuestionRequest:
  type: object
  required:
    - message
  properties:
    message:
      type: string
      description: The health question to ask the AI
      minLength: 1
      maxLength: 1000
      example: "What are the early symptoms of diabetes?"
    context:
      type: object
      description: Additional context to improve AI response accuracy
      properties:
        age:
          type: integer
          minimum: 0
          maximum: 150
          description: Patient age in years
          example: 35
        symptoms:
          type: array
          items:
            type: string
          description: Current symptoms being experienced
          example: ["increased thirst", "frequent urination"]
```

#### Operation Documentation

```yaml
/health/ask:
  post:
    tags:
      - Health AI
    summary: Ask health question
    description: |
      Submit a health-related question to the AI system and receive 
      evidence-based medical information. The AI provides educational 
      content and should not replace professional medical advice.
      
      **Rate Limits**: 
      - Free tier: 10 requests/hour
      - Pro tier: 100 requests/hour
      
      **Response Time**: Typically 2-5 seconds
    operationId: askHealthQuestion
    # ... rest of operation
```

### 6. Testing and Validation

#### Local Testing

1. **Validate specification**:
   ```bash
   pnpm openapi:validate
   ```

2. **Run linting**:
   ```bash
   pnpm openapi:lint
   ```

3. **Start mock server**:
   ```bash
   pnpm openapi:mock
   # Test endpoints at http://localhost:4010
   ```

4. **Generate documentation**:
   ```bash
   pnpm docs:build
   # View at docs/api/v1/index.html
   ```

#### Contract Testing

Run contract tests against the specification:

```bash
# Install Schemathesis
pip install schemathesis

# Run contract tests
pnpm test:contract
```

### 7. Pull Request Process

1. **Create Pull Request**:
   - Use descriptive title and description
   - Reference related issues
   - Include changeset files

2. **PR Checklist**:
   - [ ] OpenAPI specification passes validation
   - [ ] No breaking changes without version bump
   - [ ] Comprehensive documentation added
   - [ ] Examples included for new schemas
   - [ ] Changeset created
   - [ ] Migration guide added (if breaking changes)

3. **Automated Checks**:
   - OpenAPI validation
   - Breaking change detection
   - Documentation generation
   - Security scanning

### 8. After Merge

After your PR is merged:

1. **SDKs are automatically regenerated** from the updated specification
2. **New package versions are published** based on changesets
3. **Documentation is updated** and deployed
4. **Contract tests run** against staging environment

## Best Practices

### API Design

1. **RESTful principles**: Use appropriate HTTP methods and status codes
2. **Consistent naming**: Use camelCase for properties, kebab-case for endpoints
3. **Comprehensive error handling**: Return meaningful error messages
4. **Pagination**: Use consistent pagination patterns for list endpoints
5. **Filtering and sorting**: Provide flexible query options

### Schema Design

1. **Reusable components**: Create reusable schemas for common patterns
2. **Validation rules**: Include appropriate constraints and formats
3. **Optional vs required**: Carefully consider which fields are required
4. **Extensibility**: Design schemas to accommodate future additions

### Security

1. **Authentication**: Clearly specify security requirements
2. **Authorization**: Document required permissions
3. **Data validation**: Include proper input validation
4. **Error messages**: Don't leak sensitive information in errors

## Common Issues and Solutions

### Validation Errors

**Issue**: `Property 'nullable' is not expected here`
**Solution**: In OpenAPI 3.1, use `type: [string, "null"]` or `anyOf` instead of `nullable`

**Issue**: `Operation must have at least one 4XX response`
**Solution**: Add appropriate error responses to all operations

**Issue**: `Component is never used`
**Solution**: Ensure all defined schemas are referenced in the specification

### Breaking Changes

**Issue**: Accidentally introduced breaking changes
**Solution**: 
1. Revert the breaking change if possible
2. Or create a major version changeset
3. Add migration documentation

### Documentation Issues

**Issue**: Generated documentation is unclear
**Solution**:
1. Add more detailed descriptions
2. Include comprehensive examples
3. Document all possible response scenarios

## Support and Resources

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions or discuss API design
- **Documentation**: [BondMCP API Docs](https://www.bondmcp.com/docs)
- **OpenAPI Specification**: [OpenAPI 3.1 Documentation](https://spec.openapis.org/oas/v3.1.0)

## Contact

For questions about API development:
- Email: api-team@bondmcp.com
- Slack: #api-development
- GitHub: Create an issue or discussion