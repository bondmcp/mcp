# 🔄 GitHub Workflows Documentation

## Overview
This repository uses a standardized workflow architecture for consistent CI/CD operations across Aurora Capital projects.

## Workflow Architecture

### 01-ci.yml - Continuous Integration
- **Purpose**: Code quality, testing, building, and security scanning
- **Triggers**: Push to main/develop, Pull requests
- **Duration**: ~5-10 minutes
- **Outputs**: Build artifacts, test reports, security scan results
- **Dependencies**: None

### 02-security.yml - Security & Compliance
- **Purpose**: Advanced security scanning and vulnerability detection
- **Triggers**: Push to main, PRs, weekly schedule (Monday 2 AM)
- **Duration**: ~3-5 minutes
- **Outputs**: Security reports, vulnerability alerts, SARIF files
- **Dependencies**: None

### 03-deploy-production.yml - Production Deployment
- **Purpose**: Automated deployment to production environment
- **Triggers**: Push to main branch (after CI passes)
- **Duration**: ~5-15 minutes
- **Outputs**: Deployed application, deployment logs
- **Dependencies**: CI workflow must pass

### 04-deploy-staging.yml - Staging Deployment
- **Purpose**: Automated deployment to staging environment
- **Triggers**: Push to develop branch
- **Duration**: ~5-15 minutes
- **Outputs**: Deployed staging application
- **Dependencies**: None

### 05-maintenance.yml - Automated Maintenance
- **Purpose**: Dependency updates, cleanup tasks, health monitoring
- **Triggers**: Weekly schedule (Monday 6 AM), manual dispatch
- **Duration**: ~10-20 minutes
- **Outputs**: Dependency update PRs, health reports
- **Dependencies**: None

## Workflow Standards

### Naming Convention
- Workflows are numbered for execution order clarity
- Names are descriptive and consistent across repositories
- File names use kebab-case: `01-ci.yml`

### Common Features
- All workflows use `info@auroracapital.nl` for git configuration
- Consistent error handling and continue-on-error where appropriate
- Comprehensive logging and status reporting
- Security-first approach with vulnerability scanning

### Environment Variables
- `NODE_VERSION: '20'` - Standard Node.js version
- `PYTHON_VERSION: '3.11'` - Standard Python version
- Repository-specific variables in workflow files

## Maintenance

### Regular Tasks
- **Weekly**: Dependency updates via automated maintenance workflow
- **Monthly**: Workflow review and optimization
- **Quarterly**: Security audit and compliance review

### Troubleshooting
1. Check workflow logs in GitHub Actions tab
2. Verify environment variables and secrets
3. Ensure branch protection rules don't conflict
4. Contact: info@auroracapital.nl

### Customization
Each repository may have unique requirements:
- Add repository-specific steps to existing workflows
- Create additional workflows for special needs (numbered 06+)
- Maintain consistency with the standardized architecture

## Security Considerations
- All workflows include security scanning
- Secrets are properly managed via GitHub Secrets
- No hardcoded credentials or sensitive data
- Regular vulnerability assessments

---

**Last Updated**: 2025-09-07  
**Maintained By**: Aurora Capital DevOps Team  
**Contact**: info@auroracapital.nl
