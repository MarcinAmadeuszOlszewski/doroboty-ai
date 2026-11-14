import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { STORAGE_KEY } from "./storage";
import { downloadText } from "./settings";

function readSavedScenario(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Presentational fallback; shows no error text, stack trace or user data. */
export function ErrorFallback({
  hasSavedData,
  onReload,
  onDownload,
}: {
  hasSavedData: boolean;
  onReload: () => void;
  onDownload: () => void;
}) {
  return (
    <main className="prototype-section mx-auto max-w-2xl p-6" role="alert">
      <h1 className="text-2xl font-semibold">Coś poszło nie tak</h1>
      <p className="mt-4">
        Aplikacja napotkała nieoczekiwany błąd i nie może wyświetlić tej strony. Dane zapisane w tej
        przeglądarce nie zostały usunięte ani wysłane nigdzie indziej.
      </p>
      <p className="mt-4">
        Spróbuj wczytać stronę ponownie. Jeśli błąd wraca, pobierz kopię zapisanych danych, a potem
        zresetuj scenariusz w ustawieniach lub zgłoś problem osobie prowadzącej warsztat.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" onClick={onReload}>
          Wczytaj ponownie
        </Button>
        {hasSavedData && (
          <Button type="button" variant="outline" onClick={onDownload}>
            Pobierz zapisane dane
          </Button>
        )}
      </div>
    </main>
  );
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  // Deliberately no componentDidCatch logging or reporting: render errors can contain private free text.
  render() {
    if (!this.state.failed) return this.props.children;
    const saved = readSavedScenario();
    return (
      <ErrorFallback
        hasSavedData={saved !== null && saved !== ""}
        onReload={() => window.location.reload()}
        onDownload={() => {
          if (saved) downloadText("doroboty-zapis-do-odzyskania.json", saved);
        }}
      />
    );
  }
}
