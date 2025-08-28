# Authentication Setup

Secure your BondMCP account and API access with our comprehensive authentication system. This guide covers everything from basic account setup to advanced security features.

## 🔐 Account Security Overview

BondMCP provides multiple layers of security to protect your health data:

- **Multi-Factor Authentication (MFA)**: Required for all accounts
- **API Key Management**: Secure token-based API access
- **Session Management**: Automatic session timeout and refresh
- **Audit Logging**: Complete access history tracking
- **Device Management**: Control which devices can access your account

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Your Account

1. **Visit**: [app.bondmcp.com/signup](https://app.bondmcp.com/signup)
2. **Enter Details**: Email, password, and basic information
3. **Verify Email**: Check your inbox and click the verification link
4. **Complete Profile**: Add your health profile information

### Step 2: Enable Two-Factor Authentication

1. **Go to Settings**: Navigate to Security → Two-Factor Authentication
2. **Choose Method**: 
   - **Authenticator App** (Recommended): Google Authenticator, Authy, etc.
   - **SMS**: Text message verification
   - **Email**: Email-based verification
3. **Scan QR Code**: Use your authenticator app to scan the QR code
4. **Verify Setup**: Enter the 6-digit code to confirm

### Step 3: Generate API Keys

1. **Navigate**: Settings → API Keys → Create New Key
2. **Name Your Key**: Give it a descriptive name (e.g., "My Health App")
3. **Set Permissions**: Choose what the key can access
4. **Copy Key**: Save it securely - you won't see it again!

## 🔑 API Authentication Methods

### Bearer Token Authentication (Recommended)

Include your API key in the Authorization header:

```bash
curl -X POST https://api.bondmcp.com/ask \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the benefits of exercise?"}'
```

### API Key in Header

Alternative method using custom header:

```bash
curl -X POST https://api.bondmcp.com/ask \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the benefits of exercise?"}'
```

## 🛡️ Advanced Security Features

### API Key Scopes

Control what each API key can access:

- **read:health**: Read health information and ask questions
- **write:health**: Update health profile and preferences
- **read:labs**: Access lab results and interpretations
- **write:labs**: Upload and manage lab results
- **read:nutrition**: Access nutrition analysis and recommendations
- **admin**: Full account access (use carefully!)

### IP Whitelisting

Restrict API key usage to specific IP addresses:

1. **Go to**: Settings → API Keys → [Your Key] → IP Restrictions
2. **Add IPs**: Enter allowed IP addresses or ranges
3. **Save**: Changes take effect immediately

### Rate Limiting

Automatic protection against abuse:

- **Free Tier**: 10 requests per minute, 100 per month
- **Pro Tier**: 100 requests per minute, 5,000 per month
- **Enterprise**: Custom limits based on your needs

## 📱 Mobile App Authentication

### Initial Setup

1. **Download**: Get the app from App Store or Google Play
2. **Sign In**: Use your web account credentials
3. **Biometric Setup**: Enable fingerprint or face recognition
4. **Sync**: Your data will automatically sync across devices

### Biometric Authentication

Enable secure biometric login:

- **iOS**: Face ID or Touch ID
- **Android**: Fingerprint or face unlock
- **Fallback**: PIN or password if biometrics fail

## 🔄 Session Management

### Web Sessions

- **Duration**: 24 hours of inactivity
- **Refresh**: Automatic refresh when active
- **Multiple Devices**: Up to 5 concurrent sessions
- **Logout**: Manual logout from all devices available

### API Sessions

- **Token Expiry**: API keys don't expire by default
- **Rotation**: Recommended every 90 days
- **Revocation**: Instant revocation available
- **Monitoring**: Track usage in real-time

## 🚨 Security Best Practices

### API Key Security

✅ **Do:**
- Store API keys in environment variables
- Use different keys for different applications
- Rotate keys regularly (every 90 days)
- Monitor key usage for unusual activity
- Use the minimum required permissions

❌ **Don't:**
- Hardcode API keys in your source code
- Share API keys via email or chat
- Use the same key for multiple applications
- Give keys more permissions than needed
- Ignore security alerts

### Password Security

✅ **Strong Password Requirements:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- No common words or personal information
- Unique to BondMCP (don't reuse passwords)

### Account Monitoring

- **Login Alerts**: Email notifications for new device logins
- **API Usage**: Monitor API key usage patterns
- **Security Events**: Alerts for suspicious activity
- **Regular Reviews**: Monthly security checkups

## 🔧 Troubleshooting

### Common Issues

**"Invalid API Key" Error**
- Check that you're using the correct key
- Verify the key hasn't been revoked
- Ensure proper header format
- Check IP restrictions if enabled

**"Rate Limit Exceeded" Error**
- Wait for the rate limit window to reset
- Upgrade to a higher tier if needed
- Implement exponential backoff in your code
- Contact support for custom limits

**Two-Factor Authentication Problems**
- Check your device's time is correct
- Try generating a new backup code
- Contact support if locked out
- Use alternative verification method

### Getting Help

- **Documentation**: Complete API reference
- **Support**: Email support@bondmcp.com
- **Status Page**: Check api-status.bondmcp.com
- **Community**: Join our Discord for help

## 🔄 Migration & Updates

### Updating API Keys

When rotating API keys:

1. **Generate New Key**: Create new key with same permissions
2. **Update Applications**: Replace old key in all applications
3. **Test**: Verify everything works with new key
4. **Revoke Old Key**: Delete the old key once confirmed

### Account Migration

Moving from another platform:

1. **Export Data**: Download your health data
2. **Import**: Use our data import tools
3. **Verify**: Check that all data transferred correctly
4. **Update Integrations**: Point apps to BondMCP API

---

**Your health data security is our top priority.** 🛡️ Follow these guidelines to keep your account secure while enjoying the full power of BondMCP's health AI platform.
