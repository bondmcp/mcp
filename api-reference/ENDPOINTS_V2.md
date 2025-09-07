# BondMCP API Endpoints

This document provides a comprehensive list of all available endpoints for the BondMCP API.

**Base URL**: `https://api.bondmcp.com`

## Authentication

Authentication is required for all endpoints and is handled via JWT tokens. See the [Authentication Guide](authentication.md) for more details.

## Core System

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | System health check |
| GET | /openapi.json | OpenAPI specification |

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/v1/auth/register | User registration |
| POST | /api/v1/auth/login | User login |
| POST | /api/v1/auth/logout | User logout |
| POST | /api/v1/auth/refresh | Refresh authentication token |
| POST | /api/v1/auth/api-keys | Create a new API key |
| GET | /api/v1/auth/api-keys | List all API keys for the user |
| DELETE | /api/v1/auth/api-keys/{key_id} | Revoke an API key |

## Health AI

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/v1/health/ask | Ask a health-related question |
| GET | /api/v1/health/trust-score/{response_id} | Get the trust score for a specific response |
| POST | /api/v1/health/analyze | Analyze health data |

## User Management

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/users/me | Get the current user's profile |
| PUT | /api/v1/users/me | Update the current user's profile |

## Billing

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/billing/plans | Get available billing plans |
| POST | /api/v1/billing/subscribe | Subscribe to a billing plan |
| POST | /api/v1/billing/cancel | Cancel a subscription |
| GET | /api/v1/billing/invoices | Get a list of invoices |

## Trust Certificate Verification

| Method | Endpoint | Description |
|---|---|---|
| GET | /cert/{cert_id} | Get certificate details in JSON format |
| GET | /cert/{cert_id}/html | Get certificate details in HTML format |



HTML format |

HTML format |

HTML format |

HTML format |


... and 80+ more endpoints covering all aspects of the platform.

