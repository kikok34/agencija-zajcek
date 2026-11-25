export interface Catalog {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  coverImage: string;
  shortDesc: string;
  fullIntro: string;
  itemCount: string;
  pages: number;
  year: string;
  badge?: string;
  featuredProductIds: string[];
  pdfSimPages: {
    pageNumber: number;
    title: string;
    section: string;
    previewSummary: string;
  }[];
}

export const CATALOGS: Catalog[] = [
  {
    id: "kat-promo-tekstil",
    slug: "promo-tekstil",
    title: "Katalog Promo Tekstil 2026",
    categorySlug: "promo-tekstil",
    coverImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Vrhunska oblačila za podjetja: organske T-shirt majice, polo majice, softshell jakne in kape z vezenjem.",
    fullIntro: "Preglejte naš celovit katalog promocijskega tekstila 2026. Vsa oblačila so izbrana za popoln nanos vezenja, sitotiska ali DTF tehnike. Na voljo so modeli priznanih evropskih tekstilnih proizvajalcev z visoko gramaturo in ekološkimi certifikati.",
    itemCount: "148 izdelkov",
    pages: 68,
    year: "Kolekcija 2026",
    badge: "Bestseller",
    featuredProductIds: ["tek-01", "tek-02", "tek-03", "tek-04", "tek-05"],
    pdfSimPages: [
      { pageNumber: 1, title: "Naslovnica & Pregled kolekcije 2026", section: "Uvod", previewSummary: "Predstavitev novih organskih linij in barvnih kart Pantone 2026." },
      { pageNumber: 2, title: "Eko majice s kratkimi rokavi 180g", section: "Majice", previewSummary: "100% organski česani bombaž, unisex in ženski kroji." },
      { pageNumber: 3, title: "Poslovne polo majice Pique", section: "Polo program", previewSummary: "Trpežni ovratniki, ojačani šivi in možnost natančnega vezenja logotipa." },
      { pageNumber: 4, title: "Softshell jakne in brezrokavniki", section: "Jakne & Jakne", previewSummary: "3-slojna membrana z zračno podlogo, vetrna in vodna zaščita 8000 mm." },
      { pageNumber: 5, title: "Kape s šiltom in zimske pletenine", section: "Dodatki", previewSummary: "Recikliran bombaž, kovinske zaponke in 3D reliefno vezenje." },
      { pageNumber: 6, title: "Tehnične smernice za tisk in vezenje", section: "Specifikacije", previewSummary: "Maksimalne dimenzije tiska, priprava vektorskih datotek in vzdrževanje." },
    ],
  },
  {
    id: "kat-torbe-in-potovanja",
    slug: "torbe-in-potovanja",
    title: "Katalog Torbe & Potovanja 2026",
    categorySlug: "torbe-in-potovanja",
    coverImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Vrečke iz organskega bombaža, poslovni nahrbtniki s predalom za prenosnik ter potovalni kovčki.",
    fullIntro: "Odkrijte praktične promocijske torbe z največjo vidnostjo vaše znamke. V katalogu boste našli ekološke nakupovalne vrečke, prestižne poslovne nahrbtnike z RFID zaščito in športne potovalne torbe.",
    itemCount: "96 izdelkov",
    pages: 48,
    year: "Kolekcija 2026",
    featuredProductIds: ["bag-01", "bag-02", "bag-03", "bag-04"],
    pdfSimPages: [
      { pageNumber: 1, title: "Naslovnica & Trajnostni materiali rPET", section: "Uvod", previewSummary: "Trajnostne smernice in certifikati recikliranih tkanin." },
      { pageNumber: 2, title: "Bombažne in Canvas nakupovalne vrečke", section: "Eko vrečke", previewSummary: "Dolgi ročaji, ojačani križni šivi in gramature od 140g do 320g." },
      { pageNumber: 3, title: "Poslovni nahrbtniki za prenosnike 15.6\"", section: "Nahrbtniki", previewSummary: "Ergonomsko oblazinjenje, USB izhod ter predal z varno zadrgo." },
      { pageNumber: 4, title: "Športne in vikend potovalne torbe", section: "Potovanja", previewSummary: "Vodoodbojni materiali, ločen predal za obutev in ramenski pas." },
      { pageNumber: 5, title: "Toaletne torbice in organizatorji", section: "Dodatki", previewSummary: "Kompaktne torbice za poslovna potovanja z možnostjo laserskega graviranja ploščice." },
    ],
  },
  {
    id: "kat-pisalni-pripomocki",
    slug: "pisalni-pripomocki",
    title: "Katalog Pisalni Pripomočki 2026",
    categorySlug: "pisalni-pripomocki",
    coverImage: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Kovinska pisala z lasersko gravuro, bambusova pisala, eko kemiki in elegantni notesniki.",
    fullIntro: "Pisalni pripomočki so klasično, a vedno zaželeno poslovno darilo. V katalogu predstavljamo bogato izbiro od cenovno ugodnih promocijskih pisal za masovne dogodke do vrhunskih kovinskih peres z nemškimi polnili Dokumental®.",
    itemCount: "112 izdelkov",
    pages: 52,
    year: "Kolekcija 2026",
    badge: "Visoka konverzija",
    featuredProductIds: ["pen-01", "pen-02", "pen-03", "pen-04"],
    pdfSimPages: [
      { pageNumber: 1, title: "Pregled pisalnih mehanizmov in polnil", section: "Uvod", previewSummary: "Razlika med krogličnimi peresi, rolerji in črnilnimi peresi." },
      { pageNumber: 2, title: "Kovinska pisala s precizno lasersko gravuro", section: "Kovina & Lux", previewSummary: "Mat eloksiran aluminij, gumiran 'soft-touch' zaključek in gravura." },
      { pageNumber: 3, title: "Eko pisala iz bambusa in pšeničnih vlaken", section: "Eko linija", previewSummary: "Biorazgradljiva ohišja, trajnostna embalaža in tampotisk." },
      { pageNumber: 4, title: "Poslovni notesniki A5 s trdo vezavo", section: "Notesniki", previewSummary: "FSC papir, elastični trak, držalo za pisalo in žep na zadnji strani." },
      { pageNumber: 5, title: "Darilni seti: pisalo + notesnik v embalaži", section: "Darilni seti", previewSummary: "Usklajeni seti v darilni škatlici z magnetnim zapiranjem." },
    ],
  },
  {
    id: "kat-mobile-and-tech",
    slug: "mobile-and-tech",
    title: "Katalog Mobile & Tech 2026",
    categorySlug: "mobile-and-tech",
    coverImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Brezžični polnilci Qi, zmogljive powerbank baterije, zvočniki Bluetooth in USB spomini.",
    fullIntro: "Tehnološki pripomočki spadajo med najbolj cenjena poslovna darila z visoko uporabno vrednostjo. Vsi izdelki v katalogu imajo ustrezne certifikate EU o varnosti (CE, RoHS, FCC) ter preizkušene baterijske celice z dolgo življenjsko dobo.",
    itemCount: "84 izdelkov",
    pages: 44,
    year: "Kolekcija 2026",
    badge: "Inovativno",
    featuredProductIds: ["tech-01", "tech-02", "tech-03", "tech-04"],
    pdfSimPages: [
      { pageNumber: 1, title: "Varnostni certifikati in baterijska tehnologija", section: "Uvod", previewSummary: "Litij-polimer celice z zaščito pred prenapolnjenostjo." },
      { pageNumber: 2, title: "Brezžični polnilci Qi 15W s hitrim polnjenjem", section: "Polnilci", previewSummary: "Bambusove in reciklirane aluminijaste polnilne plošče s svetlobnim logotipom." },
      { pageNumber: 3, title: "Powerbank baterije 5.000 mAh do 20.000 mAh", section: "Baterije", previewSummary: "Kompaktne baterije z USB-C vhodom/izhodom in digitalnim indikatorjem." },
      { pageNumber: 4, title: "Bluetooth prenosni zvočniki in slušalke", section: "Audio", previewSummary: "TWS brezžične slušalke z ANC in vodoodporni zvočniki z IPX5 zaščito." },
      { pageNumber: 5, title: "USB ključki USB 3.0 s kovinskim ohišjem", section: "Pomnilniki", previewSummary: "Kapacitete 16GB, 32GB, 64GB in hitri prenos podatkov." },
    ],
  },
  {
    id: "kat-dom-in-zivljenje",
    slug: "dom-in-zivljenje",
    title: "Katalog Dom & Življenje 2026",
    categorySlug: "dom-in-zivljenje",
    coverImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Termovke iz nerjavečega jekla, keramične skodelice, eko dežniki in oprema za prosti čas.",
    fullIntro: "Ustvarite trajno prisotnost v vsakdanu vaših poslovnih partnerjev in zaposlenih. Ponujamo vrhunske termo posode, stekleničke za šport in pisarno ter visokokakovostne avtomatske dežnike, ki kljubujejo vetru.",
    itemCount: "92 izdelkov",
    pages: 46,
    year: "Kolekcija 2026",
    featuredProductIds: ["home-01", "home-02", "home-03", "home-04"],
    pdfSimPages: [
      { pageNumber: 1, title: "Ekologija in zdrava hidracija", section: "Uvod", previewSummary: "Uporaba 100% materialov brez BPA in ftalatov." },
      { pageNumber: 2, title: "Termo steklenice z dvojno vakuumsko steno", section: "Hidracija", previewSummary: "12h toplo / 24h hladno z neprepustnim navojnim pokrovčkom." },
      { pageNumber: 3, title: "Keramične in emajlirane skodelice za kavo", section: "Skodelice", previewSummary: "Mat in sijaj zaključek, primeren za tampotisk in peko logotipa." },
      { pageNumber: 4, title: "Storm-proof poslovni dežniki z avtomatiko", section: "Dežniki", previewSummary: "Kovinsko ogrodje s steklenimi vlakni, odporno na močne sunke vetra." },
      { pageNumber: 5, title: "Kuhinjski in piknik seti iz naravnih materialov", section: "Kuhinja", previewSummary: "Deske za rezanje iz bambusa z vgraviranim logotipom podjetja." },
    ],
  },
  {
    id: "kat-outlet-shop",
    slug: "outlet-shop",
    title: "Katalog Outlet & Hitra Zaloga 2026",
    categorySlug: "outlet-shop",
    coverImage: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Zadnji kosi in posebne zaloge po znižanih cenah — takojšnja dobava iz skladišča v Sloveniji.",
    fullIntro: "Outlet katalog vsebuje artikle z zagotovljeno takojšnjo dobavo in ugodnimi cenami. Popolna izbira za nujne promocijske dogodke, dopolnitev paketov ali projekte z manjšim proračunom.",
    itemCount: "65 izdelkov",
    pages: 32,
    year: "Kolekcija 2026",
    badge: "Do -45% popust",
    featuredProductIds: ["out-01", "out-02", "out-03", "out-04"],
    pdfSimPages: [
      { pageNumber: 1, title: "Pravila outlet naročil in zaloge", section: "Uvod", previewSummary: "Garancija na kakovost in pogoji takojšnje odpreme." },
      { pageNumber: 2, title: "Outlet tekstil: T-shirt majice in kape", section: "Tekstil Outlet", previewSummary: "Omejene serije v priljubljenih barvah s popusti do 40%." },
      { pageNumber: 3, title: "Outlet pisala in pisarniški pripomočki", section: "Pisala Outlet", previewSummary: "Pakiranja po 100 kosov z možnostjo hitrega enobarvnega tiska." },
      { pageNumber: 4, title: "Outlet torbe in promocijske vrečke", section: "Torbe Outlet", previewSummary: "Praktične torbe iz zaloge za hitre konference in sejme." },
    ],
  },
];
