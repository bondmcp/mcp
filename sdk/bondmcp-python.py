"""BondMCP Python SDK - Test Stub."""

import requests

from bondmcp_sdk.client import BondMCPClient, BondMCPError, BondMCPAPIError, BondMCPNetworkError

__version__ = "0.1.0"

# Re-export requests for monkeypatching in tests
requests = requests

__all__ = [
    "BondMCPClient",
    "BondMCPError",
    "BondMCPAPIError",
    "BondMCPNetworkError",
    "requests",
]
