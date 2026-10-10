import { useState } from 'react';
import { Github, Linkedin, Mail, Send, Download } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { useSettings } from '../hooks/useSettings';
import { useContent } from '../hooks/useContent';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { canInstall, promptInstall } = usePwaInstall();
  const { t } = useSettings();
  const { content } = useContent();

  return (
    <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
      <p className="font-mono text-sm accent-text mb-2">{t.contact.kicker}</p>
      <h2 className="text-3xl font-bold mb-6">{t.contact.title}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-2">{t.contact.direct}</h3>
          <div className="space-y-3 text-sm">
            <a href={content.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:accent-text"><Github size={16} /> {content.github.replace('https://', '')}</a>
            <a href={content.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:accent-text"><Linkedin size={16} /> {content.linkedin.replace('https://', '')}</a>
            <a href={`mailto:${content.email}`} className="flex items-center gap-2 hover:accent-text"><Mail size={16} /> {content.email}</a>
          </div>
          {canInstall && (
            <button onClick={promptInstall} className="mt-5 w-full px-4 py-2.5 rounded-xl accent-bg text-black font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-glow">
              <Download size={16} /> {t.contact.installBtn}
            </button>
          )}
          <p className="mt-3 text-xs opacity-50">{t.contact.pwaNote}</p>
        </div>
        <form
          className="glass rounded-2xl p-6 space-y-3"
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        >
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder={t.contact.name} className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:accent-border" />
            <input required type="email" placeholder={t.contact.email} className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm outline-none" />
          </div>
          <input placeholder={t.contact.subject} className="w-full bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm outline-none" />
          <textarea required rows={4} placeholder={t.contact.message} className="w-full bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm outline-none resize-none" />
          <button className="w-full px-4 py-2.5 rounded-xl accent-bg text-black font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-glow">
            <Send size={16} /> {sent ? t.contact.sentBtn : t.contact.send}
          </button>
          {sent && <p className="text-xs accent-text">{t.contact.sentNote} {content.email}</p>}
        </form>
      </div>
    </section>
  );
}
