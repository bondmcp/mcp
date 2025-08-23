#!/usr/bin/env node

/**
 * Apply Contract Label Script
 * 
 * Adds 'contract' label to the associated PR. Creates label if missing.
 */

import * as https from 'https';

interface GitHubAPIResponse {
  [key: string]: any;
}

interface LabelData {
  name: string;
  color: string;
  description: string;
}

/**
 * Make GitHub API request
 */
function makeGitHubRequest(
  path: string, 
  method: string = 'GET', 
  data?: any, 
  token?: string
): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'User-Agent': 'BondMCP-Contract-Automation',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `token ${token}` })
      }
    };

    const req = https.request(options, (res) => {
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

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Get PR number from GitHub context
 */
function getPRNumber(): number | null {
  // Try environment variables from GitHub Actions
  const prNumber = process.env.GITHUB_PR_NUMBER || 
                   process.env.PR_NUMBER ||
                   process.env.PULL_REQUEST_NUMBER;
  
  if (prNumber) {
    const num = parseInt(prNumber, 10);
    return isNaN(num) ? null : num;
  }

  // Try to extract from GITHUB_REF
  const githubRef = process.env.GITHUB_REF;
  if (githubRef && githubRef.includes('/pull/')) {
    const match = githubRef.match(/\/pull\/(\d+)\//);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return null;
}

/**
 * Get repository information from GitHub context
 */
function getRepoInfo(): { owner: string; repo: string } | null {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) {
    return null;
  }

  const [owner, repo] = repository.split('/');
  if (!owner || !repo) {
    return null;
  }

  return { owner, repo };
}

/**
 * Check if label exists in repository
 */
async function labelExists(owner: string, repo: string, labelName: string, token: string): Promise<boolean> {
  try {
    const response = await makeGitHubRequest(`/repos/${owner}/${repo}/labels/${labelName}`, 'GET', null, token);
    return response.statusCode === 200;
  } catch (error) {
    return false;
  }
}

/**
 * Create label in repository
 */
async function createLabel(owner: string, repo: string, labelData: LabelData, token: string): Promise<boolean> {
  try {
    const response = await makeGitHubRequest(`/repos/${owner}/${repo}/labels`, 'POST', labelData, token);
    return response.statusCode === 201;
  } catch (error) {
    console.error('Error creating label:', error);
    return false;
  }
}

/**
 * Add label to PR
 */
async function addLabelToPR(owner: string, repo: string, prNumber: number, labelName: string, token: string): Promise<boolean> {
  try {
    const response = await makeGitHubRequest(
      `/repos/${owner}/${repo}/issues/${prNumber}/labels`, 
      'POST', 
      { labels: [labelName] }, 
      token
    );
    return response.statusCode === 200;
  } catch (error) {
    console.error('Error adding label to PR:', error);
    return false;
  }
}

/**
 * Check if PR already has the label
 */
async function prHasLabel(owner: string, repo: string, prNumber: number, labelName: string, token: string): Promise<boolean> {
  try {
    const response = await makeGitHubRequest(`/repos/${owner}/${repo}/issues/${prNumber}/labels`, 'GET', null, token);
    
    if (response.statusCode !== 200) {
      return false;
    }

    const labels = JSON.parse(response.body);
    return labels.some((label: any) => label.name === labelName);
  } catch (error) {
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    const labelName = args[0] || 'contract';
    
    // Get GitHub token
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.error('Error: GITHUB_TOKEN environment variable is required');
      process.exit(1);
    }

    // Get repository info
    const repoInfo = getRepoInfo();
    if (!repoInfo) {
      console.error('Error: Could not determine repository information from GITHUB_REPOSITORY');
      process.exit(1);
    }

    // Get PR number
    const prNumber = getPRNumber();
    if (!prNumber) {
      console.error('Error: Could not determine PR number from environment');
      console.error('Set GITHUB_PR_NUMBER, PR_NUMBER, or PULL_REQUEST_NUMBER environment variable');
      process.exit(1);
    }

    console.log(`Repository: ${repoInfo.owner}/${repoInfo.repo}`);
    console.log(`PR Number: ${prNumber}`);
    console.log(`Label: ${labelName}`);

    // Check if PR already has the label
    const hasLabel = await prHasLabel(repoInfo.owner, repoInfo.repo, prNumber, labelName, token);
    if (hasLabel) {
      console.log(`✅ PR #${prNumber} already has '${labelName}' label`);
      
      // Output metadata for CI/CD
      const metadata = {
        action: 'skip',
        reason: 'label_already_exists',
        label: labelName,
        pr_number: prNumber,
        repository: `${repoInfo.owner}/${repoInfo.repo}`
      };
      console.log(JSON.stringify(metadata));
      process.exit(0);
    }

    // Check if label exists in repository
    const exists = await labelExists(repoInfo.owner, repoInfo.repo, labelName, token);
    
    if (!exists) {
      console.log(`Creating '${labelName}' label in repository...`);
      
      const labelData: LabelData = {
        name: labelName,
        color: '0366d6', // Neutral blue color
        description: 'Contract-related changes requiring review'
      };
      
      const created = await createLabel(repoInfo.owner, repoInfo.repo, labelData, token);
      if (!created) {
        console.error(`Failed to create '${labelName}' label`);
        process.exit(1);
      }
      
      console.log(`✅ Created '${labelName}' label`);
    }

    // Add label to PR
    console.log(`Adding '${labelName}' label to PR #${prNumber}...`);
    const added = await addLabelToPR(repoInfo.owner, repoInfo.repo, prNumber, labelName, token);
    
    if (added) {
      console.log(`✅ Successfully added '${labelName}' label to PR #${prNumber}`);
      
      // Output metadata for CI/CD
      const metadata = {
        action: 'added',
        label: labelName,
        pr_number: prNumber,
        repository: `${repoInfo.owner}/${repoInfo.repo}`,
        label_created: !exists
      };
      console.log(JSON.stringify(metadata));
    } else {
      console.error(`Failed to add '${labelName}' label to PR #${prNumber}`);
      process.exit(1);
    }

  } catch (error) {
    console.error('Error applying contract label:', error);
    process.exit(1);
  }
}

// Only run main if this script is executed directly
if (require.main === module) {
  main();
}

export { addLabelToPR, createLabel, labelExists };