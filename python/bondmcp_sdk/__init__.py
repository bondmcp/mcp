"""
BondMCP Python SDK

Auto-generated Python SDK for BondMCP
Version: 2.1.0
Generated from OpenAPI specification
"""

__version__ = "2.1.0"

# Import generated client
from .generated import *
from .generated.api.default_api import DefaultApi
from .generated.configuration import Configuration

class BondMCPClient(DefaultApi):
    """Main BondMCP client class"""
    
    def __init__(self, api_key: str, base_path: str = "https://api.bondmcp.com"):
        config = Configuration(
            api_key={"Authorization": f"Bearer {api_key}"},
            host=base_path
        )
        super().__init__(api_client=None)
        self.api_client.configuration = config

__all__ = ["BondMCPClient", "Configuration", "__version__"]
