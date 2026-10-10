import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// User-added certificates, persisted in localStorage. They merge with the
// built-in list in the Certificates section (yours first, with a badge).
// Built-in examples can also be hidden with the trash icon (ids kept below).
const KEY = 'portfolio-mycerts-v1';
const HIDE_KEY = 'portfolio-hidden-certs-v1';

const Ctx = createContext(null);

function readArray(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function MyCertificatesProvider({ children }) {
  const [items, setItems] = useState(() => readArray(KEY));
  // ids of built-in examples the user hid with the trash icon
  const [hidden, setHidden] = useState(() => readArray(HIDE_KEY));

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch { /* quota exceeded */ }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(HIDE_KEY, JSON.stringify(hidden));
    } catch { /* noop */ }
  }, [hidden]);

  const value = useMemo(
    () => ({
      myCertificates: items,
      addCertificate: (c) => {
        const full = { custom: true, ...c };
        if (!full.id) full.id = `cert-${Date.now().toString(36)}`;
        setItems((s) => [full, ...s]);
        return full;
      },
      updateCertificate: (id, patch) => setItems((s) => s.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      deleteCertificate: (id) => setItems((s) => s.filter((c) => c.id !== id)),
      hiddenIds: hidden,
      hideExample: (id) => setHidden((s) => (s.includes(id) ? s : [...s, id])),
      restoreExamples: () => setHidden([])
    }),
    [items, hidden]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useMyCertificates = () => useContext(Ctx);
