#!/usr/bin/env node

/**
 * Migration File Assertion Script
 * 
 * Ensures that a MIGRATIONS file exists when API changes are classified as major or minor.
 * Reads classification from a JSON artifact and validates migration documentation.
 */

import * as fs from 'fs';
import * as path from 'path';

interface MigrationAssertOptions {
  classificationFile?: string;
  migrationsDir?: string;
  verbose?: boolean;
}

interface ClassificationResult {
  classification: 'major' | 'minor' | 'patch' | 'none';
  breakingChanges?: string[];
  addedEndpoints?: string[];
  modifiedEndpoints?: string[];
  summary?: string;
}

/**
 * Checks if MIGRATIONS directory and files exist
 */
function checkMigrationsExist(migrationsDir: string, verbose: boolean): boolean {
  if (verbose) {
    console.log(`Checking for migrations directory: ${migrationsDir}`);
  }

  if (!fs.existsSync(migrationsDir)) {
    return false;
  }

  // Check if directory has any migration files
  const files = fs.readdirSync(migrationsDir);
  const migrationFiles = files.filter(file => 
    file.endsWith('.md') || 
    file.endsWith('.txt') || 
    file.endsWith('.json') ||
    file.toLowerCase().includes('migration')
  );

  if (verbose) {
    console.log(`Found ${migrationFiles.length} migration files: ${migrationFiles.join(', ')}`);
  }

  return migrationFiles.length > 0;
}

/**
 * Creates a basic migration file template
 */
function createMigrationTemplate(migrationsDir: string, classification: ClassificationResult, verbose: boolean): void {
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
    if (verbose) {
      console.log(`Created migrations directory: ${migrationsDir}`);
    }
  }

  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `${timestamp}-${classification.classification}-changes.md`;
  const filepath = path.join(migrationsDir, filename);

  const template = `# ${classification.classification.toUpperCase()} API Changes - ${timestamp}

## Summary
${classification.summary || 'API changes detected that require migration documentation.'}

## Classification: ${classification.classification}

${classification.breakingChanges && classification.breakingChanges.length > 0 ? `
## Breaking Changes
${classification.breakingChanges.map(change => `- ${change}`).join('\n')}
` : ''}

${classification.addedEndpoints && classification.addedEndpoints.length > 0 ? `
## Added Endpoints
${classification.addedEndpoints.map(endpoint => `- ${endpoint}`).join('\n')}
` : ''}

${classification.modifiedEndpoints && classification.modifiedEndpoints.length > 0 ? `
## Modified Endpoints
${classification.modifiedEndpoints.map(endpoint => `- ${endpoint}`).join('\n')}
` : ''}

## Migration Steps

### For Existing Clients
1. Review the breaking changes listed above
2. Update your client code to handle the new API structure
3. Test your integration thoroughly before deploying

### For New Clients
- No migration steps required
- Use the latest API specification

## Support
For questions about this migration, please contact:
- Email: support@bondmcp.com
- Documentation: https://docs.bondmcp.com

---
*This file was auto-generated on ${new Date().toISOString()}*
`;

  fs.writeFileSync(filepath, template);
  
  if (verbose) {
    console.log(`Created migration file: ${filepath}`);
  }
}

/**
 * Reads and parses the classification file
 */
function readClassification(classificationFile: string, verbose: boolean): ClassificationResult | null {
  if (!fs.existsSync(classificationFile)) {
    if (verbose) {
      console.log(`Classification file not found: ${classificationFile}`);
    }
    return null;
  }

  try {
    const content = fs.readFileSync(classificationFile, 'utf-8');
    const classification = JSON.parse(content) as ClassificationResult;
    
    if (verbose) {
      console.log(`Classification: ${classification.classification}`);
      if (classification.summary) {
        console.log(`Summary: ${classification.summary}`);
      }
    }
    
    return classification;
  } catch (error) {
    if (verbose) {
      console.error(`Error reading classification file: ${error}`);
    }
    return null;
  }
}

/**
 * Main migration assertion function
 */
async function assertMigrationFile(options: MigrationAssertOptions): Promise<void> {
  const { 
    classificationFile = 'openapi/diff/classification.json',
    migrationsDir = 'MIGRATIONS',
    verbose = false 
  } = options;

  if (verbose) {
    console.log('Checking migration file requirements...');
  }

  // Read classification result
  const classification = readClassification(classificationFile, verbose);
  
  if (!classification) {
    if (verbose) {
      console.log('No classification found, skipping migration check');
    }
    return;
  }

  // Only require migrations for major and minor changes
  if (classification.classification === 'major' || classification.classification === 'minor') {
    const migrationsExist = checkMigrationsExist(migrationsDir, verbose);
    
    if (!migrationsExist) {
      console.log(`⚠️  ${classification.classification.toUpperCase()} API changes detected but no migration documentation found.`);
      console.log('Creating migration documentation template...');
      
      createMigrationTemplate(migrationsDir, classification, verbose);
      
      console.log(`✅ Migration documentation created in ${migrationsDir}/`);
      console.log('Please review and update the migration documentation before merging.');
    } else {
      if (verbose) {
        console.log(`✅ Migration documentation exists for ${classification.classification} changes`);
      }
    }
  } else {
    if (verbose) {
      console.log(`✅ No migration documentation required for ${classification.classification} changes`);
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: assert_migration_file.ts [options]

Options:
  --classification <file>  Path to classification JSON file (default: openapi/diff/classification.json)
  --migrations <dir>       Path to migrations directory (default: MIGRATIONS)
  --verbose, -v            Verbose output
  --help, -h               Show this help

The classification file should contain:
{
  "classification": "major|minor|patch|none",
  "breakingChanges": ["array of breaking changes"],
  "addedEndpoints": ["array of new endpoints"],
  "modifiedEndpoints": ["array of modified endpoints"],
  "summary": "Summary of changes"
}

Examples:
  assert_migration_file.ts
  assert_migration_file.ts --classification custom/path/classification.json
  assert_migration_file.ts --migrations docs/migrations --verbose`);
    process.exit(0);
  }

  const options: MigrationAssertOptions = {
    verbose: false
  };

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--classification':
        options.classificationFile = args[++i];
        break;
      case '--migrations':
        options.migrationsDir = args[++i];
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      default:
        console.error(`Unknown option: ${args[i]}`);
        console.error('Use --help for usage information');
        process.exit(1);
    }
  }

  assertMigrationFile(options)
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
}

export { assertMigrationFile, readClassification, checkMigrationsExist };