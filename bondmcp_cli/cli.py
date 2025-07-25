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
            pass

    api_key = click.prompt("Enter your BondMCP public API key", hide_input=True)
    try:
        fd = os.open(
            str(CONFIG_FILE),
            os.O_WRONLY | os.O_CREAT | os.O_TRUNC,
            0o600,
        )
        with os.fdopen(fd, "w") as f:
            f.write(json.dumps({"api_key": api_key}))
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
    """Send a question to the `/ask` endpoint."""
    api_key = get_api_key()
    base_url = os.getenv("BONDMCP_PUBLIC_API_BASE_URL", "https://api.bondmcp.com")
    url = f"{base_url}/ask"
    resp = requests.post(
        url,
        json={"query": query},
        headers={"X-API-Key": api_key},
    )
    if resp.status_code == 200:
        Console().print(resp.json().get("response"))
    else:
        Console().print(f"API error {resp.status_code}: {resp.text}")
        raise SystemExit(1)


@cli.command(name="labs-interpret")
@click.argument("labs", type=click.Path(exists=True))
@click.option(
    "--context",
    type=click.Path(exists=True),
    help="Optional JSON file with patient context information.",
)
def labs_interpret(labs, context):
    """Interpret lab results via `/labs/interpret`."""
    api_key = get_api_key()
    base_url = os.getenv("BONDMCP_PUBLIC_API_BASE_URL", "https://api.bondmcp.com")
    url = f"{base_url}/labs/interpret"

    payload = {"lab_results": json.loads(Path(labs).read_text())}
    if context:
        payload["patient_context"] = json.loads(Path(context).read_text())

    resp = requests.post(url, json=payload, headers={"X-API-Key": api_key})
    if resp.status_code == 200:
        Console().print_json(data=resp.json())
    else:
        Console().print(f"API error {resp.status_code}: {resp.text}")
        raise SystemExit(1)


@cli.command(name="supplement-recommend")
@click.argument("health_goals", nargs=-1)
@click.option(
    "--labs",
    type=click.Path(exists=True),
    help="Path to JSON file with current lab results.",
)
@click.option(
    "--current-supplements",
    type=click.Path(exists=True),
    help="JSON file with a list of current supplements.",
)
@click.option(
    "--dietary-restrictions",
    type=click.Path(exists=True),
    help="JSON file with dietary restrictions.",
)
@click.option(
    "--context",
    type=click.Path(exists=True),
    help="Optional JSON file with patient context.",
)
def supplement_recommend(
    health_goals,
    labs,
    current_supplements,
    dietary_restrictions,
    context,
):
    """Get supplement recommendations via `/supplement/recommend`."""
    api_key = get_api_key()
    base_url = os.getenv("BONDMCP_PUBLIC_API_BASE_URL", "https://api.bondmcp.com")
    url = f"{base_url}/supplement/recommend"

    payload = {"health_goals": list(health_goals)}
    if labs:
        payload["current_labs"] = json.loads(Path(labs).read_text())
    if current_supplements:
        payload["current_supplements"] = json.loads(
            Path(current_supplements).read_text()
        )
    if dietary_restrictions:
        payload["dietary_restrictions"] = json.loads(
            Path(dietary_restrictions).read_text()
        )
    if context:
        payload["patient_context"] = json.loads(Path(context).read_text())

    resp = requests.post(url, json=payload, headers={"X-API-Key": api_key})
    if resp.status_code == 200:
        Console().print_json(data=resp.json())
    else:
        Console().print(f"API error {resp.status_code}: {resp.text}")
        raise SystemExit(1)


@cli.command()
def health():
    """Check API health via `/health`."""
    api_key = get_api_key()
    base_url = os.getenv("BONDMCP_PUBLIC_API_BASE_URL", "https://api.bondmcp.com")
    url = f"{base_url}/health"
    resp = requests.get(url, headers={"X-API-Key": api_key})
    if resp.status_code == 200:
        Console().print_json(data=resp.json())
    else:
        Console().print(f"API error {resp.status_code}: {resp.text}")
        raise SystemExit(1)


if __name__ == "__main__":
    cli()
