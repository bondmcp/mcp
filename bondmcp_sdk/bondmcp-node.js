// Node.js SDK for BondMCP API
// Disclaimer: This SDK is provided for informational purposes only and does not
// constitute medical advice.
const axios = require('axios');

class BondMCPClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseURL = options.baseURL || 'https://api.bondmcp.com/api';
    this.timeout = options.timeout || 30000;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'bondmcp-node/1.0.0'
      }
    });
    
    // Initialize API resources
    this.health = new HealthResource(this);
    this.labs = new LabsResource(this);
    this.supplements = new SupplementsResource(this);
    this.wearables = new WearablesResource(this);
    this.medicalRecords = new MedicalRecordsResource(this);
    this.ask = new AskResource(this);
    this.insights = new InsightsResource(this);
    this.apiKeys = new APIKeysResource(this);
    this.payments = new PaymentsResource(this);
    this.orchestrate = new OrchestrateResource(this);
    this.tools = new ToolsResource(this);
    this.imports = new ImportResource(this);
    this.chat = new ChatResource(this);
  }
  
  async request(method, path, data = null, options = {}) {
    try {
      const response = await this.client.request({
        method,
        url: path,
        data: method !== 'get' ? data : undefined,
        params: method === 'get' ? data : undefined,
        ...options
      });
      
      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        throw new BondMCPAPIError(
          data.error?.message || 'API request failed',
          status,
          data.error?.code || 'api_error',
          data.error?.details || {}
        );
      } else if (error.request) {
        throw new BondMCPNetworkError('Network error: No response received from API');
      } else {
        throw new BondMCPError(`Request error: ${error.message}`);
      }
    }
  }
}

class HealthResource {
  constructor(client) {
    this.client = client;
  }
  
  async check() {
    return this.client.request('get', '/health');
  }
}

class LabsResource {
  constructor(client) {
    this.client = client;
  }
  
  async interpret(labResults, patientContext = null) {
    const data = {
      lab_results: labResults
    };
    
    if (patientContext) {
      data.patient_context = patientContext;
    }
    
    return this.client.request('post', '/labs/interpret', data);
  }
}

class SupplementsResource {
  constructor(client) {
    this.client = client;
  }
  
  async recommend(options = {}) {
    const data = {
      health_goals: options.healthGoals || []
    };
    
    if (options.currentLabs) {
      data.current_labs = options.currentLabs;
    }
    
    if (options.currentSupplements) {
      data.current_supplements = options.currentSupplements;
    }
    
    if (options.dietaryRestrictions) {
      data.dietary_restrictions = options.dietaryRestrictions;
    }
    
    if (options.patientContext) {
      data.patient_context = options.patientContext;
    }
    
    return this.client.request('post', '/supplement/recommend', data);
  }
  
  async checkInteractions(supplements, medications = null) {
    const data = {
      supplements: supplements
    };
    
    if (medications) {
      data.medications = medications;
    }
    
    return this.client.request('post', '/supplement/interactions', data);
  }
}

class WearablesResource {
  constructor(client) {
    this.client = client;
  }
  
  async analyze(wearableData, wearableType, options = {}) {
    const data = {
      wearable_data: wearableData,
      wearable_type: wearableType
    };
    
    if (options.timeframe) {
      data.timeframe = options.timeframe;
    }
    
    if (options.metrics) {
      data.metrics = options.metrics;
    }
    
    return this.client.request('post', '/v1/wearable-data-insights', data);
  }
}

class MedicalRecordsResource {
  constructor(client) {
    this.client = client;
  }
  
  async analyze(medicalRecordText, options = {}) {
    const data = {
      medical_record_text: medicalRecordText
    };
    
    if (options.extractEntities !== undefined) {
      data.extract_entities = options.extractEntities;
    }
    
    if (options.confidenceThreshold) {
      data.confidence_threshold = options.confidenceThreshold;
    }
    
    return this.client.request('post', '/v1/analyze-medical-record', data);
  }
}

class AskResource {
  constructor(client) {
    this.client = client;
  }

  /** Query the LLM using the /ask endpoint. */
  async query(query, conversationId = null) {
    const data = { query };
    if (conversationId) {
      data.conversation_id = conversationId;
    }

    return this.client.request('post', '/ask', data);
  }
}

class InsightsResource {
  constructor(client) {
    this.client = client;
  }

  /** Generate health insights. */
  async generate(payload, insightType = null) {
    const path = insightType ? `/insights/${insightType}` : '/insights';
    return this.client.request('post', path, payload);
  }
}

class APIKeysResource {
  constructor(client) {
    this.client = client;
  }

  /** List API keys for the authenticated user. */
  async list() {
    return this.client.request('get', '/api-keys');
  }

  /** Create a new API key. */
  async create(name, scopes = null) {
    const data = { name };
    if (scopes) {
      data.scopes = scopes;
    }
    return this.client.request('post', '/api-keys', data);
  }

  /** Update an existing API key. */
  async update(keyId, opts = {}) {
    const data = {};
    if (opts.name) data.name = opts.name;
    if (opts.scopes !== undefined) data.scopes = opts.scopes;
    return this.client.request('put', `/api-keys/${keyId}`, data);
  }

  /** Revoke (delete) an API key. */
  async revoke(keyId) {
    return this.client.request('delete', `/api-keys/${keyId}`);
  }
}

class PaymentsResource {
  constructor(client) {
    this.client = client;
  }

  /** Create a payment intent. */
  async createIntent(amount, currency, metadata = null) {
    const data = { amount, currency };
    if (metadata) {
      data.metadata = metadata;
    }
    return this.client.request('post', '/payments/create-intent', data);
  }
}

class OrchestrateResource {
  constructor(client) {
    this.client = client;
  }

  /** Orchestrate multiple tool invocations. */
  async run(steps, conversationId = null) {
    const data = { steps };
    if (conversationId) {
      data.conversation_id = conversationId;
    }
    return this.client.request('post', '/orchestrate', data);
  }
}

class ToolsResource {
  constructor(client) {
    this.client = client;
  }

  /** Call a specific tool by name. */
  async call(tool, payload) {
    const data = { tool, payload };
    return this.client.request('post', '/tools/call', data);
  }
}

class ImportResource {
  constructor(client) {
    this.client = client;
  }

  /** Import Oura data. */
  async oura(data) {
    return this.client.request('post', '/import/oura', data);
  }
}

class ChatResource {
  constructor(client) {
    this.client = client;
  }

  /** Upload health data to a conversation. */
  async uploadHealthData(conversationId, data) {
    const path = `/v1/chat/conversation/${conversationId}/health-data`;
    return this.client.request('post', path, data);
  }
}

class BondMCPError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BondMCPError';
  }
}

class BondMCPAPIError extends BondMCPError {
  constructor(message, statusCode, code, details = {}) {
    super(message);
    this.name = 'BondMCPAPIError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class BondMCPNetworkError extends BondMCPError {
  constructor(message) {
    super(message);
    this.name = 'BondMCPNetworkError';
  }
}

module.exports = {
  Client: BondMCPClient,
  APIError: BondMCPAPIError,
  NetworkError: BondMCPNetworkError,
  Error: BondMCPError,
  AskResource,
  InsightsResource,
  APIKeysResource,
  PaymentsResource,
  OrchestrateResource,
  ToolsResource,
  ImportResource,
  ChatResource,
  LabsResource,
  SupplementsResource,
  WearablesResource,
  MedicalRecordsResource,
  HealthResource
};
// Preserve class-style default export while also exposing named exports
module.exports.Client = BondMCPClient;
module.exports.APIError = BondMCPAPIError;
module.exports.NetworkError = BondMCPNetworkError;
module.exports.Error = BondMCPError;
module.exports.default = BondMCPClient;

