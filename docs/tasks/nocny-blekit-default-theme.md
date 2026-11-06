# Make Nocny błękit the default theme

## Intent

The user chose the "Nocny błękit" (night blue) direction from the moodboard (night header/hero from Axiom Space, listing/offer from Stripe Careers, employer panel and evidence card from IBM Carbon) and asked to make it the default style of the application, replacing Poster People.

## Scope

- Theme-level change: tokens, fonts, contours, radii, button variants, night public header and hero, line-art hero illustration.
- Guidance: GUI.md, CLAUDE.md, AGENTS.md, README.md, docs/architecture.md, docs/design-system/README.md (superseded notice), FEATURES.md (visual descriptions), skill `.claude/skills/nocny-blekit`.
- Out of scope: restructuring screen layouts to the skill's recipes (e.g. listing rows as two-line text rows, employer table, P6 evidence card, P11 reminder). Those are separate tasks.

## Acceptance criteria

- Cobalt `#1f3fbf` is the only action/link/selection color; no pink remains in runtime styles.
- Public header and listing/home hero are night `#00043c`; working screens are light (`#f4f6fa` / white).
- IBM Plex Sans/Serif are bundled locally via @fontsource; no remote fonts.
- Poster People kit stays byte-identical (`npm run design-system:check`).
- `./scripts/verify` (or `npm run check`) passes, with e2e theme assertions updated to the new values.
