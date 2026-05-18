'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DEFAULT_ARTICLES, DEFAULT_TEAM, DEFAULT_PARTNERS, DEFAULT_GALLERY,
  DEFAULT_WORKFLOW, DEFAULT_GUIDE, DEFAULT_DOWNLOADS, DEFAULT_FOOTER,
  type Article, type TeamMember, type Partner, type GalleryImage,
  type WorkflowStep, type GuideSection, type DownloadLinks, type FooterInfo,
} from '../../lib/siteStore';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? '';
const SESSION_KEY = 'afp_admin_auth';

// NEXT_PUBLIC_ADMIN_SECRET doit correspondre à ADMIN_SECRET dans .env.local
const TOKEN = process.env.NEXT_PUBLIC_ADMIN_SECRET ?? '';
const AUTH_HEADERS = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}` };

// ─── DB ARTICLE SHAPE ────────────────────────────────────────────────────────
type DbArticle = Omit<Article, 'author'> & { author_name: string; author_role: string };
const mapArticle = (row: DbArticle): Article => ({ ...row, author: { name: row.author_name, role: row.author_role } });

// ─── DB MESSAGE SHAPE ─────────────────────────────────────────────────────────
type DbMessage = {
  id: number;
  type: 'partner_request' | 'newsletter';
  name?: string;
  organization?: string;
  email: string;
  partnership_type?: string;
  message_text?: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
};

// ─── SHARED MICRO-COMPONENTS ──────────────────────────────────────────────────

function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
        {note && <span className="normal-case font-normal text-gray-400">{note}</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100';
const textareaCls = `${inputCls} resize-none`;

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-semibold shadow-xl ${type === 'success' ? 'bg-green-950 text-white' : 'bg-red-600 text-white'}`}
    >
      {type === 'success'
        ? <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        : <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
      {message}
    </motion.div>
  );
}

function DeleteConfirm({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
        </div>
        <h3 className="mb-2 text-base font-extrabold text-gray-900">Supprimer ?</h3>
        <p className="mb-6 text-sm text-gray-500 line-clamp-2">{title}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">Annuler</button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700">Supprimer</button>
        </div>
      </motion.div>
    </div>
  );
}

function Modal({ title, onClose, formId, children }: { title: string; onClose: () => void; formId: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[95dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-extrabold text-gray-900">{title}</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 text-lg">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">{children}</div>
        <div className="shrink-0 flex gap-3 border-t border-gray-100 px-6 py-4">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Annuler</button>
          <button form={formId} type="submit" className="flex-1 rounded-xl bg-green-950 py-2.5 text-sm font-bold text-white hover:bg-green-800">Enregistrer</button>
        </div>
      </motion.div>
    </div>
  );
}

function SectionHeader({ title, desc, onAdd, addLabel = 'Ajouter' }: { title: string; desc: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{desc}</p>
      </div>
      {onAdd && (
        <button onClick={onAdd} className="shrink-0 flex items-center gap-1.5 rounded-xl bg-green-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-green-800">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {addLabel}
        </button>
      )}
    </div>
  );
}

function ItemCard({ title, subtitle, thumb, onEdit, onDelete, children }: { title: string; subtitle?: string; thumb?: string; onEdit: () => void; onDelete: () => void; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition">
      {thumb && (
        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <img src={thumb} alt="" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-bold text-gray-900">{title}</p>
        {subtitle && <p className="truncate text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        {children}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button onClick={onEdit} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-green-300 hover:bg-green-50 hover:text-green-800">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
          <span className="hidden sm:inline">Modifier</span>
        </button>
        <button onClick={onDelete} className="flex items-center gap-1.5 rounded-xl border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 hover:border-red-300">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
          <span className="hidden sm:inline">Supprimer</span>
        </button>
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        onLogin();
      } else {
        setError(true);
        setLoading(false);
        setPassword('');
      }
    }, 600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-950 px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden ring-1 ring-green-500/30">
            <img src="/logo.png" alt="Ai-Forest Planner" className="h-full w-full object-cover" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-extrabold tracking-tight text-white">AI-Forest Planner</h1>
            <p className="mt-1 text-sm text-green-400">Espace Administration</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 backdrop-blur">
          <h2 className="mb-6 text-lg font-bold text-white">Connexion</h2>
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-green-400">Mot de passe</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'} value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="••••••••••" required
                className={`w-full rounded-xl border bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-green-900 outline-none transition focus:ring-2 ${error ? 'border-red-500/60 focus:ring-red-500/30' : 'border-white/10 focus:border-green-500/50 focus:ring-green-500/20'}`}
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-400">
                {show
                  ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
              </button>
            </div>
            <AnimatePresence>
              {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs text-red-400">Mot de passe incorrect.</motion.p>}
            </AnimatePresence>
          </div>
          <button type="submit" disabled={loading || !password} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-green-950 hover:bg-green-400 disabled:opacity-50">
            {loading && <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── ARTICLES SECTION ─────────────────────────────────────────────────────────

type ArticleCategory = Article['category'];
const ARTICLE_CATEGORIES: ArticleCategory[] = ['Agriculture', 'Technologie', 'Partenariats', 'Événements'];
const ARTICLE_TAGS = ['Nouveau', 'Mise à jour', 'Partenariat', 'Événement', 'Étude', 'Innovation'];
const TAG_COLORS: Record<string, string> = { Nouveau: 'bg-green-100 text-green-800', 'Mise à jour': 'bg-blue-100 text-blue-800', Partenariat: 'bg-amber-100 text-amber-800', Événement: 'bg-purple-100 text-purple-700', Étude: 'bg-teal-100 text-teal-800', Innovation: 'bg-orange-100 text-orange-700' };

type ArticleForm = Omit<Article, 'id' | 'body'> & { bodyText: string; id?: number };

function emptyArticle(): ArticleForm {
  return { category: 'Agriculture', tag: 'Nouveau', date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }), title: '', excerpt: '', bodyText: '', src: '', author: { name: '', role: '' } };
}

function ArticlesSection({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [items, setItems] = useState<Article[]>([]);
  const [editing, setEditing] = useState<ArticleForm | null>(null);
  const [deleting, setDeleting] = useState<Article | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/articles').then(r => r.json()).then(d => setItems((d.articles ?? DEFAULT_ARTICLES).map(mapArticle))).catch(() => setItems(DEFAULT_ARTICLES));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const body = editing.bodyText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const payload = { category: editing.category, tag: editing.tag, date: editing.date, title: editing.title, excerpt: editing.excerpt, body, src: editing.src, author_name: editing.author.name, author_role: editing.author.role };
    try {
      if (editing.id) {
        const r = await fetch(`/api/articles/${editing.id}`, { method: 'PUT', headers: AUTH_HEADERS, body: JSON.stringify(payload) });
        const d = await r.json();
        if (d.article) { setItems(prev => prev.map(a => a.id === editing.id ? mapArticle(d.article) : a)); showToast('Article modifié.'); }
        else showToast(d.error ?? 'Erreur', 'error');
      } else {
        const r = await fetch('/api/articles', { method: 'POST', headers: AUTH_HEADERS, body: JSON.stringify(payload) });
        const d = await r.json();
        if (d.article) { setItems(prev => [mapArticle(d.article), ...prev]); showToast('Article publié.'); }
        else showToast(d.error ?? 'Erreur', 'error');
      }
    } catch { showToast('Erreur réseau.', 'error'); }
    setEditing(null);
  };

  const handleDelete = async (article: Article) => {
    try {
      await fetch(`/api/articles/${article.id}`, { method: 'DELETE', headers: AUTH_HEADERS });
      setItems(prev => prev.filter(a => a.id !== article.id));
      showToast('Article supprimé.');
    } catch { showToast('Erreur réseau.', 'error'); }
    setDeleting(null);
  };

  const filtered = items.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <SectionHeader title="Actualités" desc="Créez, modifiez et supprimez les articles du fil d'actualités." onAdd={() => setEditing(emptyArticle())} addLabel="Nouvel article" />
      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" />
        </div>
      </div>
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {filtered.map(a => (
            <motion.div key={a.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
              <ItemCard title={a.title} subtitle={`${a.category} · ${a.date} · ${a.author.name}`} thumb={a.src} onEdit={() => setEditing({ ...a, bodyText: a.body.join('\n\n') })} onDelete={() => setDeleting(a)}>
                <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${TAG_COLORS[a.tag] ?? 'bg-gray-100 text-gray-700'}`}>{a.tag}</span>
              </ItemCard>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center"><p className="text-gray-400 text-sm">Aucun article trouvé.</p></div>}
      </div>

      <AnimatePresence>
        {editing && (
          <Modal title={editing.id ? "Modifier l'article" : 'Nouvel article'} onClose={() => setEditing(null)} formId="article-form">
            <form id="article-form" onSubmit={handleSave} className="space-y-4">
              <Field label="Titre *"><input required value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={inputCls} /></Field>
              <Field label="Résumé *"><textarea required rows={2} value={editing.excerpt} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} className={textareaCls} /></Field>
              <Field label="Contenu *" note="(paragraphes séparés par une ligne vide)"><textarea required rows={8} value={editing.bodyText} onChange={e => setEditing({ ...editing, bodyText: e.target.value })} className={textareaCls} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Catégorie *">
                  <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value as ArticleCategory })} className={inputCls}>
                    {ARTICLE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Tag *">
                  <select value={editing.tag} onChange={e => setEditing({ ...editing, tag: e.target.value })} className={inputCls}>
                    {ARTICLE_TAGS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Date *"><input required value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} placeholder="ex : 14 mai 2026" className={inputCls} /></Field>
              <Field label="URL image *">
                <input required type="url" value={editing.src} onChange={e => setEditing({ ...editing, src: e.target.value })} className={inputCls} />
                {editing.src && <div className="mt-2 h-24 overflow-hidden rounded-xl border border-gray-100"><img src={editing.src} alt="" className="h-full w-full object-cover" /></div>}
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Auteur *"><input required value={editing.author.name} onChange={e => setEditing({ ...editing, author: { ...editing.author, name: e.target.value } })} className={inputCls} /></Field>
                <Field label="Rôle *"><input required value={editing.author.role} onChange={e => setEditing({ ...editing, author: { ...editing.author, role: e.target.value } })} className={inputCls} /></Field>
              </div>
            </form>
          </Modal>
        )}
        {deleting && <DeleteConfirm title={deleting.title} onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── TEAM SECTION ─────────────────────────────────────────────────────────────

function TeamSection({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(d => setItems(d.team ?? DEFAULT_TEAM)).catch(() => setItems(DEFAULT_TEAM));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = { name: editing.name, role: editing.role, position: editing.position, description: editing.description, src: editing.src, sort_order: editing.id ?? 0 };
    try {
      if (editing.id && items.find(m => m.id === editing.id)) {
        const r = await fetch(`/api/team/${editing.id}`, { method: 'PUT', headers: AUTH_HEADERS, body: JSON.stringify(payload) });
        const d = await r.json();
        if (d.member) { setItems(prev => prev.map(m => m.id === editing.id ? d.member : m)); showToast('Membre modifié.'); }
        else showToast(d.error ?? 'Erreur', 'error');
      } else {
        const r = await fetch('/api/team', { method: 'POST', headers: AUTH_HEADERS, body: JSON.stringify({ ...payload, sort_order: items.length }) });
        const d = await r.json();
        if (d.member) { setItems(prev => [...prev, d.member]); showToast('Membre ajouté.'); }
        else showToast(d.error ?? 'Erreur', 'error');
      }
    } catch { showToast('Erreur réseau.', 'error'); }
    setEditing(null);
  };

  const handleDelete = async (member: TeamMember) => {
    try {
      await fetch(`/api/team/${member.id}`, { method: 'DELETE', headers: AUTH_HEADERS });
      setItems(prev => prev.filter(m => m.id !== member.id));
      showToast('Membre supprimé.');
    } catch { showToast('Erreur réseau.', 'error'); }
    setDeleting(null);
  };

  const emptyMember = (): TeamMember => ({ id: 0, name: '', role: '', position: '', description: '', src: '' });

  return (
    <div>
      <SectionHeader title="Équipe" desc="Gérez les membres de l'équipe affichés sur le site." onAdd={() => setEditing(emptyMember())} addLabel="Ajouter un membre" />
      <div className="space-y-3">
        {items.map(m => (
          <ItemCard key={m.id} title={m.name} subtitle={m.role} thumb={m.src} onEdit={() => setEditing(m)} onDelete={() => setDeleting(m)} />
        ))}
        {items.length === 0 && <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center"><p className="text-gray-400 text-sm">Aucun membre.</p></div>}
      </div>
      <AnimatePresence>
        {editing && (
          <Modal title={editing.id ? 'Modifier le membre' : 'Nouveau membre'} onClose={() => setEditing(null)} formId="team-form">
            <form id="team-form" onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nom *"><input required value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></Field>
                <Field label="Rôle / Poste *"><input required value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} className={inputCls} /></Field>
              </div>
              <Field label="Position / Localisation" note="ex: Dakar, Sénégal · Congo-Brazzaville">
                <input value={editing.position ?? ''} onChange={e => setEditing({ ...editing, position: e.target.value })} placeholder="ex: Dakar, Sénégal" className={inputCls} />
              </Field>
              <Field label="Biographie *"><textarea required rows={3} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className={textareaCls} /></Field>
              <Field label="URL photo">
                <input type="url" value={editing.src} onChange={e => setEditing({ ...editing, src: e.target.value })} className={inputCls} />
                {editing.src && <div className="mt-2 h-20 w-20 overflow-hidden rounded-full border border-gray-100"><img src={editing.src} alt="" className="h-full w-full object-cover" /></div>}
              </Field>
            </form>
          </Modal>
        )}
        {deleting && <DeleteConfirm title={deleting.name} onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── PARTNERS SECTION ─────────────────────────────────────────────────────────

function PartnersSection({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [items, setItems] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [deleting, setDeleting] = useState<Partner | null>(null);

  useEffect(() => {
    fetch('/api/partners').then(r => r.json()).then(d => setItems(d.partners ?? DEFAULT_PARTNERS)).catch(() => setItems(DEFAULT_PARTNERS));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = { name: editing.name, description: editing.description, href: editing.href };
    try {
      if (editing.id && items.find(p => p.id === editing.id)) {
        const r = await fetch(`/api/partners/${editing.id}`, { method: 'PUT', headers: AUTH_HEADERS, body: JSON.stringify({ ...payload, sort_order: items.findIndex(p => p.id === editing.id) }) });
        const d = await r.json();
        if (d.partner) { setItems(prev => prev.map(p => p.id === editing.id ? d.partner : p)); showToast('Partenaire modifié.'); }
        else showToast(d.error ?? 'Erreur', 'error');
      } else {
        const r = await fetch('/api/partners', { method: 'POST', headers: AUTH_HEADERS, body: JSON.stringify({ ...payload, sort_order: items.length }) });
        const d = await r.json();
        if (d.partner) { setItems(prev => [...prev, d.partner]); showToast('Partenaire ajouté.'); }
        else showToast(d.error ?? 'Erreur', 'error');
      }
    } catch { showToast('Erreur réseau.', 'error'); }
    setEditing(null);
  };

  const handleDelete = async (partner: Partner) => {
    try {
      await fetch(`/api/partners/${partner.id}`, { method: 'DELETE', headers: AUTH_HEADERS });
      setItems(prev => prev.filter(p => p.id !== partner.id));
      showToast('Partenaire supprimé.');
    } catch { showToast('Erreur réseau.', 'error'); }
    setDeleting(null);
  };

  return (
    <div>
      <SectionHeader title="Partenaires" desc="Gérez les logos et liens partenaires affichés sur le site." onAdd={() => setEditing({ id: 0, name: '', description: '', href: '' })} addLabel="Ajouter un partenaire" />
      <div className="space-y-3">
        {items.map(p => (
          <ItemCard key={p.id} title={p.name} subtitle={`${p.description} · ${p.href}`} onEdit={() => setEditing(p)} onDelete={() => setDeleting(p)} />
        ))}
        {items.length === 0 && <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center"><p className="text-gray-400 text-sm">Aucun partenaire.</p></div>}
      </div>
      <AnimatePresence>
        {editing && (
          <Modal title={editing.id ? 'Modifier le partenaire' : 'Nouveau partenaire'} onClose={() => setEditing(null)} formId="partner-form">
            <form id="partner-form" onSubmit={handleSave} className="space-y-4">
              <Field label="Nom / Sigle *"><input required value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="ex : FAO" className={inputCls} /></Field>
              <Field label="Description *"><input required value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="ex : Food & Agriculture Organization" className={inputCls} /></Field>
              <Field label="URL du site *"><input required type="url" value={editing.href} onChange={e => setEditing({ ...editing, href: e.target.value })} placeholder="https://" className={inputCls} /></Field>
            </form>
          </Modal>
        )}
        {deleting && <DeleteConfirm title={deleting.name} onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── GALLERY SECTION ──────────────────────────────────────────────────────────

function GallerySection({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(d => setItems(d.images ?? DEFAULT_GALLERY)).catch(() => setItems(DEFAULT_GALLERY));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = { title: editing.title, src: editing.src };
    try {
      if (editing.id && items.find(g => g.id === editing.id)) {
        const r = await fetch(`/api/gallery/${editing.id}`, { method: 'PUT', headers: AUTH_HEADERS, body: JSON.stringify({ ...payload, sort_order: items.findIndex(g => g.id === editing.id) }) });
        const d = await r.json();
        if (d.image) { setItems(prev => prev.map(g => g.id === editing.id ? d.image : g)); showToast('Image modifiée.'); }
        else showToast(d.error ?? 'Erreur', 'error');
      } else {
        const r = await fetch('/api/gallery', { method: 'POST', headers: AUTH_HEADERS, body: JSON.stringify({ ...payload, sort_order: items.length }) });
        const d = await r.json();
        if (d.image) { setItems(prev => [...prev, d.image]); showToast('Image ajoutée.'); }
        else showToast(d.error ?? 'Erreur', 'error');
      }
    } catch { showToast('Erreur réseau.', 'error'); }
    setEditing(null);
  };

  const handleDelete = async (image: GalleryImage) => {
    try {
      await fetch(`/api/gallery/${image.id}`, { method: 'DELETE', headers: AUTH_HEADERS });
      setItems(prev => prev.filter(g => g.id !== image.id));
      showToast('Image supprimée.');
    } catch { showToast('Erreur réseau.', 'error'); }
    setDeleting(null);
  };

  return (
    <div>
      <SectionHeader title='Galerie "Réalités agricoles"' desc="Images du défilement animé sur la page d'accueil." onAdd={() => setEditing({ id: 0, title: '', src: '' })} addLabel="Ajouter une image" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(g => (
          <div key={g.id} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={g.src} alt={g.title} className="h-full w-full object-cover transition group-hover:scale-105" onError={e => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-bold text-gray-900">{g.title}</p>
              <div className="mt-2 flex gap-1.5">
                <button onClick={() => setEditing(g)} className="flex-1 rounded-lg border border-gray-200 py-1 text-[10px] font-semibold text-gray-600 hover:bg-green-50 hover:text-green-800">Modifier</button>
                <button onClick={() => setDeleting(g)} className="flex-1 rounded-lg border border-red-100 py-1 text-[10px] font-semibold text-red-500 hover:bg-red-50">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center"><p className="text-gray-400 text-sm">Aucune image.</p></div>}
      </div>
      <AnimatePresence>
        {editing && (
          <Modal title={editing.id ? "Modifier l'image" : 'Nouvelle image'} onClose={() => setEditing(null)} formId="gallery-form">
            <form id="gallery-form" onSubmit={handleSave} className="space-y-4">
              <Field label="Titre *"><input required value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="ex : Suivi des cultures" className={inputCls} /></Field>
              <Field label="URL de l'image *">
                <input required type="url" value={editing.src} onChange={e => setEditing({ ...editing, src: e.target.value })} placeholder="https://images.unsplash.com/..." className={inputCls} />
                {editing.src && <div className="mt-2 h-32 overflow-hidden rounded-xl border border-gray-100"><img src={editing.src} alt="" className="h-full w-full object-cover" /></div>}
              </Field>
            </form>
          </Modal>
        )}
        {deleting && <DeleteConfirm title={deleting.title} onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── WORKFLOW SECTION ─────────────────────────────────────────────────────────

function WorkflowSection({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [items, setItems] = useState<WorkflowStep[]>([]);
  const [editing, setEditing] = useState<WorkflowStep | null>(null);

  useEffect(() => {
    fetch('/api/workflow').then(r => r.json()).then(d => setItems(d.steps ?? DEFAULT_WORKFLOW)).catch(() => setItems(DEFAULT_WORKFLOW));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = { step: editing.step, title: editing.title, text: editing.text };
    try {
      if (items.find(s => s.id === editing.id)) {
        const r = await fetch(`/api/workflow/${editing.id}`, { method: 'PUT', headers: AUTH_HEADERS, body: JSON.stringify({ ...payload, sort_order: items.findIndex(s => s.id === editing.id) }) });
        const d = await r.json();
        if (d.step) setItems(prev => prev.map(s => s.id === editing.id ? d.step : s));
        else showToast(d.error ?? 'Erreur', 'error');
      } else {
        const r = await fetch('/api/workflow', { method: 'POST', headers: AUTH_HEADERS, body: JSON.stringify({ ...payload, sort_order: items.length }) });
        const d = await r.json();
        if (d.step) setItems(prev => [...prev, d.step]);
        else showToast(d.error ?? 'Erreur', 'error');
      }
    } catch { showToast('Erreur réseau.', 'error'); }
    showToast('Étape enregistrée.');
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/workflow/${id}`, { method: 'DELETE', headers: AUTH_HEADERS });
      setItems(prev => prev.filter(s => s.id !== id));
      showToast('Étape supprimée.');
    } catch { showToast('Erreur réseau.', 'error'); }
  };

  const swap = async (i: number, j: number) => {
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    setItems(n);
    try {
      await fetch(`/api/workflow/${n[i].id}`, { method: 'PUT', headers: AUTH_HEADERS, body: JSON.stringify({ step: n[i].step, title: n[i].title, text: n[i].text, sort_order: i }) });
      await fetch(`/api/workflow/${n[j].id}`, { method: 'PUT', headers: AUTH_HEADERS, body: JSON.stringify({ step: n[j].step, title: n[j].title, text: n[j].text, sort_order: j }) });
    } catch { /* ignore — UI already updated */ }
  };

  return (
    <div>
      <SectionHeader title="Comment ça marche" desc={"Les 4 étapes affichées sur la page d'accueil (section \"Un parcours clair\")."} onAdd={() => setEditing({ id: 0, step: String(items.length + 1).padStart(2, '0'), title: '', text: '' })} addLabel="Ajouter une étape" />
      <div className="space-y-3">
        {items.map((s, i) => (
          <div key={s.id} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-950 text-sm font-black text-white">{s.step}</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">{s.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.text}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button onClick={() => { if (i > 0) swap(i - 1, i); }} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50" title="Monter">↑</button>
              <button onClick={() => { if (i < items.length - 1) swap(i, i + 1); }} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50" title="Descendre">↓</button>
              <button onClick={() => setEditing(s)} className="ml-1 flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-green-50 hover:border-green-300">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                Modifier
              </button>
              <button onClick={() => handleDelete(s.id)} className="flex items-center gap-1 rounded-xl border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center"><p className="text-gray-400 text-sm">Aucune étape.</p></div>}
      </div>
      <AnimatePresence>
        {editing && (
          <Modal title={editing.id ? "Modifier l'étape" : 'Nouvelle étape'} onClose={() => setEditing(null)} formId="workflow-form">
            <form id="workflow-form" onSubmit={handleSave} className="space-y-4">
              <Field label="Numéro *" note="(ex: 01, 02)"><input required value={editing.step} onChange={e => setEditing({ ...editing, step: e.target.value })} placeholder="01" className={inputCls} /></Field>
              <Field label="Titre *"><input required value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={inputCls} /></Field>
              <Field label="Description *"><textarea required rows={3} value={editing.text} onChange={e => setEditing({ ...editing, text: e.target.value })} className={textareaCls} /></Field>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── GUIDE SECTION ────────────────────────────────────────────────────────────

function GuideSection_({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [items, setItems] = useState<GuideSection[]>([]);
  const [editing, setEditing] = useState<(GuideSection & { pointsText: string }) | null>(null);
  const [deleting, setDeleting] = useState<GuideSection | null>(null);

  useEffect(() => {
    fetch('/api/guide').then(r => r.json()).then(d => setItems(d.sections ?? DEFAULT_GUIDE)).catch(() => setItems(DEFAULT_GUIDE));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const points = editing.pointsText.split('\n').map(p => p.trim()).filter(Boolean);
    const payload = { number: editing.number, title: editing.title, text: editing.text, image: editing.image, points };
    try {
      if (editing.id && items.find(s => s.id === editing.id)) {
        const r = await fetch(`/api/guide/${editing.id}`, { method: 'PUT', headers: AUTH_HEADERS, body: JSON.stringify({ ...payload, sort_order: items.findIndex(s => s.id === editing.id) }) });
        const d = await r.json();
        if (d.section) { setItems(prev => prev.map(s => s.id === editing.id ? d.section : s)); showToast('Section modifiée.'); }
        else showToast(d.error ?? 'Erreur', 'error');
      } else {
        const r = await fetch('/api/guide', { method: 'POST', headers: AUTH_HEADERS, body: JSON.stringify({ ...payload, sort_order: items.length }) });
        const d = await r.json();
        if (d.section) { setItems(prev => [...prev, d.section]); showToast('Section ajoutée.'); }
        else showToast(d.error ?? 'Erreur', 'error');
      }
    } catch { showToast('Erreur réseau.', 'error'); }
    setEditing(null);
  };

  const handleDelete = async (section: GuideSection) => {
    try {
      await fetch(`/api/guide/${section.id}`, { method: 'DELETE', headers: AUTH_HEADERS });
      setItems(prev => prev.filter(s => s.id !== section.id));
      showToast('Section supprimée.');
    } catch { showToast('Erreur réseau.', 'error'); }
    setDeleting(null);
  };

  return (
    <div>
      <SectionHeader title="Sections du Guide" desc="Les 8 sections détaillées de la page Guide avec images et points clés." onAdd={() => setEditing({ id: 0, number: String(items.length + 1).padStart(2, '0'), title: '', text: '', image: '', points: [], pointsText: '' })} addLabel="Ajouter une section" />
      <div className="space-y-3">
        {items.map(s => (
          <ItemCard key={s.id} title={`${s.number} — ${s.title}`} subtitle={s.text.slice(0, 90) + '…'} thumb={s.image} onEdit={() => setEditing({ ...s, pointsText: s.points.join('\n') })} onDelete={() => setDeleting(s)} />
        ))}
        {items.length === 0 && <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center"><p className="text-gray-400 text-sm">Aucune section.</p></div>}
      </div>
      <AnimatePresence>
        {editing && (
          <Modal title={editing.id ? 'Modifier la section' : 'Nouvelle section'} onClose={() => setEditing(null)} formId="guide-form">
            <form id="guide-form" onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <Field label="N° *"><input required value={editing.number} onChange={e => setEditing({ ...editing, number: e.target.value })} placeholder="01" className={inputCls} /></Field>
                <div className="col-span-3"><Field label="Titre *"><input required value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={inputCls} /></Field></div>
              </div>
              <Field label="Description *"><textarea required rows={3} value={editing.text} onChange={e => setEditing({ ...editing, text: e.target.value })} className={textareaCls} /></Field>
              <Field label="URL image *">
                <input required type="url" value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })} className={inputCls} />
                {editing.image && <div className="mt-2 h-28 overflow-hidden rounded-xl border border-gray-100"><img src={editing.image} alt="" className="h-full w-full object-cover" /></div>}
              </Field>
              <Field label="Points clés" note="(un point par ligne)"><textarea rows={6} value={editing.pointsText} onChange={e => setEditing({ ...editing, pointsText: e.target.value })} placeholder={"Point 1\nPoint 2\nPoint 3"} className={textareaCls} /></Field>
            </form>
          </Modal>
        )}
        {deleting && <DeleteConfirm title={deleting.title} onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── DOWNLOADS SECTION ────────────────────────────────────────────────────────

function DownloadsSection({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [data, setData] = useState<DownloadLinks>(DEFAULT_DOWNLOADS);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch('/api/settings/downloads').then(r => r.json()).then(d => { if (d.value) setData(d.value); }).catch(() => {});
  }, []);

  const update = (platform: 'android' | 'ios', field: 'label' | 'url', value: string) => {
    setData(prev => ({ ...prev, [platform]: { ...prev[platform], [field]: value } }));
    setDirty(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings/downloads', { method: 'PUT', headers: AUTH_HEADERS, body: JSON.stringify({ value: data }) });
      setDirty(false);
      showToast('Liens mis à jour.');
    } catch { showToast('Erreur réseau.', 'error'); }
  };

  return (
    <div>
      <SectionHeader title="Liens de téléchargement" desc="URLs des stores Android et iOS affichés dans le bouton de téléchargement." />
      <form onSubmit={handleSave} className="max-w-xl space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {(['android', 'ios'] as const).map(p => (
          <div key={p} className="space-y-3 rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-bold text-gray-900">{p === 'android' ? 'Google Play (Android)' : 'App Store (iOS)'}</p>
            <Field label="Libellé"><input value={data[p].label} onChange={e => update(p, 'label', e.target.value)} className={inputCls} /></Field>
            <Field label="URL du store"><input type="url" value={data[p].url} onChange={e => update(p, 'url', e.target.value)} placeholder="https://" className={inputCls} /></Field>
          </div>
        ))}
        <button type="submit" disabled={!dirty} className="rounded-xl bg-green-950 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-40">Enregistrer</button>
      </form>
    </div>
  );
}

// ─── FOOTER SECTION ───────────────────────────────────────────────────────────

function FooterSection({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [data, setData] = useState<FooterInfo>(DEFAULT_FOOTER);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch('/api/settings/footer').then(r => r.json()).then(d => { if (d.value) setData(d.value); }).catch(() => {});
  }, []);

  const set = <K extends keyof FooterInfo>(key: K, value: FooterInfo[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const updateSocial = (i: number, field: 'label' | 'href', value: string) => {
    const links = data.socialLinks.map((l, idx) => idx === i ? { ...l, [field]: value } : l);
    set('socialLinks', links);
  };

  const addSocial = () => set('socialLinks', [...data.socialLinks, { label: '', href: '' }]);
  const removeSocial = (i: number) => set('socialLinks', data.socialLinks.filter((_, idx) => idx !== i));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings/footer', { method: 'PUT', headers: AUTH_HEADERS, body: JSON.stringify({ value: data }) });
      setDirty(false);
      showToast('Footer mis à jour.');
    } catch { showToast('Erreur réseau.', 'error'); }
  };

  return (
    <div>
      <SectionHeader title="Footer & Contact" desc="Informations de contact, description de la marque et liens sociaux." />
      <form onSubmit={handleSave} className="max-w-2xl space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <Field label="Description de la marque"><textarea rows={2} value={data.description} onChange={e => set('description', e.target.value)} className={textareaCls} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email de contact"><input type="email" value={data.email} onChange={e => set('email', e.target.value)} className={inputCls} /></Field>
          <Field label="Téléphone"><input value={data.phone} onChange={e => set('phone', e.target.value)} className={inputCls} /></Field>
        </div>
        <Field label="URL du site (copyright)"><input type="url" value={data.websiteUrl} onChange={e => set('websiteUrl', e.target.value)} className={inputCls} /></Field>
        <Field label="Texte copyright"><input value={data.copyright} onChange={e => set('copyright', e.target.value)} className={inputCls} /></Field>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Réseaux sociaux</label>
            <button type="button" onClick={addSocial} className="text-xs font-semibold text-green-700 hover:text-green-900">+ Ajouter</button>
          </div>
          <div className="space-y-2">
            {data.socialLinks.map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={l.label} onChange={e => updateSocial(i, 'label', e.target.value)} placeholder="LinkedIn" className={`${inputCls} w-28`} />
                <input value={l.href} onChange={e => updateSocial(i, 'href', e.target.value)} placeholder="https://" className={inputCls} />
                <button type="button" onClick={() => removeSocial(i)} className="shrink-0 text-red-400 hover:text-red-600 px-1">×</button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" disabled={!dirty} className="rounded-xl bg-green-950 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-40">Enregistrer</button>
      </form>
    </div>
  );
}

// ─── MESSAGES SECTION ─────────────────────────────────────────────────────────

function MessagesSection({ showToast, onUnreadChange }: { showToast: (m: string, t?: 'success' | 'error') => void; onUnreadChange: (n: number) => void }) {
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [selected, setSelected] = useState<DbMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'partner_request' | 'newsletter'>('all');

  const load = async () => {
    try {
      const r = await fetch('/api/messages', { headers: { Authorization: `Bearer ${TOKEN}` } });
      const d = await r.json();
      setMessages(d.messages ?? []);
      onUnreadChange(d.unreadCount ?? 0);
    } catch { /* DB not connected yet */ }
  };

  useEffect(() => { load(); }, []);

  const patchStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/messages/${id}`, { method: 'PATCH', headers: AUTH_HEADERS, body: JSON.stringify({ status }) });
      await load();
    } catch { showToast('Erreur réseau.', 'error'); }
  };

  const remove = async (id: number) => {
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${TOKEN}` } });
      const next = messages.filter(m => m.id !== id);
      setMessages(next);
      onUnreadChange(next.filter(m => m.status === 'unread').length);
      setSelected(null);
      showToast('Message supprimé.');
    } catch { showToast('Erreur réseau.', 'error'); }
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return m.status === 'unread';
    if (filter === 'partner_request') return m.type === 'partner_request';
    if (filter === 'newsletter') return m.type === 'newsletter';
    return true;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div>
      <SectionHeader title="Messages" desc="Demandes de partenariat et abonnements newsletter reçus depuis le site." />

      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: messages.length, color: 'text-gray-900' },
          { label: 'Non lus', value: unreadCount, color: 'text-green-700' },
          { label: 'Partenariats', value: messages.filter(m => m.type === 'partner_request').length, color: 'text-amber-700' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm text-center">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-extrabold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {([['all', 'Tous'], ['unread', 'Non lus'], ['partner_request', 'Partenariats'], ['newsletter', 'Newsletter']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${filter === val ? 'bg-green-950 text-white shadow' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>{label}</button>
        ))}
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {filtered.map(msg => (
            <motion.div
              key={msg.id}
              layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
              onClick={() => { setSelected(msg); if (msg.status === 'unread') patchStatus(msg.id, 'read'); }}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition hover:shadow-md ${msg.status === 'unread' ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-white'}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${msg.type === 'partner_request' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                {msg.type === 'partner_request' ? '🤝' : '✉️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold uppercase tracking-wider ${msg.type === 'partner_request' ? 'text-amber-600' : 'text-blue-600'}`}>
                    {msg.type === 'partner_request' ? 'Partenariat' : 'Newsletter'}
                  </span>
                  {msg.status === 'unread' && <span className="rounded-full bg-green-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">Nouveau</span>}
                  <span className="ml-auto text-[10px] text-gray-400">{new Date(msg.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="mt-0.5 text-sm font-semibold text-gray-900 truncate">{msg.name ? `${msg.name}${msg.organization ? ` — ${msg.organization}` : ''}` : msg.email}</p>
                <p className="text-xs text-gray-500 truncate">{msg.email}{msg.partnership_type ? ` · ${msg.partnership_type}` : ''}</p>
                {msg.message_text && <p className="mt-1 text-xs text-gray-400 line-clamp-1">{msg.message_text}</p>}
              </div>
              <div className="shrink-0 flex items-center gap-1.5 self-center">
                <button onClick={e => { e.stopPropagation(); patchStatus(msg.id, msg.status === 'unread' ? 'read' : 'unread'); }} className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-[10px] font-semibold text-gray-600 hover:bg-gray-50">
                  {msg.status === 'unread' ? 'Lu' : 'Non lu'}
                </button>
                <button onClick={e => { e.stopPropagation(); patchStatus(msg.id, 'archived'); }} className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-[10px] font-semibold text-gray-600 hover:bg-gray-50">Archive</button>
                <button onClick={e => { e.stopPropagation(); remove(msg.id); }} className="rounded-lg border border-red-100 px-2.5 py-1.5 text-[10px] font-semibold text-red-400 hover:bg-red-50">×</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-sm font-bold text-gray-900">Aucun message</p>
            <p className="text-xs text-gray-400 mt-1">Les messages apparaîtront ici dès qu'un visiteur soumettra un formulaire.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => setSelected(null)}>
            <motion.div
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 32 }}
              onClick={e => e.stopPropagation()}
              className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-base font-extrabold text-gray-900">Détail du message</h2>
                <button onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 text-lg">×</button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Type</p><p className="mt-1 text-sm font-bold text-gray-900">{selected.type === 'partner_request' ? 'Demande partenariat' : 'Newsletter'}</p></div>
                  <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Statut</p><p className={`mt-1 text-sm font-bold ${selected.status === 'unread' ? 'text-green-700' : 'text-gray-500'}`}>{selected.status === 'unread' ? 'Non lu' : selected.status === 'read' ? 'Lu' : 'Archivé'}</p></div>
                </div>
                {selected.name && <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Nom</p><p className="mt-1 text-sm font-semibold text-gray-900">{selected.name}</p></div>}
                {selected.organization && <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Organisation</p><p className="mt-1 text-sm font-semibold text-gray-900">{selected.organization}</p></div>}
                <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Email</p><a href={`mailto:${selected.email}`} className="mt-1 block text-sm font-semibold text-green-700 hover:underline">{selected.email}</a></div>
                {selected.partnership_type && <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Type de partenariat</p><p className="mt-1 text-sm text-gray-900">{selected.partnership_type}</p></div>}
                {selected.message_text && <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Message</p><p className="mt-1 text-sm leading-6 text-gray-700 whitespace-pre-wrap">{selected.message_text}</p></div>}
                <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Reçu le</p><p className="mt-1 text-sm text-gray-900">{new Date(selected.created_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p></div>
              </div>
              <div className="shrink-0 flex gap-2 border-t border-gray-100 px-6 py-4">
                <a href={`mailto:${selected.email}`} className="flex-1 rounded-xl bg-green-950 py-2.5 text-center text-sm font-bold text-white hover:bg-green-800">Répondre par email</a>
                <button onClick={() => remove(selected.id)} className="rounded-xl border border-red-100 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50">Supprimer</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MONITORING SECTION ───────────────────────────────────────────────────────

type MonCard = { id: number; label: string; title: string; value: string; sort_order: number };
type MonStat = { id: number; label: string; target: number; suffix: string; sort_order: number };
type DashItem = { id: number; label: string; value: string; description: string; sort_order: number };
type MonSettings = { hero_title: string; hero_description: string; metric_value: string; metric_label: string; stats_title: string; stats_description: string; bg_image: string };

const DEFAULT_MON_SETTINGS: MonSettings = { hero_title: 'Suivez vos terres avec des données claires.', hero_description: 'Cartes, alertes et indicateurs agricoles dans un tableau de bord simple.', metric_value: '89%', metric_label: 'Cultures en bonne santé', stats_title: 'Des indicateurs faciles à lire.', stats_description: '', bg_image: '' };

function MonitoringSection({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [tab, setTab]             = useState<'settings' | 'dashboard' | 'cards' | 'stats'>('settings');
  const [settings, setSettings]   = useState<MonSettings>(DEFAULT_MON_SETTINGS);
  const [cards, setCards]         = useState<MonCard[]>([]);
  const [stats, setStats]         = useState<MonStat[]>([]);
  const [items, setItems]         = useState<DashItem[]>([]);
  const [cardModal, setCardModal] = useState<MonCard | 'new' | null>(null);
  const [statModal, setStatModal] = useState<MonStat | 'new' | null>(null);
  const [dashModal, setDashModal] = useState<DashItem | 'new' | null>(null);
  const [toDel, setToDel]         = useState<{ type: string; id: number; name: string } | null>(null);
  const [cardForm, setCardForm]   = useState({ label: '', title: '', value: '', sort_order: 0 });
  const [statForm, setStatForm]   = useState({ label: '', target: 0, suffix: '+', sort_order: 0 });
  const [dashForm, setDashForm]   = useState({ label: '', value: '', description: '', sort_order: 0 });
  const [savingSettings, setSavingSettings] = useState(false);

  const loadAll = () => {
    fetch('/api/monitoring/cards').then(r => r.json()).then(d => setCards(d.cards ?? [])).catch(() => {});
    fetch('/api/monitoring/stats').then(r => r.json()).then(d => setStats(d.stats ?? [])).catch(() => {});
    fetch('/api/monitoring/dashboard').then(r => r.json()).then(d => setItems(d.items ?? [])).catch(() => {});
    fetch('/api/settings/monitoring').then(r => r.json()).then(d => { if (d.value) setSettings(s => ({ ...s, ...d.value })); }).catch(() => {});
  };
  useEffect(() => { loadAll(); }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingSettings(true);
    const res = await fetch('/api/settings/monitoring', { method: 'PUT', headers: AUTH_HEADERS, body: JSON.stringify({ value: settings }) });
    setSavingSettings(false);
    if (res.ok) showToast('Paramètres sauvegardés'); else showToast('Erreur', 'error');
  };

  const saveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = cardModal === 'new';
    const url   = isNew ? '/api/monitoring/cards' : `/api/monitoring/cards/${(cardModal as MonCard).id}`;
    const res   = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: AUTH_HEADERS, body: JSON.stringify(cardForm) });
    if (res.ok) { showToast(isNew ? 'Carte ajoutée' : 'Carte mise à jour'); setCardModal(null); loadAll(); } else showToast('Erreur', 'error');
  };

  const saveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = statModal === 'new';
    const url   = isNew ? '/api/monitoring/stats' : `/api/monitoring/stats/${(statModal as MonStat).id}`;
    const res   = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: AUTH_HEADERS, body: JSON.stringify(statForm) });
    if (res.ok) { showToast(isNew ? 'Stat ajoutée' : 'Stat mise à jour'); setStatModal(null); loadAll(); } else showToast('Erreur', 'error');
  };

  const saveDash = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = dashModal === 'new';
    const url   = isNew ? '/api/monitoring/dashboard' : `/api/monitoring/dashboard/${(dashModal as DashItem).id}`;
    const res   = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: AUTH_HEADERS, body: JSON.stringify(dashForm) });
    if (res.ok) { showToast(isNew ? 'Élément ajouté' : 'Élément mis à jour'); setDashModal(null); loadAll(); } else showToast('Erreur', 'error');
  };

  const remove = async () => {
    if (!toDel) return;
    const urls: Record<string, string> = { card: `/api/monitoring/cards/${toDel.id}`, stat: `/api/monitoring/stats/${toDel.id}`, dash: `/api/monitoring/dashboard/${toDel.id}` };
    const res = await fetch(urls[toDel.type], { method: 'DELETE', headers: AUTH_HEADERS });
    if (res.ok) { showToast('Supprimé'); setToDel(null); loadAll(); } else showToast('Erreur', 'error');
  };

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'settings',  label: '⚙ Contenu héros' },
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'cards',     label: '🃏 Cartes KPI' },
    { id: 'stats',     label: '📈 Statistiques' },
  ];

  return (
    <div>
      <SectionHeader title="IA & Monitoring" desc="Gérez tout le contenu de la page IA & Monitoring." />

      {/* Sub-tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-100 pb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === t.id ? 'bg-green-950 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── SETTINGS ── */}
      {tab === 'settings' && (
        <form onSubmit={saveSettings} className="space-y-4 max-w-2xl">
          <Field label="Titre héros"><input required className={inputCls} value={settings.hero_title} onChange={e => setSettings(s => ({ ...s, hero_title: e.target.value }))} /></Field>
          <Field label="Description héros"><textarea className={textareaCls} rows={2} value={settings.hero_description} onChange={e => setSettings(s => ({ ...s, hero_description: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Valeur métrique principale" note="ex: 89%"><input className={inputCls} value={settings.metric_value} onChange={e => setSettings(s => ({ ...s, metric_value: e.target.value }))} /></Field>
            <Field label="Label métrique principale"><input className={inputCls} value={settings.metric_label} onChange={e => setSettings(s => ({ ...s, metric_label: e.target.value }))} /></Field>
          </div>
          <Field label="Titre section statistiques"><input className={inputCls} value={settings.stats_title} onChange={e => setSettings(s => ({ ...s, stats_title: e.target.value }))} /></Field>
          <Field label="Description statistiques (optionnel)"><textarea className={textareaCls} rows={2} value={settings.stats_description} onChange={e => setSettings(s => ({ ...s, stats_description: e.target.value }))} /></Field>
          <Field label="Image de fond section stats (URL)"><input className={inputCls} value={settings.bg_image} onChange={e => setSettings(s => ({ ...s, bg_image: e.target.value }))} placeholder="https://…" /></Field>
          <button type="submit" disabled={savingSettings} className="rounded-xl bg-green-950 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-60">
            {savingSettings ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </form>
      )}

      {/* ── DASHBOARD ITEMS ── */}
      {tab === 'dashboard' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Éléments affichés dans le widget dashboard (max 6 visibles).</p>
            <button onClick={() => { setDashForm({ label: '', value: '', description: '', sort_order: items.length }); setDashModal('new'); }}
              className="flex items-center gap-1.5 rounded-xl bg-green-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-green-800">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Ajouter
            </button>
          </div>
          <div className="space-y-3">
            {items.map(it => (
              <ItemCard key={it.id} title={it.label} subtitle={`${it.value}${it.description ? ' · ' + it.description : ''}`}
                onEdit={() => { setDashForm({ label: it.label, value: it.value, description: it.description, sort_order: it.sort_order }); setDashModal(it); }}
                onDelete={() => setToDel({ type: 'dash', id: it.id, name: it.label })} />
            ))}
            {items.length === 0 && <p className="py-8 text-center text-sm text-gray-400">Aucun élément dashboard.</p>}
          </div>
        </div>
      )}

      {/* ── KPI CARDS ── */}
      {tab === 'cards' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Cartes KPI sous la section héros.</p>
            <button onClick={() => { setCardForm({ label: '', title: '', value: '', sort_order: cards.length }); setCardModal('new'); }}
              className="flex items-center gap-1.5 rounded-xl bg-green-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-green-800">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Ajouter
            </button>
          </div>
          <div className="space-y-3">
            {cards.map(c => (
              <ItemCard key={c.id} title={c.title} subtitle={`${c.value} · ${c.label}`}
                onEdit={() => { setCardForm({ label: c.label, title: c.title, value: c.value, sort_order: c.sort_order }); setCardModal(c); }}
                onDelete={() => setToDel({ type: 'card', id: c.id, name: c.title })} />
            ))}
            {cards.length === 0 && <p className="py-8 text-center text-sm text-gray-400">Aucune carte KPI.</p>}
          </div>
        </div>
      )}

      {/* ── STATS ── */}
      {tab === 'stats' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Compteurs animés de la section statistiques.</p>
            <button onClick={() => { setStatForm({ label: '', target: 0, suffix: '+', sort_order: stats.length }); setStatModal('new'); }}
              className="flex items-center gap-1.5 rounded-xl bg-green-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-green-800">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Ajouter
            </button>
          </div>
          <div className="space-y-3">
            {stats.map(s => (
              <ItemCard key={s.id} title={s.label} subtitle={`${s.target.toLocaleString('fr-FR')}${s.suffix}`}
                onEdit={() => { setStatForm({ label: s.label, target: s.target, suffix: s.suffix, sort_order: s.sort_order }); setStatModal(s); }}
                onDelete={() => setToDel({ type: 'stat', id: s.id, name: s.label })} />
            ))}
            {stats.length === 0 && <p className="py-8 text-center text-sm text-gray-400">Aucune statistique.</p>}
          </div>
        </div>
      )}

      <AnimatePresence>
        {/* Card modal */}
        {cardModal && (
          <Modal title={cardModal === 'new' ? 'Nouvelle carte KPI' : 'Modifier la carte'} onClose={() => setCardModal(null)} formId="mon-card-form">
            <form id="mon-card-form" onSubmit={saveCard} className="space-y-4">
              <Field label="Label"><input className={inputCls} value={cardForm.label} onChange={e => setCardForm(f => ({ ...f, label: e.target.value }))} placeholder="ex: Carte" /></Field>
              <Field label="Titre"><input required className={inputCls} value={cardForm.title} onChange={e => setCardForm(f => ({ ...f, title: e.target.value }))} placeholder="ex: Parcelles analysées" /></Field>
              <Field label="Valeur"><input required className={inputCls} value={cardForm.value} onChange={e => setCardForm(f => ({ ...f, value: e.target.value }))} placeholder="ex: +24 régions" /></Field>
              <Field label="Ordre"><input type="number" className={inputCls} value={cardForm.sort_order} onChange={e => setCardForm(f => ({ ...f, sort_order: +e.target.value }))} /></Field>
            </form>
          </Modal>
        )}
        {/* Stat modal */}
        {statModal && (
          <Modal title={statModal === 'new' ? 'Nouveau compteur' : 'Modifier le compteur'} onClose={() => setStatModal(null)} formId="mon-stat-form">
            <form id="mon-stat-form" onSubmit={saveStat} className="space-y-4">
              <Field label="Label"><input required className={inputCls} value={statForm.label} onChange={e => setStatForm(f => ({ ...f, label: e.target.value }))} placeholder="ex: Utilisateurs actifs" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Valeur cible (nombre)"><input required type="number" className={inputCls} value={statForm.target} onChange={e => setStatForm(f => ({ ...f, target: +e.target.value }))} /></Field>
                <Field label="Suffixe"><input className={inputCls} value={statForm.suffix} onChange={e => setStatForm(f => ({ ...f, suffix: e.target.value }))} placeholder="+" /></Field>
              </div>
              <Field label="Ordre"><input type="number" className={inputCls} value={statForm.sort_order} onChange={e => setStatForm(f => ({ ...f, sort_order: +e.target.value }))} /></Field>
            </form>
          </Modal>
        )}
        {/* Dashboard item modal */}
        {dashModal && (
          <Modal title={dashModal === 'new' ? 'Nouvel élément dashboard' : 'Modifier l\'élément'} onClose={() => setDashModal(null)} formId="mon-dash-form">
            <form id="mon-dash-form" onSubmit={saveDash} className="space-y-4">
              <Field label="Label"><input required className={inputCls} value={dashForm.label} onChange={e => setDashForm(f => ({ ...f, label: e.target.value }))} placeholder="ex: Sol, Humidité, Temp." /></Field>
              <Field label="Valeur"><input required className={inputCls} value={dashForm.value} onChange={e => setDashForm(f => ({ ...f, value: e.target.value }))} placeholder="ex: 68%, 27°C, pH 6.8" /></Field>
              <Field label="Description courte"><input className={inputCls} value={dashForm.description} onChange={e => setDashForm(f => ({ ...f, description: e.target.value }))} placeholder="ex: Niveau correct" /></Field>
              <Field label="Ordre"><input type="number" className={inputCls} value={dashForm.sort_order} onChange={e => setDashForm(f => ({ ...f, sort_order: +e.target.value }))} /></Field>
            </form>
          </Modal>
        )}
        {toDel && <DeleteConfirm title={toDel.name} onConfirm={remove} onCancel={() => setToDel(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── FEATURES SECTION ─────────────────────────────────────────────────────────

type AdminFeature = { id: number; icon: string; accent: string; title: string; description: string; image: string; sort_order: number };

function FeaturesSection({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [features, setFeatures] = useState<AdminFeature[]>([]);
  const [modal, setModal]       = useState<AdminFeature | 'new' | null>(null);
  const [toDelete, setToDelete] = useState<AdminFeature | null>(null);
  const [form, setForm]         = useState({ icon: '', accent: '', title: '', description: '', image: '', sort_order: 0 });

  const load = () => fetch('/api/features').then(r => r.json()).then(d => setFeatures(d.features ?? [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm({ icon: '', accent: '', title: '', description: '', image: '', sort_order: features.length }); setModal('new'); };
  const openEdit = (f: AdminFeature) => { setForm({ icon: f.icon, accent: f.accent, title: f.title, description: f.description, image: f.image, sort_order: f.sort_order }); setModal(f); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = modal === 'new';
    const url   = isNew ? '/api/features' : `/api/features/${(modal as AdminFeature).id}`;
    const res   = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: AUTH_HEADERS, body: JSON.stringify(form) });
    if (res.ok) { showToast(isNew ? 'Fonctionnalité ajoutée' : 'Fonctionnalité mise à jour'); setModal(null); load(); }
    else showToast('Erreur lors de la sauvegarde', 'error');
  };

  const remove = async (f: AdminFeature) => {
    const res = await fetch(`/api/features/${f.id}`, { method: 'DELETE', headers: AUTH_HEADERS });
    if (res.ok) { showToast('Fonctionnalité supprimée'); setToDelete(null); load(); }
    else showToast('Erreur lors de la suppression', 'error');
  };

  return (
    <div>
      <SectionHeader title="Fonctionnalités" desc="Gérez les cartes affichées sur la page Fonctionnalités." onAdd={openNew} addLabel="Ajouter une fonctionnalité" />
      <div className="space-y-3">
        {features.map(f => (
          <ItemCard key={f.id} title={f.title} subtitle={`${f.accent}${f.icon ? ' · ' + f.icon : ''}`} thumb={f.image} onEdit={() => openEdit(f)} onDelete={() => setToDelete(f)} />
        ))}
        {features.length === 0 && <p className="py-10 text-center text-sm text-gray-400">Aucune fonctionnalité. Ajoutez-en une.</p>}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'new' ? 'Nouvelle fonctionnalité' : 'Modifier la fonctionnalité'} onClose={() => setModal(null)} formId="features-form">
            <form id="features-form" onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Icône (2 lettres)" note="ex: IA, MT"><input className={inputCls} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="IA" maxLength={4} /></Field>
                <Field label="Label / Accent"><input required className={inputCls} value={form.accent} onChange={e => setForm(f => ({ ...f, accent: e.target.value }))} placeholder="ex: Cultures" /></Field>
              </div>
              <Field label="Titre"><input required className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="ex: Recommandations IA" /></Field>
              <Field label="Description"><textarea required className={textareaCls} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description de la fonctionnalité…" /></Field>
              <Field label="Image (URL)"><input className={inputCls} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://…" /></Field>
              <Field label="Ordre d'affichage"><input type="number" className={inputCls} value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} /></Field>
            </form>
          </Modal>
        )}
        {toDelete && <DeleteConfirm title={toDelete.title} onConfirm={() => remove(toDelete)} onCancel={() => setToDelete(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── MARKET SECTION ───────────────────────────────────────────────────────────

type MarketProduct = { id: number; name: string; unit: string; price: string; trend: string; category: string; description: string; sort_order: number };

function MarketSection({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [products, setProducts]   = useState<MarketProduct[]>([]);
  const [modal, setModal]         = useState<MarketProduct | 'new' | null>(null);
  const [toDelete, setToDelete]   = useState<MarketProduct | null>(null);
  const [form, setForm]           = useState({ name: '', unit: 'kg', price: '', trend: 'stable', category: '', description: '', sort_order: 0 });

  const load = () => fetch('/api/market').then(r => r.json()).then(d => setProducts(d.products ?? [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm({ name: '', unit: 'kg', price: '', trend: 'stable', category: '', description: '', sort_order: products.length }); setModal('new'); };
  const openEdit = (p: MarketProduct) => { setForm({ name: p.name, unit: p.unit, price: p.price, trend: p.trend, category: p.category, description: p.description, sort_order: p.sort_order }); setModal(p); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = modal === 'new';
    const url   = isNew ? '/api/market' : `/api/market/${(modal as MarketProduct).id}`;
    const res   = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: AUTH_HEADERS, body: JSON.stringify(form) });
    if (res.ok) { showToast(isNew ? 'Produit ajouté' : 'Produit mis à jour'); setModal(null); load(); }
    else showToast('Erreur lors de la sauvegarde', 'error');
  };

  const remove = async (p: MarketProduct) => {
    const res = await fetch(`/api/market/${p.id}`, { method: 'DELETE', headers: AUTH_HEADERS });
    if (res.ok) { showToast('Produit supprimé'); setToDelete(null); load(); }
    else showToast('Erreur lors de la suppression', 'error');
  };

  const trendColors: Record<string, string> = { up: 'text-green-600', down: 'text-red-500', stable: 'text-gray-400' };
  const trendLabels: Record<string, string> = { up: '↑ Hausse', down: '↓ Baisse', stable: '→ Stable' };

  return (
    <div>
      <SectionHeader title="Marché agricole" desc="Gérez les produits et prix affichés sur la page Marché et dans le popup Navbar." onAdd={openNew} addLabel="Ajouter un produit" />
      <div className="space-y-3">
        {products.map(p => (
          <ItemCard key={p.id} title={p.name} subtitle={`${p.price} / ${p.unit} · ${p.category}`} onEdit={() => openEdit(p)} onDelete={() => setToDelete(p)}>
            <span className={`text-xs font-bold ${trendColors[p.trend] ?? 'text-gray-400'}`}>{trendLabels[p.trend] ?? p.trend}</span>
          </ItemCard>
        ))}
        {products.length === 0 && <p className="py-10 text-center text-sm text-gray-400">Aucun produit. Ajoutez-en un.</p>}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'new' ? 'Nouveau produit' : 'Modifier le produit'} onClose={() => setModal(null)} formId="market-form">
            <form id="market-form" onSubmit={save} className="space-y-4">
              <Field label="Nom du produit"><input required className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="ex: Maïs" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Unité">
                  <select className={inputCls} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                    {['kg', 'tonne', 'sac (50 kg)', 'régime', 'unité', 'litre'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </Field>
                <Field label="Prix (FCFA)"><input required className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="ex: 150 FCFA" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tendance">
                  <select className={inputCls} value={form.trend} onChange={e => setForm(f => ({ ...f, trend: e.target.value }))}>
                    <option value="up">↑ En hausse</option>
                    <option value="stable">→ Stable</option>
                    <option value="down">↓ En baisse</option>
                  </select>
                </Field>
                <Field label="Catégorie"><input className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="ex: Céréales" /></Field>
              </div>
              <Field label="Description (optionnel)"><textarea className={textareaCls} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Informations complémentaires…" /></Field>
              <Field label="Ordre d'affichage"><input type="number" className={inputCls} value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} /></Field>
            </form>
          </Modal>
        )}
        {toDelete && <DeleteConfirm title={toDelete.name} onConfirm={() => remove(toDelete)} onCancel={() => setToDelete(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── COMMUNITY SECTION ────────────────────────────────────────────────────────

type CommunityLink = { id: number; label: string; href: string; value: string; sort_order: number };

function CommunitySection({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [links, setLinks]   = useState<CommunityLink[]>([]);
  const [modal, setModal]   = useState<CommunityLink | 'new' | null>(null);
  const [toDelete, setToDelete] = useState<CommunityLink | null>(null);
  const [form, setForm]     = useState({ label: '', href: '', value: '', sort_order: 0 });

  const load = () => fetch('/api/community').then(r => r.json()).then(d => setLinks(d.links ?? [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm({ label: '', href: '', value: '', sort_order: links.length }); setModal('new'); };
  const openEdit = (l: CommunityLink) => { setForm({ label: l.label, href: l.href, value: l.value, sort_order: l.sort_order }); setModal(l); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = modal === 'new';
    const url   = isNew ? '/api/community' : `/api/community/${(modal as CommunityLink).id}`;
    const res   = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: AUTH_HEADERS, body: JSON.stringify(form) });
    if (res.ok) { showToast(isNew ? 'Lien ajouté' : 'Lien mis à jour'); setModal(null); load(); }
    else showToast('Erreur lors de la sauvegarde', 'error');
  };

  const remove = async (l: CommunityLink) => {
    const res = await fetch(`/api/community/${l.id}`, { method: 'DELETE', headers: AUTH_HEADERS });
    if (res.ok) { showToast('Lien supprimé'); setToDelete(null); load(); }
    else showToast('Erreur lors de la suppression', 'error');
  };

  return (
    <div>
      <SectionHeader title="Communauté" desc="Gérez les liens communautaires affichés sur la page Communauté (WhatsApp, Telegram, etc.)." onAdd={openNew} addLabel="Ajouter un lien" />
      <div className="space-y-3">
        {links.map(l => (
          <ItemCard key={l.id} title={l.label} subtitle={l.value ? `${l.value} · ${l.href}` : l.href} onEdit={() => openEdit(l)} onDelete={() => setToDelete(l)} />
        ))}
        {links.length === 0 && <p className="py-10 text-center text-sm text-gray-400">Aucun lien communautaire. Ajoutez-en un.</p>}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'new' ? 'Nouveau lien' : 'Modifier le lien'} onClose={() => setModal(null)} formId="community-form">
            <form id="community-form" onSubmit={save} className="space-y-4">
              <Field label="Plateforme"><input required className={inputCls} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="ex: WhatsApp" /></Field>
              <Field label="URL"><input required type="url" className={inputCls} value={form.href} onChange={e => setForm(f => ({ ...f, href: e.target.value }))} placeholder="https://…" /></Field>
              <Field label="Description courte"><input className={inputCls} value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="ex: Groupe terrain" /></Field>
              <Field label="Ordre d'affichage"><input type="number" className={inputCls} value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} /></Field>
            </form>
          </Modal>
        )}
        {toDelete && <DeleteConfirm title={toDelete.label} onConfirm={() => remove(toDelete)} onCancel={() => setToDelete(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

type SectionId = 'articles' | 'team' | 'partners' | 'gallery' | 'workflow' | 'guide' | 'downloads' | 'footer' | 'messages' | 'features' | 'market' | 'community' | 'monitoring';

const SIDEBAR_ITEMS: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'articles', label: 'Actualités', icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg> },
  { id: 'team', label: 'Équipe', icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
  { id: 'partners', label: 'Partenaires', icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg> },
  { id: 'gallery', label: 'Galerie', icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg> },
  { id: 'workflow', label: 'Comment ça marche', icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { id: 'guide', label: 'Guide', icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> },
  { id: 'downloads', label: 'Téléchargements', icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg> },
  { id: 'footer', label: 'Footer & Contact', icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg> },
  { id: 'messages',  label: 'Messages',        icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg> },
  { id: 'features',  label: 'Fonctionnalités',  icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .925 2.67-.174 3.57a26.07 26.07 0 01-5.624 3.294m-11.07-4.866l1.402-1.402M5 14.5l-1.402 1.402" /></svg> },
  { id: 'market',    label: 'Marché',          icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg> },
  { id: 'community', label: 'Communauté',      icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg> },
  { id: 'monitoring', label: 'IA & Monitoring',  icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg> },
];

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('articles');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') setAuthenticated(true);
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetch('/api/messages', { headers: { Authorization: `Bearer ${TOKEN}` } })
      .then(r => r.json())
      .then(d => setUnreadCount(d.unreadCount ?? 0))
      .catch(() => {});
  }, [authenticated]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => { sessionStorage.removeItem(SESSION_KEY); setAuthenticated(false); };

  if (!authenticated) return <LoginScreen onLogin={() => setAuthenticated(true)} />;

  const activeLabel = SIDEBAR_ITEMS.find(s => s.id === activeSection)?.label ?? '';

  return (
    <div className="flex h-screen flex-col bg-gray-50 font-sans overflow-hidden">
      <header className="shrink-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 lg:hidden">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden">
                <img src="/logo.png" alt="Ai-Forest Planner" className="h-full w-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-extrabold text-gray-900 leading-none">AI-Forest Planner</p>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5">Administration</p>
              </div>
            </div>
            <span className="hidden text-gray-300 lg:block">·</span>
            <span className="hidden text-sm font-semibold text-gray-600 lg:block">{activeLabel}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            Déconnexion
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <>
          {sidebarOpen && <div className="fixed inset-0 z-10 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
          <aside className={`fixed inset-y-0 left-0 z-20 flex w-60 flex-col border-r border-gray-200 bg-white pt-16 shadow-xl transition-transform lg:relative lg:inset-auto lg:translate-x-0 lg:pt-0 lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
              {SIDEBAR_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition text-left ${activeSection === item.id ? 'bg-green-950 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  <span className={activeSection === item.id ? 'text-green-300' : 'text-gray-400'}>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.id === 'messages' && unreadCount > 0 && (
                    <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="shrink-0 border-t border-gray-100 p-4">
              <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-gray-400 hover:text-green-700">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                Voir le site
              </a>
            </div>
          </aside>
        </>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {activeSection === 'articles' && <ArticlesSection showToast={showToast} />}
          {activeSection === 'team' && <TeamSection showToast={showToast} />}
          {activeSection === 'partners' && <PartnersSection showToast={showToast} />}
          {activeSection === 'gallery' && <GallerySection showToast={showToast} />}
          {activeSection === 'workflow' && <WorkflowSection showToast={showToast} />}
          {activeSection === 'guide' && <GuideSection_ showToast={showToast} />}
          {activeSection === 'downloads' && <DownloadsSection showToast={showToast} />}
          {activeSection === 'footer' && <FooterSection showToast={showToast} />}
          {activeSection === 'messages'  && <MessagesSection showToast={showToast} onUnreadChange={setUnreadCount} />}
          {activeSection === 'features'  && <FeaturesSection showToast={showToast} />}
          {activeSection === 'market'    && <MarketSection showToast={showToast} />}
          {activeSection === 'community'  && <CommunitySection showToast={showToast} />}
          {activeSection === 'monitoring' && <MonitoringSection showToast={showToast} />}
        </main>
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
}
