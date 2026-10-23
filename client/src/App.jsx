import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowRight, Bell, Check, CheckCheck, ChevronDown, CircleHelp,
  Clock3, Headphones, Inbox, LayoutDashboard, Menu, MessageCircle,
  MoreHorizontal, Search, Send, Settings2, ShieldCheck, Sparkles, X,
} from 'lucide-react';

const STATUS = {
  open: { label: 'Abierta', className: 'open' },
  pending: { label: 'En espera', className: 'pending' },
  resolved: { label: 'Resuelta', className: 'resolved' },
};
const FILTERS = [
  { key: 'all', label: 'Todas' }, { key: 'open', label: 'Abiertas' },
  { key: 'pending', label: 'En espera' }, { key: 'resolved', label: 'Resueltas' },
];
const initialsColor = ['#e1eafc', '#e9e5fe', '#d9f4ef', '#ffeadb', '#fce0e8'];
const formatClock = (value) => new Date(value).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
const relativeTime = (value) => {
  const min = Math.max(0, Math.round((Date.now() - Date.parse(value)) / 60_000));
  if (min < 1) return 'Ahora';
  if (min < 60) return `Hace ${min} min`;
  if (min < 1440) return `Hace ${Math.floor(min / 60)} h`;
  return 'Ayer';
};
async function api(path, options) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'No se pudo completar la solicitud');
  }
  return response.json();
}
function Avatar({ conversation, large = false }) {
  const index = Math.abs(Number(conversation.id?.replace(/\D/g, '') || 0)) % initialsColor.length;
  return <div className={`avatar ${large ? 'avatar-large' : ''}`} style={{ background: initialsColor[index] }} aria-hidden="true">{conversation.initials}</div>;
}
function App() {
  const [conversations, setConversations] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, pending: 0, resolved: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const reload = useCallback(async () => {
    const [list, totals] = await Promise.all([api('/conversations'), api('/stats')]);
    setConversations(list); setStats(totals);
    setSelectedId(id => id ?? list[0]?.id ?? null);
  }, []);
  useEffect(() => {
    reload().catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [reload]);
  useEffect(() => {
    if (!selectedId) return;
    setDetail(null);
    api(`/conversations/${selectedId}`).then(setDetail).catch(e => setError(e.message));
  }, [selectedId]);

  const filtered = useMemo(() => conversations.filter(c => {
    const validFilter = filter === 'all' || c.status === filter;
    const haystack = `${c.name} ${c.company} ${c.topic} ${c.channel}`.toLowerCase();
    return validFilter && haystack.includes(search.trim().toLowerCase());
  }), [conversations, filter, search]);

  const updateStatus = async (status) => {
    if (!selectedId || busy) return;
    setBusy(true); setError('');
    try {
      const updated = await api(`/conversations/${selectedId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setDetail(updated); await reload();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };
  const send = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selectedId || busy) return;
    setBusy(true); setError('');
    try {
      const id = selectedId;
      await api(`/conversations/${id}/messages`, { method: 'POST', body: JSON.stringify({ text }) });
      const fresh = await api(`/conversations/${id}`);
      setDetail(fresh); setDraft(''); await reload();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };
  return <div className="app-shell">
    <aside className={`sidebar ${showMenu ? 'sidebar-mobile' : ''}`}>
      <div className="brand"><div className="brand-symbol"><MessageCircle size={22} strokeWidth={2.7}/></div><div>conversa<span>desk</span><small>WORKSPACE</small></div></div>
      <div className="nav-title">GENERAL</div>
      <div className="nav-item"><LayoutDashboard size={19}/> Resumen</div>
      <div className="nav-item active"><Inbox size={19}/> Bandeja de entrada <span className="nav-number">{stats.open}</span></div>
      <div className="nav-item"><Activity size={19}/> Actividad</div>
      <div className="nav-title second">ESPACIO DE TRABAJO</div>
      <div className="nav-item"><Settings2 size={19}/> Preferencias</div>
      <div className="sidebar-bottom"><div className="sidebar-note"><div className="note-icon"><Sparkles size={17}/></div><strong>Tu espacio, en orden</strong><p>Responde consultas, organiza estados y mantén el contexto en un solo lugar.</p><span>DEMO INTERACTIVA</span></div><div className="sidebar-profile"><div className="profile-avatar">HA</div><div><strong>Hillary Almachi</strong><small>Proyecto de portafolio</small></div><MoreHorizontal size={17}/></div></div>
    </aside>

    <div className="main-column">
      <header className="topbar"><div className="breadcrumbs"><button className="icon-btn mobile-menu" onClick={() => setShowMenu(!showMenu)} aria-label="Abrir navegación"><Menu size={19}/></button> Espacio de trabajo <span>/</span><strong>Bandeja de entrada</strong></div><div className="top-actions"><div className="demo-label"><span className="live-dot"/> Datos de ejemplo</div><Bell size={19}/><div className="profile-avatar mini">HA</div></div></header>
      <main className="workspace">
        <div className="heading-row"><div><div className="eyebrow">CENTRO DE CONVERSACIONES</div><h1>Tu bandeja, bajo control <span className="wave">✳</span></h1><p>Organiza conversaciones y brinda una atención más cercana.</p></div><span className="date-pill"><Clock3 size={16}/> Proyecto demostrativo</span></div>
        <section className="stats-grid" aria-label="Resumen de conversaciones">
          <div className="stat-card"><div className="stat-title">Conversaciones <Inbox size={18}/></div><div className="stat-value">{stats.total}<span className="stat-footnote">registradas</span></div><div className="stat-helper">En todos los canales</div></div>
          <div className="stat-card"><div className="stat-title">Abiertas <MessageCircle size={18}/></div><div className="stat-value">{stats.open}<span className="mini-chip purple">Por atender</span></div><div className="stat-helper">Requieren seguimiento</div></div>
          <div className="stat-card"><div className="stat-title">En espera <Clock3 size={18}/></div><div className="stat-value">{stats.pending}<span className="mini-chip amber">Pendiente</span></div><div className="stat-helper">Esperando información</div></div>
          <div className="stat-card"><div className="stat-title">Resueltas <CheckCheck size={18}/></div><div className="stat-value">{stats.resolved}<span className="mini-chip green">Completadas</span></div><div className="stat-helper">Conversaciones cerradas</div></div>
        </section>
        <section className="desk-panel">
          <div className="panel-title-row"><div><h2>Conversaciones</h2><p>Selecciona una conversación para ver sus detalles</p></div><div className="panel-tag"><span className="live-dot"/> Actualización local</div></div>
          <div className="desk-grid">
<div className="conversation-list">
  <div className="list-toolbar">
    <div className="search-box">
      <Search size={17} />

      <input
        aria-label="Buscar conversaciones"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar conversación..."
      />

      {search && (
        <button
          type="button"
          onClick={() => setSearch('')}
          aria-label="Limpiar búsqueda"
          title="Limpiar búsqueda"
          style={{
            border: 0,
            background: 'transparent',
            color: '#7563ee',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>

    <button
      aria-label="Opciones de búsqueda"
      className="toolbar-square"
      disabled
      title="Usa las pestañas para filtrar"
    >
      <ChevronDown size={18} />
    </button>
  </div>

  <div className="filter-tabs">
    {FILTERS.map(item => (
      <button
        key={item.key}
        className={filter === item.key ? 'tab active' : 'tab'}
        onClick={() => setFilter(item.key)}
      >
        {item.label}
      </button>
    ))}
  </div>
              <div className="items">{loading ? <p className="empty">Cargando...</p> : filtered.length ? filtered.map(c => <button key={c.id} className={`conversation-item ${selectedId === c.id ? 'selected' : ''}`} onClick={() => { setSelectedId(c.id); setDraft(''); setError(''); }}><Avatar conversation={c}/><div className="item-content"><div className="item-top"><strong>{c.name}</strong><small>{relativeTime(c.updatedAt)}</small></div><div className="item-company">{c.company} <span>·</span> {c.channel}</div><div className="item-preview">{c.lastMessage}</div><div className="item-footer"><span className={`status-badge ${STATUS[c.status].className}`}>{STATUS[c.status].label}</span>{c.priority === 'high' && <span className="priority">Prioridad alta</span>}</div></div></button>) : <p className="empty">No encontramos conversaciones con ese filtro.</p>}</div>
              <div className="list-footer">Mostrando {filtered.length} de {conversations.length} conversaciones</div>
            </div>
            <div className="conversation-detail">{detail && detail.id === selectedId ? <>
              <div className="chat-header"><Avatar conversation={detail} large/><div className="chat-person"><h3>{detail.name}</h3><p>{detail.company} <span>·</span> {detail.channel}</p></div><span className={`status-badge ${STATUS[detail.status].className}`}>{STATUS[detail.status].label}</span></div>
              <div className="context-banner"><div className="context-symbol"><Headphones size={17}/></div><div><strong>Asunto de la conversación</strong><p>{detail.topic}</p></div></div>
              <div className="chat-scroll" aria-label="Mensajes de la conversación"><div className="day-divider"><span>HOY</span></div>{detail.messages.map(m => <div key={m.id} className={`message-row ${m.direction === 'outbound' ? 'outgoing' : ''}`}><div className="message-bubble"><p>{m.text}</p><div className="message-time">{formatClock(m.at)} {m.direction === 'outbound' && <CheckCheck size={14}/>}</div></div></div>)}</div>
              <div className="composer-wrapper"><form onSubmit={send} className="composer"><input value={draft} maxLength={1000} onChange={e => setDraft(e.target.value)} placeholder="Escribe una respuesta..." aria-label="Escribe una respuesta"/><button type="submit" disabled={!draft.trim() || busy} aria-label="Enviar respuesta"><Send size={17}/></button></form><div className="composer-footer"><span><ShieldCheck size={14}/> Simulación: no se envían mensajes reales</span><select aria-label="Estado de conversación" value={detail.status} onChange={e => updateStatus(e.target.value)} disabled={busy}><option value="open">Abierta</option><option value="pending">En espera</option><option value="resolved">Resuelta</option></select></div></div>
            </> : <div className="detail-empty">{loading ? 'Cargando conversación...' : 'Selecciona una conversación para comenzar.'}</div>}</div>
          </div>
        </section>
        {error && <div className="error-alert" role="alert">{error} <button onClick={() => setError('')} aria-label="Cerrar error"><X size={15}/></button></div>}
        <footer className="footer"><span>ConversaDesk · Proyecto educativo full stack</span><span>Diseñado para aprender React + Node.js + Express <ArrowRight size={14}/></span></footer>
      </main>
    </div>
  </div>;
}
export default App;
