// Minimal example showing how to use the Node SDK.
const BondMCP = require('../sdk/bondmcp-node.js');

async function main() {
  const client = new BondMCP.Client('YOUR_API_KEY');

  try {
    const health = await client.health.check();
    console.log('API health:', health);

    const res = await client.ask.query(
      'What are the symptoms of high blood pressure?'
    );
    console.log('Answer:', res.answer);
  } catch (err) {
    console.error('Request failed:', err);
  }
}

main();
