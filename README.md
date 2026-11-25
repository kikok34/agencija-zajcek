# Agencija Zajček – Poslovna darila in promocijski material (DEMO 2)

Sodobna B2B spletna platforma in predstavitvena različica za podjetje **Agencija Zajček**, razširjena s poslovnimi funkcionalnostmi za lastnika (upravljanje artiklov, simulacija dobaviteljev, izbira con tiska, lokalno nalaganje grafik ter oddaja B2B naročil brez spletnega plačila).

---

## 📌 Pregled vej in hramba Demo 1

Za zagotavljanje popolne sledljivosti in nedotaknjenosti predhodne različice sta v repozitoriju ločeni dve Git veji:
- **`demo-1`**: Izvirna vizualna in odzivna predstavitvena stran z mobilnimi posnetki.  
  - *Zadnji commit (Demo 1):* `c0c9b5d848f2f62c2f53c7da08af5392af665416`
- **`demo-2`**: Razširjena poslovna različica (Admin `/admin`, dobavitelji, cona tiska, naročila, IndexedDB).

---

## 🚀 Navodila za namestitev in zagon

Aplikacija teče na obstoječem razvojnem skladu **Next.js 14 (App Router)**, **React 18**, **TypeScript** in **Tailwind CSS**.

### 1. Kloniranje ali premik v mapo projekta
```bash
cd agencija-zajcek
```

### 2. Namestitev odvisnosti (če še niso nameščene)
```bash
npm install
```

### 3. Zagon lokalnega razvojnega strežnika
```bash
npm run dev
```
Aplikacija je takoj dostopna na:  
👉 **[http://localhost:3000/](http://localhost:3000/)**

Za pregled administracije obiščite:  
👉 **[http://localhost:3000/admin](http://localhost:3000/admin)**

---

## 🧩 Kaj je bilo ponovno uporabljeno iz Demo 1

1. **Celostna grafična podoba (CGP):**
   - Barvna paleta (temno modra `brand`, oranžna `accent`, nevtralne sivine `slate`), tipografija, zaobljeni robovi in razmiki.
2. **Postavitev in navigacijske komponente:**
   - Glavni `Header.tsx` z mobilnim menijem, iskalnikom in števcem košarice.
   - Noga `Footer.tsx` s kontaktnimi podatki podjetja.
   - Globalni modali: `InquiryModal`, `SampleRequestModal`, `PdfViewerModal`, `SearchModal`, `CartDrawer`.
3. **Katalog in vstopne strani:**
   - Vstopna stran `/` s Hero sekcijo, trust točkami in kategorijami.
   - Strani katalogov `/katalogi` in `/katalogi/[slug]`.
   - Kategorije `/kategorije/[slug]` in Outlet `/outlet`.
4. **Mobilna odzivnost:**
   - Preverjena postavitev na 390 × 844 px brez vodoravnega prelivanja (0px overflow).

---

## ⚙️ Nove funkcionalnosti v Demo 2

### A. Upravljanje izdelkov (Admin `/admin` in `/admin/izdelki`)
- Pregledna nadzorna plošča s 4 ključnimi metrikami:
  - Število objavljenih izdelkov v trgovini.
  - Število prejetih testnih naročil.
  - Izdelki, ki potrebujejo pregled (status `needs_review`).
  - Čas zadnje dobaviteljske sinhronizacije.
- Popolno urejanje izdelkov:
  - Naziv, opis, SKU, kategorija, materiali.
  - Prodajna cena v EUR brez DDV (jasen prikaz 22% DDV).
  - Minimalna količina in količinski korak (inkrement).
  - Količinski popusti v razredih (več naročite, manj plačate).
  - Barvne in velikostne različice.
  - Vklop/izklop možnosti personalizacije ter določanje con tiska.
  - Lokalno nalaganje slik v **IndexedDB** s takojšnjim predogledom.
  - Določanje statusa: *Objavljeno* / *Potreben pregled* / *Osnutek*.
- Vse spremembe se takoj odražajo v javni trgovini!

### B. Simulirana integracija dobaviteljev (`/admin/dobavitelji`)
- Dva fiktivna dobavitelja:
  - **Demo dobavitelj A (PromoTextile Europe)** – REST JSON API feed
  - **Demo dobavitelj B (TechPromo Direct)** – SOAP / XML feed
- Simulacija uvoza:
  - Posodabljanje dobaviteljskih zalog (ločeno od lokalne zaloge v Ljubljani).
  - Posodabljanje nabavnih cen (zaupno – nikoli vidno kupcem).
  - Avtomatski uvoz novih artiklov s statusom *»Potreben pregled«*.
- **Pravilo zaščite cen:** Če lastnik ročno določi prodajno ceno, sinhronizacija cene ne prepiše, temveč le osveži nabavno ceno v ozadju.
- Podroben dnevnik sprememb (Audit Log) ob vsakem zagonu sinhronizacije.
- **CSV uvoz z validacijo:** Možnost prenosa vzorčnega CSV-ja in uvoz lastne CSV datoteke s preverjanjem stolpcev in predogledom.

### C. Konfiguracija izdelka s conami tiska (`/izdelki/[id]`)
- Izpostavljen primer: **Eko Bento posoda za malico z bambusovim pokrovom 1000ml** (`/izdelki/home-04`).
- Izbira med:
  - **Brez tiska** (čist artikel za takojšnjo dobavo)
  - **Z vašim logotipom** (personalizacija)
- **Izbiralnik cone tiska (modalno okno):**
  - Vizualne kartice: *»Pokrov (bambus)«*, *»Desna stran«*, *»Leva stran«*.
  - Črtkan pravokotnik na sliki izdelka prikazuje natančno cono tiska.
  - Maksimalne dimenzije (npr. *100 × 60 mm (demo)*).
  - V primeru naloženega logotipa je prikazan informativni predogled umestitve motiva.

### D. Varno lokalno nalaganje datotek (IndexedDB)
- Podpora za formate: **PDF, SVG, PNG, JPG** (do 15 MB).
- Varno shranjevanje binarnih podatkov v brskalniški **IndexedDB** (preprečuje preseganje 5 MB omejitve LocalStorage).
- Zaščita pred XSS (SVG vsebina se ne vbrizgava v DOM).
- Jasno opozorilo: *»Datoteka se shrani izključno lokalno v vašem brskalniku in se ne pošilja na zunanje strežnike.«*

### E. Oddaja B2B naročila brez spletnega plačila (`/kosarica`)
- Celoten B2B potek: Artikel → Konfiguracija con tiska → Košarica → Podatki podjetja → Pregled → Oddaja.
- Brez kreditnih kartic, Stripe ali PayPal.
- B2B obrazec:
  - Naziv podjetja, kontaktna oseba, e-pošta, telefon.
  - ID za DDV / davčna številka.
  - Naslov za dostavo in možnost ločenega naslova za račun (plačnik).
  - Želeni rok dobave in opombe.
  - Obvezno potrditveno polje demo pogojev.
- Cenovna transparentnost:
  - Za personalizirane artikle je jasno ločena cena artiklov od tiska:  
    *»Cena tiska in dostave bo potrjena pred izvedbo.«*
- Po oddaji: generirana unikatna številka testnega naročila (npr. `ZJ-2026-4082`), obvestilo o lokalni hrambi ter takojšnja vidnost v `/admin/narocila`.

### F. Upravljanje naročil (`/admin/narocila`)
- Seznam vseh oddanih naročil z datumom, podatki podjetja, zneski in priponkami.
- 7 delovnih statusov:
  1. *Novo*
  2. *V pregledu*
  3. *Čaka na potrditev stranke*
  4. *Potrjeno*
  5. *V izvedbi*
  6. *Zaključeno*
  7. *Preklicano*
- Pregled grafik in internih opomb skrbnika.
- Naročila se **ne** pošiljajo samodejno dobaviteljem, temveč čakajo na odobritev lastnika.

---

## 📊 Primerjava: Simulirane vs. Produkcijske funkcionalnosti

| Področje | Implementirano v Demo 2 (Predstavitev) | Potrebno za produkcijsko izvedbo |
|---|---|---|
| **Hramba podatkov** | Brskalniški `LocalStorage` in `IndexedDB` | Relacijska baza podatkov (PostgreSQL / Supabase / Prisma) |
| **Avtentikacija** | Neposreden demo dostop do `/admin` | Varna avtentikacija skrbnikov (NextAuth.js / Supabase Auth z MFA) |
| **Dobavitelji** | Simulirani uvoz, intervali in CSV pregledovalnik | Povezava preko produkcijskih REST API / SOAP ključev ali SFTP XML feedov |
| **Plačila** | B2B model brez spletnega plačila (ponudba / predračun) | Po želji integracija plačilnih kartic ali plačil po predračunu / e-računov |
| **E-poštna obvestila** | Vizualna potrditev v aplikaciji | Transakcijski e-poštni sistem (Resend / Postmark / SendGrid) |
| **Grafična priprava** | Informativni predogled con tiska in nalaganje | Avtomatizirana vektorska predpriprava (PDF RIP / Proofing orodje) |

---

## 🎬 Scenarij za predstavitev naročniku (Client Demo Script)

1. **Uvod v vstopno stran (Trgovina):**
   - Odprite `http://localhost:3000/`.
   - Pokažite zgornji diskretni trak: *»Predstavitvena različica — podatki in naročila so testni«*.
2. **Konfiguracija personaliziranega izdelka (Kupec):**
   - Pojdite na `/izdelki/home-04` (Eko Bento posoda za malico).
   - Izberite možnost *»Z vašim logotipom«*.
   - Kliknite *»Izberi cono tiska«*: pokažite kartice (*Pokrov*, *Desna stran*, *Leva stran*) ter črtkano cono tiska.
   - Naložite demo sliko logotipa in pokažite informativni predogled na bambusovem pokrovu.
   - Kliknite *»Dodaj v košarico«*.
3. **Pregled košarice in oddaja povpraševanja:**
   - Odprite `/kosarica`.
   - Pokažite, da so shranjeni vsi podatki: cona tiska, ime datoteke, opomba za tisk ter količina.
   - Pokažite obvestilo: *»Cena tiska in dostave bo potrjena pred izvedbo.«*
   - Izpolnite B2B obrazec podjetja z davčno številko in kliknite *»Oddaj naročilo v potrditev«*.
   - Pokažite potrditveni zaslon z generirano številko naročila.
4. **Pregled prejetega naročila v administraciji (Lastnik):**
   - Kliknite na gumb za odprtje v administraciji ali obiščite `/admin/narocila`.
   - Naročilo je takoj na vrhu seznama s statusom *»Novo«*.
   - Odprite podrobnosti naročila, preglejte naloženo grafiko, spremenite status v *»V pregledu«* in dodajte opombo.
5. **Upravljanje cen in zaščita ročne cene:**
   - Odprite `/admin/izdelki`.
   - Poiščite Bento posodo, spremenite prodajno ceno na npr. 6.80 € brez DDV ter vklopite *»Zaščiti ročno ceno«*.
6. **Simulacija dobaviteljev:**
   - Pojdite na `/admin/dobavitelji`.
   - Kliknite *»Simuliraj sinhronizacijo«* pri Dobavitelju A.
   - Pokažite poročilo: zaloga se osveži, uvozi se nov artikel s statusom *»Potreben pregled«*, ročna prodajna cena lastnika pa ostane zaščitena.
7. **Mobilna izkušnja in ponastavitev:**
   - Pokažite odzivnost na mobilnem pogledu (390 px).
   - Ob koncu predstavitve kliknite *»Ponastavi demo podatke«* v zgornjem traku, ki s potrditvijo povrne začetno stanje.

---

## 📸 Seznam zajetih zaslonskih slik (v mapi `/screenshots-demo2`)

Vse slike so shranjene v mapi [screenshots-demo2](file:///C:/Users/hrist/.gemini/antigravity/scratch/agencija-zajcek/screenshots-demo2/) ter zapakirane v [agencija-zajcek-demo2.zip](file:///C:/Users/hrist/.gemini/antigravity/scratch/agencija-zajcek/agencija-zajcek-demo2.zip):

1. **`demo2-01-admin-dashboard.png`**: Admin nadzorna plošča s 4 metrikami, opozorilom za pregled in hitrimi povezavami.
2. **`demo2-02-admin-izdelki.png`**: Upravljanje kataloga z filtri po kategoriji, statusu in dobaviteljih ter cenami brez DDV.
3. **`demo2-03-admin-dobavitelji.png`**: Simulirana dobavitelja A in B, poročilo sinhronizacije ter orodje za uvoz CSV.
4. **`demo2-04-admin-narocila.png`**: Seznam testnih B2B naročil s statusi, priponkami in zneski.
5. **`demo2-05-izdelek-konfigurator.png`**: Konfigurator Bento posode z izbiro cone tiska, dimenzijami in nalaganjem logotipa.
6. **`demo2-06-kosarica-pregled.png`**: Pregled košarice s cono tiska, B2B podatki za račun in oddajo brez spletnega plačila.
7. **`demo2-07-mobilno-narocilo.png`**: Popolnoma odziven mobilni prikaz konfiguratorja na 390 × 844 px.
8. **`demo2-08-mobilni-admin.png`**: Mobilni prikaz skrbniške nadzorne plošče na 390 × 844 px.

---

*Agencija Zajček – Poslovna darila in promocijski material © 2026. Predstavitvena različica.*
