# Healify Multi-Repository System

## System Overview
Healify is a comprehensive health and wellness platform consisting of three interconnected repositories:

### 1. healify (React Native Mobile App)
**Location**: `/Users/samrenders/Cursor/healify`
**Purpose**: Frontend mobile application for iOS/Android
**Tech Stack**: React Native, Expo, TypeScript, RTK Query
**Key Features**:
- HealthKit integration (150+ metrics)
- Real-time health tracking
- DNA-based insights
- Meditation & wellness features
- Cross-platform mobile app

### 2. healify-api (NestJS Backend)
**Location**: `/Users/samrenders/healify-api`
**Purpose**: Backend API and data processing
**Tech Stack**: NestJS, TimescaleDB, DragonflyDB, Prisma
**Key Features**:
- RESTful API endpoints
- Time-series health data storage
- Real-time caching with DragonflyDB
- Authentication & authorization
- HIPAA-compliant data handling

### 3. healify-langgraphs (AI Orchestration)
**Location**: `/Users/samrenders/healify-langgraphs`
**Purpose**: AI-powered health insights and agent orchestration
**Tech Stack**: Python, LangGraph, FastAPI
**Key Features**:
- Multi-agent AI system (Anna orchestrator + domain agents)
- DNA analysis and personalized recommendations
- Meditation guidance generation
- Health insights processing
- Self-learning system

**Deployment Model** (Dual Environment):
- **Staging**: `dev` branch → LangGraph Cloud Staging
  - URL: https://healify-dev-5bb9d68c511a5d54a723825330974b9c.us.langgraph.app
  - Auto-deploys on push to `dev`
- **Production**: `main` branch → LangGraph Cloud Production
  - Merged from `dev` when stable
  - Auto-deploys on push to `main`

## Cross-Repository Integration

### Data Flow
```
Mobile App (healify)
    ↓ HTTP/WebSocket
Backend API (healify-api)
    ↓ HTTP/SSE
AI Orchestration (healify-langgraphs)
    ↑ Insights & Recommendations
Backend API
    ↑ Real-time Updates
Mobile App
```

### Key Integration Points
1. **API Endpoints**: healify → healify-api (port 3000)
2. **AI Processing**: healify-api → healify-langgraphs (port 8000)
3. **Real-time Events**: WebSocket connections for live updates
4. **Shared Types**: TypeScript types synchronized across repos

## Development Workflow

### Working on Features
When implementing features across repos:
1. Start with API endpoint design in `healify-api`
2. Implement AI processing in `healify-langgraphs` if needed
3. Build UI components in `healify`
4. Test end-to-end integration

### Testing Strategy
- **Unit Tests**: Per-repo test suites
- **Integration Tests**: Cross-repo API testing
- **E2E Tests**: Full user flow testing

### Deployment

#### Mobile App (healify)
- **Platform**: EAS Build
- **Distribution**: TestFlight (iOS) / Play Console (Android)
- **Branch**: Feature branches → `dev` → `main` (releases)

#### Backend API (healify-api)
- **Platform**: AWS EC2 / PM2
- **URL**: https://ai.healify.ai
- **Branch**: Feature branches → `dev` → `main`

#### AI Orchestration (healify-langgraphs)
**Dual Deployment Model**:
- **Staging (dev)**:
  - Platform: LangGraph Cloud Studio
  - URL: https://healify-dev-5bb9d68c511a5d54a723825330974b9c.us.langgraph.app
  - Workflow: Feature PRs → `dev` → Auto-deploy to staging

- **Production (main)**:
  - Platform: LangGraph Cloud Studio
  - URL: https://healify-main-78d1069f06645ab9a736108dd385cfb5.us.langgraph.app
  - Workflow: `dev` PR → `main` → Auto-deploy to production

**Branching Strategy**:
```bash
# Feature development
feature/your-feature → dev (staging)

# Production release
dev → main (production)
```

## Agent Instructions

When working on this project:
1. **Always consider cross-repo impacts** - changes in one repo may affect others
2. **Check all 3 repos** for related code before making changes
3. **Update types** across repos when changing data structures
4. **Test integration** after changes to API contracts
5. **Document breaking changes** in all affected repos

## Common Tasks

### Adding a New Health Metric
1. `healify`: Add TypeScript type in `src/types/`
2. `healify-api`: Add database model and endpoint
3. `healify`: Add UI component and API hook
4. `healify-langgraphs`: Add AI analysis if applicable

### Adding AI Feature
1. `healify-langgraphs`: Create new agent or extend existing
2. `healify-api`: Add endpoint to trigger AI processing
3. `healify`: Add UI to display AI insights

### Debugging Issues
1. Check logs in all 3 repos
2. Verify API connectivity between services
3. Check database state in healify-api
4. Review AI agent logs in healify-langgraphs

## Quick Reference

### Start All Services
```bash
# Terminal 1: Mobile app
cd ~/Cursor/healify && npm start

# Terminal 2: Backend API
cd ~/healify-api && npm run start:dev

# Terminal 3: AI service
cd ~/healify-langgraphs && uvicorn server:app --reload
```

### Run All Tests
```bash
cd ~/Cursor/healify && npm test
cd ~/healify-api && npm test
cd ~/healify-langgraphs && pytest
```

### Check Service Health
```bash
curl https://api.healify.ai/health
curl https://graph.healify.ai/health
```

## Repository Status
- **Production**: All services deployed and operational
- **Development**: Active development on all 3 repos
- **CI/CD**: GitHub Actions configured for all repos
- **Monitoring**: Sentry error tracking enabled

## Important Notes
- All repos use environment-based configuration
- Secrets managed via Doppler/GitHub Secrets
- HIPAA compliance requirements apply to all repos
- Security: Regular dependency updates required
