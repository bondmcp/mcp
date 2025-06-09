import pytest
import sys
from pathlib import Path
import requests
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import bondmcp_sdk

BondMCPClient = bondmcp_sdk.BondMCPClient


class DummyResp:
    def __init__(self, data):
        self.data = data
        self.status_code = 200

    def json(self):
        return self.data

    def raise_for_status(self):
        pass


def test_request_get(monkeypatch):
    captured = {}

    def fake_get(url, headers=None, params=None, timeout=None):
        captured['url'] = url
        captured['headers'] = headers
        captured['params'] = params
        captured['timeout'] = timeout
        return DummyResp({'ok': True})

    monkeypatch.setattr(requests, 'get', fake_get, raising=False)

    client = BondMCPClient('KEY', base_url='http://example')
    resp = client.request('get', '/foo', params={'a': 1})

    assert resp == {'ok': True}
    assert captured['url'] == 'http://example/foo'
    assert captured['params'] == {'a': 1}
    assert captured['headers']['Authorization'] == 'Bearer KEY'


def test_request_post(monkeypatch):
    captured = {}

    def fake_post(url, headers=None, json=None, timeout=None):
        captured['url'] = url
        captured['headers'] = headers
        captured['json'] = json
        captured['timeout'] = timeout
        return DummyResp({'ok': True})

    monkeypatch.setattr(requests, 'post', fake_post, raising=False)

    client = BondMCPClient('KEY', base_url='http://example')
    resp = client.request('post', '/bar', data={'x': 2})

    assert resp == {'ok': True}
    assert captured['url'] == 'http://example/bar'
    assert captured['json'] == {'x': 2}
    assert captured['headers']['Authorization'] == 'Bearer KEY'
