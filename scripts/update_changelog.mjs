#!/usr/bin/env node

/**
 * Changelog Update Automation
 * 
 * Automatically updates CHANGELOG.md with new API version entries.
 * Generates structured changelog sections with proper formatting.
 */

import fs from 'fs';
import path from 'path';

const CHANGELOG_FILE = 'CHANGELOG.md';
const API_CHANGELOG_FILE = 'docs/api/changelog.md';

/**
 * Parse existing changelog content
 */
function parseChangelog(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        version: line.replace('## ', '').trim(),
        content: [line]
      };
    } else if (currentSection) {
      currentSection.content.push(line);
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Generate changelog entry for a new version
 */
function generateChangelogEntry(version, changeType, options = {}) {
  const date = new Date().toISOString().split('T')[0];
  const {
    hasBreakingChanges = false,
    migrationFile = null,
    diffFile = null,
    customSections = {}
  } = options;
  
  let entry = `## [${version}] - ${date}\n\n`;
  
  // Add version summary
  entry += `### API Changes\n`;
  entry += `- Updated to OpenAPI specification version ${version}\n`;
  
  if (migrationFile) {
    entry += `- Migration guide: [${migrationFile}](${migrationFile})\n`;
  }
  
  if (diffFile) {
    entry += `- Semantic diff: [${diffFile}](${diffFile})\n`;
  }
  
  if (hasBreakingChanges) {
    entry += `- ⚠️ **Breaking changes included** - review migration guide\n`;
  }
  
  entry += `\n`;
  
  // Add standard sections
  const sections = [
    'Added',
    'Changed', 
    'Deprecated',
    'Removed',
    'Fixed',
    'Security'
  ];
  
  for (const section of sections) {
    if (customSections[section.toLowerCase()]) {
      entry += `### ${section}\n`;
      for (const item of customSections[section.toLowerCase()]) {
        entry += `- ${item}\n`;
      }
      entry += `\n`;
    } else if (hasBreakingChanges && section === 'Changed') {
      entry += `### ${section}\n`;
      entry += `- Breaking changes introduced in this version\n`;
      entry += `\n`;
    }
  }
  
  // Add SDK information
  entry += `### SDK Updates\n`;
  entry += `- TypeScript SDK (@bondmcp/sdk) version ${version}\n`;
  entry += `- Python SDK (bondmcp_sdk) version ${version}\n`;
  entry += `\n`;
  
  return entry;
}

/**
 * Update CHANGELOG.md with new entry
 */
function updateChangelog(version, changeType, options = {}) {
  const changelogPath = CHANGELOG_FILE;
  
  // Read existing changelog or create new one
  let existingContent = '';
  if (fs.existsSync(changelogPath)) {
    existingContent = fs.readFileSync(changelogPath, 'utf8');
  } else {
    existingContent = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n`;
  }
  
  // Check if version already exists
  if (existingContent.includes(`## [${version}]`)) {
    console.log(`⚠️ Version ${version} already exists in changelog, skipping update`);
    return false;
  }
  
  // Generate new entry
  const newEntry = generateChangelogEntry(version, changeType, options);
  
  // Find the position to insert (after header, before first existing entry)
  const lines = existingContent.split('\n');
  let insertIndex = lines.length;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## [')) {
      insertIndex = i;
      break;
    }
  }
  
  // Insert new entry
  const beforeLines = lines.slice(0, insertIndex);
  const afterLines = lines.slice(insertIndex);
  
  const updatedContent = [
    ...beforeLines,
    newEntry.trim(),
    '',
    ...afterLines
  ].join('\n');
  
  // Write updated changelog
  fs.writeFileSync(changelogPath, updatedContent);
  console.log(`✅ Updated ${changelogPath} with version ${version}`);
  
  return true;
}

/**
 * Update API-specific changelog
 */
function updateApiChangelog(version, changeType, options = {}) {
  const apiChangelogPath = API_CHANGELOG_FILE;
  const {
    migrationFile = null,
    diffFile = null,
    hasBreakingChanges = false
  } = options;
  
  // Ensure directory exists
  const apiDir = path.dirname(apiChangelogPath);
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  // Read existing content or create new
  let existingContent = '';
  if (fs.existsSync(apiChangelogPath)) {
    existingContent = fs.readFileSync(apiChangelogPath, 'utf8');
  } else {
    existingContent = `# API Changelog\n\nThis file tracks all changes to the BondMCP API in reverse chronological order.\n\n## Format\n\nEach entry includes:\n- **Version**: The API version number\n- **Date**: When the version was released\n- **Changes**: Summary of changes made\n- **Migration**: Link to migration guide if applicable\n\n---\n\n`;
  }
  
  // Check if version already exists
  if (existingContent.includes(`## [${version}]`)) {
    console.log(`⚠️ Version ${version} already exists in API changelog, skipping update`);
    return false;
  }
  
  // Generate API changelog entry
  const date = new Date().toISOString().split('T')[0];
  let apiEntry = `## [${version}] - ${date}\n\n`;
  apiEntry += `### Changes\n`;
  apiEntry += `- API specification updated to version ${version}\n`;
  
  if (hasBreakingChanges) {
    apiEntry += `- ⚠️ **Breaking changes included**\n`;
  }
  
  if (migrationFile) {
    apiEntry += `- Migration guide: [${migrationFile}](../../${migrationFile})\n`;
  }
  
  if (diffFile) {
    apiEntry += `- Semantic diff: [${diffFile}](../../${diffFile})\n`;
  }
  
  apiEntry += `\n### Impact\n`;
  apiEntry += `- Change type: \`${changeType}\`\n`;
  apiEntry += `- Breaking: ${hasBreakingChanges ? 'Yes' : 'No'}\n`;
  apiEntry += `\n`;
  
  // Find insertion point (after header section)
  const lines = existingContent.split('\n');
  let insertIndex = lines.length;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## [') || (lines[i] === '---' && i < lines.length - 1)) {
      if (lines[i] === '---') {
        insertIndex = i + 2; // After the separator
      } else {
        insertIndex = i;
      }
      break;
    }
  }
  
  // Insert new entry
  const beforeLines = lines.slice(0, insertIndex);
  const afterLines = lines.slice(insertIndex);
  
  const updatedContent = [
    ...beforeLines,
    apiEntry.trim(),
    '',
    ...afterLines
  ].join('\n');
  
  fs.writeFileSync(apiChangelogPath, updatedContent);
  console.log(`✅ Updated ${apiChangelogPath} with version ${version}`);
  
  return true;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('📝 Changelog Update Automation');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/update_changelog.mjs <version> <change_type> [options]');
    console.log('');
    console.log('Arguments:');
    console.log('  version      - Version number (e.g., 1.2.0)');
    console.log('  change_type  - Type of change (major, minor, patch)');
    console.log('');
    console.log('Options:');
    console.log('  --breaking           - Mark as breaking change');
    console.log('  --migration <file>   - Path to migration guide');
    console.log('  --diff <file>        - Path to semantic diff');
    console.log('  --api-only           - Update only API changelog');
    console.log('  --main-only          - Update only main changelog');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/update_changelog.mjs 1.2.0 minor');
    console.log('  node scripts/update_changelog.mjs 2.0.0 major --breaking --migration MIGRATIONS/1.x-to-2.0.md');
    console.log('');
    return;
  }
  
  const version = args[0];
  const changeType = args[1];
  
  // Parse options
  const options = {
    hasBreakingChanges: args.includes('--breaking'),
    migrationFile: null,
    diffFile: null,
    apiOnly: args.includes('--api-only'),
    mainOnly: args.includes('--main-only')
  };
  
  // Extract option values
  const migrationIndex = args.indexOf('--migration');
  if (migrationIndex !== -1 && migrationIndex + 1 < args.length) {
    options.migrationFile = args[migrationIndex + 1];
  }
  
  const diffIndex = args.indexOf('--diff');
  if (diffIndex !== -1 && diffIndex + 1 < args.length) {
    options.diffFile = args[diffIndex + 1];
  }
  
  // Validate change type
  if (!['major', 'minor', 'patch'].includes(changeType)) {
    console.error(`❌ Invalid change type: ${changeType}`);
    console.error('   Must be one of: major, minor, patch');
    process.exit(1);
  }
  
  // Validate version format
  const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  if (!semverRegex.test(version)) {
    console.error(`❌ Invalid version format: ${version}`);
    console.error('   Must be valid semver (e.g., 1.2.0)');
    process.exit(1);
  }
  
  try {
    console.log(`📝 Updating changelogs for version ${version} (${changeType})`);
    
    let updated = false;
    
    // Update main changelog
    if (!options.apiOnly) {
      const mainUpdated = updateChangelog(version, changeType, options);
      updated = updated || mainUpdated;
    }
    
    // Update API changelog
    if (!options.mainOnly) {
      const apiUpdated = updateApiChangelog(version, changeType, options);
      updated = updated || apiUpdated;
    }
    
    if (updated) {
      console.log('');
      console.log('✅ Changelog update completed!');
      console.log('');
      console.log('📋 Summary:');
      console.log(`   Version: ${version}`);
      console.log(`   Change Type: ${changeType}`);
      console.log(`   Breaking: ${options.hasBreakingChanges ? 'Yes' : 'No'}`);
      if (options.migrationFile) {
        console.log(`   Migration: ${options.migrationFile}`);
      }
      if (options.diffFile) {
        console.log(`   Diff: ${options.diffFile}`);
      }
    } else {
      console.log('ℹ️ No changelog updates needed (version already exists)');
    }
    
  } catch (error) {
    console.error('❌ Error updating changelog:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { updateChangelog, updateApiChangelog, generateChangelogEntry };