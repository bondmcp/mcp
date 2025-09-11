import { VercelRequest, VercelResponse } from '@vercel/node';
import { createBlogSyncService, getBlogSyncConfig, BlogSyncResult } from '../scripts/blog-sync';

// Response interface
interface BlogSyncResponse {
  success: boolean;
  message: string;
  data?: BlogSyncResult;
  error?: string;
}

// Validate request method
function validateMethod(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST or GET.',
      error: `Received ${req.method}, expected POST or GET`
    });
    return false;
  }
  return true;
}

// Validate mode parameter
function validateMode(mode: any): mode is 'backfill' | 'delta' {
  return mode === 'backfill' || mode === 'delta';
}

// Get sync mode from query parameters or body
function getSyncMode(req: VercelRequest): 'backfill' | 'delta' {
  // Check query parameters first
  const queryMode = req.query.mode;
  if (validateMode(queryMode)) {
    return queryMode;
  }

  // Check request body for POST requests
  if (req.method === 'POST' && req.body) {
    const bodyMode = req.body.mode;
    if (validateMode(bodyMode)) {
      return bodyMode;
    }
  }

  // Default to delta mode
  return 'delta';
}

// Validate environment configuration
function validateEnvironment(): { valid: boolean; missing?: string[] } {
  const required = [
    'SEOBOT_API_KEY',
    'GITBOOK_TOKEN', 
    'GITBOOK_SPACE_ID',
    'GITBOOK_BLOG_PARENT_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  return {
    valid: missing.length === 0,
    missing
  };
}

// Main handler function
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Validate request method
  if (!validateMethod(req, res)) {
    return;
  }

  // Log request details
  console.log(`[BlogSync API] ${req.method} request received`, {
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  try {
    // Validate environment configuration
    const envValidation = validateEnvironment();
    if (!envValidation.valid) {
      const response: BlogSyncResponse = {
        success: false,
        message: 'Missing required environment variables',
        error: `Missing: ${envValidation.missing?.join(', ')}`
      };
      res.status(500).json(response);
      return;
    }

    // Get sync mode
    const mode = getSyncMode(req);
    console.log(`[BlogSync API] Running in ${mode} mode`);

    // Get configuration from environment variables
    const config = getBlogSyncConfig();
    
    // Create blog sync service
    const blogSyncService = createBlogSyncService(config);
    
    // Execute sync
    console.log(`[BlogSync API] Starting blog sync...`);
    const result = await blogSyncService.syncBlog(mode);
    
    console.log(`[BlogSync API] Sync completed`, {
      success: result.success,
      processed: result.processed,
      created: result.created,
      updated: result.updated,
      errors: result.errors.length
    });

    // Prepare response
    const response: BlogSyncResponse = {
      success: result.success,
      message: result.success 
        ? `Blog sync completed successfully: ${result.processed} processed, ${result.created} created, ${result.updated} updated`
        : `Blog sync completed with errors: ${result.errors.length} errors`,
      data: result
    };

    // Return appropriate status code
    const statusCode = result.success ? 200 : (result.errors.length > 0 ? 207 : 500);
    res.status(statusCode).json(response);
    
  } catch (error) {
    console.error('[BlogSync API] Unexpected error:', error);
    
    const response: BlogSyncResponse = {
      success: false,
      message: 'Internal server error occurred during blog sync',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    res.status(500).json(response);
  }
}

// Health check function (can be called directly)
export async function healthCheck(): Promise<{ status: string; timestamp: string; environment: any }> {
  const envValidation = validateEnvironment();
  
  return {
    status: envValidation.valid ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    environment: {
      valid: envValidation.valid,
      missing: envValidation.missing || [],
      configured: [
        'SEOBOT_API_KEY',
        'GITBOOK_TOKEN',
        'GITBOOK_SPACE_ID', 
        'GITBOOK_BLOG_PARENT_ID',
        'SLACK_WEBHOOK_URL'
      ].filter(key => !!process.env[key])
    }
  };
}
