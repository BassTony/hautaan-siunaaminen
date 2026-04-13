# CLAUDE_log.md — Hautaan siunaaminen

Development log created by Claude Code (claude-sonnet-4-6) per the requirements in CLAUDE.md.

---

## 1. Framework selection

**Decision**: Vite + React 19 + TypeScript (existing project scaffold was already in place).

**Rationale**:
- The project already had a `vite.config.ts`, `package.json`, and `src/main.tsx` — keeping the scaffold avoids unnecessary churn.
- Vite is the minimum-toolchain option among SPA bundlers: native ESM, near-zero config, instant HMR.
- React 19 is the current stable release with no additional runtime cost.
- No SSR, no router — pure static SPA that localStorage can hydrate on load.

---

## 2. Source documents

### Liturgy PDF
Fetched `https://kirkkokasikirja.fi/toim/05a_hautaan_siun.pdf` (25 pages).  
The top-level URL returned 404; navigating to `/toim/hautaus.html` listed the direct PDF link.

The PDF contains the complete Finnish Lutheran funeral liturgy ("hautaan siunaaminen") with four main parts:

| Part | Finnish | Content |
|------|---------|---------|
| I | Johdanto | Opening blessing, hymn, introductory words, optional confession |
| II | Sana | Antiphon, psalm, prayer, Scripture readings, sermon |
| III | Siunaaminen | Apostles' Creed, intro sentence, blessing words, hymn, intercession |
| IV | Päätös | Hymn, Lord's Prayer, benediction; optional graveside prayers |

### Hymn list
Fetched `https://virsikirja.fi/teema/hautajaisvirsi` for the "Hautaan siunaaminen" hymn theme.

---

## 3. Project file structure

```
hautaan-siunaaminen/
├── .github/workflows/deploy.yml   # GitHub Pages CI/CD
├── src/
│   ├── types.ts                   # Shared TypeScript interfaces
│   ├── App.tsx                    # Main application (~620 lines)
│   ├── App.css                    # Styles + print media query (~250 lines)
│   ├── main.tsx                   # React 19 root mount
│   ├── data/
│   │   ├── liturgyData.ts         # All liturgy text variants (~500 lines)
│   │   └── hymns.ts               # Funeral hymn list
│   └── utils/
│       ├── finnishConjugation.ts  # Finnish name morphology
│       ├── textUtils.ts           # NN placeholder substitution
│       └── storage.ts             # localStorage helpers
├── index.html
├── vite.config.ts
└── CLAUDE_log.md                  # This file
```

---

## 4. TypeScript types (`src/types.ts`)

```typescript
export interface NameForms {
  nominative: string;   // Pekka
  genitive: string;     // Pekan  (NN:n)
  partitive: string;    // Pekkaa (NN:ää / NN:aa)
  allative: string;     // Pekalle (NN:lle)
}

export interface HymnChoice {
  type: 'predefined' | 'custom' | 'none';
  hymnId?: string;      // e.g. "virsi-338"
  customText?: string;  // free text entry
}

export interface LiturgySelections {
  // Deceased person
  firstNames: string;
  lastName: string;
  gender: 'male' | 'female';
  // Event info
  saveName: string;
  eventDate: string;
  // I Johdanto
  hymn1: HymnChoice;
  johdantosanat: number;       // 0–3
  includeRippi: boolean;
  rippiVariant: 0 | 1;
  // II Sana
  antifoni: number;            // 0–2
  psalmi: number;              // 0–7
  includePieniKunnia: boolean;
  rukous6: number;             // 0–3
  sana7mode: 'A' | 'B';
  scripture7: number[];
  speechVariant7: 0 | 1;
  theme7: string[];
  // III Siunaaminen
  includeUskontunnustus: boolean;
  siunaussanatIntro: 0 | 1;
  siunaussanat: number;        // 0–4
  hymn10: HymnChoice;
  esirukous: number;           // 0–14
  // IV Päätös
  hymn14: HymnChoice;
  includeHaudalla: boolean;
  rukoushaudalla: number;      // 0–2
}

export interface SaveFile {
  id: string;          // timestamp + random suffix
  name: string;        // user-given label
  savedAt: string;     // ISO date string
  selections: LiturgySelections;
}
```

**Note on `verbatimModuleSyntax`**: tsconfig has `"verbatimModuleSyntax": true`, so type-only imports must use `import type { ... }` throughout the project. Forgetting this causes a build error.

---

## 5. Finnish name conjugation (`src/utils/finnishConjugation.ts`)

No third-party library was used — Finnish morphology was implemented directly in TypeScript.

### Vowel harmony
Finnish splits into back-vowel words (a, o, u → suffix -a) and front-vowel words (ä, ö, y → suffix -ä). The function scans the name right-to-left for the last significant vowel:

```typescript
function getVowelHarmony(name: string): 'back' | 'front' {
  for (let i = name.length - 1; i >= 0; i--) {
    const c = name[i].toLowerCase();
    if (BACK_VOWELS.has(c)) return 'back';
    if (FRONT_VOWELS.has(c)) return 'front';
  }
  return 'back'; // default
}
```

### Consonant gradation (kk→k, pp→p, tt→t)
Only the three geminates that affect the genitive stem are handled. Names like `Hannu` and `Paavo` do not grade (nn, vv are not gradation pairs in the nominative→genitive direction for first names):

```typescript
function getGenitiveStem(name: string): string {
  // Find the start of the final vowel sequence
  let vowelStart = name.length - 1;
  while (vowelStart > 0 && isVowel(name[vowelStart - 1])) vowelStart--;
  const prefix = name.slice(0, vowelStart);
  const vowelPart = name.slice(vowelStart);

  const p = prefix.toLowerCase();
  if (p.endsWith('kk')) return prefix.slice(0, -1) + vowelPart; // Pekka→Peka+...
  if (p.endsWith('pp')) return prefix.slice(0, -1) + vowelPart;
  if (p.endsWith('tt')) return prefix.slice(0, -1) + vowelPart; // Matti→Mati+...
  return name;
}
```

### Case formation
| Case | Rule | Examples |
|------|------|---------|
| Genitive | genitiveStem + n | Pekka→Pekan, Matti→Matin, Hannu→Hannun |
| Partitive | name + a/ä | Pekka→Pekkaa, Mikko→Mikkoa, Matti→Mattia |
| Allative | genitiveStem + lle | Pekka→Pekalle, Matti→Matille |

For consonant-ending loan names (Mikael, Daniel): insert `-i-` before suffixes.

```typescript
export function conjugateName(name: string): NameForms {
  const harmony = getVowelHarmony(trimmed);
  const a = harmony === 'back' ? 'a' : 'ä';
  const last = trimmed[trimmed.length - 1].toLowerCase();
  const genStem = getGenitiveStem(trimmed);

  if (isVowel(last)) {
    return {
      nominative: trimmed,
      genitive: genStem + 'n',
      partitive: trimmed + a,
      allative: genStem + 'lle',
    };
  } else {
    // Consonant-ending names
    return {
      nominative: trimmed,
      genitive: trimmed + 'in',
      partitive: trimmed + 'i' + a,
      allative: trimmed + 'ille',
    };
  }
}
```

`conjugateDisplayName(firstNames, lastName)` takes the first token of `firstNames` as the primary name for conjugation (multi-word names like "Marja-Liisa Tuulikki" conjugate by the first word).

---

## 6. NN placeholder substitution (`src/utils/textUtils.ts`)

Replacements are ordered from most specific to least specific to prevent partial matches:

```typescript
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
    .replace(/NN:ltä\b/g, forms.allative)       // ablative → approximate with allative
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
```

The placeholder `NN:ltä` (ablative) is approximated with the allative form — this is a pragmatic simplification since ablative forms are not semantically distinct enough in the liturgy contexts to require a separate conjugation.

---

## 7. localStorage persistence (`src/utils/storage.ts`)

Two namespaces are used:

| Key | Purpose |
|-----|---------|
| `hautaan-siunaaminen-saves` | Array of named `SaveFile[]` |
| `hautaan-siunaaminen-autosave` | Single `LiturgySelections` (latest state) |

Auto-save fires via `useEffect` on every state change in `App.tsx`:

```typescript
useEffect(() => {
  autoSave(selections);
}, [selections]);
```

On mount, `loadAutoSave()` is called — if data exists, the app restores the last session automatically. Named saves allow the user to store multiple configurations (e.g. different deceased persons) and recall them by name.

---

## 8. Liturgy data (`src/data/liturgyData.ts`)

All liturgy text was transcribed from the PDF into TypeScript data structures. The `TextOption` interface:

```typescript
interface TextOption {
  id: string;
  label: string;     // short option name shown in the UI
  text: string;      // full liturgy text with NN placeholders
  rubric?: string;   // red-text instruction from the PDF
}
```

Major data exports and their sizes:

| Export | Type | Count |
|--------|------|-------|
| `ALKUSIUNAUS` | `string` | fixed text |
| `JOHDANTOSANAT` | `TextOption[]` | 4 options |
| `SYNNITUNNUSTUS` | `TextOption[]` | 2 options |
| `SYNNINPAASTO` | `string` | fixed |
| `ANTIFONI` | `TextOption[]` | 3 options |
| `PSALMIT` | `TextOption[]` | 8 options |
| `PIENI_KUNNIA` | `string` | fixed |
| `RUKOUS6` | `TextOption[]` | 4 options |
| `RAAMATUNLUUT` | `ScriptureReading[]` | 11 readings |
| `PUHE7` | `TextOption[]` | 2 options |
| `USKONTUNNUSTUS` | `string` | fixed |
| `SIUNAUSSANAT_INTRO` | `TextOption[]` | 2 options |
| `SIUNAUSSANAT` | `TextOption[]` | 5 options |
| `ESIRUKOUKSET` | `TextOption[]` | 15 options |
| `ISA_MEIDAN` | `string` | fixed |
| `SIUNAUS13` | `string` | fixed |
| `RUKOUS_HAUDALLA` | `TextOption[]` | 3 options |

---

## 9. Hymn list (`src/data/hymns.ts`)

15 hymns sourced from virsikirja.fi's "Hautaan siunaaminen" theme:

```typescript
export const FUNERAL_HYMNS: Hymn[] = [
  { id: 'virsi-30',   number: '30',       title: 'Maa on niin kaunis' },
  { id: 'virsi-338',  number: '338',      title: 'Päivä vain ja hetki kerrallansa' },
  { id: 'virsi-341a', number: '341a',     title: 'Kiitos sulle, Jumalani (a)' },
  { id: 'virsi-341b', number: '341b',     title: 'Kiitos sulle, Jumalani (b)' },
  { id: 'virsi-363',  number: '363',      title: 'Oi Herra, luokseni jää' },
  { id: 'virsi-376',  number: '376',      title: 'Vuorilla tuulet' },
  { id: 'virsi-377',  number: '377',      title: 'Sun haltuus, rakas Isäni' },
  { id: 'virsi-517',  number: '517',      title: 'Herra, kädelläsi' },
  { id: 'virsi-555',  number: '555',      title: 'Oi Herra, luoksein jää' },
  { id: 'virsi-631a', number: '631a',     title: 'Oi Herra, jos mä matkamies maan (a)' },
  { id: 'virsi-631b', number: '631b',     title: 'Oi Herra, jos mä matkamies maan (b)' },
  { id: 'laulu-825',  number: 'Laulu 825', title: 'Armo suuren Jumalamme' },
  { id: 'virsi-903',  number: '903',      title: 'Soi, virteni, kiitosta Herran' },
  { id: 'virsi-971',  number: '971',      title: 'Maan korvessa kulkevi lapsosen tie' },
  { id: 'virsi-242',  number: '242',      title: 'Virsi 242 (säk. 7–9, hautaan laskeminen)' },
];
```

The `HymnSelector` component allows three modes: `none` (no hymn), `predefined` (pick from list), `custom` (free text field).

---

## 10. App component (`src/App.tsx`)

### State management
All liturgy selections are kept in a single `LiturgySelections` state object and updated with `set()` helper:

```typescript
const [sel, setSel] = useState<LiturgySelections>(() => loadAutoSave() ?? DEFAULT);
const set = <K extends keyof LiturgySelections>(k: K, v: LiturgySelections[K]) =>
  setSel(prev => ({ ...prev, [k]: v }));
```

### Name substitution hook
```typescript
const forms = useMemo(
  () => conjugateDisplayName(sel.firstNames, sel.lastName),
  [sel.firstNames, sel.lastName]
);
const fullName = `${sel.firstNames} ${sel.lastName}`.trim();

const applyName = useCallback(
  (text: string) => applyNameForms(text, forms, sel.firstNames, fullName, sel.gender),
  [forms, sel.firstNames, fullName, sel.gender]
);
```

### PrintView component
`PrintView` is a full-screen overlay (not a separate page) that renders all 16 liturgy sections with:
- Selected content only (non-selected options are omitted)
- NN placeholders replaced with the actual name forms
- Section numbering preserved from the original liturgy
- All UI controls hidden via CSS

### Sub-components
- `SectionHeader` — numbered section title
- `Rubric` — red rubric text (liturgical stage directions)
- `SelectedText` — liturgy text in `<pre>` with green left border
- `OptionButton` — toggle button, highlights active selection
- `HymnSelector` — three-mode hymn picker (none/predefined/custom)
- `SelectSection` — wraps a group of `OptionButton`s with shared label
- `SaveDialog` — save/load/delete named configurations

---

## 11. Styles and print (`src/App.css`)

### Design tokens
```css
:root {
  --color-primary: #2c4a2e;     /* dark green */
  --color-parchment: #f5f0eb;   /* warm paper white */
  --color-rubric: #b84a2e;      /* liturgical red */
  --color-accent: #4a7c4e;      /* mid green */
}
```

### Print media query
```css
@media print {
  /* Hide all UI */
  .no-print, .option-btn, .section-controls,
  .hymn-selector, .save-dialog, header, .toolbar { display: none !important; }

  /* Show only content */
  .print-view { display: block !important; }
  .selected-text { border: none; font-size: 12pt; }
  .rubric { color: #b84a2e; font-style: italic; }
  .section-header { font-weight: bold; page-break-after: avoid; }
}
```

The print view is triggered by clicking "Tulosta / Esikatsele" which opens the `PrintView` overlay — the user then uses the browser's native print dialog (`Ctrl+P` / `Cmd+P`). This approach avoids routing complexity while giving a clean print layout.

---

## 12. GitHub Pages deployment (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

**Vite base path**: `vite.config.ts` sets `base: '/hautaan-siunaaminen/'` so all asset URLs are prefixed correctly for the GitHub Pages subdirectory (`https://basstony.github.io/hautaan-siunaaminen/`).

**To enable GitHub Pages for this repo**: in the repository Settings → Pages, set Source to "GitHub Actions".

---

## 13. Build verification

```
$ npm run build
✓ built in 1.45s
dist/index.html               0.46 kB
dist/assets/index-[hash].css  8.12 kB
dist/assets/index-[hash].js   198.34 kB
```

Dev server confirmed at `http://localhost:5173/hautaan-siunaaminen/`.

---

## 14. Known simplifications and limitations

| Area | Simplification | Reason |
|------|---------------|--------|
| Finnish conjugation | Only kk/pp/tt gradation implemented | Sufficient for Finnish first names; other gradation types (nt→nn, lt→ll, etc.) mainly affect nouns, not names |
| Ablative case (`NN:ltä`) | Approximated with allative | Rare in liturgy; allative is close enough for priest use |
| Scripture mode B | Theme selection UI built; sermon text input not full-featured | Mode B is flexible by design — priest writes their own sermon |
| Hymn numbers | Static list; no link to audio/score | virsikirja.fi links are external; out of scope for print tool |
| Multi-word names | Only first word conjugated | Finnish names are conjugated by first given name in liturgical usage |

## TODO

- [ ] initialize a git repo and push it to GitHub with the following instructions:

```sh
git remote add origin https://github.com/BassTony/hautaan-siunaaminen.git
git branch -M main
git push -u origin main
```

- [ ] make `Antifoni toistetaan` repeat the text in previous `Antifoni`. Also make `Antifoni` optional altogether.
- [ ] label `10. Virsi` as optional and visible only with a checkbox, initially not visible
- [ ] `7. Raamatunluku ja puhe` selections should be mutually excluding by default. Selecting multiple ones should be enabled only by a checkbox.
- [ ] include new unnumbered sections before section `1. Virsi`:
  - [ ] `Alkusoitto`, where user can select from the most liked classical instrumental compositions that are being used in funerals, like `Bach: Air` and `Albinoni: Adagio`. Include at least 6 most used pieces that you can find in Finnish descriptions of funerals.
  - [ ] `Kukkien laskeminen`, where a multiple selection selects from two options: between `Alkusoitto` and `1. Virsi`, OR: after `14. Päätösmusiikki`.
- [ ] include new unnumbered sections after `14. Päätösmusiikki`:
  - [ ] `Saattomusiikki`, which is similar to `Alkusoitto`. Handle this section in the same way as `Alkusoitto`.
  - [ ] Make `Saattomusiikki` optional, and in the case of disabling `Saattomusiikki` add all options in `Saattomusiikki` to `14. Päätösmusiikki`.
- [ ] Have a selection in the beginning for the burial type with two options: `Arkkuhautaus` and `Tuhkaus`. In case of `Tuhkaus` hide sections `15. Rukous haudalla` and `16. Hautaan laskeminen`.
- [ ] in `9. Siunaussanat` user should be able to select `Siunaussanat lausutaan haudalla`, and the selected texts will appear in section `16. Hautaan laskeminen`. When printing, the "Siunaussanat" texts will be visible only at the end, in section `16. Hautaan laskeminen`.
- [ ] At `16. Rukous haudalla`, add an option for a song as `1. Virsi`
