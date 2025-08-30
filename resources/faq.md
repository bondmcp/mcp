---
description: Frequently asked questions about BondMCP Health AI Platform
---

# Frequently Asked Questions

## General Questions

### What is BondMCP?
BondMCP is a comprehensive health AI platform that provides advanced medical insights, clinical decision support, and health information services. Our platform combines cutting-edge artificial intelligence with medical expertise to deliver accurate, reliable health information.

### Who can use BondMCP?
BondMCP serves multiple audiences:
- **Healthcare Professionals**: Doctors, nurses, and clinical staff
- **Healthcare Organizations**: Hospitals, clinics, and health systems
- **Developers**: Building health applications and integrations
- **Researchers**: Conducting medical and health research
- **Consumers**: Individuals seeking reliable health information

### Is BondMCP HIPAA compliant?
Yes, BondMCP is designed with healthcare compliance in mind. We implement appropriate safeguards for protected health information (PHI) and support HIPAA-compliant implementations. However, compliance also depends on how you implement and use our services.

## API and Technical Questions

### How do I get started with the API?
1. **Sign up** for a BondMCP account at [app.bondmcp.com](https://app.bondmcp.com)
2. **Generate an API key** in your dashboard
3. **Install an SDK** (Python, JavaScript, Go, or CLI)
4. **Make your first API call** following our [Quick Start guide](../getting-started/quick-start.md)

### What are the API rate limits?
Rate limits vary by plan:
- **Free Tier**: 100 requests per hour
- **Professional**: 1,000 requests per hour
- **Enterprise**: Custom limits based on your needs

### Which programming languages are supported?
We provide official SDKs for:
- **Python** (3.7+)
- **JavaScript/TypeScript** (Node.js and browser)
- **Go** (1.18+)
- **CLI** (cross-platform command-line tool)

You can also use our REST API directly from any language that supports HTTP requests.

### How accurate is the health information?
Our AI models are trained on peer-reviewed medical literature and clinical guidelines. However:
- **Not a substitute** for professional medical advice
- **Always consult** healthcare professionals for medical decisions
- **Accuracy varies** by query complexity and available data
- **Confidence scores** are provided with responses

## Billing and Plans

### What plans are available?
- **Free Tier**: 100 API calls per month, basic support
- **Professional**: $99/month, 10,000 API calls, priority support
- **Enterprise**: Custom pricing, unlimited calls, dedicated support

### How is usage calculated?
Each API request counts as one call, regardless of the complexity of the query or length of the response.

### Can I upgrade or downgrade my plan?
Yes, you can change your plan at any time through your dashboard. Changes take effect immediately, and billing is prorated.

## Integration and Development

### Can I integrate BondMCP with my EHR system?
Yes, BondMCP is designed for healthcare system integration. We provide:
- **REST API** for custom integrations
- **Webhook support** for real-time updates
- **HL7 FHIR** compatibility (Enterprise plans)
- **Technical documentation** and integration guides

### Do you offer white-label solutions?
Enterprise customers can access white-label options, including:
- **Custom branding** for API responses
- **Private cloud deployment** options
- **Custom domain** configurations
- **Dedicated support** and SLAs

### How do I handle errors in my integration?
Our SDKs provide comprehensive error handling:
```python
try:
    response = client.ask("What is diabetes?")
except bondmcp.RateLimitError:
    # Handle rate limiting
    pass
except bondmcp.APIError as e:
    # Handle API errors
    print(f"Error: {e.message}")
```

## Security and Privacy

### How is my data protected?
- **Encryption**: All data is encrypted in transit and at rest
- **Access Controls**: Strict access controls and authentication
- **Audit Logs**: Comprehensive logging and monitoring
- **Compliance**: SOC 2 Type II certified, HIPAA compliant

### Do you store my API requests?
- **Logging**: We log requests for debugging and improvement purposes
- **Retention**: Logs are retained for 90 days by default
- **Privacy**: No PHI is stored without explicit consent
- **Deletion**: You can request data deletion at any time

### Can I use BondMCP in production?
Yes, BondMCP is production-ready with:
- **99.9% uptime SLA** (Enterprise plans)
- **24/7 monitoring** and support
- **Scalable infrastructure** handling millions of requests
- **Global CDN** for low-latency responses

## Support and Resources

### How do I get help?
- **Documentation**: Comprehensive guides and API reference
- **Support Email**: [support@bondmcp.com](mailto:support@bondmcp.com)
- **Community Forum**: [community.bondmcp.com](https://community.bondmcp.com)
- **Status Page**: [status.bondmcp.com](https://status.bondmcp.com)

### Do you offer training or consulting?
Enterprise customers receive:
- **Onboarding sessions** with our technical team
- **Integration consulting** and best practices
- **Custom training** for your development team
- **Ongoing support** and optimization recommendations

### Where can I find code examples?
Check out our [Examples section](../examples/README.md) for:
- **Basic usage** examples in all supported languages
- **Integration patterns** for common use cases
- **Best practices** for production deployments
- **Real-world scenarios** and implementations

## Medical Disclaimer

### Is BondMCP a medical device?
No, BondMCP is an information service and is not intended to diagnose, treat, cure, or prevent any disease. Always consult with qualified healthcare professionals for medical advice.

### Can I rely on BondMCP for medical decisions?
BondMCP provides information and insights to support decision-making but should never replace professional medical judgment. Always verify information with healthcare professionals and follow established clinical protocols.
