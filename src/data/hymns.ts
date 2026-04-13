export interface Hymn {
  id: string;
  number: string;   // e.g. "338", "341a", "Laulu 825"
  title: string;
}

/** Primary funeral hymns from virsikirja.fi / "Hautaan siunaaminen" theme */
export const FUNERAL_HYMNS: Hymn[] = [
  { id: 'virsi-30',   number: '30',      title: 'Maa on niin kaunis' },
  { id: 'virsi-338',  number: '338',     title: 'Päivä vain ja hetki kerrallansa' },
  { id: 'virsi-341a', number: '341a',    title: 'Kiitos sulle, Jumalani (a)' },
  { id: 'virsi-341b', number: '341b',    title: 'Kiitos sulle, Jumalani (b)' },
  { id: 'virsi-363',  number: '363',     title: 'Oi Herra, luokseni jää (363)' },
  { id: 'virsi-376',  number: '376',     title: 'Vuorilla tuulet (376)' },
  { id: 'virsi-377',  number: '377',     title: 'Sun haltuus, rakas Isäni' },
  { id: 'virsi-517',  number: '517',     title: 'Herra, kädelläsi' },
  { id: 'virsi-555',  number: '555',     title: 'Oi Herra, luoksein jää' },
  { id: 'virsi-631a', number: '631a',    title: 'Oi Herra, jos mä matkamies maan (a)' },
  { id: 'virsi-631b', number: '631b',    title: 'Oi Herra, jos mä matkamies maan (b)' },
  { id: 'laulu-825',  number: 'Laulu 825', title: 'Armo suuren Jumalamme' },
  { id: 'virsi-903',  number: '903',     title: 'Soi, virteni, kiitosta Herran' },
  { id: 'virsi-971',  number: '971',     title: 'Maan korvessa kulkevi lapsosen tie' },
  // Additional hymns mentioned in the liturgy rubrics
  { id: 'virsi-242',  number: '242',     title: 'Virsi 242 (säk. 7–9, hautaan laskeminen)' },
];
