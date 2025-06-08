"""
BondMCP Python SDK - Main Module

This file is required by the CI tests to validate the Python SDK.
"""

# This file serves as a stub for CI tests
# The actual implementation is in the bondmcp-python directory

# Import main components for easier access
"""Compatibility wrapper for tests.

This module exposes the public classes from the actual Python SDK
implementation located under ``bondmcp_sdk``.  The CI tests import this
file directly, so keep the surface area minimal while delegating all
functionality to the real package.
"""

from bondmcp_sdk import (
    BondMCPClient,
    BondMCPAPIError,
    BondMCPError,
    BondMCPNetworkError,
)
import requests as requests

__all__ = [
    "BondMCPClient",
    "BondMCPAPIError",
    "BondMCPError",
    "BondMCPNetworkError",
]

__version__ = "0.1.0"
