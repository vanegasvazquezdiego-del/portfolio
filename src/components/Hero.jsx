import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Download, ArrowDown, MapPin } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { useSettings } from '../hooks/useSettings';
import { useContent } from '../hooks/useContent';
import { initialsOf } from '../lib/avatar';

export default function Hero() {
  const { canInstall, installed, promptInstall } = usePwaInstall();
  const { settings, lang, t } = useSettings();
  const { content } = useContent();
  const pack = content[lang] || content.en;
  const anim = settings.animations
    ? { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } }
    : {};

  return (
    <section id="top" className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: 'var(--accent)' }} />
      <motion.div {...anim} transition={{ duration: 0.6 }} className="max-w-6xl mx-auto grid md:grid-cols-[1.4fr_1fr] gap-10 items-center relative">
        <div>
          <div className="flex items-center gap-4 mb-4">
            {content.avatar?.dataUrl ? (
              <img
                src={content.avatar.dataUrl}
                alt={content.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-[var(--accent)] shadow-glow"
              />
            ) : (
              <span className="w-20 h-20 sm:w-24 sm:h-24 rounded-full accent-bg text-black grid place-items-center text-2xl sm:text-3xl font-extrabold shadow-glow">
                {initialsOf(content.name)}
              </span>
            )}
          </div>
          <p className="font-mono text-sm accent-text mb-3">$ whoami --portfolio</p>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            {content.name}
            <br />
            <span className="accent-text text-glow">{pack.role}</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg opacity-70 max-w-xl">{pack.tagline}</p>
          <p className="mt-2 text-sm opacity-50 flex items-center gap-1.5"><MapPin size={14} /> {pack.location}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#projects" className="px-5 py-2.5 rounded-xl accent-bg text-black font-semibold hover:shadow-glow transition-shadow flex items-center gap-2">
              {t.hero.viewProjects} <ArrowDown size={16} />
            </a>
            <a href={content.github} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl glass font-semibold flex items-center gap-2 hover:shadow-glow transition-shadow">
              <Github size={16} /> GitHub
            </a>
            {(canInstall || !installed) && (
              <button onClick={promptInstall} title="Install as desktop / mobile app (PWA)" className="px-5 py-2.5 rounded-xl border accent-border font-semibold flex items-center gap-2 hover:shadow-glow transition-shadow">
                <Download size={16} /> {canInstall ? t.hero.installApp : t.hero.addToDesktop}
              </button>
            )}
          </div>
          <div className="mt-6 flex gap-4 text-sm opacity-70">
            <a href={content.github} className="flex items-center gap-1.5 hover:accent-text"><Github size={16} /> GitHub</a>
            <a href={content.linkedin} className="flex items-center gap-1.5 hover:accent-text"><Linkedin size={16} /> LinkedIn</a>
            <a href={`mailto:${content.email}`} className="flex items-center gap-1.5 hover:accent-text"><Mail size={16} /> Email</a>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 font-mono text-sm shadow-card hidden md:block">
          <div className="flex gap-1.5 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
<pre className="leading-relaxed opacity-90 overflow-x-auto">{`$ cat stack.json
{
  "languages": ["Python", "TS", "C++"],
  "frontend": "React + Tailwind",
  "backend": "FastAPI / Node",
  "infra": "Docker + Linux",
  "mode": "ship_fast 🚀"
}`}</pre>
        </div>
      </motion.div>
    </section>
  );
}
