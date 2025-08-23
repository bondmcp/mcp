/**
 * BondMCP JavaScript SDK
 * TypeScript-first SDK for the BondMCP health AI protocol
 */

export interface BondMCPConfig {
  apiKey: string;
  environment?: 'production' | 'staging';
  timeout?: number;
  retries?: number;
  rateLimit?: {
    requests: number;
    window: number;
  };
}

export interface AskRequest {
  query: string;
  conversationId?: string;
  includeCitations?: boolean;
  modelPreference?: 'consensus' | 'claude' | 'gpt4' | 'medlm';
}

export interface AskResponse {
  answer: string;
  confidenceScore: number;
  citations?: Citation[];
  conversationId: string;
  modelUsed: string[];
}

export interface Citation {
  source: string;
  url?: string;
  relevanceScore: number;
}

export interface LabResult {
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
}

export interface PatientContext {
  age?: number;
  gender?: string;
  medicalHistory?: string[];
}

export interface LabInterpretRequest {
  labResults: LabResult[];
  patientContext?: PatientContext;
}

export interface LabInterpretResponse {
  interpretation: string;
  abnormalResults: LabResult[];
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class BondMCP {
  private config: Required<BondMCPConfig>;
  private baseURL: string;

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

  /**
   * Ask a health question using multi-model consensus
   */
  async ask(request: AskRequest): Promise<AskResponse> {
    return this.makeRequest('/ask', 'POST', request);
  }

  /**
   * Create a streaming response for long-form queries
   */
  async *askStream(request: AskRequest): AsyncGenerator<{ content: string }> {
    // Implementation for streaming responses
    const response = await this.makeRequest('/ask/stream', 'POST', request);
    
    // Mock streaming implementation
    const chunks = response.answer.split(' ');
    for (const chunk of chunks) {
      yield { content: chunk + ' ' };
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  /**
   * Lab interpretation service
   */
  get labs() {
    return {
      interpret: async (request: LabInterpretRequest): Promise<LabInterpretResponse> => {
        return this.makeRequest('/labs/interpret', 'POST', request);
      }
    };
  }

  /**
   * Supplement recommendation service
   */
  get supplements() {
    return {
      recommend: async (request: any): Promise<any> => {
        return this.makeRequest('/supplements/recommend', 'POST', request);
      }
    };
  }

  /**
   * Create a WebSocket connection for real-time updates
   */
  createWebSocket(): WebSocket {
    const wsUrl = this.baseURL.replace('https://', 'wss://') + '/ws';
    const ws = new WebSocket(wsUrl);

    return ws;
  }

  /**
   * Make HTTP request with retry logic and rate limiting
   */
  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'User-Agent': 'BondMCP-JS-SDK/1.0.0'
      },
      body: data ? JSON.stringify(data) : /**
 * BondMCP TypeScript SDK
 * 
 * The official TypeScript SDK for the BondMCP health AI platform.
 * This SDK provides a type-safe interface to all BondMCP API endpoints.
 */

// Export generated types and clients
export * from './generated';

// Configuration and utilities
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

export interface HealthQuestion {
  question: string;
  detailed?: boolean;
  categories?: string[];
}

export interface HealthAnswer {
  id: string;
  answer: string;
  trustScore: number;
  sources: string[];
  categories?: string[];
  timestamp: string;
}

/**
 * Main BondMCP client class
 * 
 * @example
 * ```typescript
 * import { BondMCPClient } from '@bondmcp/sdk';
 * 
 * const client = new BondMCPClient({
 *   apiKey: 'your-api-key'
 * });
 * 
 * const response = await client.health.ask({
 *   question: 'What are the symptoms of diabetes?'
 * });
 * ```
 */
export class BondMCPClient {
  private config: BondMCPConfig;
  private basePath: string;

  constructor(config: BondMCPConfig) {
    this.config = {
      basePath: 'https://api.bondmcp.com',
      timeout: 30000,
      ...config
    };
    this.basePath = this.config.basePath!;
  }

  /**
   * Health-related endpoints
   */
  get health() {
    return {
      /**
       * Ask a health question
       */
      ask: async (question: HealthQuestion): Promise<HealthAnswer> => {
        const response = await this.makeRequest('POST', '/api/v1/ask', question);
        return response.data;
      }
    };
  }

  /**
   * Lab-related endpoints
   */
  get labs() {
    return {
      /**
       * Interpret lab results
       */
      interpret: async (labResults: any[]): Promise<any> => {
        const response = await this.makeRequest('POST', '/api/v1/labs/interpret', {
          lab_results: labResults
        });
        return response.data;
      }
    };
  }

  /**
   * Supplement-related endpoints
   */
  get supplement() {
    return {
      /**
       * Get supplement recommendations
       */
      recommend: async (healthGoals: string[]): Promise<any> => {
        const response = await this.makeRequest('POST', '/api/v1/supplement/recommend', {
          health_goals: healthGoals
        });
        return response.data;
      }
    };
  }

  /**
   * Make an authenticated request to the API
   */
  private async makeRequest(method: string, endpoint: string, data?: any) {
    const url = `${this.basePath}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.config.apiKey,
      ...this.config.headers
    };

    const requestConfig: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.config.timeout!)
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestConfig.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, requestConfig);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new BondMCPError(
          response.status,
          errorData.code || 'unknown_error',
          errorData.message || response.statusText
        );
      }

      return {
        data: await response.json(),
        status: response.status,
        headers: response.headers
      };
    } catch (error) {
      if (error instanceof BondMCPError) {
        throw error;
      }
      
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new BondMCPError(408, 'timeout', 'Request timeout');
      }
      
      throw new BondMCPError(0, 'network_error', 'Network error');
    }
  }
}

/**
 * Custom error class for BondMCP API errors
 */
export class BondMCPError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'BondMCPError';
  }

  /**
   * Check if this is an authentication error
   */
  get isAuthError(): boolean {
    return this.status === 401 || this.code === 'authentication_error';
  }

  /**
   * Check if this is a rate limit error
   */
  get isRateLimitError(): boolean {
    return this.status === 429 || this.code === 'rate_limit_exceeded';
  }

  /**
   * Check if this is a validation error
   */
  get isValidationError(): boolean {
    return this.status === 400 || this.code === 'validation_error';
  }
}

// Default export for convenience
export default BondMCPClient;,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export everything
export default BondMCP;

