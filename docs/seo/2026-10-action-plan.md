# DnB Doctor – SEO / redizajn akčný plán (október 2026)

**Zdroj:** GSC export „Performance on Search“, Web (textové), posledné 3 mesiace = **19. 7. – 18. 10. 2026** (92 dní).
Toto je **plán** (hypotézy + priority). Nasadené zmeny sa zapisujú do `docs/seo/gsc-changelog.md`.

## Súhrn

| Metrika | Hodnota |
|---|---|
| Kliknutia | 767 |
| Zobrazenia | 123 458 |
| CTR | 0,62 % |
| Priem. pozícia | ~7,7 |
| Mobil / desktop kliky | 395 / 364 (desktop CTR 0,42 %, mobil 1,09 %) |
| Top krajiny (kliky) | UK 124, US 105, DE 57, CZ 47, FR 39 |

Mesačne: júl (od 19.) 137 kl / 16 k zobr · august 248 / 24,8 k · september 233 / 46,9 k · október (do 18.) 149 / 35,7 k.
Zobrazenia rastú rýchlo, kliky nie → problém je **CTR / zámer**, nie viditeľnosť.

Dopyty v tabuľke pokrývajú iba 166 z 767 klikov (zvyšok sú anonymizované dopyty) – podiely nižšie platia len pre exportovanú tabuľku.

## Top stránky (kliky)

| Stránka | Kliky | Zobrazenia | CTR | Poz. | Dizajn |
|---|---|---|---|---|---|
| /types-of-dnb | 132 | 26 135 | 0,51 % | 7,3 | **starý** |
| /how-to-produce-neurofunk | 103 | 5 761 | 1,79 % | 7,1 | **starý** |
| /sample-packs | 102 | 1 796 | 5,68 % | 8,6 | nový |
| / | 94 | 2 166 | 4,34 % | 6,9 | nový |
| /news/junodownload-is-shutting-down | 74 | 2 787 | 2,66 % | 9,9 | nový |
| /news/tidal-vs-amazon-music | 56 | 5 359 | 1,04 % | 5,9 | nový |
| /music | 53 | 3 430 | 1,55 % | 9,3 | nový |
| /neurofunk-dnb | 23 | 4 563 | 0,50 % | 6,8 | **starý** |
| /what-is-drum-and-bass | 15 | **63 462** | **0,02 %** | 7,9 | **starý** |
| /drum-and-bass-history | 7 | 1 759 | 0,40 % | 10,0 | **starý** |
| /neurofunk-labels | 13 | 569 | 2,28 % | 8,6 | **starý** |

Edukačné „guide“ stránky = **väčšina zobrazení**, a všetky sú ešte v starom dizajne (zaoblené karty, gradienty, Tailwind) – žiadna nepoužíva `brandFonts` ani nový vizuálny jazyk.

## Klastre dopytov (exportovaná tabuľka)

| Klaster | Kliky | Zobrazenia | Pozn. |
|---|---|---|---|
| BPM / tempo (`dnb bpm` 38 062 zobr, 0 kl) | 2 | 39 799 | priama odpoveď v SERP – kliky len cez silnejší dôvod kliknúť |
| Význam / čo je DnB (`dnb meaning` 16 237) | 4 | 21 872 | to isté |
| Neurofunk (žáner) | 17 | 5 234 | `neurofunk` 1 877 zobr, poz. 8,2 |
| Typy / subžánre | 19 | 4 094 | 3 stránky súperia (kanibalizácia) |
| Tidal / Amazon | 7 | 1 333 | |
| Releases | 10 | 1 091 | |
| Juno | 13 | 1 058 | |
| Sample packs | 21 | 432 | najlepší CTR, komerčný zámer |
| Brand `dnb doctor` | 51 | 386 | CTR 13 %, poz. 3,1 (!) |

## Priority

### P1 – Redizajn top guide stránok (nový dizajn + obsah na zámer)
- [x] **/what-is-drum-and-bass** (nasadené 2026-10-20, viď changelog) – 63 k zobrazení, 15 klikov. Hore krátka odpoveď (definícia + **BPM tabuľka podľa subžánru**: DnB 170–176, Neurofunk 172–175, Liquid 170–174, Jungle 160–170, Halftime 87/174…), kotvy `#bpm`, `#meaning`, FAQ schema ponechať. Title/description prepísať na „DnB BPM & meaning“ zámer (napr. *„What Is DnB? Meaning, BPM (174) & Subgenres Explained“*).
- [ ] **/types-of-dnb** – najviac klikov na webe. Nový dizajn, porovnávacia tabuľka (BPM, nálada, artisti, príklad tracku), embed/preview z vlastného katalógu.
- [ ] **/how-to-produce-neurofunk** – 1,79 % CTR, producentské publikum → prepojiť na /sample-packs a /submit-demo (najlepšie konverzie webu).
- [ ] **/neurofunk-dnb** – title stále hovorí „2025 Guide“ → aktualizovať na 2026, nový dizajn.

Spoločný „guide“ layout (hero s outline nadpisom, TOC, sekcie, FAQ, CTA na releasy/sample packs) → jedna šablóna pre všetky edukačné stránky.

### P2 – Kanibalizácia
- [ ] /types-of-dnb vs /drum-and-bass-subgenres (428 zobr, 1 kl) – zlúčiť subgenres do types-of-dnb (301) alebo jasne rozdeliť zámer.
- [ ] /neurofunk-dnb vs /neurofunk-drum-and-bass (443 zobr, 2 kl) – zlúčiť (301 na silnejšiu).
- [ ] /albums (poz. 13,4) a /music-packs (poz. 35,8) sú samostatné kolekcie (nie duplicity) – slabé pozície riešiť unikátnym úvodným textom a meta, nie zlúčením.

### P3 – CTR úpravy existujúcich stránok
- [ ] **Homepage** – description je generická („Your premier destination…“) → konkrétna (neurofunk label, počet releasov, demo submission).
- [ ] **/sample-packs** – zámer `neurofunk sample pack free` (CTR 10 %) → v title/description zdôrazniť „free“ packy.
- [ ] **/news/tidal-vs-amazon-music** – 5,4 k zobr, poz. 5,9; aktualizovať na 2026 (ceny, Hi-Res), title s rokom.
- [ ] **/news/junodownload-is-shutting-down** – doplniť „Juno Download alternatives“ sekciu (Beatport, Bandcamp, Traxsource) + odkazy na naše releasy.

### P4 – Interné prelinkovanie
- [ ] Guide stránky → konkrétne releasy/artisti (neurofunk → katalóg), sample packs, newsletter.
- [ ] Artist stránky (emzee 1 017 zobr, dylemma) – meta description z bio, odkaz na najnovší release.

## Merateľné ciele (review 4–6 týždňov po nasadení)
- /what-is-drum-and-bass CTR z 0,02 % → >0,3 %
- /types-of-dnb CTR z 0,51 % → >1 %
- celkový CTR z 0,62 % → >1 % pri rovnakom alebo vyššom počte zobrazení
