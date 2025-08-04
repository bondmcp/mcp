# Comprehensive SDK Examples

## 🚀 Quick Start with SDKs

Choose your preferred programming language and start building with BondMCP's health AI capabilities.

---

## 🐍 Python SDK

### Installation
```bash
pip install bondmcp
```

### Basic Health Query
```python
from bondmcp import BondMCPClient

# Initialize client
client = BondMCPClient(api_key="your-api-key-here")

# Ask a health question
response = client.health.ask(
    question="What are the symptoms of diabetes?",
    context="For a 45-year-old patient",
    detailed=True,
    max_sources=5
)

print(f"Answer: {response.answer}")
print(f"Trust Score: {response.trust_score}")
print(f"Sources: {len(response.sources)}")
```

### Health Data Analysis
```python
from bondmcp import BondMCPClient
from datetime import datetime

client = BondMCPClient(api_key="your-api-key-here")

# Prepare health data
health_data = {
    "bloodGlucose": [
        {"value": 120, "unit": "mg/dL", "timestamp": "2025-08-04T08:00:00Z"},
        {"value": 145, "unit": "mg/dL", "timestamp": "2025-08-04T12:00:00Z"}
    ],
    "bloodPressure": [
        {"systolic": 130, "diastolic": 85, "timestamp": "2025-08-04T08:00:00Z"}
    ],
    "medications": [
        {"name": "Metformin", "dosage": "500mg", "frequency": "twice daily"}
    ]
}

# Analyze the data
analysis = client.health.analyze(
    data=health_data,
    include_recommendations=True
)

print(f"Blood Glucose Status: {analysis.blood_glucose.status}")
print(f"Recommendations: {len(analysis.recommendations)}")
```

### Symptom Checker
```python
from bondmcp import BondMCPClient

client = BondMCPClient(api_key="your-api-key-here")

# Check symptoms
symptoms_result = client.health.symptoms(
    symptoms=["headache", "fever", "fatigue"],
    duration="3 days",
    severity="moderate"
)

print(f"Possible Conditions: {symptoms_result.possible_conditions}")
print(f"Urgency Level: {symptoms_result.urgency}")
print(f"Recommendations: {symptoms_result.recommendations}")
```

### Drug Interaction Checker
```python
from bondmcp import BondMCPClient

client = BondMCPClient(api_key="your-api-key-here")

# Check drug interactions
medications = [
    {"name": "Metformin", "dosage": "500mg"},
    {"name": "Lisinopril", "dosage": "10mg"},
    {"name": "Atorvastatin", "dosage": "20mg"}
]

interactions = client.health.medications(medications=medications)

print(f"Interactions Found: {len(interactions.interactions)}")
for interaction in interactions.interactions:
    print(f"- {interaction.drug1} + {interaction.drug2}: {interaction.severity}")
```

### Research Integration
```python
from bondmcp import BondMCPClient

client = BondMCPClient(api_key="your-api-key-here")

# Search PubMed
pubmed_results = client.research.pubmed(
    query="diabetes treatment 2024",
    max_results=10,
    include_abstracts=True
)

print(f"Found {len(pubmed_results.articles)} articles")
for article in pubmed_results.articles[:3]:
    print(f"- {article.title}")
    print(f"  Authors: {', '.join(article.authors)}")
    print(f"  Journal: {article.journal}")

# Search clinical trials
trials = client.research.clinical_trials(
    condition="diabetes",
    status="recruiting",
    location="United States"
)

print(f"\\nFound {len(trials.trials)} active trials")
```

### Error Handling
```python
from bondmcp import BondMCPClient, BondMCPError, RateLimitError, AuthenticationError

client = BondMCPClient(api_key="your-api-key-here")

try:
    response = client.health.ask("What causes diabetes?")
    print(response.answer)
    
except AuthenticationError:
    print("Invalid API key. Please check your credentials.")
    
except RateLimitError as e:
    print(f"Rate limit exceeded. Retry after {e.retry_after} seconds.")
    
except BondMCPError as e:
    print(f"API error: {e.message}")
    
except Exception as e:
    print(f"Unexpected error: {str(e)}")
```

### Async Support
```python
import asyncio
from bondmcp import AsyncBondMCPClient

async def main():
    client = AsyncBondMCPClient(api_key="your-api-key-here")
    
    # Concurrent requests
    tasks = [
        client.health.ask("What is diabetes?"),
        client.health.ask("What is hypertension?"),
        client.health.ask("What is cholesterol?")
    ]
    
    responses = await asyncio.gather(*tasks)
    
    for i, response in enumerate(responses, 1):
        print(f"Response {i}: {response.answer[:100]}...")
    
    await client.close()

# Run async example
asyncio.run(main())
```

---

## 🟨 JavaScript SDK

### Installation
```bash
npm install @bondmcp/sdk
```

### Basic Health Query
```javascript
import { BondMCPClient } from '@bondmcp/sdk';

// Initialize client
const client = new BondMCPClient({
  apiKey: 'your-api-key-here'
});

// Ask a health question
async function askHealthQuestion() {
  try {
    const response = await client.health.ask({
      question: "What are the symptoms of diabetes?",
      context: "For a 45-year-old patient",
      detailed: true,
      maxSources: 5
    });
    
    console.log(`Answer: ${response.answer}`);
    console.log(`Trust Score: ${response.trustScore}`);
    console.log(`Sources: ${response.sources.length}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

askHealthQuestion();
```

### Health Data Analysis
```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'your-api-key-here'
});

async function analyzeHealthData() {
  const healthData = {
    bloodGlucose: [
      { value: 120, unit: "mg/dL", timestamp: "2025-08-04T08:00:00Z" },
      { value: 145, unit: "mg/dL", timestamp: "2025-08-04T12:00:00Z" }
    ],
    bloodPressure: [
      { systolic: 130, diastolic: 85, timestamp: "2025-08-04T08:00:00Z" }
    ]
  };
  
  try {
    const analysis = await client.health.analyze({
      data: healthData,
      includeRecommendations: true
    });
    
    console.log(`Blood Glucose Status: ${analysis.bloodGlucose.status}`);
    console.log(`Recommendations: ${analysis.recommendations.length}`);
    
    analysis.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.text} (Priority: ${rec.priority})`);
    });
  } catch (error) {
    console.error('Analysis error:', error);
  }
}

analyzeHealthData();
```

### React Integration
```jsx
import React, { useState, useEffect } from 'react';
import { BondMCPClient } from '@bondmcp/sdk';

const HealthQueryComponent = () => {
  const [client] = useState(() => new BondMCPClient({
    apiKey: process.env.REACT_APP_BONDMCP_API_KEY
  }));
  
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.health.ask({
        question,
        detailed: true
      });
      setResponse(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="health-query">
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a health question..."
          rows={4}
          cols={50}
        />
        <br />
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? 'Asking...' : 'Ask Health AI'}
        </button>
      </form>
      
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {response && (
        <div className="response">
          <h3>Answer (Trust Score: {response.trustScore}%)</h3>
          <p>{response.answer}</p>
          
          {response.sources && response.sources.length > 0 && (
            <div className="sources">
              <h4>Sources:</h4>
              <ul>
                {response.sources.map((source, index) => (
                  <li key={index}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthQueryComponent;
```

### Node.js Express Integration
```javascript
import express from 'express';
import { BondMCPClient } from '@bondmcp/sdk';

const app = express();
const client = new BondMCPClient({
  apiKey: process.env.BONDMCP_API_KEY
});

app.use(express.json());

// Health query endpoint
app.post('/api/health/ask', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    const response = await client.health.ask({
      question,
      context,
      detailed: true
    });
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Health query error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Symptom checker endpoint
app.post('/api/health/symptoms', async (req, res) => {
  try {
    const { symptoms, duration, severity } = req.body;
    
    const result = await client.health.symptoms({
      symptoms,
      duration,
      severity
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## 🔷 Go SDK

### Installation
```bash
go get github.com/bondmcp/mcp/go
```

### Basic Health Query
```go
package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/bondmcp/mcp/go"
)

func main() {
    // Initialize client
    client := bondmcp.NewClient("your-api-key-here")
    
    // Ask a health question
    ctx := context.Background()
    response, err := client.Health.Ask(ctx, &bondmcp.HealthQueryRequest{
        Question:   "What are the symptoms of diabetes?",
        Context:    "For a 45-year-old patient",
        Detailed:   true,
        MaxSources: 5,
    })
    
    if err != nil {
        log.Fatalf("Error asking health question: %v", err)
    }
    
    fmt.Printf("Answer: %s\\n", response.Answer)
    fmt.Printf("Trust Score: %d\\n", response.TrustScore)
    fmt.Printf("Sources: %d\\n", len(response.Sources))
}
```

### Health Data Analysis
```go
package main

import (
    "context"
    "fmt"
    "log"
    "time"
    
    "github.com/bondmcp/mcp/go"
)

func main() {
    client := bondmcp.NewClient("your-api-key-here")
    
    // Prepare health data
    healthData := &bondmcp.HealthData{
        BloodGlucose: []bondmcp.BloodGlucoseReading{
            {
                Value:     120,
                Unit:      "mg/dL",
                Timestamp: time.Now().Add(-4 * time.Hour),
            },
            {
                Value:     145,
                Unit:      "mg/dL",
                Timestamp: time.Now(),
            },
        },
        BloodPressure: []bondmcp.BloodPressureReading{
            {
                Systolic:  130,
                Diastolic: 85,
                Timestamp: time.Now().Add(-4 * time.Hour),
            },
        },
    }
    
    // Analyze the data
    ctx := context.Background()
    analysis, err := client.Health.Analyze(ctx, &bondmcp.HealthAnalysisRequest{
        Data:                   healthData,
        IncludeRecommendations: true,
    })
    
    if err != nil {
        log.Fatalf("Error analyzing health data: %v", err)
    }
    
    fmt.Printf("Blood Glucose Status: %s\\n", analysis.BloodGlucose.Status)
    fmt.Printf("Recommendations: %d\\n", len(analysis.Recommendations))
    
    for i, rec := range analysis.Recommendations {
        fmt.Printf("%d. %s (Priority: %s)\\n", i+1, rec.Text, rec.Priority)
    }
}
```

### HTTP Client Integration
```go
package main

import (
    "context"
    "fmt"
    "net/http"
    "encoding/json"
    
    "github.com/bondmcp/mcp/go"
)

type HealthHandler struct {
    client *bondmcp.Client
}

func NewHealthHandler(apiKey string) *HealthHandler {
    return &HealthHandler{
        client: bondmcp.NewClient(apiKey),
    }
}

func (h *HealthHandler) HandleHealthQuery(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }
    
    var req struct {
        Question string `json:"question"`
        Context  string `json:"context"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }
    
    if req.Question == "" {
        http.Error(w, "Question is required", http.StatusBadRequest)
        return
    }
    
    ctx := context.Background()
    response, err := h.client.Health.Ask(ctx, &bondmcp.HealthQueryRequest{
        Question: req.Question,
        Context:  req.Context,
        Detailed: true,
    })
    
    if err != nil {
        http.Error(w, fmt.Sprintf("Health query error: %v", err), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "success": true,
        "data":    response,
    })
}

func main() {
    handler := NewHealthHandler("your-api-key-here")
    
    http.HandleFunc("/api/health/ask", handler.HandleHealthQuery)
    
    fmt.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### Concurrent Processing
```go
package main

import (
    "context"
    "fmt"
    "sync"
    
    "github.com/bondmcp/mcp/go"
)

func main() {
    client := bondmcp.NewClient("your-api-key-here")
    
    questions := []string{
        "What is diabetes?",
        "What is hypertension?",
        "What is cholesterol?",
        "What causes heart disease?",
        "How to prevent stroke?",
    }
    
    var wg sync.WaitGroup
    results := make(chan *bondmcp.HealthQueryResponse, len(questions))
    
    // Process questions concurrently
    for _, question := range questions {
        wg.Add(1)
        go func(q string) {
            defer wg.Done()
            
            ctx := context.Background()
            response, err := client.Health.Ask(ctx, &bondmcp.HealthQueryRequest{
                Question: q,
                Detailed: false,
            })
            
            if err != nil {
                fmt.Printf("Error with question '%s': %v\\n", q, err)
                return
            }
            
            results <- response
        }(question)
    }
    
    // Close results channel when all goroutines complete
    go func() {
        wg.Wait()
        close(results)
    }()
    
    // Collect results
    fmt.Println("Health AI Responses:")
    for response := range results {
        fmt.Printf("- %s (Trust: %d%%)\\n", 
            response.Answer[:100]+"...", 
            response.TrustScore)
    }
}
```

---

## 🔧 Advanced Examples

### Rate Limiting and Retry Logic
```python
import time
import random
from bondmcp import BondMCPClient, RateLimitError

class ResilientBondMCPClient:
    def __init__(self, api_key, max_retries=3):
        self.client = BondMCPClient(api_key=api_key)
        self.max_retries = max_retries
    
    def ask_with_retry(self, question, **kwargs):
        for attempt in range(self.max_retries):
            try:
                return self.client.health.ask(question=question, **kwargs)
            except RateLimitError as e:
                if attempt == self.max_retries - 1:
                    raise
                
                # Exponential backoff with jitter
                delay = (2 ** attempt) + random.uniform(0, 1)
                print(f"Rate limited. Retrying in {delay:.2f} seconds...")
                time.sleep(delay)
            except Exception as e:
                if attempt == self.max_retries - 1:
                    raise
                print(f"Attempt {attempt + 1} failed: {e}")
                time.sleep(1)

# Usage
resilient_client = ResilientBondMCPClient("your-api-key-here")
response = resilient_client.ask_with_retry("What causes diabetes?")
```

### Batch Processing
```javascript
import { BondMCPClient } from '@bondmcp/sdk';

class BatchProcessor {
  constructor(apiKey, batchSize = 5) {
    this.client = new BondMCPClient({ apiKey });
    this.batchSize = batchSize;
  }
  
  async processBatch(questions) {
    const results = [];
    
    for (let i = 0; i < questions.length; i += this.batchSize) {
      const batch = questions.slice(i, i + this.batchSize);
      
      const batchPromises = batch.map(async (question, index) => {
        try {
          const response = await this.client.health.ask({
            question: question.text,
            context: question.context
          });
          return { index: i + index, success: true, data: response };
        } catch (error) {
          return { index: i + index, success: false, error: error.message };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Rate limiting: wait between batches
      if (i + this.batchSize < questions.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

// Usage
const processor = new BatchProcessor('your-api-key-here');
const questions = [
  { text: "What is diabetes?", context: "Basic information" },
  { text: "What is hypertension?", context: "Basic information" },
  // ... more questions
];

processor.processBatch(questions).then(results => {
  console.log(`Processed ${results.length} questions`);
  const successful = results.filter(r => r.success).length;
  console.log(`Success rate: ${(successful / results.length * 100).toFixed(1)}%`);
});
```

### Caching Layer
```go
package main

import (
    "context"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "sync"
    "time"
    
    "github.com/bondmcp/mcp/go"
)

type CachedResponse struct {
    Response  *bondmcp.HealthQueryResponse
    Timestamp time.Time
}

type CachingClient struct {
    client    *bondmcp.Client
    cache     map[string]*CachedResponse
    cacheTTL  time.Duration
    mutex     sync.RWMutex
}

func NewCachingClient(apiKey string, cacheTTL time.Duration) *CachingClient {
    return &CachingClient{
        client:   bondmcp.NewClient(apiKey),
        cache:    make(map[string]*CachedResponse),
        cacheTTL: cacheTTL,
    }
}

func (c *CachingClient) generateCacheKey(req *bondmcp.HealthQueryRequest) string {
    data, _ := json.Marshal(req)
    hash := sha256.Sum256(data)
    return hex.EncodeToString(hash[:])
}

func (c *CachingClient) Ask(ctx context.Context, req *bondmcp.HealthQueryRequest) (*bondmcp.HealthQueryResponse, error) {
    cacheKey := c.generateCacheKey(req)
    
    // Check cache first
    c.mutex.RLock()
    if cached, exists := c.cache[cacheKey]; exists {
        if time.Since(cached.Timestamp) < c.cacheTTL {
            c.mutex.RUnlock()
            fmt.Println("Cache hit!")
            return cached.Response, nil
        }
    }
    c.mutex.RUnlock()
    
    // Cache miss or expired, make API call
    fmt.Println("Cache miss, calling API...")
    response, err := c.client.Health.Ask(ctx, req)
    if err != nil {
        return nil, err
    }
    
    // Store in cache
    c.mutex.Lock()
    c.cache[cacheKey] = &CachedResponse{
        Response:  response,
        Timestamp: time.Now(),
    }
    c.mutex.Unlock()
    
    return response, nil
}

func main() {
    // Create caching client with 5-minute TTL
    client := NewCachingClient("your-api-key-here", 5*time.Minute)
    
    ctx := context.Background()
    req := &bondmcp.HealthQueryRequest{
        Question: "What are the symptoms of diabetes?",
        Detailed: true,
    }
    
    // First call - cache miss
    response1, err := client.Ask(ctx, req)
    if err != nil {
        log.Fatal(err)
    }
    
    // Second call - cache hit
    response2, err := client.Ask(ctx, req)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Responses identical: %v\\n", response1.ID == response2.ID)
}
```

---

## 🔍 Testing Examples

### Unit Testing (Python)
```python
import pytest
from unittest.mock import Mock, patch
from bondmcp import BondMCPClient, BondMCPError

class TestBondMCPClient:
    def setup_method(self):
        self.client = BondMCPClient(api_key="test-api-key")
    
    @patch('bondmcp.client.requests.post')
    def test_health_ask_success(self, mock_post):
        # Mock successful response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "resp_123",
            "answer": "Test answer",
            "trustScore": 95,
            "sources": []
        }
        mock_post.return_value = mock_response
        
        # Test the method
        response = self.client.health.ask("Test question")
        
        assert response.answer == "Test answer"
        assert response.trust_score == 95
        mock_post.assert_called_once()
    
    @patch('bondmcp.client.requests.post')
    def test_health_ask_error(self, mock_post):
        # Mock error response
        mock_response = Mock()
        mock_response.status_code = 500
        mock_response.json.return_value = {"error": "Internal server error"}
        mock_post.return_value = mock_response
        
        # Test error handling
        with pytest.raises(BondMCPError):
            self.client.health.ask("Test question")
    
    def test_api_key_required(self):
        with pytest.raises(ValueError):
            BondMCPClient(api_key="")

# Run tests
# pytest test_bondmcp.py -v
```

### Integration Testing (JavaScript)
```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { BondMCPClient } from '@bondmcp/sdk';

describe('BondMCP Integration Tests', () => {
  let client;
  
  beforeEach(() => {
    client = new BondMCPClient({
      apiKey: process.env.BONDMCP_TEST_API_KEY || 'test-key'
    });
  });
  
  it('should ask health questions successfully', async () => {
    const response = await client.health.ask({
      question: "What is diabetes?",
      detailed: false
    });
    
    expect(response).toBeDefined();
    expect(response.answer).toBeTypeOf('string');
    expect(response.trustScore).toBeGreaterThan(0);
    expect(response.trustScore).toBeLessThanOrEqual(100);
  });
  
  it('should handle rate limiting gracefully', async () => {
    const promises = Array(10).fill().map(() => 
      client.health.ask({ question: "Test question" })
    );
    
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled');
    
    expect(successful.length).toBeGreaterThan(0);
  });
  
  it('should validate required parameters', async () => {
    await expect(
      client.health.ask({ question: "" })
    ).rejects.toThrow();
  });
});
```

---

## 📊 Performance Monitoring

### Response Time Tracking
```python
import time
from bondmcp import BondMCPClient

class PerformanceTracker:
    def __init__(self, api_key):
        self.client = BondMCPClient(api_key=api_key)
        self.metrics = []
    
    def timed_request(self, question):
        start_time = time.time()
        try:
            response = self.client.health.ask(question=question)
            end_time = time.time()
            
            self.metrics.append({
                'question': question,
                'response_time': end_time - start_time,
                'success': True,
                'trust_score': response.trust_score
            })
            return response
        except Exception as e:
            end_time = time.time()
            self.metrics.append({
                'question': question,
                'response_time': end_time - start_time,
                'success': False,
                'error': str(e)
            })
            raise
    
    def get_stats(self):
        if not self.metrics:
            return {}
        
        response_times = [m['response_time'] for m in self.metrics]
        successful = [m for m in self.metrics if m['success']]
        
        return {
            'total_requests': len(self.metrics),
            'successful_requests': len(successful),
            'success_rate': len(successful) / len(self.metrics) * 100,
            'avg_response_time': sum(response_times) / len(response_times),
            'min_response_time': min(response_times),
            'max_response_time': max(response_times),
            'avg_trust_score': sum(m['trust_score'] for m in successful) / len(successful) if successful else 0
        }

# Usage
tracker = PerformanceTracker("your-api-key-here")

questions = [
    "What is diabetes?",
    "What causes hypertension?",
    "How to prevent heart disease?"
]

for question in questions:
    try:
        response = tracker.timed_request(question)
        print(f"✓ {question[:50]}...")
    except Exception as e:
        print(f"✗ {question[:50]}... Error: {e}")

print("\\nPerformance Stats:")
stats = tracker.get_stats()
for key, value in stats.items():
    print(f"{key}: {value}")
```

---

## 🚀 Production Best Practices

### Configuration Management
```python
import os
from dataclasses import dataclass
from bondmcp import BondMCPClient

@dataclass
class BondMCPConfig:
    api_key: str
    base_url: str = "https://api.bondmcp.com"
    timeout: int = 30
    max_retries: int = 3
    enable_caching: bool = True
    cache_ttl: int = 300  # 5 minutes
    
    @classmethod
    def from_env(cls):
        return cls(
            api_key=os.getenv("BONDMCP_API_KEY"),
            base_url=os.getenv("BONDMCP_BASE_URL", "https://api.bondmcp.com"),
            timeout=int(os.getenv("BONDMCP_TIMEOUT", "30")),
            max_retries=int(os.getenv("BONDMCP_MAX_RETRIES", "3")),
            enable_caching=os.getenv("BONDMCP_ENABLE_CACHING", "true").lower() == "true",
            cache_ttl=int(os.getenv("BONDMCP_CACHE_TTL", "300"))
        )

class ProductionBondMCPClient:
    def __init__(self, config: BondMCPConfig):
        self.config = config
        self.client = BondMCPClient(
            api_key=config.api_key,
            base_url=config.base_url,
            timeout=config.timeout
        )
        
        if config.enable_caching:
            self._setup_caching()
    
    def _setup_caching(self):
        # Implementation of caching layer
        pass

# Usage
config = BondMCPConfig.from_env()
client = ProductionBondMCPClient(config)
```

### Logging and Monitoring
```javascript
import { BondMCPClient } from '@bondmcp/sdk';
import winston from 'winston';

class MonitoredBondMCPClient {
  constructor(apiKey, logger) {
    this.client = new BondMCPClient({ apiKey });
    this.logger = logger || winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'bondmcp.log' })
      ]
    });
  }
  
  async ask(question, options = {}) {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    
    this.logger.info('Health query started', {
      requestId,
      question: question.substring(0, 100),
      options
    });
    
    try {
      const response = await this.client.health.ask({
        question,
        ...options
      });
      
      const duration = Date.now() - startTime;
      
      this.logger.info('Health query completed', {
        requestId,
        duration,
        trustScore: response.trustScore,
        sourcesCount: response.sources?.length || 0
      });
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.logger.error('Health query failed', {
        requestId,
        duration,
        error: error.message,
        stack: error.stack
      });
      
      throw error;
    }
  }
}

// Usage
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

const client = new MonitoredBondMCPClient(
  process.env.BONDMCP_API_KEY,
  logger
);
```

---

## 📚 Additional Resources

### Documentation Links
- **API Reference**: https://docs.bondmcp.com/api
- **SDK Documentation**: https://docs.bondmcp.com/sdks
- **Examples Repository**: https://github.com/bondmcp/examples
- **Community Forum**: https://community.bondmcp.com

### Support Channels
- **Email**: support@bondmcp.com
- **Discord**: https://discord.gg/bondmcp
- **GitHub Issues**: https://github.com/bondmcp/sdk-issues

### Rate Limits
- **Free Tier**: 100 requests/hour
- **Basic Plan**: 1,000 requests/hour
- **Premium Plan**: 10,000 requests/hour
- **Enterprise**: Custom limits

---

*SDK Examples last updated: August 4, 2025*  
*SDK Versions: Python 1.2.0, JavaScript 1.1.0, Go 1.0.0*

