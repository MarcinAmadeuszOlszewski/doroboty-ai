# GUI — DoRoboty.ai Nocny błękit

Since 2026-11-06 the default visual direction for the whole application is **Nocny błękit** (night blue): minimalism in a night navy / cobalt / steel palette. It replaces Poster People as the required style for new and changed screens.

## Source of truth

- Rules: [.claude/skills/nocny-blekit/SKILL.md](.claude/skills/nocny-blekit/SKILL.md) — colors as roles, typography, layout, buttons, key components, checklist.
- Screen recipes: [.claude/skills/nocny-blekit/references/screens.md](.claude/skills/nocny-blekit/references/screens.md) — hero, listing, offer, employer panel, candidate evidence card (P6), waiting reminder (P11), mobile.
- Tokens: [.claude/skills/nocny-blekit/references/tokens.css](.claude/skills/nocny-blekit/references/tokens.css) (design reference) and the host layer actually used by the app: [tokens.css](tokens.css), [src/app/nocny-blekit.css](src/app/nocny-blekit.css) (night header/hero) and the `--pp-*` values in [src/app/marketplace-components.css](src/app/marketplace-components.css).
- Provenance: [.claude/skills/nocny-blekit/references/sources.md](.claude/skills/nocny-blekit/references/sources.md).

In Claude Code, run `/nocny-blekit` (or simply ask for a screen "w nocnym błękicie") to load the rules.

## Core rules (summary)

- Palette: night `#00043c` (header, hero, footer, H1–H2 accents), cobalt `#1f3fbf` — the **only** action/link/selection/focus color, steel `#4c5c7c` for secondary text, frost `#b4c0d0` for decorative lines only. Text ink `#0b1230`, page `#f4f6fa`, surfaces white. No pink, violet or orange accents.
- Working screens (listing, offer, workspace) stay light; night surfaces are limited to the site header and hero.
- Fonts: IBM Plex Sans 400/600 everywhere, IBM Plex Serif Light 300 only for the listing hero headline. Fonts are bundled locally via `@fontsource/ibm-plex-sans` and `@fontsource/ibm-plex-serif` (SIL OFL); never load remote fonts.
- Buttons: primary = cobalt fill + white label; outline = cobalt contour + cobalt label; on night = white contour pill. Reject decisions are outline, not red.
- Contours are 1px frost lines, no offset shadows; radii 6px (controls) / 8px (cards).

## Implement in this app

- Preserve the requested scope, React/TypeScript/Vite, hash routes, Base UI's `render` composition, Zod/local data operations and current workflows.
- Change visual roles through the host token layer and existing primitives. Do not create a parallel button/card library.
- Compare desktop and mobile, test long content, missing salary, keyboard focus, selection, dialogs and recovery. Run ./scripts/verify and report actual checks.

## Historical reference

The Poster People v1.0.0 kit in [docs/design-system/agent-kit](docs/design-system/agent-kit/design.md) stays unchanged as an immutable historical reference (`npm run design-system:check` still verifies it). Its anatomy (listing/offer composition, component families, responsive geometry) still underlies the host markup, but its colors, Geist Serif and pink actions are no longer the target.
