# API and SDK Version Compatibility

BondMCP follows [semantic versioning](https://semver.org/). The current stable API version is **v1** (OpenAPI `1.0.0`).

The table below shows which SDK versions are designed to work with this API version.

| SDK                        | Current Version | Supported API Versions | Notes                                   |
| -------------------------- | --------------- | ---------------------- | --------------------------------------- |
| Python (`bondmcp` package) | >=1.0.0         | v1                     | Use on Python 3.8+                      |
| TypeScript / JavaScript    | >=2.0.0         | v1                     | Package `@bondmcp/typescript-sdk`       |
| Go                         | >=2.0.0         | v1                     | Module `github.com/bondmcp/mcp/sdks/go` |

## Legacy SDKs

A legacy Python package named `bondmcp-sdk` (version `0.1.x`) targeted the pre-release `v0.9` API. It is deprecated and will receive no further updates. Upgrade to the `bondmcp` package version `1.0.0` or later for full API v1 support.

Early pre-release versions of our other SDKs (<1.0) were also built against the beta API and are no longer maintained. Always use the latest versions listed above when integrating with the BondMCP API.
