#!/usr/bin/env python3
"""
BondMCP API Documentation Auto-Updater
Scans auroracapital/bondmcp-platform for latest endpoints and updates documentation
"""

import os
import re
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Set
from datetime import datetime

class APIDocumentationUpdater:
    def __init__(self, platform_repo_path: str, docs_repo_path: str):
        self.platform_path = Path(platform_repo_path)
        self.docs_path = Path(docs_repo_path)
        
    def scan_platform_endpoints(self) -> Dict:
        """Scan the platform repository for API endpoints"""
        endpoints = {
            "health": [],
            "auth": [],
            "ai": [],
            "admin": [],
            "integrations": []
        }
        
        # Scan main.py for endpoints
        main_py = self.platform_path / "main.py"
        if main_py.exists():
            endpoints.update(self._extract_endpoints_from_file(main_py))
            
        # Scan app/api/ directory
        api_dir = self.platform_path / "app" / "api"
        if api_dir.exists():
            for py_file in api_dir.glob("*.py"):
                file_endpoints = self._extract_endpoints_from_file(py_file)
                for category, eps in file_endpoints.items():
                    if category in endpoints:
                        endpoints[category].extend(eps)
                    else:
                        endpoints[category] = eps
                        
        return endpoints
    
    def _extract_endpoints_from_file(self, file_path: Path) -> Dict:
        """Extract API endpoints from a Python file"""
        endpoints = {}
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                
            # Find FastAPI route decorators
            route_pattern = r'@\w+\.(get|post|put|delete|patch)\(["\']([^"\']+)["\'].*?\)'
            matches = re.findall(route_pattern, content, re.MULTILINE)
            
            for method, path in matches:
                category = self._categorize_endpoint(path)
                if category not in endpoints:
                    endpoints[category] = []
                    
                endpoints[category].append({
                    "method": method.upper(),
                    "path": path,
                    "file": str(file_path.name)
                })
                
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            
        return endpoints
    
    def _categorize_endpoint(self, path: str) -> str:
        """Categorize endpoint based on path"""
        if "/health" in path or path == "/":
            return "health"
        elif "/auth" in path or "/login" in path or "/register" in path:
            return "auth"
        elif "/ask" in path or "/ai" in path or "/chat" in path:
            return "ai"
        elif "/admin" in path or "/users" in path:
            return "admin"
        else:
            return "integrations"
    
    def update_api_reference(self):
        """Update the API reference documentation"""
        endpoints = self.scan_platform_endpoints()
        
        # Generate API reference content
        api_ref_content = self._generate_api_reference(endpoints)
        
        # Write to api-reference/endpoints.md
        api_ref_file = self.docs_path / "api-reference" / "endpoints.md"
        api_ref_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(api_ref_file, 'w') as f:
            f.write(api_ref_content)
            
        print(f"Updated API reference: {api_ref_file}")
        
    def _generate_api_reference(self, endpoints: Dict) -> str:
        """Generate API reference markdown content"""
        content = """# API Endpoints Reference

*Auto-generated from auroracapital/bondmcp-platform*

This document is automatically updated based on the latest API endpoints in the BondMCP platform.

"""
        
        for category, eps in endpoints.items():
            if not eps:
                continue
                
            content += f"\n## {category.title()} Endpoints\n\n"
            
            for endpoint in eps:
                content += f"### {endpoint['method']} {endpoint['path']}\n\n"
                content += f"**Source**: `{endpoint['file']}`\n\n"
                content += "**Description**: [Auto-generated endpoint]\n\n"
                
        content += f"\n---\n\n*Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}*\n"
        content += f"*Total endpoints found: {sum(len(eps) for eps in endpoints.values())}*\n"
        
        return content

if __name__ == "__main__":
    # This would be updated to point to the actual platform repo
    updater = APIDocumentationUpdater(
        platform_repo_path="../bondmcp-platform",  # Adjust path as needed
        docs_repo_path="."
    )
    
    updater.update_api_reference()
    print("API documentation updated successfully!")
