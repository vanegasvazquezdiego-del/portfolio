// Tiny promise wrapper around IndexedDB — no dependencies.
// Used for heavy project attachments (localStorage caps at ~5MB total,
// IndexedDB typically allows 50MB+ per origin).
const DB_NAME = 'portfolio-db';
const STORE = 'attachments';

function openDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('indexeddb-unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('idb-open-failed'));
  });
}

export function idbPut(key, value) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(STORE, 'readwrite');
        t.objectStore(STORE).put(value, key);
        t.oncomplete = () => {
          db.close();
          resolve();
        };
        t.onerror = () => {
          db.close();
          reject(t.error || new Error('idb-put-failed'));
        };
      })
  );
}

export function idbGet(key) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(STORE, 'readonly');
        const req = t.objectStore(STORE).get(key);
        req.onsuccess = () => {
          db.close();
          resolve(req.result);
        };
        req.onerror = () => {
          db.close();
          reject(req.error || new Error('idb-get-failed'));
        };
      })
  );
}

export function idbDelete(key) {
  return openDb().then(
    (db) =>
      new Promise((resolve) => {
        try {
          const t = db.transaction(STORE, 'readwrite');
          t.objectStore(STORE).delete(key);
          t.oncomplete = () => {
            db.close();
            resolve();
          };
          t.onerror = () => {
            db.close();
            resolve();
          };
        } catch {
          try {
            db.close();
          } catch { /* noop */ }
          resolve();
        }
      })
  );
}
