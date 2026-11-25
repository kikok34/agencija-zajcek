# Agencija Zajček – Poslovna darila in promocijski material (B2B Demo)

Sodobna, odzivna B2B spletna platforma za podjetje **Agencija Zajček**, specializirano za promocijski material, promo tekstil, tisk logotipov in outlet program v Sloveniji.

---

## 🚀 Tehnologija in zgradba

- **Ogrodje**: Next.js 14 (App Router) + React 18 + TypeScript
- **Stiliranje**: Tailwind CSS (po meri prilagojena poslovna B2B paleta barv, odzivna mrežna postavitev, dostopnost)
- **Ikone**: Lucide React
- **Podatki**: Lokalni TypeScript podatkovni modeli v `src/data/` (več kot 50 demo izdelkov, 6 katalogov, 3 kurirani darilni paketi, pogosta vprašanja)
- **Lokalno shranjevanje**: Vsa stanja košarice, oddanih povpraševanj, naročil in vzorcev se hranijo v brskalniku prek `localStorage`.
- **Brez zunanjih odvisnosti od baz podatkov ali Google Drive**: Simuliran PDF pregledovalnik in prenosnik ter vgrajen analitični sledilnik dogodkov.

---

## 📁 Struktura projekta

```text
agencija-zajcek/
├── public/                 # Statične datoteke
├── src/
│   ├── app/                # Next.js App Router strani
│   │   ├── layout.tsx      # Globalna postavitev (glava, noga, modali, ponudnik stanj)
│   │   ├── globals.css     # Tailwind direktive in globalni slogi
│   │   ├── page.tsx        # Domača stran (Hero, kategorije, kako deluje naročilo, zakaj mi, CTA)
│   │   ├── katalogi/
│   │   │   ├── page.tsx    # Pregled vseh 6 B2B katalogov
│   │   │   └── [slug]/page.tsx # Notranja stran kataloga z izdelki, filtri in PDF pregledom
│   │   ├── kategorije/
│   │   │   └── [slug]/page.tsx # Strani posameznih kategorij s filtriranjem in sortom
│   │   ├── izdelki/
│   │   │   └── [id]/page.tsx   # Podrobna produktna stran (galerija, količinski popusti, specs, vzorec)
│   │   ├── outlet/page.tsx # Outlet Shop z znižanimi cenami, zalogami in hitrim nakupom
│   │   ├── az-darila/page.tsx # AZ darila s 3 kuriranimi paketi (Welcome pack, Sejmi, Poslovna darila)
│   │   ├── kosarica/page.tsx  # Košarica in demo B2B checkout s potrditvijo naročila
│   │   ├── kontakt/page.tsx   # Kontakt z obrazcem za povpraševanje, zemljevidom in FAQ
│   │   └── o-nas/page.tsx     # Zgodba podjetja, izkušnje in 3 ključne prednosti
│   ├── components/         # Ponovno uporabne komponente
│   │   ├── Header.tsx      # Odzivna navigacija, iskalnik, košarica, mobilni spodnji CTA
│   │   ├── Footer.tsx      # Noga z B2B podatki, pravnimi modali in socialnimi ikonami
│   │   ├── CartDrawer.tsx  # Stranska izvlečna košarica s sprotnim izračunom
│   │   ├── InquiryModal.tsx# Globalni modal »Zahtevaj ponudbo« z demo nalaganjem logotipa
│   │   ├── SampleRequestModal.tsx # Modal za zahtevo fizičnega vzorca artikla
│   │   ├── PdfViewerModal.tsx     # Simuliran PDF digitalni pregledovalnik (Brez Google Drive)
│   │   ├── SearchModal.tsx        # Takojšnji iskalnik po izdelkih, šifrah in katalogih
│   │   ├── AnalyticsBadge.tsx     # Plavajoča demo analitika (beleženje dogodkov v živo)
│   │   └── Toast.tsx              # Toast obvestila ob dodajanju v košarico
│   ├── context/            # React konteksti (Cart, Modals, Analytics)
│   │   ├── CartContext.tsx
│   │   ├── ModalContext.tsx
│   │   └── AnalyticsContext.tsx
│   └── data/               # Strukturirani lokalni podatki
│       ├── products.ts     # 50+ artiklov z vsemi cenami, zalogami, šiframi in slikami
│       ├── categories.ts   # 6 kategorij promocijskih izdelkov
│       ├── catalogs.ts     # 6 katalogov s podatki o straneh in simulaciji
│       ├── giftPacks.ts    # 3 AZ darilni paketi
│       └── company.ts      # Kontaktni podatki, naslov, delovni čas, FAQ
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 💻 Navodila za zagon

### 1. Zahteve
- Nameščen **Node.js** (različica 18 ali novejša).
- Nameščen **npm** ali **pnpm**.

### 2. Zagon razvojnega strežnika
V mapi projekta izvedite:

```bash
# Zagon lokalnega strežnika
npm run dev
```

Stran se bo zagnala na naslovu:
👉 **`http://localhost:3000`**

### 3. Gradnja za produkcijo (Build)
```bash
npm run build
npm run start
```

---

## ✨ Seznam strani in funkcij

1. **Domov (`/`)**:
   - Hero sekcija z jasnim pozivom k dejanju (CTA »Zahtevaj ponudbo« in »Preglej kataloge«).
   - 3 zaupanja vredne točke (10+ let izkušenj, tisk po logotipu, hitra ponudba).
   - 6 kartic kategorij s slikami in povezavami.
   - 4 koraki naročila z ikonami (izbira, logotip, predogled, dostava).
   - 5 prednosti Agencije Zajček.
   - Povezava na AZ pakete in zaključni konverzijski CTA.

2. **Katalogi (`/katalogi` in `/katalogi/[slug]`)**:
   - 6 profesionalnih katalogov (Promo tekstil, Torbe in potovanja, Pisala, Mobile & Tech, Dom in življenje, Outlet).
   - Možnost hitrega pregleda in prenosa simuliranega PDF kataloga (brez Google Drive povezav!).
   - Notranja stran kataloga z dinamičnimi filtri (cena, količina, material, barva, tehnika tiska) in razvrščanjem.

3. **Kategorije (`/kategorije/[slug]`)**:
   - Ločena stran za vsako kategorijo z uvodom, prednostmi in filtri.
   - Mreža demo izdelkov z minimalnimi količinami, cenami »že od« in hitrim dodajanjem v košarico.
   - Spodnji CTA za pomoč pri izbiri.

4. **Podrobnosti izdelka (`/izdelki/[id]`)**:
   - Galerija slik z več zornimi koti.
   - Količinski popusti v pregledni tabeli.
   - Izbira barv, velikosti (tekstil) in tehnik tiska (sitotisk, vezenje, laser, DTF).
   - Dobavni roki in tehnične specifikacije.
   - Gumbi: »Dodaj v košarico«, »Zahtevaj ponudbo«, »Zahtevaj vzorec«.
   - Sekcija »Primerno za« in povezani izdelki.

5. **Outlet Shop (`/outlet`)**:
   - Znižane cene do -55%, prikaz stanja zaloge v kosih v Ljubljani.
   - Takojšnje dodajanje v košarico s posodobitvijo števca v glavi in toast obvestilom.

6. **AZ darila (`/az-darila`)**:
   - 3 kurirani kompleti: *Welcome pack za zaposlene*, *Darila za sejme*, *Poslovna darila za stranke*.
   - Vključeni artikli, predlagane količine in embalaža po meri.

7. **Kontakt in povpraševanje (`/kontakt`)**:
   - Telefonska številka (+386 41 947 065), e-pošta (info@agencija-zajcek.net), Dunajska cesta 114, Ljubljana.
   - Obrazec za povpraševanje z validacijo, izbiro skupine izdelkov in demo simulatorjem nalaganja logotipa.
   - Google Maps kartica z lokacijo.
   - Interaktivna harmonika s 4 pogostimi vprašanji (FAQ).

8. **O nas (`/o-nas`)**:
   - Zgodba podjetja, izkušnje, osebni pristop in široka ponudba.

9. **Košarica in Demo Checkout (`/kosarica`)**:
   - Spreminjanje količin, brisanje, sprotni izračun DDV.
   - B2B obrazec za podatke podjetja (davčna številka, kontakt, naslov dostave).
   - Potrditveno okno z generirano številko naročila.

10. **Globalne funkcije**:
    - **Iskalnik**: Takojšnje iskanje po izdelkih, katalogih, šifrah in materialih.
    - **Demo B2B Analitika**: Spodaj levo viden plavajoči gumb, ki v živo beleži dogodke (klik na ponudbo, prenos kataloga, košarica, oddana povpraševanja).
    - **Mobilna optimizacija**: Spodnja fiksna vrstica za takojšnji klic ali ponudbo brez odvečnega premikanja.

---

## 🔌 Integracijski načrt za produkcijo (WooCommerce, CRM, Email)

V demo različici se podatki hranijo v `localStorage`. Za prehod v polno produkcijo je priporočljivo povezati naslednje sisteme:

1. **E-trgovina (WooCommerce / Shopify / Custom B2B Engine)**:
   - **Sinhronizacija zalog in cen**: Povezava prek REST API za avtomatski uvoz zalog iz skladiščnega sistema (ERP, npr. Pantheon, Saop, Vasco).
   - **B2B ceniki**: Prikaz različnih cenikov glede na prijavljenega B2B partnerja (količinski rabati, odloženo plačilo).

2. **CRM sistem (HubSpot, Pipedrive ali Zoho CRM)**:
   - **Avtomatsko ustvarjanje priložnosti (Deals)**: Vsako oddano povpraševanje iz obrazca ali modala se samodejno vpiše v prodajni lijak (pipeline).
   - **Prenos logotipa**: Datoteka logotipa, naložena v obrazcu, se shrani v varno oblačno shrambo (npr. AWS S3 ali Cloudinary) in pripne k CRM kontaktu za pripravo grafičnega predogleda.

3. **E-poštni sistem (Resend, SendGrid ali Mailchimp)**:
   - **Takojšnja potrditev naročniku**: Avtomatsko e-sporočilo stranki s povzetkom poslanega povpraševanja in obvestilom, da ponudbo prejme v 24 urah.
   - **Obvestilo komercialistu**: Interno sporočilo na `info@agencija-zajcek.net` z vsemi podatki o artiklih, količini in pripetem logotipu.
