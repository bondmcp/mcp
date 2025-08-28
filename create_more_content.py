#!/usr/bin/env python3

import os

# Create comprehensive content for remaining empty pages
additional_content = {
    "getting-started/authentication-setup.md": """# Authentication Setup

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
curl -X POST https://api.bondmcp.com/ask \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"question": "What are the benefits of exercise?"}'
```

### API Key in Header

Alternative method using custom header:

```bash
curl -X POST https://api.bondmcp.com/ask \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
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
""",

    "getting-started/first-api-call.md": """# Your First API Call

Ready to experience the power of BondMCP's health AI? This guide will walk you through making your first API call and understanding the response format.

## 🚀 Quick Start

Let's start with a simple health question using curl:

```bash
curl -X POST https://api.bondmcp.com/ask \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "What are the health benefits of drinking green tea?"
  }'
```

**Replace `YOUR_API_KEY`** with your actual API key from [app.bondmcp.com/settings/api-keys](https://app.bondmcp.com/settings/api-keys).

## 📋 Understanding the Response

Here's what you'll get back:

```json
{
  "success": true,
  "data": {
    "answer": "Green tea offers numerous health benefits due to its rich antioxidant content, particularly catechins like EGCG. Regular consumption may help reduce the risk of heart disease, support brain health, aid in weight management, and provide anti-inflammatory effects. Studies suggest 2-3 cups daily can be beneficial for most adults.",
    "confidence": 0.92,
    "sources": [
      {
        "title": "Green tea consumption and mortality due to cardiovascular disease",
        "url": "https://pubmed.ncbi.nlm.nih.gov/...",
        "type": "peer_reviewed",
        "relevance": 0.89
      }
    ],
    "related_topics": [
      "antioxidants",
      "cardiovascular health", 
      "weight management",
      "brain health"
    ],
    "follow_up_questions": [
      "How much green tea should I drink daily?",
      "Are there any side effects of green tea?",
      "What's the best time to drink green tea?"
    ]
  },
  "metadata": {
    "request_id": "req_abc123def456",
    "timestamp": "2025-01-28T10:30:00Z",
    "processing_time_ms": 245,
    "api_version": "2.1.0",
    "model_version": "health-ai-v3.2"
  }
}
```

## 🎯 Response Fields Explained

### Core Response Data

- **`answer`**: The main AI-generated response to your question
- **`confidence`**: How confident the AI is in the answer (0.0 to 1.0)
- **`sources`**: Scientific sources supporting the answer
- **`related_topics`**: Related health topics you might be interested in
- **`follow_up_questions`**: Suggested follow-up questions

### Metadata

- **`request_id`**: Unique identifier for this request (useful for support)
- **`timestamp`**: When the request was processed
- **`processing_time_ms`**: How long it took to generate the response
- **`api_version`**: API version used
- **`model_version`**: AI model version used

## 🔧 Adding Context for Better Results

Provide context to get more personalized answers:

```bash
curl -X POST https://api.bondmcp.com/ask \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "Should I take vitamin D supplements?",
    "context": {
      "age": 35,
      "gender": "female",
      "location": "Seattle, WA",
      "health_goals": ["bone health", "immune support"],
      "current_medications": ["birth control"],
      "dietary_restrictions": ["vegetarian"]
    }
  }'
```

### Available Context Fields

- **`age`**: Your age (helps with age-specific recommendations)
- **`gender`**: Your gender (for gender-specific health advice)
- **`location`**: Your location (for regional health considerations)
- **`health_goals`**: What you're trying to achieve
- **`current_medications`**: Medications you're taking
- **`dietary_restrictions`**: Any dietary limitations
- **`activity_level`**: How active you are
- **`health_conditions`**: Any existing health conditions

## 🧪 Lab Result Analysis

Analyze lab results with the `/labs/interpret` endpoint:

```bash
curl -X POST https://api.bondmcp.com/labs/interpret \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "lab_results": [
      {
        "test_name": "Total Cholesterol",
        "value": 220,
        "unit": "mg/dL",
        "reference_range": "< 200 mg/dL"
      },
      {
        "test_name": "HDL Cholesterol", 
        "value": 45,
        "unit": "mg/dL",
        "reference_range": "> 40 mg/dL (men), > 50 mg/dL (women)"
      }
    ],
    "patient_context": {
      "age": 42,
      "gender": "male",
      "health_history": ["family history of heart disease"]
    }
  }'
```

## 🥗 Nutrition Analysis

Analyze foods and meals:

```bash
curl -X POST https://api.bondmcp.com/nutrition/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "food_items": [
      "1 cup cooked quinoa",
      "4 oz grilled salmon",
      "1 cup steamed broccoli",
      "1 tbsp olive oil"
    ],
    "analysis_type": "meal",
    "dietary_goals": ["high protein", "anti-inflammatory"]
  }'
```

## 💊 Supplement Recommendations

Get personalized supplement advice:

```bash
curl -X POST https://api.bondmcp.com/supplements/recommend \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "health_goals": ["immune support", "energy", "stress management"],
    "current_supplements": ["multivitamin"],
    "dietary_restrictions": ["vegan"],
    "budget": "moderate",
    "context": {
      "age": 28,
      "gender": "female",
      "activity_level": "moderate",
      "stress_level": "high"
    }
  }'
```

## 🩺 Symptom Checking

Analyze symptoms (not a replacement for medical advice):

```bash
curl -X POST https://api.bondmcp.com/symptoms/check \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "symptoms": [
      {
        "symptom": "headache",
        "severity": "moderate",
        "duration": "3 days",
        "frequency": "daily"
      },
      {
        "symptom": "fatigue",
        "severity": "mild",
        "duration": "1 week",
        "frequency": "constant"
      }
    ],
    "context": {
      "age": 30,
      "gender": "female",
      "recent_changes": ["started new job", "less sleep"]
    }
  }'
```

## 🔍 Error Handling

Handle errors gracefully:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The question field is required",
    "details": {
      "missing_fields": ["question"],
      "provided_fields": ["context"]
    }
  },
  "metadata": {
    "request_id": "req_error_123",
    "timestamp": "2025-01-28T10:30:00Z"
  }
}
```

### Common Error Codes

- **`INVALID_REQUEST`**: Missing or invalid parameters
- **`UNAUTHORIZED`**: Invalid or missing API key
- **`RATE_LIMIT_EXCEEDED`**: Too many requests
- **`INSUFFICIENT_CREDITS`**: Not enough API credits
- **`INTERNAL_ERROR`**: Server error (contact support)

## 📚 SDK Examples

### Python

```python
import requests

def ask_health_question(question, api_key):
    url = "https://api.bondmcp.com/ask"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {"question": question}
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
result = ask_health_question(
    "What foods are good for brain health?", 
    "your_api_key_here"
)
print(result["data"]["answer"])
```

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function askHealthQuestion(question, apiKey) {
  try {
    const response = await axios.post('https://api.bondmcp.com/ask', {
      question: question
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

// Usage
askHealthQuestion("What are the benefits of meditation?", "your_api_key_here")
  .then(result => console.log(result.data.answer))
  .catch(error => console.error(error));
```

### CLI Tool

```bash
# Install the CLI
pip install bondmcp-cli

# Authenticate
bondmcp auth login

# Ask questions
bondmcp ask "What supplements should I take for joint health?"

# Analyze labs
bondmcp labs analyze --file my_lab_results.json

# Get nutrition info
bondmcp nutrition analyze "1 cup oatmeal with blueberries"
```

## 🎯 Best Practices

### Request Optimization

1. **Be Specific**: More specific questions get better answers
2. **Provide Context**: Age, gender, and health goals improve responses
3. **Use Follow-ups**: Build on previous questions for deeper insights
4. **Batch Related Questions**: Group related queries when possible

### Error Handling

1. **Check Response Status**: Always check the `success` field
2. **Implement Retry Logic**: Use exponential backoff for rate limits
3. **Log Request IDs**: Save request IDs for debugging
4. **Handle Timeouts**: Set appropriate timeout values

### Security

1. **Secure API Keys**: Never expose keys in client-side code
2. **Use HTTPS**: Always use secure connections
3. **Rotate Keys**: Regularly rotate API keys
4. **Monitor Usage**: Track API usage for unusual patterns

## 🚀 What's Next?

Now that you've made your first API call, explore these advanced features:

1. **[Complete API Reference](../api-reference/endpoints.md)** - All available endpoints
2. **[SDK Documentation](../sdks/sdk-overview.md)** - Language-specific libraries
3. **[Health AI Examples](../examples/health-ai-examples.md)** - Real-world use cases
4. **[Integration Guides](../guides/health-ai-integration.md)** - Building health applications

---

**Congratulations!** 🎉 You've successfully made your first API call to BondMCP. Start building amazing health applications with our powerful AI platform!
"""
}

# Create the additional content files
for file_path, content in additional_content.items():
    full_path = file_path
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)
    print(f"Created: {full_path}")

print("\\nAdditional comprehensive content files created successfully!")
