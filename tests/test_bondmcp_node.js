const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');

function loadWithMock(captured) {
  const mockAxios = {
    create(config) {
      captured.config = config;
      return {
        request: async (opts) => {
          captured.request = opts;
          return { data: { ok: true } };
        }
      };
    }
  };
  const originalRequire = Module.prototype.require;
  Module.prototype.require = function(path) {
    if (path === 'axios') return mockAxios;
    return originalRequire.apply(this, arguments);
  };
  delete require.cache[require.resolve('../bondmcp_sdk/bondmcp-node.js')];
  const sdk = require('../bondmcp_sdk/bondmcp-node.js');
  Module.prototype.require = originalRequire;
  return sdk;
}

test('POST request builds correct options', async () => {
  const captured = {};
  const sdk = loadWithMock(captured);
  const client = new sdk.Client('KEY', { baseURL: 'http://example' });
  const data = { foo: 'bar' };
  const res = await client.request('post', '/test', data);
  assert.strictEqual(captured.config.baseURL, 'http://example');
  assert.strictEqual(captured.config.headers.Authorization, 'Bearer KEY');
  assert.strictEqual(captured.request.method, 'post');
  assert.strictEqual(captured.request.url, '/test');
  assert.deepStrictEqual(captured.request.data, data);
  assert.deepStrictEqual(res, { ok: true });
});

test('GET request uses params', async () => {
  const captured = {};
  const sdk = loadWithMock(captured);
  const client = new sdk.Client('KEY', { baseURL: 'http://example' });
  const params = { a: 1 };
  const res = await client.request('get', '/foo', params);
  assert.strictEqual(captured.request.method, 'get');
  assert.strictEqual(captured.request.url, '/foo');
  assert.deepStrictEqual(captured.request.params, params);
  assert.strictEqual(captured.request.data, undefined);
  assert.deepStrictEqual(res, { ok: true });
});
