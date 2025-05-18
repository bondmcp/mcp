# BondMCP API Overview

This document summarizes the main capabilities of the BondMCP public API.
For the complete and most recent OpenAPI schema, see [api.bondmcp.com/openapi.json](https://api.bondmcp.com/openapi.json).

## Endpoints

- `POST /ask` – query the LLM.
- `POST /import/oura` – import Oura data.
- `POST /insights/{insight_type}` – generate health insights by type.
- `POST /insights` – generate general health insights.
- `GET /api-keys` – list API keys for the authenticated user.
- `POST /api-keys` – create a new API key.
- `PUT /api-keys/{key_id}` – update an existing API key.
- `DELETE /api-keys/{key_id}` – revoke an API key.
- `POST /labs/interpret` – interpret lab results.
- `POST /supplement/recommend` – recommend supplements.
- `POST /v1/chat/conversation/{conversation_id}/health-data` – upload health data for a conversation.
- `POST /payments/create-intent` – create a payment intent.
- `POST /orchestrate` – orchestrate tool invocations.
- `GET /health` – health check endpoint.
- `POST /tools/call` – call a specific tool.

## Authentication

Some endpoints require a bearer token or API key. Refer to the full schema for detailed security requirements.
