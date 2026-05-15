'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';

type Category = 'Tous' | 'Agriculture' | 'Technologie' | 'Partenariats' | 'Événements';

type Article = {
  id: number;
  category: Category;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
  src: string;
  author: { name: string; role: string };
};

const categories: Category[] = ['Tous', 'Agriculture', 'Technologie', 'Partenariats', 'Événements'];

const tagColors: Record<string, string> = {
  Nouveau: 'bg-green-100 text-green-800',
  'Mise à jour': 'bg-blue-100 text-blue-800',
  Partenariat: 'bg-amber-100 text-amber-800',
  Événement: 'bg-purple-100 text-purple-700',
  Étude: 'bg-teal-100 text-teal-800',
  Innovation: 'bg-orange-100 text-orange-700',
};

const POST_JSON = { 'Content-Type': 'application/json' };

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-green-950/70 backdrop-blur-sm sm:items-center sm:px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-52 shrink-0 overflow-hidden sm:h-64">
          <img src={article.src} alt={article.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 to-transparent" />
          <span className={`absolute left-5 top-5 rounded-full px-3 py-1 text-xs font-bold ${tagColors[article.tag] ?? 'bg-green-100 text-green-800'}`}>
            {article.tag}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xl text-white backdrop-blur transition hover:bg-white/35"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-600">
            {article.category} · {article.date}
          </p>
          <h2 className="mt-3 text-xl font-extrabold leading-snug tracking-tight text-gray-950 sm:text-2xl">
            {article.title}
          </h2>

          <div className="mt-4 flex items-center gap-3 border-b border-green-100 pb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-900">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{article.author.name}</p>
              <p className="text-xs text-gray-500">{article.author.role}</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {article.body.map((paragraph, i) => (
              <p key={i} className="text-sm leading-7 text-gray-700">{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-green-100 px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-green-950 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('Tous');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [newsStatus, setNewsStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  const handleNewsNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    if (!email) return;
    try {
      const res = await fetch('/api/messages', { method: 'POST', headers: POST_JSON, body: JSON.stringify({ type: 'newsletter', email }) });
      if (res.ok) {
        setNewsStatus('ok');
        form.reset();
      } else {
        setNewsStatus('error');
      }
    } catch {
      setNewsStatus('error');
    }
  };

  useEffect(() => {
    fetch('/api/articles').then(r => r.json()).then(d => {
      if (d.articles) {
        setArticles(d.articles.map((a: Record<string, unknown>) => ({
          ...a,
          author: { name: a.author_name, role: a.author_role },
        })));
      }
    }).catch(() => {});
  }, []);

  const filtered =
    activeCategory === 'Tous'
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <div className="relative overflow-hidden bg-green-50 text-gray-900">
      <Navbar />
      <main>

        {/* HERO */}
        <section className="bg-green-950 px-6 pb-20 pt-36 text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-[0.32em] text-green-300"
            >
              Actualités
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.07 }}
              className="mx-auto mt-4 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl"
            >
              Les dernières nouvelles d'AI-Forest Planner.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
              className="mx-auto mt-5 max-w-2xl text-base leading-8 text-green-200"
            >
              Mises à jour produit, partenariats, études de terrain et événements — tout ce qui se passe autour de notre mission agricole.
            </motion.p>
          </div>
        </section>

        {/* FILTERS */}
        <section className="sticky top-16 z-30 border-b border-green-100 bg-white/95 px-6 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-green-950 text-white shadow-md'
                    : 'border border-green-200 bg-green-50 text-gray-700 hover:border-green-400 hover:bg-green-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white px-6 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* FEATURED ARTICLE */}
                {featured && (
                  <article
                    className="mb-12 cursor-pointer overflow-hidden rounded-[2rem] border border-green-100 bg-green-50 shadow-sm transition hover:shadow-md lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch"
                    onClick={() => setSelectedArticle(featured)}
                  >
                    <div className="relative h-64 overflow-hidden lg:h-auto">
                      <img
                        src={featured.src}
                        alt={featured.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-950/50 via-transparent to-transparent lg:bg-gradient-to-r" />
                      <span className={`absolute left-5 top-5 rounded-full px-3 py-1 text-xs font-bold ${tagColors[featured.tag] ?? 'bg-green-100 text-green-800'}`}>
                        {featured.tag}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center p-8 lg:p-10">
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-600">
                        {featured.category} · {featured.date}
                      </p>
                      <h2 className="mt-3 text-2xl font-extrabold leading-snug tracking-tight text-gray-950 lg:text-3xl">
                        {featured.title}
                      </h2>
                      <p className="mt-4 text-sm leading-7 text-gray-600">{featured.excerpt}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-green-100 pt-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-900">
                            {featured.author.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{featured.author.name}</p>
                            <p className="text-xs text-gray-500">{featured.author.role}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-green-600">Lire l'article →</span>
                      </div>
                    </div>
                  </article>
                )}

                {/* GRID */}
                {rest.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((article, i) => (
                      <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.07 }}
                        onClick={() => setSelectedArticle(article)}
                        className="group flex cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-green-100 bg-green-50 shadow-sm transition hover:shadow-md"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.src}
                            alt={article.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-green-950/40 to-transparent" />
                          <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${tagColors[article.tag] ?? 'bg-green-100 text-green-800'}`}>
                            {article.tag}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-green-600">
                            {article.category} · {article.date}
                          </p>
                          <h3 className="mt-2 flex-1 text-base font-bold leading-snug text-gray-950">
                            {article.title}
                          </h3>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                            {article.excerpt}
                          </p>
                          <div className="mt-5 flex items-center justify-between border-t border-green-100 pt-4">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-900">
                                {article.author.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-900">{article.author.name}</p>
                                <p className="text-[10px] text-gray-500">{article.author.role}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-green-600 opacity-0 transition group-hover:opacity-100">
                              Lire →
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}

                {filtered.length === 0 && (
                  <div className="py-24 text-center">
                    <p className="text-4xl">🌱</p>
                    <p className="mt-4 text-lg font-bold text-gray-950">Aucun article dans cette catégorie.</p>
                    <p className="mt-2 text-sm text-gray-500">Revenez bientôt, nous publions régulièrement.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* NEWSLETTER CTA */}
        <section className="bg-green-50 px-6 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-green-200 bg-white p-8 text-center shadow-sm lg:grid-cols-[1fr_auto] lg:items-center lg:text-left">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
                Ne manquez aucune actualité.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 lg:mx-0">
                Recevez nos dernières nouvelles, mises à jour et conseils agricoles directement dans votre boîte mail.
              </p>
            </div>
            {newsStatus === 'ok' ? (
              <p className="rounded-full bg-green-100 px-6 py-3 text-sm font-semibold text-green-800 lg:w-auto">
                Merci, vous êtes inscrit !
              </p>
            ) : (
              <form
                className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto"
                onSubmit={handleNewsNewsletter}
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Votre email"
                  className="rounded-full border border-green-200 bg-green-50 px-5 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100 sm:w-64"
                />
                <div className="flex flex-col gap-1">
                  <button
                    type="submit"
                    className="rounded-full bg-green-950 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-800"
                  >
                    S'abonner
                  </button>
                  {newsStatus === 'error' && (
                    <p className="text-center text-xs text-red-600">Une erreur est survenue, réessayez.</p>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />

      {/* ARTICLE MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
