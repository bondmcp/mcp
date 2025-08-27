#!/usr/bin/env node

/**
 * OpenAPI Specification Normalizer
 * 
 * This script normalizes OpenAPI specifications for diff stability by:
 * 1. Recursively sorting object keys
 * 2. Removing ephemeral/volatile metadata fields
 * 3. Ensuring consistent formatting
 * 
 * Used by the contract ingestion pipeline to create stable diffs
 * between OpenAPI specification versions.
 */

import * as fs from 'fs';
import * as path from 'path';

interface OpenAPISpec {
  [key: string]: any;
}

/**
 * Fields to remove from the specification as they are volatile/ephemeral
 */
const VOLATILE_FIELDS = [
  'x-generated-at',
  'x-timestamp', 
  'x-build-time',
  'x-commit-sha',
  'x-pipeline-id',
  'x-generation-timestamp'
];

/**
 * Recursively sorts object keys and removes volatile fields
 * @param obj - Object to normalize
 * @returns Normalized object with sorted keys
 */
function normalizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => normalizeObject(item));
  }
  
  if (typeof obj !== 'object') {
    return obj;
  }
  
  const normalized: any = {};
  const sortedKeys = Object.keys(obj).sort();
  
  for (const key of sortedKeys) {
    // Skip volatile fields
    if (VOLATILE_FIELDS.includes(key)) {
      continue;
    }
    
    normalized[key] = normalizeObject(obj[key]);
  }
  
  return normalized;
}

/**
 * Removes version-specific volatile metadata from info section
 * @param spec - OpenAPI specification
 * @returns Spec with cleaned info section
 */
function cleanInfoSection(spec: OpenAPISpec): OpenAPISpec {
  if (spec.info) {
    const cleanedInfo = { ...spec.info };
    
    // Remove build-specific version suffixes (e.g., "1.0.0-2025-08-23" -> "1.0.0")
    if (cleanedInfo.version && typeof cleanedInfo.version === 'string') {
      cleanedInfo.version = cleanedInfo.version.replace(/-\d{4}-\d{2}-\d{2}.*$/, '');
    }
    
    // Remove volatile fields from info section
    VOLATILE_FIELDS.forEach(field => {
      delete cleanedInfo[field];
    });
    
    spec.info = cleanedInfo;
  }
  
  return spec;
}

/**
 * Main normalization function
 * @param inputPath - Path to input OpenAPI specification file
 * @param outputPath - Optional output path (defaults to overwriting input)
 */
function normalizeSpec(inputPath: string, outputPath?: string): void {
  try {
    console.log(`Normalizing OpenAPI specification: ${inputPath}`);
    
    // Read the specification file
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file does not exist: ${inputPath}`);
    }
    
    const fileContent = fs.readFileSync(inputPath, 'utf8');
    let spec: OpenAPISpec;
    
    try {
      spec = JSON.parse(fileContent);
    } catch (parseError: any) {
      throw new Error(`Failed to parse JSON: ${parseError.message}`);
    }
    
    // Clean version-specific metadata
    spec = cleanInfoSection(spec);
    
    // Normalize the entire specification
    const normalizedSpec = normalizeObject(spec);
    
    // Determine output path
    const finalOutputPath = outputPath || inputPath;
    
    // Write the normalized specification
    fs.writeFileSync(finalOutputPath, JSON.stringify(normalizedSpec, null, 2));
    
    console.log(`✅ Normalized specification written to: ${finalOutputPath}`);
    
    // Report on changes made
    const originalKeys = countKeys(spec);
    const normalizedKeys = countKeys(normalizedSpec);
    const removedFields = originalKeys - normalizedKeys;
    
    if (removedFields > 0) {
      console.log(`📝 Removed ${removedFields} volatile field(s) during normalization`);
    }
    
  } catch (error: any) {
    console.error(`❌ Error normalizing specification: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Recursively counts the number of keys in an object
 * @param obj - Object to count keys in
 * @returns Total number of keys
 */
function countKeys(obj: any): number {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return 0;
  }
  
  let count = Object.keys(obj).length;
  
  for (const value of Object.values(obj)) {
    count += countKeys(value);
  }
  
  return count;
}

/**
 * CLI interface
 */
function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: normalize_spec.ts <input-file> [output-file]

Examples:
  normalize_spec.ts openapi/latest.json
  normalize_spec.ts openapi/latest.json openapi/normalized.json
  
Description:
  Normalizes OpenAPI specifications for diff stability by:
  - Sorting object keys recursively
  - Removing volatile metadata fields
  - Cleaning version-specific information
    `);
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
  }
  
  const inputPath = path.resolve(args[0]);
  const outputPath = args[1] ? path.resolve(args[1]) : undefined;
  
  normalizeSpec(inputPath, outputPath);
}

// Run if called directly
if (require.main === module) {
  main();
}

export { normalizeSpec, normalizeObject, cleanInfoSection };