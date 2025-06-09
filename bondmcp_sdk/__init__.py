"""BondMCP Python SDK - The Trusted Protocol for Health AI."""

__version__ = "1.0.0"
__author__ = "BondMCP Team"
__email__ = "hello@bondmcp.com"
__description__ = (
    "BondMCP - The Trusted Protocol for Health AI. Python SDK and CLI for "
    "seamless integration with BondMCP's multi-model consensus health AI platform."
)
__url__ = "https://bondmcp.com"
__license__ = "MIT"

# Re-export the canonical client implementation
from .client import (
    BondMCPClient,
    BondMCPAPIError,
    BondMCPNetworkError,
    BondMCPError,
    Client,
    APIError,
    NetworkError,
    Error,
    AskResource,
    InsightsResource,
    APIKeysResource,
    PaymentsResource,
    OrchestrateResource,
    ToolsResource,
    ImportResource,
    ChatResource,
)

__all__ = [
    "BondMCPClient",
    "BondMCPAPIError",
    "BondMCPNetworkError",
    "BondMCPError",
    "Client",
    "APIError",
    "NetworkError",
    "Error",
    "AskResource",
    "InsightsResource",
    "APIKeysResource",
    "PaymentsResource",
    "OrchestrateResource",
    "ToolsResource",
    "ImportResource",
    "ChatResource",
]
