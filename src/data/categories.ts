export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  badge?: string;
  image: string;
  itemCount: number;
  highlightPoints: string[];
}

export const CATEGORIES: ProductCategory[] = [
  {
    id: "promo-tekstil",
    slug: "promo-tekstil",
    name: "Promo tekstil",
    shortDesc: "Majice, polo majice, softshell jakne, puloverji in kape z vezenjem ali tiskom po meri.",
    longDesc: "Promocijski tekstil je temelj vsake močne blagovne znamke. Naša ponudba obsega kakovostna oblačila iz organskega bombaža, tehničnih materialov in recikliranih tkanin s certifikati OEKO-TEX® in GOTS. Primeren je za delovna oblačila, team buildinge ter prepoznavnost na dogodkih.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    itemCount: 12,
    highlightPoints: [
      "Certificiran organski bombaž in reciklirana vlakna",
      "Vrhunsko vezenje in trpežen sitotisk / DTF",
      "Široka paleta poslovnih barv in velikosti od XS do 5XL",
    ],
  },
  {
    id: "torbe-in-potovanja",
    slug: "torbe-in-potovanja",
    name: "Torbe in potovanja",
    shortDesc: "Eko nakupovalne vrečke, nahrbtniki za prenosnike, športne in potovalne torbe ter toaletke.",
    longDesc: "Praktične torbe in nahrbtniki ponujajo izjemno veliko površino za odtis vašega logotipa in zagotavljajo dolgoletno vsakodnevno vidnost. Izbirajte med recikliranim platnom (rPET), juto in modernimi vodoodbojnimi poslovnimi nahrbtniki.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    itemCount: 10,
    highlightPoints: [
      "Visoka nosilnost in ojačani šivi",
      "Pametni razdelki za prenosnike in polnilnike",
      "Ekološki rPET materiali in organsko platno",
    ],
  },
  {
    id: "pisalni-pripomocki",
    slug: "pisalni-pripomocki",
    name: "Pisalni pripomočki",
    shortDesc: "Kovinska pisala z lasersko gravuro, eko kemični svinčniki, darilni seti in notesniki.",
    longDesc: "Pisalni pripomočki ostajajo nepogrešljiv in najbolj stroškovno učinkovit promocijski artikel za sejme, konference, pisarne ter poslovna darila. Nudimo od ugodnih eko pisal iz pšenične slame do prestižnih kovinskih setov.",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
    itemCount: 10,
    highlightPoints: [
      "Natančna in neuničljiva laserska gravura",
      "Kakovostna nemška polnila z gladkim tekom",
      "Eko materiali: recikliran papir, bambus in kovina",
    ],
  },
  {
    id: "mobile-and-tech",
    slug: "mobile-and-tech",
    name: "Mobile & Tech",
    shortDesc: "Powerbank baterije, brezžični polnilci, Bluetooth zvočniki, slušalke in USB ključki.",
    longDesc: "Sodobni tehnološki pripomočki navdušijo vsakega sodobnega partnerja in zaposlenega. Vsi naši izdelki ustrezajo strogim evropskim varnostnim standardom (CE, RoHS) ter vključujejo zaščito pred pregrevanjem in prenapetostjo.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    itemCount: 10,
    highlightPoints: [
      "Varno CE in RoHS certificirano jedro z garancijo",
      "Možnost LED svetlobnega logotipa ob uporabi",
      "Elegantno ohišje iz bambusa ali recikliranega aluminija",
    ],
  },
  {
    id: "dom-in-zivljenje",
    slug: "dom-in-zivljenje",
    name: "Dom in življenje",
    shortDesc: "Termovke, stekleničke za vodo, keramične skodelice, predpasniki, dežniki in wellness seti.",
    longDesc: "Izdelki za vsakdanjo rabo doma in v pisarni ustvarjajo pristno čustveno vez z vašo znamko. Priljubljene termo steklenice ohranjajo pijačo toplo 12h ali hladno 24h, odporne skodelice pa krasijo mize vaših partnerjev.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    itemCount: 10,
    highlightPoints: [
      "Nerjaveče jeklo brez BPA in škodljivih primesi",
      "Primerno za pomivalni stroj in vsakodnevno rabo",
      "Odlična darila za zdrav življenjski slog zaposlenih",
    ],
  },
  {
    id: "outlet-shop",
    slug: "outlet-shop",
    name: "Outlet Shop",
    shortDesc: "Izbrani promocijski izdelki po ugodnejših cenah, primerni za hitrejša naročila in manjše količine.",
    longDesc: "Outlet ponudba Agencije Zajček prinaša preverjene promocijske artikle iz preteklih zalog po občutno znižanih cenah. Idealno za hitre marketinške akcije, prireditve z omejenim proračunom ali hitro dopolnitev promocijskega gradiva.",
    badge: "Ugodne cene & Hitra dobava",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
    itemCount: 10,
    highlightPoints: [
      "Takojšnja dobava s skladišča v Ljubljani",
      "Nižje minimalne količine naročila",
      "Preverjena kakovost z možnostjo hitrega dotiska",
    ],
  },
];
