import os

try:
    import keyring
except Exception:  # pragma: no cover - optional dependency may be missing
    keyring = None

import click
import requests
from rich.console import Console


def get_api_key() -> str:
    """Retrieve the API key from env, keyring or interactive prompt."""

    env_key = os.getenv("BONDMCP_PUBLIC_API_KEY")
    if env_key:
        return env_key

    if keyring is not None:
        try:
            stored_key = keyring.get_password("bondmcp_cli", "api_key")
            if stored_key:
                return stored_key
        except Exception:
            # ignore errors and fallback to prompt
            pass

    api_key = click.prompt("Enter your BondMCP public API key", hide_input=True)

    if keyring is not None:
        try:
            keyring.set_password("bondmcp_cli", "api_key", api_key)
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
