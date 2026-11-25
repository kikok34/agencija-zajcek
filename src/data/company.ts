export interface FAQItem {
  question: string;
  answer: string;
}

export const COMPANY_INFO = {
  name: "Agencija Zajček",
  tagline: "poslovna darila in promocijski material",
  description: "Specializirana B2B agencija za promocijski material, poslovna darila, tekstil z vezenjem ali tiskom ter celovite rešitve za grajenje prepoznavnosti vaše blagovne znamke.",
  phone: "+386 41 947 065",
  phoneDisplay: "041 947 065",
  email: "info@agencija-zajcek.net",
  address: {
    street: "Dunajska cesta 114",
    city: "Ljubljana",
    postalCode: "1000",
    country: "Slovenija",
  },
  workingHours: "Pon – Pet: 08:00 – 16:30",
  idVat: "SI84920184",
  stats: [
    { label: "Več kot 10 let izkušenj", sub: "Preizkušen partner vodilnih podjetij" },
    { label: "Tisk in personalizacija po meri", sub: "Laserska gravura, vezava, sitotisk in DTF" },
    { label: "Svetovanje in hitra ponudba", sub: "Odziv v 24 urah z brezplačnim predogledom" },
    { label: "Zanesljiva dobava", sub: "Hitri roki in preverjena kakovost v EU" },
  ],
  whyUs: [
    {
      title: "Hitre in natančne ponudbe",
      description: "Razumemo časovni pritisk projektov. Ponudbo z vizualnim predogledom vam pripravimo v manj kot 24 urah.",
      icon: "Clock",
    },
    {
      title: "Strokovno svetovanje pri izbiri",
      description: "Ne prodajamo le izdelkov — svetujemo optimalen material, barve in tehniko dodelave glede na vaš proračun.",
      icon: "Users",
    },
    {
      title: "Možnost vrhunskega tiska in vezave",
      description: "Lastni in preizkušeni tiskarski obrati zagotavljajo obstojnost, barvno ujemanje po Pantone lestvici in popolne detajle.",
      icon: "Sparkles",
    },
    {
      title: "Outlet in ugodnejše rešitve",
      description: "Za hitre akcije in manjše količine ponujamo bogat outlet nabor izdelkov na zalogi po ugodnih cenah.",
      icon: "BadgePercent",
    },
    {
      title: "Lokalna podpora v Sloveniji",
      description: "Osebni skrbnik naročila v Ljubljani, možnost ogleda vzorcev v živo in varno pakiranje do vaših vrat.",
      icon: "MapPin",
    },
  ],
  orderSteps: [
    {
      step: 1,
      title: "Izberite izdelek ali katalog",
      description: "Preglejte našo ponudbo na spletu, izberite želene artikle ali nam zaupajte okvirni namen darila.",
      icon: "Search",
    },
    {
      step: 2,
      title: "Pošljite logotip in količino",
      description: "Naložite grafično datoteko (vektor .pdf, .ai ali .svg) in navedite želeno količino ter želeni rok dobave.",
      icon: "UploadCloud",
    },
    {
      step: 3,
      title: "Prejmete ponudbo in predogled",
      description: "Pripravimo natančen cenovni izračun in brezplačno vizualno simulacijo postavitve vašega logotipa na izdelek.",
      icon: "Eye",
    },
    {
      step: 4,
      title: "Potrdite naročilo in dobavo",
      description: "Po vaši potrditvi izdelke natisnemo, skrbno zapakiramo in v dogovorjenem roku dostavimo na vaš naslov.",
      icon: "CheckCircle2",
    },
  ],
  faqs: [
    {
      question: "Ali lahko naročim izdelke z logotipom?",
      answer: "Seveda! Večino izdelkov opremimo z vašim logotipom, sloganom ali grafiko. Uporabljamo različne sodobne tehnike dodelave: lasersko gravuro na kovino in les, kakovostno vezenje na tekstil, sitotisk, tampotisk, sublimacijo in digitalni direktni tisk (DTF) z visoko ločljivostjo.",
    },
    {
      question: "Kakšna je minimalna količina?",
      answer: "Minimalna količina naročila je odvisna od posameznega artikla in izbrane tehnike tiska. Pri promocijskem tekstilu in drobnih pisalih je minimalno naročilo običajno med 25 in 50 kosov, pri tehnoloških izdelkih in ekskluzivnih darilnih setih pa je naročilo mogoče že od 10 ali 20 kosov naprej. Pri posameznih outlet artiklih so možne tudi manjše količine.",
    },
    {
      question: "Ali lahko pred naročilom dobim vzorec?",
      answer: "Da, za večino izdelkov vam z veseljem pošljemo nepotisnjen fizični vzorec, da se prepričate o materialu, barvi in kakovosti izdelave. Pred serijskim tiskom vam vedno pošljemo tudi natančen digitalni vizualni predogled (e-korekturo) v potrditev.",
    },
    {
      question: "Kakšen je običajni dobavni rok?",
      answer: "Dobavni rok za nebrandirane izdelke z zaloge je 2 do 4 delovne dni. Za izdelke z dotiskom ali vezenjem je povprečni dobavni rok 5 do 8 delovnih dni od potrditve grafične predloge. V primeru nujnih dogodkov ali sejmov omogočamo tudi ekspresno izvedbo po predhodnem dogovoru.",
    },
  ],
};
