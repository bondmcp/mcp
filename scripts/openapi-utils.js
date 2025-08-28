#!/usr/bin/env node

/**
 * OpenAPI Spec Utilities
 *
 * This script provides utilities for managing OpenAPI specifications,
 * including validation, diffing, and SDK generation.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const crypto = require("crypto");

class OpenAPIManager {
  constructor() {
    this.specDir = path.join(__dirname, "..", "openapi");
    this.historyDir = path.join(this.specDir, "history");
    this.latestFile = path.join(this.specDir, "latest.json");

    // Ensure directories exist
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.specDir)) {
      fs.mkdirSync(this.specDir, { recursive: true });
    }
    if (!fs.existsSync(this.historyDir)) {
      fs.mkdirSync(this.historyDir, { recursive: true });
    }
  }

  /**
   * Calculate SHA256 checksum of a file
   */
  calculateChecksum(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    return hashSum.digest("hex");
  }

  /**
   * Validate an OpenAPI specification
   */
  validateSpec(specPath) {
    try {
      const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));

      // Basic validation
      if (!spec.openapi) {
        throw new Error("Missing openapi version field");
      }

      if (!spec.info || !spec.info.title || !spec.info.version) {
        throw new Error("Missing required info fields");
      }

      if (!spec.paths) {
        throw new Error("Missing paths object");
      }

      console.log("✅ OpenAPI specification is valid");
      return true;
    } catch (error) {
      console.error(
        "❌ OpenAPI specification validation failed:",
        error.message,
      );
      return false;
    }
  }

  /**
   * Get the latest version from history
   */
  getLatestVersion() {
    try {
      const latest = JSON.parse(fs.readFileSync(this.latestFile, "utf8"));
      return latest.version;
    } catch (error) {
      return null;
    }
  }

  /**
   * List all available versions
   */
  listVersions() {
    try {
      const files = fs
        .readdirSync(this.historyDir)
        .filter((file) => file.startsWith("openapi-") && file.endsWith(".json"))
        .map((file) => file.replace("openapi-", "").replace(".json", ""))
        .sort((a, b) => {
          // Simple version comparison (works for semver)
          const aParts = a.split(".").map(Number);
          const bParts = b.split(".").map(Number);

          for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aDiff = aParts[i] || 0;
            const bDiff = bParts[i] || 0;
            if (aDiff !== bDiff) {
              return aDiff - bDiff;
            }
          }
          return 0;
        });

      return files;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get the path to a specific version
   */
  getVersionPath(version) {
    return path.join(this.historyDir, `openapi-${version}.json`);
  }

  /**
   * Check if a version exists
   */
  versionExists(version) {
    return fs.existsSync(this.getVersionPath(version));
  }

  /**
   * Store a new version
   */
  storeVersion(specPath, version, checksum, specUrl) {
    const versionPath = this.getVersionPath(version);

    if (this.versionExists(version)) {
      throw new Error(`Version ${version} already exists`);
    }

    // Copy spec to history
    fs.copyFileSync(specPath, versionPath);

    // Update latest.json
    const latestData = {
      version,
      checksum,
      timestamp: new Date().toISOString(),
      spec_url: specUrl,
    };

    fs.writeFileSync(this.latestFile, JSON.stringify(latestData, null, 2));

    console.log(`✅ Stored version ${version}`);
    return versionPath;
  }

  /**
   * Generate semantic diff between two versions
   */
  generateDiff(fromVersion, toVersion) {
    const fromPath = this.getVersionPath(fromVersion);
    const toPath = this.getVersionPath(toVersion);

    if (!fs.existsSync(fromPath)) {
      throw new Error(`Version ${fromVersion} not found`);
    }

    if (!fs.existsSync(toPath)) {
      throw new Error(`Version ${toVersion} not found`);
    }

    const diffJsonPath = path.join(
      this.historyDir,
      `diff-${fromVersion}-to-${toVersion}.json`,
    );
    const diffMdPath = path.join(
      this.historyDir,
      `diff-${fromVersion}-to-${toVersion}.md`,
    );

    try {
      // Generate JSON diff
      execSync(
        `openapi-diff "${fromPath}" "${toPath}" --format json > "${diffJsonPath}"`,
      );

      // Generate Markdown diff
      execSync(
        `openapi-diff "${fromPath}" "${toPath}" --format markdown > "${diffMdPath}"`,
      );

      console.log(`✅ Generated diff from ${fromVersion} to ${toVersion}`);
      return { jsonPath: diffJsonPath, mdPath: diffMdPath };
    } catch (error) {
      console.error(`❌ Failed to generate diff: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate migration notes stub
   */
  generateMigrationNotes(fromVersion, toVersion) {
    const migrationsDir = path.join(__dirname, "..", "MIGRATIONS");
    const migrationFile = path.join(
      migrationsDir,
      `${fromVersion}-to-${toVersion}.md`,
    );

    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }

    const migrationContent = `# Migration Guide: ${fromVersion} to ${toVersion}

## Overview

This guide helps you migrate from API version ${fromVersion} to ${toVersion}.

## Breaking Changes

*Review the semantic diff for detailed changes.*

## New Features

*Check the API changelog for new endpoints and features.*

## Migration Steps

1. Review the semantic diff: \`openapi/history/diff-${fromVersion}-to-${toVersion}.md\`
2. Update your code to handle breaking changes
3. Test with the new API version
4. Update your SDK version

## Support

If you need help with migration, contact support@bondmcp.com
`;

    fs.writeFileSync(migrationFile, migrationContent);
    console.log(`✅ Generated migration notes: ${migrationFile}`);
    return migrationFile;
  }
}

// CLI interface
if (require.main === module) {
  const manager = new OpenAPIManager();
  const command = process.argv[2];

  switch (command) {
    case "validate":
      const specPath = process.argv[3];
      if (!specPath) {
        console.error("Usage: node openapi-utils.js validate <spec-path>");
        process.exit(1);
      }
      const isValid = manager.validateSpec(specPath);
      process.exit(isValid ? 0 : 1);
      break;

    case "checksum":
      const filePath = process.argv[3];
      if (!filePath) {
        console.error("Usage: node openapi-utils.js checksum <file-path>");
        process.exit(1);
      }
      console.log(manager.calculateChecksum(filePath));
      break;

    case "list":
      const versions = manager.listVersions();
      if (versions.length === 0) {
        console.log("No versions found");
      } else {
        console.log("Available versions:");
        versions.forEach((version) => console.log(`  ${version}`));
      }
      break;

    case "latest":
      const latest = manager.getLatestVersion();
      if (latest) {
        console.log(latest);
      } else {
        console.log("No latest version found");
        process.exit(1);
      }
      break;

    case "diff":
      const fromVer = process.argv[3];
      const toVer = process.argv[4];
      if (!fromVer || !toVer) {
        console.error(
          "Usage: node openapi-utils.js diff <from-version> <to-version>",
        );
        process.exit(1);
      }
      try {
        manager.generateDiff(fromVer, toVer);
      } catch (error) {
        process.exit(1);
      }
      break;

    case "migration":
      const fromVerMig = process.argv[3];
      const toVerMig = process.argv[4];
      if (!fromVerMig || !toVerMig) {
        console.error(
          "Usage: node openapi-utils.js migration <from-version> <to-version>",
        );
        process.exit(1);
      }
      manager.generateMigrationNotes(fromVerMig, toVerMig);
      break;

    default:
      console.log(`OpenAPI Utilities

Usage: node openapi-utils.js <command> [args]

Commands:
  validate <spec-path>                 Validate an OpenAPI specification
  checksum <file-path>                 Calculate SHA256 checksum of a file
  list                                 List all available versions
  latest                              Show the latest version
  diff <from-version> <to-version>    Generate semantic diff between versions
  migration <from> <to>               Generate migration notes stub

Examples:
  node openapi-utils.js validate spec.json
  node openapi-utils.js checksum spec.json
  node openapi-utils.js list
  node openapi-utils.js diff 1.0.0 1.1.0
`);
      process.exit(1);
  }
}

module.exports = OpenAPIManager;
