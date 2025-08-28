#!/usr/bin/env node

/**
 * GitHub Label Application Script
 * 
 * Applies labels to GitHub pull requests using the GitHub REST API
 * Requires GITHUB_TOKEN environment variable with appropriate permissions
 */

import { Octokit } from '@octokit/rest';

interface LabelOptions {
  owner: string;
  repo: string;
  prNumber?: number;
  label: string;
  verbose?: boolean;
}

/**
 * Applies a label to a GitHub pull request
 */
async function applyLabel(options: LabelOptions): Promise<void> {
  const { owner, repo, prNumber, label, verbose = false } = options;

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  const octokit = new Octokit({
    auth: token,
  });

  if (verbose) {
    console.log(`Applying label "${label}" to PR #${prNumber} in ${owner}/${repo}`);
  }

  try {
    // Check if label exists in the repository
    let labelExists = false;
    try {
      await octokit.rest.issues.getLabel({
        owner,
        repo,
        name: label,
      });
      labelExists = true;
      if (verbose) {
        console.log(`✅ Label "${label}" exists in repository`);
      }
    } catch (error: any) {
      if (error.status === 404) {
        if (verbose) {
          console.log(`Creating label "${label}" in repository`);
        }
        // Create the label if it doesn't exist
        await octokit.rest.issues.createLabel({
          owner,
          repo,
          name: label,
          color: 'f29513', // Orange color for contract labels
          description: 'Indicates this PR involves contract/API changes',
        });
        labelExists = true;
        if (verbose) {
          console.log(`✅ Created label "${label}" in repository`);
        }
      } else {
        throw error;
      }
    }

    if (!labelExists) {
      throw new Error(`Failed to ensure label "${label}" exists`);
    }

    // Check if PR already has the label
    const { data: currentLabels } = await octokit.rest.issues.listLabelsOnIssue({
      owner,
      repo,
      issue_number: prNumber!,
    });

    const hasLabel = currentLabels.some(l => l.name === label);
    
    if (hasLabel) {
      if (verbose) {
        console.log(`✅ PR #${prNumber} already has label "${label}"`);
      }
      return;
    }

    // Add the label to the PR
    await octokit.rest.issues.addLabels({
      owner,
      repo,
      issue_number: prNumber!,
      labels: [label],
    });

    console.log(`✅ Applied label "${label}" to PR #${prNumber}`);
    
  } catch (error: any) {
    console.error(`Error applying label: ${error.message}`);
    if (error.response) {
      console.error(`HTTP ${error.status}: ${error.response.data.message}`);
    }
    throw error;
  }
}

/**
 * Gets the current PR number from GitHub Actions context
 */
function getPRNumberFromContext(): number | undefined {
  // Try to get PR number from various GitHub Actions environment variables
  const prNumber = process.env.GITHUB_PR_NUMBER || 
                  process.env.PR_NUMBER ||
                  process.env.PULL_REQUEST_NUMBER;
  
  if (prNumber) {
    return parseInt(prNumber, 10);
  }

  // Try to extract from GITHUB_REF (refs/pull/123/merge)
  const githubRef = process.env.GITHUB_REF;
  if (githubRef && githubRef.includes('pull/')) {
    const match = githubRef.match(/pull\/(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  // Try to get from event payload if available
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath) {
    try {
      const fs = require('fs');
      const event = JSON.parse(fs.readFileSync(eventPath, 'utf-8'));
      if (event.pull_request && event.pull_request.number) {
        return event.pull_request.number;
      }
      if (event.number) {
        return event.number;
      }
    } catch (error) {
      // Ignore errors reading event file
    }
  }

  return undefined;
}

/**
 * Gets repository information from GitHub Actions context
 */
function getRepoFromContext(): { owner: string; repo: string } | undefined {
  const repository = process.env.GITHUB_REPOSITORY;
  if (repository && repository.includes('/')) {
    const [owner, repo] = repository.split('/');
    return { owner, repo };
  }
  return undefined;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: apply_label.ts [options] <label>

Options:
  --owner <owner>    Repository owner (defaults to GITHUB_REPOSITORY)
  --repo <repo>      Repository name (defaults to GITHUB_REPOSITORY)
  --pr <number>      PR number (auto-detected from GitHub Actions context)
  --verbose, -v      Verbose output
  --help, -h         Show this help

Environment variables:
  GITHUB_TOKEN       Required: GitHub token with repo permissions
  GITHUB_REPOSITORY  Auto-detected: owner/repo format
  GITHUB_REF         Auto-detected: PR reference
  GITHUB_EVENT_PATH  Auto-detected: Event payload path

Example:
  apply_label.ts contract
  apply_label.ts --owner myorg --repo myrepo --pr 123 contract`);
    process.exit(0);
  }

  let owner = '';
  let repo = '';
  let prNumber: number | undefined;
  let label = '';
  let verbose = false;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--owner':
        owner = args[++i];
        break;
      case '--repo':
        repo = args[++i];
        break;
      case '--pr':
        prNumber = parseInt(args[++i], 10);
        break;
      case '--verbose':
      case '-v':
        verbose = true;
        break;
      default:
        if (!args[i].startsWith('--')) {
          label = args[i];
        }
        break;
    }
  }

  // Auto-detect repository info if not provided
  if (!owner || !repo) {
    const repoInfo = getRepoFromContext();
    if (repoInfo) {
      owner = owner || repoInfo.owner;
      repo = repo || repoInfo.repo;
    }
  }

  // Auto-detect PR number if not provided
  if (!prNumber) {
    prNumber = getPRNumberFromContext();
  }

  if (!label) {
    console.error('Error: label is required');
    process.exit(1);
  }

  if (!owner || !repo) {
    console.error('Error: repository owner and name are required');
    console.error('Provide via --owner/--repo or set GITHUB_REPOSITORY environment variable');
    process.exit(1);
  }

  if (!prNumber) {
    console.error('Error: PR number is required');
    console.error('Provide via --pr or ensure GitHub Actions context is available');
    process.exit(1);
  }

  const options: LabelOptions = {
    owner,
    repo,
    prNumber,
    label,
    verbose,
  };

  applyLabel(options)
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Failed to apply label: ${error.message}`);
      process.exit(1);
    });
}

export { applyLabel, getPRNumberFromContext, getRepoFromContext };