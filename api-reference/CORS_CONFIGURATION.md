# CORS Configuration Guide

## Overview

This document outlines the Cross-Origin Resource Sharing (CORS) configuration for the BondMCP Platform API. CORS is configured to allow secure cross-origin requests from authorized frontend applications while preventing unauthorized access.

---

## Configuration Location

CORS is configured in [`main.py`](file:///Users/samrenders/bondmcp-platform/main.py#L139-L210) with environment-based origin whitelisting.

---

## Allowed Origins

### Production

The following origins are allowed in production by default:

```
https://bondmcp.com
https://www.bondmcp.com
https://app.bondmcp.com
https://bondmcp-dashboard-802ya0o2g-lifecycle-innovations-limited.vercel.app
```

### Development

Local development origins:
```
http://localhost:3000
http://localhost:5173
http://localhost:8000
```

### Vercel Preview URLs

Vercel preview deployments (ending with `.vercel.app`) are logged but may be blocked. To allow specific preview URLs, add them via the `ALLOWED_ORIGINS` environment variable.

---

## Environment Variables

### ALLOWED_ORIGINS

Override the default allowed origins with a comma-separated list:

```bash
# .env or environment configuration
ALLOWED_ORIGINS=https://dashboard.bondmcp.com,https://app.bondmcp.com,http://localhost:3000
```

**Example:**
```bash
export ALLOWED_ORIGINS="https://bondmcp-dashboard.vercel.app,https://preview-abc123.vercel.app,http://localhost:3000"
```

### ENVIRONMENT

Set to `development` to allow all origins (`*`):

```bash
ENVIRONMENT=development  # Allows * (all origins)
```

⚠️ **Warning:** Never use `ENVIRONMENT=development` in production deployments!

---

## CORS Headers

### Request Headers (Allowed)

The API accepts the following headers from cross-origin requests:

- `Content-Type` - Request content type
- `Authorization` - JWT bearer tokens
- `X-API-Key` - API key authentication
- `X-Request-ID` - Request tracking ID
- `X-Requested-With` - XMLHttpRequest identification

### Response Headers (Exposed)

The following headers are exposed to frontend JavaScript:

- `X-Request-ID` - Request tracking ID
- `X-RateLimit-Limit` - Rate limit maximum
- `X-RateLimit-Remaining` - Remaining rate limit
- `X-RateLimit-Reset` - Rate limit reset timestamp

### Allowed Methods

```
GET, POST, PUT, DELETE, PATCH, OPTIONS
```

### Credentials

`allow_credentials=True` - Allows cookies and authorization headers

### Preflight Cache

`max_age=600` - Preflight OPTIONS requests are cached for 10 minutes

---

## CORS Logging

### Allowed Origins

When an allowed origin makes a request:
```
✅ CORS: Allowed origin: https://bondmcp-dashboard.vercel.app
```

### Blocked Origins

When a blocked origin attempts a request:
```
🚫 CORS: Blocked origin: https://malicious-site.com
```

### Development Mode

When running in development mode:
```
🔓 CORS: Development mode - allowing all origins (*)
```

---

## Testing CORS

### Test OPTIONS Preflight Request

```bash
curl -X OPTIONS https://t9xbkyb7mg.us-east-1.awsapprunner.com/health \
  -H "Origin: https://bondmcp-dashboard.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v
```

**Expected Response Headers:**
```
Access-Control-Allow-Origin: https://bondmcp-dashboard.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key, X-Request-ID, X-Requested-With
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 600
Access-Control-Expose-Headers: X-Request-ID, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
```

### Test GET Request with CORS

```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/health \
  -H "Origin: https://bondmcp-dashboard.vercel.app" \
  -v
```

**Expected Response:**
```
Access-Control-Allow-Origin: https://bondmcp-dashboard.vercel.app
Access-Control-Allow-Credentials: true
```

### Test from Dashboard (Browser)

Open browser DevTools console on the dashboard and run:

```javascript
// Test simple GET
fetch('https://t9xbkyb7mg.us-east-1.awsapprunner.com/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('✅ CORS working:', data))
.catch(err => console.error('❌ CORS error:', err));

// Test authenticated request
fetch('https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
.then(res => res.json())
.then(data => console.log('✅ Auth CORS working:', data))
.catch(err => console.error('❌ CORS error:', err));
```

---

## Troubleshooting

### Common CORS Errors

#### Error: "No 'Access-Control-Allow-Origin' header is present"

**Cause:** The origin is not in the allowed list.

**Solution:**
1. Check the origin in browser DevTools (Network tab)
2. Add the origin to `ALLOWED_ORIGINS` environment variable
3. Restart the API server
4. Check logs for `🚫 CORS: Blocked origin` messages

#### Error: "CORS preflight did not succeed"

**Cause:** OPTIONS request failed or timed out.

**Solution:**
1. Check API health: `curl https://API_URL/health`
2. Test OPTIONS request manually (see testing section)
3. Check firewall/security group settings
4. Verify API is running and accessible

#### Error: "Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is '*'"

**Cause:** Using wildcard origin with credentials.

**Solution:**
1. Set `ENVIRONMENT=production` (not `development`)
2. Explicitly list allowed origins in `ALLOWED_ORIGINS`
3. Never use `*` with `allow_credentials=True`

#### Dashboard can't connect to API

**Cause:** CORS blocking or API unreachable.

**Checklist:**
1. ✅ Verify API is running: `curl https://API_URL/health`
2. ✅ Check dashboard URL is in allowed origins
3. ✅ Check browser DevTools Console for CORS errors
4. ✅ Check browser DevTools Network tab for failed requests
5. ✅ Verify `VITE_API_URL` in dashboard matches actual API URL
6. ✅ Check API logs for CORS warnings

---

## Security Best Practices

### ✅ DO

- Use specific origin URLs (never `*` in production)
- Validate origins from environment variables
- Log blocked origins for monitoring
- Use HTTPS for all production origins
- Keep `allow_credentials=True` with specific origins
- Review and update allowed origins regularly
- Use environment-specific configurations

### ❌ DON'T

- Use `*` wildcard in production
- Allow `http://` origins in production (except localhost)
- Add untrusted domains to allowed origins
- Disable CORS logging in production
- Use `allow_credentials=True` with `*` origin
- Hardcode production URLs (use environment variables)

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Set `ENVIRONMENT=production`
- [ ] Configure `ALLOWED_ORIGINS` with production URLs only
- [ ] Remove `*` from allowed origins
- [ ] Verify all dashboard URLs are whitelisted
- [ ] Test CORS from production dashboard
- [ ] Monitor logs for blocked origins
- [ ] Remove development origins from production config
- [ ] Enable CORS logging for monitoring
- [ ] Document any new allowed origins
- [ ] Test API health endpoint with CORS
- [ ] Verify credentials flow works (if using cookies)

---

## CI/CD Integration

### GitHub Actions Check

Add a CORS validation step to your CI/CD pipeline:

```yaml
# .github/workflows/deploy.yml
- name: Verify CORS Configuration
  run: |
    if grep -q 'allow_origins.*\["*"\]' main.py; then
      echo "❌ ERROR: Wildcard CORS origin detected in production!"
      exit 1
    fi
    if [ "$ENVIRONMENT" = "production" ]; then
      if [ -z "$ALLOWED_ORIGINS" ]; then
        echo "⚠️  WARNING: ALLOWED_ORIGINS not set for production"
      fi
    fi
```

### Pre-deployment Script

Create `scripts/verify-cors.sh`:

```bash
#!/bin/bash
# Verify CORS configuration before deployment

set -e

echo "🔍 Verifying CORS configuration..."

# Check environment
if [ "$ENVIRONMENT" = "production" ]; then
  echo "✅ Environment: production"
  
  # Check for wildcard
  if grep -q 'allow_origins.*\["*"\]' main.py; then
    echo "❌ ERROR: Wildcard (*) CORS detected in production!"
    exit 1
  fi
  
  # Check ALLOWED_ORIGINS is set
  if [ -z "$ALLOWED_ORIGINS" ]; then
    echo "⚠️  WARNING: ALLOWED_ORIGINS not set, using defaults"
  else
    echo "✅ ALLOWED_ORIGINS configured: $ALLOWED_ORIGINS"
  fi
else
  echo "✅ Environment: $ENVIRONMENT (non-production)"
fi

echo "✅ CORS configuration verified"
```

---

## Monitoring & Alerts

### CloudWatch Logs (AWS)

Search for CORS-related logs:

```
fields @timestamp, @message
| filter @message like /CORS/
| sort @timestamp desc
| limit 100
```

### Blocked Origins Alert

Set up alerts for blocked origins:

```
fields @timestamp, @message
| filter @message like /🚫 CORS: Blocked origin/
| stats count() as blocked_requests by bin(5m)
| filter blocked_requests > 10
```

---

## Support & Contacts

**Documentation:** [file:///Users/samrenders/bondmcp-platform/docs/api/CORS_CONFIGURATION.md](file:///Users/samrenders/bondmcp-platform/docs/api/CORS_CONFIGURATION.md)  
**API Endpoint:** https://t9xbkyb7mg.us-east-1.awsapprunner.com  
**Dashboard:** https://bondmcp-dashboard-802ya0o2g-lifecycle-innovations-limited.vercel.app  
**Repository:** /Users/samrenders/bondmcp-platform

---

**Last Updated:** September 30, 2025  
**Version:** 2.1.0
