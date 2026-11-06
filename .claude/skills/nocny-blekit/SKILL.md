---
name: nocny-blekit
description: Projektowanie i zmiana ekranów DoRoboty.ai w kierunku wizualnym „Nocny błękit” — minimalizm w palecie granat #00043c / kobalt #1f3fbf / stal #4c5c7c / chłodna szarość #b4c0d0. Używaj tego skilla zawsze, gdy użytkownik prosi o nowy ekran, makietę, redesign, komponent, kolory, typografię lub przyciski dla DoRoboty.ai „w nocnym błękicie”, „w nowym stylu”, „w stylu z moodboardu”, albo projektuje listę ofert, ofertę, panel pracodawcy, kartę dowodów kandydata (P6) czy przypomnienie o zgłoszeniach (P11) — nawet jeśli nie podaje nazwy skilla.
---

# Nocny błękit — styl ekranów DoRoboty.ai

Domyślny styl aplikacji. Kierunek wybrany przez użytkownika 2026-11-06 na podstawie moodboardu (`MoodBoard/moodboard-doroboty.html`). Łączy trzy wzorce:

| Skąd | Co bierzemy | Gdzie w produkcie |
|---|---|---|
| **Axiom Space** | nocny, pełnoszerokościowy nagłówek z jednym obiektem/renderem i białym tytułem | strona główna, nagłówek marki, sekcje „o nas” |
| **Stripe Careers** | lista jako spokojne wiersze tekstu, treść w dwóch kolumnach, przyklejona karta faktów z jednym przyciskiem | lista ofert, oferta |
| **IBM Carbon** | gęste tabele z cienkimi liniami, blok z kobaltowym paskiem po lewej, statusy bez ozdób | panel pracodawcy, karta dowodów P6, przypomnienie P11 |

Cel produktu, który styl ma wspierać: pracodawca (to on płaci) ma szybko zobaczyć, którzy kandydaci są warci rozmowy. Dlatego w ekranach roboczych wygrywa czytelność i porównywalność, a ekspresja (noc, render) zostaje w nagłówku marki.

## Zanim zaczniesz

1. **To domyślny styl aplikacji** (od 2026-11-06, patrz `GUI.md`). Poster People w `docs/design-system/agent-kit` to tylko historyczna referencja układu — nie bierz z niego kolorów, Geist Serif ani różowych akcji. Motyw jest już wdrożony na poziomie tokenów: `tokens.css`, `src/app/nocny-blekit.css` (nocny nagłówek i hero), wartości `--pp-*` w `src/app/marketplace-components.css`. Nowe ekrany buduj na tych tokenach.
2. Ustal, który typ ekranu robisz (tabela wyżej) i przeczytaj jego przepis w [references/screens.md](references/screens.md).
3. Kolory, rozmiary i promienie bierz z [references/tokens.css](references/tokens.css) — nie wymyślaj nowych odcieni. Jeśli czegoś brakuje, dopisz token z nazwą roli i zaznacz go jako propozycję.

## Kolory — role, nie dekoracja

Paleta jest prawie monochromatyczna (błękit + szarość), jak na obrazku referencyjnym. Każdy kolor ma jedną pracę:

| Token | Wartość | Rola | Nie używaj do |
|---|---|---|---|
| `--nb-night` | `#00043c` | tło nocnego nagłówka/hero; nagłówki H1–H2 na jasnym | tła dużych obszarów roboczych (męczy przy danych) |
| `--nb-cobalt` | `#1f3fbf` | **jedyny kolor akcji**: przyciski główne, linki, stan wybrany, fokus, pasek „dowód” | dekoracji, ikon ozdobnych, wynagrodzenia |
| `--nb-steel` | `#4c5c7c` | tekst pomocniczy (firma, lokalizacja, daty, etykiety) | tekstu głównego, przycisków |
| `--nb-frost` | `#b4c0d0` | linie podziału, obramowania kart (tylko dekoracyjne — kontrast 1.8:1) | tekstu, obramowań pól formularza |
| `--nb-ink` | `#0b1230` | tekst główny | — |
| `--nb-paper` | `#f4f6fa` | tło strony | — |
| `--nb-surface` | `#ffffff` | karty, panele, tabele | — |

Dlaczego tak: jeśli kobalt pojawia się tylko tam, gdzie można kliknąć albo gdzie jest dowód, oko pracodawcy od razu wie, gdzie działać. Drugi kolor akcji (np. różowy, fioletowy Stripe `#533afd`, pomarańcz Axiom) rozbija ten sygnał — zamieniaj takie akcenty na kobalt.

Kolory stanów (błąd, sukces, ostrzeżenie) są dozwolone tylko jako komunikat stanu, nigdy jako ozdoba — wartości w `tokens.css`. Decyzja „odrzucamy” nie jest czerwona: to neutralny przycisk konturowy (odrzucenie to normalna decyzja, nie błąd).

Kontrasty sprawdzone: kobalt na białym 8.3:1, stal na białym 6.7:1, biały na granacie 19.4:1. Pola formularzy i kontrolki obramowuj `--nb-line-strong` (`#6b7a99`, 4.3:1), nie `--nb-frost`.

## Typografia

- **Nagłówki ekspresyjne** (hero, H1 strony głównej): IBM Plex Serif **Light 300**, duże (48–64px), ciasna interlinia 1.05. Cienki szeryf daje „cichy” charakter jak w Carbon.
- **Wszystko inne**: IBM Plex Sans 400/600. Tytuły ofert i kandydatów 600, tekst 16px/1.55, etykiety 13–14px.
- **Liczby i fakty** (widełki, daty, Match Score): Plex Sans z `font-variant-numeric: tabular-nums`, żeby kolumny się wyrównywały.
- Fonty ładuj **lokalnie** (np. pakiet `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-serif`, licencja OFL) — aplikacja nie może sięgać do zdalnych fontów. Fallback: `Arial, Helvetica, system-ui, sans-serif`.
- Tytuły zawijaj w całości, nie ucinaj wielokropkiem — długie nazwy stanowisk są normą („Senior Product Designer / AI Experience Lead — narzędzia…”).

Skala w `tokens.css` (`--nb-text-*`). Nie twórz pośrednich rozmiarów — jeśli przepis w screens.md podaje rozmiar, jest on w skali. Grubość pasków i wielkość kropek statusu też są tokenami (`--nb-bar`, `--nb-dot`).

## Układ treści

- **Siatka**: maks. szerokość treści 1200px, margines boczny 24px (16px na telefonie). Odstępy tylko z `--nb-space-*` (4, 8, 12, 16, 24, 32, 48, 64).
- **Jeden ekran = jedna decyzja.** Każda sekcja ma jeden nagłówek i najwyżej jedno główne działanie. Jeśli potrzebujesz dwóch przycisków głównych, jeden z nich jest drugorzędny.
- **Nocny nagłówek tylko u góry.** Ciemne tło `--nb-night` występuje w nagłówku marki/hero i w stopce. Ekrany robocze (lista, oferta, panel) są jasne: `--nb-paper` + białe karty.
- **Rytm sekcji na stronie głównej** (wzorzec Axiom): ciemny pas → jasna przerwa → ciemny pas. W każdym pasie: obraz/ilustracja, nagłówek, jeden przycisk‑kontur.
- **Ilustracje**: konturowe, cienka linia (1.5px) w kobalcie/stali — kratownice, siatki, pionowe rytmy jak na obrazku referencyjnym. Bez zdjęć stockowych i bez rysowanych postaci Poster People.
- **Linie zamiast cieni.** Karty oddziela 1px `--nb-frost`, bez cieni (wyjątek: menu rozwijane i dialogi — `--nb-shadow-pop`).

## Przyciski i kontrolki

| Rodzaj | Wygląd | Kiedy |
|---|---|---|
| **Główny** | tło `--nb-cobalt`, tekst biały 600, wys. 44px, promień 6px | jedno główne działanie w sekcji: „Aplikuj”, „Szukaj ofert”, „Kontynuujemy” |
| **Konturowy** | przezroczysty, ramka 1px `--nb-cobalt`, tekst kobalt | działanie drugorzędne: „Zapisz”, „Odrzucamy”, „Zobacz profil” |
| **Konturowy na nocy** | ramka 1px biała, tekst biały, promień pełny (pigułka) | tylko w nocnym hero/pasie |
| **Tekstowy** | tekst kobalt, podkreślenie przy hover | nawigacja w treści, „Wyczyść filtry” |

- Hover: główny ciemnieje do `--nb-cobalt-hover`; konturowy dostaje tło `--nb-cobalt-tint`.
- Fokus z klawiatury zawsze widoczny: obrys 2px `--nb-focus` z odstępem 2px (na nocy `--nb-focus-on-night`). Fokus ma ten sam kobalt co paski dowodu i wybranego wiersza — to celowe (kobalt = „tu jesteś / tu działaj”); obrys dookoła vs. pasek z lewej wystarczająco je odróżnia.
- Wyłączony: tło `--nb-paper`, tekst `--nb-steel`, bez kobaltu.
- Pola formularzy: wys. 44px, ramka `--nb-line-strong`, promień 6px, etykieta nad polem (nie placeholder zamiast etykiety).
- Chipy kategorii **Build / Apply / Lead**: kontur `--nb-frost`, tekst `--nb-ink`; wybrany = tło `--nb-night`, tekst biały. Kategorii nie kolorujemy różnymi barwami — różnią się nazwą, nie kolorem.

## Komponenty kluczowe (skrót — szczegóły w references/screens.md)

- **Wiersz oferty**: 2 linie. Linia 1: tytuł (kobalt, 600, link) + widełki po prawej (ink, tabular). Linia 2: firma · kategoria · lokalizacja · tryb (stal, 14px). Podział 1px `--nb-frost`. Brak widełek → „Nie podano wynagrodzenia” stalą, nie pusto.
- **Karta faktów oferty**: tło `--nb-paper`, lista faktów z ikonami konturowymi (Lucide, 18px, stal), na dole jeden przycisk główny, przyklejona (`position: sticky`) na desktopie.
- **Tabela zgłoszeń**: nagłówek kolumn na `--nb-paper`, 13px, 600, stal; wiersze min. 48px; status jako tekst + kropka `--nb-dot`, nie kolorowa pigułka. Pełna lista statusów i ich wygląd: references/screens.md §4.
- **Blok dowodu (P6)**: pasek 3px `--nb-cobalt` po lewej, tło `--nb-cobalt-tint`, dosłowny cytat w cudzysłowie „…”, pod nim źródło (stal, 13px). Brak dowodu: pasek przerywany `--nb-steel`, tło `--nb-paper`, tekst „Brak opisu własnego zakresu”.
- **Przypomnienie P11**: baner nad tabelą z paskiem kobaltu po lewej; w tabeli tylko liczba dni 600 + mała ikona zegara w kobalcie przy zgłoszeniach > 3 dni. Bez czerwieni. Pasków nie dawaj w komórkach tabeli — w kolejnych wierszach zlewają się w pionową linię.

## Treść i ton

- Interfejs po polsku. Krótkie etykiety, czasowniki w przyciskach („Aplikuj”, „Kontynuujemy”, „Odrzucamy”).
- Match Score pokazuj jako fakt tekstowy („Ocena dopasowania tekstu: 76/100”), nigdy jako „szansa na zatrudnienie” — to ocena tekstów, nie prognoza.
- Dane w produkcie są fikcyjne. W makietach zacznij od `src/features/prototype/data`; jeśli prośba wymaga firm, ofert lub kandydatów, których tam nie ma, wymyśl je (polskie imiona, realistyczne role) i oznacz w makiecie dopiskiem „dane przykładowe”.
- Liczby z rzeczownikiem odmieniaj poprawnie: 1 zgłoszenie, 2–4 zgłoszenia, 5+ zgłoszeń (to samo dla „dzień/dni”, „oferta/oferty/ofert”).

## Jak dostarczyć wynik

- **Makieta / szkic** (gdy użytkownik chce zobaczyć pomysł): jeden samodzielny plik HTML z tokenami z `references/tokens.css` wklejonymi w `<style>`, bez żadnych zewnętrznych zasobów. Jeśli fonty IBM Plex nie są dostępne lokalnie, zostaw stos zapasowy (Arial) — makieta ma pokazać układ i kolory, nie font. Zapisz w folderze wskazanym przez użytkownika albo w `docs/tasks/`.
- **Zmiana w aplikacji**: mapuj tokeny `--nb-*` na warstwę hosta (`tokens.css`, `src/app/globals.css`, zmienne `--gui-*` i `--primary`), używaj istniejących komponentów Base UI i feature’ów — nie twórz drugiej biblioteki przycisków. Zachowaj trasy hash, Zod i localStorage.

## Lista kontrolna przed oddaniem

- [ ] Kobalt występuje tylko w akcjach, linkach, stanie wybranym, fokusie i dowodach.
- [ ] Brak różu, fioletu i pomarańczu (pozostałości Poster People / referencji).
- [ ] Ekrany robocze są jasne; granat tylko w nagłówku/hero/stopce.
- [ ] Najwyżej jeden przycisk główny na sekcję.
- [ ] Tekst pomocniczy w stali, linie we frost, pola formularzy w `--nb-line-strong`.
- [ ] Długi tytuł, brak widełek, brak dowodu i pusta lista mają zaprojektowany wygląd.
- [ ] Widoczny fokus klawiatury; działa przy szerokości 375px bez przewijania w poziomie.
- [ ] Fonty lokalne, bez zdalnych adresów.
