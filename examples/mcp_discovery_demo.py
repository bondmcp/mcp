#!/usr/bin/env python3
"""
Example demonstrating MCP discovery capabilities.
This script shows how to discover and verify BondMCP API capabilities.
"""

import json
import hashlib
import requests
from typing import Dict, List, Any

class MCPDiscoveryExample:
    def __init__(self, base_url: str = "https://api.bondmcp.com"):
        self.base_url = base_url
        
    def discover_configuration(self) -> Dict[str, Any]:
        """Fetch the complete MCP configuration."""
        url = f"{self.base_url}/.well-known/mcp-configuration"
        
        # In a real implementation, you would handle errors, rate limiting, etc.
        print(f"🔍 Discovering MCP configuration from {url}")
        
        # Simulate response for demonstration
        mock_config = {
            "service": {
                "name": "BondMCP API",
                "version": "2.1.0",
                "description": "Healthcare AI API with MCP discovery support"
            },
            "auth": {
                "supported_methods": ["api_key", "bearer"],
                "required": True
            },
            "capabilities": [
                {
                    "id": "health_ask_v1",
                    "method": "POST",
                    "path": "/api/v1/health/ask",
                    "name": "Health Question Answering",
                    "description": "Ask health-related questions and get AI-powered answers",
                    "auth_required": True,
                    "tags": ["health", "ai", "questions"],
                    "rate_limit_tier": "standard",
                    "deprecated": False
                },
                {
                    "id": "health_analyze_v1",
                    "method": "POST", 
                    "path": "/api/v1/health/analyze",
                    "name": "Health Data Analysis",
                    "description": "Analyze health data and provide insights",
                    "auth_required": True,
                    "tags": ["health", "analysis", "data"],
                    "rate_limit_tier": "premium",
                    "deprecated": False
                },
                {
                    "id": "system_health_v1",
                    "method": "GET",
                    "path": "/health",
                    "name": "System Health Check",
                    "description": "Check API system health status",
                    "auth_required": False,
                    "tags": ["system", "monitoring"],
                    "rate_limit_tier": "basic",
                    "deprecated": False
                }
            ],
            "rate_limits": {
                "requests_per_minute": 100,
                "requests_per_hour": 5000,
                "requests_per_day": 100000
            },
            "contact": {
                "email": "support@bondmcp.com",
                "support_url": "https://docs.bondmcp.com/support"
            },
            "updated_at": "2025-08-24T10:00:00Z"
        }
        
        return mock_config
    
    def get_manifest(self) -> Dict[str, Any]:
        """Fetch the MCP manifest for verification."""
        url = f"{self.base_url}/.well-known/mcp-manifest.json"
        
        print(f"📋 Fetching MCP manifest from {url}")
        
        # Calculate capabilities hash (in real implementation, this would come from the API)
        config = self.discover_configuration()
        capabilities_json = json.dumps(config["capabilities"], sort_keys=True, separators=(',', ':'))
        capabilities_hash = hashlib.sha256(capabilities_json.encode()).hexdigest()
        
        mock_manifest = {
            "version": "2.1.0",
            "capabilities_sha256": capabilities_hash,
            "generated_at": "2025-08-24T10:00:00Z",
            "configuration_url": f"{self.base_url}/.well-known/mcp-configuration"
        }
        
        return mock_manifest
    
    def verify_capabilities(self, config: Dict[str, Any], manifest: Dict[str, Any]) -> bool:
        """Verify capabilities integrity using SHA256 hash."""
        print("🔐 Verifying capabilities integrity...")
        
        capabilities_json = json.dumps(config["capabilities"], sort_keys=True, separators=(',', ':'))
        calculated_hash = hashlib.sha256(capabilities_json.encode()).hexdigest()
        
        if calculated_hash == manifest["capabilities_sha256"]:
            print("✅ Capabilities verification successful")
            return True
        else:
            print("❌ Capabilities hash mismatch - potential tampering detected")
            return False
    
    def analyze_capabilities(self, config: Dict[str, Any]) -> None:
        """Analyze and display capability information."""
        capabilities = config["capabilities"]
        
        print(f"\n📊 Service Analysis: {config['service']['name']} v{config['service']['version']}")
        print(f"Total capabilities: {len(capabilities)}")
        
        # Group by authentication requirement
        auth_required = [cap for cap in capabilities if cap["auth_required"]]
        public_endpoints = [cap for cap in capabilities if not cap["auth_required"]]
        
        print(f"🔐 Authenticated endpoints: {len(auth_required)}")
        print(f"🌐 Public endpoints: {len(public_endpoints)}")
        
        # Group by rate limit tier
        tiers = {}
        for cap in capabilities:
            tier = cap.get("rate_limit_tier", "basic")
            tiers.setdefault(tier, []).append(cap)
        
        print(f"\n⚡ Rate Limit Tiers:")
        for tier, caps in tiers.items():
            print(f"  {tier.title()}: {len(caps)} endpoints")
        
        # Show deprecated endpoints
        deprecated = [cap for cap in capabilities if cap.get("deprecated", False)]
        if deprecated:
            print(f"\n⚠️  Deprecated endpoints: {len(deprecated)}")
            for cap in deprecated:
                print(f"    {cap['method']} {cap['path']} - {cap['name']}")
        
        # Show available endpoints by category
        print(f"\n🔧 Available Endpoints:")
        for cap in capabilities:
            auth_icon = "🔐" if cap["auth_required"] else "🌐"
            tier_icon = {"basic": "⚡", "standard": "🚀", "premium": "💎"}.get(cap.get("rate_limit_tier"), "⚡")
            deprecated_icon = " ⚠️" if cap.get("deprecated") else ""
            
            print(f"  {auth_icon} {tier_icon} {cap['method']} {cap['path']} - {cap['name']}{deprecated_icon}")
            
    def demo_discovery_flow(self) -> None:
        """Demonstrate the complete MCP discovery flow."""
        print("🚀 BondMCP Discovery Demo")
        print("=" * 50)
        
        try:
            # Step 1: Discover configuration
            config = self.discover_configuration()
            
            # Step 2: Get manifest
            manifest = self.get_manifest()
            
            # Step 3: Verify integrity
            if self.verify_capabilities(config, manifest):
                # Step 4: Analyze capabilities
                self.analyze_capabilities(config)
                
                print(f"\n📈 Rate Limits:")
                rate_limits = config.get("rate_limits", {})
                print(f"  Per minute: {rate_limits.get('requests_per_minute', 'N/A')}")
                print(f"  Per hour: {rate_limits.get('requests_per_hour', 'N/A')}")
                print(f"  Per day: {rate_limits.get('requests_per_day', 'N/A')}")
                
                print(f"\n📞 Support:")
                contact = config.get("contact", {})
                print(f"  Email: {contact.get('email', 'N/A')}")
                print(f"  Support URL: {contact.get('support_url', 'N/A')}")
                
                print(f"\n✨ Discovery completed successfully!")
                print(f"Your application can now dynamically use {len(config['capabilities'])} available capabilities.")
                
            else:
                print("❌ Discovery failed due to verification errors")
                
        except Exception as e:
            print(f"❌ Discovery failed: {e}")

def main():
    """Run the MCP discovery example."""
    example = MCPDiscoveryExample()
    example.demo_discovery_flow()

if __name__ == "__main__":
    main()