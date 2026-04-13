/**
 * Complete text data for "Hautaan siunaaminen" (Finnish Lutheran funeral blessing).
 * Source: Kirkkokäsikirja, hautaus.html / 05a_hautaan_siun.pdf
 * (Suomen evankelis-luterilainen kirkko, kirkkokasikirja.fi)
 *
 * P = pappi (priest), S = seurakunta (congregation), E = esilukija (lector)
 */

// ─── SECTION 2: Alkusiunaus (fixed) ─────────────────────────────────────────

export const ALKUSIUNAUS = `P  Isän ja ✝ Pojan ja Pyhän Hengen nimeen.
S  Aamen.

P  Herra olkoon teidän kanssanne.
S  Niin myös sinun henkesi kanssa.`;

// ─── SECTION 3: Johdantosanat ───────────────────────────────────────────────

export interface TextOption {
  id: string;
  label: string;        // short label for the selector button
  context?: string;     // rubric note shown above the text
  text: string;
}

export const JOHDANTOSANAT: TextOption[] = [
  {
    id: 'johd-1',
    label: 'Kristillinen seurakunta',
    text: `P  Kristillinen seurakunta. Olemme saattamassa NN:ää haudan lepoon. Ylösnousemuksen toivo luo valoaan tähän hetkeen. Pyhässä kasteessa hänet on liitetty Kristuksen kuolemaan ja ylösnousemukseen. Kristuksen voittoon turvaten jätämme hänet Jumalan käsiin. Me luotamme Jumalan sanan lupaukseen: »Kristus on kuollut puolestamme, jotta saisimme elää yhdessä hänen kanssaan» (1. Tess. 5:10).`,
  },
  {
    id: 'johd-2',
    label: 'Hyvät omaiset ja ystävät',
    text: `P  Hyvät omaiset ja ystävät. Sydämemme täyttää suru ja kaipaus NN:n poismenon vuoksi. Jätämme hänet Jumalan käsiin. Me turvaudumme Kristukseen, kuoleman voittajaan, joka sanoo: »Minä olin kuollut, mutta nyt minä elän, elän aina ja ikuisesti. Minulla on kuoleman ja tuonelan avaimet.» (Ilm. 1:18.)`,
  },
  {
    id: 'johd-3',
    label: 'Rakkaat ystävät',
    text: `P  Rakkaat ystävät. Olemme kokoontuneet saattamaan NN:ää haudan lepoon. Teemme sen Jumalan kasvojen edessä ja hänen lupauksiinsa luottaen. Kuulemme Jumalan sanaa elämän katoavaisuudesta, kristityn toivosta ja iankaikkisesta elämästä.

Pyytäkäämme, että saisimme tässä hetkessä lohdutusta Kristuksen rististä ja ylösnousemuksesta ja että iankaikkisen elämän toivo valaisisi meitä tämän murheen keskellä. Kristukseen turvaten jätämme hänet Jumalan käsiin [ja tunnustamme syntimme näin sanoen].`,
  },
  {
    id: 'johd-4',
    label: 'Rakkaat omaiset (rippi)',
    context: 'Yhteiseen rippiin johdatettaessa.',
    text: `P  Rakkaat omaiset, sukulaiset ja ystävät. Sydämemme täyttää suru ja kaipaus NN:n poismenon vuoksi. Jätämme hänet Jumalan käsiin. Tunnemme katumusta ja ahdistusta sen takia, että emme ole osanneet elää oikein. Moni asia olisi tullut tehdä toisin kuin olemme tehneet. Käykäämme nyt armollisen Jumalan kasvojen eteen ja tunnustakaamme syntimme ja laiminlyöntimme.`,
  },
];

// ─── SECTION 4: Yhteinen rippi ──────────────────────────────────────────────

export const SYNNITUNNUSTUS: TextOption[] = [
  {
    id: 'synti-1',
    label: 'Tunnustamme edessäsi',
    text: `Tunnustamme edessäsi, pyhä Jumala,
että olemme tehneet syntiä
ajatuksin ja sanoin,
teoin ja laiminlyönnein.
Muista meitä laupeudessasi
ja anna meille Jeesuksen Kristuksen tähden anteeksi,
mitä olemme rikkoneet.`,
  },
  {
    id: 'synti-2',
    label: 'Syvyydestä minä huudan',
    text: `Syvyydestä minä huudan sinua, Herra.
Herra, kuule minun ääneni,
tarkatkoot sinun korvasi rukoustani.
Jos sinä, Herra, pidät mielessäsi synnit,
Herra, kuka silloin kestää?
Mutta sinun on armo, sinä annat anteeksi,
että me eläisimme sinun pelossasi.
Minä odotan sinua, Herra,
odotan sinua koko sielustani
ja panen toivoni sinun sanaasi.`,
  },
];

export const SYNNINPAASTO = `P  Kaikkivaltias Jumala antakoon meille syntimme anteeksi ja johtakoon meidät ikuiseen elämään.
S  Aamen.`;

// ─── SECTION 5: Psalmi ──────────────────────────────────────────────────────

export const ANTIFONI: TextOption[] = [
  {
    id: 'ant-1',
    label: 'Iankaikkinen lepo',
    text: `Herra, anna hänelle iankaikkinen lepo,
ikuinen valo häntä valaiskoon.`,
  },
  {
    id: 'ant-2',
    label: 'Lunastajani elää',
    text: `Minä tiedän, että lunastajani elää.
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tJob 19:25`,
  },
  {
    id: 'ant-3',
    label: 'Minä odotan sinua',
    text: `Minä odotan sinua, Herra,
ja panen toivoni sinun sanaasi.
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPs. 130:5`,
  },
];

export const PSALMIT: TextOption[] = [
  {
    id: 'ps-23',
    label: 'Ps. 23 – Herra on minun paimeneni',
    text: `Herra on minun paimeneni,
ei minulta mitään puutu.
\tHän vie minut vihreille niityille,
\thän johtaa minut vetten ääreen,
\tsiellä saan levätä.
Hän virvoittaa minun sieluni,
hän ohjaa minua oikeaa tietä nimensä kunnian tähden.
\tVaikka minä kulkisin pimeässä laaksossa,
\ten pelkäisi mitään pahaa,
\tsillä sinä olet minun kanssani.
Sinä suojelet minua kädelläsi,
johdatat paimensauvallasi.
\tSinä katat minulle pöydän
\tvihollisteni silmien eteen.
Sinä voitelet pääni tuoksuvalla öljyllä,
ja minun maljani on ylitsevuotavainen.
\tSinun hyvyytesi ja rakkautesi ympäröi minut
\tkaikkina elämäni päivinä,
\tja minä saan asua Herran huoneessa päivieni loppuun asti.
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPs. 23`,
  },
  {
    id: 'ps-39',
    label: 'Ps. 39 – Herra, anna minun muistaa',
    text: `Herra, anna minun muistaa,
että elämäni päättyy,
että päivilleni on pantu määrä.
\tOpeta minua ymmärtämään,
\tkuinka katoavainen minä olen!
Vain kourallisen päiviä sinä annoit minulle,
elämäni on sinun silmissäsi kuin ohikiitävä hetki.
Vain tuulenhenkäys ovat ihmiset, kaikki tyynni.
\tHerra, onko minulla vielä toivoa?
\tKaikki on sinun varassasi.
Kuule rukoukseni, Herra,
ota vastaan avunhuutoni.
Älä ole kuuro minun itkulleni!
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPs. 39:5–6, 8, 13`,
  },
  {
    id: 'ps-42',
    label: 'Ps. 42 – Niin kuin peura janoissaan',
    text: `Niin kuin peura janoissaan etsii vesipuroa,
niin minä kaipaan sinua, Jumala.
\tMinun sieluni janoaa Jumalaa, elävää Jumalaa.
\tMilloin saan tulla temppeliin,
\tastua Jumalan kasvojen eteen?
Miksi olet masentunut, sieluni,
miksi olet niin levoton?
\tOdota Jumalaa! Vielä saan kiittää häntä,
\tJumalaani, auttajaani.
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPs. 42:2–3, 6`,
  },
  {
    id: 'ps-90',
    label: 'Ps. 90 – Herra, sinä olet meidän turvamme',
    text: `Herra, sinä olet meidän turvamme
polvesta polveen.
\tJo ennen kuin vuoret syntyivät,
\tennen kuin maa ja maanpiiri saivat alkunsa, sinä olit.
\tJumala, ajasta aikaan sinä olet.
Sinä annat ihmisten tulla maaksi jälleen ja sanot:
»Palatkaa tomuun, Aadamin lapset.»
\tTuhat vuotta on sinulle kuin yksi päivä,
\tkuin eilinen päivä, mailleen mennyt,
\tkuin öinen vartiohetki.
Me katoamme kuin uni aamun tullen,
kuin ruoho, joka hetken kukoistaa,
\tjoka vielä aamulla viheriöi
\tmutta illaksi kuivuu ja kuihtuu pois.
Opeta meille, miten lyhyt on aikamme,
että saisimme viisaan sydämen.
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPs. 90:1–6, 12`,
  },
  {
    id: 'ps-91',
    label: 'Ps. 91 – Herra sanoo: Minä pelastan hänet',
    text: `Herra sanoo: »Minä pelastan hänet,
koska hän turvaa minuun.
\tHän tunnustaa minun nimeäni, siksi suojelen häntä.
\tKun hän huutaa minua, minä vastaan.
Minä olen hänen tukenaan ahdingossa,
pelastan hänet ja nostan taas kunniaan.
\tMinä annan hänelle kyllälti elinpäiviä,
\thän saa nähdä, että minä autan häntä.»
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPs. 91:14–16`,
  },
  {
    id: 'ps-103',
    label: 'Ps. 103 – Ylistä Herraa, minun sieluni',
    text: `Ylistä Herraa, minun sieluni,
ja kaikki mitä minussa on,
ylistä hänen pyhää nimeään.
\tYlistä Herraa, minun sieluni,
\tälä unohda, mitä hyvää hän on sinulle tehnyt.
Anteeksiantava ja laupias on Herra.
Hän on kärsivällinen ja hänen armonsa on suuri.
\tSillä niin kuin taivas on korkea maan yllä,
\tniin on Herran armo suuri niille,
\tjotka pelkäävät ja rakastavat häntä.
Niin kaukana kuin itä on lännestä,
niin kauas hän siirtää meidän syntimme.
\tNiin kuin isä armahtaa lapsiaan,
\tniin armahtaa Herra niitä,
\tjotka pelkäävät ja rakastavat häntä.
Ihmisen elinaika on niin kuin ruohon:
kuin kedon kukka hän kukoistaa,
\tja kun tuuli käy yli, ei häntä enää ole
\teikä hänen asuinsijansa häntä tunne.
Mutta Herran armo pysyy ajasta aikaan,
se on ikuinen niille, jotka pelkäävät ja rakastavat häntä.
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPs. 103:1–2, 8, 11–13, 15–17`,
  },
  {
    id: 'ps-130',
    label: 'Ps. 130 – Syvyydestä minä huudan',
    text: `Syvyydestä minä huudan sinua, Herra.
Herra, kuule minun ääneni,
tarkatkoot sinun korvasi rukoustani.
\tJos sinä, Herra, pidät mielessäsi synnit,
\tHerra, kuka silloin kestää?
Mutta sinun on armo, sinä annat anteeksi,
että me eläisimme sinun pelossasi.
\tMinä odotan sinua, Herra,
\todotan sinua koko sielustani
\tja panen toivoni sinun sanaasi.
Israel, pane toivosi Herraan!
Hänen armonsa on runsas,
hän voi sinut lunastaa.
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPs. 130:1–5, 7`,
  },
  {
    id: 'ps-139',
    label: 'Ps. 139 – Herra, sinä olet minut tutkinut',
    text: `Herra, sinä olet minut tutkinut,
sinä tunnet minut.
\tMissä olenkin, minne menenkin, sen sinä tiedät,
\tjo kaukaa sinä näet aikeeni.
Kuljen tai lepään, kaiken olet mitannut,
perin pohjin sinä tunnet minun tekemiseni.
\tSinä olet luonut minut sisintäni myöten,
\täitini kohdussa olet minut punonut.
Minä olen ihme, suuri ihme, ja kiitän sinua siitä.
Ihmeellisiä ovat sinun tekosi, minä tiedän sen.
\tMinä olen saanut hahmoni näkymättömissä,
\tmuotoni kuin syvällä maan alla,
\tmutta sinulta ei pieninkään luuni ole salassa.
Sinun silmäsi näkivät minut jo idullani,
sinun kirjaasi on kaikki kirjoitettu.
\tEnnen kuin olin elänyt päivääkään,
\tolivat kaikki päiväni jo luodut.
Kuinka ylivertaisia ovatkaan sinun suunnitelmasi, Jumala,
kuinka valtava onkaan niiden määrä!
\tJos yritän niitä laskea,
\tniitä on enemmän kuin on hiekanjyviä.
\tMinä lopetan, mutta tiedän: sinä olet kanssani.
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPs. 139:1–3, 13–18`,
  },
];

export const PIENI_KUNNIA = `Kunnia Isälle ja Pojalle
ja Pyhälle Hengelle,
\tniin kuin oli alussa, nyt on ja aina,
\tiankaikkisesta iankaikkiseen. Aamen.`;

// ─── SECTION 6: Rukous ──────────────────────────────────────────────────────

export const RUKOUS6: TextOption[] = [
  {
    id: 'ruk6-1',
    label: '1. Kaikkivaltias Jumala',
    text: `P  Rukoilkaamme.

1. Kaikkivaltias Jumala, taivaallinen Isä.
Sinä olet Poikasi kärsimisellä
ja hänen riemullisella ylösnousemisellaan
avannut meille tien ikuiseen elämään.
Auta meitä kaikesta sydämestämme turvautumaan Kristukseen.
Me ylistämme sinua nyt ja kerran luonasi kirkkaudessa.
Kuule meitä Jeesuksen Kristuksen,
meidän Herramme tähden,
joka sinun ja Pyhän Hengen kanssa
elää ja hallitsee ikuisesti.

S  Aamen.`,
  },
  {
    id: 'ruk6-2',
    label: '2. Jumala, Isämme',
    text: `P  Rukoilkaamme.

2. Jumala, Isämme.
Rohkaise meitä suremaan,
kun on aika surra ja itkeä.
Varjele, ettemme murheessamme
ajattelisi vain kuoleman pimeyttä
vaan muistaisimme ikuisen elämän toivoa.
Opeta meitä turvautumaan Poikaasi Jeesukseen Kristukseen,
joka on voittanut kuoleman vallan.
Lohduta meitä
ja auta meitä kohtaamaan huomispäivä
luottavaisesti ja turvallisin mielin.
Kuule meitä Jeesuksen Kristuksen,
meidän Herramme tähden.

S  Aamen.`,
  },
  {
    id: 'ruk6-3',
    label: '3. Kristus, Vapahtajamme',
    text: `P  Rukoilkaamme.

3. Kristus, Vapahtajamme.
Sinä tunnet ahdistuksemme,
kun kuolema tulee meitä lähelle.
Sinä tiedät, miten vaikeaa on luopua ihmisestä,
joka on ollut läheinen ja rakas.
Sinä rakastit meitä loppuun asti
ja kohtasit kuoleman kauhut.
Me uskomme NN:n sinun huomaasi.
Anna lohdutus suruumme.
Kuule meitä, sinä ylösnoussut Herramme.

S  Aamen.`,
  },
  {
    id: 'ruk6-4',
    label: '4. Armon ja laupeuden Jumala',
    text: `P  Rukoilkaamme.

4. Armon ja laupeuden Jumala.
Anna tästä elämästä lähteneelle veljellemme/sisarellemme NN:lle ikuinen lepo.
Valaise kirkkaudellasi hänen viimeinen matkansa
ja suo meidän viettää tänään hänen muistoaan tulevan elämän toivossa.
Sinun pyhät enkelisi kantakoot hänet autuaitten joukkoon.
Saakoon hän rauhan luonasi paratiisissa.
Anna Poikasi kärsimysten ja esirukousten olla hänen turvanaan.
Kuule meitä Jeesuksen Kristuksen, rakkaan Poikasi tähden.

S  Aamen.`,
  },
];

// ─── SECTION 7: Raamatunluku ja puhe ────────────────────────────────────────

export interface ScriptureReading {
  id: string;
  ref: string;
  label: string;
  context?: string;
  text: string;
}

export const RAAMATUNLUUT: ScriptureReading[] = [
  {
    id: 'room-8-18',
    ref: 'Room. 8:18–21',
    label: 'Room. 8:18–21 – Nykyisen ajan kärsimykset',
    text: `Minä päättelen, etteivät nykyisen ajan kärsimykset ole mitään sen kirkkauden rinnalla, joka vielä on ilmestyvä ja tuleva osaksemme. Koko luomakunta odottaa hartaasti Jumalan lasten ilmestymistä. Kaiken luodun on täytynyt taipua katoavaisuuden alaisuuteen, ei omasta tahdostaan, vaan hänen, joka sen on alistanut. Luomakunnalla on kuitenkin toivo, että myös se pääsee kerran pois katoavaisuuden orjuudesta, Jumalan lasten vapauteen ja kirkkauteen.`,
  },
  {
    id: 'room-8-31',
    ref: 'Room. 8:31–35, 37–39',
    label: 'Room. 8:31–39 – Ei mikään voi erottaa',
    text: `Jos Jumala on meidän puolellamme, kuka voi olla meitä vastaan? Kun hän ei säästänyt omaa Poikaansakaan vaan antoi hänet kuolemaan kaikkien meidän puolestamme, kuinka hän ei lahjoittaisi Poikansa mukana meille kaikkea muutakin? Kuka voi syyttää Jumalan valittuja? Jumala – mutta hän julistaa vanhurskaaksi! Kuka voi tuomita kadotukseen? Kristus – mutta hän on kuollut meidän tähtemme, ja enemmänkin: hänet on herätetty kuolleista, hän istuu Jumalan oikealla puolella ja rukoilee meidän puolestamme! Mikä voi erottaa meidät Kristuksen rakkaudesta? Tuska tai ahdistus, vaino tai nälkä, alastomuus, vaara tai miekka?

Mutta kaikissa näissä ahdingoissa meille antaa riemuvoiton hän, joka on meitä rakastanut. Olen varma siitä, ettei kuolema eikä elämä, eivät enkelit, eivät henkivallat, ei mikään nykyinen eikä mikään tuleva eivätkä mitkään voimat, ei korkeus eikä syvyys, ei mikään luotu voi erottaa meitä Jumalan rakkaudesta, joka on tullut ilmi Kristuksessa Jeesuksessa, meidän Herrassamme.`,
  },
  {
    id: '1kor-15',
    ref: '1. Kor. 15:53–57',
    label: '1. Kor. 15:53–57 – Kuolema on nielty',
    text: `Tämän katoavan on pukeuduttava katoamattomuuteen ja kuolevaisen kuolemattomuuteen. Mutta kun katoava pukeutuu katoamattomuuteen ja kuolevainen kuolemattomuuteen, silloin toteutuu kirjoitusten sana:
– Kuolema on nielty ja voitto saatu.
Missä on voittosi, kuolema?
Missä on pistimesi, kuolema?
Kuoleman pistin on synti, ja synnin voimana on laki. Mutta kiitos Jumalalle, joka antaa meille voiton meidän Herramme Jeesuksen Kristuksen kautta!`,
  },
  {
    id: '2kor-5',
    ref: '2. Kor. 5:1–5',
    label: '2. Kor. 5:1–5 – Maallinen telttamajamme',
    text: `Me tiedämme, että vaikka tämä meidän maallinen telttamajamme puretaankin, Jumalalla on taivaassa meitä varten ikuinen asunto, joka ei ole ihmiskätten työtä. Täällä ollessamme me huokailemme ja kaipaamme päästä pukeutumaan taivaalliseen asuumme, sillä sitten kun olemme pukeutuneet siihen, emme jää alastomiksi. Me, jotka vielä asumme tässä majassamme, huokailemme ahdistuneina. Emme haluaisi riisuutua vaan pukeutua uuteen asuun, niin että elämä kätkisi sisäänsä sen, mikä on kuolevaista. Juuri tähän Jumala on valmistanut meidät, ja vakuudeksi hän on antanut meille Hengen.`,
  },
  {
    id: '1tess-4',
    ref: '1. Tess. 4:13–18',
    label: '1. Tess. 4:13–18 – Kuoleman uneen nukkuvat',
    text: `Tahdomme teidän olevan selvillä siitä, mitä tapahtuu kuoleman uneen nukkuville, jotta ette surisi niin kuin nuo toiset, joilla ei ole toivoa. Jos kerran Jeesus on kuollut ja noussut kuolleista, niin kuin me uskomme, silloin Jumala myös on Jeesuksen tullessa tuova poisnukkuneet elämään yhdessä hänen kanssaan. Ilmoitamme teille, mitä Herra on sanonut: Me elossa olevat, jotka saamme jäädä tänne siihen asti kun Herra tulee, emme ehdi poisnukkuneiden edelle. Itse Herra laskeutuu taivaasta ylienkelin käskyhuudon kuuluessa ja Jumalan pasuunan kaikuessa, ja ensin nousevat ylös ne, jotka ovat kuolleet Kristukseen uskovina. Meidät, jotka olemme vielä elossa ja täällä jäljellä, temmataan sitten yhdessä heidän kanssaan pilvissä yläilmoihin Herraa vastaan. Näin saamme olla aina Herran kanssa. Rohkaiskaa siis toisianne näillä sanoilla.`,
  },
  {
    id: '1piet-1',
    ref: '1. Piet. 1:3–7',
    label: '1. Piet. 1:3–7 – Elävä toivo',
    text: `Ylistetty olkoon meidän Herramme Jeesuksen Kristuksen Jumala ja Isä! Suuressa laupeudessaan hän on synnyttänyt meidät uuteen elämään ja antanut meille elävän toivon herättämällä Jeesuksen Kristuksen kuolleista. Häneltä me saamme perinnön, joka ei turmellu, ei tahraannu eikä kuihdu. Se on varattuna teille taivaissa, ja voimallaan Jumala varjelee teidät uskossa, niin että te saavutatte pelastuksen, joka on valmiina saatettavaksi ilmi lopunaikana.

Siksi te riemuitsette, vaikka nyt jouduttekin jonkin aikaa kärsimään monenlaisissa koettelemuksissa. Kultakin koetellaan tulessa, ja onhan teidän uskonne paljon arvokkaampaa kuin katoava kulta. Koettelemuksissa teidän uskonne todetaan aidoksi, ja siitä koituu Jeesuksen Kristuksen ilmestyessä ylistystä, kirkkautta ja kunniaa.`,
  },
  {
    id: 'ilm-7',
    ref: 'Ilm. 7:9–10, 13–17',
    label: 'Ilm. 7:9–17 – Suuri kansanjoukko',
    text: `Tämän jälkeen näin suuren kansanjoukon, niin suuren, ettei kukaan kyennyt sitä laskemaan. Siinä oli ihmisiä kaikista maista, kaikista kansoista ja heimoista, ja he puhuivat kaikkia kieliä. He seisoivat valtaistuimen ja Karitsan edessä yllään valkeat vaatteet ja kädessään palmunoksa ja huusivat kovalla äänellä:
– Pelastuksen tuo meidän Jumalamme,
hän, joka istuu valtaistuimella,
hän ja Karitsa!

– Nämä ovat päässeet suuresta ahdingosta.
He ovat pesseet vaatteensa
ja valkaisseet ne Karitsan veressä.
Sen tähden he ovat Jumalan valtaistuimen edessä
ja palvelevat häntä hänen pyhäkössään
päivin ja öin,
ja hän, joka istuu valtaistuimella,
on levittänyt telttansa heidän ylleen.
Nälkä ei heitä enää vaivaa, ei jano,
enää ei heitä polta aurinko
eikä paahtava helle.
Karitsa, joka on valtaistuimen edessä,
kaitsee heitä
ja vie heidät elämän veden lähteille,
ja Jumala pyyhkii heidän silmistään
kaikki kyyneleet.`,
  },
  {
    id: 'joh-5',
    ref: 'Joh. 5:24–29',
    label: 'Joh. 5:24–29 – Kuolemasta elämään',
    text: `Jeesus sanoo:
»Totisesti, totisesti: se, joka kuulee minun sanani ja uskoo minun lähettäjääni, on saanut ikuisen elämän. Hän ei joudu tuomittavaksi, vaan hän on jo siirtynyt kuolemasta elämään. Totisesti, totisesti: tulee aika – ja se on jo nyt – jolloin kuolleet kuulevat Jumalan Pojan äänen. Ne, jotka sen kuulevat, saavat elää, sillä Isä, elämän lähde, on tehnyt myös Pojasta elämän lähteen. Isä on myös antanut hänelle tuomiovallan, koska hän on Ihmisen Poika. Älkää ihmetelkö tätä! Tulee aika, jolloin kaikki, jotka lepäävät haudoissaan, kuulevat hänen äänensä. He nousevat haudoistaan – hyvää tehneet elämän ylösnousemukseen, pahaa tehneet tuomion ylösnousemukseen.»`,
  },
  {
    id: 'joh-11',
    ref: 'Joh. 11:21–26',
    label: 'Joh. 11:21–26 – Minä olen ylösnousemus ja elämä',
    text: `Martta sanoi Jeesukselle: »Herra, jos olisit ollut täällä, veljeni ei olisi kuollut. Mutta nytkin tiedän, että Jumala antaa sinulle kaiken mitä häneltä pyydät.» Jeesus sanoi: »Veljesi nousee kuolleista.» Martta vastasi: »Tiedän kyllä, että hän nousee viimeisenä päivänä, ylösnousemuksessa.» Jeesus sanoi: »Minä olen ylösnousemus ja elämä. Joka uskoo minuun, saa elää, vaikka kuoleekin, eikä yksikään, joka elää ja uskoo minuun, ikinä kuole.»`,
  },
  {
    id: 'joh-14',
    ref: 'Joh. 14:1–6',
    label: 'Joh. 14:1–6 – Älköön sydämenne olko levoton',
    text: `Jeesus sanoo:
»Älköön sydämenne olko levoton. Uskokaa Jumalaan ja uskokaa minuun. Minun Isäni kodissa on monta huonetta – enhän minä muuten sanoisi, että menen valmistamaan teille asuinsijan. Minä menen valmistamaan teille sijaa mutta tulen sitten takaisin ja noudan teidät luokseni, jotta saisitte olla siellä missä minä olen. Te tiedätte kyllä tien sinne minne minä menen.»

Tuomas sanoi hänelle: »Herra, emme me tiedä, minne sinä menet. Kuinka voisimme tuntea tien?» Jeesus vastasi: »Minä olen tie, totuus ja elämä. Ei kukaan pääse Isän luo muuten kuin minun kauttani.»`,
  },
  {
    id: 'mark-10',
    ref: 'Mark. 10:13–16',
    label: 'Mark. 10:13–16 – Lasta siunattaessa',
    context: 'Lasta siunattaessa.',
    text: `Jeesuksen luo tuotiin lapsia, jotta hän koskisi heihin. Opetuslapset moittivat tuojia, mutta sen huomatessaan Jeesus närkästyi ja sanoi heille: »Sallikaa lasten tulla minun luokseni, älkää estäkö heitä. Heidän kaltaistensa on Jumalan valtakunta. Totisesti: joka ei ota Jumalan valtakuntaa vastaan niin kuin lapsi, hän ei sinne pääse.» Hän otti lapset syliinsä, pani kätensä heidän päälleen ja siunasi heitä.`,
  },
];

export const PUHE7: TextOption[] = [
  {
    id: 'puhe-1',
    label: '1. Hyvät omaiset',
    text: `Hyvät omaiset. Teitä on kohdannut suru, kun olette menettäneet läheisen ihmisen. Olemme nyt kokoontuneet saattamaan hänet hautaan. Ajattelemme häntä ja hänen elämäänsä. Muistamme kaikkea sitä hyvää ja turvallista, mitä hänessä ja hänen kauttaan olemme saaneet. Kiitollisuus ja kunnioitus täyttää meidän sydämemme.

Olemme Jumalan kasvojen edessä. Hän puhuu meille sanassaan. Me lähestymme häntä rukouksin. Suljemme poislähteneen ja teidät, surevat omaiset, hänen huomaansa. Rukoilemme Jumalalta apua surun tielle ja turvaudumme ylösnousseeseen Jeesukseen Kristukseen, joka on voittanut kuoleman.

Kuolema kuuluu ihmisen osaan. Uuden elämän syntyminen ja kuolema kulkevat rinnakkain tässä maailmassa. Koko luomakunta on katoavainen. Jokaisen meistä on kerran lähdettävä täältä. Kuolema on lopullinen ja tuntematon, ja siksi tunnemme pelkoa, kun ajattelemme sitä. Kuolema vie lähellämme eläneen ihmisen pois. Emme saa enää kuulla hänen ääntään, puhua hänen kanssaan emmekä kohdata hänen katsettaan. Emme voi osoittaa hänelle enää rakkauttamme ja huolenpitoamme. Kuolema katkaisee läheisimmätkin siteet.

Kuoleman edessä ymmärrämme, että meidän tulisi olla valmiita lähtemään. Jumalan sana kehottaa meitä panemaan turvamme ja toivomme Jeesukseen Kristukseen. Hän on sovittanut syntimme omalla kuolemallaan. Jumala on herättänyt hänet kuolleista ja valmistanut meille hänen kauttaan katoamattoman elämän. Jeesus sanoo: »Minä olen ylösnousemus ja elämä. Joka uskoo minuun, saa elää, vaikka kuoleekin.» (Joh. 11:25.)`,
  },
  {
    id: 'puhe-2',
    label: '2. Rakkaat ystävät',
    text: `Rakkaat ystävät. Olemme kokoontuneet saattamaan teille läheistä ihmistä. Koemme kipeästi, että katoavaisuus on osa meidän elämäämme. Sen tuuli puhaltaa ylitsemme. Te, omaiset, tunnette, kuinka suru on tullut teille todeksi. Olette joutuneet luopumaan rakkaasta ihmisestä. Kuolema on peruuttamaton, ja sen voima on meitä väkevämpi. Mutta Jumalan valta ulottuu kuolemankin yli. Me rukoilemme hänen läsnäoloaan suruunne ja voimaa tuleviin päiviin ja koko elämään. Hänen apunsa tulee lähelle myös niissä ihmisissä, joiden kanssa saatte jakaa murhettanne ja kaipaustanne.

Me kiitämme Jumalaa kaikesta siitä hyvästä, mitä NN on antanut meille elämällään.

Jokainen meistä kulkee kerran tiensä loppuun. Sanassaan Jumala kehottaa meitä ajattelemaan myös omaa kuolemaamme ja ikuisuutta. Kuoleman hetkeä emme tiedä, useimmiten se yllättää meidät. Mistä me pidämme kiinni, kun inhimilliset tuet katoavat ja meidän on kokonaan luovuttava tästä elämästä? Jumalassa ja hänen armossaan on vahva turva niin elämässä kuin kuolemassa. Vapahtajamme Kristus on kokenut myös ihmisen osan kaikkine kipuineen. Syntiemme sovittajana hän kuoli ristillä meidän jokaisen puolesta. Ylösnousseena hän kukisti kuoleman mahdin. Hän vakuuttaa: »Minä olen ylösnousemus ja elämä. Joka uskoo minuun, saa elää, vaikka kuoleekin.»`,
  },
];

// ─── SECTION 8: Uskontunnustus (fixed) ──────────────────────────────────────

export const USKONTUNNUSTUS = `S  Minä uskon Jumalaan,
\tIsään, Kaikkivaltiaaseen,
\ttaivaan ja maan Luojaan,

\tja Jeesukseen Kristukseen,
\tJumalan ainoaan Poikaan, meidän Herraamme,
\tjoka sikisi Pyhästä Hengestä,
\tsyntyi neitsyt Mariasta,
\tkärsi Pontius Pilatuksen aikana,
\tristiinnaulittiin, kuoli ja haudattiin,
\tastui alas tuonelaan,
\tnousi kolmantena päivänä kuolleista,
\tastui ylös taivaisiin,
\tistuu Jumalan, Isän, Kaikkivaltiaan, oikealla puolella
\tja on sieltä tuleva tuomitsemaan eläviä ja kuolleita,

\tja Pyhään Henkeen,
\tpyhän yhteisen seurakunnan,
\tpyhäin yhteyden,
\tsyntien anteeksiantamisen,
\truumiin ylösnousemisen
\tja iankaikkisen elämän.`;

// ─── SECTION 9: Siunaussanat ─────────────────────────────────────────────────

export const SIUNAUSSANAT_INTRO: TextOption[] = [
  {
    id: 'siun-intro-1',
    label: 'Ylösnousseeseen uskoen',
    text: `P  Ylösnousseeseen Jeesukseen Kristukseen uskoen nousemme toimittamaan NN:n (koko nimi) siunaamisen.`,
  },
  {
    id: 'siun-intro-2',
    label: 'Uskossa kolmiyhteiseen',
    text: `P  Uskossa kolmiyhteiseen Jumalaan siunaamme NN:n (koko nimi) odottamaan ylösnousemuksen päivää.`,
  },
];

export const SIUNAUSSANAT: TextOption[] = [
  {
    id: 'siun-1',
    label: 'Maasta olet tullut',
    text: `NN (etunimet),
maasta sinä olet tullut,
maaksi sinun pitää jälleen tulla.
Jeesus Kristus, Vapahtajamme, herättää sinut viimeisenä päivänä.`,
  },
  {
    id: 'siun-2',
    label: 'Maan tomua sinä olet',
    text: `NN (etunimet),
maan tomua sinä olet,
maan tomuun sinä palaat.
Jeesus Kristus, Vapahtajamme, herättää sinut viimeisenä päivänä.`,
  },
  {
    id: 'siun-3',
    label: 'Herra antoi, Herra otti',
    text: `NN (etunimet),
Herra antoi,
Herra otti.
Kiitetty olkoon Herran nimi.
Jeesus Kristus, Vapahtajamme, herättää sinut viimeisenä päivänä.`,
  },
  {
    id: 'siun-4',
    label: 'Katoavaisuudessa kylvetään',
    text: `Katoavaisuudessa kylvetään.
Katoamattomuudessa herätetään.
Jeesus Kristus on ylösnousemus ja elämä.`,
  },
  {
    id: 'siun-5',
    label: 'Pientä lasta / kuolleena syntynyttä',
    context: 'Kuolleena syntynyttä tai pientä lasta siunattaessa.',
    text: `[NN (etunimet),]
Jumala, Isämme, on sinut luonut.
Saat levätä hänen sylissään.
Jeesus Kristus, Vapahtajamme, herättää sinut viimeisenä päivänä.`,
  },
];

// ─── SECTION 11: Esirukous ───────────────────────────────────────────────────

export const ESIRUKOUKSET: TextOption[] = [
  {
    id: 'esiruk-1',
    label: '1. Pyhä Jumala',
    text: `P  Rukoilkaamme.

1. Pyhä Jumala. Sinä annoit ainoan Poikasi kärsiä ristinkuoleman meidän puolestamme. Hänen hautaamisellaan sinä pyhitit hautamme leposijaksi. Hänen ylösnousemisellaan sinä kukistit kuoleman ja avasit tien ikuiseen elämään. Sinun käsiisi jätämme poisnukkuneen rakkaamme NN:n. Herra, meidän oma matkamme on vielä kesken, ja tarvitsemme voimaa moniin tehtäviin. Siksi pyydämme: Auta meitä löytämään elävä yhteys Kristukseen. Poista pelkomme ja syyllisyytemme. Tue ja lohduta meitä surussamme. Rohkaise meitä elämään luottavaisin mielin ja hyvällä omallatunnolla. Auta, ettemme arjen huolten keskellä kadottaisi iankaikkista päämääräämme. Jumala, anna meille pääsiäisen ilo ja ylösnousemuksen toivo. Kuule meitä Jeesuksen Kristuksen, meidän Herramme tähden.

S  Aamen.`,
  },
  {
    id: 'esiruk-2',
    label: '2. Kaikkivaltias Jumala',
    text: `P  Rukoilkaamme.

2. Kaikkivaltias Jumala, sinä kuoleman voittaja. Olet antanut rakkaan Poikasi Jeesuksen Kristuksen meidän tähtemme ristiinnaulittavaksi ja herättänyt hänet kuolleista, jotta saisimme ikuisen elämän. Me rukoilemme sinua: Käännä kasvosi meidän puoleemme. Opeta muistamaan, ettei meillä ole täällä pysyvää asuinsijaa. Ole lähellä surevia ja lohduta heitä heidän kaipauksessaan. Auta meitä turvautumaan armoosi ja elämään tahtosi mukaan, niin että kerran saamme kaikkien uskoviesi kanssa nousta iankaikkiseen elämään. Kuule meitä Poikasi Jeesuksen Kristuksen, meidän Herramme tähden.

S  Aamen.`,
  },
  {
    id: 'esiruk-3',
    label: '3. Jumala, Isämme (iankaikkinen rauhasi)',
    text: `P  Rukoilkaamme.

3. Jumala, Isämme. Lahjoita NN:lle iäinen rauhasi rakkaan Poikasi Jeesuksen Kristuksen tähden. Anna ikuisen valosi loistaa hänelle. Ole hänelle armollinen ja anna iankaikkinen elämä. Uskollinen Herra ja Vapahtaja, sinä olet lunastanut hänet pyhällä ja kalliilla verelläsi. Vie hänet sisälle Jumalan kirkkauteen ja pyhiesi joukkoon nimesi tähden. Armahda myös meitä ja johdata elämän tiellä, jotta matkamme päättyisi hyvin ja pääsisimme vanhurskaiden ylösnousemukseen. Tätä pyydämme rakkautesi tähden.

S  Aamen.`,
  },
  {
    id: 'esiruk-4',
    label: '4. Laupias Jumala',
    text: `P  Rukoilkaamme.

4. Laupias Jumala. Sinä olet päästänyt palvelijasi NN:n elämän murheista ja taisteluista. Me kiitämme sinua armosta, jota olet osoittanut hänelle ja meille. Auta meitä käyttämään antamaasi aikaa oikein, niin että olisimme valmiit lähtemään täältä, kun sinä kutsut meitä. Lohduta surevia ja ole heidän turvanaan kärsimyksissä. Anna sen päivän koittaa, jolloin koko luomakunta pääsee katoavaisuuden orjuudesta Jumalan lasten vapauteen ja kirkkauteen. Kuule rukouksemme Jeesuksen Kristuksen, meidän Herramme tähden.

S  Aamen.`,
  },
  {
    id: 'esiruk-5',
    label: '5. Jumala, sinä olet asettanut rajat',
    text: `P  Rukoilkaamme.

5. Jumala, sinä olet asettanut elämällemme rajat. Yksin sinä tiedät, mikä on päiviemme määrä. Me kiitämme sinua NN:n elämästä, jonka olet vienyt päätökseen.

Herra, sinä näet, että kaipaus valtaa mielemme. Ole lähellä meitä ja häntä, jonka olet kutsunut pois. Tue askeleitamme surun tiellä. Anna meille luottamus siihen, että saamme sinulta avun ja voiman tuleviin päiviin.

Pyhä Jumala. Rakkautesi on väkevämpi kuin kuolema. Kiitos siitä, että annoit Jeesuksen meille Vapahtajaksi ja syntiemme sovitukseksi. Auta meitä turvautumaan anteeksiantamukseen. Anna meille se rauha, joka ylittää kaiken ymmärryksen. Kiinnitä sydämemme sanaasi ja opasta meitä ikuisen elämän tiellä. Kuule rukouksemme Jeesuksen Kristuksen, meidän Herramme tähden.

S  Aamen.`,
  },
  {
    id: 'esiruk-6',
    label: '6. Paljon kärsinyttä siunattaessa',
    context: 'Paljon kärsinyttä siunattaessa.',
    text: `P  Rukoilkaamme.

6. Jumala, taivaallinen Isä. Sinä pyyhit pois kyyneleet omiesi silmistä. Sinä tunnet NN:n elämän ja kärsimyksen. Anna hänelle luonasi ikuinen rauha ja lepo. Sinä tunnet nekin kysymykset, jotka ovat jääneet vastausta vaille. Opeta meitä jäämään kaikkine taakkoinemme sinun haltuusi ja kantamaan toistemme kuormia. Johdata meitä sillä tiellä, joka vie sinun luoksesi taivaan kirkkauteen. Tätä pyydämme Poikasi Jeesuksen Kristuksen, meidän Herramme tähden.

S  Aamen.`,
  },
  {
    id: 'esiruk-7',
    label: '7. Äkillisesti kuollutta siunattaessa',
    context: 'Äkillisesti kuollutta siunattaessa.',
    text: `P  Rukoilkaamme.

7. Kaikkivaltias Jumala. Olemme edessäsi hämmentyneinä emmekä ymmärrä, mitä on tapahtunut. Sinä tunnet ahdistuksemme ja tiedät, mitä tarvitsemme. Anna Vapahtajamme kärsimisen, kuoleman ja ylösnousemisen olla meidän turvamme, toivomme ja lohdutuksemme. Anna meille voimaa NN:n äkillisen kuoleman edessä. Kiitämme sinua kaikesta siitä hyvästä, jota hänen kauttaan saimme. Me jätämme hänet sinun käsiisi ja rukoilemme: Ole lähellä omaisia heidän surussaan. Anna meidän kohdata toisemme sinun luonasi taivaassa. Kuule meitä rakkaan Poikasi Jeesuksen Kristuksen tähden.

S  Aamen.`,
  },
  {
    id: 'esiruk-8',
    label: '8. Väkivallan uhria siunattaessa',
    context: 'Väkivallan uhria siunattaessa.',
    text: `P  Rukoilkaamme.

8. Laupias Jumala. Sinä näet tuskamme ja murheemme. Ole kanssamme ja hoida kipuamme. Lohduta meitä läsnäolollasi ja anna voimaa elää ja kestää suru. Auta meitä rakkauteesi luottaen voittamaan viha ja antamaan anteeksi. Kiitos, että kuulet ja ymmärrät huutomme. Me tahdomme antaa kaiken tuskan, katkeruuden ja kärsimyksen ja koko elämämme sinun käsiisi. Lahjoita NN:lle ikuinen rauha. Anna meille rauhasi ja elämällemme tarkoitus. Kuule meitä rakkaan Poikasi Jeesuksen Kristuksen tähden.

S  Aamen.`,
  },
  {
    id: 'esiruk-9',
    label: '9. Itsemurhan tehnyttä siunattaessa',
    context: 'Itsemurhan tehnyttä siunattaessa.',
    text: `P  Rukoilkaamme.

9. Armollinen Jumala. Murheemme syvyydestä me rukoilemme sinua. Ole tuskassamme meitä lähellä. Ainoastaan sinä tunnet NN:n elämän ja kuoleman. Uskomme hänet armosi huomaan. Sinä tiedät, miten raskasta elämä voi olla. Sinä tunnet meidän sisimpämme ja ajatuksemme. Kanna meitä surussamme ja anna meille rauhasi, joka ylittää kaiken ymmärryksen. Me turvaudumme Jeesukseen Kristukseen, Vapahtajaamme.

S  Aamen.`,
  },
  {
    id: 'esiruk-10',
    label: '10. Kuolleena syntynyttä siunattaessa',
    context: 'Kuolleena syntynyttä siunattaessa.',
    text: `P  Rukoilkaamme.

10. Armollinen Jumala. Me emme ymmärrä, miksi tämä pieni lapsi ei saanut syntyä elävänä keskellemme. Uskomme kuitenkin, että hän on sinun ja enkeleittesi luona turvassa. Laskemme hänet isälliseen syliisi Jeesuksen lunastustyöhön luottaen. Ole lähellä NN:ää ja NN:ää (vanhempien nimet), koko perhettä, isovanhempia ja kaikkia omaisia heidän surussaan. Lohduta heitä, kun kipeät kysymykset valtaavat mielen. Anna voimia tuleviin päiviin. Kuule meitä Poikasi Jeesuksen Kristuksen tähden.

S  Aamen.`,
  },
  {
    id: 'esiruk-11',
    label: '11. Pientä lasta siunattaessa',
    context: 'Pientä lasta siunattaessa.',
    text: `P  Rukoilkaamme.

11. Armollinen Jumala. Sinä näet surumme, pettymyksemme ja tyhjyyden tunteemme pienen NN:n arkun äärellä. Ole meidän lähellämme ja varjele sydämemme ja ajatuksemme. Hoida meitä armollasi ja rakkaudellasi. Me kiitämme sinua NN:n elämästä ja kaikesta mitä hän toi meille. Ole luonamme, kun meidän on luovuttava tästä lapsesta. Ota hänet syliisi ja vie hänet taivaan kotiin. Johdata meidät kaikki kerran luoksesi Jeesuksen Kristuksen, rakkaan Poikasi tähden.

S  Aamen.`,
  },
  {
    id: 'esiruk-12',
    label: '12. Lasta siunattaessa',
    context: 'Lasta siunattaessa.',
    text: `P  Rukoilkaamme.

12. Rakas taivaallinen Isä. Murhe täyttää sydämemme NN:n arkun äärellä. Sinä annoit meille hänet, sinä otit hänet pois. Opeta meitä luottamaan sinuun. Kiitos siitä, että saimme pitää lapsen keskellämme hänen lyhyen elinaikansa. Ota hänet turvaan enkeliesi luokse. Ole NN:n ja NN:n (vanhempien nimet), koko perheen, isovanhempien ja kaikkien surevien turvana. Anna heille voimaa kestää kipeä suru. Johdata meitä kaikkia taivaan kotiin Vapahtajamme Jeesuksen Kristuksen kautta.

S  Aamen.`,
  },
  {
    id: 'esiruk-13',
    label: '13. Nuorta siunattaessa',
    context: 'Nuorta siunattaessa.',
    text: `P  Rukoilkaamme.

13. Jumala, me emme käsitä, miksi NN:n elämä jäi näin lyhyeksi. Elämän katoavaisuus on pysäyttänyt meidät. Surun keskellä tahdomme luottaa sinuun ja rukoilemme: ole läsnä kaipauksessamme. Me kiitämme sinua kaikesta hyvästä ja kauniista, mitä hänessä saimme. Ole lähellä NN:ää ja NN:ää (vanhempien nimet), koko perhettä, isovanhempia ja kaikkia omaisia sekä ystäviä heidän surussaan. Me ylistämme sinua pyhän kasteen lahjasta, kiitämme armostasi, joka antaa meille turvan ja kantaa yli kuoleman rajan. Tässä toivossa jätämme hänet sinun käsiisi. Me turvaudumme Jeesukseen Kristukseen, joka on ylösnousemus ja elämä.

S  Aamen.`,
  },
  {
    id: 'esiruk-14',
    label: '14. Vanhusta siunattaessa',
    context: 'Vanhusta siunattaessa.',
    text: `P  Rukoilkaamme.

14. Laupias Jumala. Olet antanut NN:lle pitkän elämän ja kutsunut hänet pois ajan vaivoista. Anna hänelle ikuinen lepo. Me kiitämme sinua kaikesta hyvästä, jota saimme hänen kauttaan. Opeta meitä rakentamaan elämämme sanasi varaan ja etsimään sitä, mikä on hyvää, oikeaa ja kestävää. Auta meitä turvautumaan armoosi ja elämään tahtosi mukaan, niin että kerran pääsemme luoksesi ja saamme kohdata läheisemme ja sinut taivaan kodissa. Kuule meitä Poikasi Jeesuksen Kristuksen, meidän Herramme tähden.

S  Aamen.`,
  },
  {
    id: 'esiruk-15',
    label: '15. Vanhusta siunattaessa (kypsää viljaa)',
    context: 'Vanhusta siunattaessa.',
    text: `P  Rukoilkaamme.

15. Jumala, Isämme. Sinä annoit NN:lle pitkän elämän. Olet korjannut pois kypsää viljaa. Ota hänet lepoosi. Me kiitämme siitä, että annoit hänelle lahjojasi tätä elämää ja tulevaa varten. Kiitos siitä, että saimme tuntea hänen kanssaan yhteyttä, joka ulottuu sukupolvien yli. Anna meidän oppia siitä, mikä hänen elämässään oli kaunista ja arvokasta. Auta meitä uskossa ja toivossa kulkemaan tietä, joka vie ikuiseen rauhaan ja kirkkauteen. Kiitos taivaan kodista, jossa sukupolvet saavat kohdata toisensa. Kuule meitä Poikasi Jeesuksen Kristuksen, meidän Herramme tähden.

S  Aamen.`,
  },
];

// ─── SECTION 12: Isä meidän (fixed) ─────────────────────────────────────────

export const ISA_MEIDAN = `S  Isä meidän, joka olet taivaissa.
Pyhitetty olkoon sinun nimesi.
Tulkoon sinun valtakuntasi.
Tapahtukoon sinun tahtosi,
myös maan päällä niin kuin taivaassa.
Anna meille tänä päivänä meidän jokapäiväinen leipämme.
Ja anna meille meidän syntimme anteeksi,
niin kuin mekin anteeksi annamme niille,
jotka ovat meitä vastaan rikkoneet.
Äläkä saata meitä kiusaukseen,
vaan päästä meidät pahasta.
Sillä sinun on valtakunta ja voima ja kunnia iankaikkisesti.
Aamen.`;

// ─── SECTION 13: Siunaus (fixed) ─────────────────────────────────────────────

export const SIUNAUS13 = `P  Herra siunatkoon teitä ja varjelkoon teitä.
Herra kirkastakoon kasvonsa teille
ja olkoon teille armollinen.
Herra kääntäköön kasvonsa teidän puoleenne
ja antakoon teille rauhan.
Isän ja ✝ Pojan ja Pyhän Hengen nimeen.
S  Aamen.`;

// ─── SECTION 15: Rukous haudalla ─────────────────────────────────────────────

export const RUKOUS_HAUDALLA: TextOption[] = [
  {
    id: 'haud-1',
    label: '1. Sinä pyhitit hautamme',
    text: `P  Rukoilkaamme.

1. Kaikkivaltias Jumala, taivaallinen Isä. Sinä annoit ainoan Poikasi kärsiä ristinkuoleman meidän puolestamme. Hänet haudattiin, ja niin sinä pyhitit meidänkin hautamme lepopaikaksi. Me rukoilemme: Valmista Pyhällä Hengelläsi sydämemme Poikasi asuinsijaksi, jotta hän pysyisi meissä ja me hänessä. Anna meidän ristin ja vaivan jälkeen päästä rauhaan ja nousta viimeisenä päivänä ikuiseen elämään. Kuule meitä Poikasi Jeesuksen Kristuksen, meidän Herramme tähden.

S  Aamen.`,
  },
  {
    id: 'haud-2',
    label: '2. Uskomme NN:n sinun käsiisi',
    text: `P  Rukoilkaamme.

2. Rakas taivaallinen Isä. Uskomme NN:n sinun käsiisi. Laskemme hänen ruumiinsa haudan lepoon odottamaan ylösnousemuksen ja uuden luomisen aamua. Vapahtajamme kuoli ja hänet haudattiin, ja niin sinä pyhitit meidänkin hautamme leposijaksi. Sinä herätit hänet kuolleista, kukistit kuoleman ja avasit taivaan uskoville.

Jeesus Kristus, Vapahtajamme. Sinuun me nostamme katseemme. Armahda meitä ja anna meille elävä toivo. Vie meidät ylösnousemukseen ja ikuiseen elämään. Kuule meitä rakkautesi tähden.

S  Aamen.`,
  },
  {
    id: 'haud-3',
    label: '3. Poikasi lepäsi haudassa',
    text: `P  Rukoilkaamme.

3. Taivaallinen Isä, auta meitä muistamaan, että Poikasi lepäsi haudassa. Anna meidänkin kuoltuamme levätä turvallisesti ja odottaa uutta elämää. Ota meiltä pois pelko ja opeta luottamaan siihen, että Jeesuksen tähden saamme kuoleman ja haudan kautta käydä taivaalliseen valtakuntaasi. Kuule meitä Poikasi Jeesuksen Kristuksen, meidän Herramme tähden.

S  Aamen.`,
  },
];
