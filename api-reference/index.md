# BondMCP API Reference

This document provides a comprehensive reference for the BondMCP API. It details the available endpoints, authentication methods, request/response formats, error handling, rate limiting, and key architectural concepts.

## Overview

BondMCP (Model Context Protocol) is a sophisticated API designed for **health data integration and leveraging advanced AI insights**. It serves as a secure and efficient backend for processing sensitive health-related information, supporting various tool integrations, and providing a robust platform for developing next-generation health applications. The core AI capabilities are powered by **a state-of-the-art AI service**, granting access to a suite of advanced foundation models, including those specifically tuned for the **medical domain**.

BondMCP aims to simplify the development of applications that require deep understanding and processing of complex health data by abstracting the complexities of direct model management and providing a unified interface for various health-specific tasks.

## Key Features & Use Cases

BondMCP is engineered to support a wide array of applications in the healthcare and life sciences sectors. Key features include:

*   **Secure API Access:** All sensitive endpoints are protected via API key authentication.
*   **Advanced AI for Health:** Leverages powerful AI models, including medical-specific models, for tasks like natural language understanding, generation, and summarization of health data.
*   **Extensible Tool Framework:** The `/tools/call` endpoint allows for the integration and execution of specialized data processing and analytical tools relevant to healthcare (e.g., FHIR data processing, medical image metadata extraction, device data ingestion).
*   **Scalable Infrastructure:** Built on a robust and scalable cloud infrastructure, ensuring reliability and high availability.

**Primary Use Cases:**

*   **Clinical Document Analysis:** Analyzing and summarizing electronic health records (EHRs), discharge summaries, clinical notes, and pathology reports to extract key information, identify trends, or support clinical decision-making.
*   **Medical Information Retrieval:** Answering complex questions based on provided medical texts or querying structured medical knowledge bases.
*   **Lab Result Interpretation Support:** Assisting in the interpretation of lab results by identifying abnormal values, potential implications, and relevant medical literature (always for informational support, not as a diagnostic tool itself).
*   **Personalized Health Insights:** Generating insights from patient-generated health data (PGHD) from wearables and medical devices to support personalized care plans or patient engagement.
*   **Intelligent Health Chatbots:** Powering conversational AI applications for patient support, medical education, or preliminary information gathering (not for diagnosis or treatment advice).
*   **Pharmacovigilance:** Assisting in monitoring and analyzing adverse drug event reports or medical literature for drug safety insights.
*   **Research Acceleration:** Facilitating medical research by structuring unstructured medical text, identifying cohorts, or summarizing large volumes of research papers.

## Authentication

The BondMCP API uses API keys for authentication. Clients must include an API key in the `X-API-Key` header with each request to protected endpoints.

**Example:**
```
X-API-Key: YOUR_API_KEY
```

If the API key is missing or invalid, the API will respond with a `401 Unauthorized` or `403 Forbidden` error, respectively. API keys can be obtained and managed through the BondMCP developer portal at `api.bondmcp.com`.

## API Endpoints

### Health Check

Provides the operational status of the API and its core dependencies.

*   **Endpoint:** `GET /health`
*   **Authentication:** None
*   **Description:** Returns the current health status of the API, including its version, timestamp, operational environment, and the status of critical connected services such as the underlying AI model infrastructure and caching mechanisms.
*   **Response Body (`HealthResponse`):**
    ```json
    {
        "status": "healthy",
        "version": "0.1.0",
        "timestamp": "2024-05-14T10:00:00.000Z",
        "environment": "production",
        "services": {
            "llm": "healthy",
            "redis": "healthy",
            "database": "not_configured"
        }
    }
    ```
    *   `status` (string): Overall status of the API (e.g., "healthy", "degraded").
    *   `version` (string): Current API version.
    *   `timestamp` (string): ISO 8601 timestamp of the health check.
    *   `environment` (string): Deployment environment (e.g., "development", "production").
    *   `services` (object): Status of key dependent services.
        *   `llm` (string): Status of the AI model service.
        *   `redis` (string): Status of the caching service connection.
        *   `database` (string): Status of the primary database connection (if configured and applicable).

### Tool Calling

Allows for the execution of registered, specialized tools within the BondMCP framework. This endpoint is designed to integrate various functions critical for health data processing, such as interacting with specific medical device data formats, performing complex calculations based on medical formulas, or manipulating FHIR resources.

*   **Endpoint:** `POST /tools/call`
*   **Authentication:** API Key required (`X-API-Key` header).
*   **Description:** Dispatches a request to a specified tool with given arguments and context. This is a generic endpoint for interacting with various integrated functionalities tailored for health data workflows.
*   **Request Body (`ToolCallRequest`):**
    ```json
    {
        "tool_name": "calculate_bmi",
        "arguments": {
            "height_cm": 175,
            "weight_kg": 70
        },
        "context": {
            "patient_id": "pat_zyx987",
            "encounter_id": "enc_uvw654"
        }
    }
    ```
    *   `tool_name` (string, required): The unique name of the tool to be called (e.g., `dexcom_data_ingestor`, `summarize_clinical_notes`, `fhir_resource_validator`).
    *   `arguments` (object, required): A dictionary of arguments to be passed to the tool, specific to the tool's defined requirements.
    *   `context` (object, optional): Additional contextual information for the tool call, such as patient identifiers, user session data, or organizational context.
*   **Response Body (`ToolCallResponse`):**
    ```json
    {
        "request_id": "req_20240514100500_abcdef12",
        "result": {
            "bmi": 22.86,
            "category": "Normal weight"
        },
        "error": null
    }
    ```
    Or in case of an error:
    ```json
    {
        "request_id": "req_20240514100500_abcdef12",
        "result": null,
        "error": {
            "type": "ToolExecutionError",
            "message": "The tool 'calculate_bmi' failed due to missing 'height_cm' argument.",
            "details": {"missing_argument": "height_cm"}
        }
    }
    ```
    *   `request_id` (string): A unique identifier for the request.
    *   `result` (any, optional): The result produced by the tool. The structure is tool-dependent. Null if an error occurred.
    *   `error` (object, optional): Details of the error if the tool call failed. Null if successful. This object is derived from the internal error data model and typically includes:
        *   `type` (string): The type of error (e.g., `ToolNotFound`, `ValidationError`, `ToolExecutionError`, `UpstreamServiceError`).
        *   `message` (string): A human-readable error message.
        *   `details` (object, optional): Additional error-specific details.

### LLM Interaction

Provides direct access to advanced Large Language Models (LLMs), specifically optimized for various AI-driven health tasks. BondMCP internally manages the selection and configuration of the most appropriate AI models, including **specialized medical foundation models**, based on the nature of the prompt and the intended task, ensuring optimal performance and relevance for healthcare scenarios.

*   **Endpoint:** `POST /llm/ask`
*   **Authentication:** API Key required (`X-API-Key` header).
*   **Description:** Sends a prompt to the BondMCP's AI model service, which intelligently routes the request to the appropriate underlying model. This endpoint is suitable for tasks like generating summaries from complex medical texts, answering clinical questions (based on provided context within the prompt), drafting patient-facing communication, or extracting structured information from unstructured notes.
*   **Request Body (`LLMRequest`):**
    ```json
    {
        "prompt": "Extract all medications, dosages, and frequencies mentioned in the following clinical note: [Paste clinical note text here]. Also, identify any potential adverse drug events mentioned."
    }
    ```
    *   `prompt` (string, required): The input prompt for the AI model. This should be detailed and provide sufficient context for the health-related task. For best results, structure prompts clearly and specify the desired output format if applicable.
*   **Response Body (`LLMResponse`):**
    ```json
    {
        "request_id": "llm_20240514101000_fedcba98",
        "response": "Medications extracted: Amoxicillin 500mg TID, Lisinopril 10mg QD. No adverse drug events mentioned.",
        "model": "internal_health_optimized_ensemble",
        "timestamp": "2024-05-14T10:10:05.000Z",
        "metadata": {
            "processing_time_ms": 1850,
            "input_tokens": 210,
            "output_tokens": 45,
            "confidence_score": 0.92 // Example metadata, actual fields may vary
        }
    }
    ```
    *   `request_id` (string): A unique identifier for the LLM request.
    *   `response` (string): The generated response from the AI model.
    *   `model` (string): An abstracted identifier for the internal model configuration used (e.g., "internal_health_optimized_ensemble"). Specific model details are not exposed.
    *   `timestamp` (string): ISO 8601 timestamp of when the response was generated.
    *   `metadata` (object, optional): Additional metadata about the response, such as processing time or token counts. The exact fields in metadata are subject to change and should be treated as informational.

## SDKs and Client Libraries: Usage and Installation

Official Software Development Kits (SDKs) for popular programming languages (such as Python and JavaScript) are currently under active development. These SDKs will aim to simplify your integration with the BondMCP API by providing convenient wrappers for authentication, request construction, and response handling.

**Current Integration Method: Direct HTTP Requests**

Until the official SDKs are released, you can interact with the BondMCP API by making direct HTTPS requests using any standard HTTP client library available in your chosen programming language (e.g., `requests` in Python, `axios` in JavaScript, or `curl` from the command line).

**Key considerations for direct HTTP integration:**

1.  **Base URL:** All API endpoints are relative to `https://api.bondmcp.com`.
2.  **Headers:** 
    *   For `POST` requests with a JSON body, ensure you set the `Content-Type` header to `application/json`.
    *   For all authenticated endpoints (`/tools/call`, `/llm/ask`), you must include the `X-API-Key` header with your valid API key.
3.  **Request Body:** Construct the JSON request body according to the specifications for each endpoint.
4.  **Response Handling:** Parse the JSON response from the API. Check the HTTP status code to determine success or failure and handle errors appropriately (see Error Handling section).

**Installation:**

As you are making direct HTTP calls, there is no specific BondMCP client library to install at this time. You will use the standard HTTP client library that comes with your programming language or one that you install via your language's package manager (e.g., `pip install requests` for Python, `npm install axios` for Node.js).

**Example using cURL for `/llm/ask`:**

```bash
curl -X POST "https://api.bondmcp.com/llm/ask" \
     -H "Content-Type: application/json" \
     -H "X-API-Key: YOUR_API_KEY" \
     -d 
{
    "prompt": "What are the current guideline-recommended screening procedures for colorectal cancer in average-risk adults aged 45-75?"
}

```

Updates regarding SDK availability and installation instructions will be posted on the BondMCP developer portal (`api.bondmcp.com`).

## MCP (Model Context Protocol) Setup and Integration

The BondMCP API itself embodies the Model Context Protocol. "MCP" is not a separate piece of software that you need to install on your systems. Instead, it refers to the architectural principles and the set of API contracts that define how your client applications interact with the BondMCP platform to leverage its contextual understanding and tool-using capabilities.

**Integrating with BondMCP (as an MCP client) involves the following steps:**

1.  **Registration and API Key Retrieval:** Sign up on the BondMCP developer portal (`api.bondmcp.com`) to obtain your unique API key. This key is essential for authenticating your requests.
2.  **Understanding the API Endpoints:** Thoroughly review this API reference documentation to understand the available endpoints (`/health`, `/tools/call`, `/llm/ask`), their purposes, expected request parameters, and response structures.
3.  **Implementing API Calls in Your Application:** Using your preferred programming language and HTTP client library (as discussed in the SDK section), write code to make HTTPS requests to the BondMCP API endpoints. Remember to include the `X-API-Key` header for all authenticated calls.
4.  **Processing API Responses:** Implement logic in your application to handle the JSON responses received from the API. This includes parsing successful results for use in your application and gracefully managing potential errors based on HTTP status codes and error messages (see Error Handling section).
5.  **Utilizing Tools via `/tools/call` (if applicable):** If your application needs to leverage specialized functionalities, you will use the `/tools/call` endpoint. Information about available tools, their specific functionalities, and required arguments will be provided in the developer portal or through a future API discovery mechanism. You will then construct your requests to the `/tools/call` endpoint accordingly.

In essence, setting up and integrating with BondMCP means developing your client application to communicate effectively with its HTTP API as per the specifications outlined in this document.

## Platform Architecture (High-Level)

The BondMCP platform is architected using a modern, scalable cloud infrastructure to ensure reliability, security, and high performance. As an API user, you interact with the abstracted BondMCP endpoints, not directly with the underlying infrastructure components. The platform handles aspects such as request routing, AI model invocation, tool execution, caching, and security internally.

## Pydantic Models Reference

These are the Pydantic models used internally by the API for request and response validation and serialization. Understanding these can be helpful for anticipating data structures.

### `HealthResponse`

```python
class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    environment: str
    services: Dict[str, str]
```

### `ToolCallRequest`

```python
class ToolCallRequest(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]
    context: Optional[Dict[str, Any]] = None
```

### `ToolCallResponse`

```python
class ToolCallResponse(BaseModel):
    request_id: str
    result: Optional[Any] = None
    error: Optional[Dict[str, Any]] = None # Based on internal error data model, serialized to dict
```

### `LLMRequest` (Public Facing API Contract)

```python
class LLMRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="The prompt to send to the AI model service.")
    # Note: Internal parameters like specific model names, temperature, or caching strategies
    # are managed by BondMCP and are not exposed via the API.
```

### `LLMResponse`

```python
class LLMResponse(BaseModel):
    request_id: str
    response: str
    model: str # Abstracted identifier for the AI model/configuration used by BondMCP
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of an API request. The body of an error response will typically contain a JSON object with an `error` key providing a descriptive message.

**Common HTTP Status Codes:**

*   `200 OK`: The request was successful.
*   `400 Bad Request`: The server could not understand the request due to invalid syntax, missing parameters, or other client-side errors. The error response body will often contain more specific details about the validation failure.
*   `401 Unauthorized`: Authentication is required and has failed or has not yet been provided. Ensure your `X-API-Key` header is present and contains a valid API key.
*   `403 Forbidden`: Authentication was provided, but the authenticated user (identified by the API key) does not have permission to perform the requested operation or access the resource. This can occur with an invalid, revoked, or insufficiently permissioned API key.
*   `404 Not Found`: The requested resource or API endpoint could not be found on the server.
*   `429 Too Many Requests`: The client has sent too many requests in a given amount of time, exceeding the allocated rate limits for the API key. See the Rate Limiting section for more details.
*   `500 Internal Server Error`: An unexpected condition was encountered on the server that prevented it from fulfilling the request. This usually indicates an issue with the server-side code or an unhandled exception within BondMCP.
*   `503 Service Unavailable`: The server is currently unable to handle the request due to temporary overloading or maintenance of a downstream service. It is advisable to retry the request after a short delay.

**Example Error Response (e.g., for a 400 Bad Request):**
```json
{
    "error": "Request validation error: 'prompt' field is required and cannot be empty."
}
```

For the `/tools/call` endpoint, if the tool execution itself encounters an error (after successful authentication and initial request validation), the HTTP status code will typically still be `200 OK`, but the `error` field in the `ToolCallResponse` body will be populated with details of the tool-specific error, as described in its section.

## Rate Limiting

To ensure fair usage, protect the service from abuse, and maintain stability for all users, the BondMCP API enforces rate limits. These limits define the number of requests an API key can make within a specific time window (e.g., requests per second, requests per minute).

If you exceed the rate limit for your API key, the API will respond with an HTTP `429 Too Many Requests` status code. The response may also include a `Retry-After` header indicating how many seconds to wait before making a new request. Some responses might also include custom headers detailing current limit status (e.g., `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`).

Specific rate limit details for your API key and subscription plan can be found in the BondMCP developer portal (`api.bondmcp.com`) or in your service agreement. It is crucial to implement client-side logic to handle `429` responses gracefully, typically by employing an exponential backoff strategy for retries to avoid overwhelming the API.

