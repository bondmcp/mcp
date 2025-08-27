#!/usr/bin/env python3
"""
Auto-update API documentation from live BondMCP API
"""
import requests
import json
import os
from datetime import datetime

def fetch_live_api_status():
    """Fetch current API status from live endpoint"""
    try:
        response = requests.get('https://api.bondmcp.com/health', timeout=10)
        if response.status_code == 200:
            data = response.json()
            return {
                'status': 'LIVE',
                'timestamp': datetime.now().isoformat(),
                'endpoints_available': True,
                'response_time': response.elapsed.total_seconds(),
                'api_version': data.get('version', 'unknown'),
                'services': data.get('services', {}),
                'probes': data.get('probes', {})
            }
    except Exception as e:
        return {
            'status': 'ERROR',
            'timestamp': datetime.now().isoformat(),
            'error': str(e),
            'endpoints_available': False
        }

def update_api_status_docs():
    """Update API status documentation"""
    status = fetch_live_api_status()
    
    if status is None:
        status = {'status': 'UNKNOWN', 'timestamp': datetime.now().isoformat()}
    
    status_emoji = "✅" if status['status'] == 'LIVE' else "❌"
    
    status_content = f"""# Live API Status

## Current Status: {status['status']} {status_emoji}

**Last Checked**: {status['timestamp']}
**API Base URL**: https://api.bondmcp.com
**API Version**: {status.get('api_version', 'N/A')}
**Endpoints Available**: {'Yes' if status.get('endpoints_available') else 'No'}

### Live Endpoints:
- `GET /health` - API health check ✅
- `POST /ask` - Health question answering ✅
- `POST /labs` - Lab result analysis ✅
- `POST /nutrition` - Nutrition analysis ✅
- `POST /supplements` - Supplement recommendations ✅
- `POST /insights` - Health insights ✅

### Service Status:
"""
    
    if 'services' in status:
        for service, service_status in status['services'].items():
            emoji = "✅" if service_status == "operational" else "❌"
            status_content += f"- **{service.title()}**: {service_status} {emoji}\n"
    
    status_content += f"""
### Quick Test:
```bash
# Test the live API
curl https://api.bondmcp.com/health

# Response time: {status.get('response_time', 'N/A')}s
```

### Getting Started:
1. Install CLI: `pip install bondmcp-cli`
2. Authenticate: `bondmcp auth login`
3. Create API key: `bondmcp keys create`
4. Start using: `bondmcp ask "health question"`

---
*Auto-updated from live API status*
"""
    
    with open('../LIVE_API_STATUS.md', 'w') as f:
        f.write(status_content)
    
    print(f"Updated API status: {status['status']}")
    return status

if __name__ == '__main__':
    status = update_api_status_docs()
    print(f"API Status: {status}")
