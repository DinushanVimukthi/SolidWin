"use client";

import { useState, useEffect } from "react";
import { PROJECTS as DEFAULT_PROJECTS, type ProjectItem } from "@/data/projects";
import { db } from "@/lib/firebase/config";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

const STORAGE_KEY = "solidwin_custom_projects";
const FIRESTORE_COLLECTION = "solidwin_projects";
const UPDATE_EVENT = "solidwin_projects_updated";

/**
 * Returns the current active list of projects.
 * Priority: LocalStorage -> Default seeded data.
 */
export function getStoredProjects(): ProjectItem[] {
  if (typeof window === "undefined") {
    return [...DEFAULT_PROJECTS];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Error reading projects from localStorage:", err);
  }

  return [...DEFAULT_PROJECTS];
}

/**
 * Save all projects to LocalStorage and optionally push to Firestore.
 */
export async function saveProjects(projects: ProjectItem[]): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      window.dispatchEvent(new Event(UPDATE_EVENT));
    } catch (err) {
      console.warn("Error saving projects to localStorage:", err);
    }
  }

  // Push to Firestore if configured
  if (db) {
    try {
      for (const project of projects) {
        await setDoc(doc(db, FIRESTORE_COLLECTION, project.slug), project, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore sync error (offline or rules):", err);
    }
  }
}

/**
 * Add or update a single project.
 */
export async function upsertProject(project: ProjectItem): Promise<ProjectItem[]> {
  const current = getStoredProjects();
  const index = current.findIndex((p) => p.slug === project.slug);

  let updated: ProjectItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = project;
  } else {
    updated = [project, ...current];
  }

  await saveProjects(updated);
  return updated;
}

/**
 * Delete a project by slug.
 */
export async function deleteProjectBySlug(slug: string): Promise<ProjectItem[]> {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.slug !== slug);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }

  if (db) {
    try {
      await deleteDoc(doc(db, FIRESTORE_COLLECTION, slug));
    } catch (err) {
      console.warn("Firestore delete error:", err);
    }
  }

  return updated;
}

/**
 * Reset projects back to default data.
 */
export async function resetProjectsToDefault(): Promise<ProjectItem[]> {
  const defaults = [...DEFAULT_PROJECTS];
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }
  return defaults;
}

/**
 * React hook to listen to reactive project changes.
 */
export function useProjects(): {
  projects: ProjectItem[];
  loading: boolean;
  addOrUpdate: (p: ProjectItem) => Promise<void>;
  remove: (slug: string) => Promise<void>;
  reset: () => Promise<void>;
} {
  const [projects, setProjects] = useState<ProjectItem[]>(() => getStoredProjects());
  const loading = false;

  useEffect(() => {
    // Sync from Firestore if available
    if (db) {
      getDocs(collection(db, FIRESTORE_COLLECTION))
        .then((snapshot) => {
          if (!snapshot.empty) {
            const remote: ProjectItem[] = [];
            snapshot.forEach((d) => remote.push(d.data() as ProjectItem));
            if (remote.length > 0) {
              setProjects(remote);
              if (typeof window !== "undefined") {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
              }
            }
          }
        })
        .catch((err) => {
          console.log("Firestore background sync:", err.message);
        });
    }

    const handleUpdate = () => {
      setProjects(getStoredProjects());
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    projects,
    loading,
    addOrUpdate: async (p) => {
      const up = await upsertProject(p);
      setProjects(up);
    },
    remove: async (slug) => {
      const up = await deleteProjectBySlug(slug);
      setProjects(up);
    },
    reset: async () => {
      const up = await resetProjectsToDefault();
      setProjects(up);
    },
  };
}
