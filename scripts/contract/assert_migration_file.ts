#!/usr/bin/env node

/**
 * Migration File Assertion Script
 * 
 * Ensures migration files exist for minor or major contract changes.
 * Reads diff classification and validates required migration documentation.
 */

import * as fs from 'fs';
import * as path from 'path';

interface DiffClassification {
  semanticChange: 'patch' | 'minor' | 'major';
  summary?: string;
  breakingChanges?: string[];
  addedEndpoints?: string[];
  removedEndpoints?: string[];
  modifiedEndpoints?: string[];
}

interface MigrationFile {
  path: string;
  exists: boolean;
  content?: string;
  version?: string;
}

/**
 * Read diff classification from file or environment
 */
function readDiffClassification(classificationPath?: string): DiffClassification | null {
  try {
    // Try from command line argument
    if (classificationPath && fs.existsSync(classificationPath)) {
      const content = fs.readFileSync(classificationPath, 'utf8');
      return JSON.parse(content);
    }

    // Try from environment variable
    const envClassification = process.env.DIFF_CLASSIFICATION;
    if (envClassification) {
      return JSON.parse(envClassification);
    }

    // Try from default artifact path
    const defaultPath = path.join(process.cwd(), 'diff_classification.json');
    if (fs.existsSync(defaultPath)) {
      const content = fs.readFileSync(defaultPath, 'utf8');
      return JSON.parse(content);
    }

    return null;
  } catch (error) {
    console.error('Error reading diff classification:', error);
    return null;
  }
}

/**
 * Find migration files in the MIGRATIONS directory
 */
function findMigrationFiles(migrationsDir: string = 'MIGRATIONS'): MigrationFile[] {
  const migrationFiles: MigrationFile[] = [];
  
  if (!fs.existsSync(migrationsDir)) {
    return migrationFiles;
  }

  try {
    const files = fs.readdirSync(migrationsDir);
    
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile() && (file.endsWith('.md') || file.endsWith('.txt'))) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract version from filename if possible
        const versionMatch = file.match(/v?(\d+\.\d+(?:\.\d+)?)/);
        const version = versionMatch ? versionMatch[1] : undefined;
        
        migrationFiles.push({
          path: filePath,
          exists: true,
          content,
          version
        });
      }
    }
  } catch (error) {
    console.error('Error reading migrations directory:', error);
  }

  return migrationFiles;
}

/**
 * Check if migration file content is adequate
 */
function validateMigrationContent(content: string, classification: DiffClassification): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const contentLower = content.toLowerCase();

  // Check minimum content length
  if (content.trim().length < 50) {
    issues.push('Migration file is too short (minimum 50 characters required)');
  }

  // Check for breaking changes documentation
  if (classification.semanticChange === 'major') {
    if (!contentLower.includes('breaking') && !contentLower.includes('backward incompatible')) {
      issues.push('Major version changes must document breaking changes');
    }
  }

  // Check for general migration guidance
  const migrationKeywords = ['migrate', 'migration', 'upgrade', 'update', 'change'];
  const hasMigrationGuidance = migrationKeywords.some(keyword => contentLower.includes(keyword));
  
  if (!hasMigrationGuidance) {
    issues.push('Migration file should include migration or upgrade guidance');
  }

  // Check for version information
  if (!contentLower.includes('version') && !content.match(/\d+\.\d+/)) {
    issues.push('Migration file should specify version information');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Generate a template migration file
 */
function generateMigrationTemplate(classification: DiffClassification): string {
  const version = process.env.CONTRACT_VERSION || 'x.x.x';
  const changeType = classification.semanticChange.toUpperCase();
  
  let template = `# Migration Guide - Version ${version}

## Overview
This ${changeType} version update includes the following changes:

${classification.summary || 'API contract changes detected.'}

## Migration Steps

### 1. Update Dependencies
Update your BondMCP SDK to version ${version}:

\`\`\`bash
# npm
npm install @bondmcp/sdk@${version}

# pip
pip install bondmcp-sdk==${version}
\`\`\`

`;

  if (classification.semanticChange === 'major') {
    template += `## ⚠️ Breaking Changes

${classification.breakingChanges ? classification.breakingChanges.map(change => `- ${change}`).join('\n') : '- Review the API changes below'}

### Required Actions
1. Review all breaking changes listed above
2. Update your code to handle the new API contract
3. Test your integration thoroughly before deploying

`;
  }

  if (classification.addedEndpoints && classification.addedEndpoints.length > 0) {
    template += `## New Endpoints
The following endpoints have been added:

${classification.addedEndpoints.map(endpoint => `- ${endpoint}`).join('\n')}

`;
  }

  if (classification.removedEndpoints && classification.removedEndpoints.length > 0) {
    template += `## Removed Endpoints
The following endpoints have been removed:

${classification.removedEndpoints.map(endpoint => `- ${endpoint}`).join('\n')}

`;
  }

  if (classification.modifiedEndpoints && classification.modifiedEndpoints.length > 0) {
    template += `## Modified Endpoints
The following endpoints have been modified:

${classification.modifiedEndpoints.map(endpoint => `- ${endpoint}`).join('\n')}

`;
  }

  template += `## Testing
After updating, verify your integration:

1. Run your test suite
2. Check all API endpoints you use
3. Validate responses match your expectations

## Support
If you encounter issues during migration:

- **Email**: support@bondmcp.com
- **Discord**: https://discord.gg/bondmcp
- **GitHub Issues**: https://github.com/bondmcp/sdk-issues

---
*Generated on ${new Date().toISOString()}*
`;

  return template;
}

/**
 * Main function
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    const classificationPath = args[0];
    const migrationsDir = args[1] || 'MIGRATIONS';

    // Read diff classification
    const classification = readDiffClassification(classificationPath);
    if (!classification) {
      console.error('Error: Could not read diff classification');
      console.error('Provide classification file path or set DIFF_CLASSIFICATION environment variable');
      process.exit(1);
    }

    console.log(`Diff classification: ${classification.semanticChange}`);

    // Check if migration assertion is needed
    if (classification.semanticChange === 'patch') {
      console.log('✅ Patch version change - no migration file required');
      
      const metadata = {
        action: 'skip',
        reason: 'patch_version',
        semantic_change: classification.semanticChange
      };
      console.log(JSON.stringify(metadata));
      process.exit(0);
    }

    // For minor/major changes, ensure migration file exists
    console.log(`${classification.semanticChange.toUpperCase()} version change detected - checking for migration files...`);

    // Find existing migration files
    const migrationFiles = findMigrationFiles(migrationsDir);
    
    if (migrationFiles.length === 0) {
      console.error(`❌ No migration files found in ${migrationsDir}/ directory`);
      console.error(`${classification.semanticChange.toUpperCase()} changes require migration documentation`);
      
      // Create migrations directory if it doesn't exist
      if (!fs.existsSync(migrationsDir)) {
        fs.mkdirSync(migrationsDir, { recursive: true });
        console.log(`Created ${migrationsDir}/ directory`);
      }

      // Generate template migration file
      const version = process.env.CONTRACT_VERSION || new Date().toISOString().split('T')[0];
      const templatePath = path.join(migrationsDir, `v${version}.md`);
      const template = generateMigrationTemplate(classification);
      
      fs.writeFileSync(templatePath, template);
      console.log(`📝 Generated migration template: ${templatePath}`);
      console.error(`Please review and complete the migration documentation before proceeding`);
      process.exit(1);
    }

    // Validate existing migration files
    let hasValidMigration = false;
    const validationResults: any[] = [];

    for (const migrationFile of migrationFiles) {
      if (migrationFile.content) {
        const validation = validateMigrationContent(migrationFile.content, classification);
        validationResults.push({
          file: migrationFile.path,
          valid: validation.valid,
          issues: validation.issues
        });

        if (validation.valid) {
          hasValidMigration = true;
        }
      }
    }

    // Report results
    if (hasValidMigration) {
      console.log(`✅ Valid migration documentation found in ${migrationsDir}/`);
      
      const metadata = {
        action: 'validated',
        semantic_change: classification.semanticChange,
        migrations_dir: migrationsDir,
        migration_files: migrationFiles.map(f => f.path),
        validation_results: validationResults
      };
      console.log(JSON.stringify(metadata));
    } else {
      console.error(`❌ No valid migration documentation found in ${migrationsDir}/`);
      
      for (const result of validationResults) {
        console.error(`\nFile: ${result.file}`);
        for (const issue of result.issues) {
          console.error(`  - ${issue}`);
        }
      }
      
      console.error('\nPlease address the issues above before proceeding');
      process.exit(1);
    }

  } catch (error) {
    console.error('Error during migration assertion:', error);
    process.exit(1);
  }
}

// Only run main if this script is executed directly
if (require.main === module) {
  main();
}

export { readDiffClassification, findMigrationFiles, validateMigrationContent, generateMigrationTemplate };