# Scenariusz sesji P11 — przypomnienie o czekających zgłoszeniach

Prototyp dla pracodawcy: Karolina Wiśniewska (rekruterka BrightLabs). Plan: `plan.md`; zadanie: `docs/tasks/p11-waiting-reminder.md`.

## Cel i sygnały sukcesu

Sprawdzamy, czy pracodawca **zauważa i rozumie** zgłoszenia czekające ponad 3 dni oraz czy **zajmuje się nimi w pierwszej kolejności** (przypomnienie włączone vs wyłączone).

- Zauważył / zrozumiał: wspomina o czekających zgłoszeniach bez podpowiedzi i potrafi powiedzieć, czego dotyczy przypomnienie.
- Zajął się najpierw: udział zgłoszeń czekających ponad 3 dni wśród pierwszych 4 decyzji jest wyższy z przypomnieniem niż bez.

## Przygotowanie rundy

1. Załadowanie **zastępuje dane poprzedniej rundy**, więc najpierw **wyeksportuj JSON** poprzedniej rundy (Ustawienia → „Eksportuj dane”).
2. **Załaduj kolejkę rundy (A lub B) tuż przed rundą**: Ustawienia → „Sesja testowa P11” → „Załaduj kolejkę A/B” → potwierdź. Wiek zgłoszeń liczy się od chwili załadowania; załadowanie ok. 46 godzin wcześniej zmieniłoby zgłoszenie sprzed 2 dni w czekające ponad 3 dni.
3. Zapisz czas z komunikatu „Załadowano sesję P11 · kolejka X · HH:MM (UTC …Z)”.
4. Ustaw wariant rundy (pole „Przypomnienie o czekających zgłoszeniach w tej rundzie”) **przed przekazaniem komputera**; uczestnik nie widzi przełącznika w trakcie. Wariant nie trafia do eksportu — zapisz go w arkuszu obserwacji.
5. Kliknij „Zmień osobę” i przekaż komputer na ekranie wyboru osoby. **Nigdy nie przekazuj komputera na ekranie Ustawień** — po załadowaniu kolejki aplikacja zostaje na Ustawieniach z zalogowaną osobą, a panel „Sesja testowa P11” zdradza, czego dotyczy test.
6. Zbalansuj kolejność między uczestnikami: A/B oraz ON/OFF (np. uczestnik 1: A z przypomnieniem, potem B bez; uczestnik 2: B z przypomnieniem, potem A bez; kolejni uczestnicy zamieniają kolejność rund).
7. Uczestnik sam wybiera na ekranie wyboru osoby Karolinę Wiśniewską (BrightLabs).
8. Jeśli uczestnik w trakcie rundy otworzy „Ustawienia”, zapisz to w kolumnie „Uwagi”: dane tej rundy o zauważeniu przypomnienia są wtedy nieważne.

## Polecenie dla uczestnika

„Przejrzyj zgłoszenia i podejmij decyzje, które uważasz za potrzebne.” (bez słowa „czeka”, bez wskazywania ekranu).

## Reguła oceny (ustalona przed sesjami)

- `events[].at` w eksporcie jest w UTC. Porównuj z czasem UTC z komunikatu o załadowaniu. Zdarzenia po tym czasie to kliknięcia uczestnika. Wszystkie zdarzenia z danych początkowych są starsze o co najmniej 26 godzin, więc dają drugi sposób rozdzielenia.
- **Ranga główna:** kolejność pierwszego zdarzenia `interview_invited` lub `rejected` dla każdego zgłoszenia. Porównaj udział zgłoszeń czekających ponad 3 dni (w danych początkowych) wśród pierwszych 4 decyzji: ON vs OFF.
- **Ranga dodatkowa:** kolejność pierwszego zdarzenia dowolnego rodzaju po załadowaniu (także „W przeglądzie”), bo zgłoszenie w etapie „Aplikacja wysłana” wymaga „W przeglądzie” przed zaproszeniem.
- Otwarcie zgłoszenia nie zostawia zdarzenia — obserwator zapisuje, które zgłoszenie uczestnik otworzył jako pierwsze.

## Arkusz obserwacji

| Uczestnik | Runda | Kolejka | Wariant | Czas załadowania (UTC) | Pierwsze otwarte zgłoszenie | Wspomniał o czekających zgłoszeniach bez podpowiedzi (tak/nie, cytat) | Uwagi |
| --------- | ----- | ------- | ------- | ---------------------- | --------------------------- | --------------------------------------------------------------------- | ----- |

Po każdej rundzie: wyeksportuj JSON i uzupełnij obie rangi na podstawie eksportu.

## Pytania na koniec

- Co zauważyłaś/zauważyłeś na pierwszym ekranie?
- Od czego zaczęłaś/zacząłeś i dlaczego?
- (ON) Co oznaczał komunikat o czekających zgłoszeniach? Czy zmienił kolejność Twojej pracy?
- (OFF) Czy któreś zgłoszenia wydawały się pilniejsze? Po czym to poznałaś/poznałeś?
- Czego brakowało, żeby szybciej podjąć decyzje?

## Ograniczenia

- Obie rundy pokazują te same dwie oferty BrightLabs z innymi kandydatami, więc w drugiej rundzie pomaga znajomość ofert. Kontrbalans ON/OFF rozkłada ten efekt na oba warianty.
- Odgrywanie roli mierzy zauważalność i zrozumiałość, nie efekt na zachowanie (`docs/case/CASE_PROTOCOL.md`). Zachowanie rzeczywistych pracodawców sprawdza exp-6 (e-mail na żywo, losowy podział).

## Ujawnienie danych przygotowanych

Kandydaci i zgłoszenia są syntetyczne; wiek zgłoszeń wyliczany od chwili załadowania; Match Score i podsumowania są stałe w scenariuszu (przygotowane, nie generowane przez AI na żywo); żaden e-mail nie jest wysyłany.
