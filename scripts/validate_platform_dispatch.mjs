#!/usr/bin/env node

/**
 * Platform Dispatch Validation Script
 * 
 * Validates repository_dispatch payloads from bondmcp-platform before
 * triggering SDK regeneration. Ensures strict schema validation for
 * inbound repository_dispatch events.
 */

import fs from 'fs';
import crypto from 'crypto';
import { URL } from 'url';

const VALID_CHANGE_TYPES = ['major', 'minor', 'patch'];
const EXPECTED_SOURCE_REPO = 'bondmcp-platform';
const SHA256_HEX_LENGTH = 64;

/**
 * Validates semver format
 */
function validateSemver(version) {
  const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  return semverRegex.test(version);
}

/**
 * Validates SHA256 checksum format
 */
function validateChecksum(checksum) {
  if (typeof checksum !== 'string') return false;
  if (checksum.length !== SHA256_HEX_LENGTH) return false;
  return /^[a-f0-9]{64}$/i.test(checksum);
}

/**
 * Validates HTTPS URL format
 */
function validateHttpsUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates platform dispatch payload schema
 */
function validatePayload(payload) {
  const errors = [];
  
  // Check required keys
  const requiredKeys = ['version', 'checksum', 'change_type', 'download_url'];
  for (const key of requiredKeys) {
    if (!(key in payload)) {
      errors.push(`Missing required key: ${key}`);
    }
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  // Validate version (semver)
  if (!validateSemver(payload.version)) {
    errors.push(`Invalid version format: ${payload.version} (must be valid semver)`);
  }
  
  // Validate checksum (sha256 hex 64 chars)
  if (!validateChecksum(payload.checksum)) {
    errors.push(`Invalid checksum format: ${payload.checksum} (must be 64-char SHA256 hex)`);
  }
  
  // Validate change_type
  if (!VALID_CHANGE_TYPES.includes(payload.change_type)) {
    errors.push(`Invalid change_type: ${payload.change_type} (must be one of: ${VALID_CHANGE_TYPES.join(', ')})`);
  }
  
  // Validate download_url (https)
  if (!validateHttpsUrl(payload.download_url)) {
    errors.push(`Invalid download_url: ${payload.download_url} (must be valid HTTPS URL)`);
  }
  
  // Validate source_repo (if provided)
  if ('source_repo' in payload && payload.source_repo !== EXPECTED_SOURCE_REPO) {
    // Only error if STRICT_DISPATCH_SOURCE is enabled
    if (process.env.STRICT_DISPATCH_SOURCE === '1') {
      errors.push(`Invalid source_repo: ${payload.source_repo} (expected: ${EXPECTED_SOURCE_REPO})`);
    } else {
      console.warn(`⚠️ Warning: Unexpected source_repo: ${payload.source_repo} (expected: ${EXPECTED_SOURCE_REPO})`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Read and parse JSON payload from file or STDIN
 */
async function readPayload(source) {
  let content;
  
  if (source === '-' || !source) {
    // Read from STDIN
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    content = Buffer.concat(chunks).toString();
  } else {
    // Read from file
    if (!fs.existsSync(source)) {
      throw new Error(`File not found: ${source}`);
    }
    content = fs.readFileSync(source, 'utf8');
  }
  
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}

/**
 * Main validation function
 */
async function main() {
  const args = process.argv.slice(2);
  const source = args[0] || '-'; // Default to STDIN
  
  try {
    console.log('🔍 Validating platform dispatch payload...');
    console.log(`📥 Source: ${source === '-' ? 'STDIN' : source}`);
    
    const payload = await readPayload(source);
    
    console.log('📋 Payload received:');
    console.log(JSON.stringify(payload, null, 2));
    
    const validation = validatePayload(payload);
    
    if (validation.valid) {
      console.log('✅ Payload validation passed!');
      console.log('');
      console.log('📊 Validated fields:');
      console.log(`   Version: ${payload.version} (${payload.change_type})`);
      console.log(`   Checksum: ${payload.checksum}`);
      console.log(`   Download URL: ${payload.download_url}`);
      if (payload.source_repo) {
        console.log(`   Source Repository: ${payload.source_repo}`);
      }
      
      // TODO: Add signature verification when sigstore/cosign is implemented
      // console.log('🔐 TODO: Signature verification (sigstore/cosign)');
      
      process.exit(0);
    } else {
      console.error('❌ Payload validation failed!');
      console.error('');
      console.error('🚫 Validation errors:');
      validation.errors.forEach(error => {
        console.error(`   • ${error}`);
      });
      console.error('');
      console.error('📋 Required payload format:');
      console.error('   {');
      console.error('     "version": "1.0.0",           // Valid semver');
      console.error('     "checksum": "sha256_hash",    // 64-char SHA256 hex');
      console.error('     "change_type": "minor",       // major|minor|patch');
      console.error('     "download_url": "https://...", // Valid HTTPS URL');
      console.error('     "source_repo": "bondmcp-platform" // Optional');
      console.error('   }');
      console.error('');
      console.error('🔧 Environment variables:');
      console.error('   STRICT_DISPATCH_SOURCE=1  // Enforce source_repo validation');
      
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during validation:', error.message);
    process.exit(1);
  }
}

// Export for testing
export { validatePayload, validateSemver, validateChecksum, validateHttpsUrl };

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}