# BondMCP Go SDK

[![Go Reference](https://pkg.go.dev/badge/github.com/bondmcp/mcp/go.svg)](https://pkg.go.dev/github.com/bondmcp/mcp/go)
[![Go Report Card](https://goreportcard.com/badge/github.com/bondmcp/mcp/go)](https://goreportcard.com/report/github.com/bondmcp/mcp/go)
[![Go Version](https://img.shields.io/badge/go-1.19+-00ADD8.svg)](https://golang.org/)

> **High-performance Go SDK for enterprise healthcare applications**

## 🚀 Quick Start

### Installation

```bash
go get github.com/bondmcp/mcp/go
```

### Basic Usage

```go
package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/bondmcp/mcp/go/bondmcp"
)

func main() {
    client := bondmcp.NewClient(&bondmcp.Config{
        APIKey:      "your_api_key_here",
        Environment: bondmcp.Production,
    })

    response, err := client.Ask(context.Background(), &bondmcp.AskRequest{
        Query:            "What are the potential causes of elevated liver enzymes?",
        IncludeCitations: true,
        ModelPreference:  bondmcp.ModelConsensus,
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Answer: %s\\n", response.Answer)
    fmt.Printf("Confidence: %.2f\\n", response.ConfidenceScore)
}
```

## 📚 Features

### ⚡ **High Performance**
- Zero-allocation JSON parsing
- Connection pooling
- Concurrent request handling
- Memory-efficient streaming

### 🛡️ **Enterprise Ready**
- Context-aware cancellation
- Structured logging
- Metrics and tracing
- Circuit breaker pattern
- Retry with exponential backoff

### 🔧 **Developer Friendly**
- Idiomatic Go interfaces
- Comprehensive error handling
- Rich type definitions
- Extensive documentation

## 🔧 Configuration

### Client Configuration

```go
import "github.com/bondmcp/mcp/go/bondmcp"

client := bondmcp.NewClient(&bondmcp.Config{
    APIKey:      os.Getenv("BONDMCP_API_KEY"),
    Environment: bondmcp.Production,
    Timeout:     30 * time.Second,
    Retries:     3,
    RateLimit: &bondmcp.RateLimit{
        Requests: 100,
        Window:   time.Minute,
    },
    Logger: slog.Default(),
})
```

### Advanced Configuration

```go
client := bondmcp.NewClient(&bondmcp.Config{
    APIKey:      os.Getenv("BONDMCP_API_KEY"),
    Environment: bondmcp.Production,
    HTTPClient: &http.Client{
        Timeout: 30 * time.Second,
        Transport: &http.Transport{
            MaxIdleConns:        100,
            MaxIdleConnsPerHost: 10,
            IdleConnTimeout:     90 * time.Second,
        },
    },
    Interceptors: []bondmcp.Interceptor{
        bondmcp.LoggingInterceptor(),
        bondmcp.MetricsInterceptor(),
        bondmcp.TracingInterceptor(),
    },
})
```

## 📖 API Reference

### Core Methods

#### `client.Ask(ctx, req)`
Multi-model consensus health AI query.

```go
response, err := client.Ask(ctx, &bondmcp.AskRequest{
    Query:            "What is diabetes?",
    ConversationID:   "conv_123",
    IncludeCitations: true,
    ModelPreference:  bondmcp.ModelConsensus,
})
```

#### `client.Labs.Interpret(ctx, req)`
Interpret laboratory results.

```go
interpretation, err := client.Labs.Interpret(ctx, &bondmcp.LabInterpretRequest{
    LabResults: []bondmcp.LabResult{
        {
            TestName:       "Total Cholesterol",
            Value:          240.0,
            Unit:           "mg/dL",
            ReferenceRange: "< 200 mg/dL",
        },
    },
    PatientContext: &bondmcp.PatientContext{
        Age:            45,
        Gender:         "male",
        MedicalHistory: []string{"hypertension"},
    },
})
```

#### `client.Supplements.Recommend(ctx, req)`
Get personalized supplement recommendations.

```go
recommendations, err := client.Supplements.Recommend(ctx, &bondmcp.SupplementRequest{
    HealthGoals: []string{"cardiovascular_health", "energy"},
    CurrentLabs: map[string]bondmcp.LabValue{
        "vitamin_d": {Value: 25.0, Unit: "ng/mL"},
    },
    DietaryRestrictions: []string{"vegetarian"},
})
```

### Streaming Responses

```go
stream, err := client.AskStream(ctx, &bondmcp.AskRequest{
    Query: "Explain the cardiovascular system",
})
if err != nil {
    log.Fatal(err)
}
defer stream.Close()

for {
    chunk, err := stream.Recv()
    if err == io.EOF {
        break
    }
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Print(chunk.Content)
}
```

### WebSocket Real-time

```go
ws, err := client.NewWebSocket(ctx)
if err != nil {
    log.Fatal(err)
}
defer ws.Close()

// Subscribe to health alerts
err = ws.Send(&bondmcp.WSMessage{
    Type:    "subscribe",
    Channel: "health_alerts",
})

// Listen for messages
for {
    var msg bondmcp.WSMessage
    err := ws.ReadJSON(&msg)
    if err != nil {
        log.Printf("WebSocket error: %v", err)
        break
    }
    
    fmt.Printf("Received: %+v\\n", msg)
}
```

## 🧪 Examples

### HTTP Server with Gin

```go
package main

import (
    "net/http"
    
    "github.com/gin-gonic/gin"
    "github.com/bondmcp/mcp/go/bondmcp"
)

func main() {
    client := bondmcp.NewClient(&bondmcp.Config{
        APIKey: os.Getenv("BONDMCP_API_KEY"),
    })

    r := gin.Default()
    
    r.POST("/health-query", func(c *gin.Context) {
        var req struct {
            Query string `json:"query"`
        }
        
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        response, err := client.Ask(c.Request.Context(), &bondmcp.AskRequest{
            Query: req.Query,
        })
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, response)
    })

    r.Run(":8080")
}
```

### gRPC Service

```go
package main

import (
    "context"
    "log"
    "net"

    "google.golang.org/grpc"
    "github.com/bondmcp/mcp/go/bondmcp"
    pb "your-proto-package/health"
)

type healthService struct {
    pb.UnimplementedHealthServiceServer
    bondmcp *bondmcp.Client
}

func (s *healthService) AskHealthQuestion(ctx context.Context, req *pb.HealthRequest) (*pb.HealthResponse, error) {
    response, err := s.bondmcp.Ask(ctx, &bondmcp.AskRequest{
        Query: req.Query,
    })
    if err != nil {
        return nil, err
    }

    return &pb.HealthResponse{
        Answer:          response.Answer,
        ConfidenceScore: response.ConfidenceScore,
    }, nil
}

func main() {
    client := bondmcp.NewClient(&bondmcp.Config{
        APIKey: os.Getenv("BONDMCP_API_KEY"),
    })

    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }

    s := grpc.NewServer()
    pb.RegisterHealthServiceServer(s, &healthService{bondmcp: client})

    log.Println("gRPC server listening on :50051")
    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
```

### Concurrent Processing

```go
package main

import (
    "context"
    "fmt"
    "sync"
    
    "github.com/bondmcp/mcp/go/bondmcp"
)

func main() {
    client := bondmcp.NewClient(&bondmcp.Config{
        APIKey: os.Getenv("BONDMCP_API_KEY"),
    })

    queries := []string{
        "What is diabetes?",
        "Explain hypertension",
        "What are the symptoms of anemia?",
    }

    var wg sync.WaitGroup
    results := make(chan *bondmcp.AskResponse, len(queries))

    for _, query := range queries {
        wg.Add(1)
        go func(q string) {
            defer wg.Done()
            
            response, err := client.Ask(context.Background(), &bondmcp.AskRequest{
                Query: q,
            })
            if err != nil {
                fmt.Printf("Error for query '%s': %v\\n", q, err)
                return
            }
            
            results <- response
        }(query)
    }

    wg.Wait()
    close(results)

    for response := range results {
        fmt.Printf("Answer: %s (Confidence: %.2f)\\n", 
            response.Answer, response.ConfidenceScore)
    }
}
```

## 🔒 Security

### API Key Management

```go
// ✅ Good - Environment variables
client := bondmcp.NewClient(&bondmcp.Config{
    APIKey: os.Getenv("BONDMCP_API_KEY"),
})

// ✅ Good - AWS Secrets Manager
apiKey, err := getSecretFromAWS("bondmcp-api-key")
if err != nil {
    log.Fatal(err)
}

client := bondmcp.NewClient(&bondmcp.Config{
    APIKey: apiKey,
})
```

### Context Cancellation

```go
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()

response, err := client.Ask(ctx, &bondmcp.AskRequest{
    Query: "What is diabetes?",
})
```

### Rate Limiting

```go
client := bondmcp.NewClient(&bondmcp.Config{
    APIKey: os.Getenv("BONDMCP_API_KEY"),
    RateLimit: &bondmcp.RateLimit{
        Requests: 50,              // 50 requests
        Window:   time.Minute,     // per minute
    },
})
```

## 🧪 Testing

### Unit Tests

```go
package main

import (
    "context"
    "testing"
    
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
    "github.com/bondmcp/mcp/go/bondmcp"
)

func TestBondMCPClient(t *testing.T) {
    // Create a mock client
    mockClient := &bondmcp.MockClient{}
    
    // Set up expectations
    mockClient.On("Ask", mock.Anything, mock.AnythingOfType("*bondmcp.AskRequest")).
        Return(&bondmcp.AskResponse{
            Answer:          "Diabetes is a metabolic disorder...",
            ConfidenceScore: 0.95,
        }, nil)

    // Test the client
    response, err := mockClient.Ask(context.Background(), &bondmcp.AskRequest{
        Query: "What is diabetes?",
    })

    assert.NoError(t, err)
    assert.NotNil(t, response)
    assert.Equal(t, "Diabetes is a metabolic disorder...", response.Answer)
    assert.Equal(t, 0.95, response.ConfidenceScore)
    
    mockClient.AssertExpectations(t)
}
```

### Integration Tests

```go
func TestIntegration(t *testing.T) {
    if testing.Short() {
        t.Skip("Skipping integration test")
    }

    client := bondmcp.NewClient(&bondmcp.Config{
        APIKey:      os.Getenv("BONDMCP_TEST_API_KEY"),
        Environment: bondmcp.Staging,
    })

    response, err := client.Ask(context.Background(), &bondmcp.AskRequest{
        Query: "What is hypertension?",
    })

    assert.NoError(t, err)
    assert.NotEmpty(t, response.Answer)
    assert.Greater(t, response.ConfidenceScore, 0.8)
}
```

## 📦 Build & Development

### Development Setup

```bash
# Clone the repository
git clone https://github.com/bondmcp/mcp.git
cd mcp/go

# Download dependencies
go mod download

# Run tests
go test ./...

# Run with race detection
go test -race ./...

# Build
go build ./...
```

### Makefile

```makefile
.PHONY: test build lint

test:
	go test -v -race ./...

build:
	go build -o bin/bondmcp ./cmd/...

lint:
	golangci-lint run

coverage:
	go test -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out

benchmark:
	go test -bench=. -benchmem ./...
```

## 🚀 Performance

### Benchmarks

```go
func BenchmarkAskRequest(b *testing.B) {
    client := bondmcp.NewClient(&bondmcp.Config{
        APIKey: "test_key",
    })

    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        _, err := client.Ask(context.Background(), &bondmcp.AskRequest{
            Query: "What is diabetes?",
        })
        if err != nil {
            b.Fatal(err)
        }
    }
}
```

### Memory Optimization

```go
// Use object pools for frequent allocations
var requestPool = sync.Pool{
    New: func() interface{} {
        return &bondmcp.AskRequest{}
    },
}

func getRequest() *bondmcp.AskRequest {
    return requestPool.Get().(*bondmcp.AskRequest)
}

func putRequest(req *bondmcp.AskRequest) {
    req.Reset() // Clear the request
    requestPool.Put(req)
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow [Effective Go](https://golang.org/doc/effective_go.html)
- Use `gofmt` for formatting
- Run `golangci-lint` for linting
- Write comprehensive tests
- Document public APIs

## 📄 License

This project is licensed under the MIT License - see the **LICENSE**  file for details.

## 🔗 Links

- **📚 Main Repository**: [bondmcp/mcp](https://github.com/bondmcp/mcp)
- **🌐 Website**: [bondmcp.com](https://bondmcp.com)
- **📖 API Documentation**: [docs.bondmcp.com](https://docs.bondmcp.com)
- **📊 Go Package**: [pkg.go.dev/github.com/bondmcp/mcp/go](https://pkg.go.dev/github.com/bondmcp/mcp/go)

---

<div align="center">
  <strong>Built with ❤️ for Go developers</strong>
</div>

