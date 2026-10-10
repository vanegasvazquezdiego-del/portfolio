import { useEffect, useState } from 'react';
import { Code2, Menu, X, Download, Settings } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { useSettings } from '../hooks/useSettings';
import { languages } from '../i18n/translations';

function LangSwitch() {
  const { lang, update } = useSettings();
  return (
    <div className="flex items-center rounded-lg overflow-hidden border border-white/10 text-xs" role="group" aria-label="Language">
      {languages.map((l) => (
        <button
          key={l.id}
          onClick={() => update({ lang: l.id })}
          className={`px-2.5 py-1.5 font-mono font-bold transition-colors ${lang === l.id ? 'accent-bg text-black' : 'opacity-60 hover:opacity-100'}`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

export default function Navbar({ onOpenSettings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { canInstall, promptInstall } = usePwaInstall();
  const { t } = useSettings();

  const links = [
    { href: '#about', label: t.nav.about },
    { href: '#projects', label: t.nav.projects },
    { href: '#skills', label: t.nav.skills },
    { href: '#snippets', label: t.nav.snippets },
    { href: '#certificates', label: t.nav.certs },
    { href: '#contact', label: t.nav.contact }
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all ${scrolled ? 'glass shadow-card' : 'bg-transparent'}`}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-9 h-9 rounded-xl accent-bg grid place-items-center text-black shadow-glow">
            <Code2 size={20} strokeWidth={2.5} />
          </span>
          <span>alex<span className="accent-text">.dev</span></span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium opacity-90">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="whitespace-nowrap hover:accent-text hover:text-glow transition-colors">{l.label}</a>
          ))}
          <LangSwitch />
          <button onClick={onOpenSettings} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass hover:shadow-glow transition-shadow">
            <Settings size={16} /> {t.nav.settings}
          </button>
          {canInstall && (
            <button onClick={promptInstall} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg accent-bg text-black font-semibold hover:shadow-glow transition-shadow">
              <Download size={16} /> {t.nav.install}
            </button>
          )}
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label={t.nav.menu}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden glass mx-4 mb-3 rounded-xl p-4 flex flex-col gap-3 text-sm font-medium">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <div className="flex gap-2 items-center">
            <LangSwitch />
            <button onClick={() => { onOpenSettings(); setOpen(false); }} className="flex-1 px-3 py-2 rounded-lg glass">{t.nav.settings}</button>
            {canInstall && <button onClick={promptInstall} className="flex-1 px-3 py-2 rounded-lg accent-bg text-black font-semibold">{t.nav.install}</button>}
          </div>
        </div>
      )}
    </header>
  );
}
