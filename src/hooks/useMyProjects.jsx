import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { idbDelete } from '../lib/idb';

// User-added projects, persisted in localStorage (metadata only).
// Heavy attachments live in IndexedDB (see src/lib/idb.js) under
// `attachment.ref`, so documents up to MAX_ATTACH_BYTES are supported.
const KEY = 'portfolio-myprojects-v1';
const HIDE_KEY = 'portfolio-hidden-projects-v1';
export const MAX_ATTACH_BYTES = 50 * 1024 * 1024; // 50 MB per file

const Ctx = createContext(null);

function readArray(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function MyProjectsProvider({ children }) {
  const [items, setItems] = useState(() => readArray(KEY));
  // ids of built-in examples the user hid with the trash icon
  const [hidden, setHidden] = useState(() => readArray(HIDE_KEY));

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch { /* quota exceeded — newest change dropped silently */ }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(HIDE_KEY, JSON.stringify(hidden));
    } catch { /* noop */ }
  }, [hidden]);

  const value = useMemo(
    () => ({
      myProjects: items,
      addProject: (p) => {
        const full = { custom: true, ...p };
        if (!full.id) full.id = `custom-${Date.now().toString(36)}`;
        setItems((s) => [full, ...s]);
        return full;
      },
      updateProject: (id, patch) => setItems((s) => s.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      deleteProject: (id) =>
        setItems((s) => {
          const found = s.find((p) => p.id === id);
          if (found?.attachment?.ref) idbDelete(found.attachment.ref).catch(() => {});
          return s.filter((p) => p.id !== id);
        }),
      hiddenIds: hidden,
      hideExample: (id) => setHidden((s) => (s.includes(id) ? s : [...s, id])),
      restoreExamples: () => setHidden([])
    }),
    [items, hidden]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useMyProjects = () => useContext(Ctx);
