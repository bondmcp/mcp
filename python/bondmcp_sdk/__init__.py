"""
BondMCP Python SDK

The official Python SDK for the BondMCP health AI platform.
This SDK provides a clean, type-safe interface to all BondMCP API endpoints.
"""

__version__ = "1.0.0"

import json
import time
from typing import Dict, List, Optional, Any, Union
import requests
from dataclasses import dataclass


@dataclass
class BondMCPConfig:
    """Configuration for the BondMCP client"""
    api_key: str
    base_path: str = "https://api.bondmcp.com"
    timeout: float = 30.0
    headers: Optional[Dict[str, str]] = None


@dataclass
class HealthQuestion:
    """Health question request"""
    question: str
    detailed: bool = False
    categories: Optional[List[str]] = None


@dataclass
class HealthAnswer:
    """Health question response"""
    id: str
    answer: str
    trust_score: float
    sources: List[str]
    timestamp: str
    categories: Optional[List[str]] = None


class BondMCPError(Exception):
    """Custom exception for BondMCP API errors"""
    
    def __init__(self, status_code: int, error_code: str, message: str):
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(message)
    
    @property
    def is_auth_error(self) -> bool:
        """Check if this is an authentication error"""
        return self.status_code == 401 or self.error_code == 'authentication_error'
    
    @property
    def is_rate_limit_error(self) -> bool:
        """Check if this is a rate limit error"""
        return self.status_code == 429 or self.error_code == 'rate_limit_exceeded'
    
    @property
    def is_validation_error(self) -> bool:
        """Check if this is a validation error"""
        return self.status_code == 400 or self.error_code == 'validation_error'


class BondMCPClient:
    """
    Main BondMCP client class
    
    Example:
        >>> from bondmcp_sdk import BondMCPClient
        >>> client = BondMCPClient(api_key="your-api-key")
        >>> response = client.health.ask(question="What are the symptoms of diabetes?")
        >>> print(response.answer)
    """
    
    def __init__(self, api_key: str, base_path: str = "https://api.bondmcp.com", **kwargs):
        """
        Initialize the BondMCP client
        
        Args:
            api_key: Your BondMCP API key
            base_path: Base URL for the API (defaults to production)
            **kwargs: Additional configuration options
        """
        self.config = BondMCPConfig(
            api_key=api_key,
            base_path=base_path,
            **kwargs
        )
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'X-API-Key': self.config.api_key,
            'User-Agent': f'BondMCP-Python-SDK/{__version__}'
        })
        
        if self.config.headers:
            self.session.headers.update(self.config.headers)
    
    @property
    def health(self):
        """Health-related endpoints"""
        return HealthEndpoints(self)
    
    @property
    def labs(self):
        """Lab-related endpoints"""
        return LabEndpoints(self)
    
    @property
    def supplement(self):
        """Supplement-related endpoints"""
        return SupplementEndpoints(self)
    
    def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Make an authenticated request to the API
        
        Args:
            method: HTTP method (GET, POST, etc.)
            endpoint: API endpoint path
            data: Request body data
            params: Query parameters
            
        Returns:
            Response data as a dictionary
            
        Raises:
            BondMCPError: If the API returns an error
        """
        url = f"{self.config.base_path.rstrip('/')}{endpoint}"
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                json=data,
                params=params,
                timeout=self.config.timeout
            )
            
            if not response.ok:
                error_data = {}
                try:
                    error_data = response.json()
                except ValueError:
                    pass
                
                raise BondMCPError(
                    status_code=response.status_code,
                    error_code=error_data.get('code', 'unknown_error'),
                    message=error_data.get('message', response.reason)
                )
            
            return response.json()
            
        except requests.Timeout:
            raise BondMCPError(408, 'timeout', 'Request timeout')
        except requests.RequestException as e:
            raise BondMCPError(0, 'network_error', f'Network error: {str(e)}')


class HealthEndpoints:
    """Health-related API endpoints"""
    
    def __init__(self, client: BondMCPClient):
        self.client = client
    
    def ask(self, question: str, detailed: bool = False, categories: Optional[List[str]] = None) -> HealthAnswer:
        """
        Ask a health question
        
        Args:
            question: The health question to ask
            detailed: Whether to return a detailed response
            categories: Optional categories to focus on
            
        Returns:
            HealthAnswer object with the response
        """
        data = {
            'question': question,
            'detailed': detailed
        }
        
        if categories:
            data['categories'] = categories
        
        response = self.client._make_request('POST', '/api/v1/ask', data)
        
        return HealthAnswer(
            id=response['id'],
            answer=response['answer'],
            trust_score=response['trustScore'],
            sources=response['sources'],
            categories=response.get('categories'),
            timestamp=response.get('timestamp', '')
        )


class LabEndpoints:
    """Lab-related API endpoints"""
    
    def __init__(self, client: BondMCPClient):
        self.client = client
    
    def interpret(self, lab_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Interpret lab results
        
        Args:
            lab_results: List of lab result dictionaries
            
        Returns:
            Interpretation results
        """
        data = {'lab_results': lab_results}
        return self.client._make_request('POST', '/api/v1/labs/interpret', data)


class SupplementEndpoints:
    """Supplement-related API endpoints"""
    
    def __init__(self, client: BondMCPClient):
        self.client = client
    
    def recommend(self, health_goals: List[str]) -> Dict[str, Any]:
        """
        Get supplement recommendations
        
        Args:
            health_goals: List of health goals
            
        Returns:
            Supplement recommendations
        """
        data = {'health_goals': health_goals}
        return self.client._make_request('POST', '/api/v1/supplement/recommend', data)


# Convenience exports
__all__ = [
    'BondMCPClient',
    'BondMCPError',
    'BondMCPConfig',
    'HealthQuestion',
    'HealthAnswer',
    '__version__'
]