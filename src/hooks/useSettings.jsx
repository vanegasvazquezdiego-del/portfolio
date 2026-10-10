import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getLocale } from '../i18n/translations';

const KEY = 'portfolio-settings-v1';

const defaults = {
  theme: 'dark', // dark | light | system
  accent: 'emerald', // emerald | cyan | purple | amber | rose | blue
  animations: true,
  compact: false,
  lang: 'en' // en | es
};

function resolveTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return theme;
}

const Ctx = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
    const resolved = resolveTheme(settings.theme);
    const root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.classList.toggle('light', resolved === 'light');
    root.dataset.accent = settings.accent;
    root.lang = settings.lang || 'en';
    document.body.classList.toggle('no-anim', !settings.animations);
    document.body.style.backgroundColor = resolved === 'dark' ? '#05070f' : '#f6f7fb';
    document.body.style.color = resolved === 'dark' ? '#e5e7eb' : '#111827';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', resolved === 'dark' ? '#05070f' : '#ffffff');
  }, [settings]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const fn = () => {
      if (settings.theme === 'system') {
        document.documentElement.classList.toggle('dark', !mq.matches);
      }
    };
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [settings.theme]);

  const value = useMemo(
    () => ({
      settings,
      update: (patch) => setSettings((s) => ({ ...s, ...patch })),
      reset: () => setSettings(defaults),
      lang: settings.lang || 'en',
      t: getLocale(settings.lang || 'en')
    }),
    [settings]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);
