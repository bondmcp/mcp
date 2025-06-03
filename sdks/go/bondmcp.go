// Package bondmcp provides the official Go SDK for BondMCP - The #1 MCP in Health
//
// This SDK provides a comprehensive interface to the BondMCP API with features including:
// - Context-aware requests with timeout support
// - Automatic retries with exponential backoff
// - Comprehensive error handling
// - Request/response validation
// - Usage tracking and metrics
// - Support for all 30+ API endpoints
//
// Example usage:
//
//	client := bondmcp.NewClient("your-api-key", bondmcp.WithUserTier(bondmcp.UserTierProfessional))
//	
//	ctx := context.Background()
//	response, err := client.Ask.Query(ctx, &bondmcp.AskRequest{
//		Prompt: "What are the benefits of vitamin D?",
//		IncludeCitations: true,
//	})
//	if err != nil {
//		log.Fatal(err)
//	}
//	
//	fmt.Println("Answer:", response.Answer)
package bondmcp

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/go-playground/validator/v10"
)

// Version of the SDK
const Version = "2.0.0"

// UserTier represents the subscription tier
type UserTier string

const (
	UserTierDeveloper    UserTier = "Developer+"
	UserTierProfessional UserTier = "Professional+"
	UserTierEnterprise   UserTier = "Enterprise+"
	UserTierClinical     UserTier = "Clinical+"
)

// ModelPreference represents AI model preferences
type ModelPreference string

const (
	ModelPreferenceConsensus ModelPreference = "consensus"
	ModelPreferenceClaude    ModelPreference = "claude"
	ModelPreferenceGPT4      ModelPreference = "gpt4"
	ModelPreferenceMedLM     ModelPreference = "medlm"
)

// Config holds the client configuration
type Config struct {
	APIKey       string
	BaseURL      string
	Timeout      time.Duration
	MaxRetries   int
	RetryDelay   time.Duration
	EnableLogging bool
	UserTier     UserTier
	HTTPClient   *http.Client
}

// Option is a functional option for configuring the client
type Option func(*Config)

// WithBaseURL sets a custom base URL
func WithBaseURL(baseURL string) Option {
	return func(c *Config) {
		c.BaseURL = strings.TrimSuffix(baseURL, "/")
	}
}

// WithTimeout sets the request timeout
func WithTimeout(timeout time.Duration) Option {
	return func(c *Config) {
		c.Timeout = timeout
	}
}

// WithMaxRetries sets the maximum number of retry attempts
func WithMaxRetries(maxRetries int) Option {
	return func(c *Config) {
		c.MaxRetries = maxRetries
	}
}

// WithRetryDelay sets the base retry delay
func WithRetryDelay(delay time.Duration) Option {
	return func(c *Config) {
		c.RetryDelay = delay
	}
}

// WithLogging enables debug logging
func WithLogging(enable bool) Option {
	return func(c *Config) {
		c.EnableLogging = enable
	}
}

// WithUserTier sets the user subscription tier
func WithUserTier(tier UserTier) Option {
	return func(c *Config) {
		c.UserTier = tier
	}
}

// WithHTTPClient sets a custom HTTP client
func WithHTTPClient(client *http.Client) Option {
	return func(c *Config) {
		c.HTTPClient = client
	}
}

// APIResponse represents a structured API response
type APIResponse struct {
	Data         interface{}       `json:"data"`
	StatusCode   int               `json:"status_code"`
	Headers      map[string]string `json:"headers"`
	ResponseTime time.Duration     `json:"response_time"`
	RequestID    string            `json:"request_id,omitempty"`
	Success      bool              `json:"success"`
}

// UsageStats represents client usage statistics
type UsageStats struct {
	RequestCount int       `json:"request_count"`
	TotalCost    float64   `json:"total_cost"`
	UserTier     UserTier  `json:"user_tier"`
	BaseURL      string    `json:"base_url"`
}

// Error types
type (
	// BondMCPError is the base error type
	BondMCPError struct {
		Message string `json:"message"`
	}

	// AuthenticationError represents authentication failures
	AuthenticationError struct {
		BondMCPError
	}

	// RateLimitError represents rate limiting
	RateLimitError struct {
		BondMCPError
		RetryAfter time.Duration `json:"retry_after,omitempty"`
	}

	// ValidationError represents request validation failures
	ValidationError struct {
		BondMCPError
		Field string `json:"field,omitempty"`
	}

	// APIError represents general API errors
	APIError struct {
		BondMCPError
		StatusCode   int                    `json:"status_code"`
		ResponseData map[string]interface{} `json:"response_data,omitempty"`
	}
)

func (e BondMCPError) Error() string        { return e.Message }
func (e AuthenticationError) Error() string { return fmt.Sprintf("authentication error: %s", e.Message) }
func (e RateLimitError) Error() string      { return fmt.Sprintf("rate limit error: %s", e.Message) }
func (e ValidationError) Error() string     { return fmt.Sprintf("validation error: %s", e.Message) }
func (e APIError) Error() string            { return fmt.Sprintf("API error (%d): %s", e.StatusCode, e.Message) }

// Client is the main BondMCP API client
type Client struct {
	config    Config
	validator *validator.Validate
	mu        sync.RWMutex
	
	// Usage tracking
	requestCount int
	totalCost    float64
	
	// Resource clients
	Health        *HealthResource
	Ask           *AskResource
	Labs          *LabsResource
	Supplements   *SupplementsResource
	Wearables     *WearablesResource
	MedicalRecords *MedicalRecordsResource
	Insights      *InsightsResource
	APIKeys       *APIKeysResource
	Payments      *PaymentsResource
	Orchestrate   *OrchestrateResource
	Tools         *ToolsResource
	Imports       *ImportResource
	Chat          *ChatResource
}

// NewClient creates a new BondMCP API client
func NewClient(apiKey string, options ...Option) (*Client, error) {
	if apiKey == "" {
		return nil, &AuthenticationError{BondMCPError{Message: "API key is required"}}
	}

	config := Config{
		APIKey:       apiKey,
		BaseURL:      "https://api.bondmcp.com",
		Timeout:      30 * time.Second,
		MaxRetries:   3,
		RetryDelay:   time.Second,
		EnableLogging: false,
		UserTier:     UserTierDeveloper,
	}

	// Apply options
	for _, option := range options {
		option(&config)
	}

	// Set default HTTP client if not provided
	if config.HTTPClient == nil {
		config.HTTPClient = &http.Client{
			Timeout: config.Timeout,
		}
	}

	client := &Client{
		config:    config,
		validator: validator.New(),
	}

	// Initialize resource clients
	client.Health = &HealthResource{client: client}
	client.Ask = &AskResource{client: client}
	client.Labs = &LabsResource{client: client}
	client.Supplements = &SupplementsResource{client: client}
	client.Wearables = &WearablesResource{client: client}
	client.MedicalRecords = &MedicalRecordsResource{client: client}
	client.Insights = &InsightsResource{client: client}
	client.APIKeys = &APIKeysResource{client: client}
	client.Payments = &PaymentsResource{client: client}
	client.Orchestrate = &OrchestrateResource{client: client}
	client.Tools = &ToolsResource{client: client}
	client.Imports = &ImportResource{client: client}
	client.Chat = &ChatResource{client: client}

	return client, nil
}

// Request makes an HTTP request with retry logic and error handling
func (c *Client) Request(ctx context.Context, method, path string, body interface{}, result interface{}) (*APIResponse, error) {
	var lastErr error
	startTime := time.Now()

	for attempt := 0; attempt <= c.config.MaxRetries; attempt++ {
		if c.config.EnableLogging {
			fmt.Printf("[BondMCP] Making %s request to %s (attempt %d)\n", method, path, attempt+1)
		}

		response, err := c.makeRequest(ctx, method, path, body)
		if err != nil {
			lastErr = err
			if attempt == c.config.MaxRetries {
				break
			}

			// Exponential backoff
			delay := c.config.RetryDelay * time.Duration(1<<uint(attempt))
			if c.config.EnableLogging {
				fmt.Printf("[BondMCP] Request attempt %d failed: %v. Retrying in %v...\n", attempt+1, err, delay)
			}

			select {
			case <-ctx.Done():
				return nil, ctx.Err()
			case <-time.After(delay):
				continue
			}
		}

		responseTime := time.Since(startTime)
		
		// Update usage tracking
		c.mu.Lock()
		c.requestCount++
		c.mu.Unlock()

		if c.config.EnableLogging {
			fmt.Printf("[BondMCP] Request completed in %v\n", responseTime)
		}

		// Parse response
		apiResponse := &APIResponse{
			StatusCode:   response.StatusCode,
			Headers:      make(map[string]string),
			ResponseTime: responseTime,
			RequestID:    response.Header.Get("X-Request-ID"),
			Success:      response.StatusCode >= 200 && response.StatusCode < 300,
		}

		// Copy headers
		for key, values := range response.Header {
			if len(values) > 0 {
				apiResponse.Headers[key] = values[0]
			}
		}

		// Read response body
		bodyBytes, err := io.ReadAll(response.Body)
		if err != nil {
			return nil, fmt.Errorf("failed to read response body: %w", err)
		}
		response.Body.Close()

		// Handle error responses
		if !apiResponse.Success {
			return nil, c.handleErrorResponse(response.StatusCode, bodyBytes)
		}

		// Parse successful response
		if result != nil {
			if err := json.Unmarshal(bodyBytes, result); err != nil {
				return nil, fmt.Errorf("failed to parse response: %w", err)
			}
			apiResponse.Data = result
		} else {
			var data interface{}
			if err := json.Unmarshal(bodyBytes, &data); err != nil {
				apiResponse.Data = string(bodyBytes)
			} else {
				apiResponse.Data = data
			}
		}

		return apiResponse, nil
	}

	return nil, fmt.Errorf("request failed after %d attempts: %w", c.config.MaxRetries+1, lastErr)
}

// makeRequest performs a single HTTP request
func (c *Client) makeRequest(ctx context.Context, method, path string, body interface{}) (*http.Response, error) {
	url := c.config.BaseURL + path

	var bodyReader io.Reader
	if body != nil {
		bodyBytes, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal request body: %w", err)
		}
		bodyReader = bytes.NewReader(bodyBytes)
	}

	req, err := http.NewRequestWithContext(ctx, method, url, bodyReader)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+c.config.APIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "BondMCP-Go-SDK/"+Version)

	return c.config.HTTPClient.Do(req)
}

// handleErrorResponse converts HTTP error responses to appropriate error types
func (c *Client) handleErrorResponse(statusCode int, body []byte) error {
	var errorData map[string]interface{}
	json.Unmarshal(body, &errorData)

	message := "API request failed"
	if msg, ok := errorData["message"].(string); ok {
		message = msg
	}

	switch statusCode {
	case 401:
		return &AuthenticationError{BondMCPError{Message: "Invalid API key"}}
	case 429:
		err := &RateLimitError{BondMCPError{Message: "Rate limit exceeded"}}
		if retryAfter := errorData["retry_after"]; retryAfter != nil {
			if seconds, ok := retryAfter.(float64); ok {
				err.RetryAfter = time.Duration(seconds) * time.Second
			}
		}
		return err
	case 422:
		return &ValidationError{BondMCPError{Message: message}}
	default:
		return &APIError{
			BondMCPError: BondMCPError{Message: message},
			StatusCode:   statusCode,
			ResponseData: errorData,
		}
	}
}

// GetUsageStats returns client usage statistics
func (c *Client) GetUsageStats() UsageStats {
	c.mu.RLock()
	defer c.mu.RUnlock()
	
	return UsageStats{
		RequestCount: c.requestCount,
		TotalCost:    c.totalCost,
		UserTier:     c.config.UserTier,
		BaseURL:      c.config.BaseURL,
	}
}

// ValidateStruct validates a struct using the validator
func (c *Client) ValidateStruct(s interface{}) error {
	if err := c.validator.Struct(s); err != nil {
		return &ValidationError{BondMCPError{Message: err.Error()}}
	}
	return nil
}

// Resource base type
type resource struct {
	client *Client
}

// ============================================================================
// Request/Response Types
// ============================================================================

// HealthCheckResponse represents the health check response
type HealthCheckResponse struct {
	Status    string  `json:"status" validate:"required"`
	Timestamp string  `json:"timestamp" validate:"required"`
	Version   string  `json:"version,omitempty"`
	Uptime    float64 `json:"uptime,omitempty"`
}

// AskRequest represents a request to the Ask endpoint
type AskRequest struct {
	Prompt           string          `json:"prompt" validate:"required,min=1"`
	Context          string          `json:"context,omitempty"`
	ConversationID   string          `json:"conversation_id,omitempty"`
	IncludeCitations bool            `json:"include_citations"`
	ModelPreference  ModelPreference `json:"model_preference,omitempty"`
}

// AskResponse represents the response from the Ask endpoint
type AskResponse struct {
	Answer         string     `json:"answer"`
	Citations      []Citation `json:"citations,omitempty"`
	ConversationID string     `json:"conversation_id"`
	ModelUsed      string     `json:"model_used"`
	Confidence     float64    `json:"confidence,omitempty"`
}

// Citation represents a citation in the response
type Citation struct {
	Title   string `json:"title"`
	URL     string `json:"url"`
	Snippet string `json:"snippet"`
}

// LabInterpretationRequest represents a lab interpretation request
type LabInterpretationRequest struct {
	LabResults             map[string]interface{} `json:"lab_results" validate:"required"`
	PatientContext         string                 `json:"patient_context,omitempty"`
	IncludeRecommendations bool                   `json:"include_recommendations"`
}

// SupplementRecommendationRequest represents a supplement recommendation request
type SupplementRecommendationRequest struct {
	HealthGoals          []string `json:"health_goals" validate:"required,min=1"`
	CurrentSupplements   []string `json:"current_supplements,omitempty"`
	DietaryRestrictions  []string `json:"dietary_restrictions,omitempty"`
	Age                  int      `json:"age,omitempty" validate:"omitempty,min=1,max=150"`
	Gender               string   `json:"gender,omitempty" validate:"omitempty,oneof=male female other"`
}

// ============================================================================
// Resource Implementations
// ============================================================================

// HealthResource handles health-related endpoints
type HealthResource struct {
	client *Client
}

// Check performs a health check
func (r *HealthResource) Check(ctx context.Context) (*HealthCheckResponse, *APIResponse, error) {
	var result HealthCheckResponse
	response, err := r.client.Request(ctx, "GET", "/health", nil, &result)
	if err != nil {
		return nil, nil, err
	}
	return &result, response, nil
}

// AskResource handles AI question answering
type AskResource struct {
	client *Client
}

// Query asks a health-related question
func (r *AskResource) Query(ctx context.Context, req *AskRequest) (*AskResponse, *APIResponse, error) {
	if err := r.client.ValidateStruct(req); err != nil {
		return nil, nil, err
	}

	var result AskResponse
	response, err := r.client.Request(ctx, "POST", "/ask", req, &result)
	if err != nil {
		return nil, nil, err
	}
	return &result, response, nil
}

// LabsResource handles lab result interpretation
type LabsResource struct {
	client *Client
}

// Interpret interprets lab results
func (r *LabsResource) Interpret(ctx context.Context, req *LabInterpretationRequest) (map[string]interface{}, *APIResponse, error) {
	if err := r.client.ValidateStruct(req); err != nil {
		return nil, nil, err
	}

	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/labs/interpret", req, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// SupplementsResource handles supplement recommendations
type SupplementsResource struct {
	client *Client
}

// Recommend gets supplement recommendations
func (r *SupplementsResource) Recommend(ctx context.Context, req *SupplementRecommendationRequest) (map[string]interface{}, *APIResponse, error) {
	if err := r.client.ValidateStruct(req); err != nil {
		return nil, nil, err
	}

	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/supplement/recommend", req, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// CheckInteractions checks for supplement-drug interactions
func (r *SupplementsResource) CheckInteractions(ctx context.Context, data map[string]interface{}) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/supplement/interactions", data, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// WearablesResource handles wearable data analysis
type WearablesResource struct {
	client *Client
}

// AnalyzeData analyzes wearable device data
func (r *WearablesResource) AnalyzeData(ctx context.Context, data map[string]interface{}) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/v1/wearable-data-insights", data, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// MedicalRecordsResource handles medical records
type MedicalRecordsResource struct {
	client *Client
}

// Upload uploads medical record data
func (r *MedicalRecordsResource) Upload(ctx context.Context, data map[string]interface{}) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/medical-records/upload", data, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// InsightsResource handles health insights
type InsightsResource struct {
	client *Client
}

// Generate generates health insights
func (r *InsightsResource) Generate(ctx context.Context, data map[string]interface{}) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/insights/generate", data, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// APIKeysResource handles API key management
type APIKeysResource struct {
	client *Client
}

// List lists all API keys
func (r *APIKeysResource) List(ctx context.Context) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "GET", "/api-keys", nil, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// Create creates a new API key
func (r *APIKeysResource) Create(ctx context.Context, data map[string]interface{}) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/api-keys", data, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// Revoke revokes an API key
func (r *APIKeysResource) Revoke(ctx context.Context, keyID string) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "DELETE", "/api-keys/"+keyID, nil, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// PaymentsResource handles billing and usage
type PaymentsResource struct {
	client *Client
}

// GetUsage gets usage and billing information
func (r *PaymentsResource) GetUsage(ctx context.Context, params map[string]string) (map[string]interface{}, *APIResponse, error) {
	path := "/payments/usage"
	if len(params) > 0 {
		values := url.Values{}
		for k, v := range params {
			values.Add(k, v)
		}
		path += "?" + values.Encode()
	}

	var result map[string]interface{}
	response, err := r.client.Request(ctx, "GET", path, nil, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// OrchestrateResource handles workflow orchestration
type OrchestrateResource struct {
	client *Client
}

// RunWorkflow runs a predefined workflow
func (r *OrchestrateResource) RunWorkflow(ctx context.Context, data map[string]interface{}) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/orchestrate/run", data, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// ToolsResource handles AI tools
type ToolsResource struct {
	client *Client
}

// ListAvailable lists available AI tools
func (r *ToolsResource) ListAvailable(ctx context.Context) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "GET", "/tools/available", nil, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// ExecuteTool executes a specific AI tool
func (r *ToolsResource) ExecuteTool(ctx context.Context, data map[string]interface{}) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/tools/execute", data, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// ImportResource handles data imports
type ImportResource struct {
	client *Client
}

// Oura imports data from Oura ring
func (r *ImportResource) Oura(ctx context.Context, data map[string]interface{}) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/import/oura", data, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// AppleHealth imports Apple Health data
func (r *ImportResource) AppleHealth(ctx context.Context, data map[string]interface{}) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/import/apple-health", data, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// ChatResource handles conversations
type ChatResource struct {
	client *Client
}

// CreateConversation creates a new conversation
func (r *ChatResource) CreateConversation(ctx context.Context, data map[string]interface{}) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/chat/conversations", data, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// SendMessage sends a message in a conversation
func (r *ChatResource) SendMessage(ctx context.Context, conversationID string, data map[string]interface{}) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "POST", "/chat/conversations/"+conversationID+"/messages", data, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

// GetConversation gets conversation history
func (r *ChatResource) GetConversation(ctx context.Context, conversationID string) (map[string]interface{}, *APIResponse, error) {
	var result map[string]interface{}
	response, err := r.client.Request(ctx, "GET", "/chat/conversations/"+conversationID, nil, &result)
	if err != nil {
		return nil, nil, err
	}
	return result, response, nil
}

