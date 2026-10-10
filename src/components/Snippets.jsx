import { useMemo, useState } from 'react';
import { Copy, Check, Search, Terminal, ArrowLeft, Code2 } from 'lucide-react';
import { snippets, snippetLangs } from '../data/snippets';
import { useSettings } from '../hooks/useSettings';
import { pick } from '../data/projects';

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

const langColor = {
  Python: '#3776ab',
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  'C++': '#659ad2',
  Go: '#00add8',
  Rust: '#dea584',
  Bash: '#4eaa25',
  Docker: '#2496ed',
  SQL: '#e38c00'
};

export default function Snippets() {
  const [lang, setLang] = useState(null); // nothing shown until a language is picked
  const [q, setQ] = useState('');
  const [copied, setCopied] = useState(null);
  const { lang: uiLang, t } = useSettings();

  const counts = useMemo(() => {
    const m = {};
    for (const s of snippets) m[s.lang] = (m[s.lang] || 0) + 1;
    return m;
  }, []);

  const list = useMemo(
    () => {
      if (!lang) return [];
      return snippets.filter(
        (s) =>
          s.lang === lang &&
          (q === '' || (s.title + (s.title_es || '') + (s.desc || '') + (s.desc_es || '') + s.code).toLowerCase().includes(q.toLowerCase()))
      );
    },
    [lang, q]
  );

  const pickLang = (l) => {
    setLang(l);
    setQ('');
    setCopied(null);
  };

  const onCopy = async (s, e) => {
    const ok = await copyText(s.code);
    if (ok) {
      setCopied(s.id);
      setTimeout(() => setCopied((c) => (c === s.id ? null : c)), 1800);
    } else {
      // Clipboard blocked (permissions / non-secure context):
      // select the code so the user can press Ctrl+C manually.
      try {
        const pre = e?.currentTarget?.closest('.glass')?.querySelector('pre');
        if (pre) {
          const range = document.createRange();
          range.selectNodeContents(pre);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } catch { /* noop */ }
      setCopied(`manual-${s.id}`);
      setTimeout(() => setCopied((c) => (c === `manual-${s.id}` ? null : c)), 3500);
    }
  };

  return (
    <section id="snippets" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
      <p className="font-mono text-sm accent-text mb-2">{t.snippets.kicker}</p>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
        <h2 className="text-3xl font-bold">{t.snippets.title}</h2>
        {lang && (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.snippets.search}
              className="glass rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:shadow-glow w-56 bg-transparent"
            />
          </div>
        )}
      </div>
      <p className="text-sm opacity-60 mb-6">{t.snippets.sub}</p>

      {!lang ? (
        <>
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Code2 size={16} className="accent-text" /> {t.snippets.pick}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {snippetLangs.map((l) => (
              <button
                key={l}
                onClick={() => pickLang(l)}
                className="glass rounded-2xl p-5 text-left hover:shadow-glow hover:-translate-y-0.5 transition-all group"
              >
                <span className="flex items-center gap-2 font-bold">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: langColor[l] }} />
                  {l}
                </span>
                <span className="mt-1 block text-xs font-mono opacity-60">
                  {counts[l] || 0} {t.snippets.count}
                </span>
                <span className="mt-2 block text-xs accent-text opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.snippets.view} →
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <button
              onClick={() => pickLang(null)}
              className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold border glass opacity-70 hover:opacity-100 flex items-center gap-1.5"
            >
              <ArrowLeft size={13} /> {t.snippets.back}
            </button>
            <span className="w-px h-5 bg-white/10 mx-1" />
            {snippetLangs.map((l) => (
              <button
                key={l}
                onClick={() => pickLang(l)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all flex items-center gap-1.5 ${
                  lang === l ? 'accent-bg text-black shadow-glow border-transparent' : 'glass opacity-70 hover:opacity-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: lang === l ? '#000' : langColor[l] }} />
                {l}
              </button>
            ))}
          </div>

          {list.length === 0 && <p className="opacity-60 text-sm">{t.snippets.empty}</p>}

          <div className="grid gap-4 md:grid-cols-2">
            {list.map((s) => (
              <div key={s.id} className="glass rounded-2xl overflow-hidden hover:shadow-glow transition-shadow flex flex-col">
                <div className="flex items-center justify-between gap-3 px-5 pt-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <Terminal size={15} className="accent-text shrink-0" />
                    <h3 className="font-bold text-sm truncate">{pick(s, 'title', uiLang)}</h3>
                  </div>
                  <span
                    className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0"
                    style={{ background: `${langColor[s.lang] || 'var(--accent)'}22`, color: langColor[s.lang] || 'var(--accent)', border: `1px solid ${langColor[s.lang] || 'var(--accent)'}55` }}
                  >
                    {s.lang}
                  </span>
                </div>
                {s.desc && <p className="px-5 mt-1 text-xs opacity-60">{pick(s, 'desc', uiLang)}</p>}
                <div className="m-4 mb-3 rounded-xl overflow-hidden border border-white/10 bg-black/40 dark:bg-black/50 light:bg-gray-900">
                  <pre className="p-4 text-xs font-mono leading-relaxed overflow-auto max-h-72 text-gray-200">{s.code}</pre>
                </div>
                <div className="px-4 pb-4">
                  <button
                    onClick={(e) => onCopy(s, e)}
                    className={`w-full px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      copied === s.id ? 'bg-green-500 text-black' : copied === `manual-${s.id}` ? 'bg-amber-400 text-black' : 'accent-bg text-black hover:shadow-glow'
                    }`}
                  >
                    {copied === s.id ? <><Check size={16} /> {t.snippets.copied}</> : copied === `manual-${s.id}` ? <><Copy size={16} /> {t.snippets.copyManual}</> : <><Copy size={16} /> {t.snippets.copy}</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
