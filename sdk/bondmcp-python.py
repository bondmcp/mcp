"""BondMCP Python SDK - Test Stub."""

import requests

# This file serves as a stub for CI tests
# The actual implementation is in the bondmcp_python directory

# Import main components for easier access
import importlib.util
from pathlib import Path
import requests

_pkg_dir = Path(__file__).resolve().parent / "bondmcp-python"


def _load_module(name: str):
    spec = importlib.util.spec_from_file_location(name, _pkg_dir / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


try:
    from bondmcp_sdk import (
        BondMCPClient,
        BondMCPAPIError,
        BondMCPNetworkError,
        BondMCPError,
    )
    requests = requests
except Exception:  # pragma: no cover - fallback to local stubs
    _client = _load_module("client")
    _exc = _load_module("exceptions")

    BondMCPClient = _client.BondMCPClient
    BondMCPError = _exc.BondMCPError
    BondMCPAPIError = _exc.BondMCPError
    BondMCPNetworkError = _exc.BondMCPError
    requests = requests

__version__ = "0.1.0"




