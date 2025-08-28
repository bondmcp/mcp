# API Reference

Complete API documentation for the BondMCP Health AI platform.

## Overview

BondMCP provides a REST API for health AI functionality. All endpoints require API key authentication.

## Base URL

```
https://api.bondmcp.com/v1
```

## Authentication

All API requests require an API key in the Authorization header:

```bash
Authorization: Bearer YOUR_API_KEY
```

## Core Endpoints

### Health Question Answering

- `POST /ask` - Ask health questions and get AI-powered answers

### Lab Analysis

- `POST /labs/interpret` - Analyze and interpret lab results

### Health Data

- `POST /health-data/analyze` - Analyze health metrics and data

### Nutrition

- `POST /nutrition/analyze` - Analyze meals and nutrition data

### Supplements

- `POST /supplement/recommend` - Get personalized supplement recommendations

### Data Import

- `POST /import/oura` - Import data from Oura ring
- `POST /import/fitbit` - Import data from Fitbit
- `POST /import/apple-health` - Import data from Apple Health

### System

- `GET /health` - API health check
- `GET /status` - System status

## Rate Limits

- Free tier: 1,000 requests/month
- Pro tier: 50,000 requests/month
- Enterprise: Custom limits

## Error Handling

All errors return JSON with error details:

```json
{
  "error": "error_code",
  "message": "Human readable error message",
  "details": {}
}
```

## CLI Access

All API functionality is also available via CLI:

```bash
pip install bondmcp-cli
bondmcp --help
```
