#!/usr/bin/env node

/**
 * Publish Preflight Script
 * 
 * Checks if packages already exist in npm or PyPI registries.
 * Exits with specific codes: 20 (npm exists), 21 (PyPI exists), 0 (clear), >1 (error)
 */

import * as https from 'https';
import * as http from 'http';

interface RegistryCheckResult {
  registry: string;
  package: string;
  version: string;
  exists: boolean;
  error?: string;
  url: string;
}

/**
 * Make HTTP/HTTPS request with timeout
 */
function makeRequest(url: string, timeout: number = 10000): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, { method: 'GET', timeout }, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 0,
          body
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Check if package exists in npm registry
 */
async function checkNpmRegistry(packageName: string, version: string): Promise<RegistryCheckResult> {
  const url = `https://registry.npmjs.org/${packageName}/${version}`;
  
  try {
    const response = await makeRequest(url);
    
    const result: RegistryCheckResult = {
      registry: 'npm',
      package: packageName,
      version,
      exists: response.statusCode === 200,
      url
    };

    if (response.statusCode === 404) {
      result.exists = false;
    } else if (response.statusCode === 200) {
      result.exists = true;
    } else {
      result.error = `Unexpected status code: ${response.statusCode}`;
    }

    return result;
  } catch (error) {
    return {
      registry: 'npm',
      package: packageName,
      version,
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url
    };
  }
}

/**
 * Check if package exists in PyPI registry
 */
async function checkPyPIRegistry(packageName: string, version: string): Promise<RegistryCheckResult> {
  const url = `https://pypi.org/pypi/${packageName}/${version}/json`;
  
  try {
    const response = await makeRequest(url);
    
    const result: RegistryCheckResult = {
      registry: 'pypi',
      package: packageName,
      version,
      exists: response.statusCode === 200,
      url
    };

    if (response.statusCode === 404) {
      result.exists = false;
    } else if (response.statusCode === 200) {
      result.exists = true;
    } else {
      result.error = `Unexpected status code: ${response.statusCode}`;
    }

    return result;
  } catch (error) {
    return {
      registry: 'pypi',
      package: packageName,
      version,
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url
    };
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.error('Usage: node publish_preflight.js <registry> <version> [package-name]');
      console.error('Registry: npm | pypi');
      console.error('Example: node publish_preflight.js npm 1.0.0 @bondmcp/sdk');
      process.exit(1);
    }

    const registry = args[0].toLowerCase();
    const version = args[1];
    let packageName = args[2];

    // Validate registry
    if (!['npm', 'pypi'].includes(registry)) {
      console.error(`Error: Invalid registry '${registry}'. Must be 'npm' or 'pypi'`);
      process.exit(1);
    }

    // Default package names if not provided
    if (!packageName) {
      packageName = registry === 'npm' ? '@bondmcp/sdk' : 'bondmcp-sdk';
    }

    console.error(`Checking ${registry.toUpperCase()} registry for ${packageName} version ${version}...`);

    let result: RegistryCheckResult;
    
    if (registry === 'npm') {
      result = await checkNpmRegistry(packageName, version);
    } else {
      result = await checkPyPIRegistry(packageName, version);
    }

    // Output result as JSON for machine parsing
    console.log(JSON.stringify(result));

    // Handle errors
    if (result.error) {
      console.error(`Error checking registry: ${result.error}`);
      process.exit(2);
    }

    // Exit with appropriate code
    if (result.exists) {
      console.error(`✋ Package ${packageName} version ${version} already exists in ${registry.toUpperCase()}`);
      console.error('Skipping publish to avoid conflicts.');
      
      if (registry === 'npm') {
        process.exit(20);
      } else {
        process.exit(21);
      }
    } else {
      console.error(`✅ Package ${packageName} version ${version} is available for publish to ${registry.toUpperCase()}`);
      process.exit(0);
    }

  } catch (error) {
    console.error('Unexpected error during preflight check:', error);
    process.exit(3);
  }
}

// Only run main if this script is executed directly
if (require.main === module) {
  main();
}

export { checkNpmRegistry, checkPyPIRegistry, RegistryCheckResult };