# DnB Doctor – SEO easy wins (november 2026)

**Zdroj:** GSC export 20. 8. – 19. 11. 2026 (Web, 3 mesiace) + search.andrejsrna.sk (Ahrefs GB objemy/mes., február 2026; difficulty často nevyplnená).
Toto je **plán**. Nasadené zmeny → `gsc-changelog.md`.

## Stav po redizajnoch (28 dní pred vs. po 20.–22. 10.)

| Obdobie | Kliky/deň | Zobr./deň | CTR | Poz. |
|---|---|---|---|---|
| 21. 9. – 19. 10. | 7,9 | 1 595 | 0,49 % | 6,5 |
| 23. 10. – 19. 11. | **10,5** (+33 %) | **2 555** (+60 %) | 0,41 % | **5,9** |

CTR klesá len preto, že rastú zero-click zobrazenia (`dnb bpm` 60 k, `dnb meaning` 18 k, `what is neurofunk?` 7 k – odpoveď priamo v SERP / AI Overview). Tieto dopyty nenaháňať.

## Easy wins (existujúce stránky, poz. 4–20)

| # | Klaster (GSC zobr. / poz.) | Stránka | Akcia |
|---|---|---|---|
| 1 | Neurofunk sample packs: `neurofunk sample pack` 145 / 7,4 (CTR 8 %), `neurofunk samples` 126 / 14,6, `neurofunk loops` 93 / 17,6, `neurofunk sound packs` 58 / 19,4; GB: `dnb sample pack` 80, `drum and bass sample pack` 80, `free dnb sample packs` 70, `serum dnb` 80 | /sample-packs | Redizajn na guide šablónu: H2 „Neurofunk loops“, „Bass one-shots“, „Serum presets“, FAQ (free/royalty-free/licencia), ItemList packov; title + „Loops“. Najvyšší komerčný zámer. |
| 2 | Juno: `juno download` 155 / **32**, `juno downloads` 51 / 21,8, `junodownload.com` 35 | /news/junodownload-is-shutting-down | Do title/H1/úvodu pridať variant „Juno Download“ (s medzerou) – dnes rankuje len na „junodownload“. |
| 3 | Releases: `new drum and bass releases` 178 / 9,6, `dnb releases` 111, `new dnb releases` 78, `latest dnb releases` 52, `new drum and bass songs 2026` 70, `new dnb` 57 (~700 zobr., poz. ~9,5) | /music | Server-rendered intro (2–3 vety „new drum and bass releases this month“), ItemList JSON-LD najnovších 12, „Latest release“ dátum; interné odkazy s anchor „new DnB releases“. |
| 4 | Neurofunk artists: `neurofunk artists` 277 / 8,5, `neurofunk artist` 115 / 15,6, `neurofunk dnb artists` 49, `best neurofunk artists` 48 | /artists (+ /neurofunk-dnb#artists) | Intro na /artists + FAQ „Who are the best neurofunk artists?“; na /neurofunk-dnb kotva a odkaz „neurofunk artists“ → /artists. |
| 5 | Labels: `neurofunk labels` 62 / 2,5 (CTR 9,7 %), `dnb label(s)` 47 / 6–8, `dnb record labels` 16 / 9,3; GB: `dnb labels` 60, `dnb record labels` 40 | /neurofunk-labels | Title „Neurofunk & DnB Labels…“, H2 „Best DnB record labels“. |
| 6 | History: `when did drum and bass start` 150 / 8,8, `who invented drum and bass` 41 / 10,3, `first drum and bass song` 22 / 9,5, `history of drum and bass` 25 / 13 | /drum-and-bass-history | FAQ „Who invented DnB?“ a „What was the first drum and bass song?“ (overiť fakty). |
| 7 | Albums: `album drum and bass` 51 / 18,9, `drum and bass album` 27 / 19,7, `dnb albums` 15 | /albums | Title/H1 „Drum and Bass Albums & EPs“. |
| 8 | Artist brand: `dylemma` 156 / 3,9 (0 kl), `emzee` 464 / 6,5, `meta intellect` 70 / 8,2 | /artists/*, /music/* | Skontrolovať, ktorá URL rankuje; artist bio ako úvodný text, foto alt, odkaz release → artist. |
| 9 | 7 starých 404 URL (GSC): /what-is-dnb-music, /what-is-dn-b-the-only-guide-you-need, /dnb-doctor-about, /dnb-spotify, /drum-and-bass-music, /how-to-produce-nom-bass, /how-produce-neurofunk | proxy.ts | 308 na najbližšiu stránku (5 min práce). |

## Nové stránky (medzery – dopyt bez vlastnej stránky)

| # | Téma | Dáta | Návrh |
|---|---|---|---|
| A | ✅ 2026-11-22 **Liquid DnB** | GSC ~1 100 zobr./3 mes., 1 klik: `what is liquid drum and bass?` 269 / 7,7, `liquid dnb meaning` 190, `what is liquid dnb` 147, `liquid dnb vs dnb` 65 / **3,5**, `liquid dnb bpm` 65, `jungle vs liquid` ~50. GB: `liquid drum and bass` **500**, `liquid dnb` 150. | /liquid-dnb podľa vzoru /neurofunk-dnb (čo to je, BPM, liquid vs DnB, artisti/labely, FAQ). Najväčšia medzera. |
| B | **DnB drum patterns** | GB: `drum and bass drum patterns` 90, `dnb drum pattern` 60, `drum and bass drum pattern` 40, `dnb drum patterns` 30, `drum and bass (beat) pattern(s)` 90; GSC `dnb structure` 22, `drum and bass time signature` 18 | /dnb-drum-patterns s interaktívnym step gridom (komponent Steps už existuje), two-step, halftime, rollers, Amen; CTA na /sample-packs. Producentské publikum = najlepšia konverzia. |
| C | Best DnB artists | GB: `drum and bass artists` **900**, `dnb artists` 150, `best drum and bass artists` 80 | Guide „Best Drum and Bass Artists by Style“ s prelinkom na roster. Konkurenčné (difficulty v dátach chýba). |
| D | Jump-up | GB: `jump up dnb` 50, `jump up drum and bass` 50, `jump up dnb sample pack free download` 40, `what is jump up dnb` 20 | Nižšia priorita; najprv A a B. |

## Ignorovať
- `tidal vs kindle/xbox/ps plus/audible/discovery plus` (~5 k zobr., poz. ~2, 0 kl) – Google spája Tidal článok s porovnaniami predplatných; nemá zmysel.
- `dnb bpm` / `dnb meaning` objem – zero-click, sledovať len pozíciu.
- ES/ID dopyty (`que es dnb`, `tipos de drum and bass`, `apa itu dnb`) – preložené výsledky, malý objem.
