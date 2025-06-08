#!/usr/bin/env python3
"""
BondMCP Installation Verification Script

This script verifies that the BondMCP Python SDK and CLI are properly installed
and can connect to the BondMCP API.
"""

import sys
import subprocess
import importlib.util
from typing import Dict, List, Tuple


def check_python_version() -> Tuple[bool, str]:
    """Check if Python version meets requirements."""
    version = sys.version_info
    if version >= (3, 8):
        return True, f"✅ Python {version.major}.{version.minor}.{version.micro}"
    else:
        return False, f"❌ Python {version.major}.{version.minor}.{version.micro} (requires >=3.8)"


def check_package_installation() -> Tuple[bool, str]:
    """Check if BondMCP package is installed."""
    try:
        import bondmcp_sdk
        version = getattr(bondmcp_sdk, '__version__', 'unknown')
        return True, f"✅ BondMCP SDK v{version} installed"
    except ImportError:
        return False, "❌ BondMCP SDK not installed"


def check_cli_installation() -> Tuple[bool, str]:
    """Check if BondMCP CLI is available."""
    try:
        result = subprocess.run(
            ['bondmcp-cli', '--help'], 
            capture_output=True, 
            text=True, 
            timeout=10
        )
        if result.returncode == 0:
            return True, "✅ BondMCP CLI available"
        else:
            return False, f"❌ BondMCP CLI error: {result.stderr}"
    except FileNotFoundError:
        return False, "❌ BondMCP CLI not found in PATH"
    except subprocess.TimeoutExpired:
        return False, "❌ BondMCP CLI timeout"
    except Exception as e:
        return False, f"❌ BondMCP CLI error: {str(e)}"


def check_dependencies() -> List[Tuple[bool, str]]:
    """Check if required dependencies are installed."""
    dependencies = [
        ('requests', 'HTTP client library'),
        ('click', 'CLI framework (optional)'),
        ('rich', 'Rich text formatting (optional)'),
        ('keyring', 'Secure credential storage (optional)')
    ]
    
    results = []
    for dep_name, description in dependencies:
        try:
            spec = importlib.util.find_spec(dep_name)
            if spec is not None:
                results.append((True, f"✅ {dep_name} - {description}"))
            else:
                results.append((False, f"❌ {dep_name} - {description}"))
        except Exception:
            results.append((False, f"❌ {dep_name} - {description}"))
    
    return results


def check_api_connectivity() -> Tuple[bool, str]:
    """Check if we can connect to the BondMCP API."""
    try:
        import requests
        response = requests.get('https://api.bondmcp.com/health', timeout=10)
        if response.status_code == 200:
            data = response.json()
            return True, f"✅ API connectivity - Status: {data.get('status', 'unknown')}"
        else:
            return False, f"❌ API connectivity - HTTP {response.status_code}"
    except requests.exceptions.ConnectionError:
        return False, "❌ API connectivity - Connection failed"
    except requests.exceptions.Timeout:
        return False, "❌ API connectivity - Request timeout"
    except Exception as e:
        return False, f"❌ API connectivity - Error: {str(e)}"


def test_sdk_import() -> Tuple[bool, str]:
    """Test importing and using the SDK."""
    try:
        from bondmcp_sdk.client import BondMCPClient, BondMCPError
        
        # Test client creation (without API key)
        try:
            client = BondMCPClient(api_key="test_key")
            return True, "✅ SDK import and client creation successful"
        except Exception as e:
            return False, f"❌ SDK client creation failed: {str(e)}"
            
    except ImportError as e:
        return False, f"❌ SDK import failed: {str(e)}"
    except Exception as e:
        return False, f"❌ SDK test failed: {str(e)}"


def main():
    """Run all verification checks."""
    print("🔍 BondMCP Installation Verification")
    print("=" * 50)
    
    checks = [
        ("Python Version", check_python_version),
        ("Package Installation", check_package_installation),
        ("CLI Installation", check_cli_installation),
        ("SDK Import Test", test_sdk_import),
        ("API Connectivity", check_api_connectivity),
    ]
    
    all_passed = True
    
    for check_name, check_func in checks:
        try:
            passed, message = check_func()
            print(f"{check_name:20} {message}")
            if not passed:
                all_passed = False
        except Exception as e:
            print(f"{check_name:20} ❌ Error: {str(e)}")
            all_passed = False
    
    print("\n📦 Dependencies:")
    dependency_results = check_dependencies()
    for passed, message in dependency_results:
        print(f"{'':20} {message}")
    
    print("\n" + "=" * 50)
    
    if all_passed:
        print("🎉 All checks passed! BondMCP is ready to use.")
        print("\n📚 Next steps:")
        print("   1. Get your API key from https://bondmcp.com")
        print("   2. Try: bondmcp-cli health")
        print("   3. Read the docs: https://docs.bondmcp.com")
        return 0
    else:
        print("⚠️  Some checks failed. Please review the issues above.")
        print("\n🔧 Common solutions:")
        print("   • Reinstall: pip install --upgrade bondmcp")
        print("   • Install CLI extras: pip install bondmcp[cli]")
        print("   • Check network connectivity")
        return 1


if __name__ == "__main__":
    sys.exit(main())

