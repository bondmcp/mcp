# MCP Server Integration Guide

BondMCP provides a Model Context Protocol (MCP) server that enables AI assistants like Claude to access Health AI capabilities directly. This guide shows you how to connect to BondMCP's MCP server.

## What is MCP?

Model Context Protocol (MCP) is an open standard for connecting AI assistants to external tools and data sources. BondMCP's MCP server allows Claude Desktop and other MCP-compatible clients to use our Health AI APIs seamlessly.

## MCP Server URL

```
https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/.well-known/mcp-configuration
```

## Available MCP Capabilities

BondMCP's MCP server provides these tools to AI assistants:

| Tool | Description | Cost |
|------|-------------|------|
| `health_risk_analysis` | Analyze patient health risks | $0.05 |
| `medication_check` | Check drug interactions | $0.03 |
| `symptom_assessment` | Assess symptoms and triage | $0.04 |
| `treatment_recommendations` | Generate treatment plans | $0.06 |
| `clinical_data_extraction` | Extract structured data from notes | $0.08 |

## Claude Desktop Integration

### Prerequisites

1. Claude Desktop installed ([download here](https://claude.ai/download))
2. BondMCP API key ([get one here](https://bondmcp.com/signup))

### Configuration Steps

#### Step 1: Locate Claude Config File

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```bash
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```bash
~/.config/Claude/claude_desktop_config.json
```

#### Step 2: Add BondMCP Server

Edit the config file and add BondMCP under `mcpServers`:

```json
{
  "mcpServers": {
    "bondmcp": {
      "url": "https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/.well-known/mcp-configuration",
      "apiKey": "YOUR_BONDMCP_API_KEY"
    }
  }
}
```

**Complete example with multiple servers:**

```json
{
  "mcpServers": {
    "bondmcp": {
      "url": "https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/.well-known/mcp-configuration",
      "apiKey": "your_api_key_here"
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/Documents"]
    }
  }
}
```

#### Step 3: Restart Claude Desktop

1. Quit Claude Desktop completely
2. Relaunch the application
3. Verify connection in Settings → Developer → MCP Servers

#### Step 4: Test Integration

Open a new chat and try:

```
Can you analyze the cardiovascular risk for a 55-year-old male patient with:
- BMI: 29
- Blood pressure: 145/92
- Cholesterol: 240
- Current smoker
- Family history of heart disease
```

Claude will automatically use the BondMCP MCP server to analyze the request.

## Using MCP Server Programmatically

### Python MCP Client

Install the MCP SDK:

```bash
pip install mcp
```

Connect to BondMCP's MCP server:

```python
import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    server_params = StdioServerParameters(
        command="mcp-client",
        args=["https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/.well-known/mcp-configuration"],
        env={"BONDMCP_API_KEY": "your_api_key_here"}
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize connection
            await session.initialize()
            
            # List available tools
            tools = await session.list_tools()
            print("Available tools:", [tool.name for tool in tools])
            
            # Call health risk analysis tool
            result = await session.call_tool(
                "health_risk_analysis",
                arguments={
                    "patient_data": {
                        "age": 55,
                        "gender": "male",
                        "bmi": 29.0,
                        "blood_pressure": "145/92",
                        "smoking": True
                    },
                    "analysis_type": "cardiovascular"
                }
            )
            
            print("Risk Analysis Result:", result)

if __name__ == "__main__":
    asyncio.run(main())
```

### TypeScript/JavaScript MCP Client

Install the MCP SDK:

```bash
npm install @modelcontextprotocol/sdk
```

Example integration:

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: "mcp-client",
    args: ["https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/.well-known/mcp-configuration"],
    env: {
      BONDMCP_API_KEY: "your_api_key_here"
    }
  });

  const client = new Client({
    name: "bondmcp-example",
    version: "1.0.0"
  }, {
    capabilities: {}
  });

  await client.connect(transport);

  // List available tools
  const tools = await client.listTools();
  console.log("Available tools:", tools);

  // Call medication check tool
  const result = await client.callTool({
    name: "medication_check",
    arguments: {
      medications: [
        { name: "Warfarin", dosage: "5mg", frequency: "daily" },
        { name: "Aspirin", dosage: "81mg", frequency: "daily" }
      ],
      patient_conditions: ["atrial_fibrillation"]
    }
  });

  console.log("Medication Check Result:", result);

  await client.close();
}

main();
```

## MCP Server Configuration Details

### Server Capabilities

BondMCP MCP server implements:

- ✅ **Tools**: All 5 Health AI endpoints exposed as callable tools
- ✅ **Authentication**: API key-based authentication
- ✅ **Error Handling**: Structured error responses
- ✅ **Rate Limiting**: Respects your plan's rate limits

### Authentication

The MCP server uses your BondMCP API key. Pass it via:

1. **Environment variable** (recommended):
   ```bash
   export BONDMCP_API_KEY="your_api_key_here"
   ```

2. **Config file** (Claude Desktop):
   ```json
   {
     "apiKey": "your_api_key_here"
   }
   ```

3. **Request headers** (programmatic):
   ```python
   headers = {"Authorization": "Bearer your_api_key_here"}
   ```

### Tool Schemas

Each MCP tool has a defined schema. Example for `health_risk_analysis`:

```json
{
  "name": "health_risk_analysis",
  "description": "Analyze patient health risks based on demographics and medical history",
  "inputSchema": {
    "type": "object",
    "properties": {
      "patient_data": {
        "type": "object",
        "properties": {
          "age": { "type": "integer" },
          "gender": { "type": "string" },
          "bmi": { "type": "number" },
          "blood_pressure": { "type": "string" },
          "cholesterol": { "type": "number" },
          "smoking": { "type": "boolean" },
          "family_history": { 
            "type": "array",
            "items": { "type": "string" }
          }
        },
        "required": ["age", "gender"]
      },
      "analysis_type": {
        "type": "string",
        "enum": ["cardiovascular", "diabetes", "general"]
      }
    },
    "required": ["patient_data", "analysis_type"]
  }
}
```

## Troubleshooting

### Connection Issues

**Problem**: MCP server not connecting

**Solutions**:
1. Verify API key is correct
2. Check network connectivity
3. Ensure URL is exactly: `https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/.well-known/mcp-configuration`
4. Restart Claude Desktop

### Authentication Errors

**Problem**: 401 Unauthorized

**Solutions**:
1. Generate a new API key in dashboard
2. Check API key environment variable is set
3. Verify no extra spaces in API key

### Rate Limiting

**Problem**: 429 Too Many Requests

**Solutions**:
1. Check your plan's rate limits
2. Implement exponential backoff
3. Upgrade to higher tier

### Tool Execution Errors

**Problem**: Tool calls failing

**Solutions**:
1. Verify input matches tool schema
2. Check for required fields
3. Ensure sufficient API credits

## Example Use Cases

### Case 1: Clinical Decision Support in Claude

```
User: I have a patient with these symptoms:
- Severe headache (9/10)
- Neck stiffness
- Fever 102°F
- Photophobia

What should I do?

Claude: [Uses symptom_assessment tool via MCP]

Based on the symptom assessment, this is a HIGH URGENCY case with 
strong indicators of bacterial meningitis. 

Recommendations:
1. 🚨 Transfer to emergency department immediately
2. Initiate empiric antibiotic therapy
3. Prepare for lumbar puncture
4. Contact infectious disease specialist

Would you like me to analyze specific treatment protocols?
```

### Case 2: Medication Safety Check

```
User: Check if these medications are safe together:
- Warfarin 5mg daily
- Aspirin 81mg daily  
- Ibuprofen 400mg PRN

Claude: [Uses medication_check tool via MCP]

⚠️ HIGH SEVERITY INTERACTION DETECTED

Warfarin + Aspirin + Ibuprofen = Significantly increased bleeding risk

Recommendation: Avoid NSAIDs (Ibuprofen) in patients on warfarin + aspirin. 
Consider acetaminophen as alternative for pain management.
```

## Advanced Configuration

### Custom Tool Selection

Limit which tools are available:

```json
{
  "mcpServers": {
    "bondmcp": {
      "url": "https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/.well-known/mcp-configuration",
      "apiKey": "your_api_key_here",
      "enabledTools": [
        "symptom_assessment",
        "medication_check"
      ]
    }
  }
}
```

### Cost Monitoring

Track MCP tool usage costs:

```python
import asyncio
from mcp import ClientSession

class CostTrackingSession(ClientSession):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.total_cost = 0.0
    
    async def call_tool(self, name, arguments):
        result = await super().call_tool(name, arguments)
        if "cost" in result:
            self.total_cost += result["cost"]
            print(f"Tool cost: ${result['cost']:.2f} | Total: ${self.total_cost:.2f}")
        return result
```

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for credentials
3. **Rotate API keys** regularly (monthly recommended)
4. **Monitor usage** via dashboard
5. **Set up alerts** for unusual activity

## MCP Server Status

Check server health:

```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/health

# Response
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 99.98
}
```

## Support

- MCP integration issues: support@bondmcp.com
- Claude Desktop help: [Claude Documentation](https://docs.anthropic.com/claude/docs)
- MCP protocol: [MCP Specification](https://modelcontextprotocol.io)
- Status page: https://status.bondmcp.com

## Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Claude Desktop MCP Guide](https://docs.anthropic.com/claude/docs/mcp)
- [BondMCP API Reference](../api-reference/health-ai-apis.md)
- [Python SDK Examples](./python-sdk-example.md)
