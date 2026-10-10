import { useEffect, useMemo, useState } from 'react';
import { X, Save, Plus, FileText, Trash2, Loader2 } from 'lucide-react';
import { certificates } from '../data/certificates';
import { useSettings } from '../hooks/useSettings';
import { useMyCertificates } from '../hooks/useMyCertificates';
import { MAX_ATTACH_BYTES } from '../hooks/useMyProjects';
import { idbPut, idbDelete } from '../lib/idb';

const inputCls = 'w-full bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:shadow-glow';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wider opacity-60 mb-1">{label}</span>
      {children}
    </label>
  );
}

export default function CertificateForm({ open, initial, onClose }) {
  const { t } = useSettings();
  const { myCertificates, addCertificate, updateCertificate } = useMyCertificates();
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [url, setUrl] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [skills, setSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [attach, setAttach] = useState(null); // {name,type,size,file?|ref?|dataUrl?}
  const [attachErr, setAttachErr] = useState('');
  const [saving, setSaving] = useState(false);

  const todayLocal = () => {
    const d = new Date();
    const p2 = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  };

  const suggestions = useMemo(() => {
    const set = new Set();
    [...myCertificates, ...certificates].forEach((c) => (c.skills || []).forEach((s) => set.add(s)));
    ['Python', 'JavaScript', 'React', 'Docker', 'Linux', 'AWS', 'Cloud'].forEach((s) => set.add(s));
    return [...set].sort();
  }, [myCertificates]);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '');
      setIssuer(initial?.issuer || '');
      setDate(initial?.date || (initial ? '' : todayLocal()));
      setUrl(initial?.url || '');
      setCredentialId(initial?.credentialId || '');
      setSkills(initial?.skills || []);
      setCustomSkill('');
      setAttach(initial?.attachment || null);
      setAttachErr('');
    }
  }, [open, initial]);

  if (!open) return null;
  const f = t.certForm;
  const pf = t.projectForm;

  const toggleSkill = (s) => setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const addCustomSkill = () => {
    const v = customSkill.trim();
    if (v && !skills.includes(v)) setSkills((s) => [...s, v]);
    setCustomSkill('');
  };

  const valid = issuer.trim() !== '';

  const onFile = (file) => {
    setAttachErr('');
    if (!file) return;
    if (file.size > MAX_ATTACH_BYTES) {
      setAttachErr(f.attachTooBig);
      return;
    }
    // Kept as a File object; stored into IndexedDB on save.
    setAttach({ name: file.name, type: file.type || 'file', size: file.size, file });
  };

  const save = async () => {
    if (!valid || saving) return;
    setSaving(true);
    setAttachErr('');
    try {
      const id = initial?.id || `cert-${Date.now().toString(36)}`;
      let attachment = null;
      if (attach?.file) {
        const ref = `att-${id}`;
        await idbPut(ref, attach.file);
        attachment = { name: attach.name, type: attach.type, size: attach.size, ref };
      } else if (attach?.ref || attach?.dataUrl) {
        attachment = attach; // unchanged existing attachment
      } else if (initial?.attachment?.ref) {
        await idbDelete(initial.attachment.ref).catch(() => {});
        attachment = null;
      }
      const data = {
        id,
        title: title.trim(),
        issuer: issuer.trim(),
        date: date || '',
        url: url.trim(),
        credentialId: credentialId.trim(),
        skills,
        attachment
      };
      if (initial) updateCertificate(initial.id, data);
      else addCertificate(data);
      onClose();
    } catch {
      setAttachErr(f.attachStoreFail);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-card">
        <div className="p-6 sm:p-8">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg glass hover:shadow-glow" aria-label={pf.cancel}>
            <X size={18} />
          </button>
          <h3 className="text-2xl font-bold pr-10">{initial ? f.editTitle : f.addTitle}</h3>

          <div className="mt-5 grid gap-3">
            <Field label={f.title}>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.certs.untitled} className={inputCls} />
            </Field>
            <div className="grid sm:grid-cols-[1fr_170px] gap-3">
              <Field label={f.issuer}>
                <input value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Amazon Web Services" className={inputCls} />
              </Field>
              <Field label={f.date}>
                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className={inputCls} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label={f.url}>
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={inputCls} />
              </Field>
              <Field label={f.credId}>
                <input value={credentialId} onChange={(e) => setCredentialId(e.target.value)} className={inputCls} />
              </Field>
            </div>
            <div>
              <span className="block text-xs font-mono uppercase tracking-wider opacity-60 mb-1">{f.skills}</span>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkill(s)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border transition-all ${skills.includes(s) ? 'accent-bg text-black border-transparent' : 'glass opacity-60 hover:opacity-100'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                  placeholder={pf.customTag}
                  className={inputCls}
                />
                <button type="button" onClick={addCustomSkill} className="px-3 py-2 rounded-xl glass text-sm font-semibold flex items-center gap-1 shrink-0">
                  <Plus size={15} /> {pf.addTag}
                </button>
              </div>
              {skills.filter((s) => !suggestions.includes(s)).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skills.filter((s) => !suggestions.includes(s)).map((s) => (
                    <button key={s} type="button" onClick={() => toggleSkill(s)} className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold accent-bg text-black">
                      {s} ✕
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <span className="block text-xs font-mono uppercase tracking-wider opacity-60 mb-1">{f.attach}</span>
              {!attach ? (
                <input
                  type="file"
                  onChange={(e) => onFile(e.target.files?.[0])}
                  className="w-full text-sm opacity-80 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:accent-bg file:text-black file:font-semibold file:text-xs"
                />
              ) : (
                <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 text-sm">
                  <FileText size={16} className="accent-text shrink-0" />
                  <span className="truncate flex-1">{attach.name} <span className="opacity-50 font-mono text-xs">({Math.round(attach.size / 1024)} KB)</span></span>
                  <button type="button" onClick={() => setAttach(null)} className="p-1 opacity-60 hover:opacity-100" aria-label={f.attachRemove}>
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
              {attachErr && <p className="mt-1 text-xs text-red-400">{attachErr}</p>}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={save}
              disabled={!valid || saving}
              className="flex-1 min-w-40 px-4 py-2.5 rounded-xl accent-bg text-black font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-glow disabled:opacity-40 disabled:shadow-none"
            >
              {saving ? <><Loader2 size={16} className="animate-spin" /> {f.saving}</> : <><Save size={16} /> {f.saveCert}</>}
            </button>
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl glass text-sm font-semibold hover:shadow-glow">
              {pf.cancel}
            </button>
          </div>
          {!valid && <p className="mt-2 text-xs opacity-50">{f.required}</p>}
        </div>
      </div>
    </div>
  );
}
