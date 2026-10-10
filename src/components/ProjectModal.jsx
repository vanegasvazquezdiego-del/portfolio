import { useEffect, useState } from 'react';
import { X, Github, ExternalLink, Star, Check, FileText, Loader2 } from 'lucide-react';
import { pick, projectDate } from '../data/projects';
import { useSettings } from '../hooks/useSettings';
import { idbGet } from '../lib/idb';

function AttachmentButton({ attachment, t }) {
  const [url, setUrl] = useState(attachment?.dataUrl || null);
  const [state, setState] = useState(attachment?.dataUrl ? 'ready' : 'loading');

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;
    if (attachment?.dataUrl) {
      setUrl(attachment.dataUrl);
      setState('ready');
      return undefined;
    }
    if (!attachment?.ref) {
      setState('missing');
      return undefined;
    }
    setState('loading');
    idbGet(attachment.ref)
      .then((blob) => {
        if (cancelled) return;
        if (blob) {
          objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
          setState('ready');
        } else {
          setState('missing');
        }
      })
      .catch(() => !cancelled && setState('missing'));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [attachment]);

  if (state === 'loading') {
    return (
      <span className="px-4 py-2 rounded-xl border border-white/10 font-semibold text-sm flex items-center gap-2 opacity-60">
        <Loader2 size={16} className="animate-spin" /> {t.modal.attachLoading}
      </span>
    );
  }
  if (state === 'missing' || !url) {
    return (
      <span className="px-4 py-2 rounded-xl border border-white/10 text-sm opacity-50">
        {t.modal.attachMissing}
      </span>
    );
  }
  return (
    <a href={url} download={attachment.name} className="px-4 py-2 rounded-xl border accent-border font-semibold text-sm flex items-center gap-2 hover:shadow-glow">
      <FileText size={16} /> {attachment.name} · {t.modal.download}
    </a>
  );
}

export default function ProjectModal({ project, onClose }) {
  const { lang, t } = useSettings();

  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', fn);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-card">
        <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
        <div className="p-6 sm:p-8">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg glass hover:shadow-glow" aria-label={t.modal.close}><X size={18} /></button>
          <h3 className="text-2xl font-bold pr-10">{project.title}</h3>
          <p className="mt-1 text-xs font-mono opacity-50 flex items-center gap-1"><Star size={12} /> {!project.custom && <>{project.stars} {t.projects.stars} · </>}{projectDate(project, lang)}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((tg) => (
              <span key={tg} className="text-[11px] font-mono px-2 py-0.5 rounded-md accent-bg text-black font-semibold">{tg}</span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed opacity-80">{pick(project, 'description', lang)}</p>
          <h4 className="mt-6 font-semibold text-sm uppercase tracking-wider opacity-60">{t.modal.features}</h4>
          <ul className="mt-2 space-y-2">
            {pick(project, 'features', lang).map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm"><Check size={16} className="accent-text mt-0.5 shrink-0" /> {f}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl glass font-semibold text-sm flex items-center gap-2 hover:shadow-glow">
                <Github size={16} /> {t.modal.github}
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl accent-bg text-black font-semibold text-sm flex items-center gap-2 hover:shadow-glow">
                <ExternalLink size={16} /> {t.modal.demo}
              </a>
            )}
            {(project.attachment?.dataUrl || project.attachment?.ref) && (
              <AttachmentButton attachment={project.attachment} t={t} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
