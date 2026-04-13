import type { NameForms } from '../types';

/**
 * Replaces all NN placeholder forms in a liturgy text with the actual name forms.
 *
 * Patterns handled (ordered from most to least specific):
 *   NN:lle    → allative    (Pekalle)
 *   NN:n (koko nimi) → fullName
 *   NN:ää / NN:aa / NN:ä / NN:a → partitive  (Pekkaa)
 *   NN:n     → genitive    (Pekan)
 *   NN (etunimet) / NN(etunimet) → firstNames nominative
 *   [NN (etunimet),] → [firstNames,]
 *   NN       → nominative   (Pekka)
 *
 * Also handles "veljellemme/sisarellemme" → picks the right word based on gender.
 */
export function applyNameForms(
  text: string,
  forms: NameForms,
  firstNames: string,
  fullName: string,
  gender: 'male' | 'female',
): string {
  const brotherSister = gender === 'male' ? 'veljellemme' : 'sisarellemme';

  return text
    .replace(/veljellemme\/sisarellemme/g, brotherSister)
    .replace(/NN:lle\b/g, forms.allative)
    .replace(/NN:ltä\b/g, forms.allative)       // ablative — approximate with allative
    .replace(/NN:n \(koko nimi\)/g, fullName)
    .replace(/NN:ää\b/g, forms.partitive)
    .replace(/NN:aa\b/g, forms.partitive)
    .replace(/NN:ä\b/g, forms.partitive)
    .replace(/NN:a\b/g, forms.partitive)
    .replace(/NN:n\b/g, forms.genitive)
    .replace(/\[NN \(etunimet\),\]/g, `[${firstNames},]`)
    .replace(/NN \(etunimet\)/g, firstNames)
    .replace(/NN\(etunimet\)/g, firstNames)
    .replace(/\bNN\b/g, forms.nominative);
}
