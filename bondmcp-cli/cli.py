import json
import os
from pathlib import Path

import click
import requests
from rich.console import Console

# Path to store the API key if provided interactively
CONFIG_FILE = Path.home() / ".bondmcp_cli"


def get_api_key() -> str:
    """Retrieve the API key from env or interactive prompt.

    Priority order:
    1. BONDMCP_PUBLIC_API_KEY environment variable
    2. Stored key in CONFIG_FILE
    3. Interactive prompt asking the user
    """

    env_key = os.getenv("BONDMCP_PUBLIC_API_KEY")
    if env_key:
        return env_key

    if CONFIG_FILE.exists():
        try:
            data = json.loads(CONFIG_FILE.read_text())
            stored_key = data.get("api_key")
            if stored_key:
                return stored_key
        except Exception:
            # ignore errors and fallback to prompt
            pass

    # Prompt user for key and store for future use
    api_key = click.prompt("Enter your BondMCP public API key", hide_input=True)
    try:
        CONFIG_FILE.write_text(json.dumps({"api_key": api_key}))
    except Exception:
        pass
    return api_key


@click.group()
def cli():
    """BondMCP Public API CLI"""
    pass

@cli.command()
@click.argument("query")
def ask(query):
    """Send a query to the BondMCP /ask endpoint."""
    api_key = get_api_key()
    base_url = os.getenv("BONDMCP_PUBLIC_API_BASE_URL", "https://api.bondmcp.com")
    url = f"{base_url}/ask"
    resp = requests.post(url, json={"query": query}, headers={"Authorization": f"Bearer {api_key}"})
    if resp.status_code == 200:
        Console().print(resp.json().get("response"))
    else:
        Console().print(f"API error {resp.status_code}: {resp.text}")
        raise SystemExit(1)

if __name__ == "__main__":
    cli()
