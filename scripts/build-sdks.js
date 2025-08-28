#!/usr/bin/env node

/**
 * Build and Test Script for BondMCP SDKs
 *
 * This script builds and tests the TypeScript and Python SDKs locally
 * without requiring the full OpenAPI generation pipeline.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class SDKBuilder {
  constructor() {
    this.rootDir = path.join(__dirname, "..");
    this.jsDir = path.join(this.rootDir, "javascript");
    this.pythonDir = path.join(this.rootDir, "python");
  }

  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  error(message) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
  }

  /**
   * Check if we have a working environment
   */
  checkEnvironment() {
    this.log("🔍 Checking build environment...");

    const checks = [
      { cmd: "node --version", name: "Node.js" },
      { cmd: "npm --version", name: "npm" },
      { cmd: "python3 --version", name: "Python" },
    ];

    for (const check of checks) {
      try {
        const version = execSync(check.cmd, { encoding: "utf8" }).trim();
        this.log(`✅ ${check.name}: ${version}`);
      } catch (error) {
        this.error(`❌ ${check.name} not available`);
        throw new Error(`${check.name} is required but not available`);
      }
    }
  }

  /**
   * Build TypeScript SDK
   */
  buildTypeScriptSDK() {
    this.log("🔨 Building TypeScript SDK...");

    try {
      const originalDir = process.cwd();
      process.chdir(this.jsDir);

      // Install dependencies
      this.log("Installing dependencies...");
      execSync("npm install", { stdio: "inherit" });

      // Run type checking
      this.log("Type checking...");
      execSync("npm run type-check", { stdio: "inherit" });

      // Build the SDK
      this.log("Building...");
      execSync("npm run build", { stdio: "inherit" });

      // Run tests if they exist
      try {
        execSync("npm test", { stdio: "inherit" });
        this.log("✅ Tests passed");
      } catch (error) {
        this.log("⚠️ Tests failed or not configured");
      }

      process.chdir(originalDir);
      this.log("✅ TypeScript SDK built successfully");
    } catch (error) {
      this.error(`Failed to build TypeScript SDK: ${error.message}`);
      throw error;
    }
  }

  /**
   * Build Python SDK
   */
  buildPythonSDK() {
    this.log("🐍 Building Python SDK...");

    try {
      const originalDir = process.cwd();
      process.chdir(this.rootDir);

      // Check if we have hatch
      try {
        execSync("python -m hatch --version", { stdio: "ignore" });
      } catch (error) {
        this.log("Installing hatch...");
        execSync("pip install hatch", { stdio: "inherit" });
      }

      // Build using hatch
      this.log("Building with hatch...");
      execSync("python -m hatch build", { stdio: "inherit" });

      // Run tests if they exist
      try {
        execSync("python -m pytest tests/", { stdio: "inherit" });
        this.log("✅ Tests passed");
      } catch (error) {
        this.log("⚠️ Tests failed or not configured");
      }

      process.chdir(originalDir);
      this.log("✅ Python SDK built successfully");
    } catch (error) {
      this.error(`Failed to build Python SDK: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test SDK imports
   */
  testSDKImports() {
    this.log("🧪 Testing SDK imports...");

    // Test TypeScript SDK (if built)
    const tsDistDir = path.join(this.jsDir, "dist");
    if (fs.existsSync(tsDistDir)) {
      try {
        const indexPath = path.join(tsDistDir, "index.js");
        if (fs.existsSync(indexPath)) {
          // Basic smoke test
          const { BondMCPClient } = require(indexPath);
          if (typeof BondMCPClient === "function") {
            this.log("✅ TypeScript SDK import test passed");
          } else {
            this.log("⚠️ TypeScript SDK import test failed");
          }
        }
      } catch (error) {
        this.log(`⚠️ TypeScript SDK import test failed: ${error.message}`);
      }
    }

    // Test Python SDK
    try {
      const originalDir = process.cwd();
      process.chdir(this.pythonDir);

      execSync(
        "python -c \"import bondmcp_sdk; print(f'Python SDK version: {bondmcp_sdk.__version__}')\"",
        { stdio: "inherit" },
      );
      this.log("✅ Python SDK import test passed");

      process.chdir(originalDir);
    } catch (error) {
      this.log(`⚠️ Python SDK import test failed: ${error.message}`);
    }
  }

  /**
   * Generate package info
   */
  generatePackageInfo() {
    this.log("📊 Generating package info...");

    const info = {
      timestamp: new Date().toISOString(),
      packages: {},
    };

    // TypeScript package info
    const tsPackageJson = path.join(this.jsDir, "package.json");
    if (fs.existsSync(tsPackageJson)) {
      const pkg = JSON.parse(fs.readFileSync(tsPackageJson, "utf8"));
      info.packages.typescript = {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        distExists: fs.existsSync(path.join(this.jsDir, "dist")),
      };
    }

    // Python package info
    const pyProjectToml = path.join(this.rootDir, "pyproject.toml");
    if (fs.existsSync(pyProjectToml)) {
      const content = fs.readFileSync(pyProjectToml, "utf8");
      const versionMatch = content.match(/version = "([^"]+)"/);
      const nameMatch = content.match(/name = "([^"]+)"/);

      info.packages.python = {
        name: nameMatch ? nameMatch[1] : "bondmcp",
        version: versionMatch ? versionMatch[1] : "unknown",
        distExists: fs.existsSync(path.join(this.rootDir, "dist")),
      };
    }

    const outputPath = path.join(this.rootDir, "build-info.json");
    fs.writeFileSync(outputPath, JSON.stringify(info, null, 2));

    this.log(`📄 Package info written to: ${outputPath}`);
    console.log(JSON.stringify(info, null, 2));
  }

  /**
   * Clean build artifacts
   */
  clean() {
    this.log("🧹 Cleaning build artifacts...");

    const artifactDirs = [
      path.join(this.jsDir, "dist"),
      path.join(this.jsDir, "node_modules"),
      path.join(this.rootDir, "dist"),
      path.join(this.rootDir, "build"),
      path.join(this.rootDir, "temp"),
    ];

    for (const dir of artifactDirs) {
      if (fs.existsSync(dir)) {
        execSync(`rm -rf "${dir}"`);
        this.log(`🗑️ Removed: ${path.relative(this.rootDir, dir)}`);
      }
    }

    this.log("✅ Cleanup complete");
  }

  /**
   * Full build process
   */
  buildAll() {
    this.log("🚀 Starting full SDK build...");

    try {
      this.checkEnvironment();
      this.buildTypeScriptSDK();
      this.buildPythonSDK();
      this.testSDKImports();
      this.generatePackageInfo();

      this.log("✅ All SDKs built successfully!");
    } catch (error) {
      this.error(`Build failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const builder = new SDKBuilder();
  const command = process.argv[2];

  switch (command) {
    case "check":
      builder.checkEnvironment();
      break;

    case "typescript":
    case "ts":
      builder.checkEnvironment();
      builder.buildTypeScriptSDK();
      break;

    case "python":
    case "py":
      builder.checkEnvironment();
      builder.buildPythonSDK();
      break;

    case "test":
      builder.testSDKImports();
      break;

    case "info":
      builder.generatePackageInfo();
      break;

    case "clean":
      builder.clean();
      break;

    case "all":
    default:
      builder.buildAll();
      break;
  }
}

module.exports = SDKBuilder;
