import type { LiturgySelections } from '../types';

const PARAM = 's';

export function buildShareUrl(sel: LiturgySelections): string {
  const json = JSON.stringify(sel);
  const bytes = new TextEncoder().encode(json);
  const base64 = btoa(String.fromCharCode(...Array.from(bytes)));
  const encoded = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, encoded);
  return url.toString();
}

export function decodeSelectionsFromUrl(): LiturgySelections | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get(PARAM);
    if (!encoded) return null;
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as LiturgySelections;
  } catch {
    return null;
  }
}

export function clearShareParam(): void {
  const url = new URL(window.location.href);
  if (url.searchParams.has(PARAM)) {
    url.searchParams.delete(PARAM);
    window.history.replaceState(null, '', url.toString());
  }
}
