"""
BondMCP Python SDK Exceptions

Custom exceptions for the BondMCP Python SDK.
"""

class BondMCPError(Exception):
    """Base exception for all BondMCP errors."""
    
    def __init__(self, message, code=None, http_status=None):
        """
        Initialize a new BondMCP error.
        
        Args:
            message (str): Error message
            code (str, optional): Error code. Defaults to None.
            http_status (int, optional): HTTP status code. Defaults to None.
        """
        super().__init__(message)
        self.message = message
        self.code = code
        self.http_status = http_status


class AuthError(BondMCPError):
    """Authentication error."""
    
    def __init__(self, message="Authentication failed. Check your API key.", code="INVALID_AUTH", http_status=401):
        super().__init__(message, code, http_status)


class RateLimitError(BondMCPError):
    """Rate limit exceeded error."""
    
    def __init__(self, message="Rate limit exceeded. Please try again later.", code="RATE_LIMIT_EXCEEDED", http_status=429):
        super().__init__(message, code, http_status)


class ValidationError(BondMCPError):
    """Validation error for invalid input parameters."""
    
    def __init__(self, message="Invalid request parameters.", code="INVALID_REQUEST", http_status=400):
        super().__init__(message, code, http_status)


class ServerError(BondMCPError):
    """Server-side error."""
    
    def __init__(self, message="Internal server error.", code="SERVER_ERROR", http_status=500):
        super().__init__(message, code, http_status)


class ResourceNotFoundError(BondMCPError):
    """Resource not found error."""
    
    def __init__(self, message="Resource not found.", code="NOT_FOUND", http_status=404):
        super().__init__(message, code, http_status)
