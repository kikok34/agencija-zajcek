export interface GiftPack {
  id: string;
  title: string;
  subtitle: string;
  shortDesc: string;
  suggestedQty: string;
  priceEstimate: string;
  deliveryTime: string;
  image: string;
  badge?: string;
  items: {
    name: string;
    description: string;
    icon: string;
  }[];
  packaging: string;
  benefits: string[];
}

export const GIFT_PACKS: GiftPack[] = [
  {
    id: "welcome-pack-zaposleni",
    title: "Welcome pack za nove zaposlene",
    subtitle: "Navdušite novonastale člane vaše ekipe že prvi delovni dan",
    shortDesc: "Premišljeno sestavljen onboarding komplet, ki krepi pripadnost podjetju, motivira novozaposlene in ustvari nepozaben prvi vtis ob začetku skupne poti.",
    suggestedQty: "že od 20 kompletov naprej",
    priceEstimate: "od 28,50 € / komplet",
    deliveryTime: "5–8 delovnih dni",
    badge: "Najbolj priljubljeno pri HR",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    items: [
      {
        name: "Kakovostna bombažna hoodie jopica",
        description: "Udoben kroj, 300g česani organski bombaž z izvezenim logotipom na prsih.",
        icon: "Shirt",
      },
      {
        name: "Vakuumska termo steklenica 500ml",
        description: "Iz nerjavečega jekla z lasersko gravuro imena podjetja ali zaposlenega.",
        icon: "CupSoda",
      },
      {
        name: "Ekskluzivni A5 notesnik s trdimi platnicami",
        description: "FSC certificiran papir z elastiko, zanko za pero in slepim tiskom logotipa.",
        icon: "BookOpen",
      },
      {
        name: "Kovinsko pisalo s 'soft-touch' prevleko",
        description: "Precizna laserska gravura in gladko tekoče modro polnilo za vsakodnevno pisanje.",
        icon: "PenTool",
      },
      {
        name: "Kompakten USB ključ 32GB z vsebino",
        description: "Kovinsko ohišje z možnostjo prednaložitve internih onboarding dokumentov.",
        icon: "HardDrive",
      },
    ],
    packaging: "Prestižna črna ali kraft darilna škatla s personalizirano dobrodošlico in trakom.",
    benefits: [
      "Večja pripadnost in motivacija novih talentov",
      "Hitra priprava in možnost hranjenja zaloge za nova zaposlovanja",
      "Personalizacija z imenom posameznega zaposlenega",
    ],
  },
  {
    id: "darila-za-sejme-in-dogodke",
    title: "Darila za sejme in dogodke",
    subtitle: "Maksimalna vidnost in opazen odtis na sejmih, festivalih in konferencah",
    shortDesc: "Stroškovno učinkovit promocijski paket, ustvarjen za pritegovanje obiskovalcev vašega razstavnega prostora ter dolgotrajno prepoznavnost vaše blagovne znamke.",
    suggestedQty: "priporočeno 100 do 500+ kosov",
    priceEstimate: "od 5,80 € / komplet",
    deliveryTime: "4–7 delovnih dni",
    badge: "Odlična B2B vidnost",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    items: [
      {
        name: "Eko bombažna nosilna vrečka Canvas 220g",
        description: "Dolgi ročaji, ojačani šivi in obojestranski barvni sitotisk logotipa.",
        icon: "ShoppingBag",
      },
      {
        name: "Eko kemični svinčnik iz bambusa ali pšenične slame",
        description: "Udoben oprijem, okolju prijazen material ter barvni tampotisk.",
        icon: "PenTool",
      },
      {
        name: "Tekstilni trak za ključe in akreditacije (lanyard)",
        description: "Z varnostno vratno zaponko, kovinsko karabinko in sublimacijskim potiskom.",
        icon: "Tag",
      },
      {
        name: "Osvežilni mint bonboni v kovinski škatlici",
        description: "Kompaktna žepna embalaža z digitalnim tiskom logotipa na pokrovu.",
        icon: "Sparkles",
      },
    ],
    packaging: "Praktično vstavljeno neposredno v potiskano platneno vrečko za takojšnjo razdelitev.",
    benefits: [
      "Visoka uporabna vrednost med samim sejmom in po njem",
      "Izjemno ugodna cena na kontakt (nizek CPM)",
      "Ekološka nota, ki krepi ugled družbeno odgovornega podjetja",
    ],
  },
  {
    id: "poslovna-darila-za-stranke",
    title: "Poslovna darila za stranke",
    subtitle: "Utrdite ključna poslovna partnerstva z darilom vrhunske kakovosti",
    shortDesc: "Prefinjena darilna kombinacija za zaključek poslovnega leta, jubileje, sklenitev pogodb ali zahvalo vašim najpomembnejšim strankam in dobaviteljem.",
    suggestedQty: "že od 15 kompletov naprej",
    priceEstimate: "od 39,00 € / komplet",
    deliveryTime: "5–9 delovnih dni",
    badge: "Ekskluzivni nivo",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    items: [
      {
        name: "Vrhunski avtomatski 'wind-proof' dežnik",
        description: "Ogrodje iz steklenih vlaken, ročaj iz naravnega lesa in subtilna gravura.",
        icon: "Umbrella",
      },
      {
        name: "Dvojnostenska termo skodelica z vakuumsko izolacijo",
        description: "Ohranja temperaturo kave 6 ur, eleganten mat premaz in laserska gravura.",
        icon: "Coffee",
      },
      {
        name: "Luksuzen usnjen notesnik s srebrno obrobo listov",
        description: "Z žepom za vizitke, zaznamovalnim trakom in diskretnim suhim žigom.",
        icon: "BookOpen",
      },
      {
        name: "Kovinsko težko pisalo z vrtljivim mehanizmom",
        description: "Premijski roler z graviranim motivom v samostojnem etuiju.",
        icon: "PenTool",
      },
    ],
    packaging: "Prestižna darilna embalaža z vložkom po meri, svilenim polnilom in personalizirano kartico z zahvalo.",
    benefits: [
      "Prikazuje spoštovanje in dolgoročno zavezanost partnerstvu",
      "Luksuzni materiali, ki trajajo leta",
      "Možnost diskretne personalizacije s posvetilom direktorja",
    ],
  },
];
