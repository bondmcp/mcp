"""
BondMCP Python Client

Main client class for interacting with the BondMCP API.
"""

import json
from typing import Optional, Dict, Any, List
from urllib.parse import urljoin

import requests
from pydantic import BaseModel

from .models import AskRequest, AskResponse, LabInterpretRequest, LabInterpretResponse


class BondMCPError(Exception):
    """Base exception for BondMCP SDK errors."""
    pass


class BondMCPAPIError(BondMCPError):
    """Exception raised for API errors."""
    
    def __init__(self, message: str, status_code: Optional[int] = None, response: Optional[Dict] = None):
        super().__init__(message)
        self.status_code = status_code
        self.response = response


class BondMCP:
    """
    BondMCP Python Client
    
    The main client for interacting with the BondMCP health AI API.
    
    Args:
        api_key: Your BondMCP API key
        environment: API environment ('production' or 'staging')
        timeout: Request timeout in seconds
        base_url: Custom base URL (optional)
    
    Example:
        >>> client = BondMCP(api_key="your_api_key")
        >>> response = client.ask("What are the symptoms of diabetes?")
        >>> print(response.answer)
    """
    
    def __init__(
        self,
        api_key: str,
        environment: str = "production",
        timeout: int = 30,
        base_url: Optional[str] = None
    ):
        self.api_key = api_key
        self.environment = environment
        self.timeout = timeout
        
        if base_url:
            self.base_url = base_url
        elif environment == "staging":
            self.base_url = "https://api-staging.bondmcp.com"
        else:
            self.base_url = "https://api.bondmcp.com"
            
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "BondMCP-Python-SDK/1.0.0"
        })
    
    def ask(
        self,
        query: str,
        conversation_id: Optional[str] = None,
        include_citations: bool = True,
        model_preference: str = "consensus"
    ) -> AskResponse:
        """
        Ask a health question using multi-model consensus.
        
        Args:
            query: The health question to ask
            conversation_id: Optional conversation ID for context
            include_citations: Whether to include source citations
            model_preference: AI model preference ('consensus', 'claude', 'gpt4', 'medlm')
            
        Returns:
            AskResponse object with the answer and metadata
            
        Raises:
            BondMCPAPIError: If the API request fails
        """
        request_data = AskRequest(
            query=query,
            conversation_id=conversation_id,
            include_citations=include_citations,
            model_preference=model_preference
        )
        
        response = self._make_request("POST", "/api/v1/ask", request_data.dict())
        return AskResponse(**response)
    
    def interpret_labs(self, request: LabInterpretRequest) -> LabInterpretResponse:
        """
        Interpret laboratory results.
        
        Args:
            request: Lab interpretation request with results and patient context
            
        Returns:
            LabInterpretResponse with interpretation and recommendations
            
        Raises:
            BondMCPAPIError: If the API request fails
        """
        response = self._make_request("POST", "/api/v1/labs/interpret", request.dict())
        return LabInterpretResponse(**response)
    
    def health_check(self) -> Dict[str, Any]:
        """
        Check the health status of the BondMCP API.
        
        Returns:
            Dictionary with health status information
        """
        return self._make_request("GET", "/api/v1/health")
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Make an HTTP request to the BondMCP API.
        
        Args:
            method: HTTP method (GET, POST, etc.)
            endpoint: API endpoint path
            data: Request data (for POST requests)
            
        Returns:
            Response data as dictionary
            
        Raises:
            BondMCPAPIError: If the request fails
        """
        url = urljoin(self.base_url, endpoint)
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, timeout=self.timeout)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, timeout=self.timeout)
            else:
                raise BondMCPError(f"Unsupported HTTP method: {method}")
                
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.HTTPError as e:
            try:
                error_data = response.json()
                error_message = error_data.get("error", str(e))
            except (json.JSONDecodeError, AttributeError):
                error_message = str(e)
                error_data = None
                
            raise BondMCPAPIError(
                message=error_message,
                status_code=response.status_code,
                response=error_data
            )
        except requests.exceptions.RequestException as e:
            raise BondMCPAPIError(f"Request failed: {str(e)}")
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.session.close()

