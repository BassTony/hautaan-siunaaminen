export interface ClassicalPiece {
  id: string;
  composer: string;
  title: string;
  note?: string; // optional context (e.g. "sopii alkusoittoon")
}

/**
 * Classical instrumental pieces commonly played at Finnish Lutheran funerals.
 * Sources: Finnish funeral tradition, kanttori repertoire.
 */
export const CLASSICAL_PIECES: ClassicalPiece[] = [
  {
    id: 'bach-air',
    composer: 'J. S. Bach',
    title: 'Air (orkesterisarja nro 3 D-duuri, BWV 1068)',
  },
  {
    id: 'albinoni-adagio',
    composer: 'Albinoni / Giazotto',
    title: 'Adagio g-molli',
  },
  {
    id: 'barber-adagio',
    composer: 'Samuel Barber',
    title: 'Adagio jousiorkesterille, op. 11',
  },
  {
    id: 'handel-sarabande',
    composer: 'G. F. Handel',
    title: 'Sarabande d-molli (HWV 437)',
  },
  {
    id: 'pachelbel-canon',
    composer: 'Johann Pachelbel',
    title: 'Kaanon D-duuri',
  },
  {
    id: 'grieg-aase',
    composer: 'Edvard Grieg',
    title: 'Åsen kuolema (Peer Gynt -sarja nro 1, op. 46)',
  },
  {
    id: 'sibelius-finlandia-hymni',
    composer: 'Jean Sibelius',
    title: 'Finlandia-hymni (op. 26)',
  },
  {
    id: 'faure-pavane',
    composer: 'Gabriel Fauré',
    title: 'Pavane, op. 50',
  },
  {
    id: 'schubert-ave-maria',
    composer: 'Franz Schubert',
    title: 'Ave Maria, D. 839',
  },
  {
    id: 'bach-gounod-ave-maria',
    composer: 'Bach / Gounod',
    title: 'Ave Maria',
  },
];
