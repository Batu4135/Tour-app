"use client";

export type DraftWritePayload = {
  lines: Array<{
    productId: number;
    quantity: number;
    unitPriceCents: number;
  }>;
  includeLicenseFee?: boolean;
  note?: string | null;
};

export type PendingWrite = {
  id: string;
  draftId: number;
  payload: DraftWritePayload;
  createdAt: number;
  lastError?: string;
};

const DB_NAME = "nord-pack-offline-db";
const DB_VERSION = 1;
const STORE_NAME = "pendingWrites";

function ensureBrowser() {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    throw new Error("IndexedDB ist nicht verfuegbar.");
  }
}

function requestToPromise<T = unknown>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionComplete(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function openDb(): Promise<IDBDatabase> {
  ensureBrowser();
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `pw-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function enqueuePendingWrite(draftId: number, payload: DraftWritePayload): Promise<string> {
  const db = await openDb();
  const id = newId();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.put({
    id,
    draftId,
    payload,
    createdAt: Date.now()
  } satisfies PendingWrite);
  await transactionComplete(tx);
  db.close();
  return id;
}

export async function enqueueLatestPendingWrite(draftId: number, payload: DraftWritePayload): Promise<string> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const entries = (await requestToPromise<PendingWrite[]>(store.getAll())) ?? [];
  for (const entry of entries) {
    if (entry.draftId === draftId) {
      store.delete(entry.id);
    }
  }

  const id = newId();
  store.put({
    id,
    draftId,
    payload,
    createdAt: Date.now()
  } satisfies PendingWrite);

  await transactionComplete(tx);
  db.close();
  return id;
}

export async function removePendingWrite(id: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).delete(id);
  await transactionComplete(tx);
  db.close();
}

export async function updatePendingWriteError(id: string, message: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const current = await requestToPromise<PendingWrite | undefined>(store.get(id));
  if (current) {
    store.put({ ...current, lastError: message });
  }
  await transactionComplete(tx);
  db.close();
}

export async function getPendingWrites(): Promise<PendingWrite[]> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readonly");
  const result = (await requestToPromise<PendingWrite[]>(tx.objectStore(STORE_NAME).getAll())) ?? [];
  await transactionComplete(tx);
  db.close();
  return result.sort((a, b) => a.createdAt - b.createdAt);
}

export async function getPendingWriteCount(): Promise<number> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readonly");
  const count = await requestToPromise<number>(tx.objectStore(STORE_NAME).count());
  await transactionComplete(tx);
  db.close();
  return count;
}

export async function syncPendingWrites(
  sendFn: (entry: PendingWrite) => Promise<void>
): Promise<{ pending: number; failed: number }> {
  const entries = await getPendingWrites();
  let failed = 0;

  for (const entry of entries) {
    try {
      await sendFn(entry);
      await removePendingWrite(entry.id);
    } catch (error) {
      failed += 1;
      await updatePendingWriteError(entry.id, error instanceof Error ? error.message : "Sync fehlgeschlagen");
      break;
    }
  }

  const pending = await getPendingWriteCount();
  return { pending, failed };
}
