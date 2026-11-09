import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { initialState, transition, type Action, type State } from "./model";
import { parseState, readState, saveState, type StoragePort } from "./storage";
import {
  buildP11Session,
  readLoadInfo,
  readReminder,
  writeLoadInfo,
  writeReminder,
  type P11LoadInfo,
  type P11Queue,
} from "./p11";
function browserStorage(): StoragePort | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
/** Keep the signed-in persona across a replace when it still exists, so the workspace shell stays. */
function keepActivePerson(next: State, activePersonId: string | null): State {
  return activePersonId !== null && next.people.some((x) => x.id === activePersonId)
    ? { ...next, activePersonId }
    : next;
}
function useStore() {
  const [loaded] = useState(() => readState(browserStorage()));
  const [state, setState] = useState(loaded.state);
  const [issue, setIssue] = useState(loaded.issue);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(loaded.blocked);
  const [reminder, setReminderState] = useState(() => readReminder(browserStorage()));
  const [p11Load, setP11Load] = useState<P11LoadInfo | null>(() => readLoadInfo(browserStorage()));
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
  function loadP11Session(queue: P11Queue) {
    const at = new Date();
    commit(keepActivePerson(buildP11Session(at, queue), latest.current.activePersonId), true);
    const info = { queue, at: at.toISOString() };
    setP11Load(info);
    writeLoadInfo(browserStorage(), info);
  }
  function setReminder(on: boolean) {
    setReminderState(on);
    return writeReminder(browserStorage(), on);
  }
  function forgetP11Load() {
    setP11Load(null);
    writeLoadInfo(browserStorage(), null);
  }
  function importState(raw: string) {
    try {
      const next = parseState(raw);
      commit(next, true);
      forgetP11Load();
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
    reminder,
    setReminder,
    p11Load,
    loadP11Session,
    clearError: () => setError(""),
    reset: () => {
      commit(keepActivePerson(initialState(), latest.current.activePersonId), true);
      forgetP11Load();
    },
  };
}
type Store = ReturnType<typeof useStore>;
const Context = createContext<Store | null>(null);
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function usePrototype() {
  const store = useContext(Context);
  if (!store) throw new Error("PrototypeProvider is required");
  return store;
}
