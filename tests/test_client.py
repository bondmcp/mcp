import json
import importlib.util
from pathlib import Path
import sys
import requests
import pytest

ROOT = Path(__file__).resolve().parent.parent
SDK_DIR = ROOT / "sdk"
if str(SDK_DIR) not in sys.path:
    sys.path.insert(0, str(SDK_DIR))
spec = importlib.util.spec_from_file_location(
    "sdk.bondmcp_python_stub",
    SDK_DIR / "bondmcp-python.py",
)
bondmcp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bondmcp)


class DummyResponse:
    def __init__(self, status_code, payload):
        self.status_code = status_code
        self._payload = payload
        self.text = json.dumps(payload)

    def json(self):
        return self._payload

    def raise_for_status(self):
        if self.status_code >= 400:
            err = requests.exceptions.HTTPError("error")
            err.response = self
            raise err


def test_request_success(monkeypatch):
    client = bondmcp.BondMCPClient("k", base_url="https://example.com")

    calls = {}

    def fake_get(url, headers=None, params=None, timeout=None):
        calls["url"] = url
        return DummyResponse(200, {"ok": True})

    monkeypatch.setattr(bondmcp.requests, "get", fake_get)
    result = client.request("get", "/test")
    assert result == {"ok": True}
    assert calls["url"] == "https://example.com/test"


def test_request_http_error(monkeypatch):
    client = bondmcp.BondMCPClient("k", base_url="https://example.com")

    def fake_get(url, headers=None, params=None, timeout=None):
        return DummyResponse(404, {"error": {"message": "bad", "code": "404"}})

    monkeypatch.setattr(bondmcp.requests, "get", fake_get)
    with pytest.raises(bondmcp.BondMCPAPIError) as exc:
        client.request("get", "/test")
    assert exc.value.status_code == 404
    assert exc.value.code == "404"


def test_request_network_error(monkeypatch):
    client = bondmcp.BondMCPClient("k", base_url="https://example.com")

    def fake_get(url, headers=None, params=None, timeout=None):
        raise requests.exceptions.ConnectionError

    monkeypatch.setattr(bondmcp.requests, "get", fake_get)
    with pytest.raises(bondmcp.BondMCPNetworkError):
        client.request("get", "/test")
