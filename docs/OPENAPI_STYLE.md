# OpenAPI Style Guide

This guide defines the conventions and best practices for OpenAPI specifications in the BondMCP project.

## General Principles

1. **Consistency**: Follow consistent naming and structure patterns
2. **Clarity**: Use descriptive names and comprehensive documentation
3. **Versioning**: Support backward compatibility when possible
4. **Security**: Include appropriate security definitions and requirements

## Naming Conventions

### Paths and Operations

```yaml
# ✅ Good: Use kebab-case for paths
/api/v1/user-profiles/{userId}
/api/v1/health-checks

# ❌ Bad: Mixed case or inconsistent patterns
/api/v1/userProfiles/{userId}
/api/v1/health_checks
```

### Operation IDs

```yaml
# ✅ Good: Use camelCase, descriptive operation names
operationId: getUserProfile
operationId: createHealthCheck
operationId: listUserProfiles

# ❌ Bad: Unclear or inconsistent naming
operationId: getUser
operationId: create_health_check
operationId: profiles
```

### Schema Names

```yaml
# ✅ Good: Use PascalCase for schema names
components:
  schemas:
    UserProfile:
      type: object
    HealthCheckResult:
      type: object

# ❌ Bad: Inconsistent casing
components:
  schemas:
    userProfile:
      type: object
    health_check_result:
      type: object
```

### Property Names

```yaml
# ✅ Good: Use camelCase for properties
properties:
  userId:
    type: string
  createdAt:
    type: string
    format: date-time
  isActive:
    type: boolean

# ❌ Bad: Inconsistent property naming
properties:
  user_id:
    type: string
  created_at:
    type: string
  IsActive:
    type: boolean
```

## API Versioning

### Version in Path

```yaml
# ✅ Good: Include version in path
servers:
  - url: https://api.bondmcp.com/v1
    description: Production API v1

paths:
  /users:
    get:
      # ...
```

### Version in Info

```yaml
# ✅ Good: Semantic versioning in info
info:
  title: BondMCP API
  version: 1.2.3
  description: The Trusted Protocol for Health AI
```

## Pagination Patterns

### Cursor-based Pagination (Recommended)

```yaml
parameters:
  - name: cursor
    in: query
    schema:
      type: string
    description: Cursor for pagination
  - name: limit
    in: query
    schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 20
    description: Maximum number of items to return

responses:
  "200":
    content:
      application/json:
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                $ref: "#/components/schemas/User"
            pagination:
              type: object
              properties:
                nextCursor:
                  type: string
                  nullable: true
                hasMore:
                  type: boolean
                totalCount:
                  type: integer
                  description: Approximate total count
```

### Offset-based Pagination (Alternative)

```yaml
parameters:
  - name: offset
    in: query
    schema:
      type: integer
      minimum: 0
      default: 0
  - name: limit
    in: query
    schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 20

responses:
  "200":
    content:
      application/json:
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                $ref: "#/components/schemas/User"
            meta:
              type: object
              properties:
                offset:
                  type: integer
                limit:
                  type: integer
                total:
                  type: integer
```

## Error Envelope

### Standard Error Format

```yaml
components:
  schemas:
    Error:
      type: object
      required:
        - error
      properties:
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
              description: Machine-readable error code
              example: VALIDATION_ERROR
            message:
              type: string
              description: Human-readable error message
              example: The provided email address is invalid
            details:
              type: object
              description: Additional error context
              additionalProperties: true
            traceId:
              type: string
              description: Request trace ID for debugging
              example: abc123-def456-ghi789

# Usage in responses
responses:
  "400":
    description: Bad Request
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/Error"
        example:
          error:
            code: VALIDATION_ERROR
            message: Validation failed
            details:
              field: email
              reason: Invalid email format
            traceId: req_abc123def456
```

### Error Codes

Use consistent, descriptive error codes:

```yaml
# ✅ Good: Descriptive error codes
- VALIDATION_ERROR
- AUTHENTICATION_REQUIRED
- RESOURCE_NOT_FOUND
- RATE_LIMIT_EXCEEDED
- INTERNAL_SERVER_ERROR

# ❌ Bad: Generic or unclear codes
- ERROR_001
- INVALID
- BAD_REQUEST
```

## Security Definitions

### API Key Authentication

```yaml
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
      description: API key for authentication

security:
  - ApiKeyAuth: []
```

### Bearer Token Authentication

```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token for authentication

security:
  - BearerAuth: []
```

## Response Patterns

### Success Responses

```yaml
# ✅ Good: Consistent response structure
responses:
  '200':
    description: Success
    content:
      application/json:
        schema:
          type: object
          properties:
            data:
              $ref: '#/components/schemas/User'
            meta:
              type: object
              properties:
                timestamp:
                  type: string
                  format: date-time
                requestId:
                  type: string

# ✅ Good: List responses
responses:
  '200':
    description: List of users
    content:
      application/json:
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                $ref: '#/components/schemas/User'
            pagination:
              $ref: '#/components/schemas/PaginationInfo'
```

### HTTP Status Codes

Use appropriate HTTP status codes:

```yaml
# ✅ Good: Appropriate status codes
responses:
  "200":
    description: Success (GET, PUT, PATCH)
  "201":
    description: Created (POST)
  "204":
    description: No Content (DELETE)
  "400":
    description: Bad Request
  "401":
    description: Unauthorized
  "403":
    description: Forbidden
  "404":
    description: Not Found
  "422":
    description: Unprocessable Entity (validation errors)
  "429":
    description: Too Many Requests
  "500":
    description: Internal Server Error
```

## Schema Design

### Required Fields

```yaml
# ✅ Good: Clearly define required fields
UserProfile:
  type: object
  required:
    - id
    - email
    - createdAt
  properties:
    id:
      type: string
      format: uuid
      description: Unique user identifier
    email:
      type: string
      format: email
      description: User's email address
    name:
      type: string
      description: User's display name
      nullable: true
    createdAt:
      type: string
      format: date-time
      description: When the user was created
```

### Data Types and Formats

```yaml
# ✅ Good: Use appropriate types and formats
properties:
  id:
    type: string
    format: uuid
  email:
    type: string
    format: email
  createdAt:
    type: string
    format: date-time
  birthDate:
    type: string
    format: date
  website:
    type: string
    format: uri
  phoneNumber:
    type: string
    pattern: '^\+[1-9]\d{1,14}$'
  age:
    type: integer
    minimum: 0
    maximum: 150
```

### Enums

```yaml
# ✅ Good: Use descriptive enum values
UserStatus:
  type: string
  enum:
    - active
    - inactive
    - suspended
    - pending_verification
  description: Current status of the user account

# ✅ Good: Document enum values
UserRole:
  type: string
  enum:
    - admin # Full system access
    - user # Standard user access
    - guest # Limited read-only access
  description: User role determining access permissions
```

## Deprecation Strategy

### Marking Deprecated Fields

```yaml
# ✅ Good: Use x-deprecated extension
properties:
  oldField:
    type: string
    description: Legacy field, use newField instead
    deprecated: true
    x-deprecated:
      since: "1.2.0"
      removeIn: "2.0.0"
      replacement: "newField"
      migrationGuide: "https://docs.bondmcp.com/migration/v2"
  newField:
    type: string
    description: Replacement for oldField
```

### Deprecating Endpoints

```yaml
# ✅ Good: Deprecate entire operations
/api/v1/legacy-endpoint:
  get:
    deprecated: true
    x-deprecated:
      since: "1.3.0"
      removeIn: "2.0.0"
      replacement: "/api/v1/new-endpoint"
    summary: "[DEPRECATED] Legacy endpoint"
    description: |
      This endpoint is deprecated and will be removed in v2.0.0.
      Use /api/v1/new-endpoint instead.

      Migration guide: https://docs.bondmcp.com/migration/legacy-endpoint
```

## Documentation Standards

### Operation Descriptions

```yaml
# ✅ Good: Comprehensive operation documentation
get:
  summary: Get user profile
  description: |
    Retrieves the profile information for a specific user.

    This endpoint returns public profile data including the user's
    display name, avatar, and public settings. Private information
    such as email addresses are only returned for the authenticated
    user's own profile.
  operationId: getUserProfile
  tags:
    - Users
```

### Parameter Documentation

```yaml
# ✅ Good: Document all parameters
parameters:
  - name: userId
    in: path
    required: true
    schema:
      type: string
      format: uuid
    description: |
      The unique identifier for the user. Must be a valid UUID.
    example: "123e4567-e89b-12d3-a456-426614174000"
  - name: includePrivate
    in: query
    schema:
      type: boolean
      default: false
    description: |
      Whether to include private profile information. Only works
      when requesting your own profile.
```

### Examples

```yaml
# ✅ Good: Provide realistic examples
components:
  schemas:
    UserProfile:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        email:
          type: string
          format: email
      example:
        id: "123e4567-e89b-12d3-a456-426614174000"
        name: "John Doe"
        email: "john.doe@example.com"
```

## Validation and Linting

### Required Spectral Rules

The following Spectral rules are enforced:

- `operation-description`: All operations must have descriptions
- `operation-summary`: All operations must have summaries
- `operation-tags`: All operations must have tags
- `path-description`: All paths should have descriptions
- `info-description`: API info must have description
- `info-contact`: API info must have contact information
- `tag-description`: All tags must have descriptions

### Custom Validation

Additional validation checks:

- All schemas must have examples
- All error responses must use standard error format
- All list endpoints must include pagination
- All operations must have appropriate security requirements

## Tools and Automation

### Linting

```bash
# Run Spectral linting
npm run spec:lint

# Bundle and validate
npm run spec:bundle
```

### SDK Generation

The spec must be compatible with OpenAPI Generator for:

- TypeScript (typescript-axios generator)
- Python (python generator)
- Go (go generator)

### Testing

Validate your spec changes:

```bash
# Check diff against main
npm run spec:diff

# Verify SDK generation
npm run sdk:verify
```

For questions about OpenAPI style and conventions, refer to the [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3) or open an issue in the repository.
