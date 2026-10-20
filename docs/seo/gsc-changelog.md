# DnB Doctor – GSC changelog (nasadené zmeny)

## 2026-10-20 – /types-of-dnb redizajn
- Baseline (GSC 19. 7.–18. 10. 2026): 132 kl / 26 135 zobr / CTR 0,51 % / poz. 7,3 (najviac klikov na webe). Dopyty: `types of drum and bass`, `dnb subgenres`, `dnb genres`, `liquid dnb vs dnb` (~200 zobr spolu, 0 kl).
- Title „Types of DnB: 6 Drum and Bass Styles Compared“; description bez nepravdivého „with sound examples“.
- Hero: Quick answer karta = očíslovaný index 6 typov (kotvy) + pôvodný snippet text. Porovnávacia tabuľka presunutá hore (`#compare`).
- Každý typ: chipy BPM / nálada / príkladoví artisti (prevzaté z /what-is-drum-and-bass), charakteristiky, „Best for you if“.
- Nová FAQ otázka „What is liquid DnB — and how is it different from regular DnB?“ (dopyty liquid vs dnb). ItemList + FAQPage + Breadcrumb JSON-LD.
- Odkazy `/music?category=liquid|jump-up|jungle|techstep|halftime` nefiltrujú (kategória v DB neexistuje) → text tlačidla zmenený na „Browse DnB Doctor releases“ (href zachovaný).
- Zdieľané komponenty `app/components/guide/Guide.tsx` (GuideSection, GuideFaq, GuideReleases); /what-is-drum-and-bass prerobená na ne, BPM Jungle/Techstep zosúladené (160–175 / 170–180).
- Review: ~1. 12. 2026 (cieľ CTR > 1 %).

## 2026-10-20 – /what-is-drum-and-bass redizajn
- Baseline (GSC 19. 7.–18. 10. 2026): 15 kl / 63 462 zobr / CTR 0,02 % / poz. 7,9. Dopyty `dnb bpm` (38 k zobr), `dnb meaning` (16 k).
- Nový title: „What Is DnB? Meaning, BPM & Subgenres of Drum and Bass“; description bez nepravdivých tvrdení („7 subgenres“, „audio examples“).
- Nová sekcia `#bpm` hneď pod hero: BPM tabuľka podľa subžánru + „Quick answer“ karta (4 fakty, two-step groove @174 BPM).
- Nový dizajn (server komponent, `app/components/guide/guide.module.css` – zdieľaná šablóna pre guide stránky), bez framer-motion; pôvodný text, FAQ (FAQPage schema) a všetky odkazy zachované; pridané odkazy na /types-of-dnb, /neurofunk-dnb, /how-to-produce-neurofunk, /sample-packs, 4 najnovšie releasy.
- Review: ~1. 12. 2026 (cieľ CTR > 0,3 %).

