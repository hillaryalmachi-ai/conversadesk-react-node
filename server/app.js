import express from 'express';
import { randomUUID } from 'node:crypto';
import { seedConversations } from './data.js';

const VALID_STATUS = new Set(['open', 'pending', 'resolved']);

export function createApp() {
  const app = express();
  // Los datos solo se mantienen en memoria; al reiniciar vuelven al ejemplo inicial.
  const conversations = structuredClone(seedConversations);
  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  const summary = (c) => ({
    id: c.id, name: c.name, company: c.company, initials: c.initials,
    channel: c.channel, topic: c.topic, priority: c.priority, status: c.status,
    lastMessage: c.messages.at(-1)?.text ?? '',
    updatedAt: c.messages.at(-1)?.at ?? null,
    messagesCount: c.messages.length
  });

  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'conversadesk-api' }));
  app.get('/api/conversations', (_req, res) => {
    res.json(conversations.map(summary).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)));
  });
  app.get('/api/conversations/:id', (req, res) => {
    const conversation = conversations.find(c => c.id === req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversación no encontrada' });
    return res.json(conversation);
  });
  app.get('/api/stats', (_req, res) => {
    res.json({ total: conversations.length,
      open: conversations.filter(c => c.status === 'open').length,
      pending: conversations.filter(c => c.status === 'pending').length,
      resolved: conversations.filter(c => c.status === 'resolved').length });
  });
  app.patch('/api/conversations/:id/status', (req, res) => {
    const conversation = conversations.find(c => c.id === req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversación no encontrada' });
    if (!VALID_STATUS.has(req.body?.status)) {
      return res.status(400).json({ error: 'Estado inválido. Usa open, pending o resolved.' });
    }
    conversation.status = req.body.status;
    return res.json(conversation);
  });
  app.post('/api/conversations/:id/messages', (req, res) => {
    const conversation = conversations.find(c => c.id === req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversación no encontrada' });
    const messageText = req.body?.text;
    if (typeof messageText !== 'string' || !messageText.trim() || messageText.trim().length > 1000) {
      return res.status(400).json({ error: 'Escribe un mensaje de entre 1 y 1000 caracteres.' });
    }
    const message = { id: randomUUID(), direction: 'outbound', text: messageText.trim(), at: new Date().toISOString() };
    conversation.messages.push(message);
    return res.status(201).json(message);
  });
  app.use((err, _req, res, _next) => {
    if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'JSON inválido' });
    console.error(err);
    return res.status(500).json({ error: 'Error interno' });
  });
  return app;
}
