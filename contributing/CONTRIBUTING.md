# Contributing to BondMCP

Thank you for wanting to contribute to BondMCP! We welcome pull requests and issues from the community.

## Opening Issues

- Search [existing issues](https://github.com/bondmcp/mcp/issues) before filing a new one.
- Include as much detail as possible: environment info, steps to reproduce, logs, and expected vs. actual behavior.
- For security concerns please email [support@bondmcp.com](mailto:support@bondmcp.com) rather than opening a public issue.

## Development Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/bondmcp/mcp.git
   cd mcp
   npm install
   python -m pip install --upgrade pip
   pip install -e '.[dev]'
   cd sdks/typescript && npm install
   ```

2. Optional: install Go tools if you plan to work with the Go SDK.

## OpenAPI Specification Changes

When making changes to the OpenAPI specification, follow these steps:

### 1. Making Spec Changes

1. Edit the specification files in `spec/` or `openapi/` directories
2. Ensure your changes follow the [OpenAPI Style Guide](../docs/OPENAPI_STYLE.md)
3. Run validation locally:
   ```bash
   npm run spec:lint
   npm run spec:bundle
   ```

### 2. Running Diff Locally

Before submitting a PR, check what type of changes you're making:

```bash
npm run spec:diff  # Compare against origin/main
```

This will help you understand if your changes are:
- **BREAKING** (removed endpoints/fields, narrowed types)
- **NON_BREAKING** (additive changes like new endpoints)
- **PATCH** (documentation/examples only)

### 3. PR Requirements

Based on your change type, ensure you have:

**For BREAKING changes:**
- [ ] Add `breaking-change` label to your PR
- [ ] Update CHANGELOG.md with breaking changes section
- [ ] Include migration documentation in `MIGRATIONS/`

**For NON_BREAKING (additive) changes:**
- [ ] Add `feat` or `docs-update` label to your PR  
- [ ] Update CHANGELOG.md with new features section

**For PATCH (documentation) changes:**
- [ ] Add `docs` or `chore` label to your PR

### 4. Automatic SDK Regeneration

When you submit a PR with spec changes:
- SDKs will be automatically regenerated
- The PR will be updated with the generated SDK changes
- Review the generated code before merging

### 5. Manual SDK Regeneration

To regenerate SDKs locally:

```bash
npm run sdk:gen          # Generate all SDKs
npm run sdk:gen:typescript  # TypeScript SDK only
npm run sdk:gen:python   # Python SDK only (if enabled)
npm run sdk:verify       # Check if SDKs are in sync
```

## Running Tests

From the repository root run:

```bash
npm test              # Node.js tests
pytest                # Python tests (if any)
go test ./...         # Go tests (if any)
```

## Linting

Before submitting a pull request ensure all linters pass:

```bash
npm run spec:lint     # OpenAPI specification linting
cd sdks/typescript && npm run lint  # TypeScript SDK linting
black --check .       # Python code formatting
isort --check .       # Python import sorting
flake8               # Python linting
mypy                 # Python type checking
```

## Pre-commit Hooks

This repository uses pre-commit hooks to ensure code quality:

```bash
# Install pre-commit hooks (one-time setup)
npm install -g lefthook
lefthook install

# Pre-commit will now automatically run on git commit
```

## Submitting Pull Requests

1. Create a feature branch from `main`.
2. Make your changes with clear commits and add tests when applicable.
3. For spec changes, follow the [OpenAPI change process](#openapi-specification-changes).
4. Run the linters and tests described above.
5. Open a pull request describing what was changed and why.

## Releasing and Versioning

Our release process is automated. To release:

1. **Update Version**: Ensure versions in `package.json` and SDK packages match your intended release
2. **Update CHANGELOG**: Add your changes to `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/) format
3. **Create Tag**: Push a version tag (e.g., `git tag v1.2.3 && git push origin v1.2.3`)
4. **Automatic Release**: The [Release SDKs workflow](../.github/workflows/release-sdks.yml) will:
   - Validate versions match the tag
   - Build and test all SDKs
   - Publish to npm and PyPI (if enabled)
   - Create a GitHub release with changelog

### Manual SDK Publishing (Legacy)

For manual publishing (not recommended):

#### TypeScript SDK
```bash
cd sdks/typescript
npm run build
npm publish --access public
```

#### Python SDK
```bash
cd sdks/python
python -m hatch build
python -m twine upload dist/*
```

#### Go SDK
```bash
git tag sdks/go/vX.Y.Z
git push origin sdks/go/vX.Y.Z
```

## Release Workflow Features

- **Dry Run Mode**: Test releases without actually publishing
- **Version Validation**: Ensures SDK versions match release tags
- **Automatic Changelog**: Extracts release notes from CHANGELOG.md
- **Multi-Registry Publishing**: Supports npm, PyPI, and Go modules
- **Safety Checks**: Prevents duplicate releases and validates builds

For more details, see [SDK Publishing Guide](../docs/SDK_PUBLISHING.md).
