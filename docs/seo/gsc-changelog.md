# DnB Doctor – GSC changelog (nasadené zmeny)

## 2026-11-22 – intro + FAQ na /music a /artists (body 3 a 4 novembrového plánu)
- Baseline GSC: `new drum and bass releases` 178 / 9,6, `dnb releases` 111 / 9,5, `new dnb releases` 78 / 8,9, `latest dnb releases` 52 / 9,2, `new drum and bass songs 2026` 70 / 8,5; `neurofunk artists` 277 / 8,5, `neurofunk artist` 115 / 15,6, `neurofunk dnb artists` 49 / 5,6, `best neurofunk artists` 48 / 6,9.
- Nový zdieľaný server komponent `app/components/SeoAbout.tsx` (intro + FAQ accordion, FAQPage JSON-LD).
- /music: lede s „new drum and bass releases“; pod zoznamom H2 „New DnB releases“ s dynamickými faktami z DB (najnovší release + dátum, počet za 90 dní a tento rok), odkazy na /albums, /artists, /neurofunk-dnb-mixes, /what-is-drum-and-bass, /types-of-dnb; 3 FAQ.
- /artists: lede s „neurofunk artists“; H2 „Neurofunk artists“ (scéna = rovnaké mená ako /neurofunk-dnb, roster dynamicky), FAQ „Who are the best neurofunk artists?“ + 2 ďalšie; /neurofunk-dnb#artists tlačidlo → „Neurofunk artists on DnB Doctor“.
- Review ~15. 1. 2027.

## 2026-11-22 – nová stránka /dnb-drum-patterns (bod B novembrového plánu)
- Medzera: GB (search.andrejsrna.sk) `drum and bass drum patterns` 90, `dnb drum pattern` 60, `drum and bass drum pattern` 40, `dnb drum patterns` 30, `drum and bass (beat) pattern(s)` ~90; GSC `dnb structure` 22 / poz. 8,3, `drum and bass time signature` 18 / 8,8, `dnb patterns` 3 / 5,7. Žiadna vlastná stránka.
- Title „DnB Drum Patterns: Two-Step, Rollers, Halftime & Amen (Interactive)“. Interaktívny 16-step prehrávač (`app/components/guide/PatternPlayer.tsx`, Web Audio, editovateľné kroky, tempo 160–180, vždy hrá len jeden), 4 patterny, štruktúra tracku (tabuľka), tipy, FAQ 6× + FAQPage JSON-LD. Amen = prvý takt v bežnom prepise (kick 1, 3, 11, 12; snare 5, 13; ghost 8, 10, 16).
- Prelinkovanie: /how-to-produce-neurofunk (sekcia drums), /dnb-bpm (halftime), /sample-packs (Neurofunk loops), footer Learn, sitemap 0.7.
- Review ~15. 1. 2027.

## 2026-11-22 – /sample-packs redizajn (krok 3 novembrového plánu)
- Baseline GSC (20. 8. – 19. 11.): `neurofunk sample pack` 145 zobr. / poz. 7,4 / CTR 8 %, `neurofunk samples` 126 / 14,6, `neurofunk loops` 93 / 17,6, `neurofunk sound packs` 58 / 19,4. GB: `dnb sample pack` 80, `drum and bass sample pack` 80, `free dnb sample packs` 70, `serum dnb` 80.
- Title „Free Neurofunk Sample Pack: Loops, One-Shots & Serum Presets“, nový description s overenými číslami; H1 „Neurofunk Sample Packs“.
- Nový server-rendered `SamplePackGuide` pod zoznamom: tabuľka free vs Yehor pack, H2 Neurofunk loops / Bass one-shots / Serum presets, licencia (zrkadlí Terms 6a), FAQ 6× + FAQPage JSON-LD. Generické „features“ (pady/atmosféry, ktoré free pack nemá) odstránené.
- Overené fakty: free X-Mass ZIP = 60 WAV (15 bass loops, 15 drum loops, 15 tops, 15 bass one-shots), 24-bit/44,1 kHz, 174 BPM; Yehor pack podľa manifestu 28 súborov (6/5/6 WAV + 11 .fxp), 10 €.
- Review ~15. 1. 2027.

## 2026-11-22 – nová stránka /liquid-dnb (krok 2 novembrového plánu)
- Medzera: liquid dopyty mali v GSC (20. 8. – 19. 11.) ~1 100 zobr. a 1 klik bez vlastnej stránky – `what is liquid drum and bass?` 269 / poz. 7,7, `liquid dnb meaning` 190 / 8,1, `what is liquid dnb` 147 / 9,5, `liquid dnb vs dnb` 65 / 3,5, `liquid dnb bpm` 65 / 7,8, `jungle vs liquid dnb` 31 / 4,8. GB objemy (search.andrejsrna.sk): `liquid drum and bass` 500, `liquid dnb` 150.
- Title „What Is Liquid DnB? Liquid Drum and Bass Explained (BPM, Artists)“; sekcie definícia, zvuk, liquid vs DnB (+ jungle vs liquid), pôvod (Fabio, „Liquid Funk“, Creative Source, 1999), artisti a labely, FAQ 6× (FAQPage JSON-LD). BPM z `bpm.ts`.
- Prelinkovanie: /types-of-dnb (Liquid „more“ → /liquid-dnb), /neurofunk-dnb (tabuľka Liquid), /what-is-drum-and-bass (tabuľka subžánrov: Liquid → /liquid-dnb, Neurofunk → /neurofunk-dnb), footer Learn, sitemap 0.8.
- Review ~15. 1. 2027: ktorá URL rankuje na liquid dopyty, CTR.

## 2026-11-22 – quick wins z novembrového plánu (krok 1)
- Plán: `docs/seo/2026-11-action-plan.md` (GSC 20. 8. – 19. 11.).
- 308 pre 7 starých WP URL hlásených v GSC ako 404: /what-is-dnb-music, /what-is-dn-b-the-only-guide-you-need, /drum-and-bass-music → /what-is-drum-and-bass; /dnb-doctor-about → /about; /dnb-spotify → /neurofunk-spotify; /how-to-produce-nom-bass, /how-produce-neurofunk → /how-to-produce-neurofunk.
- /news/junodownload-is-shutting-down (DB, záloha `backups/news-juno-2026-11-22.json`): title „Juno Download Has Shut Down…“, úvod „Juno Download (junodownload.com) has closed.“ Baseline: `juno download` 155 zobr. / poz. 32, `juno downloads` 51 / 21,8.
- /neurofunk-labels title „Neurofunk & DnB Labels: …“ (`dnb label(s)` poz. 6–8, `dnb record labels` 9,3).
- /albums title „Drum and Bass Albums & EPs: …“ (`drum and bass album` poz. ~19).
- /drum-and-bass-history FAQ „What was the first drum and bass song?“ (`first drum and bass song` 22 zobr. / poz. 9,5).
- Review ~15. 12. 2026.

## 2026-11-22 – /what-is-drum-and-bass: zámer „dnb meaning“
- Baseline (GSC 19. 7.–18. 10., ešte pred redizajnom 20. 10.): 15 kl / 63 462 zobr / CTR 0,02 % / poz. 7,9. Zobrazenia ťahali `dnb bpm` (38 k, 0 kl – odpoveď priamo v SERP, od 21. 10. ich má /dnb-bpm) a `dnb meaning` (16 k).
- `dnb meaning` má zmiešaný zámer (SERP: Urban Dictionary, Wiktionary – kriket „did not bat“, betting „draw no bet“, AcronymFinder, Wikipedia). Pridaná sekcia „What does DnB mean?“ ako prvá (pred BPM) + box „Other meanings of DNB“ (DNB medical India, cricket, betting, DNB banka) a FAQ „What does DnB mean?“, „What does drum and bass sound like?“.
- Title „DnB Meaning: What Is Drum and Bass? Sound, BPM & Subgenres“; description začína „DnB means drum and bass…“.
- Konzistencia: tempo všade 174 / 170–176 (predtým 160–180 v texte vs. 170–176 v tabuľke); éra „By the 2000s“ → „From the late ’90s on“ + Dancefloor a Halftime; tabuľka subžánrov 5 → 7 s artistami zhodnými s /types-of-dnb a odkazmi na kotvy; odstránené „influenced trap“ a vágne „North America resurgence“ → Netherlands & Belgium (Noisia, Black Sun Empire, Rampage).
- Review: ~1. 1. 2027 – porovnať query `dnb meaning` (CTR) a či `dnb bpm` prešlo na /dnb-bpm.

## 2026-10-22 – /types-of-dnb: Dancefloor + artisti a labely
- Baseline GSC (19. 7.–18. 10.): 132 klikov, 26 135 impr, CTR 0,51 %, pos 7,3.
- Pridaný typ Dancefloor DnB (sekcia, tabuľka, quick answer, FAQ „What is dancefloor DnB?“); title/description 6 → 7 typov. Dancefloor pridaný aj do zdieľaného `bpm.ts` (172–176) → zobrazí sa aj na /dnb-bpm a /what-is-drum-and-bass.
- Každý typ má blok „Where to start“ (artisti + labely). Halftime predtým nemal žiadnych artistov.
- Kontrola faktov: BPM v tabuľke a FAQ z `bpm.ts` (predtým 160–180 / „174“ natvrdo, nesúhlasilo s /dnb-bpm); Liquid „Often 160-180 BPM“ → „Same ~174 BPM“; Jungle „chopped and screwed“ (hip-hop technika spomaľovania) → „chopped, rearranged breakbeats“; Neurofunk „the heaviest“ → „one of the darkest and most technical“; datePublished podľa gitu 2026-05-01.
- Odkazy `/music?category=liquid|jump-up|jungle|techstep|halftime` nič nefiltrovali → nahradené kontextovými (história, /dnb-bpm, /neurofunk-labels).
- Review ~1. 12. 2026.

## 2026-10-22 – redizajn /neurofunk-labels + zrušenie /core-artists, /new-fans
- Baseline GSC (19. 7.–18. 10.) /neurofunk-labels: 13 klikov, 569 impr, pos 8,6; "neurofunk labels" 53 impr pos 2,5, "dnb labels"/"dnb record labels" ~57 impr pos ~9.
- Pred: client-rendered (framer-motion), bez vlastného title/canonical (Google videl "DnB Doctor | Neurofunk Label").
- Po: server-rendered guide šablóna, title "Neurofunk Labels: From Eatbrain to the Underground (2020s)", quick answer, Annin text zachovaný, 4 FAQ + Article/FAQPage/Breadcrumb JSON-LD, odkazy na profily artistov a /submit-demo, /guidelines, /neurofunk-spotify.
- Odstránená neoveriteľná veta "Austria … releases from Overtune, Asom, Reality, and Virus" (Overtune/Asom nie sú v DB, Reality je track Max Shade).
- /core-artists → 308 /artists (zmazané z sitemapy a footera; /artists CTA prepojené na submit-demo/contact). /new-fans → 308 / (zmazané aj NewToNeurofunk, ArtistCardsGrid, revalidatePath).
- Review ~1. 12. 2026.

## 2026-10-21 – redizajn /drum-and-bass-history
- Baseline GSC (19. 7.–18. 10.): 7 klikov, 1 759 impr, CTR 0,40 %, pos 10,0. Hlavné dopyty: "when did drum and bass start" (114), "when was dnb invented" (57), "when did dnb start" (51), "where was dnb invented" (31), "history of dnb/drum and bass" (~60), "jungle vs liquid" (~45, pos ~5).
- Pred: client-rendered (framer-motion), title "Drum and Bass History: From Jungle Raves to Global Movement (1990–2025)" (zastaraný rok), bez JSON-LD, bez FAQ.
- Po: title "When Did Drum and Bass Start? History of DnB (1990s–Today)", quick answer (kedy/kde/korene/názov), timeline 12 kľúčových dátumov, 5 FAQ (kedy, kde, kto, jungle vs liquid, Amen break) + Article/FAQPage/Breadcrumb JSON-LD, sitemap 0.6→0.8, 308 /history-of-drum-and-bass → /drum-and-bass-history.
- Opravy faktov: Yehor (Záporožie, UA) nebol "Russia neurofunk movement" → "Eastern Europe neurofunk wave"; Ed Rush & Optical doplnení k neurofunku (Wormhole 1998); Let It Roll "world's largest" → "one of the world's largest".
- Review ~1. 12. 2026.

## 2026-10-21 – redizajn /recommended-tools
- Baseline GSC (19. 7.–18. 10.): 0 klikov, 26 impr, pos 10.7.
- Pred: client-rendered (framer-motion), tenký obsah, len 5 dlaždíc.
- Po: server-rendered guide šablóna, title "Recommended Tools for DnB DJs & Producers", quick picks box, model platby pri každej službe, odkaz na DnB Doctor label na Beatporte (affiliate), sekcia free zdrojov (interné odkazy), 4 FAQ + FAQPage/WebPage/Breadcrumb JSON-LD.
- Affiliate odkazy zachované (rel sponsored); disclosure presunutý do FAQ. Odstránené nepoužívané AffiliateLinks.tsx + RecommendedToolsClient.tsx.
- Review ~1. 12. 2026.

## 2026-10-21 – redizajn /guidelines
- Baseline GSC (19. 7.–18. 10.): 1 klik, 78 impr, pos 15.2.
- Pred: placeholder title "Guidelines | Label Name", žiadny canonical (dedil home), chýbal v sitemape, 9 YouTube iframe naraz.
- Po: title "Demo Submission Guidelines for Neurofunk Producers", vlastný canonical, sitemap 0.5, WebPage + BreadcrumbList JSON-LD, videá poster-first (iframe až po kliknutí), pôvodný text pravidiel zachovaný.
- Opravy odkazov: Serum → /products/serum-2 (stará URL 404), Output bez shop. presmerovania.
- Review ~1. 12. 2026.

## 2026-10-21 – redizajn /neurofunk-spotify
- Guide šablóna (rovnaká ako /neurofunk-dnb): server-rendered, quick answer, 6 sekcií, FAQ.
- Title: "Neurofunk Playlists on Spotify: 6 Best Neurofunk DnB Playlists"; description bez neplatného tvrdenia "updated weekly".
- Overené playlisty (Spotify oEmbed): 2× DnB Doctor + Eatbrain, NDBM, Julez, Wendie Dufi. Odstránených 6 ťažkých embedov (1 ostal, lazy).
- JSON-LD: Article, ItemList, FAQPage, BreadcrumbList. Interné odkazy: /neurofunk-dnb, /submit-demo, /how-to-produce-neurofunk, /sample-packs, /neurofunk-dnb-mixes, /artists.
- Review ~1. 12. 2026.

## 2026-10-21 – nová stránka /dnb-bpm
- Dôvod (GSC 19. 7.–18. 10. 2026): klaster BPM = 42 dopytov / 39 542 zobr / 2 kl; `dnb bpm` 38 062 zobr, poz. 7,7. Dopyty dopadali na /what-is-drum-and-bass (63k zobr, CTR 0,02 %), ktorá BPM rieši len jednou sekciou.
- /dnb-bpm: title „DnB BPM: What BPM Is Drum and Bass? (174 BPM Explained)“; quick answer (174 / 170–176 / halftime ~87 / 345 ms), prečo 174, tabuľka BPM podľa podžánrov, halftime a double-time (animovaný groove), DnB vs iné žánre, história tempa, delay časy pri 174 BPM, tipy pre DJ, releasy, FAQ (6) + Article/FAQPage/Breadcrumb JSON-LD.
- Tabuľka BPM podľa podžánrov je zdieľaná (`app/components/guide/bpm.ts`) s /what-is-drum-and-bass, aby čísla nedivergovali. Sekcia BPM na /what-is-drum-and-bass odkazuje na /dnb-bpm; odkaz z /types-of-dnb presmerovaný z #bpm na /dnb-bpm; pridané do footeru (Learn) a sitemap (0,8).
- Riziko: kanibalizácia s /what-is-drum-and-bass. Ak po 4–6 týždňoch Google stále zobrazuje pre `dnb bpm` /what-is-drum-and-bass, odstrániť „BPM“ z jej title.
- Review: ~1. 12. 2026.

## 2026-10-21 – interné odkazy z guide stránok na artistov a newsletter
- Zdieľaný blok „Hear it now“ (GuideReleases) na /what-is-drum-and-bass, /types-of-dnb, /how-to-produce-neurofunk, /neurofunk-dnb: mená artistov pri releasoch sú odkazy na /artists/{slug} (ak sú na rosteri), pridané „All artists →“ a riadok s odkazom na /newsletter. Predtým guide stránky neodkazovali na žiadneho konkrétneho artistu ani na newsletter.
- /neurofunk-dnb sekcia Artists & labels: nový zoznam „On the DnB Doctor roster“ (GuideRoster – 12 artistov s najviac releasmi, dynamicky z DB), tlačidlo vedie na /artists.
- /types-of-dnb Neurofunk: chip „DnB Doctor roster“ → /artists (namiesto textu „DnB Doctor“ medzi artistami).
- Review: ~1. 12. 2026 (kliky/zobrazenia /artists/*).

## 2026-10-21 – /albums a /music-packs
- Baseline (GSC 19. 7.–18. 10. 2026): /albums 13 kl / 773 zobr / 1,68 % / poz. 13,4; /music-packs 1 / 114 / 0,88 % / 35,8.
- Dopyty: `new drum and bass albums` 54 (poz. 8,4), `album drum and bass` 43 (18,9), `dnb album` 20 (9,2), `drum and bass album` 17, `dnb albums` 16; `neurofunk sound packs` 58 (18,5 – zámer = samply).
- /albums: title „Drum and Bass Albums: New Neurofunk DnB LPs | DnB Doctor“, popis s Asana – Raketa LP; lede bez nepravdivého „updated daily… liquid“; generický blok „Why Choose DnB Albums“ nahradený sekciou „About these DnB albums“ (definícia, BPM, dynamický zoznam albumov s odkazmi, /neurofunk-dnb, /types-of-dnb, /artists, /music, /neurofunk-dnb-mixes, /submit-demo).
- /music-packs: title „Neurofunk Music Packs: DnB Compilations & Label Mixes | DnB Doctor“, popis s REVENANT a VORTEX; nová sekcia „What is a music pack?“ (najnovší pack + ostatné dynamicky, odkaz na /albums; pre zámer „sound packs“ odkaz na /sample-packs a /how-to-produce-neurofunk).
- Review: ~1. 12. 2026.

## 2026-10-21 – artist stránky + /artists
- Baseline (GSC 19. 7.–18. 10. 2026): /artists 6 kl / 1 048 zobr / 0,57 % / poz. 8,7; /artists/emzee 10 / 1 017 / 0,98 % / 6,3; /artists/dylemma 3 / 267 / 1,12 % / 5,9; /artists/yehor 1 / 85; /artists/south-of-control 6 / 66 / 9,1 %.
- Dopyty: `emzee` 484 zobr (poz. 5,8), `dylemma` 164 (poz. 3,9, 0 kl), `dylemma shadow's raised me` 59 + 36, `neurofunk artists` 295 (poz. 9,6), `best neurofunk artists` 61.
- Detail artistu (šablóna pre všetkých 72): title „{Meno} – Neurofunk DnB Artist: Releases & Bio“; description začína faktami („{Meno}: neurofunk drum & bass artist with N releases on DnB Doctor, latest „{release}“.“) a zvyšok dopĺňa bio. Predtým len prvá veta bio (napr. EmZee „In the mist-laden outskirts of Prague…“). Metadata a stránka zdieľajú jeden DB dotaz (React cache). MusicGroup JSON-LD a odkaz na posledný release už existovali.
- /artists: title „Neurofunk Artists & DnB Producers | DnB Doctor Roster“ (bez „2025“), vecný popis.
- Review: ~1. 12. 2026.

## 2026-10-21 – titulky a popisy: homepage, /sample-packs, Tidal vs Amazon, Juno
- Baseline (GSC 19. 7.–18. 10. 2026): / 94 kl / 2 166 zobr / 4,34 % / poz. 6,9; /sample-packs 102 / 1 796 / 5,68 % / 8,6; /news/tidal-vs-amazon-music 56 / 5 359 / 1,04 % / 5,9; /news/junodownload-is-shutting-down 74 / 2 787 / 2,66 % / 9,9.
- Homepage: title „DnB Doctor – Neurofunk Drum & Bass Record Label“, konkrétny popis (140+ releasov, 70+ artistov, free sample pack, mixy, demo), canonical, JSON-LD Organization (sameAs sociálne siete) + WebSite so SearchAction (/search?q=).
- /sample-packs: title „Free Neurofunk Sample Pack & DnB Samples“ (dopyty `neurofunk sample pack free`, `free neurofunk sample pack`). V kolekcii je 1 free (Yehor X-Mass) + 1 platený (Yehor, Gumroad) → v texte jednotné číslo „free sample pack“, opravené aj CTA na /how-to-produce-neurofunk a /neurofunk-dnb.
- Tidal vs Amazon (DB, záloha backups/news-seo-2026-10-21.json): title „Tidal vs Amazon Music (2026): Price, Sound Quality & Which Is Better“; úvod „Short answer“ (= meta description), porovnávacia tabuľka, ceny US október 2026 (Tidal 11,99/19,99/6,99, DJ 19,99 – tidal.com/pricing; Amazon Unlimited 12,99, s Prime 11,99, Family 21,99 – MBW 5. 2. 2026), opravený rozpor so Sony 360 RA, nová sekcia „Which is better for drum & bass?“ s odkazmi na /what-is-drum-and-bass, /music, /neurofunk-spotify. Štýl tabuliek v článkoch (post.module.css).
- Juno (DB): title „JunoDownload Has Shut Down: What Happened & Where to Buy DnB Now“; fakty (1. 6. 2026, bez ohlásenia – Digital DJ Tips), re-download starých nákupov, sekcia alternatív (Beatport, Bandcamp, Traxsource, Mixupload, Volumo) s odkazmi na DnB Doctor Beatport/Bandcamp, /music, /sample-packs.
- Review: ~1. 12. 2026.

## 2026-10-20 – /neurofunk-dnb redizajn + zlúčenie duplicít
- Baseline (GSC 19. 7.–18. 10. 2026): /neurofunk-dnb 23 kl / 4 563 zobr / CTR 0,50 % / poz. 6,8; /neurofunk-drum-and-bass 2 / 443 / 0,45 % / 10,9; /drum-and-bass-subgenres 1 / 428 / 0,23 % / 8,7.
- Dopyty: `neurofunk` 1 877 zobr (poz. 8,2), `what is neurofunk?` 1 234 zobr (poz. 1,7, 0 kl), `neurofunk dnb` 664, `dnb subgenres` 603, `neurofunk artists` 295, `neurofunk bpm` 99.
- /neurofunk-dnb: title „What Is Neurofunk? Neurofunk DnB: BPM, Artists & Labels“ (bez „2025“); Quick answer (4 fakty), definícia, porovnanie s liquid/jump-up/techstep, sekcia artisti + labely (odkazy /neurofunk-labels, /core-artists), DnB Doctor releasy s reálnymi odkazmi (/music/yehor-where-do-we-go, /music/razerbeam-oblivion), playlisty ako odkazy namiesto iframe embedov, producentské dlaždice (how-to, sample packs, demo), FAQ 6 otázok. Odstránený mŕtvy odkaz `open.spotify.com/playlist/your-playlist`.
- 308: /neurofunk-drum-and-bass → /neurofunk-dnb; /drum-and-bass-subgenres a /drum-and-bass-sungenres → /types-of-dnb (proxy.ts). Všetky proxy redirecty zmenené z 307 na 308 (staré WP URL sú trvalé presuny).
- /types-of-dnb title → „Types of DnB: 6 Drum and Bass Subgenres Compared“ + description „All DnB subgenres explained…“ (preberá dopyty `dnb subgenres`).
- Interné odkazy, footer, sitemap aktualizované; nepoužívané FAQ.tsx a SpotifyPlaylistsSection.tsx zmazané.
- Review: ~1. 12. 2026 (cieľ /neurofunk-dnb CTR > 1,5 %).

## 2026-10-20 – /how-to-produce-neurofunk redizajn
- Baseline (GSC 19. 7.–18. 10. 2026): 103 kl / 5 761 zobr / CTR 1,79 % / poz. 7,1. Dopyt `how to make neurofunk` poz. 2,9 (4 kl / 39 zobr); `neurofunk bass` 23 zobr.
- Title „How to Make Neurofunk: Drums, Bass Design & Mixdown in 7 Steps“; description s konkrétnymi číslami (172–175 BPM, –7 LUFS, Serum/Vital) + „free sample packs“.
- Server komponent na zdieľanej guide šablóne (bez framer-motion, layout.tsx zmazaný). Hero: index 7 krokov s kotvami + súhrn procesu.
- Celý pôvodný text zachovaný; drums a arrangement ako tabuľky, Key traits ako fakty, nástroje ako chipy.
- Konverzie: sample-packs CTA v hero + box v kroku 1; submit-demo CTA v hero + box v kroku 7 (+ článok Why nobody listens). Affiliate tiles (rel=sponsored) zachované.
- Nové FAQ (5 otázok z obsahu stránky) + FAQPage/Article/Breadcrumb JSON-LD; pás 4 najnovších releasov („Reference tracks“).
- Odstránené: 2 nepreklikávacie dlaždice „Best Plugins…“ / „Production Tips“ (stránky neexistujú), EngagementCTA (sociálne siete sú v pätičke).
- Review: ~1. 12. 2026 (cieľ CTR > 2,5 %, kliky na /sample-packs a /submit-demo z tejto stránky).

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

