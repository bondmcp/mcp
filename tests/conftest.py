import sys
import types

class _Exc:
    HTTPError = type("HTTPError", (Exception,), {})
    ConnectionError = type("ConnectionError", (Exception,), {})
    Timeout = type("Timeout", (Exception,), {})
    RequestException = type("RequestException", (Exception,), {})

requests_stub = types.SimpleNamespace(
    exceptions=_Exc,
    get=lambda *a, **k: None,
    post=lambda *a, **k: None,
    put=lambda *a, **k: None,
    delete=lambda *a, **k: None,
)

sys.modules.setdefault("requests", requests_stub)

console_stub = types.SimpleNamespace(
    Console=type("Console", (), {"print": staticmethod(print)})
)
rich_stub = types.SimpleNamespace(console=console_stub)
sys.modules.setdefault("rich", rich_stub)
sys.modules.setdefault("rich.console", console_stub)
