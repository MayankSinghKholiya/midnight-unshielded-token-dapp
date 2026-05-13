const base = process.env.VITE_CONTRACT_API_URL ?? 'http://localhost:4000/api';

async function request(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!res.ok) {
    throw new Error(`${path} failed: ${JSON.stringify(data)}`);
  }

  return data;
}

console.log(`Smoke testing local API at ${base}`);
console.log(await request('/state'));
console.log(await request('/mint', { amount: '1000' }));
console.log(await request('/send', { recipient: 'mn_addr_preprod1exampleuseraddressreplacewithrealaddress', amount: '100' }));
console.log(await request('/receive', { amount: '50' }));
console.log(await request('/state'));
console.log('Local API smoke test passed.');
