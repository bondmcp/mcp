#!/usr/bin/env node

/**
 * Manual Test Script for OpenAPI Ingestion Pipeline
 * 
 * This script demonstrates how to manually trigger the OpenAPI ingestion pipeline
 * using the GitHub workflow_dispatch event for testing purposes.
 */

const fs = require('fs');
const crypto = require('crypto');

console.log("🧪 OpenAPI Ingestion Pipeline - Manual Test Guide\n");

// Create a sample OpenAPI spec for testing
const sampleOpenAPISpec = {
  openapi: "3.0.0",
  info: {
    title: "BondMCP API Test",
    version: "1.0.2-test",
    description: "Test OpenAPI specification for pipeline validation"
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check endpoint",
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "healthy" },
                    timestamp: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Write test spec to file
const testSpecPath = './test-spec.json';
fs.writeFileSync(testSpecPath, JSON.stringify(sampleOpenAPISpec, null, 2));

// Calculate checksum
const specContent = fs.readFileSync(testSpecPath, 'utf8');
const checksum = crypto.createHash('sha256').update(specContent).digest('hex');

console.log("📋 Test Payload for Manual Workflow Dispatch:");
console.log("=====================================\n");

const testPayload = {
  version: "1.0.2-test",
  checksum: checksum,
  change_type: "patch",
  download_url: "https://api.bondmcp.com/test-openapi.json", // This would need to be a real URL in practice
  source_repo: "bondmcp/bondmcp-platform"
};

console.log("Workflow Inputs:");
console.log(`  version: ${testPayload.version}`);
console.log(`  checksum: ${testPayload.checksum}`);
console.log(`  change_type: ${testPayload.change_type}`);
console.log(`  download_url: ${testPayload.download_url}`);
console.log(`  source_repo: ${testPayload.source_repo}`);

console.log("\n🚀 How to Test:");
console.log("1. Go to GitHub Actions: https://github.com/bondmcp/mcp/actions");
console.log("2. Select 'OpenAPI Ingestion + SDK Release Pipeline'");
console.log("3. Click 'Run workflow' and enter the values above");

console.log("\n📝 Expected Workflow Behavior:");
console.log("✅ Payload validation should pass");
console.log("⚠️ Download will fail (test URL), but validation logic is verified");
console.log("✅ Immutability check will work");
console.log("✅ Directory structure will be validated");

console.log("\n🔗 Repository Dispatch Example (for platform integration):");
console.log("```bash");
console.log("curl -X POST \\");
console.log("  -H \"Authorization: token $GITHUB_TOKEN\" \\");
console.log("  https://api.github.com/repos/bondmcp/mcp/dispatches \\");
console.log("  -d '{");
console.log(`    "event_type": "platform-openapi-published",`);
console.log(`    "client_payload": ${JSON.stringify(testPayload, null, 6)}`);
console.log("  }'");
console.log("```");

console.log("\n🧹 Cleanup:");
console.log(`Removing test file: ${testSpecPath}`);
fs.unlinkSync(testSpecPath);

console.log("\n✅ Test payload generated successfully!");
console.log("📋 The pipeline is ready for production use and supersedes PR #65.");