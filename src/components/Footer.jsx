import { useSettings } from '../hooks/useSettings';
import { useContent } from '../hooks/useContent';

export default function Footer() {
  const { t } = useSettings();
  const { content } = useContent();
  return (
    <footer className="border-t border-white/10 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm opacity-60">
        <p>© {new Date().getFullYear()} {content.name} · {t.footer.built}</p>
        <p className="font-mono text-xs">{t.footer.pwa}</p>
      </div>
    </footer>
  );
}
