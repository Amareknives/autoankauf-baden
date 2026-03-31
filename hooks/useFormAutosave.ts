'use client';
import { useEffect } from 'react';

const STORAGE_KEY = 'aab_form_v1';

export function useFormAutosave<T>(data: T, isEnabled = true) {
  useEffect(() => {
    if (!isEnabled) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage nicht verfuegbar
    }
  }, [data, isEnabled]);
}

export function loadFormAutosave<T>(): Partial<T> | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Partial<T>;
  } catch {
    // ignore
  }
  return null;
}

export function clearFormAutosave() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
