import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePostHog } from "@posthog/react";
import { currentPerson, initialState, transition, type Action, type State } from "./model";
import { parseState, readState, saveState, type StoragePort } from "./storage";
function browserStorage(): StoragePort | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
function useStore() {
  const [loaded] = useState(() => readState(browserStorage()));
  const [state, setState] = useState(loaded.state);
  const [issue, setIssue] = useState(loaded.issue);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(loaded.blocked);
  const latest = useRef(state);
  function commit(next: State, replace = false) {
    latest.current = next;
    setState(next);
    setError("");
    if (blocked && !replace) return;
    try {
      saveState(browserStorage(), next);
      setIssue("");
      if (replace) setBlocked(false);
    } catch (e) {
      setIssue((e as Error).message);
    }
  }
  function run(action: Action) {
    try {
      commit(transition(latest.current, action));
      return true;
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "ZodError"
          ? e.message
          : "Sprawdź poprawność i długość wprowadzonych danych.",
      );
      return false;
    }
  }
  function importState(raw: string) {
    try {
      const next = parseState(raw);
      commit(next, true);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  return {
    state,
    issue,
    error,
    blocked,
    original: loaded.original,
    run,
    importState,
    clearError: () => setError(""),
    reset: () => commit(initialState(), true),
  };
}
type Store = ReturnType<typeof useStore>;
const Context = createContext<Store | null>(null);

function PostHogIdentity() {
  const { state } = usePrototype();
  const posthog = usePostHog();
  const identifiedPersonId = useRef<string | null>(null);
  const person = currentPerson(state);

  useEffect(() => {
    if (!person) {
      if (identifiedPersonId.current !== null) posthog.reset();
      identifiedPersonId.current = null;
      return;
    }

    if (identifiedPersonId.current === person.id) return;
    if (identifiedPersonId.current !== null) posthog.reset();

    posthog.identify(person.id, { name: person.name, role: person.role });
    identifiedPersonId.current = person.id;
  }, [person, posthog]);

  return null;
}

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return (
    <Context.Provider value={store}>
      <PostHogIdentity />
      {children}
    </Context.Provider>
  );
}
export function usePrototype() {
  const store = useContext(Context);
  if (!store) throw new Error("PrototypeProvider is required");
  return store;
}
