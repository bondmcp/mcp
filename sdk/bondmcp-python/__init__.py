"""
BondMCP Python SDK

A healthcare-optimized implementation of the Model Context Protocol (MCP),
enabling secure and compliant AI integration with health data sources.
"""

__version__ = "0.1.0"

from .client import BondMCPClient
from .exceptions import BondMCPError, AuthError, RateLimitError
