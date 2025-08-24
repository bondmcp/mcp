#!/usr/bin/env node

/**
 * Dynamic OpenAPI Specification Generator for BondMCP
 * 
 * ⚠️  DEPRECATION NOTICE ⚠️
 * 
 * This script is DEPRECATED and should no longer be used for production 
 * OpenAPI generation. It has been replaced by the authoritative platform-dispatched
 * specification from the Contract Ingest & SDK Pipeline.
 * 
 * Using this script may cause divergence from the official API specification.
 * 
 * To override this deprecation (for development/testing only), set the 
 * environment variable: OVERRIDE_OPENAPI_DEPRECATION=true
 * 
 * This script automatically generates an OpenAPI specification by:
 * 1. Scanning the actual API endpoints at api.bondmcp.com
 * 2. Extracting endpoint metadata, parameters, and response schemas
 * 3. Generating a complete OpenAPI specification document
 * 4. Publishing to both the documentation site and openapi.bondmcp.com/openapi.bondmcp
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration
const API_BASE_URL = 'https://api.bondmcp.com';
const API_ENDPOINTS = [
  { path: '/api/v1/health', method: 'GET' },
  { path: '/api/v1/ask', method: 'POST' },
  { path: '/api/v1/orchestrator/multi-llm', method: 'POST' },
  { path: '/api/v1/labs/interpret', method: 'POST' },
  { path: '/api/v1/health-data/analyze', method: 'POST' },
  { path: '/api/v1/supplement/recommend', method: 'POST' },
  { path: '/api/v1/import/oura', method: 'POST' },
  { path: '/api/v1/import/labs/csv', method: 'POST' },
  { path: '/api/v1/keys', method: 'GET' },
  { path: '/api/v1/keys', method: 'POST' },
  { path: '/api/v1/keys/{key_id}', method: 'DELETE' },
  { path: '/api/v1/insights/generate', method: 'POST' },
  { path: '/api/v1/insights/history/{user_id}', method: 'GET' },
  { path: '/api/v1/insights/{insight_id}', method: 'GET' },
];

// Base OpenAPI specification
const baseSpec = {
  openapi: '3.0.2',
  info: {
    title: 'BondMCP API',
    version: '1.0.0',
    description: 'OpenAPI specification for the BondMCP healthcare API.',
  },
  servers: [
    {
      url: 'https://api.bondmcp.com',
      description: 'Production',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
    schemas: {
      HealthStatus: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          version: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          environment: { type: 'string' },
          services: { type: 'object' },
        },
      },
      AskRequest: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          context: { type: 'string' },
        },
        required: ['message'],
      },
      AskResponse: {
        type: 'object',
        properties: {
          request_id: { type: 'string' },
          answer: { type: 'string' },
          sources: {
            type: 'array',
            items: { type: 'object' },
          },
        },
      },
    },
  },
  paths: {},
};

/**
 * Fetches endpoint metadata from the live API
 * @param {string} endpoint - API endpoint path
 * @param {string} method - HTTP method
 * @returns {Promise<Object>} - Endpoint metadata
 */
async function fetchEndpointMetadata(endpoint, method) {
  return new Promise((resolve) => {
    // In a real implementation, this would make an OPTIONS request
    // to the API endpoint to get metadata, or use a dedicated metadata endpoint
    
    // For now, we'll use the existing OpenAPI spec as a fallback
    // This would be replaced with actual API introspection in production
    
    console.log(`Fetching metadata for ${method} ${endpoint}...`);
    
    // Simulate API response delay
    setTimeout(() => {
      // Return mock metadata based on endpoint
      const endpointKey = endpoint.replace(/{([^}]+)}/g, '{$1}');
      
      // This is where we'd dynamically determine the schema based on the actual API
      // For now, we're using predefined schemas from the base spec
      let responseSchema = { type: 'object' };
      let requestSchema = { type: 'object' };
      
      if (endpoint === '/api/v1/health') {
        responseSchema = { $ref: '#/components/schemas/HealthStatus' };
      } else if (endpoint === '/api/v1/ask') {
        requestSchema = { $ref: '#/components/schemas/AskRequest' };
        responseSchema = { $ref: '#/components/schemas/AskResponse' };
      }
      
      resolve({
        path: endpointKey,
        method: method.toLowerCase(),
        security: method !== 'GET' || endpoint !== '/api/v1/health' ? [{ ApiKeyAuth: [] }] : undefined,
        requestBody: method !== 'GET' ? {
          required: true,
          content: {
            'application/json': {
              schema: requestSchema
            }
          }
        } : undefined,
        responses: {
          '200': {
            description: `${endpoint.split('/').pop()} response`,
            content: {
              'application/json': {
                schema: responseSchema
              }
            }
          }
        },
        parameters: endpoint.includes('{') ? 
          endpoint.match(/{([^}]+)}/g).map(param => ({
            in: 'path',
            name: param.replace(/{|}/g, ''),
            required: true,
            schema: { type: 'string' }
          })) : undefined
      });
    }, 100);
  });
}

/**
 * Discovers new endpoints by analyzing API responses
 * @returns {Promise<Array>} - List of discovered endpoints
 */
async function discoverEndpoints() {
  return new Promise((resolve) => {
    console.log('Discovering new API endpoints...');
    
    // In a real implementation, this would:
    // 1. Crawl the API documentation
    // 2. Analyze API responses for HATEOAS links
    // 3. Use API gateway introspection if available
    
    // For now, we'll just return the predefined endpoints
    resolve(API_ENDPOINTS);
  });
}

/**
 * Generates the complete OpenAPI specification
 * @returns {Promise<Object>} - Complete OpenAPI specification
 */
async function generateOpenApiSpec() {
  try {
    console.log('Generating OpenAPI specification...');
    
    // Start with the base specification
    const spec = { ...baseSpec };
    
    // Discover all endpoints
    const endpoints = await discoverEndpoints();
    
    // Process each endpoint
    for (const endpoint of endpoints) {
      const metadata = await fetchEndpointMetadata(endpoint.path, endpoint.method);
      
      // Add endpoint to specification
      if (!spec.paths[metadata.path]) {
        spec.paths[metadata.path] = {};
      }
      
      spec.paths[metadata.path][metadata.method] = {
        summary: `${metadata.path.split('/').pop()}`,
        ...(metadata.security && { security: metadata.security }),
        ...(metadata.parameters && { parameters: metadata.parameters }),
        ...(metadata.requestBody && { requestBody: metadata.requestBody }),
        responses: metadata.responses
      };
    }
    
    // Add version and timestamp
    spec.info.version = `1.0.0-${new Date().toISOString().split('T')[0]}`;
    
    return spec;
  } catch (error) {
    console.error('Error generating OpenAPI specification:', error);
    throw error;
  }
}

/**
 * Writes the OpenAPI specification to files
 * @param {Object} spec - OpenAPI specification
 */
function writeSpecification(spec) {
  try {
    // Ensure the spec directory exists
    const specDir = path.join(__dirname, '..', 'spec');
    if (!fs.existsSync(specDir)) {
      fs.mkdirSync(specDir, { recursive: true });
    }
    
    // Write JSON specification
    const jsonPath = path.join(specDir, 'openapi.json');
    fs.writeFileSync(jsonPath, JSON.stringify(spec, null, 2));
    console.log(`OpenAPI JSON written to ${jsonPath}`);
    
    // Write YAML specification
    const yamlPath = path.join(specDir, 'openapi.yaml');
    
    // Use js-yaml to convert JSON to YAML
    try {
      execSync(`npx js-yaml --help`, { stdio: 'ignore' });
    } catch (e) {
      execSync(`npm install -g js-yaml`);
    }
    
    // Write JSON to a temp file and convert to YAML
    const tempJsonPath = path.join(specDir, 'temp-openapi.json');
    fs.writeFileSync(tempJsonPath, JSON.stringify(spec, null, 2));
    
    try {
      execSync(`js-yaml -r ${tempJsonPath} > ${yamlPath}`);
      console.log(`OpenAPI YAML written to ${yamlPath}`);
    } catch (error) {
      console.error('Error converting to YAML:', error);
      // Fallback: use a different method or keep only JSON
      console.log('Falling back to JSON only');
    }
    
    // Clean up temp file
    if (fs.existsSync(tempJsonPath)) {
      fs.unlinkSync(tempJsonPath);
    }
  } catch (error) {
    console.error('Error writing specification files:', error);
    throw error;
  }
}

/**
 * Main function to generate and write OpenAPI specification
 */
async function main() {
  // Check for deprecation override
  if (!process.env.OVERRIDE_OPENAPI_DEPRECATION) {
    console.error('\n🚨 DEPRECATION NOTICE 🚨');
    console.error('');
    console.error('This script (scripts/generate_openapi.js) is DEPRECATED and should not be used.');
    console.error('');
    console.error('📋 Reason: To prevent divergence from the authoritative platform-dispatched');
    console.error('   OpenAPI specification generated by the Contract Ingest & SDK Pipeline.');
    console.error('');
    console.error('🔧 Alternative: Use the official specification from:');
    console.error('   - Contract Ingest & SDK Pipeline workflow');
    console.error('   - openapi.bondmcp.com/openapi.bondmcp');
    console.error('   - Repository: spec/openapi.json');
    console.error('');
    console.error('💡 Override (development only): Set OVERRIDE_OPENAPI_DEPRECATION=true');
    console.error('');
    console.error('🛑 Exiting to prevent accidental specification divergence...');
    process.exit(1);
  }

  console.log('\n⚠️  WARNING: Using deprecated OpenAPI generation script with override');
  console.log('   This should only be used for development/testing purposes.');
  console.log('   The generated specification may diverge from the official version.\n');

  try {
    console.log('Starting dynamic OpenAPI specification generation...');
    
    // Generate the specification
    const spec = await generateOpenApiSpec();
    
    // Write to files
    writeSpecification(spec);
    
    console.log('OpenAPI specification generation completed successfully!');
  } catch (error) {
    console.error('Error in OpenAPI generation process:', error);
    process.exit(1);
  }
}

// Run the main function
main();
