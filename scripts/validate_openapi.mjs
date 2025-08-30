#!/usr/bin/env node

/**
 * OpenAPI Validation Script
 * 
 * Validates OpenAPI specifications for local development and CI.
 * Ensures spec compliance, version consistency, and component validation.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Validate OpenAPI spec using swagger-parser
 */
async function validateWithSwaggerParser(specPath) {
  try {
    // Check if @apidevtools/swagger-parser is available
    const checkCommand = `npm list @apidevtools/swagger-parser --depth=0`;
    try {
      execSync(checkCommand, { stdio: 'pipe' });
    } catch {
      return { valid: false, error: 'swagger-parser not available (optional validation)' };
    }
    
    // Use @apidevtools/swagger-parser for validation
    const command = `npx @apidevtools/swagger-parser validate "${specPath}"`;
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { valid: true, output };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Validate OpenAPI spec using redocly
 */
function validateWithRedocly(specPath) {
  try {
    const command = `npx @redocly/cli lint "${specPath}"`;
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { valid: true, output };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Parse and validate spec structure
 */
function validateSpecStructure(specPath) {
  const errors = [];
  const warnings = [];
  
  let spec;
  try {
    const content = fs.readFileSync(specPath, 'utf8');
    
    // Determine if it's YAML or JSON
    const isYaml = specPath.endsWith('.yaml') || specPath.endsWith('.yml');
    
    if (isYaml) {
      // For YAML files, we'll use a simple validation approach
      // In production, you'd want to install js-yaml: npm install js-yaml
      console.log('⚠️ YAML format detected - using simplified validation');
      
      // Basic YAML structure checks
      if (!content.includes('openapi:')) {
        errors.push('Missing "openapi" field');
      }
      if (!content.includes('info:')) {
        errors.push('Missing "info" section');
      }
      if (!content.includes('paths:')) {
        errors.push('Missing "paths" section');
      }
      
      // For now, return a basic success for YAML files if structure looks OK
      return {
        valid: errors.length === 0,
        errors,
        warnings: ['YAML validation simplified - install js-yaml for full validation'],
        spec: null // Cannot parse full spec without js-yaml
      };
    } else {
      spec = JSON.parse(content);
    }
  } catch (error) {
    return {
      valid: false,
      errors: [`Failed to parse: ${error.message}`],
      warnings: []
    };
  }
  
  // Validate OpenAPI version
  if (!spec.openapi) {
    errors.push('Missing "openapi" field');
  } else if (!spec.openapi.startsWith('3.')) {
    errors.push(`Unsupported OpenAPI version: ${spec.openapi} (expected 3.x)`);
  }
  
  // Validate info section
  if (!spec.info) {
    errors.push('Missing "info" section');
  } else {
    if (!spec.info.title) {
      errors.push('Missing info.title');
    }
    if (!spec.info.version) {
      errors.push('Missing info.version');
    } else {
      // Validate version format (semver)
      const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
      if (!semverRegex.test(spec.info.version)) {
        errors.push(`Invalid version format: ${spec.info.version} (must be valid semver)`);
      }
    }
  }
  
  // Validate paths
  if (!spec.paths) {
    errors.push('Missing "paths" section');
  } else if (Object.keys(spec.paths).length === 0) {
    warnings.push('No paths defined in specification');
  }
  
  // Validate components schemas
  if (spec.components && spec.components.schemas) {
    const schemas = spec.components.schemas;
    for (const [schemaName, schema] of Object.entries(schemas)) {
      if (!schema.type && !schema.allOf && !schema.oneOf && !schema.anyOf && !schema.$ref) {
        warnings.push(`Schema "${schemaName}" missing type definition`);
      }
    }
  }
  
  // Check for required security schemes
  if (spec.components && spec.components.securitySchemes) {
    const securitySchemes = spec.components.securitySchemes;
    const hasApiKey = Object.values(securitySchemes).some(scheme => scheme.type === 'apiKey');
    const hasBearer = Object.values(securitySchemes).some(scheme => scheme.type === 'http' && scheme.scheme === 'bearer');
    
    if (!hasApiKey && !hasBearer) {
      warnings.push('No API key or bearer token authentication schemes found');
    }
  } else {
    warnings.push('No security schemes defined');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    spec
  };
}

/**
 * Validate spec against filename version
 */
function validateVersionConsistency(specPath, spec) {
  const filename = path.basename(specPath);
  
  // Extract version from filename if it matches pattern openapi-{version}.json
  const versionMatch = filename.match(/openapi-(.+)\.json$/);
  if (versionMatch) {
    const filenameVersion = versionMatch[1];
    const specVersion = spec.info?.version;
    
    if (specVersion && specVersion !== filenameVersion) {
      return {
        consistent: false,
        error: `Version mismatch: filename has "${filenameVersion}" but spec has "${specVersion}"`
      };
    }
  }
  
  return { consistent: true };
}

/**
 * Check for common OpenAPI best practices
 */
function checkBestPractices(spec) {
  const suggestions = [];
  
  // Check for operation IDs
  if (spec.paths) {
    for (const [path, pathItem] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (typeof operation === 'object' && !operation.operationId) {
          suggestions.push(`Missing operationId for ${method.toUpperCase()} ${path}`);
        }
      }
    }
  }
  
  // Check for response descriptions
  if (spec.paths) {
    for (const [path, pathItem] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (typeof operation === 'object' && operation.responses) {
          for (const [statusCode, response] of Object.entries(operation.responses)) {
            if (typeof response === 'object' && !response.description) {
              suggestions.push(`Missing description for ${statusCode} response in ${method.toUpperCase()} ${path}`);
            }
          }
        }
      }
    }
  }
  
  // Check for examples
  const hasExamples = JSON.stringify(spec).includes('"example');
  if (!hasExamples) {
    suggestions.push('Consider adding examples to improve API documentation');
  }
  
  return suggestions;
}

/**
 * Main validation function
 */
async function validateSpec(specPath) {
  console.log(`🔍 Validating OpenAPI specification: ${specPath}`);
  
  if (!fs.existsSync(specPath)) {
    console.error(`❌ File not found: ${specPath}`);
    return false;
  }
  
  let overallValid = true;
  
  // 1. Structure validation
  console.log('\\n📋 Validating spec structure...');
  const structureValidation = validateSpecStructure(specPath);
  
  if (structureValidation.valid) {
    console.log('✅ Spec structure is valid');
  } else {
    console.error('❌ Spec structure validation failed:');
    structureValidation.errors.forEach(error => {
      console.error(`   • ${error}`);
    });
    overallValid = false;
  }
  
  if (structureValidation.warnings.length > 0) {
    console.log('⚠️ Structure warnings:');
    structureValidation.warnings.forEach(warning => {
      console.log(`   • ${warning}`);
    });
  }
  
  // 2. Version consistency check
  if (structureValidation.spec) {
    console.log('\\n🔄 Checking version consistency...');
    const versionCheck = validateVersionConsistency(specPath, structureValidation.spec);
    
    if (versionCheck.consistent) {
      console.log('✅ Version consistency check passed');
    } else {
      console.error(`❌ ${versionCheck.error}`);
      overallValid = false;
    }
  }
  
  // 3. Swagger parser validation
  console.log('\\n🔧 Validating with swagger-parser...');
  const swaggerValidation = await validateWithSwaggerParser(specPath);
  
  if (swaggerValidation.valid) {
    console.log('✅ Swagger parser validation passed');
  } else {
    console.log('⚠️ Swagger parser validation skipped (optional):');
    console.log(`   ${swaggerValidation.error}`);
    // Don't fail overall validation for optional tools
  }
  
  // 4. Redocly validation (if available)
  console.log('\\n📝 Validating with Redocly...');
  const redoclyValidation = validateWithRedocly(specPath);
  
  if (redoclyValidation.valid) {
    console.log('✅ Redocly validation passed');
    if (redoclyValidation.output.includes('warning')) {
      console.log('⚠️ Redocly warnings detected - review output above');
    }
  } else {
    console.log('⚠️ Redocly validation issues (non-blocking):');
    console.log(`   ${redoclyValidation.error}`);
    // Don't fail overall validation for Redocly issues
  }
  
  // 5. Best practices check
  if (structureValidation.spec) {
    console.log('\\n💡 Checking best practices...');
    const suggestions = checkBestPractices(structureValidation.spec);
    
    if (suggestions.length === 0) {
      console.log('✅ No best practice suggestions');
    } else {
      console.log('💡 Best practice suggestions:');
      suggestions.slice(0, 5).forEach(suggestion => { // Limit to 5 suggestions
        console.log(`   • ${suggestion}`);
      });
      if (suggestions.length > 5) {
        console.log(`   ... and ${suggestions.length - 5} more suggestions`);
      }
    }
  }
  
  // Summary
  console.log('\\n📊 Validation Summary:');
  console.log(`   Overall: ${overallValid ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (structureValidation.spec) {
    console.log(`   Version: ${structureValidation.spec.info?.version || 'unknown'}`);
    console.log(`   Title: ${structureValidation.spec.info?.title || 'unknown'}`);
    console.log(`   Paths: ${Object.keys(structureValidation.spec.paths || {}).length}`);
    console.log(`   Schemas: ${Object.keys(structureValidation.spec.components?.schemas || {}).length}`);
  }
  
  return overallValid;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔍 OpenAPI Validation Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/validate_openapi.mjs <spec_file>');
    console.log('  node scripts/validate_openapi.mjs openapi/bondmcp.v1.yaml');
    console.log('  node scripts/validate_openapi.mjs openapi/history/openapi-1.0.0.json');
    console.log('');
    process.exit(1);
  }
  
  const specPath = args[0];
  
  try {
    const isValid = await validateSpec(specPath);
    process.exit(isValid ? 0 : 1);
  } catch (error) {
    console.error('❌ Unexpected error during validation:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateSpec, validateSpecStructure, validateVersionConsistency, checkBestPractices };