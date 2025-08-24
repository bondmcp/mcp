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
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export everything
export default BondMCP;

