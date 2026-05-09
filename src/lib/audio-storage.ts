const DB_NAME  = "humana_audio";
const STORE    = "recordings";
const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

interface AudioRecord { id: string; blob: Blob; savedAt: number; }

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE))
        req.result.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

export async function saveAudio(id: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put({ id, blob, savedAt: Date.now() });
      tx.oncomplete = () => res();
      tx.onerror    = () => rej(tx.error);
    });
    db.close();
    purgeExpired().catch(() => {});
  } catch (e) {
    console.warn("[audio-storage] save failed:", e);
  }
}

export async function loadAudio(id: string): Promise<string | null> {
  try {
    const db  = await openDB();
    const rec = await new Promise<AudioRecord | undefined>((res, rej) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
      req.onsuccess = () => res(req.result as AudioRecord | undefined);
      req.onerror   = () => rej(req.error);
    });
    db.close();
    if (!rec) return null;
    if (Date.now() - rec.savedAt > TWO_DAYS) {
      deleteAudio(id).catch(() => {});
      return null;
    }
    return URL.createObjectURL(rec.blob);
  } catch (e) {
    console.warn("[audio-storage] load failed:", e);
    return null;
  }
}

async function deleteAudio(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((res) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => res();
    });
    db.close();
  } catch {}
}

async function purgeExpired(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((res, rej) => {
      const tx    = db.transaction(STORE, "readwrite");
      const req   = tx.objectStore(STORE).openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) { res(); return; }
        if (Date.now() - (cursor.value as AudioRecord).savedAt > TWO_DAYS)
          cursor.delete();
        cursor.continue();
      };
      req.onerror = () => rej(req.error);
    });
    db.close();
  } catch {}
}
