@AGENTS.md

Start with npm ci and npm run dev. Do not infer work from historical course material. Keep durable task notes in docs/tasks and review the actual diff before claiming completion.

## UI work follows Nocny błękit

The default visual direction is **Nocny błękit** (night blue). Read [GUI.md](GUI.md) and the skill [.claude/skills/nocny-blekit/SKILL.md](.claude/skills/nocny-blekit/SKILL.md) (run `/nocny-blekit`) before any UI work; use its screen recipes and tokens. Implement through the host token layer ([tokens.css](tokens.css), [src/app/nocny-blekit.css](src/app/nocny-blekit.css), [src/app/globals.css](src/app/globals.css)) and existing Base UI `render` components; preserve hash routing, Zod, persona data, localStorage and application/employer workflows.

The Poster People kit in docs/design-system/agent-kit is an immutable historical reference: keep it unchanged and keep `npm run design-system:check` passing, but do not use its colors, Geist Serif or pink actions as the target. Validate new UI at desktop/mobile widths and with keyboard/state checks, run ./scripts/verify, update FEATURES.md for actual behavior changes and report actual evidence.
