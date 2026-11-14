# Publishing on Vercel

Decision (2026-11-14, repository owner): publish the static build on Vercel for a workshop audience of fewer than 30 participants. Plan assumed: Hobby (free); confirm it when creating the account. The repository owner reacts to outages and performs rollbacks.

Provider facts below were read from the Vercel documentation on 2026-11-14 (Vite on Vercel, Instant Rollback, Deployment Protection, Hobby plan, Node.js versions). Dashboard labels can change; re-check them when you follow the steps.

## Why no extra configuration is needed

- The app is static. `npm run build` writes `dist/`; no server, database or secrets exist (docs/SECURITY.md).
- Routes use the hash (`/#/...`) and `vite.config.ts` sets `base: "./"`, so no `vercel.json` rewrites are needed. Vercel only documents SPA rewrites for apps with path-based routes.

## One-time setup (repository owner)

1. Create a Vercel account on the Hobby plan and connect the GitHub repository `MarcinAmadeuszOlszewski/doroboty-ai`.
2. Project settings: framework preset Vite, install command `npm ci`, build command `npm run build`, output directory `dist`. Production branch: `case-forge` (the prototype is tested from this branch, not from `main`; the owner confirmed this on 2026-11-14).
3. Node.js version: `package.json` declares `engines.node` as `24.x`, matching `.nvmrc` and CI. Vercel documents that `engines` overrides the project setting, so builds use the latest Node 24. Local checks recorded in docs/production-readiness.html ran on Node 26 and the full gate still needs one run on Node 24.
4. Settings → Deployment Protection: keep "Standard Protection". It leaves the production domain public. "All Deployments" would make participants sign in to Vercel. Preview deployments stay protected.
5. Do not add environment variables; the app needs none.

## Release procedure

1. Push the change to `case-forge` after `./scripts/verify` passes on Node 24, or confirm it in CI.
2. Vercel builds every push to the production branch; the production deployment is tied to the commit SHA. Note the commit and the deployment URL.
3. Run docs/smoke-plan.md against the production address.

## Rollback

On the project overview page, use **Instant Rollback** on the Production Deployment tile (or the deployment list's menu), pick the previous deployment and confirm. On the Hobby plan only the immediately previous production deployment is offered; Pro can choose any earlier one.

After a rollback Vercel stops assigning new pushes to production. To resume normal releases, use **Manage** on the tile and promote a deployment, or run `vercel promote <deployment-url>`.

Data effect: scenarios live in each participant's browser and are not changed by a rollback. The saved format is `version: 1`; keep it backward compatible, because an old page must still read data saved by a newer one.

## If the site is down or broken

1. Open the production address in a private window. If it loads, ask the participant to reload; a broken tab can be fixed by exporting data in Settings, then reset and import.
2. If the latest release broke it, roll back as above and rerun docs/smoke-plan.md.
3. If Vercel itself is unavailable, wait or check the provider status page; no data is lost because all data stays in participants' browsers.
4. Tell participants in the workshop channel which step they should repeat, and that exported JSON files remain valid.

## Capacity and cost

Hobby includes 100 GB of Fast Data Transfer and 1,000,000 CDN requests per month. The whole `dist/` folder is about 15 MB, so even 30 participants each loading the full site 20 times is under 10 GB. Exceeding Hobby limits pauses the feature until the 30-day period ends; it does not bill a card.
