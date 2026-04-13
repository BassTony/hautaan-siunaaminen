import { useState, useMemo, useEffect, useCallback } from 'react';
import './App.css';
import type { LiturgySelections, HymnChoice, SaveFile } from './types';
import type { TextOption } from './data/liturgyData';
import {
  JOHDANTOSANAT, SYNNITUNNUSTUS, SYNNINPAASTO,
  ANTIFONI, PSALMIT, PIENI_KUNNIA,
  RUKOUS6, RAAMATUNLUUT, PUHE7,
  USKONTUNNUSTUS, SIUNAUSSANAT_INTRO, SIUNAUSSANAT,
  ESIRUKOUKSET, ISA_MEIDAN, SIUNAUS13, RUKOUS_HAUDALLA,
  ALKUSIUNAUS,
} from './data/liturgyData';
import { FUNERAL_HYMNS } from './data/hymns';
import { CLASSICAL_PIECES } from './data/classicalMusic';
import type { ClassicalPiece } from './data/classicalMusic';
import { conjugateDisplayName } from './utils/finnishConjugation';
import { applyNameForms } from './utils/textUtils';
import { loadSaves, saveFile, deleteSave, autoSave, loadAutoSave } from './utils/storage';

// ─── Default selections ───────────────────────────────────────────────────────

const DEFAULT: LiturgySelections = {
  firstNames: '',
  lastName: '',
  gender: 'female',
  saveName: '',
  eventDate: '',
  burialType: 'arkku',
  alkusoitto: { type: 'none' },
  kukkienlaskeminen: 'none',
  hymn1: { type: 'none' },
  johdantosanat: 0,
  includeRippi: false,
  rippiVariant: 0,
  includeAntifoni: true,
  antifoni: 0,
  psalmi: 0,
  includePieniKunnia: false,
  rukous6: 0,
  sana7mode: 'A',
  scripture7: [0],
  scripture7multiSelect: false,
  speechVariant7: 0,
  theme7: [],
  includeUskontunnustus: true,
  siunaussanatIntro: 0,
  siunaussanat: 0,
  siunaussanatHaudalla: false,
  includeVirsi10: false,
  hymn10: { type: 'none' },
  esirukous: 0,
  hymn14: { type: 'none' },
  includeSaattomusiikki: false,
  saattomusiikki: { type: 'none' },
  includeHaudalla: false,
  rukoushaudalla: 0,
  hymnHaudalla: { type: 'none' },
};

// ─── Helper components ────────────────────────────────────────────────────────

function SectionHeader({ num, title }: { num: number | string; title: string }) {
  return (
    <div className="section-header">
      <span className="section-num">{num}.</span>
      <span className="section-title">{title}</span>
    </div>
  );
}

function UnnumberedHeader({ title }: { title: string }) {
  return (
    <div className="section-header section-header--unnumbered">
      <span className="section-title">{title}</span>
    </div>
  );
}

function Rubric({ text }: { text: string }) {
  return <p className="rubric">{text}</p>;
}

function SelectedText({ text }: { text: string }) {
  return <pre className="selected-text">{text}</pre>;
}

function OptionButton({
  label,
  active,
  onClick,
  context,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  context?: string;
}) {
  return (
    <button
      className={`option-btn${active ? ' option-btn--active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {context && <span className="option-context">{context}</span>}
      {label}
    </button>
  );
}

function HymnSelector({
  value,
  onChange,
  label,
}: {
  value: HymnChoice;
  onChange: (v: HymnChoice) => void;
  label: string;
}) {
  return (
    <div className="hymn-selector">
      <label className="input-label">{label}</label>
      <div className="hymn-row">
        <select
          value={value.type === 'predefined' ? value.hymnId ?? '' : ''}
          onChange={e => {
            const id = e.target.value;
            onChange(id === '' ? { type: 'none' } : { type: 'predefined', hymnId: id });
          }}
          className="hymn-select"
        >
          <option value="">— Ei valittua virttä —</option>
          {FUNERAL_HYMNS.map(h => (
            <option key={h.id} value={h.id}>
              Virsi {h.number}: {h.title}
            </option>
          ))}
        </select>
      </div>
      <div className="hymn-custom-row">
        <input
          type="text"
          placeholder="Tai kirjoita vapaavalintainen virsi / musiikki tähän"
          value={value.type === 'custom' ? value.customText ?? '' : ''}
          onChange={e => {
            const t = e.target.value;
            onChange(t ? { type: 'custom', customText: t } : { type: 'none' });
          }}
          className="hymn-custom-input"
        />
      </div>
      {value.type !== 'none' && (
        <div className="hymn-preview">
          {value.type === 'predefined'
            ? FUNERAL_HYMNS.find(h => h.id === value.hymnId)?.title ?? ''
            : value.customText}
        </div>
      )}
    </div>
  );
}

function ClassicalSelector({
  value,
  onChange,
  label,
}: {
  value: HymnChoice;
  onChange: (v: HymnChoice) => void;
  label: string;
}) {
  return (
    <div className="hymn-selector">
      <label className="input-label">{label}</label>
      <div className="hymn-row">
        <select
          value={value.type === 'predefined' ? value.hymnId ?? '' : ''}
          onChange={e => {
            const id = e.target.value;
            onChange(id === '' ? { type: 'none' } : { type: 'predefined', hymnId: id });
          }}
          className="hymn-select"
        >
          <option value="">— Ei valittua teosta —</option>
          {CLASSICAL_PIECES.map((p: ClassicalPiece) => (
            <option key={p.id} value={p.id}>
              {p.composer}: {p.title}
            </option>
          ))}
        </select>
      </div>
      <div className="hymn-custom-row">
        <input
          type="text"
          placeholder="Tai kirjoita vapaavalintainen teos tähän"
          value={value.type === 'custom' ? value.customText ?? '' : ''}
          onChange={e => {
            const t = e.target.value;
            onChange(t ? { type: 'custom', customText: t } : { type: 'none' });
          }}
          className="hymn-custom-input"
        />
      </div>
      {value.type !== 'none' && (
        <div className="hymn-preview">
          {value.type === 'predefined'
            ? (() => {
                const p = CLASSICAL_PIECES.find(x => x.id === value.hymnId);
                return p ? `${p.composer}: ${p.title}` : '';
              })()
            : value.customText}
        </div>
      )}
    </div>
  );
}

function SelectSection({
  options,
  selected,
  onSelect,
}: {
  options: TextOption[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="option-list">
      {options.map((opt, i) => (
        <OptionButton
          key={opt.id}
          label={opt.label}
          context={opt.context}
          active={i === selected}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}

// ─── Print view ───────────────────────────────────────────────────────────────

function PrintView({
  sel,
  fullName,
  onClose,
}: {
  sel: LiturgySelections;
  fullName: string;
  onClose: () => void;
}) {
  const forms = useMemo(
    () => conjugateDisplayName(sel.firstNames, sel.lastName),
    [sel.firstNames, sel.lastName],
  );

  const applyName = useCallback(
    (text: string) => applyNameForms(text, forms, sel.firstNames || 'NN', fullName || 'NN', sel.gender),
    [forms, sel.firstNames, fullName, sel.gender],
  );

  const hymnLabel = (h: HymnChoice) => {
    if (h.type === 'none') return '— (ei valittu) —';
    if (h.type === 'predefined') {
      const found = FUNERAL_HYMNS.find(f => f.id === h.hymnId);
      return found ? `Virsi ${found.number}: ${found.title}` : '—';
    }
    return h.customText ?? '—';
  };

  const classicalLabel = (h: HymnChoice) => {
    if (h.type === 'none') return '— (ei valittu) —';
    if (h.type === 'predefined') {
      const p = CLASSICAL_PIECES.find(x => x.id === h.hymnId);
      return p ? `${p.composer}: ${p.title}` : '—';
    }
    return h.customText ?? '—';
  };

  const kukkiBefore = sel.kukkienlaskeminen === 'before';
  const kukkilAfter = sel.kukkienlaskeminen === 'after';
  const isArkku = sel.burialType === 'arkku';

  return (
    <div className="print-overlay">
      <div className="print-toolbar no-print">
        <button onClick={() => window.print()} className="btn-primary">
          Tulosta
        </button>
        <button onClick={onClose} className="btn-secondary">
          ✕ Sulje esikatselu
        </button>
      </div>

      <div className="print-content">
        <h1 className="print-title">Hautaan siunaaminen</h1>
        {fullName && <p className="print-subtitle">{fullName}</p>}
        {sel.eventDate && <p className="print-subtitle">{sel.eventDate}</p>}

        {/* Unnumbered: Alkusoitto */}
        {sel.alkusoitto.type !== 'none' && (
          <div className="print-item">
            <h3>Alkusoitto</h3>
            <p>{classicalLabel(sel.alkusoitto)}</p>
          </div>
        )}

        {/* Unnumbered: Kukkien laskeminen (before) */}
        {kukkiBefore && (
          <div className="print-item">
            <p className="print-rubric">Kukkien laskeminen</p>
          </div>
        )}

        <div className="print-section">
          <h2>I Johdanto</h2>

          <div className="print-item">
            <h3>1. Virsi</h3>
            <p>{hymnLabel(sel.hymn1)}</p>
          </div>

          <div className="print-item">
            <h3>2. Alkusiunaus</h3>
            <pre>{ALKUSIUNAUS}</pre>
          </div>

          <div className="print-item">
            <h3>3. Johdantosanat</h3>
            <pre>{applyName(JOHDANTOSANAT[sel.johdantosanat].text)}</pre>
          </div>

          {sel.includeRippi && (
            <div className="print-item">
              <h3>4. Yhteinen rippi</h3>
              <pre>{SYNNITUNNUSTUS[sel.rippiVariant].text}</pre>
              <pre>{SYNNINPAASTO}</pre>
            </div>
          )}
        </div>

        <div className="print-section">
          <h2>II Sana</h2>

          <div className="print-item">
            <h3>5. Psalmi</h3>
            {sel.includeAntifoni && (
              <>
                <p className="print-rubric">Antifoni:</p>
                <pre>{ANTIFONI[sel.antifoni].text}</pre>
              </>
            )}
            <pre>{PSALMIT[sel.psalmi].text}</pre>
            {sel.includePieniKunnia && <pre>{PIENI_KUNNIA}</pre>}
            {sel.includeAntifoni && (
              <>
                <p className="print-rubric">Antifoni toistetaan:</p>
                <pre>{ANTIFONI[sel.antifoni].text}</pre>
              </>
            )}
          </div>

          <div className="print-item">
            <h3>6. Rukous</h3>
            <pre>{applyName(RUKOUS6[sel.rukous6].text)}</pre>
          </div>

          <div className="print-item">
            <h3>7. Raamatunluku ja puhe</h3>
            {sel.sana7mode === 'A' ? (
              <>
                {sel.scripture7.map(idx => (
                  <div key={idx}>
                    <p className="print-rubric">{RAAMATUNLUUT[idx].ref}</p>
                    {RAAMATUNLUUT[idx].context && (
                      <p className="print-rubric">{RAAMATUNLUUT[idx].context}</p>
                    )}
                    <pre>{RAAMATUNLUUT[idx].text}</pre>
                  </div>
                ))}
                <h4>Puhe</h4>
                <pre>{applyName(PUHE7[sel.speechVariant7].text)}</pre>
              </>
            ) : (
              <p className="print-rubric">Raamattumeditaatio — pappi valitsee tekstit teemojen mukaan.</p>
            )}
          </div>
        </div>

        <div className="print-section">
          <h2>III Siunaaminen</h2>

          {sel.includeUskontunnustus && (
            <div className="print-item">
              <h3>*8. Uskontunnustus</h3>
              <pre>{USKONTUNNUSTUS}</pre>
            </div>
          )}

          {/* 9. Siunaussanat — show here only if NOT deferred to section 16 */}
          {!sel.siunaussanatHaudalla && (
            <div className="print-item">
              <h3>*9. Siunaussanat</h3>
              <pre>{applyName(SIUNAUSSANAT_INTRO[sel.siunaussanatIntro].text)}</pre>
              <pre>{applyName(SIUNAUSSANAT[sel.siunaussanat].text)}</pre>
            </div>
          )}

          {sel.siunaussanatHaudalla && (
            <div className="print-item">
              <h3>*9. Siunaussanat</h3>
              <p className="print-rubric">Siunaussanat lausutaan haudalla (kohta 16).</p>
            </div>
          )}

          {sel.includeVirsi10 && (
            <div className="print-item">
              <h3>10. Virsi</h3>
              <p>{hymnLabel(sel.hymn10)}</p>
            </div>
          )}

          <div className="print-item">
            <h3>11. Esirukous</h3>
            <pre>{applyName(ESIRUKOUKSET[sel.esirukous].text)}</pre>
          </div>

          <div className="print-item">
            <h3>12. Isä meidän</h3>
            <pre>{ISA_MEIDAN}</pre>
          </div>
        </div>

        <div className="print-section">
          <h2>IV Päätös</h2>

          <div className="print-item">
            <h3>13. Siunaus</h3>
            <pre>{SIUNAUS13}</pre>
          </div>

          <div className="print-item">
            <h3>14. Päätösmusiikki</h3>
            <p>{hymnLabel(sel.hymn14)}</p>
            {!sel.includeSaattomusiikki && sel.saattomusiikki.type !== 'none' && (
              <p>{classicalLabel(sel.saattomusiikki)}</p>
            )}
          </div>

          {/* Unnumbered: Kukkien laskeminen (after) */}
          {kukkilAfter && (
            <div className="print-item">
              <p className="print-rubric">Kukkien laskeminen</p>
            </div>
          )}

          {sel.includeSaattomusiikki && sel.saattomusiikki.type !== 'none' && (
            <div className="print-item">
              <h3>Saattomusiikki</h3>
              <p>{classicalLabel(sel.saattomusiikki)}</p>
            </div>
          )}

          {isArkku && sel.includeHaudalla && (
            <div className="print-item">
              <h3>15. Rukous haudalla</h3>
              {sel.hymnHaudalla.type !== 'none' && (
                <p>{hymnLabel(sel.hymnHaudalla)}</p>
              )}
              <pre>{applyName(RUKOUS_HAUDALLA[sel.rukoushaudalla].text)}</pre>
            </div>
          )}

          {isArkku && (
            <div className="print-item">
              <h3>16. Hautaan laskeminen</h3>
              {sel.siunaussanatHaudalla && (
                <>
                  <p className="print-rubric">Siunaussanat:</p>
                  <pre>{applyName(SIUNAUSSANAT_INTRO[sel.siunaussanatIntro].text)}</pre>
                  <pre>{applyName(SIUNAUSSANAT[sel.siunaussanat].text)}</pre>
                </>
              )}
              <p className="print-rubric">
                Arkkua hautaan laskettaessa voidaan laulaa virsi (esim. 242:7–9 tai 376:3).
                Kun kukkalaitteet on asetettu haudalle, voidaan laulaa virsi (esim. 363 tai 377).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Save / Load dialog ───────────────────────────────────────────────────────

function SaveDialog({
  saves,
  currentName,
  onSave,
  onLoad,
  onDelete,
  onClose,
}: {
  saves: SaveFile[];
  currentName: string;
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(currentName);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <h2 className="dialog-title">Tallenna / lataa</h2>

        <div className="dialog-section">
          <label className="input-label">Tallennuksen nimi</label>
          <input
            className="text-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="esim. Mäkinen Pekka 15.5.2025"
          />
          <button
            className="btn-primary"
            onClick={() => { if (name.trim()) onSave(name.trim()); }}
          >
            Tallenna nykyiset valinnat
          </button>
        </div>

        {saves.length > 0 && (
          <div className="dialog-section">
            <h3 className="dialog-sub">Tallennetut versiot</h3>
            {saves.map(s => (
              <div key={s.id} className="save-row">
                <div className="save-info">
                  <span className="save-name">{s.name}</span>
                  <span className="save-date">
                    {new Date(s.savedAt).toLocaleString('fi-FI')}
                  </span>
                </div>
                <div className="save-actions">
                  <button className="btn-small btn-secondary" onClick={() => onLoad(s.id)}>
                    Lataa
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => {
                      if (confirm(`Poistetaanko tallennus "${s.name}"?`)) onDelete(s.id);
                    }}
                  >
                    Poista
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="btn-secondary dialog-close" onClick={onClose}>
          Sulje
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [sel, setSel] = useState<LiturgySelections>(() => {
    const saved = loadAutoSave();
    // Merge with DEFAULT so any fields missing from older saves get a default value
    return saved ? { ...DEFAULT, ...saved } : DEFAULT;
  });
  const [saves, setSaves] = useState<SaveFile[]>(() => loadSaves());
  const [showPrint, setShowPrint] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Auto-save on every change
  useEffect(() => {
    autoSave(sel);
  }, [sel]);

  const update = useCallback(
    <K extends keyof LiturgySelections>(key: K, value: LiturgySelections[K]) => {
      setSel(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  const fullName = [sel.firstNames, sel.lastName].filter(Boolean).join(' ');

  const forms = useMemo(
    () => conjugateDisplayName(sel.firstNames, sel.lastName),
    [sel.firstNames, sel.lastName],
  );

  const applyName = useCallback(
    (text: string) =>
      applyNameForms(text, forms, sel.firstNames || 'NN', fullName || 'NN', sel.gender),
    [forms, sel.firstNames, fullName, sel.gender],
  );

  function handleSave(name: string) {
    setSaves(prev => saveFile(prev, name, sel));
    setShowSaveDialog(false);
  }

  function handleLoad(id: string) {
    const found = saves.find(s => s.id === id);
    if (found) {
      setSel({ ...DEFAULT, ...found.selections });
      setShowSaveDialog(false);
    }
  }

  function handleDelete(id: string) {
    setSaves(prev => deleteSave(prev, id));
  }

  const isArkku = sel.burialType === 'arkku';

  return (
    <>
      {showPrint && (
        <PrintView sel={sel} fullName={fullName} onClose={() => setShowPrint(false)} />
      )}

      {showSaveDialog && (
        <SaveDialog
          saves={saves}
          currentName={sel.saveName}
          onSave={handleSave}
          onLoad={handleLoad}
          onDelete={handleDelete}
          onClose={() => setShowSaveDialog(false)}
        />
      )}

      <div className="app">
        {/* Top bar */}
        <header className="app-header">
          <h1 className="app-title">Hautaan siunaaminen</h1>
          <p className="app-subtitle">Liturgian suunnittelutyökalu</p>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => setShowSaveDialog(true)}>
              Tallenna / lataa
            </button>
            <button className="btn-primary" onClick={() => setShowPrint(true)}>
              Esikatsele / tulosta
            </button>
          </div>
        </header>

        {/* Event & person info */}
        <section className="card">
          <h2 className="card-title">Toimituksen tiedot</h2>
          <div className="field-row">
            <div className="field">
              <label className="input-label">Vainajan etunimet</label>
              <input
                className="text-input"
                value={sel.firstNames}
                onChange={e => update('firstNames', e.target.value)}
                placeholder="esim. Pekka Juhani"
              />
            </div>
            <div className="field">
              <label className="input-label">Sukunimi</label>
              <input
                className="text-input"
                value={sel.lastName}
                onChange={e => update('lastName', e.target.value)}
                placeholder="esim. Mäkinen"
              />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label className="input-label">Sukupuoli (vaikuttaa rukoustekstiin)</label>
              <select
                className="text-input"
                value={sel.gender}
                onChange={e => update('gender', e.target.value as 'male' | 'female')}
              >
                <option value="male">Mies (veljellemme)</option>
                <option value="female">Nainen (sisarellemme)</option>
              </select>
            </div>
            <div className="field">
              <label className="input-label">Toimituksen päivämäärä</label>
              <input
                className="text-input"
                type="date"
                value={sel.eventDate}
                onChange={e => update('eventDate', e.target.value)}
              />
            </div>
          </div>

          {sel.firstNames && (
            <div className="name-preview">
              <span className="name-preview-label">Nimen sijamuodot:</span>
              <span><b>Nominatiivi:</b> {forms.nominative}</span>
              <span><b>Genetiivi (NN:n):</b> {forms.genitive}</span>
              <span><b>Partitiivi (NN:ää):</b> {forms.partitive}</span>
              <span><b>Allatiivi (NN:lle):</b> {forms.allative}</span>
            </div>
          )}
        </section>

        {/* Burial type */}
        <section className="card">
          <h2 className="card-title">Hautauksen muoto</h2>
          <div className="mode-toggle">
            <button
              className={`mode-btn${sel.burialType === 'arkku' ? ' mode-btn--active' : ''}`}
              onClick={() => update('burialType', 'arkku')}
              type="button"
            >
              Arkkuhautaus
            </button>
            <button
              className={`mode-btn${sel.burialType === 'tuhka' ? ' mode-btn--active' : ''}`}
              onClick={() => update('burialType', 'tuhka')}
              type="button"
            >
              Tuhkaus
            </button>
          </div>
          {!isArkku && (
            <p className="info-note">
              Tuhkauksessa osiot 15. Rukous haudalla ja 16. Hautaan laskeminen eivät sisälly toimitukseen.
            </p>
          )}
        </section>

        {/* ── I JOHDANTO ─────────────────────────────────────────── */}
        <section className="card">
          <h2 className="card-section-group">I Johdanto</h2>

          {/* Unnumbered: Alkusoitto */}
          <div className="section-block">
            <UnnumberedHeader title="Alkusoitto" />
            <Rubric text="Alkusoittona voidaan käyttää klassista instrumentaalimusiikkia tai muuta sopivaa musiikkia." />
            <ClassicalSelector
              label="Valitse alkusoitto"
              value={sel.alkusoitto}
              onChange={v => update('alkusoitto', v)}
            />
          </div>

          {/* Unnumbered: Kukkien laskeminen */}
          <div className="section-block">
            <UnnumberedHeader title="Kukkien laskeminen" />
            <Rubric text="Valitse kukkien laskemisen ajankohta tai jätä pois." />
            <div className="option-list">
              <OptionButton
                label="Ennen 1. Virttä (Alkusoiton ja virren välissä)"
                active={sel.kukkienlaskeminen === 'before'}
                onClick={() => update('kukkienlaskeminen', sel.kukkienlaskeminen === 'before' ? 'none' : 'before')}
              />
              <OptionButton
                label="14. Päätösmusiikin jälkeen"
                active={sel.kukkienlaskeminen === 'after'}
                onClick={() => update('kukkienlaskeminen', sel.kukkienlaskeminen === 'after' ? 'none' : 'after')}
              />
            </div>
            {sel.kukkienlaskeminen !== 'none' && (
              <p className="info-note">
                Kukkien laskeminen: {sel.kukkienlaskeminen === 'before' ? 'ennen 1. Virttä' : '14. Päätösmusiikin jälkeen'}
              </p>
            )}
          </div>

          {/* 1. Virsi */}
          <div className="section-block">
            <SectionHeader num={1} title="Virsi" />
            <Rubric text="Virren edellä voi olla alkusoitto tai muuta sopivaa musiikkia." />
            <HymnSelector
              label="Valitse alkuvirsi"
              value={sel.hymn1}
              onChange={v => update('hymn1', v)}
            />
          </div>

          {/* 2. Alkusiunaus */}
          <div className="section-block">
            <SectionHeader num={2} title="Alkusiunaus" />
            <Rubric text="Siunaus ja vuorotervehdys voidaan lausua tai laulaa." />
            <SelectedText text={ALKUSIUNAUS} />
          </div>

          {/* 3. Johdantosanat */}
          <div className="section-block">
            <SectionHeader num={3} title="Johdantosanat" />
            <Rubric text="Pappi laatii johdantosanat itse tai käyttää seuraavia vaihtoehtoja. Jos johdantosanoja seuraa yhteinen rippi, niiden tulee johdattaa synnintunnustukseen." />
            <SelectSection
              options={JOHDANTOSANAT}
              selected={sel.johdantosanat}
              onSelect={i => update('johdantosanat', i)}
            />
            <SelectedText text={applyName(JOHDANTOSANAT[sel.johdantosanat].text)} />
          </div>

          {/* 4. Yhteinen rippi */}
          <div className="section-block">
            <SectionHeader num={4} title="Yhteinen rippi" />
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={sel.includeRippi}
                onChange={e => update('includeRippi', e.target.checked)}
              />
              Sisällytetään yhteinen rippi
            </label>
            {sel.includeRippi && (
              <>
                <SelectSection
                  options={SYNNITUNNUSTUS}
                  selected={sel.rippiVariant}
                  onSelect={i => update('rippiVariant', i as 0 | 1)}
                />
                <SelectedText text={SYNNITUNNUSTUS[sel.rippiVariant].text} />
                <SelectedText text={SYNNINPAASTO} />
              </>
            )}
          </div>
        </section>

        {/* ── II SANA ────────────────────────────────────────────── */}
        <section className="card">
          <h2 className="card-section-group">II Sana</h2>

          {/* 5. Psalmi */}
          <div className="section-block">
            <SectionHeader num={5} title="Psalmi" />
            <Rubric text="Psalmi voidaan laulaa tai lukea. Sen alussa ja lopussa voi olla antifoni." />

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={sel.includeAntifoni}
                onChange={e => update('includeAntifoni', e.target.checked)}
              />
              Sisällytetään antifoni
            </label>

            {sel.includeAntifoni && (
              <>
                <p className="subsection-label">Antifoni</p>
                <SelectSection
                  options={ANTIFONI}
                  selected={sel.antifoni}
                  onSelect={i => update('antifoni', i)}
                />
                <SelectedText text={ANTIFONI[sel.antifoni].text} />
              </>
            )}

            <p className="subsection-label">Psalmi</p>
            <SelectSection
              options={PSALMIT}
              selected={sel.psalmi}
              onSelect={i => update('psalmi', i)}
            />
            <SelectedText text={PSALMIT[sel.psalmi].text} />

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={sel.includePieniKunnia}
                onChange={e => update('includePieniKunnia', e.target.checked)}
              />
              Sisällytetään Pieni kunnia
            </label>
            {sel.includePieniKunnia && <SelectedText text={PIENI_KUNNIA} />}

            {sel.includeAntifoni && (
              <div className="antifoni-repeat">
                <Rubric text="Antifoni toistetaan:" />
                <SelectedText text={ANTIFONI[sel.antifoni].text} />
              </div>
            )}
          </div>

          {/* 6. Rukous */}
          <div className="section-block">
            <SectionHeader num={6} title="Rukous" />
            <Rubric text="Rukouskehotusta voi seurata lyhyt hiljainen rukous." />
            <SelectSection
              options={RUKOUS6}
              selected={sel.rukous6}
              onSelect={i => update('rukous6', i)}
            />
            <SelectedText text={applyName(RUKOUS6[sel.rukous6].text)} />
          </div>

          {/* 7. Raamatunluku ja puhe */}
          <div className="section-block">
            <SectionHeader num={7} title="Raamatunluku ja puhe" />

            <div className="mode-toggle">
              <button
                className={`mode-btn${sel.sana7mode === 'A' ? ' mode-btn--active' : ''}`}
                onClick={() => update('sana7mode', 'A')}
                type="button"
              >
                A: Raamatunluku + puhe
              </button>
              <button
                className={`mode-btn${sel.sana7mode === 'B' ? ' mode-btn--active' : ''}`}
                onClick={() => update('sana7mode', 'B')}
                type="button"
              >
                B: Raamattumeditaatio
              </button>
            </div>

            {sel.sana7mode === 'A' ? (
              <>
                <div className="multi-select-toggle">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={sel.scripture7multiSelect}
                      onChange={e => {
                        const multi = e.target.checked;
                        update('scripture7multiSelect', multi);
                        // When switching to single, keep only the first selection
                        if (!multi && sel.scripture7.length > 1) {
                          update('scripture7', [sel.scripture7[0]]);
                        }
                      }}
                    />
                    Salli useamman raamatunkohdan valinta
                  </label>
                </div>

                <p className="subsection-label">
                  Raamatuntekstit {sel.scripture7multiSelect ? '(valitse yksi tai useampia)' : '(valitse yksi)'}
                </p>
                <div className="option-list">
                  {RAAMATUNLUUT.map((r, i) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`option-btn${sel.scripture7.includes(i) ? ' option-btn--active' : ''}`}
                      onClick={() => {
                        if (sel.scripture7multiSelect) {
                          // Toggle inclusion
                          const next = sel.scripture7.includes(i)
                            ? sel.scripture7.filter(x => x !== i)
                            : [...sel.scripture7, i];
                          update('scripture7', next.length ? next : [i]);
                        } else {
                          // Single select
                          update('scripture7', [i]);
                        }
                      }}
                    >
                      {r.context && <span className="option-context">{r.context}</span>}
                      {r.label}
                    </button>
                  ))}
                </div>
                {sel.scripture7.map(idx => (
                  <SelectedText key={idx} text={RAAMATUNLUUT[idx].text} />
                ))}

                <p className="subsection-label">Puhe</p>
                <SelectSection
                  options={PUHE7}
                  selected={sel.speechVariant7}
                  onSelect={i => update('speechVariant7', i as 0 | 1)}
                />
                <SelectedText text={applyName(PUHE7[sel.speechVariant7].text)} />
              </>
            ) : (
              <div className="meditation-note">
                <p>
                  Raamattumeditaatiossa (vaihtoehto B) pappi valitsee tekstejä teemoittain ja puhe
                  sekä raamatunkohtien lukeminen vuorottelevat. Teemat:
                </p>
                <ul>
                  <li>Katoavaisuus</li>
                  <li>Valmistautuminen kuolemaan</li>
                  <li>Kristityn toivo</li>
                  <li>Ikuinen elämä</li>
                </ul>
                <p className="rubric">
                  Tekstit löytyvät kirkkokäsikirjasta (hautaan siunaaminen, §7 vaihtoehto B).
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── III SIUNAAMINEN ────────────────────────────────────── */}
        <section className="card">
          <h2 className="card-section-group">III Siunaaminen</h2>

          {/* 8. Uskontunnustus */}
          <div className="section-block">
            <SectionHeader num="*8" title="Uskontunnustus" />
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={sel.includeUskontunnustus}
                onChange={e => update('includeUskontunnustus', e.target.checked)}
              />
              Sisällytetään uskontunnustus
            </label>
            {sel.includeUskontunnustus && <SelectedText text={USKONTUNNUSTUS} />}
          </div>

          {/* 9. Siunaussanat */}
          <div className="section-block">
            <SectionHeader num="*9" title="Siunaussanat" />
            <Rubric text="Siunaussanat voidaan lausua myös haudalla (kohta 16)." />

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={sel.siunaussanatHaudalla}
                onChange={e => update('siunaussanatHaudalla', e.target.checked)}
              />
              Siunaussanat lausutaan haudalla (kohta 16)
            </label>

            <p className="subsection-label">Johdantolause</p>
            <SelectSection
              options={SIUNAUSSANAT_INTRO}
              selected={sel.siunaussanatIntro}
              onSelect={i => update('siunaussanatIntro', i as 0 | 1)}
            />
            {!sel.siunaussanatHaudalla && (
              <SelectedText text={applyName(SIUNAUSSANAT_INTRO[sel.siunaussanatIntro].text)} />
            )}

            <p className="subsection-label">Siunaussanat</p>
            <SelectSection
              options={SIUNAUSSANAT}
              selected={sel.siunaussanat}
              onSelect={i => update('siunaussanat', i)}
            />
            {!sel.siunaussanatHaudalla && (
              <SelectedText text={applyName(SIUNAUSSANAT[sel.siunaussanat].text)} />
            )}
            {sel.siunaussanatHaudalla && (
              <p className="info-note">
                Siunaussanat näkyvät tulosteessa osiossa 16. Hautaan laskeminen.
              </p>
            )}
          </div>

          {/* 10. Virsi (optional) */}
          <div className="section-block">
            <SectionHeader num={10} title="Virsi" />
            <Rubric text="Virren sijasta voidaan käyttää hautaan siunaamisen laulua tai muuta sopivaa musiikkia." />
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={sel.includeVirsi10}
                onChange={e => update('includeVirsi10', e.target.checked)}
              />
              Sisällytetään virsi 10
            </label>
            {sel.includeVirsi10 && (
              <HymnSelector
                label="Valitse virsi / musiikki"
                value={sel.hymn10}
                onChange={v => update('hymn10', v)}
              />
            )}
          </div>

          {/* 11. Esirukous */}
          <div className="section-block">
            <SectionHeader num={11} title="Esirukous" />
            <Rubric text="Voidaan käyttää myös hautausmessun rukouksia (kohta 16). Rukous voidaan valmistella myös yhdessä omaisten kanssa." />
            <SelectSection
              options={ESIRUKOUKSET}
              selected={sel.esirukous}
              onSelect={i => update('esirukous', i)}
            />
            <SelectedText text={applyName(ESIRUKOUKSET[sel.esirukous].text)} />
          </div>

          {/* 12. Isä meidän */}
          <div className="section-block">
            <SectionHeader num={12} title="Isä meidän" />
            <Rubric text="Herran rukous lausutaan yhteen ääneen." />
            <SelectedText text={ISA_MEIDAN} />
          </div>
        </section>

        {/* ── IV PÄÄTÖS ──────────────────────────────────────────── */}
        <section className="card">
          <h2 className="card-section-group">IV Päätös</h2>

          {/* 13. Siunaus */}
          <div className="section-block">
            <SectionHeader num={13} title="Siunaus" />
            <SelectedText text={SIUNAUS13} />
          </div>

          {/* 14. Päätösmusiikki */}
          <div className="section-block">
            <SectionHeader num={14} title="Päätösmusiikki" />
            <Rubric text="Päätösmusiikkina voi olla virsi ja/tai muuta sopivaa musiikkia." />
            <HymnSelector
              label="Valitse päätösvirsi / musiikki"
              value={sel.hymn14}
              onChange={v => update('hymn14', v)}
            />
            {/* When Saattomusiikki is disabled, show classical music here too */}
            {!sel.includeSaattomusiikki && (
              <ClassicalSelector
                label="Saattomusiikki (instrumentaali)"
                value={sel.saattomusiikki}
                onChange={v => update('saattomusiikki', v)}
              />
            )}
          </div>

          {/* Unnumbered: Saattomusiikki */}
          <div className="section-block">
            <UnnumberedHeader title="Saattomusiikki" />
            <Rubric text="Erillinen saattomusiikki siunauksen jälkeen. Voidaan yhdistää 14. Päätösmusiikkiin poistamalla rasti." />
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={sel.includeSaattomusiikki}
                onChange={e => update('includeSaattomusiikki', e.target.checked)}
              />
              Erillinen saattomusiikki
            </label>
            {sel.includeSaattomusiikki && (
              <ClassicalSelector
                label="Valitse saattomusiikki"
                value={sel.saattomusiikki}
                onChange={v => update('saattomusiikki', v)}
              />
            )}
          </div>

          {/* 15. Rukous haudalla — only for Arkkuhautaus */}
          {isArkku && (
            <div className="section-block">
              <SectionHeader num={15} title="Rukous haudalla" />
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={sel.includeHaudalla}
                  onChange={e => update('includeHaudalla', e.target.checked)}
                />
                Sisällytetään rukous haudalla
              </label>
              {sel.includeHaudalla && (
                <>
                  <HymnSelector
                    label="Virsi haudalla (valinnainen)"
                    value={sel.hymnHaudalla}
                    onChange={v => update('hymnHaudalla', v)}
                  />
                  <SelectSection
                    options={RUKOUS_HAUDALLA}
                    selected={sel.rukoushaudalla}
                    onSelect={i => update('rukoushaudalla', i)}
                  />
                  <SelectedText text={applyName(RUKOUS_HAUDALLA[sel.rukoushaudalla].text)} />
                </>
              )}
            </div>
          )}

          {/* 16. Hautaan laskeminen — only for Arkkuhautaus */}
          {isArkku && (
            <div className="section-block">
              <SectionHeader num={16} title="Hautaan laskeminen" />
              <Rubric text="Arkkua hautaan laskettaessa voidaan laulaa virsi (esimerkiksi 242:7–9 tai 376:3). Pappi lausuu siunaussanat, mikäli niitä ei ole lausuttu kohdassa 9. Kun kukkalaitteet on asetettu haudalle, voidaan laulaa virsi (esimerkiksi 363 tai 377)." />
              {sel.siunaussanatHaudalla && (
                <div className="info-note">
                  <p>Siunaussanat lausutaan tässä (siirretty kohdasta 9):</p>
                  <SelectedText text={applyName(SIUNAUSSANAT_INTRO[sel.siunaussanatIntro].text)} />
                  <SelectedText text={applyName(SIUNAUSSANAT[sel.siunaussanat].text)} />
                </div>
              )}
            </div>
          )}
        </section>

        <footer className="app-footer">
          <p>
            Tekstit: Kirkkokäsikirja, Suomen evankelis-luterilainen kirkko (
            <a href="https://kirkkokasikirja.fi" target="_blank" rel="noreferrer">
              kirkkokasikirja.fi
            </a>
            ) &bull; Virsikirja:{' '}
            <a href="https://virsikirja.fi" target="_blank" rel="noreferrer">
              virsikirja.fi
            </a>
          </p>
          <p>
            <button className="btn-primary footer-print-btn" onClick={() => setShowPrint(true)}>
              Esikatsele ja tulosta liturgia
            </button>
          </p>
        </footer>
      </div>
    </>
  );
}
