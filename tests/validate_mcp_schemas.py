#!/usr/bin/env python3
"""
JSON Schema validation test for MCP schemas in OpenAPI specification.
This test validates that the new MCP schemas are properly defined and can be validated.
"""

import json
import os
import sys
from typing import Dict, Any

def load_openapi_spec() -> Dict[str, Any]:
    """Load the OpenAPI specification."""
    spec_path = os.path.join(os.path.dirname(__file__), '..', 'spec', 'openapi.json')
    
    try:
        with open(spec_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: OpenAPI spec not found at {spec_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in OpenAPI spec: {e}")
        sys.exit(1)

def validate_mcp_schemas(spec: Dict[str, Any]) -> bool:
    """Validate that MCP schemas are present and properly structured."""
    schemas = spec.get('components', {}).get('schemas', {})
    
    required_schemas = [
        'MCPConfiguration',
        'MCPCapability', 
        'MCPManifest',
        'ErrorEnvelope'
    ]
    
    missing_schemas = []
    for schema_name in required_schemas:
        if schema_name not in schemas:
            missing_schemas.append(schema_name)
    
    if missing_schemas:
        print(f"❌ Missing required schemas: {missing_schemas}")
        return False
    
    print("✅ All required MCP schemas present")
    
    # Validate MCPConfiguration schema structure
    mcp_config = schemas['MCPConfiguration']
    required_props = ['service', 'auth', 'capabilities', 'updated_at']
    config_props = mcp_config.get('properties', {})
    
    missing_props = [prop for prop in required_props if prop not in config_props]
    if missing_props:
        print(f"❌ MCPConfiguration missing required properties: {missing_props}")
        return False
    
    print("✅ MCPConfiguration schema structure valid")
    
    # Validate MCPCapability schema structure
    mcp_capability = schemas['MCPCapability']
    required_cap_props = ['id', 'method', 'path', 'name', 'auth_required']
    cap_props = mcp_capability.get('properties', {})
    
    missing_cap_props = [prop for prop in required_cap_props if prop not in cap_props]
    if missing_cap_props:
        print(f"❌ MCPCapability missing required properties: {missing_cap_props}")
        return False
    
    print("✅ MCPCapability schema structure valid")
    
    # Validate ErrorEnvelope schema structure
    error_envelope = schemas['ErrorEnvelope']
    error_props = error_envelope.get('properties', {})
    if 'error' not in error_props:
        print("❌ ErrorEnvelope missing 'error' property")
        return False
    
    error_obj = error_props['error'].get('properties', {})
    if not all(prop in error_obj for prop in ['code', 'message']):
        print("❌ ErrorEnvelope.error missing required 'code' or 'message' properties")
        return False
    
    print("✅ ErrorEnvelope schema structure valid")
    
    return True

def validate_mcp_endpoints(spec: Dict[str, Any]) -> bool:
    """Validate that MCP discovery endpoints are present."""
    paths = spec.get('paths', {})
    
    required_endpoints = [
        '/.well-known/mcp-configuration',
        '/.well-known/mcp-manifest.json'
    ]
    
    missing_endpoints = []
    for endpoint in required_endpoints:
        if endpoint not in paths:
            missing_endpoints.append(endpoint)
    
    if missing_endpoints:
        print(f"❌ Missing required MCP endpoints: {missing_endpoints}")
        return False
    
    print("✅ All required MCP discovery endpoints present")
    
    # Validate that endpoints reference the correct schemas
    config_endpoint = paths['/.well-known/mcp-configuration']
    if 'get' not in config_endpoint:
        print("❌ MCP configuration endpoint missing GET method")
        return False
    
    config_response = config_endpoint['get'].get('responses', {}).get('200', {})
    config_schema_ref = config_response.get('content', {}).get('application/json', {}).get('schema', {}).get('$ref')
    
    if config_schema_ref != '#/components/schemas/MCPConfiguration':
        print(f"❌ MCP configuration endpoint schema reference incorrect: {config_schema_ref}")
        return False
    
    print("✅ MCP configuration endpoint properly references MCPConfiguration schema")
    
    return True

def validate_security_schemes(spec: Dict[str, Any]) -> bool:
    """Validate that both ApiKeyAuth and BearerAuth are present."""
    security_schemes = spec.get('components', {}).get('securitySchemes', {})
    
    required_schemes = ['ApiKeyAuth', 'BearerAuth']
    missing_schemes = [scheme for scheme in required_schemes if scheme not in security_schemes]
    
    if missing_schemes:
        print(f"❌ Missing required security schemes: {missing_schemes}")
        return False
    
    # Validate BearerAuth structure
    bearer_auth = security_schemes['BearerAuth']
    if bearer_auth.get('type') != 'http' or bearer_auth.get('scheme') != 'bearer':
        print("❌ BearerAuth security scheme improperly configured")
        return False
    
    print("✅ Both ApiKeyAuth and BearerAuth security schemes present and valid")
    return True

def validate_version_bump(spec: Dict[str, Any]) -> bool:
    """Validate that the version has been bumped to 2.1.0."""
    version = spec.get('info', {}).get('version')
    
    if version != '2.1.0':
        print(f"❌ Version not updated to 2.1.0, found: {version}")
        return False
    
    print("✅ OpenAPI specification version correctly set to 2.1.0")
    return True

def main():
    """Run all validation tests."""
    print("🔍 Validating MCP OpenAPI specification...")
    print("=" * 50)
    
    # Load the OpenAPI specification
    spec = load_openapi_spec()
    
    # Run validation tests
    tests = [
        validate_version_bump,
        validate_security_schemes,
        validate_mcp_schemas,
        validate_mcp_endpoints
    ]
    
    all_passed = True
    for test in tests:
        try:
            if not test(spec):
                all_passed = False
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {e}")
            all_passed = False
        print()  # Add spacing between tests
    
    print("=" * 50)
    if all_passed:
        print("🎉 All MCP validation tests passed!")
        sys.exit(0)
    else:
        print("💥 Some MCP validation tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()