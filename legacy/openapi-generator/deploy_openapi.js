#!/usr/bin/env node

/**
 * OpenAPI Specification Deployment Script for BondMCP
 * 
 * This script deploys the OpenAPI specification to openapi.bondmcp.com/openapi.bondmcp
 * using AWS S3 and CloudFront for distribution.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const sourceFile = path.join(__dirname, '../../spec/openapi.json');
const s3Bucket = 'openapi.bondmcp.com';
const s3Path = 'openapi.bondmcp';
const cloudFrontDistributionId = 'E1EXAMPLE'; // Replace with actual distribution ID

// Main deployment function
async function deployOpenAPISpec() {
  try {
    console.log('Starting OpenAPI specification deployment...');
    
    // Verify the OpenAPI spec exists and is valid
    if (!fs.existsSync(sourceFile)) {
      throw new Error(`OpenAPI specification file not found at ${sourceFile}`);
    }
    
    // Validate the OpenAPI spec
    console.log('Validating OpenAPI specification...');
    const openApiSpec = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
    
    if (!openApiSpec.openapi) {
      throw new Error('OpenAPI specification is missing the required "openapi" version field');
    }
    
    console.log(`OpenAPI specification version: ${openApiSpec.openapi}`);
    
    // Upload to S3
    console.log(`Uploading OpenAPI specification to s3://${s3Bucket}/${s3Path}...`);
    execSync(`aws s3 cp ${sourceFile} s3://${s3Bucket}/${s3Path} --content-type application/json`);
    
    // Invalidate CloudFront cache
    console.log('Invalidating CloudFront cache...');
    execSync(`aws cloudfront create-invalidation --distribution-id ${cloudFrontDistributionId} --paths "/${s3Path}"`);
    
    console.log('OpenAPI specification deployment completed successfully');
    console.log(`The OpenAPI specification is now available at https://openapi.bondmcp.com/openapi.bondmcp`);
    
    return true;
  } catch (error) {
    console.error('Error deploying OpenAPI specification:', error);
    throw error;
  }
}

// Execute the deployment
deployOpenAPISpec()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
