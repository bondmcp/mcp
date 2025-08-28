#!/usr/bin/env node

/**
 * SemVer Check Script
 *
 * Verifies that the spec diff category aligns with version bump requirements:
 * - BREAKING changes require major version bump
 * - NON_BREAKING (additive) changes require minor version bump
 * - PATCH (documentation/examples only) require patch version bump
 */

import * as fs from "fs";
import * as path from "path";

interface DiffClassification {
  classification: "major" | "minor" | "patch";
  summary: string;
  addedEndpoints?: string[];
  modifiedEndpoints?: string[];
  breakingChanges?: string[];
  [key: string]: any;
}

interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
}

/**
 * Parse semantic version string
 */
function parseVersion(version: string): VersionInfo {
  const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/;
  const match = version.match(semverRegex);

  if (!match) {
    throw new Error(`Invalid semantic version: ${version}`);
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4],
  };
}

/**
 * Compare two versions and determine the type of change
 */
function getVersionBumpType(
  fromVersion: string,
  toVersion: string,
): "major" | "minor" | "patch" | "none" {
  const from = parseVersion(fromVersion);
  const to = parseVersion(toVersion);

  if (to.major > from.major) {
    return "major";
  } else if (to.minor > from.minor) {
    return "minor";
  } else if (to.patch > from.patch) {
    return "patch";
  } else {
    return "none";
  }
}

/**
 * Read diff classification from file
 */
function readDiffClassification(
  classificationPath: string,
): DiffClassification {
  if (!fs.existsSync(classificationPath)) {
    throw new Error(`Classification file not found: ${classificationPath}`);
  }

  const content = fs.readFileSync(classificationPath, "utf-8");
  let classification: DiffClassification;

  try {
    classification = JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse classification JSON: ${error}`);
  }

  if (!classification.classification) {
    throw new Error('Classification file missing "classification" field');
  }

  return classification;
}

/**
 * Read version from package.json
 */
function readPackageVersion(packageJsonPath: string = "package.json"): string {
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`Package.json not found: ${packageJsonPath}`);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  if (!packageJson.version) {
    throw new Error('Package.json missing "version" field');
  }

  return packageJson.version;
}

/**
 * Get the last version from changelog
 */
function getLastVersionFromChangelog(
  changelogPath: string = "CHANGELOG.md",
): string | null {
  if (!fs.existsSync(changelogPath)) {
    return null;
  }

  const content = fs.readFileSync(changelogPath, "utf-8");
  const lines = content.split("\n");

  for (const line of lines) {
    // Look for version header (## [version] - date)
    const versionMatch = line.match(/^##\s*\[([^\]]+)\]/);
    if (versionMatch && versionMatch[1] !== "Unreleased") {
      return versionMatch[1];
    }
  }

  return null;
}

/**
 * Validate semver alignment
 */
function validateSemverAlignment(
  diffClassification: DiffClassification,
  fromVersion: string,
  toVersion: string,
): { valid: boolean; reason?: string } {
  const requiredBump = diffClassification.classification;
  const actualBump = getVersionBumpType(fromVersion, toVersion);

  console.log(`📊 Diff classification: ${requiredBump.toUpperCase()}`);
  console.log(
    `📈 Version bump: ${fromVersion} → ${toVersion} (${actualBump.toUpperCase()})`,
  );

  // Check alignment
  const alignmentRules: Record<string, string[]> = {
    major: ["major"],
    minor: ["minor", "major"], // Major bump is acceptable for minor changes
    patch: ["patch", "minor", "major"], // Any bump is acceptable for patch changes
  };

  const allowedBumps = alignmentRules[requiredBump] || [];

  if (!allowedBumps.includes(actualBump)) {
    return {
      valid: false,
      reason: `${requiredBump.toUpperCase()} changes require ${requiredBump.toUpperCase()} version bump, but got ${actualBump.toUpperCase()}`,
    };
  }

  return { valid: true };
}

/**
 * Main semver check function
 */
function performSemverCheck(options: {
  classificationPath: string;
  packageJsonPath?: string;
  changelogPath?: string;
  verbose?: boolean;
}): void {
  const {
    classificationPath,
    packageJsonPath = "package.json",
    changelogPath = "CHANGELOG.md",
    verbose = false,
  } = options;

  try {
    if (verbose) {
      console.log("🔍 Starting semver alignment check...");
    }

    // Read diff classification
    const classification = readDiffClassification(classificationPath);

    // Read current version
    const currentVersion = readPackageVersion(packageJsonPath);

    // Get previous version from changelog
    const previousVersion = getLastVersionFromChangelog(changelogPath);

    if (!previousVersion) {
      console.log(
        "ℹ️ No previous version found in changelog, skipping semver check",
      );
      return;
    }

    if (verbose) {
      console.log(
        `📄 Classification: ${JSON.stringify(classification, null, 2)}`,
      );
    }

    // Validate alignment
    const validation = validateSemverAlignment(
      classification,
      previousVersion,
      currentVersion,
    );

    if (!validation.valid) {
      console.error(`❌ SemVer alignment check failed: ${validation.reason}`);
      console.error("💡 Recommendations:");

      if (classification.classification === "major") {
        console.error("   - For BREAKING changes, increment major version");
        console.error("   - Example: 1.2.3 → 2.0.0");
      } else if (classification.classification === "minor") {
        console.error(
          "   - For NON_BREAKING (additive) changes, increment minor version",
        );
        console.error("   - Example: 1.2.3 → 1.3.0");
      } else if (classification.classification === "patch") {
        console.error(
          "   - For PATCH (documentation/examples) changes, increment patch version",
        );
        console.error("   - Example: 1.2.3 → 1.2.4");
      }

      process.exit(1);
    }

    console.log("✅ SemVer alignment check passed");

    if (verbose) {
      console.log(
        `✨ Version bump ${previousVersion} → ${currentVersion} is appropriate for ${classification.classification.toUpperCase()} changes`,
      );
    }
  } catch (error: any) {
    console.error(`❌ SemVer check error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * CLI interface
 */
function main(): void {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Usage: semver-check.ts --classification <path> [options]

Options:
  --classification <path>  Path to diff classification JSON file
  --package <path>         Path to package.json (default: package.json)
  --changelog <path>       Path to CHANGELOG.md (default: CHANGELOG.md)
  --verbose, -v            Verbose output

Examples:
  semver-check.ts --classification openapi/diff/classification.json
  semver-check.ts --classification /tmp/classification.json --verbose
  
Description:
  Verifies that API specification changes align with semantic versioning:
  - MAJOR: Breaking changes require major version bump
  - MINOR: Non-breaking additive changes require minor version bump  
  - PATCH: Documentation/example changes require patch version bump
    `);
    process.exit(0);
  }

  let classificationPath = "";
  let packageJsonPath = "package.json";
  let changelogPath = "CHANGELOG.md";
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--classification":
        classificationPath = args[++i];
        break;
      case "--package":
        packageJsonPath = args[++i];
        break;
      case "--changelog":
        changelogPath = args[++i];
        break;
      case "--verbose":
      case "-v":
        verbose = true;
        break;
      default:
        console.error(`Unknown option: ${args[i]}`);
        process.exit(1);
    }
  }

  if (!classificationPath) {
    console.error("Error: --classification parameter is required");
    console.error("Use --help for usage information");
    process.exit(1);
  }

  performSemverCheck({
    classificationPath: path.resolve(classificationPath),
    packageJsonPath: path.resolve(packageJsonPath),
    changelogPath: path.resolve(changelogPath),
    verbose,
  });
}

// Run if called directly
if (require.main === module) {
  main();
}

export {
  performSemverCheck,
  parseVersion,
  getVersionBumpType,
  validateSemverAlignment,
};
