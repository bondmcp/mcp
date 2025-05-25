import json
from pathlib import Path
import sys
import types

# Ensure project root is on sys.path
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import pytest

# Provide stub modules for requests and rich.console if not installed
if 'requests' not in sys.modules:
    sys.modules['requests'] = types.ModuleType('requests')
if 'rich.console' not in sys.modules:
    rich_console = types.ModuleType('rich.console')
    class DummyConsole:
        def print(self, *a, **k):
            pass
    rich_console.Console = DummyConsole
    sys.modules['rich.console'] = rich_console

from bondmcp_cli import cli


def test_get_api_key_env(monkeypatch, tmp_path):
    monkeypatch.setenv("BONDMCP_PUBLIC_API_KEY", "ENVKEY")
    monkeypatch.setattr(cli, "CONFIG_FILE", tmp_path / "config")
    monkeypatch.setattr(cli.click, "prompt", lambda *a, **k: pytest.fail("prompt called"))
    assert cli.get_api_key() == "ENVKEY"


def test_get_api_key_file(monkeypatch, tmp_path):
    monkeypatch.delenv("BONDMCP_PUBLIC_API_KEY", raising=False)
    cfg = tmp_path / "config"
    cfg.write_text(json.dumps({"api_key": "FILEKEY"}))
    monkeypatch.setattr(cli, "CONFIG_FILE", cfg)
    monkeypatch.setattr(cli.click, "prompt", lambda *a, **k: pytest.fail("prompt called"))
    assert cli.get_api_key() == "FILEKEY"


def test_get_api_key_prompt(monkeypatch, tmp_path):
    monkeypatch.delenv("BONDMCP_PUBLIC_API_KEY", raising=False)
    cfg = tmp_path / "config"
    monkeypatch.setattr(cli, "CONFIG_FILE", cfg)
    monkeypatch.setattr(cli.click, "prompt", lambda *a, **k: "PROMPTKEY")
    assert cli.get_api_key() == "PROMPTKEY"
    saved = json.loads(cfg.read_text())
    assert saved == {"api_key": "PROMPTKEY"}
