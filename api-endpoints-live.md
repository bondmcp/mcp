# BondMCP API - Live Endpoints

## Base URL
- **Production**: `https://api.bondmcp.com/prod/`
- **Status**: ✅ **OPERATIONAL** (All 52 endpoints)

## Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

## Health AI Endpoints
- `POST /health/analyze` - Analyze health data
- `POST /health/symptoms` - Symptom analysis
- `POST /health/recommendations` - Health recommendations
- `GET /health/history` - Health analysis history

## MCP Tool Endpoints
- `GET /mcp/tools` - List available MCP tools
- `POST /mcp/execute` - Execute MCP tool
- `GET /mcp/status` - MCP system status

## Billing Endpoints
- `GET /billing/plans` - Available subscription plans
- `POST /billing/subscribe` - Create subscription
- `GET /billing/usage` - Usage statistics
- `POST /billing/webhook` - Stripe webhook handler

## Admin Endpoints
- `GET /admin/users` - List users (admin only)
- `GET /admin/stats` - System statistics
- `POST /admin/maintenance` - System maintenance

## System Endpoints
- `GET /health` - System health check
- `GET /` - API information
- `GET /docs` - API documentation

## Response Format
All endpoints return JSON with consistent structure:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2025-09-14T10:00:00Z"
}
```

## Rate Limits
- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1000 requests/hour  
- **Enterprise**: Unlimited

## Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```
