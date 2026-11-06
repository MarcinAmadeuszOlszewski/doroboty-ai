# DoRoboty.ai design system — project instructions

> **Superseded as the visual target (2026-11-06).** The application now uses **Nocny błękit** — see [GUI.md](../../GUI.md) and [.claude/skills/nocny-blekit](../../.claude/skills/nocny-blekit/SKILL.md). This directory and the Poster People kit remain as an immutable historical reference: the listing/offer anatomy, component families and responsive geometry below still describe the host markup, but colors, Geist Serif, pink actions and illustration are no longer required.

**Poster People v1.0.0 is the required visual reference for new and changed screens.** It is the accepted rounded, illustrated listing/offer system with Geist Serif headings. Use this directory before choosing page composition, typography, color or component treatment. The previous theme guidance has been removed at Wojtek's request.

This directory contains the complete immutable 67-file v1 agent kit and the receiving project's active integration guidance. The React application now has a host adaptation, mapped in [IMPLEMENTATION.md](IMPLEMENTATION.md). Treat current code as implementation to verify, not a second visual authority or proof of full acceptance. Apply the reference within the user's task scope; installing or updating guidance alone does not initiate a redesign.

**Required companions:** [host implementation rules](IMPLEMENTATION.md), [React host component catalog](HOST-COMPONENTS.md), [record/CV APIs](RECORDS.md), [application acceptance checklist](VERIFICATION.md) and [integration status/open findings](STATUS.md). They capture the prevention rules from A01–A08/R01–R04 and the implemented process, application, score, navigation and motion extensions. Read them before changing UI or declaring a finding closed.

## Read in this order

1. Root [AGENTS.md](../../AGENTS.md), [BRIEF.md](../../BRIEF.md) and the relevant [FEATURES.md](../../FEATURES.md) entries: preserve the frontend-only product contract.
2. This guide, [IMPLEMENTATION.md](IMPLEMENTATION.md), [HOST-COMPONENTS.md](HOST-COMPONENTS.md), relevant [RECORDS.md](RECORDS.md) sections and [VERIFICATION.md](VERIFICATION.md): host mapping, APIs, reuse, routes/state/focus and acceptance evidence. Check [STATUS.md](STATUS.md) before claiming closure.
3. [Agent entry point](agent-kit/design.md): composition, hierarchy, import order, extension boundaries and open questions.
4. [Component API and required anatomy](agent-kit/components/API.md): all 22 families, classes, state attributes, existing JavaScript API and data contracts.
5. [Human documentation](agent-kit/reference/index.html) or [full Markdown](agent-kit/reference/components.md): read the families relevant to the task. Compare [desktop listing](agent-kit/reference/evidence/S01.jpg), [mobile listing](agent-kit/reference/evidence/S02.jpg), [desktop offer](agent-kit/reference/evidence/S03.jpg) and [mobile offer](agent-kit/reference/evidence/S04.jpg). Other states are indexed in the [evidence manifest](agent-kit/reference/evidence/manifest.json).
6. Run the [component catalog](agent-kit/examples/components.html), [full listing](agent-kit/examples/index.html) and [offer](agent-kit/examples/oferta.html?id=1). Inspect structure and behavior, not just the first viewport.

All material is local to this repository. No global skill installation, old chat, deployed Site, account, network font or home-directory path is required.

## Authority and source boundaries

The user's current instructions and this project's product/security/workflow rules apply first. For visual decisions, use this integration guide, then agent-kit/design.md plus its code/reference. Treat the original [package decisions](agent-kit/CHANGES.md), [source provenance](agent-kit/provenance.json) and [original verification](agent-kit/VERIFICATION.md) as records of that standalone reference, not claims that this React app has already adopted or passed those checks.

The kit preserves its original HTML/CSS/ESM stack and examples verbatim. Its references to a separate teaching application describe the context at extraction time; this guide governs adoption in the receiving project. Do not follow older screenshot/style values from the current app when they conflict with the approved target. Record a missing design decision explicitly rather than silently inventing another theme.

## Files and local commands

| Material                           | Location / use                                                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Color/radius/font source           | [tokens.css](agent-kit/styles/tokens.css)                                                                             |
| Global foundation                  | [foundation.css](agent-kit/styles/foundation.css)                                                                     |
| Reusable component treatments      | [components.css](agent-kit/styles/components.css)                                                                     |
| Listing geometry                   | [listing.css](agent-kit/styles/listing.css)                                                                           |
| Offer geometry                     | [offer.css](agent-kit/styles/offer.css)                                                                               |
| Original semantic renderers        | [ui.js](agent-kit/components/ui.js) — standalone examples, not a React renderer                                       |
| Local font and license             | [Geist Serif Regular](agent-kit/assets/fonts/GeistSerif-Regular.woff2), [SIL OFL](agent-kit/assets/fonts/LICENSE.txt) |
| Illustration and provenance        | [people.png](agent-kit/assets/people.png), [illustration notes](agent-kit/assets/ILLUSTRATION.md)                     |
| Preserved screenshots and captures | agent-kit/reference/evidence/ and agent-kit/verification/                                                             |
| Reference integrity                | kit-manifest.json and verify-kit.mjs, separate from the immutable kit                                                 |

From the repository root, with Node 24:

```sh
npm run design-system:check
npm run design-system:dev
```

The first command verifies all 67 file hashes, local references, JavaScript syntax and six kit tests. The second serves the complete kit at http://127.0.0.1:8952/. For a port conflict, use `UI_KIT_PORT=8953 npm run design-system:dev`. No npm install inside the kit is needed; it has no dependencies. Serve the kit over HTTP because its examples use ES modules. The human reference HTML can also be opened directly.

The product remains `npm run dev` at http://127.0.0.1:3001/. These are separate entry points. The kit lives outside src/ and public/. The host deliberately resolves its bundled font and illustration through Vite, while keeping standalone controllers, fixture data, renderers and global styles out of product runtime imports. Host-owned adapted styles and components are listed in IMPLEMENTATION.md.

## Apply the system in React

1. Identify the route, existing feature component and shared controls involved. New feature code belongs in src/features; shared primitives remain in src/components/ui. Retain TypeScript, Vite, React Router hash routes, Base UI's `render` API and local scenario operations.
2. Use the kit's source values and anatomy as the implementation reference. Adapt markup into JSX and reusable host components. React owns rendering, state and handlers. Do not mount the standalone controllers, insert jobCard strings through dangerouslySetInnerHTML, or copy a second vanilla application into src/.
3. Map visual roles into the host token layer in [tokens.css](../../tokens.css) and [globals.css](../../src/app/globals.css), then adapt affected Base UI variants and feature compositions. Many existing components use `--gui-*` directly: semantic aliases alone will not complete a conversion. The variable prefix is an implementation detail; it does not mandate the removed theme. For a scoped task, contain changes in a theme/page boundary and verify shared consumers and portals. Global theme changes need the scope of the active task.
4. Preserve the kit's separation of common foundations/components from page geometry. For a standalone new HTML screen use the exact imports in agent-kit/design.md. For this app, adapt the equivalent roles and selectors rather than importing the kit's body/reset/headings globally over unrelated routes. Avoid two competing public button/card systems.
5. Reuse Base UI interaction semantics, labels, native input constraints and focus behavior. Port visual parts, variants and states together. Preserve product validation and feedback where the kit has no confirmed equivalent; document the integration decision rather than naming it an observed design-system variant.
6. Load Geist Serif locally from the bundled WOFF2, retaining its license. Use a Vite-resolved local asset URL/import or deliberately copied public asset and check the built URL. Use the same approach for the illustration. Never reference a home-directory path, file:// URL or remote font endpoint from the product.
7. Keep the current application data contracts, IDs, slugs, hash URLs and versioned persistence. The kit's 24 numeric jobs, query parameters, in-memory bookmarks and non-submitting application dialog are demonstration fixtures. They do not replace this app's personas, localStorage, saved jobs, local submissions, employer workflows or Zod validation. Map by visual role, not by importing sample domain state.

Useful starting roles when defining the host mapping:

| Kit role                   | Required target                                             | Host integration                                                                     |
| -------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Page / work surface        | Paper #f4f4f0 / white #fff                                  | Map background/canvas and card/control surfaces, including direct --gui-* consumers  |
| Text / contour             | Ink #181818, thin visible contour                           | Map foreground/text/border roles and component edges                                 |
| Primary action / selection | Pink #ff90e8 / ink with white                               | Adapt button/control variants; salary is a separate fact role                        |
| Salary / supporting fact   | Light pink #ffe0f7                                          | Keep noninteractive; do not repurpose it as a CTA or error color                     |
| Headings                   | Geist Serif Regular 400                                     | H1–H6, role-title typography and explicit display consumers; no synthetic serif bold |
| Body / controls            | Arial, Helvetica, system sans                               | Map body/interface roles separately from headings                                    |
| Shape                      | 10 / 18 / 24px source radii and documented local exceptions | Adapt component variants, not just the root radius                                   |

## Implemented host extensions

The [host catalog](HOST-COMPONENTS.md) maps actual React APIs and style owners. Reuse RecordSheet/ProcessTimeline/CvAttachment for submitted materials, MatchScore for score facts, BackLink for returns, ApplicationOfferPreview for form context and ConfettiBurst only after a successful submission. Employer answer/CV/note headings use the documented 26px H3 scale. CV file/preview content belongs only to the CV tab. Offer actions have 10px sibling separation; enabled actions share pointer/color feedback. Score colors are an explicit host exception to the usual light-pink supporting fact treatment; they do not alter salary or error/status roles.

[STATUS.md](STATUS.md) links implementation evidence and the five **open** company-page findings. Updating these integration files does not fix the company page or release a new immutable kit version.

## Required visual and interaction decisions

- Preserve the paper/white/ink/pink hierarchy, large rounded cards and restrained yellow illustration accents. The illustration supports people and context; it does not replace readable job facts or company identity.
- Use the actual type roles and wrapping rules. Listing titles are 28px base and 26px mobile, with the documented intermediate rules. Full role H1 is 64px base and 47px at <=700px. Long titles remain complete and increase height.
- Desktop listing: filters beside results. Mobile: a compact filter trigger and modal. Desktop offer: readable content plus sticky conditions/actions; mobile: role header, conditions/actions, description and employer in that order.
- Salary, currency, agreement basis and period stay together. Missing salary is explicit. Skill tags and salary facts are noninteractive. Categories are filter buttons, not fake tabs.
- Save controls have a stable accessible name and aria-pressed; preserve focus after updates. Dialogs are named, contain focus and restore it on close/Escape. Retain native keyboard and disabled/current-page semantics.
- Extend unsupported screens by composing these roles, not by introducing a new font/color/card family. Do not claim dark mode, loading/error patterns, an automatic current-section underline or additional serif weights were established by the reference.

## Completion checklist for a UI task

Record intent and acceptance criteria in docs/tasks/ and use a task branch. Implement within the requested scope; inspect all affected shared consumers if theme or primitive styles change. Update FEATURES.md for actual behavior changes and distinguish visual adoption from application feature changes.

Use the [acceptance checklist](VERIFICATION.md), run `./scripts/verify` (which includes design-system checks) and compare the resulting screen with the reference in the browser. A green gate or screenshot count alone is not visual acceptance. Compare 1280px desktop and 390px mobile against the relevant reference, check 320px overflow and intermediate reflow, and include a long Polish title, initials and missing salary. Exercise keyboard/focus, save/remove, filters, empty recovery, validation and dialogs; preserve this prototype's real local workflow. Report actual commands and browser checks, with any remaining gaps. The kit's old verification report does not verify new React work.

Keep agent-kit/ byte-identical as a versioned reference. Prettier and ESLint exclude it; its own check and the manifest validate it. Implement product changes in src/ and host tokens. Update the reference only through a deliberate new-version replacement with a reviewed manifest, provenance and examples. The participant source package includes this entire design-system directory.
