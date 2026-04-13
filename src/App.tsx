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
  hymn1: { type: 'none' },
  johdantosanat: 0,
  includeRippi: false,
  rippiVariant: 0,
  antifoni: 0,
  psalmi: 0,
  includePieniKunnia: false,
  rukous6: 0,
  sana7mode: 'A',
  scripture7: [0],
  speechVariant7: 0,
  theme7: [],
  includeUskontunnustus: true,
  siunaussanatIntro: 0,
  siunaussanat: 0,
  hymn10: { type: 'none' },
  esirukous: 0,
  hymn14: { type: 'none' },
  includeHaudalla: false,
  rukoushaudalla: 0,
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

function Rubric({ text }: { text: string }) {
  return <p className="rubric">{text}</p>;
}

function SelectedText({ text }: { text: string }) {
  return (
    <pre className="selected-text">{text}</pre>
  );
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
            if (id === '') {
              onChange({ type: 'none' });
            } else {
              onChange({ type: 'predefined', hymnId: id });
            }
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
            <p className="print-rubric">Antifoni:</p>
            <pre>{ANTIFONI[sel.antifoni].text}</pre>
            <pre>{PSALMIT[sel.psalmi].text}</pre>
            {sel.includePieniKunnia && <pre>{PIENI_KUNNIA}</pre>}
            <p className="print-rubric">Antifoni toistetaan.</p>
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

          <div className="print-item">
            <h3>*9. Siunaussanat</h3>
            <pre>{applyName(SIUNAUSSANAT_INTRO[sel.siunaussanatIntro].text)}</pre>
            <pre>{applyName(SIUNAUSSANAT[sel.siunaussanat].text)}</pre>
          </div>

          <div className="print-item">
            <h3>10. Virsi</h3>
            <p>{hymnLabel(sel.hymn10)}</p>
          </div>

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
          </div>

          {sel.includeHaudalla && (
            <div className="print-item">
              <h3>15. Rukous haudalla</h3>
              <pre>{applyName(RUKOUS_HAUDALLA[sel.rukoushaudalla].text)}</pre>
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
  const [sel, setSel] = useState<LiturgySelections>(() => loadAutoSave() ?? DEFAULT);
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
      setSel(found.selections);
      setShowSaveDialog(false);
    }
  }

  function handleDelete(id: string) {
    setSaves(prev => deleteSave(prev, id));
  }

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

        {/* ── I JOHDANTO ─────────────────────────────────────────── */}
        <section className="card">
          <h2 className="card-section-group">I Johdanto</h2>

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

            <p className="subsection-label">Antifoni</p>
            <SelectSection
              options={ANTIFONI}
              selected={sel.antifoni}
              onSelect={i => update('antifoni', i)}
            />
            <SelectedText text={ANTIFONI[sel.antifoni].text} />

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
            <Rubric text="Antifoni toistetaan." />
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
                <p className="subsection-label">Raamatuntekstit (valitse yksi tai useampia)</p>
                <div className="option-list">
                  {RAAMATUNLUUT.map((r, i) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`option-btn${sel.scripture7.includes(i) ? ' option-btn--active' : ''}`}
                      onClick={() => {
                        const next = sel.scripture7.includes(i)
                          ? sel.scripture7.filter(x => x !== i)
                          : [...sel.scripture7, i];
                        update('scripture7', next.length ? next : [i]);
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

            <p className="subsection-label">Johdantolause</p>
            <SelectSection
              options={SIUNAUSSANAT_INTRO}
              selected={sel.siunaussanatIntro}
              onSelect={i => update('siunaussanatIntro', i as 0 | 1)}
            />
            <SelectedText text={applyName(SIUNAUSSANAT_INTRO[sel.siunaussanatIntro].text)} />

            <p className="subsection-label">Siunaussanat</p>
            <SelectSection
              options={SIUNAUSSANAT}
              selected={sel.siunaussanat}
              onSelect={i => update('siunaussanat', i)}
            />
            <SelectedText text={applyName(SIUNAUSSANAT[sel.siunaussanat].text)} />
          </div>

          {/* 10. Virsi */}
          <div className="section-block">
            <SectionHeader num={10} title="Virsi" />
            <Rubric text="Virren sijasta voidaan käyttää hautaan siunaamisen laulua tai muuta sopivaa musiikkia." />
            <HymnSelector
              label="Valitse virsi / musiikki"
              value={sel.hymn10}
              onChange={v => update('hymn10', v)}
            />
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
              label="Valitse päätösmusiikki"
              value={sel.hymn14}
              onChange={v => update('hymn14', v)}
            />
          </div>

          {/* 15. Rukous haudalla */}
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
                <SelectSection
                  options={RUKOUS_HAUDALLA}
                  selected={sel.rukoushaudalla}
                  onSelect={i => update('rukoushaudalla', i)}
                />
                <SelectedText text={applyName(RUKOUS_HAUDALLA[sel.rukoushaudalla].text)} />
              </>
            )}
          </div>

          {/* 16. Hautaan laskeminen */}
          <div className="section-block">
            <SectionHeader num={16} title="Hautaan laskeminen" />
            <Rubric text="Arkkua hautaan laskettaessa voidaan laulaa virsi (esimerkiksi 242:7–9 tai 376:3). Pappi lausuu siunaussanat, mikäli niitä ei ole lausuttu kohdassa 9. Kun kukkalaitteet on asetettu haudalle, voidaan laulaa virsi (esimerkiksi 363 tai 377)." />
            <p className="info-note">
              Siunaussanat (kohta 9) voidaan lausua vaihtoehtoisesti tässä haudalla.
            </p>
          </div>
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
