#!/usr/bin/env node

/**
 * OpenAPI Spec Diff Generator
 * 
 * Generates semantic diffs between OpenAPI specification versions
 * using openapi-diff and categorizes changes for migration planning.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const OPENAPI_HISTORY_DIR = 'openapi/history';
const MIGRATIONS_DIR = 'MIGRATIONS';

/**
 * Get list of available OpenAPI versions
 */
function getAvailableVersions() {
  if (!fs.existsSync(OPENAPI_HISTORY_DIR)) {
    return [];
  }
  
  return fs.readdirSync(OPENAPI_HISTORY_DIR)
    .filter(file => file.startsWith('openapi-') && file.endsWith('.json'))
    .map(file => file.replace('openapi-', '').replace('.json', ''))
    .sort((a, b) => {
      // Sort versions semantically
      const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
      const [bMajor, bMinor, bPatch] = b.split('.').map(Number);
      
      if (aMajor !== bMajor) return aMajor - bMajor;
      if (aMinor !== bMinor) return aMinor - bMinor;
      return aPatch - bPatch;
    });
}

/**
 * Generate diff between two OpenAPI spec versions
 */
function generateDiff(fromVersion, toVersion, outputFormat = 'markdown') {
  const fromFile = path.join(OPENAPI_HISTORY_DIR, `openapi-${fromVersion}.json`);
  const toFile = path.join(OPENAPI_HISTORY_DIR, `openapi-${toVersion}.json`);
  
  if (!fs.existsSync(fromFile)) {
    throw new Error(`Source version file not found: ${fromFile}`);
  }
  
  if (!fs.existsSync(toFile)) {
    throw new Error(`Target version file not found: ${toFile}`);
  }
  
  const outputExtension = outputFormat === 'json' ? 'json' : 'md';
  const outputFile = path.join(OPENAPI_HISTORY_DIR, `diff-${fromVersion}-to-${toVersion}.${outputExtension}`);
  
  try {
    console.log(`🔍 Generating ${outputFormat} diff: ${fromVersion} → ${toVersion}`);\n    
    // Use openapi-diff tool (requires npm install -g openapi-diff)
    const command = `openapi-diff "${fromFile}" "${toFile}" --format ${outputFormat}`;
    const diffOutput = execSync(command, { encoding: 'utf8' });
    
    fs.writeFileSync(outputFile, diffOutput);
    console.log(`✅ Diff saved: ${outputFile}`);
    
    return {
      fromVersion,
      toVersion,
      outputFile,
      format: outputFormat,
      content: diffOutput
    };
  } catch (error) {
    throw new Error(`Failed to generate diff: ${error.message}`);
  }
}

/**
 * Classify changes as breaking, non-breaking, etc.
 */
function classifyChanges(diffContent, fromVersion, toVersion) {
  const classification = {
    breaking: [],
    nonBreaking: [],
    additions: [],
    removals: [],
    deprecations: []
  };
  
  // Simple heuristic classification based on diff content
  // This is a basic implementation - could be enhanced with more sophisticated analysis
  
  if (diffContent.includes('removed') || diffContent.includes('deleted')) {
    classification.breaking.push('Endpoints or properties removed');
  }
  
  if (diffContent.includes('added') || diffContent.includes('new')) {
    classification.additions.push('New endpoints or properties added');
  }
  
  if (diffContent.includes('required') && diffContent.includes('changed')) {
    classification.breaking.push('Required field changes detected');
  }
  
  if (diffContent.includes('deprecated')) {
    classification.deprecations.push('Fields or endpoints deprecated');
  }
  
  // Determine overall change type based on version difference
  const [fromMajor, fromMinor, fromPatch] = fromVersion.split('.').map(Number);
  const [toMajor, toMinor, toPatch] = toVersion.split('.').map(Number);
  
  let changeType = 'patch';
  if (toMajor > fromMajor) {
    changeType = 'major';
  } else if (toMinor > fromMinor) {
    changeType = 'minor';
  }
  
  return {
    ...classification,
    changeType,
    hasBreakingChanges: classification.breaking.length > 0
  };
}

/**
 * Generate migration guide template
 */
function generateMigrationGuide(fromVersion, toVersion, classification) {
  const migrationFile = path.join(MIGRATIONS_DIR, `${fromVersion}-to-${toVersion}.md`);
  
  // Ensure migrations directory exists
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
  }
  
  const template = `# Migration Guide: ${fromVersion} to ${toVersion}

## Overview

This guide helps you migrate from API version ${fromVersion} to ${toVersion}.

**Change Type**: \`${classification.changeType}\`  
**Breaking Changes**: ${classification.hasBreakingChanges ? '⚠️ Yes' : '✅ No'}

## Summary

${classification.hasBreakingChanges ? 
  '⚠️ **This is a breaking change release.** Please review all changes carefully and test thoroughly.' :
  '✅ **This is a non-breaking release.** Update should be safe for existing integrations.'
}

## Breaking Changes

${classification.breaking.length > 0 ? 
  classification.breaking.map(change => `- ${change}`).join('\n') :
  '_No breaking changes detected._'
}

## New Features & Additions

${classification.additions.length > 0 ? 
  classification.additions.map(change => `- ${change}`).join('\n') :
  '_No new features added._'
}

## Deprecations

${classification.deprecations.length > 0 ? 
  classification.deprecations.map(change => `- ${change}`).join('\n') :
  '_No deprecations in this release._'
}

## Migration Steps

1. **Review Changes**: Examine the semantic diff at \`openapi/history/diff-${fromVersion}-to-${toVersion}.md\`
${classification.hasBreakingChanges ? 
  '2. **Update Code**: Modify your integration to handle breaking changes\n3. **Test Thoroughly**: Run comprehensive tests with the new API version' :
  '2. **Update SDK**: Upgrade to the latest SDK version\n3. **Verify**: Test basic functionality to ensure compatibility'
}
4. **Update Documentation**: Update any internal documentation referencing the API

## SDK Updates

Update your SDK dependencies:

### TypeScript/JavaScript
\`\`\`bash
npm install @bondmcp/sdk@${toVersion}
\`\`\`

### Python
\`\`\`bash
pip install bondmcp-sdk==${toVersion}
\`\`\`

## Support

Need help with migration?
- 📖 Review: [API Documentation](../../docs/api-reference/)
- 🔍 Compare: [Semantic Diff](../openapi/history/diff-${fromVersion}-to-${toVersion}.md)
- 💬 Contact: support@bondmcp.com

---

*Generated automatically on ${new Date().toISOString().split('T')[0]}*
`;

  fs.writeFileSync(migrationFile, template);
  console.log(`✅ Migration guide created: ${migrationFile}`);
  
  return migrationFile;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔍 OpenAPI Spec Diff Generator');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/generate_spec_diff.mjs <from_version> <to_version> [format]');
    console.log('  node scripts/generate_spec_diff.mjs --list');
    console.log('  node scripts/generate_spec_diff.mjs --latest');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/generate_spec_diff.mjs 1.0.0 1.1.0');
    console.log('  node scripts/generate_spec_diff.mjs 1.0.0 1.1.0 json');
    console.log('  node scripts/generate_spec_diff.mjs --latest  # Compare latest two versions');
    console.log('');
    return;
  }
  
  try {
    const versions = getAvailableVersions();
    
    if (args[0] === '--list') {
      console.log('📋 Available OpenAPI versions:');
      versions.forEach(version => console.log(`  • ${version}`));
      return;
    }
    
    if (args[0] === '--latest') {
      if (versions.length < 2) {
        console.error('❌ Need at least 2 versions to generate diff');
        process.exit(1);
      }
      
      const fromVersion = versions[versions.length - 2];
      const toVersion = versions[versions.length - 1];
      
      console.log(`🔄 Comparing latest versions: ${fromVersion} → ${toVersion}`);
      
      // Generate both markdown and JSON diffs
      const markdownDiff = generateDiff(fromVersion, toVersion, 'markdown');
      const jsonDiff = generateDiff(fromVersion, toVersion, 'json');
      
      // Classify changes and generate migration guide
      const classification = classifyChanges(markdownDiff.content, fromVersion, toVersion);
      const migrationFile = generateMigrationGuide(fromVersion, toVersion, classification);
      
      console.log('');
      console.log('📊 Change Classification:');
      console.log(`  Type: ${classification.changeType}`);
      console.log(`  Breaking: ${classification.hasBreakingChanges ? 'Yes' : 'No'}`);
      console.log(`  Migration Guide: ${migrationFile}`);
      
      return;
    }
    
    const fromVersion = args[0];
    const toVersion = args[1];
    const format = args[2] || 'markdown';
    
    if (!versions.includes(fromVersion)) {
      console.error(`❌ Source version not found: ${fromVersion}`);
      console.error(`Available versions: ${versions.join(', ')}`);
      process.exit(1);
    }
    
    if (!versions.includes(toVersion)) {
      console.error(`❌ Target version not found: ${toVersion}`);
      console.error(`Available versions: ${versions.join(', ')}`);
      process.exit(1);
    }
    
    const diff = generateDiff(fromVersion, toVersion, format);
    
    if (format === 'markdown') {
      const classification = classifyChanges(diff.content, fromVersion, toVersion);
      const migrationFile = generateMigrationGuide(fromVersion, toVersion, classification);
      
      console.log('');
      console.log('📊 Change Classification:');
      console.log(`  Type: ${classification.changeType}`);
      console.log(`  Breaking: ${classification.hasBreakingChanges ? 'Yes' : 'No'}`);
      console.log(`  Migration Guide: ${migrationFile}`);
    }
    
    console.log('');
    console.log('✅ Diff generation completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateDiff, classifyChanges, generateMigrationGuide, getAvailableVersions };