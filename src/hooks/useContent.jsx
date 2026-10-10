import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { profile } from '../data/projects';
import { translations } from '../i18n/translations';

// Editable site content (presentation). Defaults come from the data files;
// overrides persist in localStorage so you can edit from the UI.
const KEY = 'portfolio-content-v1';

function langPack(lang) {
  const t = translations[lang] || translations.en;
  return {
    role: lang === 'es' ? profile.role_es || profile.role : profile.role,
    tagline: lang === 'es' ? profile.tagline_es || profile.tagline : profile.tagline,
    location: lang === 'es' ? profile.location_es || profile.location : profile.location,
    aboutTitle: t.about.title,
    cards: t.about.cards.map((c) => ({ t: c.t, d: c.d }))
  };
}

function buildDefaults() {
  return {
    name: profile.name,
    email: profile.email,
    github: profile.github,
    linkedin: profile.linkedin,
    avatar: null, // { dataUrl, name } — set from the presentation editor
    en: langPack('en'),
    es: langPack('es')
  };
}

function mergeStored(stored) {
  const d = buildDefaults();
  if (!stored || typeof stored !== 'object') return d;
  return {
    ...d,
    ...stored,
    en: { ...d.en, ...(stored.en || {}) },
    es: { ...d.es, ...(stored.es || {}) }
  };
}

const Ctx = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContentState] = useState(() => {
    try {
      return mergeStored(JSON.parse(localStorage.getItem(KEY) || 'null'));
    } catch {
      return buildDefaults();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(content));
    } catch { /* storage full / private mode */ }
  }, [content]);

  const value = useMemo(
    () => ({
      content,
      setContent: (next) => setContentState(typeof next === 'function' ? next : { ...next }),
      reset: () => setContentState(buildDefaults())
    }),
    [content]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);
