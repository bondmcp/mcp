"""
BondMCP Python SDK Tests

Test suite for the BondMCP Python SDK.
"""

import pytest
from unittest import mock

# Import the SDK modules
from bondmcp_python import BondMCPClient
from bondmcp_python.exceptions import BondMCPError, AuthError, RateLimitError

class TestBondMCPClient:
    """Test cases for the BondMCP client."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.client = BondMCPClient(api_key="test_api_key")
    
    def test_initialization(self):
        """Test client initialization."""
        assert self.client.api_key == "test_api_key"
        assert self.client.base_url == "https://api.bondmcp.com"
        assert self.client.timeout == 30
        assert self.client.max_retries == 3
        assert self.client.retry_delay == 2
        
    @mock.patch("bondmcp_python.client.BondMCPClient.ask")
    def test_ask(self, mock_ask):
        """Test ask method."""
        mock_ask.return_value = {"answer": "Test answer", "confidence": 0.95}
        
        response = self.client.ask("What are the symptoms of high blood pressure?")
        
        assert response["answer"] == "Test answer"
        assert response["confidence"] == 0.95
        mock_ask.assert_called_once_with("What are the symptoms of high blood pressure?")
    
    @mock.patch("bondmcp_python.client.LabsClient.interpret")
    def test_labs_interpret(self, mock_interpret):
        """Test labs interpret method."""
        mock_interpret.return_value = {"insights": "Test insights", "recommendations": []}
        
        lab_results = [
            {"name": "Glucose", "value": 110, "unit": "mg/dL", "reference_range": "70-99"}
        ]
        response = self.client.labs.interpret(lab_results)
        
        assert response["insights"] == "Test insights"
        assert response["recommendations"] == []
        mock_interpret.assert_called_once_with(lab_results)
