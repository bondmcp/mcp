#!/usr/bin/env node

/**
 * Test script for OpenAPI Ingestion Pipeline
 * 
 * This script validates the payload validation logic used in the 
 * openapi-ingest.yml workflow.
 */

const fs = require('fs');
const path = require('path');

class PayloadValidator {
  static validatePayload(payload) {
    const errors = [];
    
    // Validate required fields
    if (!payload.version) {
      errors.push("'version' field is required");
    }
    
    if (!payload.checksum) {
      errors.push("'checksum' field is required");
    }
    
    if (!payload.change_type) {
      errors.push("'change_type' field is required");
    }
    
    if (!payload.download_url) {
      errors.push("'download_url' field is required");
    }
    
    if (!payload.source_repo) {
      errors.push("'source_repo' field is required");
    }
    
    // Validate version format (semantic versioning)
    if (payload.version && !/^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9\-\.]+)?(\+[a-zA-Z0-9\-\.]+)?$/.test(payload.version)) {
      errors.push("'version' must follow semantic versioning format");
    }
    
    // Validate checksum format (SHA256)
    if (payload.checksum && !/^[a-f0-9]{64}$/.test(payload.checksum)) {
      errors.push("'checksum' must be a valid SHA256 hash");
    }
    
    // Validate change_type
    if (payload.change_type && !['major', 'minor', 'patch'].includes(payload.change_type)) {
      errors.push("'change_type' must be one of: major, minor, patch");
    }
    
    // Validate download_url format
    if (payload.download_url && !/^https?:\/\//.test(payload.download_url)) {
      errors.push("'download_url' must be a valid HTTP/HTTPS URL");
    }
    
    // Validate source_repo format
    if (payload.source_repo && !/^[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+$/.test(payload.source_repo)) {
      errors.push("'source_repo' must be in format 'owner/repo'");
    }
    
    return errors;
  }
}

// Test cases
const testCases = [
  {
    name: "Valid payload",
    payload: {
      version: "1.2.3",
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      change_type: "minor",
      download_url: "https://api.bondmcp.com/openapi.json",
      source_repo: "bondmcp/bondmcp-platform"
    },
    expectedErrors: 0
  },
  {
    name: "Missing required fields",
    payload: {},
    expectedErrors: 5
  },
  {
    name: "Invalid version format",
    payload: {
      version: "1.2",
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      change_type: "minor",
      download_url: "https://api.bondmcp.com/openapi.json",
      source_repo: "bondmcp/bondmcp-platform"
    },
    expectedErrors: 1
  },
  {
    name: "Invalid checksum format",
    payload: {
      version: "1.2.3",
      checksum: "invalid-checksum",
      change_type: "minor",
      download_url: "https://api.bondmcp.com/openapi.json",
      source_repo: "bondmcp/bondmcp-platform"
    },
    expectedErrors: 1
  },
  {
    name: "Invalid change_type",
    payload: {
      version: "1.2.3",
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      change_type: "breaking",
      download_url: "https://api.bondmcp.com/openapi.json",
      source_repo: "bondmcp/bondmcp-platform"
    },
    expectedErrors: 1
  },
  {
    name: "Invalid URL format",
    payload: {
      version: "1.2.3",
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      change_type: "minor",
      download_url: "ftp://invalid.com/spec.json",
      source_repo: "bondmcp/bondmcp-platform"
    },
    expectedErrors: 1
  },
  {
    name: "Invalid source_repo format",
    payload: {
      version: "1.2.3",
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      change_type: "minor",
      download_url: "https://api.bondmcp.com/openapi.json",
      source_repo: "invalid-repo-format"
    },
    expectedErrors: 1
  }
];

// Run tests
console.log("🧪 Testing OpenAPI Ingestion Pipeline Payload Validation\n");

let passedTests = 0;
let totalTests = testCases.length;

for (const testCase of testCases) {
  const errors = PayloadValidator.validatePayload(testCase.payload);
  const passed = errors.length === testCase.expectedErrors;
  
  console.log(`${passed ? '✅' : '❌'} ${testCase.name}`);
  
  if (passed) {
    passedTests++;
  } else {
    console.log(`   Expected ${testCase.expectedErrors} errors, got ${errors.length}`);
    if (errors.length > 0) {
      console.log(`   Errors: ${errors.join(', ')}`);
    }
  }
  
  console.log();
}

console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log("🎉 All tests passed! Payload validation logic is working correctly.");
  process.exit(0);
} else {
  console.log("❌ Some tests failed. Please review the validation logic.");
  process.exit(1);
}