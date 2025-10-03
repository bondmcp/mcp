# Pricing & Plans

BondMCP offers flexible pricing tiers to match your usage needs. All plans include access to our 5 Health AI APIs with pay-per-use billing.

## Pricing Tiers

| Feature | Free | Starter | Professional | Enterprise |
|---------|------|---------|--------------|------------|
| **Monthly Cost** | $0 | $29 | $99 | $299 |
| **API Rate Limit** | 100 req/day | 1,000 req/day | 10,000 req/day | Unlimited |
| **Health AI Credits** | $5/month | $50/month | $200/month | $500/month |
| **MCP Server Access** | ✅ | ✅ | ✅ | ✅ |
| **Support** | Community | Email | Priority Email | Phone + Slack |
| **Custom Models** | ❌ | ❌ | ✅ | ✅ |
| **SLA** | None | 99% | 99.5% | 99.9% |
| **Team Members** | 1 | 3 | 10 | Unlimited |

## Health AI API Costs

All plans pay per-use for Health AI requests. Credits are included monthly:

| API Endpoint | Cost per Request |
|--------------|------------------|
| Health Risk Analysis | $0.05 |
| Medication Interaction Check | $0.03 |
| Symptom Assessment | $0.04 |
| Treatment Recommendations | $0.06 |
| Clinical Data Extraction | $0.08 |

### Example Calculations

**Starter Plan ($29/month):**
- Base subscription: $29
- Included credits: $50
- **You can make**: 1,000 Health Risk Analysis requests included
- Additional usage billed at rates above

**Professional Plan ($99/month):**
- Base subscription: $99
- Included credits: $200
- **You can make**: 4,000 Health Risk Analysis requests included
- Higher rate limits + custom models

## Rate Limits

Rate limits reset every 24 hours at midnight UTC:

| Plan | Requests per Day | Requests per Minute |
|------|------------------|---------------------|
| Free | 100 | 10 |
| Starter | 1,000 | 50 |
| Professional | 10,000 | 200 |
| Enterprise | Unlimited | 1,000+ |

### Rate Limit Headers

All API responses include rate limit information:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1704153600
```

## How to Upgrade

### Via Dashboard

1. Log in to [BondMCP Dashboard](https://bondmcp.com)
2. Navigate to **Billing → Plans**
3. Click **Upgrade** on your desired tier
4. Enter payment details
5. Upgrade is instant

### Via API

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/billing/upgrade \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "professional",
    "billing_cycle": "monthly"
  }'
```

## Billing Cycle

- All plans billed monthly
- Credits reset on billing date
- Unused credits do not roll over
- Annual plans available (save 20%) - contact sales

## Overages

If you exceed your included credits:

1. **Starter & Professional**: Auto-billed at standard rates
2. **Free Plan**: Requests blocked until next billing cycle (upgrade anytime)

## Enterprise Custom Pricing

Need higher limits or custom features?

- **Volume Discounts**: 30%+ for high usage
- **Custom SLA**: 99.99% uptime guarantee
- **Dedicated Support**: Slack channel + phone
- **On-Premise Deployment**: Available

**Contact**: sales@bondmcp.com

## Free Trial

All new accounts start with Free plan:
- No credit card required
- $5 in Health AI credits
- 100 requests per day
- Upgrade anytime to unlock more

## Refund Policy

- **Monthly plans**: No refunds (cancel anytime)
- **Annual plans**: 30-day money-back guarantee
- **Unused credits**: Non-refundable

## Payment Methods

We accept:
- Credit/Debit cards (Visa, Mastercard, Amex)
- ACH (Enterprise only)
- Wire transfer (Enterprise only)

## FAQs

**Q: What happens if I hit my rate limit?**  
A: You'll receive a `429 Too Many Requests` error. Upgrade your plan or wait for the limit to reset.

**Q: Can I change plans mid-month?**  
A: Yes! Upgrades are prorated. Downgrades take effect at next billing cycle.

**Q: Are there setup fees?**  
A: No. Only pay the monthly subscription + usage.

**Q: Do you offer discounts for nonprofits?**  
A: Yes, 50% off for verified nonprofits. Email support@bondmcp.com.

## Need Help?

- Questions: support@bondmcp.com
- Enterprise sales: sales@bondmcp.com
- Billing issues: billing@bondmcp.com
