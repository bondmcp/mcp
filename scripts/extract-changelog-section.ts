#!/usr/bin/env node

/**
 * Extract CHANGELOG section for a specific version
 * Used by release workflows to generate GitHub Release notes
 */

import * as fs from 'fs';
import * as path from 'path';

interface ChangelogEntry {
  version: string;
  date?: string;
  content: string;
}

/**
 * Extract changelog section for a specific version
 */
function extractChangelogSection(changelogPath: string, version: string): ChangelogEntry | null {
  if (!fs.existsSync(changelogPath)) {
    throw new Error(`Changelog file not found: ${changelogPath}`);
  }

  const content = fs.readFileSync(changelogPath, 'utf-8');
  const lines = content.split('\n');

  let inSection = false;
  let sectionLines: string[] = [];
  let extractedDate: string | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for version header (## [version] - date or ## [version])
    const versionMatch = line.match(/^##\s*\[([^\]]+)\](?:\s*-\s*(.+))?$/);
    
    if (versionMatch) {
      const [, foundVersion, date] = versionMatch;
      
      if (foundVersion === version) {
        inSection = true;
        extractedDate = date?.trim();
        continue; // Skip the header line itself
      } else if (inSection) {
        // We've hit the next version section, stop
        break;
      }
    }

    if (inSection) {
      // Stop if we hit another ## header (next version)
      if (line.startsWith('## ') && !line.startsWith('### ')) {
        break;
      }
      sectionLines.push(line);
    }
  }

  if (!inSection) {
    return null; // Version not found
  }

  // Remove trailing empty lines
  while (sectionLines.length > 0 && sectionLines[sectionLines.length - 1].trim() === '') {
    sectionLines.pop();
  }

  return {
    version,
    date: extractedDate,
    content: sectionLines.join('\n').trim()
  };
}

/**
 * CLI interface
 */
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: extract-changelog-section.ts <version> [changelog-path]

Arguments:
  version         Version to extract (e.g., "1.0.0")
  changelog-path  Path to CHANGELOG.md (default: CHANGELOG.md)

Examples:
  extract-changelog-section.ts 1.0.0
  extract-changelog-section.ts 1.0.0 docs/CHANGELOG.md
  
Description:
  Extracts the changelog section for a specific version for use in
  GitHub Release notes and other documentation.
    `);
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
  }

  const version = args[0];
  const changelogPath = path.resolve(args[1] || 'CHANGELOG.md');

  try {
    const entry = extractChangelogSection(changelogPath, version);

    if (!entry) {
      console.error(`❌ Version ${version} not found in changelog`);
      process.exit(1);
    }

    // Output the content for use in scripts
    console.log(entry.content);

    // Also output metadata to stderr for debugging
    console.error(`✅ Extracted changelog for version ${version}${entry.date ? ` (${entry.date})` : ''}`);

  } catch (error: any) {
    console.error(`❌ Error extracting changelog: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { extractChangelogSection, ChangelogEntry };