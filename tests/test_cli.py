import sys
import types
from pathlib import Path

# Ensure the project root is on the path when running tests directly
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# Provide stub modules for dependencies that aren't installed in the test
# environment.
requests_stub = types.ModuleType("requests")
requests_stub.post = lambda *a, **k: None
sys.modules["requests"] = requests_stub

rich = types.ModuleType("rich")
rich_console = types.ModuleType("rich.console")
class DummyConsole:
    def print(self, *args, **kwargs):
        print(*args)
rich_console.Console = DummyConsole
rich.console = rich_console
sys.modules.setdefault("rich", rich)
sys.modules.setdefault("rich.console", rich_console)

from click.testing import CliRunner
from bondmcp_cli.cli import ask

class DummyResp:
    def __init__(self, status_code, json_data=None, text=""):
        self.status_code = status_code
        self._json_data = json_data or {}
        self.text = text
    def json(self):
        return self._json_data


def test_ask_success(monkeypatch):
    def mock_post(url, json, headers):
        return DummyResp(200, {"response": "hello"})
    monkeypatch.setattr("bondmcp_cli.cli.requests.post", mock_post)
    monkeypatch.setattr("bondmcp_cli.cli.get_api_key", lambda: "key")
    runner = CliRunner()
    result = runner.invoke(ask, ["hi"])
    assert result.exit_code == 0
    assert "hello" in result.output


def test_ask_error(monkeypatch):
    def mock_post(url, json, headers):
        return DummyResp(500, text="fail")
    monkeypatch.setattr("bondmcp_cli.cli.requests.post", mock_post)
    monkeypatch.setattr("bondmcp_cli.cli.get_api_key", lambda: "key")
    runner = CliRunner()
    result = runner.invoke(ask, ["hi"])
    assert result.exit_code == 1
    assert "API error 500: fail" in result.output
