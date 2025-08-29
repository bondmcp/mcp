// DO NOT EDIT: This file is auto-generated from the OpenAPI specification
// Manual edits will be overwritten during the next SDK generation

export * from './generated';

// Auth wrapper for convenience
export class BondMCPClient {
  private apiKey?: string;
  private bearerToken?: string;
  private baseUrl: string;

  constructor(config: {
    apiKey?: string;
    bearerToken?: string;
    baseUrl?: string;
  }) {
    this.apiKey = config.apiKey;
    this.bearerToken = config.bearerToken;
    this.baseUrl = config.baseUrl || 'https://api.bondmcp.com/v1';
  }

  // Helper method to create authenticated headers
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    } else if (this.bearerToken) {
      headers['Authorization'] = `Bearer ${this.bearerToken}`;
    }

    return headers;
  }

  // Convenience methods will be auto-generated here
  // This is a placeholder for the auth wrapper functionality
}