#!/usr/bin/env node

/**
 * OpenAPI Specification Normalization Script
 * 
 * Normalizes OpenAPI specifications to ensure consistent formatting
 * before diff generation and contract comparison.
 */

import * as fs from 'fs';
import * as path from 'path';

interface NormalizeOptions {
  inputFile: string;
  outputFile: string;
  verbose?: boolean;
}

/**
 * Normalizes an OpenAPI specification
 */
function normalizeOpenAPISpec(spec: any): any {
  // Deep clone to avoid modifying the original
  const normalized = JSON.parse(JSON.stringify(spec));

  // Sort properties alphabetically for consistent output
  function sortObjectKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      const sorted: any = {};
      Object.keys(obj).sort().forEach(key => {
        sorted[key] = sortObjectKeys(obj[key]);
      });
      return sorted;
    }
    return obj;
  }

  // Ensure consistent properties order
  const orderedSpec: any = {};
  
  // Standard OpenAPI property order
  const propertyOrder = [
    'openapi',
    'info',
    'servers',
    'paths',
    'components',
    'security',
    'tags',
    'externalDocs'
  ];

  // Add properties in order
  propertyOrder.forEach(prop => {
    if (normalized[prop] !== undefined) {
      orderedSpec[prop] = sortObjectKeys(normalized[prop]);
    }
  });

  // Add any remaining properties
  Object.keys(normalized).forEach(key => {
    if (!propertyOrder.includes(key)) {
      orderedSpec[key] = sortObjectKeys(normalized[key]);
    }
  });

  // Normalize version format if present
  if (orderedSpec.info && orderedSpec.info.version) {
    // Remove timestamp suffixes for consistent versioning
    orderedSpec.info.version = orderedSpec.info.version.replace(/-\d{4}-\d{2}-\d{2}$/, '');
  }

  return orderedSpec;
}

/**
 * Main normalization function
 */
async function normalizeSpec(options: NormalizeOptions): Promise<void> {
  const { inputFile, outputFile, verbose = false } = options;

  if (verbose) {
    console.log(`Normalizing OpenAPI spec: ${inputFile} -> ${outputFile}`);
  }

  // Check if input file exists
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input file not found: ${inputFile}`);
  }

  // Read and parse the input file
  const inputContent = fs.readFileSync(inputFile, 'utf-8');
  let spec: any;

  try {
    spec = JSON.parse(inputContent);
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${inputFile}: ${error}`);
  }

  // Validate it's an OpenAPI spec
  if (!spec.openapi) {
    throw new Error('Input file is not a valid OpenAPI specification (missing "openapi" field)');
  }

  // Normalize the specification
  const normalizedSpec = normalizeOpenAPISpec(spec);

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write normalized spec
  fs.writeFileSync(outputFile, JSON.stringify(normalizedSpec, null, 2) + '\n');

  if (verbose) {
    console.log(`✅ Normalized OpenAPI spec written to: ${outputFile}`);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: NormalizeOptions = {
    inputFile: '',
    outputFile: '',
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--in':
      case '--input':
        options.inputFile = args[++i];
        break;
      case '--out':
      case '--output':
        options.outputFile = args[++i];
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--help':
      case '-h':
        console.log(`Usage: normalize_spec.ts --in <input> --out <output> [--verbose]
        
Options:
  --in, --input     Input OpenAPI JSON file
  --out, --output   Output normalized JSON file
  --verbose, -v     Verbose output
  --help, -h        Show this help`);
        process.exit(0);
        break;
      default:
        console.error(`Unknown option: ${args[i]}`);
        process.exit(1);
    }
  }

  if (!options.inputFile || !options.outputFile) {
    console.error('Error: --in and --out parameters are required');
    console.error('Use --help for usage information');
    process.exit(1);
  }

  normalizeSpec(options)
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
}

export { normalizeSpec, normalizeOpenAPISpec };