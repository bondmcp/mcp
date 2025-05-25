from click.testing import CliRunner
import sys
import types

if "requests" not in sys.modules:
    requests_stub = types.ModuleType("requests")
    requests_stub.post = lambda *a, **k: None
    sys.modules["requests"] = requests_stub

if "rich" not in sys.modules:
    rich_stub = types.ModuleType("rich")
    console_mod = types.ModuleType("rich.console")
    class DummyConsole:
        def print(self, *args, **kwargs):
            print(*args)
    console_mod.Console = DummyConsole
    sys.modules["rich"] = rich_stub
    sys.modules["rich.console"] = console_mod

from bondmcp_cli.cli import cli

class DummyResponse:
    def __init__(self, status_code, json_data=None, text=""):
        self.status_code = status_code
        self._json_data = json_data or {}
        self.text = text
    def json(self):
        return self._json_data


def test_ask_success(monkeypatch):
    def fake_post(url, json, headers):
        assert json == {"query": "hello"}
        assert "Authorization" in headers
        return DummyResponse(200, {"response": "hi"})
    monkeypatch.setattr("bondmcp_cli.cli.requests.post", fake_post)
    runner = CliRunner()
    env = {
        "BONDMCP_PUBLIC_API_KEY": "token",
        "BONDMCP_PUBLIC_API_BASE_URL": "https://example.com",
    }
    result = runner.invoke(cli, ["ask", "hello"], env=env)
    assert result.exit_code == 0
    assert "hi" in result.output


def test_ask_error(monkeypatch):
    def fake_post(url, json, headers):
        return DummyResponse(500, text="bad")
    monkeypatch.setattr("bondmcp_cli.cli.requests.post", fake_post)
    runner = CliRunner()
    env = {"BONDMCP_PUBLIC_API_KEY": "token"}
    result = runner.invoke(cli, ["ask", "hello"], env=env)
    assert result.exit_code != 0
    assert "API error 500" in result.output
