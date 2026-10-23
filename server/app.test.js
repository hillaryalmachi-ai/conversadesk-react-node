import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './app.js';

async function withServer(check) {
  const server = createApp().listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await check(base); }
  finally { await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve())); }
}

test('GET /api/health responde correctamente', async () => withServer(async base => {
  const response = await fetch(`${base}/api/health`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
}));

test('lista conversaciones y estadísticas coherentes', async () => withServer(async base => {
  const conversations = await (await fetch(`${base}/api/conversations`)).json();
  const stats = await (await fetch(`${base}/api/stats`)).json();
  assert.equal(conversations.length, stats.total);
  assert.equal(stats.total, stats.open + stats.pending + stats.resolved);
}));

test('responder y cambiar estado modifica la conversación', async () => withServer(async base => {
  const id = 'c-101';
  const message = await fetch(`${base}/api/conversations/${id}/messages`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: '  Prueba de respuesta  ' })
  });
  assert.equal(message.status, 201);
  assert.equal((await message.json()).text, 'Prueba de respuesta');
  const change = await fetch(`${base}/api/conversations/${id}/status`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'resolved' })
  });
  assert.equal(change.status, 200);
  assert.equal((await change.json()).status, 'resolved');
}));

test('rechaza mensajes vacíos, estados inválidos y recursos inexistentes', async () => withServer(async base => {
  const options = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  assert.equal((await fetch(`${base}/api/conversations/c-101/messages`, options('POST', {text: '  '}))).status, 400);
  assert.equal((await fetch(`${base}/api/conversations/c-101/status`, options('PATCH', {status: 'deleted'}))).status, 400);
  assert.equal((await fetch(`${base}/api/conversations/unknown`)).status, 404);
}));
