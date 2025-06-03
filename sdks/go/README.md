# BondMCP Go SDK

Official Go SDK for BondMCP - The #1 MCP (Model Context Protocol) in Health.

[![Go Reference](https://pkg.go.dev/badge/github.com/bondmcp/mcp/sdks/go.svg)](https://pkg.go.dev/github.com/bondmcp/mcp/sdks/go)
[![Go Report Card](https://goreportcard.com/badge/github.com/bondmcp/mcp/sdks/go)](https://goreportcard.com/report/github.com/bondmcp/mcp/sdks/go)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Modern Go** - Built with Go 1.21+ using modern Go idioms and best practices
- 🔄 **Context Support** - Full context.Context support for cancellation and timeouts
- 🛡️ **Type Safety** - Comprehensive struct validation using go-playground/validator
- 🔁 **Automatic Retries** - Built-in retry logic with exponential backoff
- 📊 **Usage Tracking** - Built-in request counting and metrics
- 🎯 **Comprehensive Coverage** - Support for all 30+ BondMCP API endpoints
- 🔧 **Developer Friendly** - Excellent IDE support with comprehensive documentation
- ⚡ **High Performance** - Optimized for concurrent usage with goroutine safety

## Installation

```bash
go get github.com/bondmcp/mcp/sdks/go
```

## Quick Start

```go
package main

import (
    "context"
    "fmt"
    "log"
    "time"

    "github.com/bondmcp/mcp/sdks/go"
)

func main() {
    // Initialize the client
    client, err := bondmcp.NewClient(
        "your-api-key-here",
        bondmcp.WithUserTier(bondmcp.UserTierProfessional),
        bondmcp.WithTimeout(30*time.Second),
        bondmcp.WithLogging(true),
    )
    if err != nil {
        log.Fatal(err)
    }

    ctx := context.Background()

    // Check API health
    health, _, err := client.Health.Check(ctx)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("API Status: %s\n", health.Status)

    // Ask a health question
    response, _, err := client.Ask.Query(ctx, &bondmcp.AskRequest{
        Prompt:           "What are the benefits of vitamin D supplementation?",
        IncludeCitations: true,
        ModelPreference:  bondmcp.ModelPreferenceConsensus,
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("AI Response: %s\n", response.Answer)
    fmt.Printf("Model Used: %s\n", response.ModelUsed)
    
    if len(response.Citations) > 0 {
        fmt.Println("Citations:")
        for _, citation := range response.Citations {
            fmt.Printf("- %s: %s\n", citation.Title, citation.URL)
        }
    }
}
```

## Configuration Options

```go
// Available configuration options
client, err := bondmcp.NewClient(
    "your-api-key",
    bondmcp.WithBaseURL("https://custom-api.bondmcp.com"),  // Custom API base URL
    bondmcp.WithTimeout(60*time.Second),                    // Request timeout
    bondmcp.WithMaxRetries(5),                              // Max retry attempts
    bondmcp.WithRetryDelay(2*time.Second),                  // Base retry delay
    bondmcp.WithLogging(true),                              // Enable debug logging
    bondmcp.WithUserTier(bondmcp.UserTierEnterprise),       // Subscription tier
    bondmcp.WithHTTPClient(customHTTPClient),               // Custom HTTP client
)
```

## API Reference

### Health Endpoints

```go
// Check API health
health, response, err := client.Health.Check(ctx)
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Status: %s, Uptime: %.2f hours\n", health.Status, health.Uptime/3600)
```

### AI Question Answering

```go
// Ask a health question with full configuration
response, apiResp, err := client.Ask.Query(ctx, &bondmcp.AskRequest{
    Prompt:           "What are the symptoms of vitamin B12 deficiency?",
    Context:          "Patient is vegetarian, age 35",
    ConversationID:   "conv-123",
    IncludeCitations: true,
    ModelPreference:  bondmcp.ModelPreferenceConsensus,
})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Answer: %s\n", response.Answer)
fmt.Printf("Confidence: %.2f\n", response.Confidence)
fmt.Printf("Response Time: %v\n", apiResp.ResponseTime)
```

### Lab Result Interpretation

```go
// Interpret lab results
labData := map[string]interface{}{
    "Vitamin D": map[string]interface{}{
        "value": 15,
        "unit":  "ng/mL",
    },
    "B12": map[string]interface{}{
        "value": 200,
        "unit":  "pg/mL",
    },
}

interpretation, _, err := client.Labs.Interpret(ctx, &bondmcp.LabInterpretationRequest{
    LabResults:             labData,
    PatientContext:         "35-year-old vegetarian female",
    IncludeRecommendations: true,
})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Lab Interpretation: %+v\n", interpretation)
```

### Supplement Recommendations

```go
// Get supplement recommendations
recommendations, _, err := client.Supplements.Recommend(ctx, &bondmcp.SupplementRecommendationRequest{
    HealthGoals:         []string{"immune support", "energy"},
    CurrentSupplements:  []string{"multivitamin"},
    DietaryRestrictions: []string{"vegetarian"},
    Age:                 35,
    Gender:              "female",
})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Recommendations: %+v\n", recommendations)

// Check supplement interactions
interactions, _, err := client.Supplements.CheckInteractions(ctx, map[string]interface{}{
    "supplements": []string{"vitamin D", "magnesium"},
    "medications": []string{"levothyroxine"},
})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Interactions: %+v\n", interactions)
```

### Wearable Data Analysis

```go
// Analyze wearable data
wearableData := map[string]interface{}{
    "wearable_data": map[string]interface{}{
        "heart_rate": []int{65, 68, 72, 70},
        "steps":      []int{8500, 9200, 7800, 10500},
        "sleep_hours": []float64{7.5, 6.8, 8.2, 7.1},
    },
    "timeframe": "week",
    "metrics":   []string{"heart_rate_variability", "sleep_quality"},
}

insights, _, err := client.Wearables.AnalyzeData(ctx, wearableData)
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Wearable Insights: %+v\n", insights)
```

### Chat and Conversations

```go
// Create a new conversation
conversation, _, err := client.Chat.CreateConversation(ctx, map[string]interface{}{
    "initial_message": "I'd like to discuss my recent lab results",
    "context": map[string]interface{}{
        "patient_age": 35,
        "gender":      "female",
    },
})
if err != nil {
    log.Fatal(err)
}

conversationID := conversation["id"].(string)

// Send a message
response, _, err := client.Chat.SendMessage(ctx, conversationID, map[string]interface{}{
    "message": "My vitamin D level is 15 ng/mL. What should I do?",
})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Chat Response: %+v\n", response)

// Get conversation history
history, _, err := client.Chat.GetConversation(ctx, conversationID)
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Conversation History: %+v\n", history)
```

### API Key Management

```go
// List API keys
keys, _, err := client.APIKeys.List(ctx)
if err != nil {
    log.Fatal(err)
}

fmt.Printf("API Keys: %+v\n", keys)

// Create a new API key
newKey, _, err := client.APIKeys.Create(ctx, map[string]interface{}{
    "name":       "Production Key",
    "scopes":     []string{"ask", "labs", "supplements"},
    "expires_at": "2024-12-31T23:59:59Z",
})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("New API Key: %+v\n", newKey)

// Revoke an API key
_, _, err = client.APIKeys.Revoke(ctx, "key-id")
if err != nil {
    log.Fatal(err)
}
```

### Usage and Billing

```go
// Get usage statistics
usage, _, err := client.Payments.GetUsage(ctx, map[string]string{
    "start_date": "2024-01-01",
    "end_date":   "2024-01-31",
})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Usage Data: %+v\n", usage)

// Get client usage stats
stats := client.GetUsageStats()
fmt.Printf("Made %d requests, Total Cost: $%.2f\n", stats.RequestCount, stats.TotalCost)
```

## Error Handling

The SDK provides comprehensive error handling with specific error types:

```go
import (
    "errors"
    "github.com/bondmcp/mcp/sdks/go"
)

response, _, err := client.Ask.Query(ctx, &bondmcp.AskRequest{
    Prompt: "What is the recommended dosage of vitamin D?",
})
if err != nil {
    var authErr *bondmcp.AuthenticationError
    var rateLimitErr *bondmcp.RateLimitError
    var validationErr *bondmcp.ValidationError
    var apiErr *bondmcp.APIError

    switch {
    case errors.As(err, &authErr):
        fmt.Printf("Authentication error: %s\n", authErr.Message)
    case errors.As(err, &rateLimitErr):
        fmt.Printf("Rate limit exceeded, retry after: %v\n", rateLimitErr.RetryAfter)
    case errors.As(err, &validationErr):
        fmt.Printf("Validation error: %s\n", validationErr.Message)
    case errors.As(err, &apiErr):
        fmt.Printf("API error (%d): %s\n", apiErr.StatusCode, apiErr.Message)
    default:
        fmt.Printf("Unexpected error: %v\n", err)
    }
    return
}
```

## Context and Cancellation

The SDK fully supports Go's context package for cancellation and timeouts:

```go
// Request with timeout
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()

response, _, err := client.Ask.Query(ctx, &bondmcp.AskRequest{
    Prompt: "What are the benefits of omega-3?",
})
if err != nil {
    if errors.Is(err, context.DeadlineExceeded) {
        fmt.Println("Request timed out")
    } else {
        fmt.Printf("Error: %v\n", err)
    }
    return
}

// Request with cancellation
ctx, cancel := context.WithCancel(context.Background())

// Cancel after 5 seconds
go func() {
    time.Sleep(5 * time.Second)
    cancel()
}()

response, _, err := client.Ask.Query(ctx, &bondmcp.AskRequest{
    Prompt: "Long running query...",
})
if err != nil {
    if errors.Is(err, context.Canceled) {
        fmt.Println("Request was cancelled")
    }
}
```

## Concurrent Usage

The client is safe for concurrent use across multiple goroutines:

```go
var wg sync.WaitGroup
questions := []string{
    "What are the benefits of vitamin D?",
    "How much protein should I consume daily?",
    "What are the symptoms of iron deficiency?",
}

for _, question := range questions {
    wg.Add(1)
    go func(q string) {
        defer wg.Done()
        
        response, _, err := client.Ask.Query(ctx, &bondmcp.AskRequest{
            Prompt: q,
        })
        if err != nil {
            fmt.Printf("Error for question '%s': %v\n", q, err)
            return
        }
        
        fmt.Printf("Q: %s\nA: %s\n\n", q, response.Answer)
    }(question)
}

wg.Wait()
```

## Advanced Usage

### Custom HTTP Client

```go
import (
    "crypto/tls"
    "net/http"
    "time"
)

// Create custom HTTP client with specific settings
customClient := &http.Client{
    Timeout: 60 * time.Second,
    Transport: &http.Transport{
        TLSClientConfig: &tls.Config{
            InsecureSkipVerify: false,
        },
        MaxIdleConns:        100,
        MaxIdleConnsPerHost: 10,
        IdleConnTimeout:     90 * time.Second,
    },
}

client, err := bondmcp.NewClient(
    "your-api-key",
    bondmcp.WithHTTPClient(customClient),
)
```

### Request Validation

```go
// Validate request before sending
request := &bondmcp.AskRequest{
    Prompt: "", // Invalid: empty prompt
}

if err := client.ValidateStruct(request); err != nil {
    fmt.Printf("Validation error: %v\n", err)
    return
}
```

### Usage Monitoring

```go
// Monitor usage in a separate goroutine
go func() {
    ticker := time.NewTicker(1 * time.Minute)
    defer ticker.Stop()
    
    for range ticker.C {
        stats := client.GetUsageStats()
        fmt.Printf("Usage: %d requests, $%.2f cost\n", 
            stats.RequestCount, stats.TotalCost)
    }
}()
```

## Testing

```go
package main

import (
    "context"
    "testing"
    "time"

    "github.com/bondmcp/mcp/sdks/go"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
)

func TestBondMCPClient(t *testing.T) {
    client, err := bondmcp.NewClient(
        "test-api-key",
        bondmcp.WithTimeout(5*time.Second),
    )
    require.NoError(t, err)
    require.NotNil(t, client)

    ctx := context.Background()

    // Test health check
    health, response, err := client.Health.Check(ctx)
    require.NoError(t, err)
    assert.Equal(t, "healthy", health.Status)
    assert.True(t, response.Success)
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@bondmcp.com
- 📖 Documentation: https://docs.bondmcp.com
- 🐛 Issues: https://github.com/bondmcp/mcp/issues
- 💬 Discord: https://discord.gg/bondmcp

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by the BondMCP Team

