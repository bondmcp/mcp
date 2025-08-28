#!/usr/bin/env node

/**
 * OpenAPI Specification Normalization Script
 *
 * Normalizes OpenAPI specifications for consistent diff generation by:
 * - Sorting object keys recursively
 * - Removing volatile metadata fields
 * - Cleaning version-specific information
 */

import * as fs from "fs";
import * as path from "path";

interface NormalizeOptions {
  inputFile: string;
  outputFile: string;
  verbose?: boolean;
}

interface OpenAPISpec {
  [key: string]: any;
}

/**
 * Fields to remove from the specification as they are volatile/ephemeral
 */
const VOLATILE_FIELDS = [
  "x-generated-at",
  "x-timestamp",
  "x-build-time",
  "x-commit-sha",
  "x-pipeline-id",
  "x-generation-timestamp",
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
    return obj.map((item) => normalizeObject(item));
  }

  if (typeof obj !== "object") {
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
    if (cleanedInfo.version && typeof cleanedInfo.version === "string") {
      cleanedInfo.version = cleanedInfo.version.replace(
        /-\d{4}-\d{2}-\d{2}.*$/,
        "",
      );
    }

    // Remove volatile fields from info section
    VOLATILE_FIELDS.forEach((field) => {
      delete cleanedInfo[field];
    });

    spec.info = cleanedInfo;
  }

  return spec;
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
  const inputContent = fs.readFileSync(inputFile, "utf-8");
  let spec: any;

  try {
    spec = JSON.parse(inputContent);
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${inputFile}: ${error}`);
  }

  // Validate it's an OpenAPI spec
  if (!spec.openapi) {
    throw new Error(
      'Input file is not a valid OpenAPI specification (missing "openapi" field)',
    );
  }

  // Clean version-specific metadata
  spec = cleanInfoSection(spec);

  // Normalize the entire specification
  const normalizedSpec = normalizeObject(spec);

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write normalized spec
  fs.writeFileSync(outputFile, JSON.stringify(normalizedSpec, null, 2) + "\n");

  if (verbose) {
    console.log(`✅ Normalized OpenAPI spec written to: ${outputFile}`);
  }
}

/**
 * Recursively counts the number of keys in an object
 * @param obj - Object to count keys in
 * @returns Total number of keys
 */
function countKeys(obj: any): number {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
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
  const options: NormalizeOptions = {
    inputFile: "",
    outputFile: "",
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--in":
      case "--input":
        options.inputFile = args[++i];
        break;
      case "--out":
      case "--output":
        options.outputFile = args[++i];
        break;
      case "--verbose":
      case "-v":
        options.verbose = true;
        break;
      case "--help":
      case "-h":
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
    console.error("Error: --in and --out parameters are required");
    console.error("Use --help for usage information");
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

// Run if called directly
if (require.main === module) {
  main();
}

export { normalizeSpec, normalizeObject, cleanInfoSection };
