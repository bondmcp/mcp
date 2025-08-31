// Auto-generated TypeScript SDK for BondMCP
// Version: 2.1.0
// Generated from OpenAPI specification

export * from './generated';

// Re-export main client classes for convenience
import { Configuration, DefaultApi } from './generated';

export class BondMCPClient extends DefaultApi {
  constructor(apiKey: string, basePath = 'https://api.bondmcp.com') {
    const config = new Configuration({
      apiKey: `Bearer ${apiKey}`,
      basePath
    });
    super(config);
  }
}

export { Configuration };
