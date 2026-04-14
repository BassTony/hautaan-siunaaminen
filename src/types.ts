export interface NameForms {
  nominative: string;   // Pekka
  genitive: string;     // Pekan  (used in "NN:n")
  partitive: string;    // Pekkaa (used in "NN:ää")
  allative: string;     // Pekalle (used in "NN:lle")
}

export interface HymnChoice {
  type: 'predefined' | 'custom' | 'none';
  hymnId?: string;        // e.g. "virsi-338" or "bach-air"
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

  // Burial type
  burialType: 'arkku' | 'tuhka';

  // Unnumbered: before 1. Virsi
  alkusoitto: HymnChoice;                // classical instrumental opening
  kukkienlaskeminen: 'before' | 'after' | 'none'; // placement: before virsi 1, after 14, or omit

  // I Johdanto
  hymn1: HymnChoice;
  johdantosanat: number;       // 0–3
  includeRippi: boolean;
  rippiVariant: 0 | 1;         // 0 = "Tunnustamme edessäsi", 1 = "Syvyydestä"

  // II Sana
  includeAntifoni: boolean;    // antifon is optional
  antifoni: number;            // 0–2
  includePsalmi: boolean;      // psalm is optional, default true
  psalmi: number;              // 0–7
  includePieniKunnia: boolean;
  rukous6: number;             // 0–3
  sana7mode: 'A' | 'B';
  scripture7: number[];        // selected indices from scriptures list (mode A)
  scripture7multiSelect: boolean; // allow multiple selections
  speechVariant7: 0 | 1;      // mode A speech option
  theme7: string[];            // selected themes for mode B

  // III Siunaaminen
  includeUskontunnustus: boolean;
  siunaussanatIntro: 0 | 1;    // intro sentence before blessing
  siunaussanat: number;        // 0–4
  siunaussanatHaudalla: boolean; // defer blessing text to section 16
  includeVirsi10: boolean;     // optional hymn after blessing
  hymn10: HymnChoice;
  esirukous: number;           // 0–14

  // IV Päätös
  hymn14: HymnChoice;
  includeSaattomusiikki: boolean;
  saattomusiikki: HymnChoice;  // classical or custom outro music
  includeHaudalla: boolean;    // only relevant for arkku; hidden for tuhka
  rukoushaudalla: number;      // 0–2
  hymnHaudalla: HymnChoice;    // optional hymn at graveside (section 16)
}

export interface SaveFile {
  id: string;              // unique id (uuid-ish)
  name: string;            // user-given label
  savedAt: string;         // ISO date string
  selections: LiturgySelections;
}
