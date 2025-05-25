import importlib.util
from pathlib import Path
import sys
import types

# Ensure the project root is on the path when running tests directly
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import pytest

# Provide a minimal stub of the requests library since it isn't available in the
# execution environment.
class HTTPError(Exception):
    def __init__(self, *args, response=None, **kwargs):
        super().__init__(*args)
        self.response = response

class ConnectionError(Exception):
    pass

class Timeout(Exception):
    pass

class RequestException(Exception):
    pass

requests_stub = types.ModuleType("requests")
requests_stub.exceptions = types.SimpleNamespace(
    HTTPError=HTTPError,
    ConnectionError=ConnectionError,
    Timeout=Timeout,
    RequestException=RequestException,
)
requests_stub.get = lambda *a, **k: None
requests_stub.post = lambda *a, **k: None
sys.modules["requests"] = requests_stub
requests = requests_stub

spec = importlib.util.spec_from_file_location(
    "bondmcp_python", Path(__file__).resolve().parents[1] / "sdk" / "bondmcp-python.py"
)
bondmcp_python = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bondmcp_python)

BondMCPClient = bondmcp_python.BondMCPClient
BondMCPAPIError = bondmcp_python.BondMCPAPIError


class MockResponse:
    def __init__(self, json_data=None, status_code=200, exc=None):
        self._json = json_data or {}
        self.status_code = status_code
        self.exc = exc
        self.text = "err"

    def json(self):
        return self._json

    def raise_for_status(self):
        if self.exc:
            raise self.exc


def test_request_success(monkeypatch):
    client = BondMCPClient("k", base_url="https://example.com")

    def mock_get(url, headers=None, params=None, timeout=None):
        return MockResponse({"ok": True})

    monkeypatch.setattr(bondmcp_python.requests, "get", mock_get)
    assert client.request("get", "/health") == {"ok": True}


def test_request_http_error(monkeypatch):
    client = BondMCPClient("k")

    def mock_post(url, headers=None, json=None, timeout=None):
        resp = MockResponse({"error": {"message": "bad", "code": "bad", "details": {"a": 1}}}, status_code=400)
        error = requests.exceptions.HTTPError(response=resp)
        resp.exc = error
        return resp

    monkeypatch.setattr(bondmcp_python.requests, "post", mock_post)

    with pytest.raises(BondMCPAPIError) as exc:
        client.request("post", "/test")

    err = exc.value
    assert err.status_code == 400
    assert err.code == "bad"
    assert err.details == {"a": 1}
    assert str(err) == "bad"
