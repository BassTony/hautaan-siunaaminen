export interface NameForms {
  nominative: string;   // Pekka
  genitive: string;     // Pekan  (used in "NN:n")
  partitive: string;    // Pekkaa (used in "NN:ää")
  allative: string;     // Pekalle (used in "NN:lle")
}

export interface HymnChoice {
  type: 'predefined' | 'custom' | 'none';
  hymnId?: string;        // e.g. "virsi-338"
  customText?: string;    // free text
}

export interface LiturgySelections {
  // Deceased person
  firstNames: string;
  lastName: string;
  gender: 'male' | 'female';

  // Event info (for localStorage save key)
  saveName: string;
  eventDate: string;

  // I Johdanto
  hymn1: HymnChoice;
  johdantosanat: number;       // 0–3
  includeRippi: boolean;
  rippiVariant: 0 | 1;         // 0 = "Tunnustamme edessäsi", 1 = "Syvyydestä"

  // II Sana
  antifoni: number;            // 0–2
  psalmi: number;              // 0–7
  includePieniKunnia: boolean;
  rukous6: number;             // 0–3
  sana7mode: 'A' | 'B';
  scripture7: number[];        // selected indices from scriptures list (mode A)
  speechVariant7: 0 | 1;      // mode A speech option
  theme7: string[];            // selected themes for mode B
  // III Siunaaminen
  includeUskontunnustus: boolean;
  siunaussanatIntro: 0 | 1;    // intro sentence before blessing
  siunaussanat: number;        // 0–4
  hymn10: HymnChoice;
  esirukous: number;           // 0–14

  // IV Päätös
  hymn14: HymnChoice;
  includeHaudalla: boolean;
  rukoushaudalla: number;      // 0–2
}

export interface SaveFile {
  id: string;              // unique id (uuid-ish)
  name: string;            // user-given label
  savedAt: string;         // ISO date string
  selections: LiturgySelections;
}
