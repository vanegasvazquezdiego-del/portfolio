import { useEffect, useState } from 'react';
import { X, Save, RotateCcw, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { useSettings } from '../hooks/useSettings';
import { languages } from '../i18n/translations';
import { fileToAvatarDataUrl, initialsOf, MAX_AVATAR_BYTES } from '../lib/avatar';

const inputCls =
  'w-full bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:shadow-glow';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wider opacity-60 mb-1">{label}</span>
      {children}
    </label>
  );
}

export default function ContentEditor({ open, onClose }) {
  const { content, setContent, reset } = useContent();
  const { t } = useSettings();
  const [tab, setTab] = useState('es');
  const [draft, setDraft] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoErr, setPhotoErr] = useState('');

  useEffect(() => {
    if (open) {
      setDraft(JSON.parse(JSON.stringify(content)));
      setTab('es');
    }
  }, [open, content]);

  if (!open || !draft) return null;

  const set = (field, value) => setDraft((d) => ({ ...d, [field]: value }));
  const setLang = (field, value) => setDraft((d) => ({ ...d, [tab]: { ...d[tab], [field]: value } }));
  const setCard = (i, field, value) =>
    setDraft((d) => {
      const cards = d[tab].cards.map((c, j) => (j === i ? { ...c, [field]: value } : c));
      return { ...d, [tab]: { ...d[tab], cards } };
    });

  const save = () => {
    setContent(draft);
    onClose();
  };

  const restore = () => {
    reset();
    onClose();
  };

  const onPhoto = async (file) => {
    setPhotoErr('');
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) {
      setPhotoErr(e.avatarTooBig);
      return;
    }
    setPhotoBusy(true);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setDraft((d) => ({ ...d, avatar: { dataUrl, name: file.name } }));
    } catch {
      setPhotoErr(e.avatarBad);
    } finally {
      setPhotoBusy(false);
    }
  };

  const e = t.editor;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-card">
        <div className="p-6 sm:p-8">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg glass hover:shadow-glow" aria-label={e.close}>
            <X size={18} />
          </button>
          <h3 className="text-2xl font-bold flex items-center gap-2 pr-10">
            <Pencil size={20} className="accent-text" /> {e.title}
          </h3>
          <p className="mt-1 text-xs opacity-50">{e.note}</p>

          <div className="mt-5 grid gap-3">
            <div className="flex items-center gap-4 rounded-xl border border-white/10 p-3">
              {draft.avatar?.dataUrl ? (
                <img src={draft.avatar.dataUrl} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-[var(--accent)] shrink-0" />
              ) : (
                <span className="w-16 h-16 rounded-full accent-bg text-black grid place-items-center text-xl font-bold shrink-0">
                  {initialsOf(draft.name)}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-mono uppercase tracking-wider opacity-60 mb-1">{e.avatar}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(ev) => onPhoto(ev.target.files?.[0])}
                  className="w-full text-xs opacity-80 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:accent-bg file:text-black file:font-semibold file:text-xs"
                />
                {photoBusy && <p className="mt-1 text-xs opacity-60 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> {e.avatarLoading}</p>}
                {photoErr && <p className="mt-1 text-xs text-red-400">{photoErr}</p>}
              </div>
              {draft.avatar?.dataUrl && (
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, avatar: null }))}
                  className="p-2 rounded-lg glass opacity-70 hover:opacity-100 shrink-0"
                  aria-label={e.avatarRemove}
                  title={e.avatarRemove}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label={e.name}>
                <input value={draft.name} onChange={(ev) => set('name', ev.target.value)} className={inputCls} />
              </Field>
              <Field label={e.location}>
                <input value={draft[tab].location} onChange={(ev) => setLang('location', ev.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label={e.role}>
              <input value={draft[tab].role} onChange={(ev) => setLang('role', ev.target.value)} className={inputCls} />
            </Field>
            <Field label={e.tagline}>
              <textarea value={draft[tab].tagline} onChange={(ev) => setLang('tagline', ev.target.value)} rows={2} className={`${inputCls} resize-none`} />
            </Field>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label={e.email}>
                <input value={draft.email} onChange={(ev) => set('email', ev.target.value)} className={inputCls} />
              </Field>
              <Field label={e.github}>
                <input value={draft.github} onChange={(ev) => set('github', ev.target.value)} className={inputCls} />
              </Field>
              <Field label={e.linkedin}>
                <input value={draft.linkedin} onChange={(ev) => set('linkedin', ev.target.value)} className={inputCls} />
              </Field>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider opacity-60">{e.language}:</span>
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => setTab(l.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${tab === l.id ? 'accent-bg text-black border-transparent' : 'glass opacity-60 hover:opacity-100'}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="mt-3 grid gap-3">
            <Field label={e.aboutTitle}>
              <input value={draft[tab].aboutTitle} onChange={(ev) => setLang('aboutTitle', ev.target.value)} className={inputCls} />
            </Field>
            {draft[tab].cards.map((c, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-3 grid gap-2">
                <p className="text-xs font-mono accent-text">{e.card} {i + 1}</p>
                <input
                  value={c.t}
                  onChange={(ev) => setCard(i, 't', ev.target.value)}
                  placeholder={e.cardTitle}
                  className={inputCls}
                />
                <textarea
                  value={c.d}
                  onChange={(ev) => setCard(i, 'd', ev.target.value)}
                  placeholder={e.cardDesc}
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={save} className="flex-1 min-w-40 px-4 py-2.5 rounded-xl accent-bg text-black font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-glow">
              <Save size={16} /> {e.save}
            </button>
            <button onClick={restore} className="px-4 py-2.5 rounded-xl glass text-sm font-semibold flex items-center gap-2 hover:shadow-glow">
              <RotateCcw size={15} /> {e.reset}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
