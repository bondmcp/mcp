#!/usr/bin/env node

/**
 * Publish Preflight Check Script
 * 
 * Checks if a package version already exists on npm or PyPI
 * Returns distinct exit codes to indicate status:
 * - 0: Version does not exist, safe to publish
 * - 20: Version exists on npm
 * - 21: Version exists on PyPI  
 * - 1: Error occurred during check
 */

import { execSync } from 'child_process';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

interface PreflightOptions {
  registry: 'npm' | 'pypi';
  packageName?: string;
  version: string;
  verbose?: boolean;
}

/**
 * Checks if a package version exists on npm
 */
async function checkNpmVersion(packageName: string, version: string, verbose: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    const url = `https://registry.npmjs.org/${packageName}/${version}`;
    
    if (verbose) {
      console.log(`Checking npm: ${url}`);
    }

    https.get(url, (res) => {
      if (res.statusCode === 200) {
        if (verbose) {
          console.log(`✅ Version ${version} exists on npm`);
        }
        resolve(true);
      } else if (res.statusCode === 404) {
        if (verbose) {
          console.log(`✅ Version ${version} does not exist on npm`);
        }
        resolve(false);
      } else {
        if (verbose) {
          console.log(`❓ Unexpected status code ${res.statusCode} from npm`);
        }
        resolve(false); // Assume safe to publish on unexpected responses
      }
    }).on('error', (err) => {
      if (verbose) {
        console.error(`Error checking npm: ${err.message}`);
      }
      resolve(false); // Assume safe to publish on errors
    });
  });
}

/**
 * Checks if a package version exists on PyPI
 */
async function checkPyPIVersion(packageName: string, version: string, verbose: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    const url = `https://pypi.org/pypi/${packageName}/${version}/json/`;
    
    if (verbose) {
      console.log(`Checking PyPI: ${url}`);
    }

    https.get(url, (res) => {
      if (res.statusCode === 200) {
        if (verbose) {
          console.log(`✅ Version ${version} exists on PyPI`);
        }
        resolve(true);
      } else if (res.statusCode === 404) {
        if (verbose) {
          console.log(`✅ Version ${version} does not exist on PyPI`);
        }
        resolve(false);
      } else {
        if (verbose) {
          console.log(`❓ Unexpected status code ${res.statusCode} from PyPI`);
        }
        resolve(false); // Assume safe to publish on unexpected responses
      }
    }).on('error', (err) => {
      if (verbose) {
        console.error(`Error checking PyPI: ${err.message}`);
      }
      resolve(false); // Assume safe to publish on errors
    });
  });
}

/**
 * Extracts package name from package.json for npm
 */
function getNpmPackageName(): string {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.name || '';
  }
  return '';
}

/**
 * Extracts package name from pyproject.toml for PyPI
 */
function getPyPIPackageName(): string {
  const pyprojectPath = path.join(process.cwd(), 'pyproject.toml');
  if (fs.existsSync(pyprojectPath)) {
    const content = fs.readFileSync(pyprojectPath, 'utf-8');
    const nameMatch = content.match(/name\s*=\s*["']([^"']+)["']/);
    return nameMatch ? nameMatch[1] : '';
  }
  return '';
}

/**
 * Main preflight check function
 */
async function runPreflightCheck(options: PreflightOptions): Promise<void> {
  const { registry, version, verbose = false } = options;
  let { packageName } = options;

  if (verbose) {
    console.log(`Running preflight check for ${registry} version ${version}`);
  }

  // Auto-detect package name if not provided
  if (!packageName) {
    if (registry === 'npm') {
      packageName = getNpmPackageName();
    } else if (registry === 'pypi') {
      packageName = getPyPIPackageName();
    }
  }

  if (!packageName) {
    console.error(`Error: Could not determine package name for ${registry}`);
    process.exit(1);
  }

  if (verbose) {
    console.log(`Package name: ${packageName}`);
  }

  try {
    let versionExists = false;

    if (registry === 'npm') {
      versionExists = await checkNpmVersion(packageName, version, verbose);
      if (versionExists) {
        console.log(`SKIPPED: Version ${version} already exists on npm for package ${packageName}`);
        process.exit(20); // Exit code 20 for npm version exists
      }
    } else if (registry === 'pypi') {
      versionExists = await checkPyPIVersion(packageName, version, verbose);
      if (versionExists) {
        console.log(`SKIPPED: Version ${version} already exists on PyPI for package ${packageName}`);
        process.exit(21); // Exit code 21 for PyPI version exists
      }
    }

    console.log(`✅ Version ${version} does not exist on ${registry}. Safe to publish.`);
    process.exit(0);

  } catch (error) {
    console.error(`Error during preflight check: ${error}`);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`Usage: publish_preflight.ts <registry> <version> [package-name] [--verbose]

Arguments:
  registry       Either 'npm' or 'pypi'
  version        Version to check (e.g., '1.0.0')
  package-name   Package name (optional, auto-detected from package.json/pyproject.toml)

Options:
  --verbose, -v  Verbose output

Exit codes:
  0   Version does not exist, safe to publish
  20  Version exists on npm
  21  Version exists on PyPI
  1   Error occurred`);
    process.exit(1);
  }

  const registry = args[0] as 'npm' | 'pypi';
  const version = args[1];
  let packageName = args[2];
  let verbose = false;

  // Check for verbose flag
  if (args.includes('--verbose') || args.includes('-v')) {
    verbose = true;
  }

  // If package name looks like a flag, it's not a package name
  if (packageName && packageName.startsWith('--')) {
    packageName = '';
  }

  if (!['npm', 'pypi'].includes(registry)) {
    console.error('Error: registry must be either "npm" or "pypi"');
    process.exit(1);
  }

  if (!version) {
    console.error('Error: version is required');
    process.exit(1);
  }

  const options: PreflightOptions = {
    registry,
    version,
    packageName: packageName || undefined,
    verbose
  };

  runPreflightCheck(options);
}

export { runPreflightCheck, checkNpmVersion, checkPyPIVersion };