# CLI Tools

Command-line interface for the BondMCP Health AI platform.

## Installation

```bash
pip install bondmcp-cli
```

## Authentication

### Login

```bash
bondmcp auth login
```

### Set API Key

```bash
export BONDMCP_API_KEY="your-api-key"
```

### Check Status

```bash
bondmcp auth status
```

## Core Commands

### Health Questions

```bash
bondmcp ask "What are the benefits of vitamin D?"
```

### Lab Analysis

```bash
bondmcp labs analyze --file "lab_results.json"
```

### Nutrition Analysis

```bash
bondmcp nutrition analyze --meal "grilled chicken, brown rice, broccoli"
```

### Health Data Analysis

```bash
bondmcp analyze --data "blood_pressure: 120/80, heart_rate: 70"
```

### Supplement Recommendations

```bash
bondmcp supplements recommend --goals "energy, immunity"
```

## API Key Management

### Create Key

```bash
bondmcp keys create --name "my-app"
```

### List Keys

```bash
bondmcp keys list
```

### Revoke Key

```bash
bondmcp keys revoke --key-id "key-id"
```

## Usage & Billing

### Check Usage

```bash
bondmcp usage show
```

### Billing Status

```bash
bondmcp billing status
```

## Configuration

### Set Default Options

```bash
bondmcp config set --format json
bondmcp config set --verbose true
```

### View Configuration

```bash
bondmcp config show
```

## Help

### General Help

```bash
bondmcp --help
```

### Command-Specific Help

```bash
bondmcp ask --help
bondmcp labs --help
```

## Examples

### Basic Health Query

```bash
bondmcp ask "Should I take vitamin D supplements?"
```

### Analyze Lab Results

```bash
bondmcp labs analyze --file my_bloodwork.json --format detailed
```

### Get Meal Recommendations

```bash
bondmcp nutrition recommend --goals "weight_loss" --restrictions "gluten_free"
```

### Health Risk Assessment

```bash
bondmcp assess --age 35 --gender male --family_history "diabetes"
```

## No Web Interface

The CLI is the primary interface for BondMCP. There is no web-based dashboard or GUI application.
