import { Pencil } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useContent } from '../hooks/useContent';

export default function About({ onEdit }) {
  const { lang, t } = useSettings();
  const { content } = useContent();
  const pack = content[lang] || content.en;
  return (
    <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
      <p className="font-mono text-sm accent-text mb-2">{t.about.kicker}</p>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-3xl font-bold">{pack.aboutTitle}</h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-sm font-semibold hover:shadow-glow transition-shadow"
        >
          <Pencil size={15} /> {t.about.edit}
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {pack.cards.map((c) => (
          <div key={c.t} className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow">
            <h3 className="font-semibold text-lg mb-2 accent-text">{c.t}</h3>
            <p className="text-sm opacity-70 leading-relaxed">{c.d}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm opacity-60">{t.about.cta} <a className="accent-text font-mono" href={`mailto:${content.email}`}>{content.email}</a></p>
    </section>
  );
}
