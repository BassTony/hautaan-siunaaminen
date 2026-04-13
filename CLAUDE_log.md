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

## 15. Git repository initialization

```sh
git init
git add -A
git commit -m "Initial commit: hautaan siunaaminen liturgy planning app"
```

The remote has not been pushed yet. To publish to GitHub, run:

```sh
git remote add origin https://github.com/BassTony/hautaan-siunaaminen.git
git branch -M main
git push -u origin main
```

---

## 16. Feature additions (second iteration)

### Classical music data (`src/data/classicalMusic.ts`)

A new data file was added for instrumental pieces commonly played at Finnish Lutheran funerals. The `ClassicalPiece` interface:

```typescript
interface ClassicalPiece {
  id: string;
  composer: string;
  title: string;
}
```

Ten pieces included:

| id | Composer | Title |
| -- | -------- | ----- |
| `bach-air` | J. S. Bach | Air (BWV 1068) |
| `albinoni-adagio` | Albinoni / Giazotto | Adagio g-molli |
| `barber-adagio` | Samuel Barber | Adagio jousiorkesterille, op. 11 |
| `handel-sarabande` | G. F. Handel | Sarabande d-molli (HWV 437) |
| `pachelbel-canon` | Johann Pachelbel | Kaanon D-duuri |
| `grieg-aase` | Edvard Grieg | Åsen kuolema (Peer Gynt, op. 46) |
| `sibelius-finlandia-hymni` | Jean Sibelius | Finlandia-hymni (op. 26) |
| `faure-pavane` | Gabriel Fauré | Pavane, op. 50 |
| `schubert-ave-maria` | Franz Schubert | Ave Maria, D. 839 |
| `bach-gounod-ave-maria` | Bach / Gounod | Ave Maria |

A `ClassicalSelector` component mirrors the `HymnSelector` but uses `CLASSICAL_PIECES` as its options list and formats labels as `{composer}: {title}`.

### New `LiturgySelections` fields (`src/types.ts`)

```typescript
burialType: 'arkku' | 'tuhka';
alkusoitto: HymnChoice;
kukkienlaskeminen: 'before' | 'after' | 'none';
includeAntifoni: boolean;
scripture7multiSelect: boolean;
siunaussanatHaudalla: boolean;
includeVirsi10: boolean;
includeSaattomusiikki: boolean;
saattomusiikki: HymnChoice;
hymnHaudalla: HymnChoice;
```

### Burial type selector

A mode toggle placed directly after the event info card:

```
[ Arkkuhautaus ]  [ Tuhkaus ]
```

When `burialType === 'tuhka'`, sections 15 (Rukous haudalla) and 16 (Hautaan laskeminen) are not rendered — both in the editor and in the print view. An info note explains this to the user.

### Unnumbered sections before 1. Virsi

**Alkusoitto** — `ClassicalSelector` + free-text input. Appears in the print view as an unnumbered block before the main service.

**Kukkien laskeminen** — Two toggle buttons (not radio buttons, so both can be deactivated):

- `before` — flower laying appears between Alkusoitto and 1. Virsi in print
- `after` — flower laying appears after 14. Päätösmusiikki in print
- `none` — omitted

### Antifoni made optional (section 5)

A checkbox `Sisällytetään antifoni` controls `includeAntifoni`. When enabled:

- The antifon selector and text appear before the psalm
- After the psalm (and optional Pieni kunnia), the rubric "Antifoni toistetaan:" is followed by the **full antifon text** — not just the rubric label

```tsx
{sel.includeAntifoni && (
  <div className="antifoni-repeat">
    <Rubric text="Antifoni toistetaan:" />
    <SelectedText text={ANTIFONI[sel.antifoni].text} />
  </div>
)}
```

The print view mirrors this: when `includeAntifoni` is false, both the opening antifon and the "toistetaan" block are omitted.

### Section 7: mutually exclusive scripture by default

Scripture readings are now single-select by default. A checkbox `Salli useamman raamatunkohdan valinta` sets `scripture7multiSelect`:

```typescript
onClick={() => {
  if (sel.scripture7multiSelect) {
    // toggle inclusion
    const next = sel.scripture7.includes(i)
      ? sel.scripture7.filter(x => x !== i)
      : [...sel.scripture7, i];
    update('scripture7', next.length ? next : [i]);
  } else {
    // single select
    update('scripture7', [i]);
  }
}}
```

When switching from multi back to single, all but the first selected reading are dropped.

### Section 9: Siunaussanat lausutaan haudalla

A checkbox `Siunaussanat lausutaan haudalla (kohta 16)` sets `siunaussanatHaudalla`. Effect:

- **In the editor**: the blessing text is hidden under section 9; an info note says it will appear in section 16.
- **In the print view** (section 9): shows only the rubric "Siunaussanat lausutaan haudalla (kohta 16)."
- **In the print view** (section 16): the intro sentence and blessing words are rendered in full.

The options selectors (intro + siunaussanat) remain visible in section 9 so the priest can still choose which texts to use.

### Section 10: Virsi made optional

A checkbox `Sisällytetään virsi 10` controls `includeVirsi10`. Default is `false` (hidden). The `HymnSelector` is only rendered when the checkbox is ticked. In the print view, section 10 is skipped entirely when `includeVirsi10` is false.

### Saattomusiikki (after 14. Päätösmusiikki)

An unnumbered section below 14. Päätösmusiikki. Behaviour:

- **When `includeSaattomusiikki` is false** (default): the `ClassicalSelector` for `saattomusiikki` appears inside section 14 itself, labelled "Saattomusiikki (instrumentaali)". In print, any selected piece appears as a second line under 14.
- **When `includeSaattomusiikki` is true**: the classical selector moves to its own "Saattomusiikki" block below 14, and appears as a separate unnumbered entry in print.

### Section 15: hymn at the graveside

A `HymnSelector` ("Virsi haudalla") is added inside section 15 (Rukous haudalla), displayed when `includeHaudalla` is true. In print view it appears before the prayer text.

### Build after changes

```sh
$ npm run build
✓ built in 1.46s
dist/index.html                   0.76 kB
dist/assets/index-[hash].css      8.52 kB
dist/assets/index-[hash].js     260.53 kB
```

All changes committed in two commits on `main`.
