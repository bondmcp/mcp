import json
import sys
from pathlib import Path
import pytest
import requests

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import bondmcp_sdk as bondmcp


class DummyResponse:
    def __init__(self, status_code, payload):
        self.status_code = status_code
        self._payload = payload
        self.text = json.dumps(payload)
        self.headers = {}

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

    monkeypatch.setattr(bondmcp.client.requests, "get", fake_get)
    result = client.request("get", "/test")
    assert result == {"ok": True}
    assert calls["url"] == "https://example.com/test"


def test_request_http_error(monkeypatch):
    client = bondmcp.BondMCPClient("k", base_url="https://example.com")

    def fake_get(url, headers=None, params=None, timeout=None):
        return DummyResponse(404, {"error": {"message": "bad", "code": "404"}})

    monkeypatch.setattr(bondmcp.client.requests, "get", fake_get)
    with pytest.raises(bondmcp.BondMCPAPIError) as exc:
        client.request("get", "/test")
    assert exc.value.status_code == 404
    assert exc.value.code == "404"


def test_request_network_error(monkeypatch):
    client = bondmcp.BondMCPClient("k", base_url="https://example.com")

    def fake_get(url, headers=None, params=None, timeout=None):
        raise requests.exceptions.ConnectionError

    monkeypatch.setattr(bondmcp.client.requests, "get", fake_get)
    with pytest.raises(bondmcp.BondMCPNetworkError):
        client.request("get", "/test")


def test_request_retry_on_rate_limit(monkeypatch):
    client = bondmcp.BondMCPClient(
        "k", base_url="https://example.com", max_retries=2, retry_delay=0
    )

    calls = {"count": 0}

    def fake_get(url, headers=None, params=None, timeout=None):
        calls["count"] += 1
        if calls["count"] == 1:
            resp = DummyResponse(429, {"error": {"message": "limit", "code": "429"}})
            resp.headers = {"Retry-After": "0"}
            return resp
        return DummyResponse(200, {"ok": True})

    monkeypatch.setattr(requests, "get", fake_get, raising=False)
    result = client.request("get", "/test")
    assert result == {"ok": True}
    assert calls["count"] == 2


def test_request_retry_exhausts(monkeypatch):
    client = bondmcp.BondMCPClient(
        "k", base_url="https://example.com", max_retries=1, retry_delay=0
    )

    def fake_get(url, headers=None, params=None, timeout=None):
        resp = DummyResponse(429, {"error": {"message": "limit", "code": "429"}})
        resp.headers = {"Retry-After": "0"}
        return resp

    monkeypatch.setattr(requests, "get", fake_get, raising=False)
    with pytest.raises(bondmcp.BondMCPAPIError) as exc:
        client.request("get", "/test")
    assert exc.value.status_code == 429
