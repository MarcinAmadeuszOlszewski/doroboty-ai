import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { usePrototype } from "./store";
import { serializeState, MAX_IMPORT_BYTES } from "./storage";
import { PageTitle } from "./shell";
import { P11_QUEUES, isP11Session, type P11Queue } from "./p11";

type Pending = "reset" | "import" | `p11-${P11Queue}` | null;
const localTime = new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit" });
function utcLabel(iso: string) {
  return `${iso.slice(0, 16)}Z`;
}
function pendingCopy(pending: Pending) {
  if (pending === "reset")
    return { title: "Zresetować scenariusz?", label: "Resetuj", description: replaceNote };
  if (pending === "import")
    return { title: "Zastąpić dane scenariusza?", label: "Importuj", description: replaceNote };
  if (pending?.startsWith("p11-"))
    return {
      title: `Załadować kolejkę ${pending.slice(4)}?`,
      label: "Załaduj",
      description:
        "Lokalne dane zostaną zastąpione syntetyczną kolejką zgłoszeń BrightLabs. Wyeksportuj dane poprzedniej rundy przed załadowaniem.",
    };
  return { title: "", label: "Potwierdź", description: "" };
}
const replaceNote = "Ta operacja zastąpi lokalne zmiany. Możesz najpierw wyeksportować dane.";

export function downloadText(name: string, text: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function SettingsPage() {
  const { state, reset, importState, original, reminder, setReminder, p11Load, loadP11Session } =
    usePrototype();
  const [pending, setPending] = useState<Pending>(null);
  const [reminderError, setReminderError] = useState(false);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function readFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setError("");
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) {
      setError("Plik jest za duży (maksymalnie 2 MB).");
      return;
    }
    try {
      setRaw(await file.text());
      setPending("import");
    } catch {
      setError("Nie udało się odczytać pliku.");
    }
  }
  function confirm() {
    if (pending === "reset") {
      reset();
      setMessage("Przywrócono scenariusz początkowy.");
    } else if (pending?.startsWith("p11-")) {
      loadP11Session(pending.slice(4) as P11Queue);
    } else if (pending === "import" && importState(raw)) {
      setMessage("Dane zostały zaimportowane.");
    }
    setPending(null);
  }
  const copy = pendingCopy(pending);
  return (
    <>
      <PageTitle>Ustawienia prototypu</PageTitle>
      <section className="prototype-panel prototype-form">
        <h2>Dane scenariusza</h2>
        <p>
          Zmiany są zapisane tylko w tej przeglądarce. Wysłanie linku innej osobie nie przenosi
          Twoich danych. Eksport pozwala przekazać scenariusz lub zachować kopię przed resetem.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => downloadText("doroboty-scenariusz.json", serializeState(state))}
          >
            Eksportuj dane
          </Button>
          <Button variant="outline" render={<label />}>
            Importuj dane
            <input
              className="sr-only"
              type="file"
              accept="application/json,.json"
              aria-label="Importuj plik scenariusza"
              onChange={readFile}
            />
          </Button>
          {original !== null && (
            <Button
              variant="outline"
              onClick={() =>
                downloadText("doroboty-zapis-do-odzyskania.txt", original, "text/plain")
              }
            >
              Pobierz poprzedni zapis
            </Button>
          )}
        </div>
        <Button variant="destructive" onClick={() => setPending("reset")}>
          Resetuj scenariusz
        </Button>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        {message && <p role="status">{message}</p>}
      </section>
      <section className="prototype-panel prototype-form mt-6" aria-labelledby="p11-heading">
        <h2 id="p11-heading">Sesja testowa P11</h2>
        <p>
          Symulacja dla prowadzącego. Załadowanie kolejki zastępuje lokalne dane jedną syntetyczną
          kolejką zgłoszeń BrightLabs (A lub B). Czas oczekiwania liczymy od chwili załadowania,
          więc ładuj kolejkę tuż przed rundą i wyeksportuj dane poprzedniej rundy przed kolejnym
          załadowaniem.
        </p>
        <div className="flex flex-wrap gap-3">
          {P11_QUEUES.map((queue) => (
            <Button key={queue} variant="outline" onClick={() => setPending(`p11-${queue}`)}>
              Załaduj kolejkę {queue}
            </Button>
          ))}
        </div>
        {p11Load && isP11Session(state) && (
          <p role="status">
            Załadowano sesję P11 · kolejka {p11Load.queue} ·{" "}
            {localTime.format(new Date(p11Load.at))} (UTC {utcLabel(p11Load.at)})
          </p>
        )}
        <label className="p11-setting">
          <Checkbox
            checked={reminder}
            onCheckedChange={(value) => setReminderError(!setReminder(value))}
            aria-label="Przypomnienie o czekających zgłoszeniach w tej rundzie"
          />
          <span>Przypomnienie o czekających zgłoszeniach w tej rundzie</span>
        </label>
        <p>Przypomnienie: {reminder ? "włączone" : "wyłączone"}</p>
        {reminderError && (
          <p className="error-message" role="alert">
            Nie udało się zapisać ustawienia — po odświeżeniu przypomnienie wróci do „włączone”.
          </p>
        )}
        <p className="text-muted-foreground">
          Ustawienie nie trafia do eksportu — zapisz wariant rundy w notatkach sesji.
        </p>
      </section>
      <section className="prototype-panel prototype-form mt-6">
        <h2>O prototypie</h2>
        <p>
          Wybór osoby zastępuje logowanie. Propozycje AI, Match Score i podsumowania odtwarzają
          przygotowany scenariusz; nie oceniają kompetencji. Używaj przykładowych danych i CV.
        </p>
      </section>
      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(v) => {
          if (!v) setPending(null);
        }}
        title={copy.title}
        description={copy.description}
        label={copy.label}
        pending={false}
        onConfirm={confirm}
      />
    </>
  );
}
export function PrivacyPage() {
  return (
    <section className="prototype-section max-w-4xl">
      <h1>Prywatność prototypu</h1>
      <div className="mt-6 space-y-5">
        <p>
          Ta wersja służy do ćwiczeń i testów interfejsu. Nie wpisuj prawdziwych danych osobowych
          ani poufnych informacji.
        </p>
        <p>
          Profile, aplikacje i ustawienia pozostają w pamięci tej przeglądarki. Aplikacja nie wysyła
          ich do bazy, dostawcy AI ani systemu analitycznego. Plik eksportu zawiera cały lokalny
          scenariusz, w tym notatki.
        </p>
        <p>
          Możesz usunąć zmiany przyciskiem „Resetuj scenariusz” w ustawieniach lub wyczyścić dane
          witryny w przeglądarce. Hosting może prowadzić własne logi dostępu.
        </p>
      </div>
    </section>
  );
}
