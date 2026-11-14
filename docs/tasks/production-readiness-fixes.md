# Production readiness fixes

## Intent

Close the findings of the first dev-stage readiness audit (docs/production-readiness.html) that can be fixed locally.

## Acceptance criteria

- docs/production-readiness.html (generated) no longer fails `prettier --check`.
- A save written in another tab of the same browser is adopted without reload and is never overwritten by an older tab state. Each tab keeps its own signed-in persona. An unreadable incoming save keeps the tab state and blocks writes until export/reset/import.
- A render error shows a Polish recovery page with reload and download of the saved scenario; nothing is logged or sent.
- docs/smoke-plan.md lists the post-publication checks for the static build.
- FEATURES.md SYS-09 updated and SYS-12 added.
- `engines.node` pinned to `24.x` (package.json and lockfile) so Vercel builds on the Node version of `.nvmrc` and CI.

## Evidence

See the final report in the conversation and the refreshed docs/production-readiness.html. Local runs used Node v26; the full gate needs Node 24.
