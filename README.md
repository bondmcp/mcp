# BondMCP API Documentation

> **⚠️ CURRENT STATUS: Limited Deployment (14.3% Functional)**
> 
> The BondMCP platform is currently running in a limited deployment mode due to resource constraints. Only core system endpoints and basic authentication are available. Full health AI features are under deployment.

## 🚨 Current Platform Status

**Last Updated**: August 4, 2025  
**Deployment Status**: Partial (6/42 endpoints functional)  
**Core Health AI**: ❌ Not Available  
**Basic System**: ✅ Available  

## ✅ Currently Available Endpoints

### Core System (4 endpoints)
- `GET /` - API root and status
- `GET /health` - System health check  
- `GET /docs` - Interactive API documentation
- `GET /openapi.json` - OpenAPI specification

### User Management (2 endpoints)
- `GET /billing/usage` - View usage statistics (requires authentication)
- `GET /admin/users` - User administration (requires authentication)

## ❌ Temporarily Unavailable Features

The following features are in the codebase but not currently deployed due to resource constraints:

### Health AI Features (Under Deployment)
- Health question answering
- Medical data analysis
- Trust score verification
- Health recommendations
- Clinical insights

### Research Integration (Under Deployment)  
- PubMed literature search
- Clinical trial matching
- Research analysis

### Healthcare Services (Under Deployment)
- Provider directory
- Facility finder
- Specialty matching
- Insurance verification

### Advanced Billing (Under Deployment)
- Subscription management
- Payment processing
- Invoice generation

## 🔧 Getting Started (Limited Mode)

### 1. Test Basic Connectivity

```bash
# Check API status
curl https://api.bondmcp.com/

# Check system health
curl https://api.bondmcp.com/health

# View interactive docs
open https://api.bondmcp.com/docs
```

### 2. Authentication Setup

```python
import requests

# Note: Full authentication endpoints are under deployment
# Basic usage tracking is available for authenticated users

response = requests.get(
    "https://api.bondmcp.com/billing/usage",
    headers={"Authorization": "Bearer YOUR_TOKEN"}
)
```

## 📋 Deployment Roadmap

### Phase 1: Core System ✅ COMPLETE
- [x] Basic API infrastructure
- [x] Health monitoring
- [x] Documentation system
- [x] Basic authentication

### Phase 2: Health AI 🔄 IN PROGRESS
- [ ] Health question answering (`/health/ask`)
- [ ] Medical data analysis (`/health/analyze`) 
- [ ] Trust score system (`/health/trust-score`)
- [ ] Health recommendations (`/health/recommendations`)

### Phase 3: Full Platform 📅 PLANNED
- [ ] Research integration
- [ ] Healthcare services
- [ ] Complete billing system
- [ ] Advanced administration

## 🚀 Full Platform Preview

Once deployment is complete, the platform will include:

- **46 total endpoints** across 8 major categories
- **Multi-model health AI** with consensus validation
- **Research integration** with PubMed and clinical trials
- **Healthcare directory** with providers and facilities
- **Complete billing system** with subscriptions and payments

## 📞 Support

- **Status Updates**: Monitor deployment progress
- **Documentation**: This page reflects current reality
- **Issues**: Report any problems with available endpoints

## ⚠️ Important Notes

1. **Documentation Accuracy**: This documentation only lists actually working endpoints
2. **Feature Availability**: Check endpoint status before integration
3. **Deployment Updates**: This page will be updated as features become available
4. **Testing**: All listed endpoints have been verified as functional

---

*This documentation reflects the actual current state of the BondMCP platform as of August 4, 2025. Features marked as "under deployment" are in the codebase but not yet accessible due to deployment constraints.*

