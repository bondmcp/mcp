#!/usr/bin/env node

/**
 * CI Guard Script: Prevent Legacy OpenAPI Generator Resurrection
 * 
 * This script ensures that the deprecated OpenAPI generator is not modified
 * outside of the legacy directory, preventing accidental resurrection of
 * deprecated functionality.
 */

const fs = require('fs');
const path = require('path');

const LEGACY_DIR = 'legacy/openapi-generator';
const LEGACY_SCRIPT = 'generate_openapi.js';
const ROOT_SCRIPTS_DIR = 'scripts';

function checkLegacyQuarantine() {
  console.log('🔍 Checking legacy OpenAPI generator quarantine...');
  
  let hasViolations = false;
  
  // Check if legacy script exists in root scripts directory
  const rootScriptPath = path.join(ROOT_SCRIPTS_DIR, LEGACY_SCRIPT);
  if (fs.existsSync(rootScriptPath)) {
    console.error(`❌ VIOLATION: Legacy script found in root scripts directory: ${rootScriptPath}`);
    console.error('   The deprecated generate_openapi.js must remain in legacy/openapi-generator/');
    hasViolations = true;
  }
  
  // Check if legacy script exists in legacy directory (should exist)
  const legacyScriptPath = path.join(LEGACY_DIR, LEGACY_SCRIPT);
  if (!fs.existsSync(legacyScriptPath)) {
    console.error(`❌ VIOLATION: Legacy script missing from quarantine: ${legacyScriptPath}`);
    console.error('   The deprecated script should be preserved in the legacy directory');
    hasViolations = true;
  }
  
  // Check for any new openapi generation scripts in root scripts directory
  if (fs.existsSync(ROOT_SCRIPTS_DIR)) {
    const scriptsFiles = fs.readdirSync(ROOT_SCRIPTS_DIR, { withFileTypes: true });
    
    for (const file of scriptsFiles) {
      if (file.isFile() && file.name.includes('generate') && file.name.includes('openapi')) {
        console.error(`❌ VIOLATION: New OpenAPI generation script detected: ${path.join(ROOT_SCRIPTS_DIR, file.name)}`);
        console.error('   Use the repository_dispatch workflow instead (.github/workflows/openapi-ingestion.yml)');
        hasViolations = true;
      }
    }
  }
  
  if (hasViolations) {
    console.error('');
    console.error('🚫 Legacy quarantine violations detected!');
    console.error('');
    console.error('📋 Required actions:');
    console.error('   1. Move any OpenAPI generation scripts to legacy/openapi-generator/');
    console.error('   2. Use the new repository_dispatch workflow instead');
    console.error('   3. See docs/ADR-002-automated-openapi-pipeline.md for migration guide');
    console.error('');
    console.error('💡 For emergency use only: OVERRIDE_OPENAPI_DEPRECATION=true');
    console.error('');
    process.exit(1);
  }
  
  console.log('✅ Legacy quarantine intact - no violations detected');
}

function main() {
  try {
    checkLegacyQuarantine();
    console.log('');
    console.log('🎉 Legacy OpenAPI generator quarantine check passed!');
  } catch (error) {
    console.error('❌ Error during quarantine check:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkLegacyQuarantine };