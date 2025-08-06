# BondMCP GitBook Signup Integration Guide

## 🚀 **Quick Signup - Get Your API Key Now**

### **Option 1: Direct API Registration (Recommended)**

**Step 1: Create Account**
```bash
curl -X POST https://api.bondmcp.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "secure-password",
    "name": "Your Name"
  }'
```

**Step 2: Login & Get Token**
```bash
curl -X POST https://api.bondmcp.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "secure-password"
  }'
```

**Step 3: Generate API Key**
```bash
curl -X POST https://api.bondmcp.com/api-keys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Key",
    "permissions": ["read", "write"]
  }'
```

### **Option 2: Web Dashboard (User-Friendly)**

1. **[🔗 Sign Up Here →](https://api.bondmcp.com/docs)** - Use the interactive API docs
2. **[🔗 Login Dashboard →](https://api.bondmcp.com/docs#/auth)** - Access your account
3. **[🔗 Generate API Key →](https://api.bondmcp.com/docs#/api-keys)** - Create your token

### **Option 3: SDK Integration (Developers)**

**Python**
```python
import requests

# Register
response = requests.post('https://api.bondmcp.com/auth/register', json={
    'email': 'your-email@example.com',
    'password': 'secure-password',
    'name': 'Your Name'
})

# Login
login_response = requests.post('https://api.bondmcp.com/auth/login', json={
    'email': 'your-email@example.com',
    'password': 'secure-password'
})

token = login_response.json()['access_token']

# Generate API Key
api_key_response = requests.post('https://api.bondmcp.com/api-keys', 
    headers={'Authorization': f'Bearer {token}'},
    json={'name': 'My API Key', 'permissions': ['read', 'write']}
)

api_key = api_key_response.json()['api_key']
print(f"Your API Key: {api_key}")
```

**JavaScript**
```javascript
// Register and get API key
async function setupBondMCP() {
    // Register
    const registerResponse = await fetch('https://api.bondmcp.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'your-email@example.com',
            password: 'secure-password',
            name: 'Your Name'
        })
    });

    // Login
    const loginResponse = await fetch('https://api.bondmcp.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'your-email@example.com',
            password: 'secure-password'
        })
    });

    const { access_token } = await loginResponse.json();

    // Generate API Key
    const apiKeyResponse = await fetch('https://api.bondmcp.com/api-keys', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'My API Key',
            permissions: ['read', 'write']
        })
    });

    const { api_key } = await apiKeyResponse.json();
    console.log('Your API Key:', api_key);
    return api_key;
}
```

## 🔑 **Using Your API Key**

Once you have your API key, you can start using BondMCP:

```bash
# Test your API key
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.bondmcp.com/health/ask \
     -d '{"query": "What are the symptoms of diabetes?"}'
```

## 💳 **Billing & Plans**

- **Free Tier**: 1,000 API calls per month
- **Developer**: $29/month - 50,000 calls
- **Professional**: $99/month - 200,000 calls  
- **Enterprise**: Custom pricing

**[View Pricing Details →](https://api.bondmcp.com/pricing)**

## 🆘 **Need Help?**

- **📚 Documentation**: [docs.bondmcp.com](https://docs.bondmcp.com)
- **💬 Support**: [support@bondmcp.com](mailto:support@bondmcp.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/bondmcp/mcp/issues)

## 🔒 **Security & Compliance**

- **HIPAA Compliant**: All data encrypted in transit and at rest
- **SOC 2 Type II**: Audited security controls
- **GDPR Compliant**: Full data privacy protection
- **99.97% Uptime SLA**: Enterprise-grade reliability

---

**Ready to build with BondMCP? Get your API key in 2 minutes! 🚀**

