import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ErrorFallback } from "./error-boundary";
import { STORAGE_KEY, adoptExternalState, serializeState } from "./storage";
import { initialState } from "./model";

describe("ErrorFallback", () => {
  const noop = () => {};
  it("explains recovery without exposing error details", () => {
    const html = renderToStaticMarkup(
      createElement(ErrorFallback, { hasSavedData: true, onReload: noop, onDownload: noop }),
    );
    expect(html).toContain("Coś poszło nie tak");
    expect(html).toContain("Wczytaj ponownie");
    expect(html).toContain("Pobierz zapisane dane");
  });
  it("hides the download when nothing is saved", () => {
    const html = renderToStaticMarkup(
      createElement(ErrorFallback, { hasSavedData: false, onReload: noop, onDownload: noop }),
    );
    expect(html).not.toContain("Pobierz zapisane dane");
  });
});

describe("adoptExternalState", () => {
  it("adopts another tab's save but keeps this tab's persona", () => {
    const base = initialState();
    const [first, second] = base.people;
    const incoming = serializeState({ ...base, activePersonId: second.id });
    expect(adoptExternalState(incoming, first.id).activePersonId).toBe(first.id);
  });
  it("takes the incoming persona when this tab's persona is unknown", () => {
    const base = initialState();
    const incoming = serializeState({ ...base, activePersonId: base.people[1].id });
    expect(adoptExternalState(incoming, "missing-person").activePersonId).toBe(base.people[1].id);
  });
  it("rejects unreadable saves so the caller keeps its state", () => {
    expect(() => adoptExternalState("{not json", null)).toThrow();
    expect(STORAGE_KEY).toBe("doroboty.prototype.v1");
  });
});
