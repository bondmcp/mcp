#!/usr/bin/env node

/**
 * Publish Preflight Checker
 * 
 * This script performs publish collision checks to prevent duplicate publishes:
 * - npm: Checks if @bondmcp/sdk@<version> already exists
 * - PyPI: Checks if bondmcp-sdk version already exists
 * 
 * Exit codes:
 * - 0: Safe to publish (package version doesn't exist)
 * - 20: Package version already exists (skip publish gracefully)
 * - 1: Error occurred during check
 */

import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

interface PackageInfo {
  name: string;
  version: string;
  registry: 'npm' | 'pypi';
}

/**
 * Makes an HTTPS request and returns the response
 * @param url - URL to request
 * @returns Promise that resolves to response data
 */
function httpsRequest(url: string): Promise<{ statusCode: number; data: string }> {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode || 0,
          data: data
        });
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    // Set timeout to 10 seconds
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Checks if a package version exists on npm
 * @param packageName - npm package name (e.g., "@bondmcp/sdk")
 * @param version - Version to check
 * @returns Promise that resolves to true if exists, false otherwise
 */
async function checkNpmPackage(packageName: string, version: string): Promise<boolean> {
  try {
    console.log(`Checking npm package: ${packageName}@${version}`);
    
    // Encode package name for URL (handle scoped packages)
    const encodedPackageName = encodeURIComponent(packageName);
    const url = `https://registry.npmjs.org/${encodedPackageName}/${version}`;
    
    const response = await httpsRequest(url);
    
    if (response.statusCode === 200) {
      console.log(`✅ Found existing npm package: ${packageName}@${version}`);
      return true;
    } else if (response.statusCode === 404) {
      console.log(`📦 npm package version not found: ${packageName}@${version} (safe to publish)`);
      return false;
    } else {
      console.warn(`⚠️ Unexpected response code ${response.statusCode} for npm package check`);
      return false;
    }
  } catch (error: any) {
    console.error(`❌ Error checking npm package: ${error.message}`);
    throw error;
  }
}

/**
 * Checks if a package version exists on PyPI
 * @param packageName - PyPI package name (e.g., "bondmcp-sdk")
 * @param version - Version to check
 * @returns Promise that resolves to true if exists, false otherwise
 */
async function checkPyPIPackage(packageName: string, version: string): Promise<boolean> {
  try {
    console.log(`Checking PyPI package: ${packageName}@${version}`);
    
    const url = `https://pypi.org/pypi/${packageName}/${version}/json`;
    
    const response = await httpsRequest(url);
    
    if (response.statusCode === 200) {
      console.log(`✅ Found existing PyPI package: ${packageName}@${version}`);
      return true;
    } else if (response.statusCode === 404) {
      console.log(`📦 PyPI package version not found: ${packageName}@${version} (safe to publish)`);
      return false;
    } else {
      console.warn(`⚠️ Unexpected response code ${response.statusCode} for PyPI package check`);
      return false;
    }
  } catch (error: any) {
    console.error(`❌ Error checking PyPI package: ${error.message}`);
    throw error;
  }
}

/**
 * Reads version from package.json file
 * @param packageJsonPath - Path to package.json file
 * @returns Package version
 */
function readVersionFromPackageJson(packageJsonPath: string): string {
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`package.json not found at: ${packageJsonPath}`);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.version) {
    throw new Error(`No version field found in: ${packageJsonPath}`);
  }
  
  return packageJson.version;
}

/**
 * Reads version from pyproject.toml file
 * @param pyprojectPath - Path to pyproject.toml file
 * @returns Package version
 */
function readVersionFromPyproject(pyprojectPath: string): string {
  if (!fs.existsSync(pyprojectPath)) {
    throw new Error(`pyproject.toml not found at: ${pyprojectPath}`);
  }
  
  const content = fs.readFileSync(pyprojectPath, 'utf8');
  const versionMatch = content.match(/version\s*=\s*["']([^"']+)["']/);
  
  if (!versionMatch) {
    throw new Error(`No version field found in: ${pyprojectPath}`);
  }
  
  return versionMatch[1];
}

/**
 * Auto-detects packages and versions to check
 * @returns Array of package information
 */
function autoDetectPackages(): PackageInfo[] {
  const packages: PackageInfo[] = [];
  
  // Check for npm packages
  const npmPackageJsonPaths = [
    'package.json',
    'javascript/package.json',
    'sdks/typescript/package.json'
  ];
  
  for (const packagePath of npmPackageJsonPaths) {
    if (fs.existsSync(packagePath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        if (packageJson.name && packageJson.version) {
          packages.push({
            name: packageJson.name,
            version: packageJson.version,
            registry: 'npm'
          });
          console.log(`📦 Detected npm package: ${packageJson.name}@${packageJson.version}`);
        }
      } catch (error: any) {
        console.warn(`⚠️ Could not parse ${packagePath}: ${error.message}`);
      }
    }
  }
  
  // Check for Python packages
  const pyprojectPaths = [
    'pyproject.toml',
    'python/pyproject.toml'
  ];
  
  for (const pyprojectPath of pyprojectPaths) {
    if (fs.existsSync(pyprojectPath)) {
      try {
        const content = fs.readFileSync(pyprojectPath, 'utf8');
        const nameMatch = content.match(/name\s*=\s*["']([^"']+)["']/);
        const versionMatch = content.match(/version\s*=\s*["']([^"']+)["']/);
        
        if (nameMatch && versionMatch) {
          packages.push({
            name: nameMatch[1],
            version: versionMatch[1],
            registry: 'pypi'
          });
          console.log(`📦 Detected PyPI package: ${nameMatch[1]}@${versionMatch[1]}`);
        }
      } catch (error: any) {
        console.warn(`⚠️ Could not parse ${pyprojectPath}: ${error.message}`);
      }
    }
  }
  
  return packages;
}

/**
 * Main preflight check function
 * @param packages - Array of packages to check
 * @returns Promise that resolves to true if any package already exists
 */
async function performPreflightCheck(packages: PackageInfo[]): Promise<boolean> {
  console.log(`🔍 Starting preflight check for ${packages.length} package(s)...`);
  
  let anyPackageExists = false;
  
  for (const pkg of packages) {
    try {
      let exists = false;
      
      if (pkg.registry === 'npm') {
        exists = await checkNpmPackage(pkg.name, pkg.version);
      } else if (pkg.registry === 'pypi') {
        exists = await checkPyPIPackage(pkg.name, pkg.version);
      }
      
      if (exists) {
        anyPackageExists = true;
        console.log(`🚫 Package ${pkg.name}@${pkg.version} already exists on ${pkg.registry}`);
      }
    } catch (error: any) {
      console.error(`❌ Failed to check ${pkg.name}@${pkg.version} on ${pkg.registry}: ${error.message}`);
      throw error;
    }
  }
  
  return anyPackageExists;
}

/**
 * CLI interface
 */
async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
Usage: publish_preflight.ts [--npm package@version] [--pypi package@version] [--auto]

Options:
  --npm package@version    Check specific npm package version
  --pypi package@version   Check specific PyPI package version  
  --auto                   Auto-detect packages from project files
  
Examples:
  publish_preflight.ts --npm @bondmcp/sdk@1.0.0
  publish_preflight.ts --pypi bondmcp-sdk@1.0.0
  publish_preflight.ts --auto
  publish_preflight.ts --npm @bondmcp/sdk@1.0.0 --pypi bondmcp-sdk@1.0.0

Exit Codes:
  0:  Safe to publish (no package versions exist)
  20: Package version(s) already exist (skip publish)
  1:  Error occurred during check
      `);
      process.exit(0);
    }
    
    const packages: PackageInfo[] = [];
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--npm' && i + 1 < args.length) {
        const packageAndVersion = args[i + 1];
        const lastAtIndex = packageAndVersion.lastIndexOf('@');
        if (lastAtIndex > 0) {
          const name = packageAndVersion.substring(0, lastAtIndex);
          const version = packageAndVersion.substring(lastAtIndex + 1);
          packages.push({ name, version, registry: 'npm' });
        } else {
          throw new Error(`Invalid npm package format: ${packageAndVersion}. Expected: package@version`);
        }
        i++; // Skip next argument
      } else if (args[i] === '--pypi' && i + 1 < args.length) {
        const packageAndVersion = args[i + 1];
        const lastAtIndex = packageAndVersion.lastIndexOf('@');
        if (lastAtIndex > 0) {
          const name = packageAndVersion.substring(0, lastAtIndex);
          const version = packageAndVersion.substring(lastAtIndex + 1);
          packages.push({ name, version, registry: 'pypi' });
        } else {
          throw new Error(`Invalid PyPI package format: ${packageAndVersion}. Expected: package@version`);
        }
        i++; // Skip next argument
      } else if (args[i] === '--auto') {
        packages.push(...autoDetectPackages());
      }
    }
    
    // Default to auto-detection if no packages specified
    if (packages.length === 0) {
      console.log('No packages specified, using auto-detection...');
      packages.push(...autoDetectPackages());
    }
    
    if (packages.length === 0) {
      console.log('⚠️ No packages found to check');
      process.exit(0);
    }
    
    // Perform the preflight check
    const anyExists = await performPreflightCheck(packages);
    
    if (anyExists) {
      console.log('\n🚫 Preflight check failed: One or more package versions already exist');
      console.log('💡 Tip: Consider bumping the version numbers before publishing');
      process.exit(20); // Special exit code for "skip publish"
    } else {
      console.log('\n✅ Preflight check passed: All package versions are available for publishing');
      process.exit(0);
    }
    
  } catch (error: any) {
    console.error(`\n❌ Preflight check error: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { checkNpmPackage, checkPyPIPackage, performPreflightCheck };