import os
import sys
from pathlib import Path
from click.testing import CliRunner

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from bondmcp_cli.cli import cli
import bondmcp_cli.cli as cli_module


def test_ask_success(monkeypatch):
    runner = CliRunner()

    def fake_post(url, json=None, headers=None):
        class Resp:
            status_code = 200

            def json(self):
                return {"response": "hello"}

        return Resp()

    monkeypatch.setattr(cli_module.requests, "post", fake_post)
    result = runner.invoke(cli, ["ask", "hi"], env={"BONDMCP_PUBLIC_API_KEY": "k"})
    assert result.exit_code == 0
    assert "hello" in result.output


def test_ask_error(monkeypatch):
    runner = CliRunner()

    def fake_post(url, json=None, headers=None):
        class Resp:
            status_code = 400
            text = "bad"

            def json(self):
                return {}

        return Resp()

    monkeypatch.setattr(cli_module.requests, "post", fake_post)
    result = runner.invoke(cli, ["ask", "hi"], env={"BONDMCP_PUBLIC_API_KEY": "k"})
    assert result.exit_code == 1
    assert "API error 400: bad" in result.output
