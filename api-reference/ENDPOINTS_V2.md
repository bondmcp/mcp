# BondMCP API Endpoints

This document provides a comprehensive list of all planned endpoints for the BondMCP API.

**Base URL**: `https://api.bondmcp.com` (NOT YET DEPLOYED)

> **Development Status**: The API infrastructure at api.bondmcp.com is not yet deployed. All endpoints listed below are planned but not currently accessible.

## Authentication (Planned)

Authentication will be required for all endpoints and handled via JWT tokens. See the [Authentication Guide](authentication.md) for more details once available.

## Core System (Planned)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | /health | System health check | ❌ NOT DEPLOYED |
| GET | /openapi.json | OpenAPI specification | ❌ NOT DEPLOYED |

## Authentication (Planned)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| POST | /api/v1/auth/register | User registration | ❌ NOT DEPLOYED |
| POST | /api/v1/auth/login | User login | ❌ NOT DEPLOYED |
| POST | /api/v1/auth/logout | User logout | ❌ NOT DEPLOYED |
| POST | /api/v1/auth/refresh | Refresh authentication token | ❌ NOT DEPLOYED |
| POST | /api/v1/auth/api-keys | Create a new API key | ❌ NOT DEPLOYED |
| GET | /api/v1/auth/api-keys | List all API keys for the user | ❌ NOT DEPLOYED |
| DELETE | /api/v1/auth/api-keys/{key_id} | Revoke an API key | ❌ NOT DEPLOYED |

## Health AI (Planned)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| POST | /api/v1/health/ask | Ask a health-related question | ❌ NOT DEPLOYED |
| GET | /api/v1/health/trust-score/{response_id} | Get the trust score for a specific response | ❌ NOT DEPLOYED |
| POST | /api/v1/health/analyze | Analyze health data | ❌ NOT DEPLOYED |

## User Management (Planned)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | /api/v1/users/me | Get the current user's profile | ❌ NOT DEPLOYED |
| PUT | /api/v1/users/me | Update the current user's profile | ❌ NOT DEPLOYED |

## Billing (Planned)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | /api/v1/billing/plans | Get available billing plans | ❌ NOT DEPLOYED |
| POST | /api/v1/billing/subscribe | Subscribe to a billing plan | ❌ NOT DEPLOYED |
| POST | /api/v1/billing/cancel | Cancel a subscription | ❌ NOT DEPLOYED |
| GET | /api/v1/billing/invoices | Get a list of invoices | ❌ NOT DEPLOYED |

## Trust Certificate Verification (Planned)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | /cert/{cert_id} | Get certificate details in JSON format | ❌ NOT DEPLOYED |
| GET | /cert/{cert_id}/html | Get certificate details in HTML format | ❌ NOT DEPLOYED |

> **Development Status**: All endpoints listed above are planned but not yet deployed. The API infrastructure at api.bondmcp.com is currently in development. Additional endpoints are being designed and will be documented as development progresses.

