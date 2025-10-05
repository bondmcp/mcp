#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const SEOBOT_API_KEY = process.env.SEOBOT_API_KEY || 'f2bed0bb-b856-4363-b23e-6cb140352fe1';
const SEOBOT_API_URL = process.env.SEOBOT_API_URL || 'https://api.seobot.io/v1/articles';
const BLOG_DIR = path.join(__dirname, '../blog');
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function convertToMarkdown(article) {
  const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
description: "${article.description?.replace(/"/g, '\\"') || article.excerpt?.replace(/"/g, '\\"') || ''}"
date: ${article.publishedAt || article.createdAt || new Date().toISOString()}
author: ${article.author || 'BondMCP Team'}
categories: ${JSON.stringify(article.categories || ['Health AI', 'Technology'])}
tags: ${JSON.stringify(article.tags || [])}
seobot_id: ${article.id || ''}
slug: ${article.slug || slugify(article.title)}
---

`;

  let content = article.content || article.body || '';
  
  // Handle image URLs
  if (article.featuredImage) {
    content = `![${article.title}](${article.featuredImage})\n\n` + content;
  }

  return frontmatter + content;
}

async function fetchArticles() {
  if (USE_MOCK_DATA) {
    console.log('Using mock data for testing...');
    return [
      {
        id: 'mock-1',
        title: 'Advanced Health AI Monitoring with BondMCP',
        description: 'Explore how BondMCP enables real-time health monitoring with AI-powered agents',
        slug: 'advanced-health-ai-monitoring-bondmcp',
        content: `# Advanced Health AI Monitoring with BondMCP

BondMCP's AI agent platform enables healthcare providers to deploy intelligent monitoring systems that adapt to patient needs in real-time.

## Key Features

- **Real-time Analysis**: Process health data streams with millisecond latency
- **Multi-modal Integration**: Combine wearable data, EHR systems, and patient inputs
- **Predictive Alerts**: AI-powered early warning systems for critical conditions

## Implementation Example

\`\`\`javascript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({
  apiKey: process.env.BONDMCP_API_KEY
});

// Create health monitoring agent
const agent = await client.agents.create({
  name: 'patient-monitor',
  capabilities: ['vital-analysis', 'anomaly-detection']
});
\`\`\`

Learn more at [docs.bondmcp.com](https://docs.bondmcp.com)`,
        publishedAt: new Date().toISOString(),
        author: 'BondMCP Team',
        categories: ['Health AI', 'Monitoring', 'Platform'],
        tags: ['ai', 'healthcare', 'monitoring', 'mcp'],
        featuredImage: 'https://bondmcp.com/images/health-monitoring.png'
      }
    ];
  }

  try {
    console.log('Fetching articles from SEObot API...');
    const response = await axios.get(SEOBOT_API_URL, {
      headers: {
        'Authorization': `Bearer ${SEOBOT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    const { articles, total } = response.data;
    console.log(`✓ Fetched ${articles?.length || 0} articles (total: ${total || 0})`);
    
    return articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    console.warn('⚠️  Falling back to mock data due to API error');
    return [];
  }
}

async function saveArticle(article) {
  const slug = article.slug || slugify(article.title);
  const filename = `${slug}.md`;
  const filepath = path.join(BLOG_DIR, filename);

  const markdown = convertToMarkdown(article);

  try {
    await fs.access(filepath);
    console.log(`  ⊘ Skipping existing article: ${filename}`);
    return { status: 'skipped', filename };
  } catch {
    await fs.writeFile(filepath, markdown, 'utf8');
    console.log(`  ✓ Created new article: ${filename}`);
    return { status: 'created', filename };
  }
}

async function syncArticles() {
  try {
    // Ensure blog directory exists
    await fs.mkdir(BLOG_DIR, { recursive: true });

    const articles = await fetchArticles();
    
    if (!articles || articles.length === 0) {
      console.log('No articles to sync');
      return { created: 0, skipped: 0, total: 0 };
    }

    const results = { created: 0, skipped: 0, total: articles.length };

    for (const article of articles) {
      const result = await saveArticle(article);
      if (result.status === 'created') {
        results.created++;
      } else {
        results.skipped++;
      }
    }

    console.log('\n📊 Sync Summary:');
    console.log(`   Total articles: ${results.total}`);
    console.log(`   New articles: ${results.created}`);
    console.log(`   Skipped (existing): ${results.skipped}`);

    return results;
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  syncArticles();
}

module.exports = { syncArticles, fetchArticles };
