import type { SaveFile, LiturgySelections } from '../types';

const STORAGE_KEY = 'hautaan-siunaaminen-saves';
const AUTOSAVE_KEY = 'hautaan-siunaaminen-autosave';

export function loadSaves(): SaveFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SaveFile[];
  } catch {
    return [];
  }
}

export function persistSaves(saves: SaveFile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}

export function saveFile(saves: SaveFile[], name: string, selections: LiturgySelections): SaveFile[] {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newSave: SaveFile = { id, name, savedAt: new Date().toISOString(), selections };
  const updated = [newSave, ...saves];
  persistSaves(updated);
  return updated;
}

export function deleteSave(saves: SaveFile[], id: string): SaveFile[] {
  const updated = saves.filter(s => s.id !== id);
  persistSaves(updated);
  return updated;
}

export function autoSave(selections: LiturgySelections): void {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(selections));
  } catch {
    // ignore storage errors
  }
}

export function loadAutoSave(): LiturgySelections | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LiturgySelections;
  } catch {
    return null;
  }
}
