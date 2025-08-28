# API Gateway Configuration

This directory contains the API Gateway configuration for the BondMCP platform.

## Overview

The API Gateway serves as the entry point for all API requests to the BondMCP platform. It routes requests to the appropriate Lambda functions and handles authentication, authorization, and CORS.

## Configuration Files

- `api-endpoints.json`: Contains the configuration for all API endpoints, including paths, methods, integrations, and CORS settings.

## Endpoints

### Authentication

- `/api/v1/auth` (POST): Handles user authentication
- CORS enabled with OPTIONS method

### Dashboard Data

- `/api/v1/dashboard` (GET): Retrieves dashboard data for authenticated users
- CORS enabled with OPTIONS method

### API Keys Management

- `/api/v1/apikeys` (GET): Retrieves API keys for authenticated users
- CORS enabled with OPTIONS method

### Usage Statistics

- `/api/v1/usage` (GET): Retrieves usage statistics for authenticated users
- CORS enabled with OPTIONS method

## Integration

All endpoints are integrated with the consolidated Lambda function `BondMCP-API-All-Endpoints-Consolidated` to ensure consistent handling of requests and reduce duplication of code.

## CORS Configuration

All endpoints have CORS enabled with the following settings:
- Allowed Headers: Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, X-Requested-With
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed Origin: * (all origins)

## Deployment

Changes to the API Gateway configuration should be deployed using the AWS CLI or AWS Console. After deployment, a new deployment must be created to make the changes effective.
