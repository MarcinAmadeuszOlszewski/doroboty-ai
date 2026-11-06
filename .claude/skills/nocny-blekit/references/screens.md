# Przepisy ekranów — Nocny błękit

Każdy przepis: skąd pochodzi wzorzec, anatomia, stany brzegowe. Wartości z `tokens.css`. Dowody (zrzuty) są w `MoodBoard/moodboard-doroboty.html` pod podanymi ID.

## Spis
1. Nagłówek marki i hero (strona główna)
2. Lista ofert
3. Oferta
4. Panel pracodawcy — zgłoszenia
5. Karta dowodów kandydata (P6)
6. Przypomnienie o czekających zgłoszeniach (P11)
7. Telefon (≤ 768px)

---

## 1. Nagłówek marki i hero — wzorzec Axiom (B1, B3)

**Po co:** pierwsze wrażenie, nastrój „nocnego”, technicznego portalu. Jedyne miejsce, gdzie styl może być głośny.

Anatomia:
- Pasek nawigacji na `--nb-night`: logo (białe) · „Oferty pracy” · „Dla pracodawców” · po prawej „Zapisane” (kontur na nocy). Aktywny link: podkreślenie 2px `--nb-focus-on-night`.
- Hero na `--nb-night`, wysokość ok. 60% ekranu. Po lewej: H1 Plex Serif Light `--nb-text-hero`, biały, 2 linie (np. „Dobra robota. / Z AI w środku.”); pod spodem 1 zdanie w `--nb-on-night-muted`. Po prawej: ilustracja konturowa lub render (kratownica, pionowe słupki, siatka podłogi) — jeden obiekt, nie kolaż.
- Wyszukiwarka na dole hero: białe pole (stanowisko) + pole lokalizacji + przycisk główny „Szukaj ofert”. Pole jest białe także na nocy — to element roboczy.
- Chipy Build / Apply / Lead pod wyszukiwarką: kontur `--nb-frost`, tekst biały; wybrany: tło białe, tekst `--nb-night`.

Dalej na stronie głównej: rytm pasów — ciemny pas (obraz + nagłówek 28px biały + przycisk‑kontur na nocy) → jasna przerwa `--nb-paper` z 3 kartami → ciemny pas.

Unikaj: gradientów tęczowych, zdjęć ludzi, więcej niż jednego obiektu w hero, czarnego `#000` zamiast granatu.

## 2. Lista ofert — wzorzec Stripe Careers (C1)

**Po co:** kandydat przegląda wiele ofert; liczy się skanowanie wzrokiem.

Układ desktop: kolumna filtrów 240px po lewej + lista po prawej (reszta szerokości). Nad listą: H1 „Oferty pracy” (`--nb-text-2xl`, `--nb-night`) + liczba wyników w stali + sortowanie po prawej (select).

Filtry: bez ramek wokół całej kolumny. Grupa = etykieta 13px/600 stal + checkboxy 16px. Między grupami 1px `--nb-frost`. „Wyczyść” jako przycisk tekstowy. Liczba ofert przy opcji w stali, wyrównana do prawej, tabular.

Wiersz oferty (biała karta listy, wiersze oddzielone 1px `--nb-frost`, padding 16px 20px):
```
[logo 32px]  Tytuł stanowiska (kobalt, 600, 18px, link)          18 000–24 000 zł
             Firma · Apply · Warszawa · Hybrydowo · Senior          B2B netto / mies.
```
- Logo firmy: kwadrat 32px z promieniem 6px, tło `--nb-paper`, inicjały w stali (bez kolorowych teł).
- Widełki: ink 600 tabular; pod spodem forma umowy 13px stal. Brak: „Nie podano wynagrodzenia” 14px stal.
- Data dodania: 13px stal, w linii 2 na końcu („2 dni temu”).
- Zapisz: ikona zakładki (kontur, 20px, stal); zapisana = wypełniona kobaltem.
- Hover wiersza: tło `--nb-paper`. Cały wiersz klikalny, ale tytuł jest właściwym linkiem (dostępność).
- Tagi umiejętności: najwyżej 3, 13px, kontur `--nb-frost`, promień pełny. Reszta jako „+2”.

Paginacja: przyciski 36px konturowe, aktualna strona = tło `--nb-night`, tekst biały.

Stany: pusta lista → ilustracja konturowa 120px + „Brak ofert dla tych filtrów” + przycisk tekstowy „Wyczyść filtry”.

## 3. Oferta — wzorzec Stripe Careers (C2)

Układ desktop: siatka 12 kolumn. Treść 8 kolumn, karta faktów 4 kolumny (sticky, top 24px).

Nagłówek oferty (na `--nb-surface`, nie na nocy): powrót „← Oferty pracy” (tekstowy) · H1 tytuł (`--nb-text-2xl`, `--nb-night`, 400) · linia firmy (logo 40px + nazwa + kategoria) w stali.

Treść: sekcje dwukolumnowe na desktopie — nagłówek sekcji po lewej (H2 20px, 3 kolumny z 8), tekst po prawej (5 kolumn). Sekcje: „O firmie”, „Czym się zajmiesz”, „Czego oczekujemy”, „Co oferujemy”. Między sekcjami 1px `--nb-frost` i 32px odstępu. Listy z kropką 6px w `--nb-frost`.

Karta faktów (tło `--nb-paper`, promień 8px, padding 24px):
- Widełki na górze: 20px 600 ink tabular + forma umowy pod spodem.
- Fakty: ikona Lucide 18px stal + etykieta 13px stal + wartość 16px ink — Tryb pracy, Lokalizacja, Doświadczenie, Kategoria.
- Na dole przycisk główny „Aplikuj” na pełną szerokość + przycisk konturowy „Zapisz ofertę”.

Telefon: karta faktów przechodzi nad treść (bez sticky), a przycisk „Aplikuj” przykleja się do dołu ekranu na białym pasku z linią `--nb-frost` u góry.

## 4. Panel pracodawcy — zgłoszenia — wzorzec Carbon (A4)

**Po co:** pracodawca ma przejrzeć wiele zgłoszeń i podjąć decyzję. Gęstość jest zaletą, ozdoby przeszkadzają.

Nagłówek: nocny pasek nawigacji (jak w 1., ale bez hero), pod nim na `--nb-paper`: tytuł oferty (H1 28px) + zakładki stanów jako tekst: „Wszystkie 12 · Nowe 5 · W przeglądzie 3 · Zaproszeni 2 · Kontynuujemy 1 · Odrzuceni 1” (liczba 600 ink, etykieta stal). Zakładki odpowiadają 1:1 statusom z tabeli — nie dodawaj zakładki bez statusu. Aktywna = podkreślenie 2px kobalt.

Tabela (biała, promień 8px, ramka `--nb-border`):
| Kolumna | Treść |
|---|---|
| Kandydat | imię i nazwisko (600, link kobalt) + rola w stali pod spodem |
| Dowody | „3 z 4 kryteriów z cytatem” — liczba 600; brak = „0 z 4” w stali |
| Ocena dopasowania tekstu | „76/100” tabular, bez kolorowej skali; pod tabelą widoczny przypis „Ocena porównuje tekst profilu z tekstem oferty. To nie jest prognoza zatrudnienia.” (tooltip nie działa na dotyk) |
| Czeka | „5 dni” — powyżej 3 dni: liczba 600 + ikona zegara 16px w kobalcie; do 3 dni zwykły tekst stal (patrz 6.) |
| Status | kropka `--nb-dot` + tekst (patrz niżej) |

Statusy (kształt kropki różni stany, nie tylko odcień):
| Status | Kropka | Tekst |
|---|---|---|
| Nowe | pełna, kobalt | kobalt 600 |
| W przeglądzie | pełna, stal | ink |
| Zaproszony | pełna, granat | ink |
| Kontynuujemy | pełna granatowa z białym ✓ (12px) | ink 600 |
| Odrzucony | pusty okrąg 1px stal | stal |
| Akcja | przycisk konturowy „Otwórz” |

- Nagłówki kolumn: tło `--nb-paper`, 13px 600 stal, sortowalne kolumny ze strzałką.
- Wiersz 48px, hover `--nb-paper`, wybrany: pasek 3px kobalt po lewej.
- Decyzja w szczegółach kandydata: „Kontynuujemy” (główny) obok „Odrzucamy” (konturowy). Nie czerwony.
- Karta dowodów (§5) obok tabeli od `--nb-split-min` (1180px), proporcja 3:2, karta sticky; węziej — pod tabelą.

## 5. Karta dowodów kandydata (P6) — wzorzec bloku informacji Carbon (A4)

**Po co:** pracodawca nie umie ocenić, ile kandydat zrobił sam. Karta pokazuje pod każdym kryterium pracodawcy dosłowny cytat z profilu — albo jasno mówi, że go brak.

Anatomia (karta biała, promień 8px, ramka `--nb-border`, padding 24px):
```
Kandydat: Imię Nazwisko                          [Kontynuujemy] [Odrzucamy]
Dowody pod Twoje kryteria · 3 z 4                (stal, 14px)
─────────────────────────────────────────────
Kryterium 1 (600, ink, 16px)
┃ „Zbudowałam pipeline RAG dla 40 tys. dokumentów…”   ← blok dowodu
┃ Profil › Doświadczenie › BrightLabs, 2023–2026 (stal, 13px)
─────────────────────────────────────────────
Kryterium 4
┆ Brak opisu własnego zakresu                          ← blok braku
┆ Kandydat nie opisał, co zrobił samodzielnie.
```
- Blok dowodu: pasek 3px `--nb-cobalt` po lewej, tło `--nb-cobalt-tint`, cytat 16px ink w polskich cudzysłowach „…”, maks. 3 linie z „Pokaż całość” (tekstowy). Źródło pod spodem 13px stal.
- Blok braku: pasek 3px przerywany `--nb-steel`, tło `--nb-paper`, tytuł 600 stal „Brak opisu własnego zakresu” + zdanie wyjaśnienia. Nie czerwony — brak dowodu to informacja, nie błąd kandydata.
- Licznik „3 z 4” w nagłówku karty — pracodawca porównuje kandydatów po nim w tabeli.
- Cytat zawsze dosłowny; nie parafrazuj i nie skracaj w środku zdania (tylko na końcu „…”).

## 6. Przypomnienie o czekających zgłoszeniach (P11)

- W panelu: baner nad tabelą, gdy są zgłoszenia czekające > 3 dni. Pasek 3px kobalt po lewej, tło `--nb-cobalt-tint`, ikona zegara (stal), tekst „4 zgłoszenia czekają ponad 3 dni” (liczba 600) + przycisk tekstowy „Pokaż je”.
- W tabeli: komórka „Czeka” — liczba dni 600 + ikona zegara w kobalcie. Bez paska w komórce (paski w kolejnych wierszach tworzą pionową linię, która wygląda jak ramka kolumny).
- Odmiana: „1 zgłoszenie czeka”, „2–4 zgłoszenia czekają”, „5+ zgłoszeń czeka”.
- Bez czerwieni, wykrzykników i animacji — ma przypominać, nie zawstydzać.

## 7. Telefon (≤ 768px)

- Margines 16px. Hero: H1 40px, ilustracja pod tekstem, wyszukiwarka w kolumnie.
- Lista: filtry w panelu wysuwanym (przycisk „Filtry · 3” konturowy), wyszukiwarka zostaje na ekranie. Wiersz oferty: widełki pod tytułem, nie po prawej.
- Tabela zgłoszeń zamienia się w karty (do `--nb-mobile-max`): linia 1 — imię (link) + status po prawej; linia 2 — rola w stali; linia 3 — „Dowody 3 z 4 · Czeka 5 dni”; linia 4 — „Ocena tekstu 81/100” po lewej i przycisk „Otwórz” po prawej. Wybrana karta: pasek `--nb-bar` kobalt po lewej.
- Przyciski główne na pełną szerokość. Cele dotyku min. 44px.
