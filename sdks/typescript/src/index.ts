/**
 * BondMCP TypeScript SDK
 * Official TypeScript/JavaScript SDK for BondMCP - The #1 MCP in Health
 * 
 * @version 2.0.0
 * @author BondMCP Team
 * @license MIT
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { z } from 'zod';

// ============================================================================
// Type Definitions and Schemas
// ============================================================================

export enum ModelPreference {
  CONSENSUS = 'consensus',
  CLAUDE = 'claude',
  GPT4 = 'gpt4',
  MEDLM = 'medlm'
}

export enum UserTier {
  DEVELOPER = 'Developer+',
  PROFESSIONAL = 'Professional+',
  ENTERPRISE = 'Enterprise+',
  CLINICAL = 'Clinical+'
}

export interface BondMCPConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  enableLogging?: boolean;
  userTier?: UserTier;
}

export interface APIResponse<T = any> {
  data: T;
  statusCode: number;
  headers: Record<string, string>;
  responseTime: number;
  requestId?: string;
  success: boolean;
}

export interface UsageStats {
  requestCount: number;
  totalCost: number;
  userTier: UserTier;
  baseURL: string;
}

// Request/Response schemas using Zod for runtime validation
export const HealthCheckResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  version: z.string().optional(),
  uptime: z.number().optional()
});

export const AskRequestSchema = z.object({
  prompt: z.string().min(1),
  context: z.string().optional(),
  conversation_id: z.string().optional(),
  include_citations: z.boolean().default(true),
  model_preference: z.nativeEnum(ModelPreference).default(ModelPreference.CONSENSUS)
});

export const AskResponseSchema = z.object({
  answer: z.string(),
  citations: z.array(z.object({
    title: z.string(),
    url: z.string(),
    snippet: z.string()
  })).optional(),
  conversation_id: z.string(),
  model_used: z.string(),
  confidence: z.number().optional()
});

export const LabInterpretationRequestSchema = z.object({
  lab_results: z.record(z.any()),
  patient_context: z.string().optional(),
  include_recommendations: z.boolean().default(true)
});

export const SupplementRecommendationRequestSchema = z.object({
  health_goals: z.array(z.string()),
  current_supplements: z.array(z.string()).optional(),
  dietary_restrictions: z.array(z.string()).optional(),
  age: z.number().positive().optional(),
  gender: z.enum(['male', 'female', 'other']).optional()
});

// Type inference from schemas
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
export type AskRequest = z.infer<typeof AskRequestSchema>;
export type AskResponse = z.infer<typeof AskResponseSchema>;
export type LabInterpretationRequest = z.infer<typeof LabInterpretationRequestSchema>;
export type SupplementRecommendationRequest = z.infer<typeof SupplementRecommendationRequestSchema>;

// ============================================================================
// Custom Error Classes
// ============================================================================

export class BondMCPError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BondMCPError';
  }
}

export class AuthenticationError extends BondMCPError {
  constructor(message: string = 'Invalid API key') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends BondMCPError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends BondMCPError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class APIError extends BondMCPError {
  public statusCode?: number;
  public responseData?: any;

  constructor(message: string, statusCode?: number, responseData?: any) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.responseData = responseData;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(`Validation failed: ${error.message}`);
    }
    throw error;
  }
};

// ============================================================================
// Main Client Class
// ============================================================================

export class BondMCPClient {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly enableLogging: boolean;
  private readonly userTier: UserTier;
  private readonly httpClient: AxiosInstance;
  
  // Usage tracking
  private requestCount: number = 0;
  private totalCost: number = 0;

  // Resource instances
  public readonly health: HealthResource;
  public readonly ask: AskResource;
  public readonly labs: LabsResource;
  public readonly supplements: SupplementsResource;
  public readonly wearables: WearablesResource;
  public readonly medicalRecords: MedicalRecordsResource;
  public readonly insights: InsightsResource;
  public readonly apiKeys: APIKeysResource;
  public readonly payments: PaymentsResource;
  public readonly orchestrate: OrchestrateResource;
  public readonly tools: ToolsResource;
  public readonly imports: ImportResource;
  public readonly chat: ChatResource;

  constructor(config: BondMCPConfig) {
    if (!config.apiKey) {
      throw new AuthenticationError('API key is required');
    }

    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL?.replace(/\/$/, '') || 'https://api.bondmcp.com';
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.enableLogging = config.enableLogging || false;
    this.userTier = config.userTier || UserTier.DEVELOPER;

    // Create axios instance with default configuration
    this.httpClient = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'BondMCP-TypeScript-SDK/2.0.0'
      }
    });

    // Initialize resource instances
    this.health = new HealthResource(this);
    this.ask = new AskResource(this);
    this.labs = new LabsResource(this);
    this.supplements = new SupplementsResource(this);
    this.wearables = new WearablesResource(this);
    this.medicalRecords = new MedicalRecordsResource(this);
    this.insights = new InsightsResource(this);
    this.apiKeys = new APIKeysResource(this);
    this.payments = new PaymentsResource(this);
    this.orchestrate = new OrchestrateResource(this);
    this.tools = new ToolsResource(this);
    this.imports = new ImportResource(this);
    this.chat = new ChatResource(this);
  }

  /**
   * Make an HTTP request with retry logic and error handling
   */
  public async request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const startTime = Date.now();
    let lastError: Error;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        if (this.enableLogging) {
          console.log(`[BondMCP] Making ${method} request to ${path} (attempt ${attempt + 1})`);
        }

        const response: AxiosResponse<T> = await this.httpClient.request({
          method,
          url: path,
          data,
          ...config
        });

        const responseTime = Date.now() - startTime;
        const requestId = response.headers['x-request-id'];

        // Update usage tracking
        this.requestCount++;

        if (this.enableLogging) {
          console.log(`[BondMCP] Request completed in ${responseTime}ms`);
        }

        return {
          data: response.data,
          statusCode: response.status,
          headers: response.headers as Record<string, string>,
          responseTime,
          requestId,
          success: response.status >= 200 && response.status < 300
        };

      } catch (error) {
        lastError = this.handleError(error);

        if (attempt === this.maxRetries) {
          if (this.enableLogging) {
            console.error(`[BondMCP] Request failed after ${this.maxRetries + 1} attempts:`, lastError.message);
          }
          throw lastError;
        }

        const delay = this.retryDelay * Math.pow(2, attempt); // Exponential backoff
        if (this.enableLogging) {
          console.warn(`[BondMCP] Request attempt ${attempt + 1} failed: ${lastError.message}. Retrying in ${delay}ms...`);
        }
        await sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Handle and transform errors into appropriate error types
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      switch (status) {
        case 401:
          return new AuthenticationError('Invalid API key');
        case 429:
          return new RateLimitError('Rate limit exceeded');
        case 422:
          return new ValidationError(`Validation error: ${data?.message || error.message}`);
        default:
          return new APIError(
            data?.message || error.message || 'API request failed',
            status,
            data
          );
      }
    }

    return error instanceof Error ? error : new BondMCPError('Unknown error occurred');
  }

  /**
   * Get client usage statistics
   */
  public getUsageStats(): UsageStats {
    return {
      requestCount: this.requestCount,
      totalCost: this.totalCost,
      userTier: this.userTier,
      baseURL: this.baseURL
    };
  }

  /**
   * Validate request data against a schema
   */
  public validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return validateSchema(schema, data);
  }
}

// ============================================================================
// Resource Classes
// ============================================================================

abstract class BaseResource {
  constructor(protected client: BondMCPClient) {}
}

export class HealthResource extends BaseResource {
  /**
   * Check API health status
   */
  async check(): Promise<APIResponse<HealthCheckResponse>> {
    const response = await this.client.request<HealthCheckResponse>('GET', '/health');
    
    // Validate response data
    const validatedData = this.client.validateRequest(HealthCheckResponseSchema, response.data);
    
    return {
      ...response,
      data: validatedData
    };
  }
}

export class AskResource extends BaseResource {
  /**
   * Ask a health-related question to the AI
   */
  async query(request: AskRequest): Promise<APIResponse<AskResponse>> {
    // Validate request data
    const validatedRequest = this.client.validateRequest(AskRequestSchema, request);
    
    const response = await this.client.request<AskResponse>('POST', '/ask', validatedRequest);
    
    // Validate response data
    const validatedData = this.client.validateRequest(AskResponseSchema, response.data);
    
    return {
      ...response,
      data: validatedData
    };
  }
}

export class LabsResource extends BaseResource {
  /**
   * Interpret lab results with AI analysis
   */
  async interpret(request: LabInterpretationRequest): Promise<APIResponse<any>> {
    // Validate request data
    const validatedRequest = this.client.validateRequest(LabInterpretationRequestSchema, request);
    
    return this.client.request('POST', '/labs/interpret', validatedRequest);
  }
}

export class SupplementsResource extends BaseResource {
  /**
   * Get personalized supplement recommendations
   */
  async recommend(request: SupplementRecommendationRequest): Promise<APIResponse<any>> {
    // Validate request data
    const validatedRequest = this.client.validateRequest(SupplementRecommendationRequestSchema, request);
    
    return this.client.request('POST', '/supplement/recommend', validatedRequest);
  }

  /**
   * Check for supplement-drug interactions
   */
  async checkInteractions(data: {
    supplements: string[];
    medications?: string[];
    dosages?: Record<string, string>;
  }): Promise<APIResponse<any>> {
    return this.client.request('POST', '/supplement/interactions', data);
  }
}

export class WearablesResource extends BaseResource {
  /**
   * Analyze wearable device data for health insights
   */
  async analyzeData(data: {
    wearable_data: Record<string, any>;
    timeframe?: string;
    metrics?: string[];
  }): Promise<APIResponse<any>> {
    return this.client.request('POST', '/v1/wearable-data-insights', data);
  }
}

export class MedicalRecordsResource extends BaseResource {
  /**
   * Upload medical record data
   */
  async upload(data: {
    record_type: string;
    record_data: Record<string, any>;
    patient_id?: string;
  }): Promise<APIResponse<any>> {
    return this.client.request('POST', '/medical-records/upload', data);
  }
}

export class InsightsResource extends BaseResource {
  /**
   * Generate health insights from multiple data sources
   */
  async generate(data: {
    data_sources: string[];
    analysis_type?: string;
    timeframe?: string;
  }): Promise<APIResponse<any>> {
    return this.client.request('POST', '/insights/generate', data);
  }
}

export class APIKeysResource extends BaseResource {
  /**
   * List all API keys for the account
   */
  async list(): Promise<APIResponse<any>> {
    return this.client.request('GET', '/api-keys');
  }

  /**
   * Create a new API key
   */
  async create(data: {
    name: string;
    scopes?: string[];
    expires_at?: string;
  }): Promise<APIResponse<any>> {
    return this.client.request('POST', '/api-keys', data);
  }

  /**
   * Revoke an API key
   */
  async revoke(keyId: string): Promise<APIResponse<any>> {
    return this.client.request('DELETE', `/api-keys/${keyId}`);
  }
}

export class PaymentsResource extends BaseResource {
  /**
   * Get usage and billing information
   */
  async getUsage(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<APIResponse<any>> {
    return this.client.request('GET', '/payments/usage', undefined, { params });
  }
}

export class OrchestrateResource extends BaseResource {
  /**
   * Run a predefined workflow
   */
  async runWorkflow(data: {
    workflow_id: string;
    input_data: Record<string, any>;
    async_execution?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.request('POST', '/orchestrate/run', data);
  }
}

export class ToolsResource extends BaseResource {
  /**
   * List available AI tools
   */
  async listAvailable(): Promise<APIResponse<any>> {
    return this.client.request('GET', '/tools/available');
  }

  /**
   * Execute a specific AI tool
   */
  async executeTool(data: {
    tool_name: string;
    parameters: Record<string, any>;
  }): Promise<APIResponse<any>> {
    return this.client.request('POST', '/tools/execute', data);
  }
}

export class ImportResource extends BaseResource {
  /**
   * Import data from Oura ring
   */
  async oura(data: {
    oura_token: string;
    date_range?: Record<string, string>;
  }): Promise<APIResponse<any>> {
    return this.client.request('POST', '/import/oura', data);
  }

  /**
   * Import Apple Health data
   */
  async appleHealth(data: {
    health_data: Record<string, any>;
    data_types?: string[];
  }): Promise<APIResponse<any>> {
    return this.client.request('POST', '/import/apple-health', data);
  }
}

export class ChatResource extends BaseResource {
  /**
   * Create a new conversation
   */
  async createConversation(data: {
    initial_message: string;
    context?: Record<string, any>;
  }): Promise<APIResponse<any>> {
    return this.client.request('POST', '/chat/conversations', data);
  }

  /**
   * Send a message in an existing conversation
   */
  async sendMessage(conversationId: string, data: {
    message: string;
    message_type?: string;
  }): Promise<APIResponse<any>> {
    return this.client.request('POST', `/chat/conversations/${conversationId}/messages`, data);
  }

  /**
   * Get conversation history
   */
  async getConversation(conversationId: string): Promise<APIResponse<any>> {
    return this.client.request('GET', `/chat/conversations/${conversationId}`);
  }
}

// ============================================================================
// Exports
// ============================================================================

// Default export
export default BondMCPClient;

// Named exports for convenience
export { BondMCPClient as Client };

// Re-export all types and enums
export * from './types';

// Version information
export const VERSION = '2.0.0';

