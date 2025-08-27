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
   python -m pip install --upgrade pip
   pip install -e '.[dev]'
   cd sdks/typescript && npm install
   ```

2. Optional: install Go tools if you plan to work with the Go SDK.

## Running Tests

From the repository root run:

```bash
pytest                 # Python tests
node --test tests/test_bondmcp_node.js   # Node tests
go test ./...          # Go tests (if any)
```

## Linting

Before submitting a pull request ensure all linters pass:

```bash
black --check .
isort --check .
flake8
mypy
cd sdks/typescript && npm run lint
# For Go code
gofmt -d $(git ls-files '*.go') | read; go vet ./...
```

## Submitting Pull Requests

1. Create a feature branch from `main`.
2. Make your changes with clear commits and add tests when applicable.
3. Run the linters and tests described above.
4. Open a pull request describing what was changed and why.

## Releasing and Versioning

### Python SDK

1. Update the version in `pyproject.toml` and `bondmcp_sdk/__init__.py`.
2. Build and publish:

   ```bash
   hatch build
   hatch publish  # requires PyPI credentials
   ```

### TypeScript/Node SDK

1. Update `sdks/typescript/package.json` with the new version.
2. Build and publish:

   ```bash
   cd sdks/typescript
   npm run build
   npm publish --access public
   ```

### Go SDK

1. Tag a release matching the module version, e.g. `git tag sdks/go/vX.Y.Z` and push the tag.
2. Users will fetch the new version via `go get`.

After publishing, update the **CHANGELOG** (CLI/API only) and create a GitHub release.
