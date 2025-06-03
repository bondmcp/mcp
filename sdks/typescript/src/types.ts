/**
 * Type definitions for BondMCP TypeScript SDK
 */

// Re-export main types from index
export {
  ModelPreference,
  UserTier,
  BondMCPConfig,
  APIResponse,
  UsageStats,
  HealthCheckResponse,
  AskRequest,
  AskResponse,
  LabInterpretationRequest,
  SupplementRecommendationRequest,
  BondMCPError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  APIError
} from './index';

// Additional utility types
export interface RequestOptions {
  timeout?: number;
  retries?: number;
  validateResponse?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  request_id?: string;
}

// Health-specific types
export interface HealthMetrics {
  heart_rate?: number;
  blood_pressure?: {
    systolic: number;
    diastolic: number;
  };
  temperature?: number;
  weight?: number;
  height?: number;
  bmi?: number;
}

export interface LabResult {
  test_name: string;
  value: number | string;
  unit?: string;
  reference_range?: string;
  status?: 'normal' | 'high' | 'low' | 'critical';
  date?: string;
}

export interface Supplement {
  name: string;
  dosage?: string;
  frequency?: string;
  brand?: string;
  form?: 'tablet' | 'capsule' | 'liquid' | 'powder' | 'gummy';
}

export interface WearableData {
  device_type: string;
  data_type: string;
  timestamp: string;
  value: number | string;
  unit?: string;
  metadata?: Record<string, any>;
}

// Conversation types
export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// API Key types
export interface APIKey {
  id: string;
  name: string;
  key_preview: string;
  scopes: string[];
  created_at: string;
  expires_at?: string;
  last_used_at?: string;
  is_active: boolean;
}

// Usage and billing types
export interface UsageData {
  period: {
    start_date: string;
    end_date: string;
  };
  requests: {
    total: number;
    by_endpoint: Record<string, number>;
  };
  costs: {
    total: number;
    by_endpoint: Record<string, number>;
    currency: string;
  };
  tier: UserTier;
}

// Workflow types
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
  dependencies?: string[];
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  error?: string;
  started_at: string;
  completed_at?: string;
}

// Tool types
export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  category: string;
  tier_required: UserTier;
}

export interface ToolExecution {
  tool_name: string;
  parameters: Record<string, any>;
  result: any;
  execution_time: number;
  cost?: number;
}

