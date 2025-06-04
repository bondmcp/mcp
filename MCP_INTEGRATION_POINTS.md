# BondMCP MCP Integration Points

## Overview

This document identifies the optimal integration points for implementing Model Context Protocol (MCP) capabilities in the existing BondMCP platform. The analysis is based on a thorough review of the current codebase, infrastructure, and AI capabilities.

## Existing MCP-Related Components

The BondMCP platform already has several components that provide a foundation for MCP integration:

1. **LangChain Integration**: The platform uses LangChain extensively for AI model interactions, agent creation, and tool integration.

2. **AWS Bedrock Integration**: The platform leverages AWS Bedrock for accessing AI models like Claude and has an ensemble approach for model selection.

3. **MCP Directory Structure**: An empty `mcp` directory already exists in `src/`, indicating preparation for MCP integration.

4. **Extended LangChain MCP File**: The `langchain_openrouter_mcp_extended.py` file suggests initial work on MCP integration.

5. **Tool-Based Architecture**: The existing agent setup already implements a tool-based approach similar to MCP's design.

## Optimal Integration Points

### 1. Backend MCP Server Framework

**Integration Point**: `bondmcp-platform/backend/src/app/services/`

**Existing Components to Leverage**:
- `llm_service.py`: Already handles model selection and ensemble responses
- Agent setup code with tool integration
- AWS Bedrock integration for model access

**Implementation Approach**:
- Create a new `mcp_service.py` that builds on the existing LLM service
- Implement MCP protocol handlers that map to existing tool functionality
- Extend the current ensemble model approach to support MCP-based requests
- Reuse existing AWS Bedrock integration for model access

### 2. Healthcare-Specific MCP Servers

**Integration Point**: `bondmcp-platform/backend/src/app/services/mcp/`

**Existing Components to Leverage**:
- Lab interpretation services
- Health data processing
- Wearable data integration

**Implementation Approach**:
- Create specialized MCP servers for each healthcare domain:
  - `lab_results_server.py`: Expose lab interpretation functionality
  - `vitals_server.py`: Provide access to vital signs data
  - `wearables_server.py`: Interface with wearable device data
  - `supplements_server.py`: Expose supplement recommendations
- Map MCP capabilities to existing API endpoints

### 3. Frontend MCP Client Integration

**Integration Point**: `bondmcp-platform/src/mcp/`

**Existing Components to Leverage**:
- Existing AI chat components
- Frontend services for API access
- Authentication and user management

**Implementation Approach**:
- Implement MCP client interfaces in the existing empty `mcp` directory
- Create React hooks for MCP integration (`useMcpClient`, `useMcpServer`)
- Add MCP capability discovery to the frontend
- Extend existing chat interfaces to support MCP interactions

### 4. SDK Extensions

**Integration Point**: `mcp/bondmcp_sdk/`

**Existing Components to Leverage**:
- Existing SDK client
- Enhanced client with integration helpers
- Webhook and batch processing functionality

**Implementation Approach**:
- Add MCP client classes to the SDK
- Create helper functions for common MCP interactions
- Implement MCP server discovery and capability listing
- Provide example implementations for different languages

### 5. Authentication and Security Integration

**Integration Point**: `bondmcp-platform/backend/auth-service.js` and `security.js`

**Existing Components to Leverage**:
- AWS Cognito integration
- API key management
- Role-based access control

**Implementation Approach**:
- Extend authentication to include MCP-specific roles and permissions
- Implement secure token handling for MCP communications
- Add audit logging for MCP interactions
- Create role mappings between clinical roles and MCP permissions

### 6. API Gateway Integration

**Integration Point**: `bondmcp-platform/backend/main.py`

**Existing Components to Leverage**:
- Existing API routes and handlers
- OpenAPI documentation
- Rate limiting and throttling

**Implementation Approach**:
- Add MCP-specific API endpoints
- Implement MCP server discovery endpoint
- Create capability listing endpoint
- Add health check endpoints for MCP servers

### 7. Documentation Integration

**Integration Point**: `bondmcp-platform/backend/documentation-service.js`

**Existing Components to Leverage**:
- Existing documentation system
- API documentation generator
- Developer guides

**Implementation Approach**:
- Add MCP-specific documentation
- Create tutorials for MCP integration
- Document available MCP servers and capabilities
- Provide code examples for different languages

## Technical Implementation Details

### 1. MCP Protocol Handler

**File**: `bondmcp-platform/backend/src/app/services/mcp/protocol_handler.py`

**Purpose**: Implement the core MCP protocol handling logic

**Key Functions**:
- `handle_request`: Process incoming MCP requests
- `discover_capabilities`: List available MCP capabilities
- `route_to_server`: Route requests to appropriate MCP servers
- `format_response`: Format responses according to MCP specification

### 2. MCP Server Registry

**File**: `bondmcp-platform/backend/src/app/services/mcp/server_registry.py`

**Purpose**: Manage registration and discovery of MCP servers

**Key Functions**:
- `register_server`: Register a new MCP server
- `list_servers`: List all available MCP servers
- `get_server`: Get a specific MCP server by ID
- `get_server_capabilities`: Get capabilities of a specific server

### 3. Healthcare MCP Servers

**Files**:
- `bondmcp-platform/backend/src/app/services/mcp/servers/lab_results_server.py`
- `bondmcp-platform/backend/src/app/services/mcp/servers/vitals_server.py`
- `bondmcp-platform/backend/src/app/services/mcp/servers/wearables_server.py`
- `bondmcp-platform/backend/src/app/services/mcp/servers/supplements_server.py`

**Purpose**: Implement domain-specific MCP servers

**Common Interface**:
- `get_capabilities`: List server capabilities
- `handle_request`: Process server-specific requests
- `validate_request`: Validate incoming requests
- `format_response`: Format domain-specific responses

### 4. MCP Client SDK

**Files**:
- `mcp/bondmcp_sdk/mcp_client.py`
- `mcp/bondmcp_sdk/mcp_server_discovery.py`

**Purpose**: Provide client-side SDK for MCP integration

**Key Functions**:
- `discover_servers`: Discover available MCP servers
- `get_server_capabilities`: Get capabilities of a specific server
- `send_request`: Send a request to an MCP server
- `handle_response`: Process response from an MCP server

### 5. Frontend MCP Integration

**Files**:
- `bondmcp-platform/src/mcp/hooks/useMcpClient.ts`
- `bondmcp-platform/src/mcp/components/McpServerSelector.tsx`
- `bondmcp-platform/src/mcp/components/McpCapabilityExplorer.tsx`

**Purpose**: Provide frontend components for MCP integration

**Key Functions**:
- `useMcpClient`: React hook for MCP client integration
- `McpServerSelector`: Component for selecting MCP servers
- `McpCapabilityExplorer`: Component for exploring MCP capabilities

## API Endpoints

### 1. MCP Discovery Endpoint

**Path**: `/api/v1/mcp/servers`

**Method**: `GET`

**Purpose**: List all available MCP servers

**Response**:
```json
{
  "servers": [
    {
      "id": "lab-results",
      "name": "Lab Results Server",
      "description": "Process and interpret lab results",
      "version": "1.0.0"
    },
    {
      "id": "vitals",
      "name": "Vitals Server",
      "description": "Access and interpret vital signs data",
      "version": "1.0.0"
    }
  ]
}
```

### 2. MCP Capability Endpoint

**Path**: `/api/v1/mcp/servers/{server_id}/capabilities`

**Method**: `GET`

**Purpose**: List capabilities of a specific MCP server

**Response**:
```json
{
  "server_id": "lab-results",
  "capabilities": [
    {
      "id": "interpret-labs",
      "name": "Interpret Lab Results",
      "description": "Interpret lab results and provide insights",
      "parameters": {
        "labs": {
          "type": "object",
          "description": "Lab results data"
        }
      }
    }
  ]
}
```

### 3. MCP Request Endpoint

**Path**: `/api/v1/mcp/servers/{server_id}/request`

**Method**: `POST`

**Purpose**: Send a request to an MCP server

**Request Body**:
```json
{
  "capability_id": "interpret-labs",
  "parameters": {
    "labs": {
      "glucose": 120,
      "cholesterol": 180
    }
  }
}
```

**Response**:
```json
{
  "server_id": "lab-results",
  "capability_id": "interpret-labs",
  "result": {
    "interpretation": "Glucose levels are slightly elevated...",
    "recommendations": [
      "Consider reducing sugar intake",
      "Increase physical activity"
    ]
  }
}
```

## Integration with Existing AWS Infrastructure

### 1. AWS Bedrock Integration

The MCP implementation will leverage the existing AWS Bedrock integration for model access:

- Use the current ensemble model approach for MCP-based requests
- Maintain the same model selection logic
- Preserve the existing authentication and security measures

### 2. AWS API Gateway Integration

The MCP endpoints will be exposed through the existing AWS API Gateway:

- Add new routes for MCP-specific endpoints
- Maintain the same authentication and authorization
- Apply the same rate limiting and throttling policies

### 3. AWS Lambda Integration

The MCP server implementations will be deployed as AWS Lambda functions:

- Create new Lambda functions for MCP servers
- Integrate with existing logging and monitoring
- Maintain the same deployment and scaling policies

## Security Considerations

### 1. Authentication and Authorization

- Extend the existing authentication system to include MCP-specific roles
- Implement fine-grained access control for MCP capabilities
- Ensure secure token handling for MCP communications

### 2. Data Protection

- Implement end-to-end encryption for MCP communications
- Apply data minimization principles
- Ensure HIPAA compliance for healthcare data

### 3. Audit and Logging

- Implement comprehensive audit logging for MCP interactions
- Track all requests and responses
- Monitor for suspicious activity

## Next Steps

1. Implement the core MCP protocol handler
2. Create the MCP server registry
3. Implement the first healthcare-specific MCP server (Lab Results)
4. Add MCP client SDK extensions
5. Create frontend components for MCP integration
6. Add MCP-specific documentation
7. Deploy and test the MCP implementation
