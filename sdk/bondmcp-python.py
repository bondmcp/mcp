"""BondMCP Python SDK - Test Stub."""

import importlib.util
from pathlib import Path

import requests

__version__ = "0.1.0"

# Define path to local modules (fallback)
_pkg_dir = Path(__file__).resolve().parent / "bondmcp_python"


def _load_module(name: str):
    spec = importlib.util.spec_from_file_location(name, _pkg_dir / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


try:
    # Primary import from installed package
    from bondmcp_sdk import (
        BondMCPAPIError,
        BondMCPClient,
        BondMCPError,
        BondMCPNetworkError,
    )
except ImportError:
    # Fallback to local stub implementation
    _client = _load_module("client")
    _exc = _load_module("exceptions")

    BondMCPClient = _client.BondMCPClient
    BondMCPError = _exc.BondMCPError
    BondMCPAPIError = _exc.BondMCPAPIError
    BondMCPNetworkError = _exc.BondMCPNetworkError

__all__ = [
    "BondMCPClient",
    "BondMCPAPIError",
    "BondMCPError",
    "BondMCPNetworkError",
    "requests",
]
