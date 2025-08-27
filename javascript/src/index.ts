/**
 * BondMCP TypeScript SDK
 * 
 * The official TypeScript SDK for the BondMCP health AI platform.
 * This SDK provides a type-safe interface to all BondMCP API endpoints.
 * 
 * @version 1.0.1
 */

// Export generated types and clients
export * from './generated';

// Configuration interface
export interface BondMCPConfig {
  /** Your BondMCP API key */
  apiKey: string;
  /** Base URL for the API (defaults to production) */
  basePath?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Custom headers to include with requests */
  headers?: Record<string, string>;
}

// Convenience interfaces for common operations
export interface HealthQuestion {
  question: string;
  detailed?: boolean;
}

export interface HealthAnswer {
  id: string;
  answer: string;
  trustScore: number;
  sources: string[];
}

export interface SymptomAnalysisRequest {
  symptoms: string[];
  age?: number;
  gender?: string;
}

export interface SymptomAnalysisResponse {
  analysis: string;
  severity: string;
  recommendations: string[];
}

export class BondMCPInfrastructureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BondMCPInfrastructureError';
  }
}

export class BondMCPError extends Error {
  public statusCode?: number;
  public response?: any;

  constructor(message: string, statusCode?: number, response?: any) {
    super(message);
    this.name = 'BondMCPError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class BondMCP {
  private config: Required<BondMCPConfig>;
  private baseURL: string;
  private apiAvailable: boolean | null = null;

  constructor(config: BondMCPConfig) {
    this.config = {
      environment: 'production',
      timeout: 30000,
      retries: 3,
      rateLimit: { requests: 100, window: 60000 },
      ...config,
    };

    this.baseURL = this.config.environment === 'production' 
      ? 'https://api.bondmcp.com'
      : 'https://api-staging.bondmcp.com';
  }

  private async checkApiAvailability(): Promise<boolean> {
    if (this.apiAvailable !== null) {
      return this.apiAvailable;
    }

    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        timeout: 5000,
      });
      this.apiAvailable = response.ok;
      return this.apiAvailable;
    } catch (error) {
      this.apiAvailable = false;
      return false;
    }
  }

  private handleApiUnavailable(methodName: string): never {
    throw new BondMCPInfrastructureError(
      `BondMCP API infrastructure is not yet deployed. ` +
      `The domain '${this.baseURL}' is not available. ` +
      `Method '${methodName}' cannot be executed. ` +
      `See ACTUAL_API_STATUS.md for current deployment status.`
    );
  }

  /**
   * Ask a health question using multi-model consensus
   */
  async ask(request: AskRequest): Promise<AskResponse> {
    if (!(await this.checkApiAvailability())) {
      this.handleApiUnavailable('ask');
    }
    return this.makeRequest('/ask', 'POST', request);
  }
// High-level client class
import { Configuration, DefaultApi } from './generated';

export class BondMCPClient {
  private api: DefaultApi;

  constructor(config: BondMCPConfig) {
    const { apiKey, basePath, ...otherConfig } = config;
    const configuration = new Configuration({
      basePath: basePath || 'https://api.bondmcp.com',
      apiKey,
      ...otherConfig
    });
    
    this.api = new DefaultApi(configuration);
  }

  /**
   * Ask a health question
   */
  async ask(request: HealthQuestion): Promise<HealthAnswer> {
    const response = await this.api.apiV1AskPost(request);
    return response.data as HealthAnswer;
  }

  /**
   * Analyze symptoms
   */
  async analyzeSymptoms(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
    const response = await this.api.apiV1SymptomsPost(request);
    return response.data as SymptomAnalysisResponse;
  }

  /**
   * Health check
   */
  async health(): Promise<{ status: string; timestamp: string }> {
    const response = await this.api.apiV1HealthGet();
    return response.data as { status: string; timestamp: string };
  }
}

// Default export
export default BondMCPClient;

