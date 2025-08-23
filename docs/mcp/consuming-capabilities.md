# Consuming MCP Capabilities: Language-Specific Examples

This guide provides practical examples for integrating MCP (Model Control Protocol) capabilities into your applications using Python and TypeScript/JavaScript.

## Python Examples

### Basic Setup with the BondMCP SDK

```python
import os
from bondmcp import BondMCPClient

# Initialize client with API key
client = BondMCPClient(
    api_key=os.getenv("BOND_API_KEY"),
    base_url="https://api.bondmcp.com"
)

# Discover MCP capabilities
config = client.get_mcp_configuration()
manifest = client.get_mcp_manifest()

print(f"Service: {config['service']['name']} v{config['service']['version']}")
print(f"Available capabilities: {len(config['capabilities'])}")
```

### Dynamic Endpoint Discovery

```python
def discover_health_capabilities(client):
    """Discover all health-related endpoints dynamically."""
    config = client.get_mcp_configuration()
    
    health_capabilities = [
        cap for cap in config["capabilities"] 
        if "health" in cap["path"] and not cap.get("deprecated", False)
    ]
    
    print("Available Health Endpoints:")
    for cap in health_capabilities:
        auth_req = "🔐" if cap["auth_required"] else "🌐"
        print(f"  {auth_req} {cap['method']} {cap['path']} - {cap['name']}")
        
    return health_capabilities

# Usage
health_endpoints = discover_health_capabilities(client)
```

### Health Analysis with MCP

```python
import requests
import json

class MCPHealthAnalyzer:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.bondmcp.com"
        self.session = requests.Session()
        self.session.headers.update({"X-API-Key": api_key})
        
        # Discover capabilities on initialization
        self.capabilities = self._discover_capabilities()
    
    def _discover_capabilities(self):
        """Fetch and cache MCP capabilities."""
        response = self.session.get(f"{self.base_url}/.well-known/mcp-configuration")
        response.raise_for_status()
        return {cap["id"]: cap for cap in response.json()["capabilities"]}
    
    def analyze_health_data(self, data_type, data_payload):
        """Analyze health data using appropriate endpoint."""
        # Find the right capability for health analysis
        analyze_cap = next(
            (cap for cap in self.capabilities.values() 
             if "analyze" in cap["path"] and cap["method"] == "POST"),
            None
        )
        
        if not analyze_cap:
            raise ValueError("Health analysis capability not available")
        
        if analyze_cap.get("deprecated"):
            print(f"Warning: {analyze_cap['name']} is deprecated")
        
        # Make the analysis request
        response = self.session.post(
            f"{self.base_url}{analyze_cap['path']}",
            json={
                "data_type": data_type,
                "data": data_payload,
                "options": {"detailed": True}
            }
        )
        
        # Handle rate limiting
        if response.status_code == 429:
            retry_after = int(response.headers.get('Retry-After', 60))
            print(f"Rate limited. Retry after {retry_after} seconds")
            return None
            
        response.raise_for_status()
        return response.json()

# Usage example
analyzer = MCPHealthAnalyzer(os.getenv("BOND_API_KEY"))

# Analyze lab results
lab_data = {
    "glucose": 95,
    "cholesterol": 180,
    "blood_pressure": {"systolic": 120, "diastolic": 80}
}

result = analyzer.analyze_health_data("lab_results", lab_data)
if result:
    print(f"Analysis: {result.get('summary', 'No summary available')}")
```

### Advanced Error Handling

```python
import time
from functools import wraps

def mcp_retry_with_backoff(max_retries=3, base_delay=1):
    """Decorator for handling MCP errors with exponential backoff."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    response = func(*args, **kwargs)
                    
                    if hasattr(response, 'status_code'):
                        if response.status_code == 429:
                            # Handle rate limiting
                            retry_after = int(response.headers.get('Retry-After', base_delay * (2 ** attempt)))
                            print(f"Rate limited on attempt {attempt + 1}. Waiting {retry_after}s...")
                            time.sleep(retry_after)
                            continue
                        elif response.status_code >= 500:
                            # Handle server errors
                            if attempt < max_retries - 1:
                                delay = base_delay * (2 ** attempt)
                                print(f"Server error on attempt {attempt + 1}. Retrying in {delay}s...")
                                time.sleep(delay)
                                continue
                    
                    return response
                    
                except requests.exceptions.RequestException as e:
                    if attempt < max_retries - 1:
                        delay = base_delay * (2 ** attempt)
                        print(f"Request failed on attempt {attempt + 1}: {e}. Retrying in {delay}s...")
                        time.sleep(delay)
                        continue
                    raise
                    
            return response
        return wrapper
    return decorator

# Usage
@mcp_retry_with_backoff(max_retries=3)
def get_health_insights():
    return requests.get(
        "https://api.bondmcp.com/api/v1/health/insights",
        headers={"X-API-Key": os.getenv("BOND_API_KEY")}
    )
```

## TypeScript/JavaScript Examples

### Setup with Fetch API

```typescript
interface MCPConfiguration {
    service: {
        name: string;
        version: string;
        description: string;
    };
    auth: {
        supported_methods: string[];
        required: boolean;
    };
    capabilities: MCPCapability[];
    rate_limits: {
        requests_per_minute: number;
        requests_per_hour: number;
        requests_per_day: number;
    };
    contact: {
        email: string;
        support_url: string;
    };
    updated_at: string;
}

interface MCPCapability {
    id: string;
    method: string;
    path: string;
    name: string;
    description: string;
    auth_required: boolean;
    tags: string[];
    rate_limit_tier: 'basic' | 'standard' | 'premium';
    deprecated?: boolean;
}

class BondMCPClient {
    private apiKey: string;
    private baseUrl: string;
    private capabilities: Map<string, MCPCapability> = new Map();

    constructor(apiKey: string, baseUrl = 'https://api.bondmcp.com') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async initialize(): Promise<void> {
        const config = await this.getMCPConfiguration();
        config.capabilities.forEach(cap => {
            this.capabilities.set(cap.id, cap);
        });
    }

    async getMCPConfiguration(): Promise<MCPConfiguration> {
        const response = await fetch(`${this.baseUrl}/.well-known/mcp-configuration`);
        if (!response.ok) {
            throw new Error(`Failed to fetch MCP configuration: ${response.statusText}`);
        }
        return response.json();
    }

    private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
        const headers = {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
            ...options.headers
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers
        });

        // Handle rate limiting
        if (response.status === 429) {
            const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
            console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
            throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
        }

        return response;
    }

    async analyzeHealthData(dataType: string, data: any): Promise<any> {
        // Find the analyze capability
        const analyzeCap = Array.from(this.capabilities.values()).find(
            cap => cap.path.includes('analyze') && cap.method === 'POST'
        );

        if (!analyzeCap) {
            throw new Error('Health analysis capability not available');
        }

        if (analyzeCap.deprecated) {
            console.warn(`Warning: ${analyzeCap.name} is deprecated`);
        }

        const response = await this.makeRequest(analyzeCap.path, {
            method: 'POST',
            body: JSON.stringify({
                data_type: dataType,
                data: data
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Analysis failed');
        }

        return response.json();
    }
}
```

### React Hook for MCP Integration

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseMCPResult {
    client: BondMCPClient | null;
    capabilities: MCPCapability[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useMCP(apiKey: string): UseMCPResult {
    const [client, setClient] = useState<BondMCPClient | null>(null);
    const [capabilities, setCapabilities] = useState<MCPCapability[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const initializeMCP = useCallback(async () => {
        if (!apiKey) {
            setError('API key is required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const mcpClient = new BondMCPClient(apiKey);
            await mcpClient.initialize();
            
            const config = await mcpClient.getMCPConfiguration();
            
            setClient(mcpClient);
            setCapabilities(config.capabilities);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to initialize MCP');
        } finally {
            setLoading(false);
        }
    }, [apiKey]);

    useEffect(() => {
        initializeMCP();
    }, [initializeMCP]);

    return {
        client,
        capabilities,
        loading,
        error,
        refetch: initializeMCP
    };
}

// Usage in a React component
function HealthAnalysisComponent() {
    const { client, capabilities, loading, error } = useMCP(process.env.REACT_APP_BOND_API_KEY!);
    const [analysisResult, setAnalysisResult] = useState(null);

    const analyzeData = async () => {
        if (!client) return;

        try {
            const result = await client.analyzeHealthData('vitals', {
                heart_rate: 72,
                blood_pressure: { systolic: 120, diastolic: 80 },
                temperature: 98.6
            });
            setAnalysisResult(result);
        } catch (err) {
            console.error('Analysis failed:', err);
        }
    };

    if (loading) return <div>Loading MCP capabilities...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h3>Available Capabilities: {capabilities.length}</h3>
            <button onClick={analyzeData}>Analyze Health Data</button>
            {analysisResult && (
                <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
            )}
        </div>
    );
}
```

### Node.js Server Integration

```javascript
const express = require('express');
const { BondMCPClient } = require('@bondmcp/sdk');

const app = express();
app.use(express.json());

// Initialize MCP client
const mcpClient = new BondMCPClient({
    apiKey: process.env.BOND_API_KEY,
    baseUrl: 'https://api.bondmcp.com'
});

// Middleware to ensure MCP is initialized
let mcpInitialized = false;
const initializeMCP = async () => {
    if (!mcpInitialized) {
        await mcpClient.initialize();
        mcpInitialized = true;
        console.log('MCP client initialized');
    }
};

// Health analysis endpoint
app.post('/analyze-health', async (req, res) => {
    try {
        await initializeMCP();
        
        const { dataType, data } = req.body;
        const result = await mcpClient.analyzeHealthData(dataType, data);
        
        res.json({
            success: true,
            analysis: result
        });
    } catch (error) {
        console.error('Health analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get available capabilities
app.get('/capabilities', async (req, res) => {
    try {
        await initializeMCP();
        const config = await mcpClient.getMCPConfiguration();
        
        res.json({
            capabilities: config.capabilities.map(cap => ({
                id: cap.id,
                name: cap.name,
                method: cap.method,
                path: cap.path,
                authRequired: cap.auth_required,
                deprecated: cap.deprecated || false
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

## Best Practices

### 1. Capability Caching

Cache MCP configuration to reduce API calls:

```python
import time
from typing import Optional

class MCPCache:
    def __init__(self, ttl_seconds=300):  # 5 minute TTL
        self.ttl_seconds = ttl_seconds
        self.config = None
        self.last_fetch = 0
    
    def get_config(self, client) -> dict:
        now = time.time()
        if not self.config or (now - self.last_fetch) > self.ttl_seconds:
            self.config = client.get_mcp_configuration()
            self.last_fetch = now
        return self.config
```

### 2. Graceful Degradation

Handle missing capabilities gracefully:

```typescript
function findCapability(capabilities: MCPCapability[], pattern: string): MCPCapability | null {
    return capabilities.find(cap => 
        cap.path.includes(pattern) && !cap.deprecated
    ) || null;
}

async function analyzeWithFallback(client: BondMCPClient, data: any) {
    const capabilities = await client.getCapabilities();
    
    // Try advanced analysis first
    const advancedCap = findCapability(capabilities, 'advanced-analyze');
    if (advancedCap) {
        return client.makeRequest(advancedCap.path, { method: 'POST', body: data });
    }
    
    // Fallback to basic analysis
    const basicCap = findCapability(capabilities, 'analyze');
    if (basicCap) {
        return client.makeRequest(basicCap.path, { method: 'POST', body: data });
    }
    
    throw new Error('No analysis capabilities available');
}
```

### 3. Rate Limit Awareness

Use capability metadata to optimize request patterns:

```python
def optimize_request_pattern(capabilities):
    """Group capabilities by rate limit tier for optimal usage."""
    tiers = {'basic': [], 'standard': [], 'premium': []}
    
    for cap in capabilities:
        tier = cap.get('rate_limit_tier', 'basic')
        tiers[tier].append(cap)
    
    # Use premium endpoints for critical operations
    # Use basic endpoints for background tasks
    return tiers
```

This comprehensive guide should help developers integrate MCP capabilities effectively into their applications while following best practices for error handling, caching, and rate limiting.