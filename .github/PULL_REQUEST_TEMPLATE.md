## Description

<!-- Provide a clear and concise description of your changes -->

## Type of Change

<!-- Mark with an `x` all the types that apply -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update (changes to documentation only)
- [ ] 🔧 Refactoring (code changes that neither fix a bug nor add a feature)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test changes (adding missing tests or correcting existing tests)
- [ ] 🔨 Build/CI changes (changes to build process or CI configuration)

## OpenAPI / Contract Impact

<!-- Complete this section if your changes affect the OpenAPI specification or API contracts -->

### Specification Changes
- [ ] OpenAPI specification updated (`openapi/bondmcp.v1.yaml`)
- [ ] New endpoints added
- [ ] Existing endpoints modified
- [ ] Request/response schemas changed
- [ ] Authentication/security schemes updated

### Documentation Updates
- [ ] API examples updated (`docs/api-reference/`)
- [ ] Integration guide updated (`docs/integration-lifecycle.md`)
- [ ] SDK documentation regenerated
- [ ] Postman collection updated (`bondmcp.postman_collection.json`)

### Breaking Changes Assessment
- [ ] **No breaking changes** - This is a backward-compatible change
- [ ] **Breaking changes included** - Existing integrations may be affected
  - [ ] Migration notes added to `MIGRATIONS/` directory
  - [ ] Version bump follows semantic versioning (major.minor.patch)
  - [ ] Deprecation warnings added for removed features

### Changelog & Migration
- [ ] Entry added to `CHANGELOG.md` with appropriate section:
  - [ ] Added (for new features)
  - [ ] Changed (for changes in existing functionality)
  - [ ] Deprecated (for soon-to-be removed features)
  - [ ] Removed (for now removed features)
  - [ ] Fixed (for any bug fixes)
  - [ ] Security (in case of vulnerabilities)
- [ ] Migration guide created (if breaking changes)
- [ ] Semantic diff can be generated cleanly

### SDK Impact
- [ ] Changes require SDK regeneration
- [ ] TypeScript SDK method signatures updated
- [ ] Python SDK method signatures updated
- [ ] SDK examples updated in documentation
- [ ] Frontend dependency bump required in anna.community

### Testing & Validation
- [ ] OpenAPI spec validates successfully
  ```bash
  npm run openapi:validate
  # or
  node scripts/validate_openapi.mjs openapi/bondmcp.v1.yaml
  ```
- [ ] Contract validation tests pass
  ```bash
  npm run test:contract
  ```
- [ ] API endpoints tested manually or via automation
- [ ] Breaking change detection confirms expectations

## Testing

<!-- Describe the tests you ran to verify your changes -->

### Test Coverage
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] API contract tests pass
- [ ] Manual testing completed

### Test Commands
```bash
# Commands used to test this change
npm test
npm run test:contract
# Add any specific test commands here
```

## Dependencies

<!-- List any dependencies that are required for this change -->

- [ ] Requires platform changes in bondmcp-platform
- [ ] Requires frontend changes in anna.community
- [ ] Requires infrastructure/deployment changes
- [ ] New npm/pip dependencies added

## Security Considerations

<!-- Address security implications of your changes -->

- [ ] No security implications
- [ ] Security review completed
- [ ] Authentication/authorization changes reviewed
- [ ] Input validation added/updated
- [ ] No sensitive data exposed in logs/responses

## Deployment Notes

<!-- Provide any special deployment instructions -->

- [ ] Standard deployment process
- [ ] Requires database migrations
- [ ] Requires environment variable changes
- [ ] Requires coordinated deployment with other services
- [ ] Rollback plan documented

## Checklist

<!-- General checklist for all PRs -->

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented appropriately
- [ ] No debug logs or console.log statements left in code
- [ ] Changes generate no new warnings
- [ ] Tests prove changes are effective or that feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published

## Additional Context

<!-- Add any other context, screenshots, or information about the PR here -->

### Related Issues
<!-- Link to any related issues -->
Closes #<!-- issue number -->

### Screenshots
<!-- If applicable, add screenshots to help explain your changes -->

### Performance Impact
<!-- Describe any performance implications -->

---

<!-- 
## For Reviewers

### Review Checklist
- [ ] Code quality and standards
- [ ] Test coverage adequacy
- [ ] Documentation completeness
- [ ] Security considerations
- [ ] Performance implications
- [ ] API contract compatibility
- [ ] Migration guide accuracy (if breaking changes)

### OpenAPI Contract Review
- [ ] Specification changes are minimal and necessary
- [ ] New endpoints follow existing patterns
- [ ] Response schemas are consistent
- [ ] Error handling is comprehensive
- [ ] Authentication requirements are clear
-->