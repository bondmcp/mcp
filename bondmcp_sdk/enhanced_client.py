"""
Enhanced BondMCP Python SDK with async support, comprehensive error handling, and advanced features.
"""

import asyncio
import json
import time
from typing import Dict, List, Optional, Union, Any, Callable
from dataclasses import dataclass
from enum import Enum
import logging

try:
    import requests
    import aiohttp
except ImportError:
    raise ImportError("Please install required dependencies: pip install requests aiohttp")

# Configure logging
logger = logging.getLogger(__name__)


class BondMCPError(Exception):
    """Base exception for BondMCP SDK errors."""
    pass


class AuthenticationError(BondMCPError):
    """Raised when API key is invalid or missing."""
    pass


class RateLimitError(BondMCPError):
    """Raised when rate limit is exceeded."""
    pass


class ValidationError(BondMCPError):
    """Raised when request validation fails."""
    pass


class APIError(BondMCPError):
    """Raised when API returns an error response."""
    def __init__(self, message: str, status_code: int = None, response_data: Dict = None):
        super().__init__(message)
        self.status_code = status_code
        self.response_data = response_data


@dataclass
class APIResponse:
    """Structured API response with metadata."""
    data: Any
    status_code: int
    headers: Dict[str, str]
    response_time: float
    request_id: Optional[str] = None
    
    @property
    def success(self) -> bool:
        return 200 <= self.status_code < 300


class ModelPreference(Enum):
    """Available model preferences for AI requests."""
    CONSENSUS = "consensus"
    CLAUDE = "claude"
    GPT4 = "gpt4"
    MEDLM = "medlm"


class UserTier(Enum):
    """Available user tiers."""
    DEVELOPER = "Developer+"
    PROFESSIONAL = "Professional+"
    ENTERPRISE = "Enterprise+"
    CLINICAL = "Clinical+"


class EnhancedBondMCPClient:
    """Enhanced BondMCP API client with async support and advanced features."""
    
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.bondmcp.com",
        timeout: int = 30,
        max_retries: int = 3,
        retry_delay: float = 1.0,
        enable_logging: bool = False,
        user_tier: UserTier = UserTier.DEVELOPER
    ):
        """
        Initialize the enhanced BondMCP API client.

        Args:
            api_key: Your BondMCP API key
            base_url: The base URL for the BondMCP API
            timeout: Request timeout in seconds
            max_retries: Maximum number of retry attempts
            retry_delay: Delay between retry attempts in seconds
            enable_logging: Enable detailed logging
            user_tier: User tier for endpoint access control
        """
        if not api_key:
            raise AuthenticationError("API key is required")
        
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.user_tier = user_tier
        
        if enable_logging:
            logging.basicConfig(level=logging.INFO)
        
        # Initialize session for connection pooling
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'BondMCP-Python-SDK/2.0.0'
        })
        
        # Initialize async session (will be created when needed)
        self._async_session = None
        
        # Initialize API resources
        self.health = HealthResource(self)
        self.labs = LabsResource(self)
        self.supplements = SupplementsResource(self)
        self.wearables = WearablesResource(self)
        self.medical_records = MedicalRecordsResource(self)
        self.ask = AskResource(self)
        self.insights = InsightsResource(self)
        self.api_keys = APIKeysResource(self)
        self.payments = PaymentsResource(self)
        self.orchestrate = OrchestrateResource(self)
        self.tools = ToolsResource(self)
        self.imports = ImportResource(self)
        self.chat = ChatResource(self)
        
        # Usage tracking
        self.request_count = 0
        self.total_cost = 0.0
        
    async def _get_async_session(self) -> aiohttp.ClientSession:
        """Get or create async session."""
        if self._async_session is None or self._async_session.closed:
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
                'User-Agent': 'BondMCP-Python-SDK/2.0.0'
            }
            timeout = aiohttp.ClientTimeout(total=self.timeout)
            self._async_session = aiohttp.ClientSession(
                headers=headers,
                timeout=timeout
            )
        return self._async_session
    
    def _handle_response(self, response: requests.Response, start_time: float) -> APIResponse:
        """Handle and validate API response."""
        response_time = time.time() - start_time
        
        # Extract request ID if available
        request_id = response.headers.get('X-Request-ID')
        
        # Create structured response
        api_response = APIResponse(
            data=None,
            status_code=response.status_code,
            headers=dict(response.headers),
            response_time=response_time,
            request_id=request_id
        )
        
        # Handle different status codes
        if response.status_code == 401:
            raise AuthenticationError("Invalid API key")
        elif response.status_code == 429:
            raise RateLimitError("Rate limit exceeded")
        elif response.status_code == 422:
            raise ValidationError(f"Validation error: {response.text}")
        elif not api_response.success:
            try:
                error_data = response.json()
                raise APIError(
                    error_data.get('message', 'API request failed'),
                    response.status_code,
                    error_data
                )
            except json.JSONDecodeError:
                raise APIError(f"API request failed: {response.text}", response.status_code)
        
        # Parse response data
        try:
            api_response.data = response.json()
        except json.JSONDecodeError:
            api_response.data = response.text
        
        return api_response
    
    def request(
        self,
        method: str,
        path: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None,
        **kwargs
    ) -> APIResponse:
        """
        Make a synchronous API request with retry logic.
        
        Args:
            method: HTTP method (GET, POST, etc.)
            path: API endpoint path
            data: Request body data
            params: Query parameters
            **kwargs: Additional request parameters
            
        Returns:
            APIResponse object with structured response data
        """
        url = f"{self.base_url}{path}"
        
        for attempt in range(self.max_retries + 1):
            try:
                start_time = time.time()
                
                logger.info(f"Making {method} request to {path} (attempt {attempt + 1})")
                
                response = self.session.request(
                    method=method,
                    url=url,
                    json=data,
                    params=params,
                    timeout=self.timeout,
                    **kwargs
                )
                
                api_response = self._handle_response(response, start_time)
                
                # Update usage tracking
                self.request_count += 1
                
                logger.info(f"Request completed in {api_response.response_time:.2f}s")
                
                return api_response
                
            except (requests.RequestException, APIError) as e:
                if attempt == self.max_retries:
                    logger.error(f"Request failed after {self.max_retries + 1} attempts: {e}")
                    raise
                
                logger.warning(f"Request attempt {attempt + 1} failed: {e}. Retrying in {self.retry_delay}s...")
                time.sleep(self.retry_delay * (2 ** attempt))  # Exponential backoff
    
    async def async_request(
        self,
        method: str,
        path: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None,
        **kwargs
    ) -> APIResponse:
        """
        Make an asynchronous API request with retry logic.
        
        Args:
            method: HTTP method (GET, POST, etc.)
            path: API endpoint path
            data: Request body data
            params: Query parameters
            **kwargs: Additional request parameters
            
        Returns:
            APIResponse object with structured response data
        """
        url = f"{self.base_url}{path}"
        session = await self._get_async_session()
        
        for attempt in range(self.max_retries + 1):
            try:
                start_time = time.time()
                
                logger.info(f"Making async {method} request to {path} (attempt {attempt + 1})")
                
                async with session.request(
                    method=method,
                    url=url,
                    json=data,
                    params=params,
                    **kwargs
                ) as response:
                    response_time = time.time() - start_time
                    request_id = response.headers.get('X-Request-ID')
                    
                    # Create structured response
                    api_response = APIResponse(
                        data=None,
                        status_code=response.status,
                        headers=dict(response.headers),
                        response_time=response_time,
                        request_id=request_id
                    )
                    
                    # Handle errors
                    if response.status == 401:
                        raise AuthenticationError("Invalid API key")
                    elif response.status == 429:
                        raise RateLimitError("Rate limit exceeded")
                    elif response.status == 422:
                        text = await response.text()
                        raise ValidationError(f"Validation error: {text}")
                    elif not api_response.success:
                        try:
                            error_data = await response.json()
                            raise APIError(
                                error_data.get('message', 'API request failed'),
                                response.status,
                                error_data
                            )
                        except:
                            text = await response.text()
                            raise APIError(f"API request failed: {text}", response.status)
                    
                    # Parse response data
                    try:
                        api_response.data = await response.json()
                    except:
                        api_response.data = await response.text()
                    
                    # Update usage tracking
                    self.request_count += 1
                    
                    logger.info(f"Async request completed in {api_response.response_time:.2f}s")
                    
                    return api_response
                    
            except (aiohttp.ClientError, APIError) as e:
                if attempt == self.max_retries:
                    logger.error(f"Async request failed after {self.max_retries + 1} attempts: {e}")
                    raise
                
                logger.warning(f"Async request attempt {attempt + 1} failed: {e}. Retrying in {self.retry_delay}s...")
                await asyncio.sleep(self.retry_delay * (2 ** attempt))  # Exponential backoff
    
    def get_usage_stats(self) -> Dict[str, Any]:
        """Get client usage statistics."""
        return {
            'request_count': self.request_count,
            'total_cost': self.total_cost,
            'user_tier': self.user_tier.value,
            'base_url': self.base_url
        }
    
    def close(self):
        """Close the client and cleanup resources."""
        if self.session:
            self.session.close()
    
    async def aclose(self):
        """Close the async client and cleanup resources."""
        if self._async_session and not self._async_session.closed:
            await self._async_session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.aclose()


# Resource classes with enhanced functionality
class BaseResource:
    """Base class for API resources."""
    
    def __init__(self, client: EnhancedBondMCPClient):
        self.client = client


class HealthResource(BaseResource):
    """Health-related API endpoints."""
    
    def check(self) -> APIResponse:
        """Check API health status."""
        return self.client.request('GET', '/health')
    
    async def async_check(self) -> APIResponse:
        """Async check API health status."""
        return await self.client.async_request('GET', '/health')


class AskResource(BaseResource):
    """AI question answering endpoints."""
    
    def query(
        self,
        prompt: str,
        context: Optional[str] = None,
        conversation_id: Optional[str] = None,
        include_citations: bool = True,
        model_preference: ModelPreference = ModelPreference.CONSENSUS
    ) -> APIResponse:
        """
        Ask a health-related question to the AI.
        
        Args:
            prompt: The health question to ask
            context: Optional context for the question
            conversation_id: Optional conversation ID for context
            include_citations: Whether to include medical citations
            model_preference: Preferred AI model for response
            
        Returns:
            APIResponse with AI answer and metadata
        """
        data = {
            'prompt': prompt,
            'include_citations': include_citations,
            'model_preference': model_preference.value
        }
        
        if context:
            data['context'] = context
        if conversation_id:
            data['conversation_id'] = conversation_id
        
        return self.client.request('POST', '/ask', data=data)
    
    async def async_query(
        self,
        prompt: str,
        context: Optional[str] = None,
        conversation_id: Optional[str] = None,
        include_citations: bool = True,
        model_preference: ModelPreference = ModelPreference.CONSENSUS
    ) -> APIResponse:
        """Async version of query method."""
        data = {
            'prompt': prompt,
            'include_citations': include_citations,
            'model_preference': model_preference.value
        }
        
        if context:
            data['context'] = context
        if conversation_id:
            data['conversation_id'] = conversation_id
        
        return await self.client.async_request('POST', '/ask', data=data)


class LabsResource(BaseResource):
    """Lab result interpretation endpoints."""
    
    def interpret(
        self,
        lab_results: Dict[str, Any],
        patient_context: Optional[str] = None,
        include_recommendations: bool = True
    ) -> APIResponse:
        """
        Interpret lab results with AI analysis.
        
        Args:
            lab_results: Dictionary of lab test results
            patient_context: Optional patient context
            include_recommendations: Whether to include recommendations
            
        Returns:
            APIResponse with lab interpretation and recommendations
        """
        data = {
            'lab_results': lab_results,
            'include_recommendations': include_recommendations
        }
        
        if patient_context:
            data['patient_context'] = patient_context
        
        return self.client.request('POST', '/labs/interpret', data=data)
    
    async def async_interpret(
        self,
        lab_results: Dict[str, Any],
        patient_context: Optional[str] = None,
        include_recommendations: bool = True
    ) -> APIResponse:
        """Async version of interpret method."""
        data = {
            'lab_results': lab_results,
            'include_recommendations': include_recommendations
        }
        
        if patient_context:
            data['patient_context'] = patient_context
        
        return await self.client.async_request('POST', '/labs/interpret', data=data)


class SupplementsResource(BaseResource):
    """Supplement recommendation and interaction endpoints."""
    
    def recommend(
        self,
        health_goals: List[str],
        current_supplements: Optional[List[str]] = None,
        dietary_restrictions: Optional[List[str]] = None,
        age: Optional[int] = None,
        gender: Optional[str] = None
    ) -> APIResponse:
        """
        Get personalized supplement recommendations.
        
        Args:
            health_goals: List of health goals
            current_supplements: Currently taken supplements
            dietary_restrictions: Dietary restrictions
            age: Patient age
            gender: Patient gender
            
        Returns:
            APIResponse with supplement recommendations
        """
        data = {
            'health_goals': health_goals
        }
        
        if current_supplements:
            data['current_supplements'] = current_supplements
        if dietary_restrictions:
            data['dietary_restrictions'] = dietary_restrictions
        if age:
            data['age'] = age
        if gender:
            data['gender'] = gender
        
        return self.client.request('POST', '/supplement/recommend', data=data)
    
    def check_interactions(
        self,
        supplements: List[str],
        medications: Optional[List[str]] = None,
        dosages: Optional[Dict[str, str]] = None
    ) -> APIResponse:
        """
        Check for supplement-drug interactions.
        
        Args:
            supplements: List of supplements to check
            medications: List of current medications
            dosages: Dosage information
            
        Returns:
            APIResponse with interaction analysis
        """
        data = {
            'supplements': supplements
        }
        
        if medications:
            data['medications'] = medications
        if dosages:
            data['dosages'] = dosages
        
        return self.client.request('POST', '/supplement/interactions', data=data)


class WearablesResource(BaseResource):
    """Wearable device data analysis endpoints."""
    
    def analyze_data(
        self,
        wearable_data: Dict[str, Any],
        timeframe: str = 'week',
        metrics: Optional[List[str]] = None
    ) -> APIResponse:
        """
        Analyze wearable device data for health insights.
        
        Args:
            wearable_data: Wearable device data
            timeframe: Analysis timeframe (day, week, month)
            metrics: Specific metrics to analyze
            
        Returns:
            APIResponse with health insights and recommendations
        """
        data = {
            'wearable_data': wearable_data,
            'timeframe': timeframe
        }
        
        if metrics:
            data['metrics'] = metrics
        
        return self.client.request('POST', '/v1/wearable-data-insights', data=data)


class MedicalRecordsResource(BaseResource):
    """Medical records management endpoints."""
    
    def upload(
        self,
        record_type: str,
        record_data: Dict[str, Any],
        patient_id: Optional[str] = None
    ) -> APIResponse:
        """
        Upload medical record data.
        
        Args:
            record_type: Type of medical record
            record_data: Record data
            patient_id: Optional patient identifier
            
        Returns:
            APIResponse with upload confirmation
        """
        data = {
            'record_type': record_type,
            'record_data': record_data
        }
        
        if patient_id:
            data['patient_id'] = patient_id
        
        return self.client.request('POST', '/medical-records/upload', data=data)


class InsightsResource(BaseResource):
    """Health insights and analytics endpoints."""
    
    def generate(
        self,
        data_sources: List[str],
        analysis_type: str = 'comprehensive',
        timeframe: str = 'month'
    ) -> APIResponse:
        """
        Generate health insights from multiple data sources.
        
        Args:
            data_sources: List of data sources to analyze
            analysis_type: Type of analysis to perform
            timeframe: Analysis timeframe
            
        Returns:
            APIResponse with generated insights
        """
        data = {
            'data_sources': data_sources,
            'analysis_type': analysis_type,
            'timeframe': timeframe
        }
        
        return self.client.request('POST', '/insights/generate', data=data)


class APIKeysResource(BaseResource):
    """API key management endpoints."""
    
    def list(self) -> APIResponse:
        """List all API keys for the account."""
        return self.client.request('GET', '/api-keys')
    
    def create(
        self,
        name: str,
        scopes: Optional[List[str]] = None,
        expires_at: Optional[str] = None
    ) -> APIResponse:
        """
        Create a new API key.
        
        Args:
            name: Name for the API key
            scopes: List of scopes for the key
            expires_at: Expiration date (ISO format)
            
        Returns:
            APIResponse with new API key details
        """
        data = {
            'name': name
        }
        
        if scopes:
            data['scopes'] = scopes
        if expires_at:
            data['expires_at'] = expires_at
        
        return self.client.request('POST', '/api-keys', data=data)
    
    def revoke(self, key_id: str) -> APIResponse:
        """
        Revoke an API key.
        
        Args:
            key_id: ID of the key to revoke
            
        Returns:
            APIResponse with revocation confirmation
        """
        return self.client.request('DELETE', f'/api-keys/{key_id}')


class PaymentsResource(BaseResource):
    """Payment and billing endpoints."""
    
    def get_usage(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> APIResponse:
        """
        Get usage and billing information.
        
        Args:
            start_date: Start date for usage query (ISO format)
            end_date: End date for usage query (ISO format)
            
        Returns:
            APIResponse with usage and billing data
        """
        params = {}
        if start_date:
            params['start_date'] = start_date
        if end_date:
            params['end_date'] = end_date
        
        return self.client.request('GET', '/payments/usage', params=params)


class OrchestrateResource(BaseResource):
    """Workflow orchestration endpoints."""
    
    def run_workflow(
        self,
        workflow_id: str,
        input_data: Dict[str, Any],
        async_execution: bool = False
    ) -> APIResponse:
        """
        Run a predefined workflow.
        
        Args:
            workflow_id: ID of the workflow to run
            input_data: Input data for the workflow
            async_execution: Whether to run asynchronously
            
        Returns:
            APIResponse with workflow results
        """
        data = {
            'workflow_id': workflow_id,
            'input_data': input_data,
            'async_execution': async_execution
        }
        
        return self.client.request('POST', '/orchestrate/run', data=data)


class ToolsResource(BaseResource):
    """AI tools and utilities endpoints."""
    
    def list_available(self) -> APIResponse:
        """List available AI tools."""
        return self.client.request('GET', '/tools/available')
    
    def execute_tool(
        self,
        tool_name: str,
        parameters: Dict[str, Any]
    ) -> APIResponse:
        """
        Execute a specific AI tool.
        
        Args:
            tool_name: Name of the tool to execute
            parameters: Tool parameters
            
        Returns:
            APIResponse with tool execution results
        """
        data = {
            'tool_name': tool_name,
            'parameters': parameters
        }
        
        return self.client.request('POST', '/tools/execute', data=data)


class ImportResource(BaseResource):
    """Data import endpoints."""
    
    def oura(
        self,
        oura_token: str,
        date_range: Optional[Dict[str, str]] = None
    ) -> APIResponse:
        """
        Import data from Oura ring.
        
        Args:
            oura_token: Oura API access token
            date_range: Date range for import
            
        Returns:
            APIResponse with import results
        """
        data = {
            'oura_token': oura_token
        }
        
        if date_range:
            data['date_range'] = date_range
        
        return self.client.request('POST', '/import/oura', data=data)
    
    def apple_health(
        self,
        health_data: Dict[str, Any],
        data_types: Optional[List[str]] = None
    ) -> APIResponse:
        """
        Import Apple Health data.
        
        Args:
            health_data: Apple Health data export
            data_types: Specific data types to import
            
        Returns:
            APIResponse with import results
        """
        data = {
            'health_data': health_data
        }
        
        if data_types:
            data['data_types'] = data_types
        
        return self.client.request('POST', '/import/apple-health', data=data)


class ChatResource(BaseResource):
    """Chat and conversation endpoints."""
    
    def create_conversation(
        self,
        initial_message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> APIResponse:
        """
        Create a new conversation.
        
        Args:
            initial_message: First message in the conversation
            context: Optional conversation context
            
        Returns:
            APIResponse with conversation details
        """
        data = {
            'initial_message': initial_message
        }
        
        if context:
            data['context'] = context
        
        return self.client.request('POST', '/chat/conversations', data=data)
    
    def send_message(
        self,
        conversation_id: str,
        message: str,
        message_type: str = 'user'
    ) -> APIResponse:
        """
        Send a message in an existing conversation.
        
        Args:
            conversation_id: ID of the conversation
            message: Message content
            message_type: Type of message (user, system)
            
        Returns:
            APIResponse with AI response
        """
        data = {
            'message': message,
            'message_type': message_type
        }
        
        return self.client.request('POST', f'/chat/conversations/{conversation_id}/messages', data=data)
    
    def get_conversation(self, conversation_id: str) -> APIResponse:
        """
        Get conversation history.
        
        Args:
            conversation_id: ID of the conversation
            
        Returns:
            APIResponse with conversation history
        """
        return self.client.request('GET', f'/chat/conversations/{conversation_id}')


# Convenience aliases for backward compatibility
BondMCPClient = EnhancedBondMCPClient
Client = EnhancedBondMCPClient

# Export main classes and exceptions
__all__ = [
    'EnhancedBondMCPClient',
    'BondMCPClient', 
    'Client',
    'APIResponse',
    'BondMCPError',
    'AuthenticationError',
    'RateLimitError',
    'ValidationError',
    'APIError',
    'ModelPreference',
    'UserTier'
]



# Webhook Management Extensions for Enhanced BondMCP Client

class WebhookResource:
    """Webhook management resource for real-time notifications."""
    
    def __init__(self, client):
        self.client = client
    
    async def create(
        self,
        url: str,
        event_types: List[str],
        secret: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new webhook endpoint.
        
        Args:
            url: The webhook URL to receive events
            event_types: List of event types to subscribe to
            secret: Optional webhook secret for signature verification
            
        Returns:
            Webhook endpoint details
        """
        data = {
            "url": url,
            "event_types": event_types
        }
        if secret:
            data["secret"] = secret
            
        return await self.client.request("POST", "/api/v1/webhooks", data=data)
    
    async def list(self) -> Dict[str, Any]:
        """
        List all webhook endpoints for the authenticated customer.
        
        Returns:
            List of webhook endpoints
        """
        return await self.client.request("GET", "/api/v1/webhooks")
    
    async def get(self, webhook_id: str) -> Dict[str, Any]:
        """
        Get a specific webhook endpoint.
        
        Args:
            webhook_id: The webhook endpoint ID
            
        Returns:
            Webhook endpoint details
        """
        return await self.client.request("GET", f"/api/v1/webhooks/{webhook_id}")
    
    async def update(
        self,
        webhook_id: str,
        url: str,
        event_types: List[str],
        secret: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Update a webhook endpoint.
        
        Args:
            webhook_id: The webhook endpoint ID
            url: The webhook URL to receive events
            event_types: List of event types to subscribe to
            secret: Optional webhook secret for signature verification
            
        Returns:
            Updated webhook endpoint details
        """
        data = {
            "url": url,
            "event_types": event_types
        }
        if secret:
            data["secret"] = secret
            
        return await self.client.request("PUT", f"/api/v1/webhooks/{webhook_id}", data=data)
    
    async def delete(self, webhook_id: str) -> bool:
        """
        Delete a webhook endpoint.
        
        Args:
            webhook_id: The webhook endpoint ID
            
        Returns:
            True if deleted successfully
        """
        try:
            await self.client.request("DELETE", f"/api/v1/webhooks/{webhook_id}")
            return True
        except APIError:
            return False
    
    async def test(self, webhook_id: str) -> Dict[str, Any]:
        """
        Send a test event to a webhook endpoint.
        
        Args:
            webhook_id: The webhook endpoint ID
            
        Returns:
            Test result
        """
        return await self.client.request("POST", f"/api/v1/webhooks/{webhook_id}/test")
    
    async def get_event_types(self) -> Dict[str, Any]:
        """
        Get all available webhook event types.
        
        Returns:
            List of available event types with descriptions
        """
        return await self.client.request("GET", "/api/v1/webhooks/event-types")


class BatchResource:
    """Batch processing resource for high-volume operations."""
    
    def __init__(self, client):
        self.client = client
    
    async def process_labs(
        self,
        lab_results: List[Dict[str, Any]],
        batch_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Process multiple lab results in a single batch.
        
        Args:
            lab_results: List of lab result data
            batch_id: Optional batch identifier
            
        Returns:
            Batch processing results
        """
        data = {
            "lab_results": lab_results,
            "batch_id": batch_id or f"batch_{int(time.time())}"
        }
        return await self.client.request("POST", "/api/v1/batch/labs", data=data)
    
    async def analyze_health_data(
        self,
        health_records: List[Dict[str, Any]],
        analysis_type: str = "comprehensive"
    ) -> Dict[str, Any]:
        """
        Analyze multiple health records in batch.
        
        Args:
            health_records: List of health record data
            analysis_type: Type of analysis to perform
            
        Returns:
            Batch analysis results
        """
        data = {
            "health_records": health_records,
            "analysis_type": analysis_type
        }
        return await self.client.request("POST", "/api/v1/batch/analyze", data=data)
    
    async def get_status(self, batch_id: str) -> Dict[str, Any]:
        """
        Get the status of a batch operation.
        
        Args:
            batch_id: The batch identifier
            
        Returns:
            Batch status and progress
        """
        return await self.client.request("GET", f"/api/v1/batch/status/{batch_id}")


class IntegrationsResource:
    """Third-party integrations resource."""
    
    def __init__(self, client):
        self.client = client
    
    async def connect_fitbit(self, access_token: str) -> Dict[str, Any]:
        """
        Connect Fitbit integration.
        
        Args:
            access_token: Fitbit OAuth access token
            
        Returns:
            Integration status
        """
        data = {"access_token": access_token}
        return await self.client.request("POST", "/api/v1/integrations/fitbit/connect", data=data)
    
    async def connect_apple_health(self, health_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Connect Apple Health integration.
        
        Args:
            health_data: Apple Health data export
            
        Returns:
            Integration status
        """
        return await self.client.request("POST", "/api/v1/integrations/apple-health/connect", data=health_data)
    
    async def connect_google_fit(self, credentials: Dict[str, Any]) -> Dict[str, Any]:
        """
        Connect Google Fit integration.
        
        Args:
            credentials: Google Fit API credentials
            
        Returns:
            Integration status
        """
        return await self.client.request("POST", "/api/v1/integrations/google-fit/connect", data=credentials)
    
    async def sync_wearable_data(self, device_type: str) -> Dict[str, Any]:
        """
        Sync data from connected wearable devices.
        
        Args:
            device_type: Type of wearable device
            
        Returns:
            Sync results
        """
        data = {"device_type": device_type}
        return await self.client.request("POST", "/api/v1/integrations/sync", data=data)
    
    async def list_connected(self) -> Dict[str, Any]:
        """
        List all connected integrations.
        
        Returns:
            List of connected integrations
        """
        return await self.client.request("GET", "/api/v1/integrations")
    
    async def disconnect(self, integration_type: str) -> bool:
        """
        Disconnect an integration.
        
        Args:
            integration_type: Type of integration to disconnect
            
        Returns:
            True if disconnected successfully
        """
        try:
            await self.client.request("DELETE", f"/api/v1/integrations/{integration_type}")
            return True
        except APIError:
            return False


class GraphQLResource:
    """GraphQL API resource for flexible queries."""
    
    def __init__(self, client):
        self.client = client
    
    async def query(self, query: str, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Execute a GraphQL query.
        
        Args:
            query: GraphQL query string
            variables: Optional query variables
            
        Returns:
            Query results
        """
        data = {"query": query}
        if variables:
            data["variables"] = variables
            
        return await self.client.request("POST", "/api/v1/graphql", data=data)
    
    async def get_schema(self) -> Dict[str, Any]:
        """
        Get the GraphQL schema.
        
        Returns:
            GraphQL schema definition
        """
        return await self.client.request("GET", "/api/v1/graphql/schema")


# Enhanced client with new resources
def enhance_client_with_integrations(client):
    """Add integration resources to an existing enhanced client."""
    if not hasattr(client, 'webhooks'):
        client.webhooks = WebhookResource(client)
    if not hasattr(client, 'batch'):
        client.batch = BatchResource(client)
    if not hasattr(client, 'integrations'):
        client.integrations = IntegrationsResource(client)
    if not hasattr(client, 'graphql'):
        client.graphql = GraphQLResource(client)
    
    return client


# Webhook signature verification utility
def verify_webhook_signature(payload: str, signature: str, secret: str) -> bool:
    """
    Verify webhook signature for security.
    
    Args:
        payload: Raw webhook payload
        signature: Webhook signature from headers
        secret: Webhook secret
        
    Returns:
        True if signature is valid
    """
    import hmac
    import hashlib
    
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Remove 'sha256=' prefix if present
    if signature.startswith('sha256='):
        signature = signature[7:]
    
    return hmac.compare_digest(expected_signature, signature)


# Integration helper functions
class IntegrationHelpers:
    """Helper functions for common integration tasks."""
    
    @staticmethod
    def parse_fitbit_data(fitbit_export: Dict[str, Any]) -> Dict[str, Any]:
        """Parse Fitbit data export into BondMCP format."""
        # Implementation would parse Fitbit's data format
        return {
            "steps": fitbit_export.get("activities-steps", []),
            "heart_rate": fitbit_export.get("activities-heart", []),
            "sleep": fitbit_export.get("sleep", []),
            "weight": fitbit_export.get("body-weight", [])
        }
    
    @staticmethod
    def parse_apple_health_data(health_export: Dict[str, Any]) -> Dict[str, Any]:
        """Parse Apple Health data export into BondMCP format."""
        # Implementation would parse Apple Health's XML format
        return {
            "workouts": health_export.get("workouts", []),
            "vitals": health_export.get("vitals", []),
            "lab_results": health_export.get("lab_results", []),
            "medications": health_export.get("medications", [])
        }
    
    @staticmethod
    def parse_google_fit_data(fit_data: Dict[str, Any]) -> Dict[str, Any]:
        """Parse Google Fit data into BondMCP format."""
        # Implementation would parse Google Fit's data format
        return {
            "activities": fit_data.get("activities", []),
            "biometrics": fit_data.get("biometrics", []),
            "nutrition": fit_data.get("nutrition", [])
        }


# Example usage and documentation
WEBHOOK_EXAMPLE = """
# Webhook Usage Example

from bondmcp_sdk.enhanced_client import EnhancedBondMCPClient, enhance_client_with_integrations

# Initialize client
client = EnhancedBondMCPClient(api_key="your_api_key")
client = enhance_client_with_integrations(client)

# Create webhook
webhook = await client.webhooks.create(
    url="https://your-app.com/webhooks/bondmcp",
    event_types=["lab_result_ready", "health_alert"],
    secret="your_webhook_secret"
)

# List webhooks
webhooks = await client.webhooks.list()

# Test webhook
test_result = await client.webhooks.test(webhook["id"])
"""

BATCH_EXAMPLE = """
# Batch Processing Example

# Process multiple lab results
lab_results = [
    {"test_type": "CBC", "values": {...}},
    {"test_type": "CMP", "values": {...}},
]

batch_result = await client.batch.process_labs(lab_results)

# Check batch status
status = await client.batch.get_status(batch_result["batch_id"])
"""

INTEGRATION_EXAMPLE = """
# Integration Example

# Connect Fitbit
fitbit_result = await client.integrations.connect_fitbit(access_token)

# Sync wearable data
sync_result = await client.integrations.sync_wearable_data("fitbit")

# List connected integrations
integrations = await client.integrations.list_connected()
"""

