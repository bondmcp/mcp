#!/usr/bin/env node

/**
 * SDK Generation Script
 * 
 * This script generates TypeScript and Python SDKs from OpenAPI specifications.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SDKGenerator {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.openApiDir = path.join(this.rootDir, 'openapi');
    this.jsDir = path.join(this.rootDir, 'javascript');
    this.pythonDir = path.join(this.rootDir, 'python');
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    const dirs = [
      path.join(this.jsDir, 'src', 'generated'),
      path.join(this.pythonDir, 'bondmcp_sdk', 'generated'),
      path.join(this.rootDir, 'temp')
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Check if required tools are installed
   */
  checkDependencies() {
    const requiredTools = [
      'openapi-generator-cli',
      'npm',
      'python3'
    ];
    
    console.log('🔍 Checking dependencies...');
    
    for (const tool of requiredTools) {
      try {
        execSync(`which ${tool}`, { stdio: 'ignore' });
        console.log(`✅ ${tool} is available`);
      } catch (error) {
        console.error(`❌ ${tool} is not available`);
        throw new Error(`Required tool ${tool} is not installed`);
      }
    }
  }

  /**
   * Install SDK generation tools
   */
  installTools() {
    console.log('📦 Installing SDK generation tools...');
    
    try {
      // Install OpenAPI Generator CLI
      execSync('npm install -g @openapitools/openapi-generator-cli', { stdio: 'inherit' });
      
      // Install Python SDK generation tools
      execSync('pip install openapi-python-client hatch twine', { stdio: 'inherit' });
      
      console.log('✅ SDK generation tools installed');
    } catch (error) {
      console.error('❌ Failed to install tools:', error.message);
      throw error;
    }
  }

  /**
   * Generate TypeScript SDK
   */
  generateTypeScriptSDK(specPath, version) {
    console.log(`🔨 Generating TypeScript SDK version ${version}...`);
    
    this.ensureDirectories();
    
    const tempDir = path.join(this.rootDir, 'temp', 'ts-sdk');
    
    try {
      // Clean previous generation
      if (fs.existsSync(tempDir)) {
        execSync(`rm -rf ${tempDir}`);
      }
      
      // Generate TypeScript client
      execSync(`openapi-generator-cli generate \
        -i "${specPath}" \
        -g typescript-axios \
        -o "${tempDir}" \
        --additional-properties=supportsES6=true,npmName=@bondmcp/sdk,npmVersion=${version},withoutPrefixEnums=true`, 
        { stdio: 'inherit' });
      
      // Copy generated files to proper structure
      const generatedSrcDir = path.join(tempDir, 'src');
      const targetSrcDir = path.join(this.jsDir, 'src', 'generated');
      
      if (fs.existsSync(generatedSrcDir)) {
        execSync(`cp -r "${generatedSrcDir}"/* "${targetSrcDir}/"`);
      }
      
      // Update package.json version
      const packageJsonPath = path.join(this.jsDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.version = version;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }
      
      // Create index.ts that exports generated client
      const indexPath = path.join(this.jsDir, 'src', 'index.ts');
      const indexContent = `// Auto-generated TypeScript SDK for BondMCP
// Version: ${version}
// Generated from OpenAPI specification

export * from './generated';

// Re-export main client classes for convenience
import { Configuration, DefaultApi } from './generated';

export class BondMCPClient extends DefaultApi {
  constructor(apiKey: string, basePath = 'https://api.bondmcp.com') {
    const config = new Configuration({
      apiKey: \`Bearer \${apiKey}\`,
      basePath
    });
    super(config);
  }
}

export { Configuration };
`;
      
      fs.writeFileSync(indexPath, indexContent);
      
      console.log('✅ TypeScript SDK generated successfully');
      return targetSrcDir;
      
    } catch (error) {
      console.error('❌ Failed to generate TypeScript SDK:', error.message);
      throw error;
    } finally {
      // Clean up temp directory
      if (fs.existsSync(tempDir)) {
        execSync(`rm -rf ${tempDir}`);
      }
    }
  }

  /**
   * Generate Python SDK
   */
  generatePythonSDK(specPath, version) {
    console.log(`🐍 Generating Python SDK version ${version}...`);
    
    this.ensureDirectories();
    
    const tempDir = path.join(this.rootDir, 'temp', 'py-sdk');
    
    try {
      // Clean previous generation
      if (fs.existsSync(tempDir)) {
        execSync(`rm -rf ${tempDir}`);
      }
      
      // Generate Python client
      execSync(`openapi-generator-cli generate \
        -i "${specPath}" \
        -g python \
        -o "${tempDir}" \
        --additional-properties=packageName=bondmcp_sdk,packageVersion=${version},projectName=bondmcp-sdk`, 
        { stdio: 'inherit' });
      
      // Copy generated files to proper structure
      const generatedPkgDir = path.join(tempDir, 'bondmcp_sdk');
      const targetPkgDir = path.join(this.pythonDir, 'bondmcp_sdk', 'generated');
      
      if (fs.existsSync(generatedPkgDir)) {
        execSync(`cp -r "${generatedPkgDir}"/* "${targetPkgDir}/"`);
      }
      
      // Update pyproject.toml version
      const pyprojectPath = path.join(this.rootDir, 'pyproject.toml');
      if (fs.existsSync(pyprojectPath)) {
        let content = fs.readFileSync(pyprojectPath, 'utf8');
        content = content.replace(/version = "[^"]*"/, `version = "${version}"`);
        fs.writeFileSync(pyprojectPath, content);
      }
      
      // Create __init__.py that exports generated client
      const initPath = path.join(this.pythonDir, 'bondmcp_sdk', '__init__.py');
      const initContent = `"""
BondMCP Python SDK

Auto-generated Python SDK for BondMCP
Version: ${version}
Generated from OpenAPI specification
"""

__version__ = "${version}"

# Import generated client
from .generated import *
from .generated.api.default_api import DefaultApi
from .generated.configuration import Configuration

class BondMCPClient(DefaultApi):
    """Main BondMCP client class"""
    
    def __init__(self, api_key: str, base_path: str = "https://api.bondmcp.com"):
        config = Configuration(
            api_key={"Authorization": f"Bearer {api_key}"},
            host=base_path
        )
        super().__init__(api_client=None)
        self.api_client.configuration = config

__all__ = ["BondMCPClient", "Configuration", "__version__"]
`;
      
      fs.writeFileSync(initPath, initContent);
      
      console.log('✅ Python SDK generated successfully');
      return targetPkgDir;
      
    } catch (error) {
      console.error('❌ Failed to generate Python SDK:', error.message);
      throw error;
    } finally {
      // Clean up temp directory
      if (fs.existsSync(tempDir)) {
        execSync(`rm -rf ${tempDir}`);
      }
    }
  }

  /**
   * Build TypeScript SDK
   */
  buildTypeScriptSDK() {
    console.log('🔨 Building TypeScript SDK...');
    
    try {
      const originalDir = process.cwd();
      process.chdir(this.jsDir);
      
      // Install dependencies
      execSync('npm install', { stdio: 'inherit' });
      
      // Build the SDK
      execSync('npm run build', { stdio: 'inherit' });
      
      process.chdir(originalDir);
      console.log('✅ TypeScript SDK built successfully');
      
    } catch (error) {
      console.error('❌ Failed to build TypeScript SDK:', error.message);
      throw error;
    }
  }

  /**
   * Build Python SDK
   */
  buildPythonSDK() {
    console.log('🐍 Building Python SDK...');
    
    try {
      const originalDir = process.cwd();
      process.chdir(this.rootDir);
      
      // Build using hatch
      execSync('python -m hatch build', { stdio: 'inherit' });
      
      process.chdir(originalDir);
      console.log('✅ Python SDK built successfully');
      
    } catch (error) {
      console.error('❌ Failed to build Python SDK:', error.message);
      throw error;
    }
  }

  /**
   * Generate both SDKs
   */
  generateAll(specPath, version) {
    console.log(`🚀 Generating SDKs for version ${version}...`);
    
    try {
      this.generateTypeScriptSDK(specPath, version);
      this.generatePythonSDK(specPath, version);
      
      this.buildTypeScriptSDK();
      this.buildPythonSDK();
      
      console.log('✅ All SDKs generated and built successfully');
      
    } catch (error) {
      console.error('❌ SDK generation failed:', error.message);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const generator = new SDKGenerator();
  const command = process.argv[2];
  
  switch (command) {
    case 'install-tools':
      generator.installTools();
      break;
      
    case 'check-deps':
      generator.checkDependencies();
      break;
      
    case 'typescript':
      const tsSpecPath = process.argv[3];
      const tsVersion = process.argv[4];
      if (!tsSpecPath || !tsVersion) {
        console.error('Usage: node sdk-generator.js typescript <spec-path> <version>');
        process.exit(1);
      }
      generator.generateTypeScriptSDK(tsSpecPath, tsVersion);
      generator.buildTypeScriptSDK();
      break;
      
    case 'python':
      const pySpecPath = process.argv[3];
      const pyVersion = process.argv[4];
      if (!pySpecPath || !pyVersion) {
        console.error('Usage: node sdk-generator.js python <spec-path> <version>');
        process.exit(1);
      }
      generator.generatePythonSDK(pySpecPath, pyVersion);
      generator.buildPythonSDK();
      break;
      
    case 'all':
      const allSpecPath = process.argv[3];
      const allVersion = process.argv[4];
      if (!allSpecPath || !allVersion) {
        console.error('Usage: node sdk-generator.js all <spec-path> <version>');
        process.exit(1);
      }
      generator.generateAll(allSpecPath, allVersion);
      break;
      
    default:
      console.log(`SDK Generator

Usage: node sdk-generator.js <command> [args]

Commands:
  install-tools                     Install required SDK generation tools
  check-deps                        Check if dependencies are installed
  typescript <spec-path> <version>  Generate TypeScript SDK
  python <spec-path> <version>      Generate Python SDK
  all <spec-path> <version>         Generate both SDKs

Examples:
  node sdk-generator.js install-tools
  node sdk-generator.js all openapi/latest.json 1.0.0
  node sdk-generator.js typescript spec.json 1.0.0
`);
      process.exit(1);
  }
}

module.exports = SDKGenerator;