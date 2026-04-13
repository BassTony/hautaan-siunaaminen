import type { NameForms } from '../types';

const BACK_VOWELS = new Set(['a', 'o', 'u']);
const FRONT_VOWELS = new Set(['ä', 'ö', 'y']);
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'y']);

function isVowel(c: string): boolean {
  return VOWELS.has(c.toLowerCase());
}

/** Returns 'back' or 'front' vowel harmony based on the last significant vowel. */
function getVowelHarmony(name: string): 'back' | 'front' {
  for (let i = name.length - 1; i >= 0; i--) {
    const c = name[i].toLowerCase();
    if (BACK_VOWELS.has(c)) return 'back';
    if (FRONT_VOWELS.has(c)) return 'front';
  }
  return 'back'; // default
}

/**
 * Returns the genitive stem of the name, applying consonant gradation
 * (kk→k, pp→p, tt→t) where applicable.
 *
 * Examples: Pekka→Peka, Matti→Mati, Mikko→Miko, Hannu→Hannu, Paavo→Paavo
 */
function getGenitiveStem(name: string): string {
  if (!name) return name;

  // Find the start of the final vowel sequence
  let vowelStart = name.length - 1;
  while (vowelStart > 0 && isVowel(name[vowelStart - 1])) {
    vowelStart--;
  }

  const prefix = name.slice(0, vowelStart);
  const vowelPart = name.slice(vowelStart);

  // Apply weak-grade consonant gradation to the prefix ending
  const p = prefix.toLowerCase();
  if (p.endsWith('kk')) return prefix.slice(0, -1) + vowelPart;
  if (p.endsWith('pp')) return prefix.slice(0, -1) + vowelPart;
  if (p.endsWith('tt')) return prefix.slice(0, -1) + vowelPart;

  // No gradation needed
  return name;
}

/**
 * Conjugates a Finnish first name into the four cases used in the liturgy.
 *
 * Rules:
 *  - Genitive:  genitiveStem + n         (Pekka→Pekan, Matti→Matin)
 *  - Partitive: name + a/ä               (Pekka→Pekkaa, Mikko→Mikkoa, Matti→Mattia)
 *  - Allative:  genitiveStem + lle       (Pekka→Pekalle, Matti→Matille)
 *
 * For names ending in a consonant (e.g. loan names): insert -i- before suffixes.
 */
export function conjugateName(name: string): NameForms {
  const trimmed = name.trim();
  if (!trimmed) {
    return { nominative: '', genitive: '', partitive: '', allative: '' };
  }

  const harmony = getVowelHarmony(trimmed);
  const a = harmony === 'back' ? 'a' : 'ä';
  const last = trimmed[trimmed.length - 1].toLowerCase();
  const genStem = getGenitiveStem(trimmed);

  let genitive: string;
  let partitive: string;
  let allative: string;

  if (isVowel(last)) {
    genitive = genStem + 'n';
    partitive = trimmed + a;          // just append a/ä
    allative = genStem + 'lle';
  } else {
    // Consonant-ending names (uncommon in Finnish, but e.g. Mikael, Daniel)
    genitive = trimmed + 'in';
    partitive = trimmed + 'i' + a;
    allative = trimmed + 'ille';
  }

  return { nominative: trimmed, genitive, partitive, allative };
}

/**
 * Conjugates a full name string, applying conjugateName to the first token
 * (assumed to be the primary first name) and returns NameForms for that token.
 * The genitive of a multi-word name uses genitive of first word only.
 */
export function conjugateDisplayName(firstNames: string, _lastName: string): NameForms {
  const primaryName = firstNames.trim().split(/\s+/)[0];
  return conjugateName(primaryName);
}
