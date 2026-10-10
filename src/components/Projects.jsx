import { useMemo, useState } from 'react';
import { Github, ExternalLink, Star, Search, Plus, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { projects, allTags, pick, projectDate } from '../data/projects';
import { useSettings } from '../hooks/useSettings';
import { useMyProjects } from '../hooks/useMyProjects';

export default function Projects({ onSelect, onAdd, onEdit }) {
  const [tag, setTag] = useState('All');
  const [q, setQ] = useState('');
  const [confirmDel, setConfirmDel] = useState(null);
  const { settings, lang, t } = useSettings();
  const { myProjects, deleteProject, hiddenIds, hideExample, restoreExamples } = useMyProjects();

  const all = useMemo(
    () => [...myProjects, ...projects.filter((p) => !hiddenIds.includes(p.id))],
    [myProjects, hiddenIds]
  );

  const list = useMemo(
    () =>
      all.filter(
        (p) =>
          (tag === 'All' || p.tags.includes(tag)) &&
          (q === '' || (p.title + p.summary + (p.summary_es || '') + p.tags.join(' ')).toLowerCase().includes(q.toLowerCase()))
      ),
    [all, tag, q]
  );

  const askDelete = (e, p) => {
    e.stopPropagation();
    if (confirmDel === p.id) {
      if (p.custom) deleteProject(p.id);
      else hideExample(p.id);
      setConfirmDel(null);
    } else {
      setConfirmDel(p.id);
      setTimeout(() => setConfirmDel((c) => (c === p.id ? null : c)), 3000);
    }
  };

  return (
    <section id="projects" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
      <p className="font-mono text-sm accent-text mb-2">{t.projects.kicker}</p>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold">{t.projects.title}</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.projects.search}
              className="glass rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:shadow-glow w-52 bg-transparent"
            />
          </div>
          <button
            onClick={onAdd}
            className="px-4 py-2 rounded-xl accent-bg text-black font-semibold text-sm flex items-center gap-1.5 hover:shadow-glow transition-shadow"
          >
            <Plus size={16} /> {t.projects.add}
          </button>
          {hiddenIds.length > 0 && (
            <button
              onClick={restoreExamples}
              title={t.projects.showExamples}
              className="px-3 py-2 rounded-xl glass text-xs font-semibold flex items-center gap-1.5 opacity-70 hover:opacity-100"
            >
              <RotateCcw size={14} /> {t.projects.showExamples} ({hiddenIds.length})
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {allTags.map((tagId) => (
          <button
            key={tagId}
            onClick={() => setTag(tagId)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all ${
              tag === tagId ? 'accent-bg text-black shadow-glow border-transparent' : 'glass opacity-70 hover:opacity-100'
            }`}
          >
            {tagId === 'All' ? t.projects.all : tagId}
          </button>
        ))}
      </div>

      {list.length === 0 && (
        <p className="opacity-60 text-sm">{myProjects.length === 0 && tag === 'All' && q === '' ? t.projects.emptyMine : t.projects.empty}</p>
      )}

      <div className={`grid gap-4 ${settings.compact ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} ${settings.compact ? '[&>div]:p-4' : ''}`}>
        {list.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            className={`glass rounded-2xl overflow-hidden cursor-pointer hover:shadow-glow hover:-translate-y-1 transition-all group ${settings.compact ? 'p-4' : ''}`}
          >
            <div className={`h-2 bg-gradient-to-r ${p.gradient}`} />
            <div className={settings.compact ? '' : 'p-6'}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-lg leading-snug group-hover:accent-text transition-colors">{p.title}</h3>
                <span className="flex gap-1 shrink-0">
                  {p.custom && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold">{t.projects.mine}</span>}
                  {p.featured && !p.custom && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full accent-bg text-black font-bold">FEATURED</span>}
                </span>
              </div>
              <p className={`mt-2 text-sm opacity-70 leading-relaxed ${settings.compact ? 'line-clamp-2' : 'line-clamp-3'}`}>{pick(p, 'summary', lang)}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((tg) => (
                  <span key={tg} className="text-[11px] font-mono px-2 py-0.5 rounded-md border accent-border opacity-80">{tg}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 opacity-60">
                  {!p.custom && <><Star size={14} /> {p.stars} · </>}{projectDate(p, lang)}
                </span>
                <span className="flex gap-2 items-center">
                  {p.custom && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                      className="p-1.5 rounded-lg glass opacity-70 hover:opacity-100 hover:shadow-glow"
                      aria-label="edit"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  <button
                    onClick={(e) => askDelete(e, p)}
                    title={confirmDel === p.id ? t.projects.delSure : 'delete'}
                    className={`p-1.5 rounded-lg glass opacity-80 hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-colors ${confirmDel === p.id ? 'bg-red-500 text-white opacity-100' : ''}`}
                    aria-label="delete"
                  >
                    <Trash2 size={15} />
                  </button>
                  {p.github && <a href={p.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:accent-text p-1"><Github size={16} /></a>}
                  {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:accent-text p-1"><ExternalLink size={16} /></a>}
                </span>
                </div>
              {confirmDel === p.id && <p className="mt-1 text-xs text-red-400">{t.projects.delSure}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
