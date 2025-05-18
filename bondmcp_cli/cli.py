import os
import click
import requests
from rich.console import Console


@click.group()
def cli():
    """BondMCP Public API CLI"""
    pass

@cli.command()
@click.argument("query")
def ask(query):
    """Send a query to the BondMCP /ask endpoint."""
    api_key = os.getenv("BONDMCP_PUBLIC_API_KEY")
    if not api_key:
        click.echo("BONDMCP_PUBLIC_API_KEY not set", err=True)
        raise SystemExit(1)
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
