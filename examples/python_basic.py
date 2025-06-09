"""Minimal example showing how to use the Python SDK."""

from bondmcp_sdk import BondMCPClient


def main() -> None:
    """Run a simple health check and ask a question."""
    client = BondMCPClient(api_key="YOUR_API_KEY")

    try:
        health = client.health.check()
        print("API health:", health)

        response = client.ask.query(
            "What are the symptoms of high blood pressure?"
        )
        print("Answer:", response.get("answer"))
    except Exception as exc:
        print("Request failed:", exc)


if __name__ == "__main__":
    main()
