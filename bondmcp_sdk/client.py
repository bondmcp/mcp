# import bondmcp
import json
import time
from typing import Any, Dict, List, Optional, Union

import requests

# Disclaimer: This SDK is provided for informational purposes only and does not
# constitute medical advice.


class BondMCPClient:
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.bondmcp.com/api",
        timeout: int = 30,
        max_retries: int = 0,
        retry_delay: float = 1.0,
    ):
        """
        Initialize the BondMCP API client.

        Args:
            api_key: Your BondMCP API key
            base_url: The base URL for the BondMCP API
            timeout: Request timeout in seconds
            max_retries: Number of retry attempts for rate limited requests
            retry_delay: Base delay in seconds before retries (exponential backoff)
        """
        self.api_key = api_key
        self.base_url = base_url
        self.timeout = timeout
        self.max_retries = max_retries
        self.retry_delay = retry_delay

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

    def request(
        self,
        method: str,
        path: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None,
    ) -> Dict:
        """
        Make a request to the BondMCP API.

        Args:
            method: HTTP method (get, post, put, delete)
            path: API endpoint path
            data: Request body for POST/PUT requests
            params: Query parameters for GET requests

        Returns:
            API response as a dictionary

        Raises:
            BondMCPAPIError: If the API returns an error
            BondMCPNetworkError: If there's a network error
            BondMCPError: For other errors
        """
        url = f"{self.base_url}{path}"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "bondmcp-python/1.0.0",
        }

        for attempt in range(self.max_retries + 1):
            try:
                if method.lower() == "get":
                    response = requests.get(
                        url, headers=headers, params=params, timeout=self.timeout
                    )
                elif method.lower() == "post":
                    response = requests.post(
                        url, headers=headers, json=data, timeout=self.timeout
                    )
                elif method.lower() == "put":
                    response = requests.put(
                        url, headers=headers, json=data, timeout=self.timeout
                    )
                elif method.lower() == "delete":
                    response = requests.delete(
                        url, headers=headers, json=data, timeout=self.timeout
                    )
                else:
                    raise BondMCPError(f"Unsupported HTTP method: {method}")

                response.raise_for_status()
                return response.json()
            except requests.exceptions.HTTPError as e:
                status = e.response.status_code if hasattr(e, "response") else 0
                if status == 429 and attempt < self.max_retries:
                    retry_after = (
                        e.response.headers.get("Retry-After") if e.response else None
                    )
                    delay = (
                        float(retry_after)
                        if retry_after
                        else self.retry_delay * (2**attempt)
                    )
                    time.sleep(delay)
                    continue
                try:
                    error_data = e.response.json()
                    error_message = error_data.get("error", {}).get(
                        "message", "API request failed"
                    )
                    error_code = error_data.get("error", {}).get("code", "api_error")
                    error_details = error_data.get("error", {}).get("details", {})
                    raise BondMCPAPIError(
                        error_message, e.response.status_code, error_code, error_details
                    )
                except (ValueError, KeyError):
                    raise BondMCPAPIError(
                        str(e), e.response.status_code if hasattr(e, "response") else 0
                    )
            except requests.exceptions.ConnectionError:
                raise BondMCPNetworkError("Network error: Failed to connect to API")
            except requests.exceptions.Timeout:
                raise BondMCPNetworkError("Network error: Request timed out")
            except requests.exceptions.RequestException as e:
                raise BondMCPNetworkError(f"Network error: {str(e)}")
            except Exception as e:
                raise BondMCPError(f"Unexpected error: {str(e)}")

        raise BondMCPError("Exceeded maximum retry attempts")


class HealthResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def check(self) -> Dict:
        """
        Check the operational status of the API.

        Returns:
            API health status information
        """
        return self.client.request("get", "/health")


class LabsResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def interpret(
        self, lab_results: List[Dict], patient_context: Optional[Dict] = None
    ) -> Dict:
        """
        Interpret lab results with AI-powered analysis.

        Args:
            lab_results: List of lab result items
            patient_context: Additional patient information

        Returns:
            Lab interpretation results
        """
        data = {"lab_results": lab_results}

        if patient_context:
            data["patient_context"] = patient_context

        return self.client.request("post", "/labs/interpret", data=data)


class SupplementsResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def recommend(
        self,
        health_goals: List[str],
        current_labs: Optional[Dict] = None,
        current_supplements: Optional[List[str]] = None,
        dietary_restrictions: Optional[List[str]] = None,
        patient_context: Optional[Dict] = None,
    ) -> Dict:
        """
        Get personalized supplement recommendations based on health goals and lab results.

        Args:
            health_goals: List of health goals
            current_labs: Lab results
            current_supplements: List of current supplements
            dietary_restrictions: List of dietary restrictions
            patient_context: Additional patient information

        Returns:
            Supplement recommendations
        """
        data = {"health_goals": health_goals}

        if current_labs:
            data["current_labs"] = current_labs

        if current_supplements:
            data["current_supplements"] = current_supplements

        if dietary_restrictions:
            data["dietary_restrictions"] = dietary_restrictions

        if patient_context:
            data["patient_context"] = patient_context

        return self.client.request("post", "/supplement/recommend", data=data)

    def check_interactions(
        self, supplements: List[str], medications: Optional[List[str]] = None
    ) -> Dict:
        """
        Check for potential interactions between supplements and medications.

        Args:
            supplements: List of supplements
            medications: List of medications

        Returns:
            Interaction analysis results
        """
        data = {"supplements": supplements}

        if medications:
            data["medications"] = medications

        return self.client.request("post", "/supplement/interactions", data=data)


class WearablesResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def analyze(
        self,
        wearable_data: Dict,
        wearable_type: str,
        timeframe: Optional[str] = None,
        metrics: Optional[List[str]] = None,
    ) -> Dict:
        """
        Analyze wearable device data for health insights.

        Args:
            wearable_data: Wearable device data
            wearable_type: Type of wearable device (oura, whoop, apple_health, etc.)
            timeframe: Time period for analysis (day, week, month, etc.)
            metrics: Specific metrics to analyze

        Returns:
            Wearable data analysis results
        """
        data = {"wearable_data": wearable_data, "wearable_type": wearable_type}

        if timeframe:
            data["timeframe"] = timeframe

        if metrics:
            data["metrics"] = metrics

        return self.client.request("post", "/v1/wearable-data-insights", data=data)


class MedicalRecordsResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def analyze(
        self,
        medical_record_text: str,
        extract_entities: bool = True,
        confidence_threshold: Optional[float] = None,
    ) -> Dict:
        """
        Analyze medical record text for insights and entity extraction.

        Args:
            medical_record_text: Medical record text content
            extract_entities: Whether to extract medical entities
            confidence_threshold: Minimum confidence threshold for entity extraction

        Returns:
            Medical record analysis results
        """
        data = {
            "medical_record_text": medical_record_text,
            "extract_entities": extract_entities,
        }

        if confidence_threshold is not None:
            data["confidence_threshold"] = confidence_threshold

        return self.client.request("post", "/v1/analyze-medical-record", data=data)


class AskResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def query(self, query: str, conversation_id: Optional[str] = None) -> Dict:
        """Query the LLM using the /ask endpoint.

        Args:
            query: The question for the model.
            conversation_id: Optional conversation identifier.

        Returns:
            Model response data.
        """
        data = {"query": query}
        if conversation_id:
            data["conversation_id"] = conversation_id

        return self.client.request("post", "/ask", data=data)


class InsightsResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def generate(self, payload: Dict, insight_type: Optional[str] = None) -> Dict:
        """Generate health insights.

        Args:
            payload: Input data for insight generation.
            insight_type: Optional insight type to request.

        Returns:
            Insight generation results.
        """
        path = "/insights" if not insight_type else f"/insights/{insight_type}"
        return self.client.request("post", path, data=payload)


class APIKeysResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def list(self) -> Dict:
        """List API keys for the authenticated user."""
        return self.client.request("get", "/api-keys")

    def create(self, name: str, scopes: Optional[List[str]] = None) -> Dict:
        """Create a new API key.

        Args:
            name: Human readable name.
            scopes: Optional list of scopes for the key.
        """
        data = {"name": name}
        if scopes:
            data["scopes"] = scopes
        return self.client.request("post", "/api-keys", data=data)

    def update(
        self,
        key_id: str,
        name: Optional[str] = None,
        scopes: Optional[List[str]] = None,
    ) -> Dict:
        """Update an existing API key."""
        data: Dict[str, Any] = {}
        if name:
            data["name"] = name
        if scopes is not None:
            data["scopes"] = scopes
        return self.client.request("put", f"/api-keys/{key_id}", data=data)

    def revoke(self, key_id: str) -> Dict:
        """Revoke (delete) an API key."""
        return self.client.request("delete", f"/api-keys/{key_id}")


class PaymentsResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def create_intent(
        self, amount: int, currency: str, metadata: Optional[Dict[str, Any]] = None
    ) -> Dict:
        """Create a payment intent."""
        data = {"amount": amount, "currency": currency}
        if metadata:
            data["metadata"] = metadata
        return self.client.request("post", "/payments/create-intent", data=data)


class OrchestrateResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def run(self, steps: List[Dict], conversation_id: Optional[str] = None) -> Dict:
        """Orchestrate multiple tool invocations."""
        data: Dict[str, Any] = {"steps": steps}
        if conversation_id:
            data["conversation_id"] = conversation_id
        return self.client.request("post", "/orchestrate", data=data)


class ToolsResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def call(self, tool: str, payload: Dict) -> Dict:
        """Call a specific tool by name."""
        data = {"tool": tool, "payload": payload}
        return self.client.request("post", "/tools/call", data=data)


class ImportResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def oura(self, data: Dict) -> Dict:
        """Import Oura data."""
        return self.client.request("post", "/import/oura", data=data)


class ChatResource:
    def __init__(self, client: BondMCPClient):
        self.client = client

    def upload_health_data(self, conversation_id: str, data: Dict) -> Dict:
        """Upload health data to a conversation."""
        path = f"/v1/chat/conversation/{conversation_id}/health-data"
        return self.client.request("post", path, data=data)


class BondMCPError(Exception):
    """Base exception for all BondMCP errors"""

    pass


class BondMCPAPIError(BondMCPError):
    """Exception raised when the API returns an error"""

    def __init__(
        self,
        message: str,
        status_code: int = 0,
        code: str = "api_error",
        details: Dict = None,
    ):
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.details = details or {}


class BondMCPNetworkError(BondMCPError):
    """Exception raised when there's a network error"""

    pass


# Module exports
Client = BondMCPClient
APIError = BondMCPAPIError
NetworkError = BondMCPNetworkError
Error = BondMCPError
AskResource = AskResource
InsightsResource = InsightsResource
APIKeysResource = APIKeysResource
PaymentsResource = PaymentsResource
OrchestrateResource = OrchestrateResource
ToolsResource = ToolsResource
ImportResource = ImportResource
ChatResource = ChatResource
