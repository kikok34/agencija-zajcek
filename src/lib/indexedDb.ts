/**
 * Native IndexedDB helper for storing artwork, logos and uploaded files in the browser.
 * Keeps binary file data OUT of localStorage and handles PDF, SVG, PNG, JPG safely.
 */

const DB_NAME = "AgencijaZajcekDemoDB";
const DB_VERSION = 1;
const STORE_NAME = "artwork_files";

export interface StoredArtworkFile {
  id: string;
  name: string;
  size: number;
  type: string;
  blob: Blob;
  dataUrl?: string;
  createdAt: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save file into IndexedDB and generate safe preview dataUrl for images (PNG, JPG)
 */
export async function saveArtworkFile(
  file: File | Blob,
  metadata: { name: string; size: number; type: string }
): Promise<StoredArtworkFile> {
  const db = await openDB();
  const id = `art_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  let dataUrl: string | undefined = undefined;
  // Only generate dataUrl preview for raster images, never for executables
  if (metadata.type.startsWith("image/") && !metadata.type.includes("svg")) {
    try {
      dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
      });
    } catch {
      dataUrl = undefined;
    }
  }

  const record: StoredArtworkFile = {
    id,
    name: metadata.name,
    size: metadata.size,
    type: metadata.type,
    blob: file,
    dataUrl,
    createdAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(record);

    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieve stored file by ID
 */
export async function getArtworkFile(id: string): Promise<StoredArtworkFile | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Failed to get artwork file from IndexedDB", err);
    return null;
  }
}

/**
 * Delete a single file
 */
export async function deleteArtworkFile(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Failed to delete artwork file", err);
  }
}

/**
 * Clear all files in store (for demo reset)
 */
export async function clearAllArtworkFiles(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Failed to clear artwork files", err);
  }
}
