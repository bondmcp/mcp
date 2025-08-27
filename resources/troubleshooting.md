# Troubleshooting Guide

## Common Issues

### Authentication Problems

#### "Authentication failed" error
```bash
# Check your credentials
bondmcp auth status

# Re-authenticate
bondmcp auth logout
bondmcp auth login
```

#### "Invalid API key" error
```bash
# Check if key exists
bondmcp keys list

# Create new key if needed
bondmcp keys create --name "new-key"

# Set environment variable
export BONDMCP_API_KEY="your-new-key"
```

### API Connection Issues

#### "Connection refused" error
```bash
# Check API status
bondmcp health check

# Verify your internet connection
curl -I https://api.bondmcp.com/health
```

#### Rate limiting errors
```bash
# Check your usage
bondmcp usage show

# Wait for rate limit reset or upgrade plan
bondmcp billing status
```

### CLI Installation Issues

#### "Command not found: bondmcp"
```bash
# Reinstall CLI
pip uninstall bondmcp-cli
pip install bondmcp-cli

# Check PATH
echo $PATH
which bondmcp
```

#### Permission errors
```bash
# Install with user flag
pip install --user bondmcp-cli

# Or use sudo (not recommended)
sudo pip install bondmcp-cli
```

### SDK Issues

#### Python SDK import errors
```bash
# Reinstall Python SDK
pip uninstall bondmcp-python
pip install bondmcp-python
```

#### JavaScript SDK module errors
```bash
# Reinstall JavaScript SDK
npm uninstall @bondmcp/sdk
npm install @bondmcp/sdk
```

## Getting Help

### CLI Help
```bash
bondmcp --help
bondmcp <command> --help
```

### Check Status
```bash
bondmcp auth status
bondmcp usage show
bondmcp health check
```

### Debug Mode
```bash
# Enable verbose logging
bondmcp --verbose ask "test question"
```

## No Web Interface

Remember: BondMCP is CLI/API only. There is no web dashboard to troubleshoot issues. All operations must be performed via command line or API calls.
