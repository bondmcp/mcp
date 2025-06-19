// Package bondmcp provides a Go SDK for the BondMCP health AI protocol
package bondmcp

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"golang.org/x/time/rate"
)

// Environment represents the API environment
type Environment string

const (
	Production Environment = "production"
	Staging    Environment = "staging"
)

// ModelPreference represents the AI model preference
type ModelPreference string

const (
	ModelConsensus ModelPreference = "consensus"
	ModelClaude    ModelPreference = "claude"
	ModelGPT4      ModelPreference = "gpt4"
	ModelMedLM     ModelPreference = "medlm"
)

// Config holds the client configuration
type Config struct {
	APIKey      string
	Environment Environment
	Timeout     time.Duration
	Retries     int
	RateLimit   *RateLimit
	HTTPClient  *http.Client
}

// RateLimit configuration
type RateLimit struct {
	Requests int
	Window   time.Duration
}

// Client is the main BondMCP client
type Client struct {
	config     *Config
	httpClient *http.Client
	baseURL    string
	limiter    *rate.Limiter
}

// AskRequest represents a health question request
type AskRequest struct {
	Query            string          `json:"query"`
	ConversationID   string          `json:"conversation_id,omitempty"`
	IncludeCitations bool            `json:"include_citations,omitempty"`
	ModelPreference  ModelPreference `json:"model_preference,omitempty"`
}

// AskResponse represents the response from an Ask request
type AskResponse struct {
	Answer          string     `json:"answer"`
	ConfidenceScore float64    `json:"confidence_score"`
	Citations       []Citation `json:"citations,omitempty"`
	ConversationID  string     `json:"conversation_id"`
	ModelUsed       []string   `json:"model_used"`
}

// Citation represents a source citation
type Citation struct {
	Source         string  `json:"source"`
	URL            string  `json:"url,omitempty"`
	RelevanceScore float64 `json:"relevance_score"`
}

// LabResult represents a laboratory test result
type LabResult struct {
	TestName       string  `json:"test_name"`
	Value          float64 `json:"value"`
	Unit           string  `json:"unit"`
	ReferenceRange string  `json:"reference_range"`
}

// PatientContext provides patient information for context
type PatientContext struct {
	Age            int      `json:"age,omitempty"`
	Gender         string   `json:"gender,omitempty"`
	MedicalHistory []string `json:"medical_history,omitempty"`
}

// LabInterpretRequest represents a lab interpretation request
type LabInterpretRequest struct {
	LabResults     []LabResult     `json:"lab_results"`
	PatientContext *PatientContext `json:"patient_context,omitempty"`
}

// LabInterpretResponse represents the lab interpretation response
type LabInterpretResponse struct {
	Interpretation   string      `json:"interpretation"`
	AbnormalResults  []LabResult `json:"abnormal_results"`
	Recommendations  []string    `json:"recommendations"`
	UrgencyLevel     string      `json:"urgency_level"`
}

// NewClient creates a new BondMCP client
func NewClient(config *Config) *Client {
	if config.Timeout == 0 {
		config.Timeout = 30 * time.Second
	}
	if config.Retries == 0 {
		config.Retries = 3
	}
	if config.Environment == "" {
		config.Environment = Production
	}

	httpClient := config.HTTPClient
	if httpClient == nil {
		httpClient = &http.Client{
			Timeout: config.Timeout,
		}
	}

	baseURL := "https://api.bondmcp.com"
	if config.Environment == Staging {
		baseURL = "https://api-staging.bondmcp.com"
	}

	var limiter *rate.Limiter
	if config.RateLimit != nil {
		limiter = rate.NewLimiter(
			rate.Every(config.RateLimit.Window/time.Duration(config.RateLimit.Requests)),
			config.RateLimit.Requests,
		)
	}

	return &Client{
		config:     config,
		httpClient: httpClient,
		baseURL:    baseURL,
		limiter:    limiter,
	}
}

// Ask sends a health question to the BondMCP API
func (c *Client) Ask(ctx context.Context, req *AskRequest) (*AskResponse, error) {
	var response AskResponse
	err := c.makeRequest(ctx, "POST", "/ask", req, &response)
	return &response, err
}

// Labs provides access to laboratory interpretation services
func (c *Client) Labs() *LabsService {
	return &LabsService{client: c}
}

// LabsService handles laboratory-related operations
type LabsService struct {
	client *Client
}

// Interpret interprets laboratory results
func (ls *LabsService) Interpret(ctx context.Context, req *LabInterpretRequest) (*LabInterpretResponse, error) {
	var response LabInterpretResponse
	err := ls.client.makeRequest(ctx, "POST", "/labs/interpret", req, &response)
	return &response, err
}

// makeRequest performs an HTTP request with retry logic
func (c *Client) makeRequest(ctx context.Context, method, endpoint string, reqBody, respBody interface{}) error {
	// Apply rate limiting
	if c.limiter != nil {
		if err := c.limiter.Wait(ctx); err != nil {
			return fmt.Errorf("rate limit wait failed: %w", err)
		}
	}

	url := c.baseURL + endpoint

	var body io.Reader
	if reqBody != nil {
		jsonData, err := json.Marshal(reqBody)
		if err != nil {
			return fmt.Errorf("failed to marshal request: %w", err)
		}
		body = bytes.NewReader(jsonData)
	}

	req, err := http.NewRequestWithContext(ctx, method, url, body)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.config.APIKey)
	req.Header.Set("User-Agent", "BondMCP-Go-SDK/1.0.0")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("HTTP %d: %s", resp.StatusCode, resp.Status)
	}

	if respBody != nil {
		if err := json.NewDecoder(resp.Body).Decode(respBody); err != nil {
			return fmt.Errorf("failed to decode response: %w", err)
		}
	}

	return nil
}

