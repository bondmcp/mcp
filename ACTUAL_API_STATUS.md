# API Status

## Current Status: LIVE and Operational ✅

BondMCP API is **fully deployed and operational** at `api.bondmcp.com`. The platform is CLI and API only with no web interface.

### ✅ Available Services:
- **CLI Tools**: Full command-line interface
- **REST API**: Live at `https://api.bondmcp.com`
- **SDKs**: Python, JavaScript, Go, and CLI SDKs
- **Authentication**: API key based authentication
- **Health AI**: All endpoints operational

### 🚀 Live Endpoints:
- `GET /health` - API health check
- `POST /ask` - Health question answering
- `POST /labs` - Lab result analysis  
- `POST /nutrition` - Nutrition analysis
- `POST /supplements` - Supplement recommendations
- `POST /import/*` - Health data import

### ❌ Not Available:
- Web-based user registration
- Web dashboard
- Online billing interface
- Browser-based API key management

### Getting Started:
1. Install the CLI: `pip install bondmcp-cli`
2. Authenticate via CLI: `bondmcp auth login`
3. Generate API keys via CLI: `bondmcp keys create`
4. Start using: `bondmcp ask "What are the benefits of vitamin D?"`

### Test the Live API:
```bash
# Health check
curl https://api.bondmcp.com/health

# Ask a health question (requires API key)
curl -X POST https://api.bondmcp.com/ask \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the benefits of exercise?"}'
```

For full documentation, see the [CLI Tools guide](sdks/cli/README.md).

