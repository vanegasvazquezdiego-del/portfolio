import { useEffect, useMemo, useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { certificates } from '../data/certificates';
import { useSettings } from '../hooks/useSettings';
import { useMyCertificates } from '../hooks/useMyCertificates';

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

  const valid = title.trim() !== '' && issuer.trim() !== '';

  const save = () => {
    if (!valid) return;
    const data = {
      title: title.trim(),
      issuer: issuer.trim(),
      date: date || '',
      url: url.trim(),
      credentialId: credentialId.trim(),
      skills
    };
    if (initial) updateCertificate(initial.id, data);
    else addCertificate(data);
    onClose();
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
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="AWS Certified…" className={inputCls} />
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
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={save}
              disabled={!valid}
              className="flex-1 min-w-40 px-4 py-2.5 rounded-xl accent-bg text-black font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-glow disabled:opacity-40 disabled:shadow-none"
            >
              <Save size={16} /> {pf.save}
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
