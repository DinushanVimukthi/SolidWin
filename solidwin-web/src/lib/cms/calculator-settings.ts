"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface CalculatorSettings {
  // Block Calculator parameters
  mortarJointMm: number;
  blockBreakagePercent: number;
  blockPresets: Array<{ name: string; length: number; height: number }>;

  // Plaster Estimator parameters
  defaultPlasterThicknessMm: number;
  defaultPlasterMix: "1:4" | "1:6";
  dryVolumeFactor: number;
  cementDensityKgM3: number;
  cementBagWeightKg: number;

  // Paint Estimator parameters
  defaultPaintCoats: number;
  paintCoverageM2PerLiter: number;

  // Concrete Volume Calculator parameters
  concreteWastagePercent: number;

  updatedAt?: string;
}

export const DEFAULT_CALCULATOR_SETTINGS: CalculatorSettings = {
  mortarJointMm: 10,
  blockBreakagePercent: 5,
  blockPresets: [
    { name: "Hollow Block (400 × 200 mm)", length: 400, height: 200 },
    { name: "Standard Brick (215 × 65 mm)", length: 215, height: 65 },
    { name: "Solid Concrete Block (440 × 215 mm)", length: 440, height: 215 },
  ],
  defaultPlasterThicknessMm: 12,
  defaultPlasterMix: "1:4",
  dryVolumeFactor: 1.33,
  cementDensityKgM3: 1440,
  cementBagWeightKg: 50,
  defaultPaintCoats: 2,
  paintCoverageM2PerLiter: 10,
  concreteWastagePercent: 5,
  updatedAt: "2026-10-31",
};

const STORAGE_KEY = "solidwin_calculator_settings";
const UPDATE_EVENT = "solidwin_calc_settings_updated";

/**
 * Returns current calculator settings (client-side or SSR default).
 */
export function getStoredCalculatorSettings(): CalculatorSettings {
  if (typeof window === "undefined") {
    return { ...DEFAULT_CALCULATOR_SETTINGS };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CALCULATOR_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.warn("Error reading calculator settings:", err);
  }

  return { ...DEFAULT_CALCULATOR_SETTINGS };
}

/**
 * Saves calculator settings to LocalStorage and Firestore.
 */
export async function saveCalculatorSettings(settings: CalculatorSettings): Promise<void> {
  const payload: CalculatorSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      window.dispatchEvent(new Event(UPDATE_EVENT));
    } catch (err) {
      console.warn("Error saving calculator settings to localStorage:", err);
    }
  }

  if (db) {
    try {
      await setDoc(doc(db, "solidwin_settings", "calculators"), payload, { merge: true });
    } catch (err) {
      console.warn("Firestore save error:", err);
    }
  }
}

/**
 * Reset to standard engineering defaults.
 */
export async function resetCalculatorSettings(): Promise<CalculatorSettings> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }
  return { ...DEFAULT_CALCULATOR_SETTINGS };
}

/**
 * React hook to read and observe calculator settings.
 */
export function useCalculatorSettings(): {
  settings: CalculatorSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<CalculatorSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
} {
  const [settings, setSettings] = useState<CalculatorSettings>(() => getStoredCalculatorSettings());
  const loading = false;

  useEffect(() => {
    if (db) {
      getDoc(doc(db, "solidwin_settings", "calculators"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as CalculatorSettings;
            setSettings((prev) => ({ ...prev, ...data }));
            if (typeof window !== "undefined") {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }
          }
        })
        .catch((err) => {
          console.log("Firestore background settings sync:", err.message);
        });
    }

    const handleUpdate = () => {
      setSettings(getStoredCalculatorSettings());
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    settings,
    loading,
    updateSettings: async (newSettings: Partial<CalculatorSettings>) => {
      const merged: CalculatorSettings = { ...settings, ...newSettings };
      await saveCalculatorSettings(merged);
      setSettings(merged);
    },
    resetToDefaults: async () => {
      const def = await resetCalculatorSettings();
      setSettings(def);
    },
  };
}
