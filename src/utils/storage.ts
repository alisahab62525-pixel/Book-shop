/**
 * Centralized Storage Manager with LocalStorage and IndexedDB support
 * Ensures image uploads and large design references don't exceed LocalStorage limits.
 */

const STORAGE_PREFIX = 'beyond_notebooks_';
const STORAGE_VERSION = 1;

export const StorageKeys = {
  SETTINGS: `${STORAGE_PREFIX}settings_v${STORAGE_VERSION}`,
  PRODUCTS: `${STORAGE_PREFIX}products_v${STORAGE_VERSION}`,
  CATEGORIES: `${STORAGE_PREFIX}categories_v${STORAGE_VERSION}`,
  ORDERS: `${STORAGE_PREFIX}orders_v${STORAGE_VERSION}`,
  CART: `${STORAGE_PREFIX}cart_v${STORAGE_VERSION}`,
  WISHLIST: `${STORAGE_PREFIX}wishlist_v${STORAGE_VERSION}`,
  DESIGN_REQUESTS: `${STORAGE_PREFIX}design_requests_v${STORAGE_VERSION}`,
  INVENTORY_MOVEMENTS: `${STORAGE_PREFIX}inventory_v${STORAGE_VERSION}`,
  SUPPLIERS: `${STORAGE_PREFIX}suppliers_v${STORAGE_VERSION}`,
  EXPENSES: `${STORAGE_PREFIX}expenses_v${STORAGE_VERSION}`,
  COUPONS: `${STORAGE_PREFIX}coupons_v${STORAGE_VERSION}`,
  REVIEWS: `${STORAGE_PREFIX}reviews_v${STORAGE_VERSION}`,
  RECENTLY_VIEWED: `${STORAGE_PREFIX}recent_products_v${STORAGE_VERSION}`,
  LANGUAGE: `${STORAGE_PREFIX}lang_preference`,
  THEME: `${STORAGE_PREFIX}theme_preference`,
  SEARCH_HISTORY: `${STORAGE_PREFIX}search_history`,
};

export class LocalStorageUtil {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Failed reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed setting localStorage key "${key}":`, error);
      return false;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed removing localStorage key "${key}":`, error);
    }
  }

  static clearAppStorage(): void {
    try {
      Object.values(StorageKeys).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed clearing app storage:', error);
    }
  }
}

// IndexedDB adapter for large binary image data (e.g. customer uploaded artwork)
const DB_NAME = 'BeyondNotebooksDB';
const DB_VERSION = 1;
const IMAGE_STORE = 'custom_images';

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this browser environment'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IMAGE_STORE)) {
        db.createObjectStore(IMAGE_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export class IndexedDBImageUtil {
  static async saveImage(id: string, dataUrl: string): Promise<boolean> {
    try {
      const db = await openIndexedDB();
      return new Promise((resolve) => {
        const tx = db.transaction(IMAGE_STORE, 'readwrite');
        const store = tx.objectStore(IMAGE_STORE);
        store.put({ id, dataUrl, createdAt: Date.now() });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch {
      // Fallback in case indexedDB is blocked (e.g. private mode)
      try {
        sessionStorage.setItem(`img_${id}`, dataUrl);
        return true;
      } catch {
        return false;
      }
    }
  }

  static async getImage(id: string): Promise<string | null> {
    try {
      const db = await openIndexedDB();
      return new Promise((resolve) => {
        const tx = db.transaction(IMAGE_STORE, 'readonly');
        const store = tx.objectStore(IMAGE_STORE);
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result && req.result.dataUrl) {
            resolve(req.result.dataUrl);
          } else {
            const fallback = sessionStorage.getItem(`img_${id}`);
            resolve(fallback);
          }
        };
        req.onerror = () => {
          const fallback = sessionStorage.getItem(`img_${id}`);
          resolve(fallback);
        };
      });
    } catch {
      return sessionStorage.getItem(`img_${id}`);
    }
  }

  static async deleteImage(id: string): Promise<void> {
    try {
      const db = await openIndexedDB();
      const tx = db.transaction(IMAGE_STORE, 'readwrite');
      tx.objectStore(IMAGE_STORE).delete(id);
      sessionStorage.removeItem(`img_${id}`);
    } catch {
      sessionStorage.removeItem(`img_${id}`);
    }
  }
}
