"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { DEFAULT_DOCUMENTS, type ManagedDocument } from "@/data/documents";
export { DEFAULT_DOCUMENTS, type ManagedDocument };

const STORAGE_KEY = "solidwin_managed_documents";
const FIRESTORE_COLLECTION = "solidwin_documents";
const UPDATE_EVENT = "solidwin_documents_updated";

export function getStoredDocuments(): ManagedDocument[] {
  if (typeof window === "undefined") {
    return [...DEFAULT_DOCUMENTS];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => {
          let fileName = (item.fileName || `${item.title || "document"}.pdf`).trim();
          if (!fileName.toLowerCase().endsWith(".pdf")) {
            fileName = `${fileName.replace(/\.[^/.]+$/, "")}.pdf`;
          }
          let fileUrl = item.fileUrl?.trim();
          if (!fileUrl || fileUrl === "#") {
            const defMatch = DEFAULT_DOCUMENTS.find((d) => d.id === item.id);
            fileUrl = defMatch ? defMatch.fileUrl : `/documents/${fileName}`;
          }
          return {
            ...item,
            fileName,
            fileUrl,
          };
        });
      }
    }
  } catch (err) {
    console.warn("Error reading documents from localStorage:", err);
  }

  return [...DEFAULT_DOCUMENTS];
}

export async function saveDocuments(docs: ManagedDocument[]): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
      window.dispatchEvent(new Event(UPDATE_EVENT));
    } catch (err) {
      console.warn("Error saving documents to localStorage:", err);
    }
  }

  if (db) {
    try {
      for (const d of docs) {
        await setDoc(doc(db, FIRESTORE_COLLECTION, d.id), d, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore documents sync error:", err);
    }
  }
}

export async function upsertDocument(d: ManagedDocument): Promise<ManagedDocument[]> {
  const current = getStoredDocuments();
  const idx = current.findIndex((item) => item.id === d.id);
  let updated: ManagedDocument[];

  if (idx >= 0) {
    updated = [...current];
    updated[idx] = d;
  } else {
    updated = [d, ...current];
  }

  await saveDocuments(updated);
  return updated;
}

export async function deleteDocumentById(id: string): Promise<ManagedDocument[]> {
  const current = getStoredDocuments();
  const updated = current.filter((item) => item.id !== id);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }

  if (db) {
    try {
      await deleteDoc(doc(db, FIRESTORE_COLLECTION, id));
    } catch (err) {
      console.warn("Firestore delete document error:", err);
    }
  }

  return updated;
}

export async function resetDocumentsToDefault(): Promise<ManagedDocument[]> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }
  return [...DEFAULT_DOCUMENTS];
}

export function useDocuments(): {
  documents: ManagedDocument[];
  loading: boolean;
  addOrUpdate: (d: ManagedDocument) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reset: () => Promise<void>;
} {
  const [documents, setDocuments] = useState<ManagedDocument[]>(() => getStoredDocuments());
  const loading = false;

  useEffect(() => {
    if (db) {
      getDocs(collection(db, FIRESTORE_COLLECTION))
        .then((snapshot) => {
          if (!snapshot.empty) {
            const remote: ManagedDocument[] = [];
            snapshot.forEach((snap) => remote.push(snap.data() as ManagedDocument));
            if (remote.length > 0) {
              setDocuments(remote);
              if (typeof window !== "undefined") {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
              }
            }
          }
        })
        .catch((err) => {
          console.log("Firestore background doc sync:", err.message);
        });
    }

    const handleUpdate = () => {
      setDocuments(getStoredDocuments());
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    documents,
    loading,
    addOrUpdate: async (d) => {
      const up = await upsertDocument(d);
      setDocuments(up);
    },
    remove: async (id) => {
      const up = await deleteDocumentById(id);
      setDocuments(up);
    },
    reset: async () => {
      const up = await resetDocumentsToDefault();
      setDocuments(up);
    },
  };
}
