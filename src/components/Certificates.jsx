import { useMemo } from 'react';
import { useState } from 'react';
import { GraduationCap, ExternalLink, Pencil, Trash2, Plus, BadgeCheck, RotateCcw } from 'lucide-react';
import { certificates } from '../data/certificates';
import { projectDate } from '../data/projects';
import { useSettings } from '../hooks/useSettings';
import { useMyCertificates } from '../hooks/useMyCertificates';

export default function Certificates({ onAdd, onEdit }) {
  const [confirmDel, setConfirmDel] = useState(null);
  const { lang, t } = useSettings();
  const { myCertificates, deleteCertificate, hiddenIds, hideExample, restoreExamples } = useMyCertificates();

  const all = useMemo(
    () => [...myCertificates, ...certificates.filter((c) => !hiddenIds.includes(c.id))],
    [myCertificates, hiddenIds]
  );

  const askDelete = (e, c) => {
    e.stopPropagation();
    if (confirmDel === c.id) {
      if (c.custom) deleteCertificate(c.id);
      else hideExample(c.id);
      setConfirmDel(null);
    } else {
      setConfirmDel(c.id);
      setTimeout(() => setConfirmDel((cid) => (cid === c.id ? null : cid)), 3000);
    }
  };

  return (
    <section id="certificates" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
      <p className="font-mono text-sm accent-text mb-2">{t.certs.kicker}</p>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
        <h2 className="text-3xl font-bold">{t.certs.title}</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onAdd}
            className="px-4 py-2 rounded-xl accent-bg text-black font-semibold text-sm flex items-center gap-1.5 hover:shadow-glow transition-shadow"
          >
            <Plus size={16} /> {t.certs.add}
          </button>
          {hiddenIds.length > 0 && (
            <button
              onClick={restoreExamples}
              title={t.certs.showExamples}
              className="px-3 py-2 rounded-xl glass text-xs font-semibold flex items-center gap-1.5 opacity-70 hover:opacity-100"
            >
              <RotateCcw size={14} /> {t.certs.showExamples} ({hiddenIds.length})
            </button>
          )}
        </div>
      </div>
      <p className="text-sm opacity-60 mb-6">{t.certs.sub}</p>

      {all.length === 0 && <p className="opacity-60 text-sm">{t.certs.emptyMine}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((c) => (
          <div key={c.id} className="glass rounded-2xl p-5 hover:shadow-glow hover:-translate-y-1 transition-all flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <span className="w-10 h-10 rounded-xl accent-bg grid place-items-center text-black shrink-0">
                <GraduationCap size={20} />
              </span>
              {c.custom && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold shrink-0">{t.projects.mine}</span>}
            </div>
            <h3 className="mt-3 font-bold leading-snug">{c.title}</h3>
            <p className="mt-1 text-sm opacity-70 flex items-center gap-1.5">
              <BadgeCheck size={14} className="accent-text shrink-0" /> {c.issuer}
            </p>
            <p className="mt-1 text-xs font-mono opacity-50">{projectDate({ date: c.date, year: '' }, lang) || c.date}</p>
            {c.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.skills.map((s) => (
                  <span key={s} className="text-[11px] font-mono px-2 py-0.5 rounded-md border accent-border opacity-80">{s}</span>
                ))}
              </div>
            )}
            {c.credentialId && <p className="mt-2 text-[11px] font-mono opacity-50">ID: {c.credentialId}</p>}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
              {c.url ? (
                <a href={c.url} target="_blank" rel="noreferrer" className="text-sm font-semibold accent-text flex items-center gap-1.5 hover:text-glow">
                  <ExternalLink size={15} /> {t.certs.verify}
                </a>
              ) : <span />}
              {c.custom && (
                <button onClick={() => onEdit(c)} className="p-1.5 rounded-lg glass opacity-70 hover:opacity-100 hover:shadow-glow" aria-label="edit">
                  <Pencil size={14} />
                </button>
              )}
              <button
                onClick={(e) => askDelete(e, c)}
                title={confirmDel === c.id ? t.projects.delSure : 'delete'}
                className={`p-1.5 rounded-lg glass opacity-80 hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-colors ${confirmDel === c.id ? 'bg-red-500 text-white opacity-100' : ''}`}
                aria-label="delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
            {confirmDel === c.id && <p className="mt-1 text-xs text-red-400">{t.projects.delSure}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
