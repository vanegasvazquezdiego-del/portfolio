import { X, Moon, Sun, Monitor, Palette, Zap, LayoutGrid, RotateCcw, Languages } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { languages } from '../i18n/translations';

const accents = [
  { id: 'emerald', dot: '#10b981' },
  { id: 'cyan', dot: '#22d3ee' },
  { id: 'purple', dot: '#a855f7' },
  { id: 'amber', dot: '#f59e0b' },
  { id: 'rose', dot: '#fb7185' },
  { id: 'blue', dot: '#60a5fa' }
];

function Toggle({ on, onClick, label }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between py-2 text-sm">
      <span>{label}</span>
      <span className={`w-11 h-6 rounded-full p-0.5 transition-colors ${on ? 'accent-bg' : 'bg-white/10 border border-white/10'}`}>
        <span className={`block w-5 h-5 rounded-full bg-white dark:bg-black light:bg-white shadow transition-transform ${on ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  );
}

export default function SettingsDrawer({ open, onClose }) {
  const { settings, update, reset, lang, t } = useSettings();
  if (!open) return null;

  const themes = [
    { id: 'dark', label: t.settings.dark, icon: Moon },
    { id: 'light', label: t.settings.light, icon: Sun },
    { id: 'system', label: t.settings.system, icon: Monitor }
  ];

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t.settings.title}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-sm glass shadow-card p-6 overflow-y-auto border-l border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{t.settings.title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg glass" aria-label={t.settings.close}><X size={18} /></button>
        </div>

        <h3 className="font-mono text-xs uppercase tracking-wider opacity-60 mb-2 flex items-center gap-1.5"><Languages size={13} /> {t.settings.language}</h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => update({ lang: l.id })}
              className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${lang === l.id ? 'accent-bg text-black shadow-glow border-transparent' : 'glass opacity-70 hover:opacity-100'}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <h3 className="font-mono text-xs uppercase tracking-wider opacity-60 mb-2 flex items-center gap-1.5"><Moon size={13} /> {t.settings.theme}</h3>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {themes.map((th) => (
            <button
              key={th.id}
              onClick={() => update({ theme: th.id })}
              className={`px-3 py-2.5 rounded-xl text-sm font-semibold border flex flex-col items-center gap-1 transition-all ${settings.theme === th.id ? 'accent-bg text-black shadow-glow border-transparent' : 'glass opacity-70 hover:opacity-100'}`}
            >
              <th.icon size={16} /> {th.label}
            </button>
          ))}
        </div>

        <h3 className="font-mono text-xs uppercase tracking-wider opacity-60 mb-2 flex items-center gap-1.5"><Palette size={13} /> {t.settings.accent}</h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {accents.map((a) => (
            <button
              key={a.id}
              onClick={() => update({ accent: a.id })}
              className={`px-3 py-2 rounded-xl text-sm font-medium border flex items-center gap-2 transition-all ${settings.accent === a.id ? 'shadow-glow border-transparent' : 'glass opacity-70 hover:opacity-100'}`}
              style={settings.accent === a.id ? { background: a.dot, color: '#000' } : {}}
            >
              <span className="w-4 h-4 rounded-full border border-black/20" style={{ background: a.dot }} /> {t.settings.accents[a.id]}
            </button>
          ))}
        </div>

        <h3 className="font-mono text-xs uppercase tracking-wider opacity-60 mb-1 flex items-center gap-1.5"><Zap size={13} /> {t.settings.interface}</h3>
        <div className="glass rounded-xl px-4 py-2 mb-6">
          <Toggle label={t.settings.animations} on={settings.animations} onClick={() => update({ animations: !settings.animations })} />
          <div className="h-px bg-white/10" />
          <Toggle label={t.settings.compact} on={settings.compact} onClick={() => update({ compact: !settings.compact })} />
        </div>

        <button onClick={reset} className="w-full px-4 py-2.5 rounded-xl glass text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-glow">
          <RotateCcw size={15} /> {t.settings.reset}
        </button>
        <p className="mt-3 text-xs opacity-50 flex items-center gap-1"><LayoutGrid size={12} /> {t.settings.persist}</p>
      </aside>
    </div>
  );
}
