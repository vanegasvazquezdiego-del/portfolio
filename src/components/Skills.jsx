import { skills } from '../data/projects';
import { useSettings } from '../hooks/useSettings';

export default function Skills() {
  const { t } = useSettings();
  return (
    <section id="skills" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
      <p className="font-mono text-sm accent-text mb-2">{t.skills.kicker}</p>
      <h2 className="text-3xl font-bold mb-6">{t.skills.title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((g) => (
          <div key={g.group} className="glass rounded-2xl p-5">
            <h3 className="font-mono text-sm accent-text mb-3">{t.skills.groups[g.group] || g.group}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 dark:bg-white/5 light:bg-black/5">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
