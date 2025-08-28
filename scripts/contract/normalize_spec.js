#!/usr/bin/env node

/**
 * OpenAPI Specification Normalization Script
 *
 * Deterministically sorts object keys, strips ephemeral metadata fields,
 * and outputs normalized JSON for stable diffs.
 */

const fs = require("fs");
const path = require("path");
/**
 * Recursively normalize an object by sorting keys and removing ephemeral fields
 */
function normalizeObject(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(normalizeObject);
  }
  const normalized = {};
  const sortedKeys = Object.keys(obj).sort();
  for (const key of sortedKeys) {
    // Skip ephemeral metadata fields
    if (isEphemeralField(key)) {
      continue;
    }
    normalized[key] = normalizeObject(obj[key]);
  }
  return normalized;
}
/**
 * Check if a field is ephemeral and should be stripped
 */
function isEphemeralField(key) {
  const ephemeralFields = [
    "x-generated-at",
    "x-timestamp",
    "x-generator-version",
    "x-build-time",
    "x-commit-hash",
    "x-build-number",
  ];
  return ephemeralFields.includes(key) || key.startsWith("x-generated-");
}
/**
 * Normalize an OpenAPI specification
 */
function normalizeSpec(spec) {
  const normalized = normalizeObject(spec);
  // Ensure consistent ordering of top-level sections
  const orderedSpec = {};
  // Define the preferred order of top-level keys
  const keyOrder = [
    "openapi",
    "info",
    "servers",
    "paths",
    "components",
    "security",
    "tags",
    "externalDocs",
  ];
  // Add keys in preferred order
  for (const key of keyOrder) {
    if (normalized[key] !== undefined) {
      orderedSpec[key] = normalized[key];
    }
  }
  // Add any remaining keys not in the preferred order
  for (const key of Object.keys(normalized).sort()) {
    if (!keyOrder.includes(key)) {
      orderedSpec[key] = normalized[key];
    }
  }
  return orderedSpec;
}
/**
 * Main function
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    if (args.length === 0) {
      console.error("Usage: node normalize_spec.js <input-file> [output-file]");
      process.exit(1);
    }
    const inputFile = args[0];
    const outputFile = args[1] || inputFile;
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      console.error(`Error: Input file '${inputFile}' not found`);
      process.exit(1);
    }
    // Read and parse the OpenAPI specification
    console.log(`Reading OpenAPI specification from: ${inputFile}`);
    const specContent = fs.readFileSync(inputFile, "utf8");
    let spec;
    try {
      spec = JSON.parse(specContent);
    } catch (parseError) {
      console.error(`Error parsing JSON from '${inputFile}':`, parseError);
      process.exit(1);
    }
    // Normalize the specification
    console.log("Normalizing OpenAPI specification...");
    const normalizedSpec = normalizeSpec(spec);
    // Write normalized specification
    console.log(`Writing normalized specification to: ${outputFile}`);
    fs.writeFileSync(outputFile, JSON.stringify(normalizedSpec, null, 2));
    console.log(
      "✅ OpenAPI specification normalization completed successfully",
    );
    // Output metadata for CI/CD pipelines
    const metadata = {
      input_file: inputFile,
      output_file: outputFile,
      normalized: true,
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(metadata));
  } catch (error) {
    console.error("Error during normalization:", error);
    process.exit(1);
  }
}
// Only run main if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { normalizeSpec, normalizeObject };
