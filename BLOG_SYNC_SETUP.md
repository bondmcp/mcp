# Blog Sync Setup Guide

This guide explains how to set up automatic blog synchronization from SEOBot to the BondMCP documentation repository.

## Overview

The blog sync feature automatically fetches articles from the SEOBot API and converts them to Markdown files in the `blog/` directory. This process runs daily via GitHub Actions.

## Prerequisites

- SEOBot API account and API key
- GitHub repository with Actions enabled
- Node.js 20+ (for local testing)

## Setup Instructions

### 1. Add GitHub Secrets

Navigate to your repository settings and add the following secrets:

**Required:**
- `SEOBOT_API_KEY`: Your SEOBot API key

**Optional:**
- `SEOBOT_API_URL`: Custom SEOBot API endpoint (defaults to `https://api.seobot.io/v1/articles`)

**Steps:**
1. Go to `Settings` → `Secrets and variables` → `Actions`
2. Click `New repository secret`
3. Add `SEOBOT_API_KEY` with your API key value
4. Click `Add secret`

### 2. Verify Workflow

The blog sync workflow is located at `.github/workflows/blog-sync.yml`.

**Schedule:**
- Runs daily at 2 AM UTC
- Can be triggered manually via `Actions` tab → `Blog Sync` → `Run workflow`

### 3. Test the Workflow

**Manual Trigger:**
1. Go to the `Actions` tab in GitHub
2. Select `Blog Sync` workflow
3. Click `Run workflow`
4. Wait for completion and check the logs

**Local Testing:**
```bash
# Set environment variable
export SEOBOT_API_KEY="your_api_key_here"

# Install dependencies
npm install

# Run blog sync
npm run blog:sync

# Check the blog directory
ls -la blog/
```

## How It Works

1. **Fetch Articles**: The workflow fetches articles from the SEOBot API
2. **Convert to Markdown**: Each article is converted to Markdown with frontmatter
3. **Save to Repository**: Articles are saved to the `blog/` directory
4. **Commit Changes**: If new articles are found, they're automatically committed
5. **Push to GitHub**: Changes are pushed to the repository

## Workflow Features

- **Automatic Commits**: New articles are automatically committed with message `chore: sync blog articles from SEOBot`
- **Change Detection**: Only commits if new articles are found
- **Manual Trigger**: Can be run manually anytime
- **Error Handling**: Workflow fails gracefully if API key is missing

## Troubleshooting

### No Articles Syncing

**Check:**
1. `SEOBOT_API_KEY` is correctly set in GitHub Secrets
2. SEOBot API is accessible and returning articles
3. Workflow logs for specific error messages

**Debug:**
```bash
# Run locally with debug output
export SEOBOT_API_KEY="your_key"
export DEBUG=true
npm run blog:sync
```

### Workflow Failing

**Common Issues:**
- Missing `SEOBOT_API_KEY` secret
- Invalid API key
- Network connectivity issues
- SEOBot API rate limiting

**Solution:**
1. Check workflow logs in the `Actions` tab
2. Verify API key is valid
3. Test API endpoint manually:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://api.seobot.io/v1/articles
   ```

### Permission Errors

If the workflow cannot commit changes:
1. Ensure `GITHUB_TOKEN` has write permissions
2. Check repository settings: `Settings` → `Actions` → `General` → `Workflow permissions`
3. Enable "Read and write permissions"

## Mock Data Mode

For testing without an API key:

```bash
export USE_MOCK_DATA=true
npm run blog:sync
```

This will generate sample blog posts for testing purposes.

## File Structure

```
blog/
├── 2025-01-15-article-slug.md
├── 2025-01-16-another-article.md
└── ...
```

Each article is saved as:
- Filename: `YYYY-MM-DD-slug.md`
- Content: Markdown with YAML frontmatter
- Frontmatter includes: title, description, date, author, categories, tags, seobot_id, slug

## Maintenance

### Updating the Workflow

Edit `.github/workflows/blog-sync.yml` to:
- Change schedule (modify `cron` expression)
- Add additional steps
- Modify commit messages
- Add notifications

### Monitoring

**Check sync status:**
1. Go to `Actions` tab
2. View `Blog Sync` workflow runs
3. Check for failures or warnings

**Set up notifications:**
- GitHub can email you on workflow failures
- Configure in: `Settings` → `Notifications` → `Actions`

## Security Notes

- **Never commit API keys** to the repository
- Always use GitHub Secrets for sensitive data
- Rotate API keys periodically
- Review workflow permissions regularly

## Support

For issues or questions:
- Check workflow logs in the `Actions` tab
- Review SEOBot API documentation
- Contact the BondMCP development team

---

**Last Updated**: November 5, 2025
**Workflow Version**: 1.0
