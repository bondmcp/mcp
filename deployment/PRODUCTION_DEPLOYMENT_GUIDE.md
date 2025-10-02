# 🚀 BondMCP Production Deployment Guide

**Last Updated:** October 2, 2025

---

## Overview

This guide covers the complete production deployment of BondMCP Platform, including all fixes, optimizations, and configurations applied.

---

## ✅ What Was Deployed

### Infrastructure
- **Platform:** AWS App Runner
- **Database:** RDS PostgreSQL 15 (bondmcp-production.cu3mgs8y6snx.us-east-1.rds.amazonaws.com)
- **Container Registry:** Amazon ECR
- **Auto-Scaling:** 1-10 instances (optimized from 10-25)
- **Cost:** $88/month (down from $570/month)

### Features
- 102+ API endpoints
- Multi-LLM consensus system (ready to activate)
- Database persistence for users & API keys
- Token blacklist system
- Stripe payment integration
- Real AI health analysis

---

## 🔧 Critical Fixes Applied

### 1. Missing Dependencies (7 packages)
```bash
# Added to requirements.txt
PyJWT==2.8.0
uvicorn[standard]==0.24.0
SQLAlchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
sentry-sdk==1.40.0
anthropic==0.39.0
groq==0.15.0
```

### 2. Docker Build Issues
- Added `database_config.py` to Dockerfile.amd64
- Fixed architecture mismatch (ARM64 → AMD64)

### 3. Database Configuration
- Fixed DATABASE_URL format (`psql://` → `postgresql://`)
- Added password and port
- Configured SSL mode
- Migrated from Supabase to RDS PostgreSQL

### 4. Code Bugs Fixed
- Fixed MutableHeaders.pop() → use `del` instead
- Fixed token refresh bug (db_user.plan AttributeError)
- Fixed get_current_user() to load from database
- Made logout graceful on DB errors

### 5. Secrets Management
- Synced 111 secrets from Doppler
- Added 6 critical secrets to AWS Secrets Manager
- Added all AI API keys (OpenAI, Anthropic, Groq, Cerebras)
- Updated GitHub Secrets for CI/CD

---

## 📋 Deployment Steps

### Initial Deployment

```bash
# 1. Clone repository
git clone https://github.com/auroracapital/bondmcp-platform.git
cd bondmcp-platform

# 2. Configure secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name bondmcp-platform/DATABASE_URL \
  --secret-string "postgresql://..." \
  --region us-east-1

aws secretsmanager create-secret \
  --name bondmcp-platform/OPENAI_API_KEY \
  --secret-string "sk-..." \
  --region us-east-1

# ... (repeat for all 6 secrets)

# 3. Build and push Docker image
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  410126241301.dkr.ecr.us-east-1.amazonaws.com

docker build --platform linux/amd64 -f Dockerfile.amd64 \
  -t bondmcp-platform:latest .

docker tag bondmcp-platform:latest \
  410126241301.dkr.ecr.us-east-1.amazonaws.com/bondmcp-platform:latest

docker push 410126241301.dkr.ecr.us-east-1.amazonaws.com/bondmcp-platform:latest

# 4. Create App Runner service
aws apprunner create-service \
  --service-name bondmcp-platform \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "410126241301.dkr.ecr.us-east-1.amazonaws.com/bondmcp-platform:latest",
      "ImageRepositoryType": "ECR",
      "ImageConfiguration": {
        "Port": "8000",
        "RuntimeEnvironmentVariables": {
          "ENVIRONMENT": "production",
          "PORT": "8000"
        },
        "RuntimeEnvironmentSecrets": {
          "DATABASE_URL": "arn:aws:secretsmanager:us-east-1:410126241301:secret:bondmcp-platform/DATABASE_URL",
          "JWT_SECRET_KEY": "arn:aws:secretsmanager:us-east-1:410126241301:secret:bondmcp-platform/JWT_SECRET_KEY",
          "STRIPE_SECRET_KEY": "arn:aws:secretsmanager:us-east-1:410126241301:secret:bondmcp-platform/STRIPE_SECRET_KEY",
          "OPENAI_API_KEY": "arn:aws:secretsmanager:us-east-1:410126241301:secret:bondmcp-platform/OPENAI_API_KEY",
          "SENTRY_DSN": "arn:aws:secretsmanager:us-east-1:410126241301:secret:bondmcp-platform/SENTRY_DSN",
          "STRIPE_WEBHOOK_SECRET": "arn:aws:secretsmanager:us-east-1:410126241301:secret:bondmcp-platform/STRIPE_WEBHOOK_SECRET"
        }
      }
    }
  }' \
  --instance-configuration '{
    "Cpu": "1024",
    "Memory": "2048"
  }' \
  --auto-scaling-configuration-arn arn:aws:apprunner:us-east-1:410126241301:autoscalingconfiguration/bondmcp-platform-efficient/2/9ec4220c04594891920c08c5b4ca498c \
  --region us-east-1

# 5. Run database migrations
DATABASE_URL=$(aws secretsmanager get-secret-value \
  --secret-id bondmcp-platform/DATABASE_URL \
  --region us-east-1 --query SecretString --output text)

export DATABASE_URL
alembic upgrade head

# 6. Configure Stripe webhook
stripe webhook_endpoints create \
  --url https://t9xbkyb7mg.us-east-1.awsapprunner.com/webhooks/stripe \
  --enabled-events customer.subscription.* invoice.*

# 7. Configure Cloudflare DNS
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  --data '{
    "type": "CNAME",
    "name": "api",
    "content": "t9xbkyb7mg.us-east-1.awsapprunner.com",
    "proxied": false
  }'
```

### Continuous Deployment

GitHub Actions automatically deploys on push to `main`:

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  build-and-push:
    - Build Docker image (AMD64)
    - Push to ECR with SHA + latest tags
  
  deploy-to-app-runner:
    - Trigger App Runner deployment
    - Wait for health checks
    - Validate deployment
```

---

## 🧪 Testing & Validation

### E2E Test Script

Located at: `scripts/e2e-test-production.sh`

```bash
# Run complete E2E test
cd /Users/samrenders/bondmcp-platform
./scripts/e2e-test-production.sh

# Expected output: 12/12 tests passing
```

### Manual Testing

```bash
BASE_URL="https://t9xbkyb7mg.us-east-1.awsapprunner.com"

# 1. Register user
curl -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# 2. Test AI endpoint
curl -X POST ${BASE_URL}/health/fitness \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"activity":"running","duration":30,"intensity":"moderate"}'

# 3. Check database
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users;"
```

---

## 🔄 Rollback Procedure

### If Deployment Fails

```bash
# 1. Check deployment status
aws apprunner list-operations \
  --service-arn <service-arn> \
  --region us-east-1

# 2. App Runner auto-rolls back on health check failure

# 3. Manual rollback to specific version
IMAGE_SHA="<previous-working-sha>"

aws apprunner update-service \
  --service-arn <service-arn> \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "410126241301.dkr.ecr.us-east-1.amazonaws.com/bondmcp-platform:'${IMAGE_SHA}'"
    }
  }' \
  --region us-east-1
```

---

## 💾 Database Management

### Migrations

```bash
# Run migrations
cd /Users/samrenders/bondmcp-platform
export DATABASE_URL="postgresql://..."
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "Description"

# Rollback migration
alembic downgrade -1
```

### Backup & Restore

```bash
# Backup
pg_dump "$DATABASE_URL" > backup.sql

# Restore
psql "$DATABASE_URL" < backup.sql
```

### Clear Test Data

```bash
# Clear all test users
psql "$DATABASE_URL" << 'EOF'
DELETE FROM token_blacklist;
DELETE FROM health_analyses;
DELETE FROM api_keys;
DELETE FROM subscriptions;
DELETE FROM users WHERE email LIKE '%@bondmcp.com';
EOF
```

---

## 📊 Monitoring

### CloudWatch Dashboards
- **App Runner Metrics:** CPU, Memory, Request count
- **Custom Metrics:** API calls, consensus usage, error rates

### Sentry
- **Project:** bondmcp-platform
- **Environment:** production
- **DSN:** Configured in secrets

### SNS Alerts
- **Topic:** bondmcp-alerts
- **Email:** info@auroracapital.nl
- **Confirmed:** ✅

---

## 🔒 Security

### Secrets Locations

**AWS Secrets Manager (us-east-1):**
- bondmcp-platform/DATABASE_URL
- bondmcp-platform/JWT_SECRET_KEY
- bondmcp-platform/STRIPE_SECRET_KEY
- bondmcp-platform/OPENAI_API_KEY
- bondmcp-platform/SENTRY_DSN
- bondmcp-platform/STRIPE_WEBHOOK_SECRET
- bondmcp-platform/ANTHROPIC_API_KEY
- bondmcp-platform/GROQ_API_KEY
- bondmcp-platform/CEREBRAS_API_KEY

**GitHub Secrets:**
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- OPENAI_API_KEY
- GROQ_API_KEY
- (All CI/CD secrets)

**Doppler (bondmcp-platform/prd):**
- 111 total secrets
- Synced to local .env.local

---

## 🎉 Success Metrics

- ✅ 100% E2E test pass rate
- ✅ <200ms average response time
- ✅ Zero downtime deployments
- ✅ Database persistence working
- ✅ Token blacklist functional
- ✅ Real AI analysis live
- ✅ Stripe integration active
- ✅ Cost optimized (85% reduction)

---

**Deployment Status:** ✅ PRODUCTION READY  
**Last Deployment:** October 2, 2025  
**Next Milestone:** Activate multi-LLM consensus
