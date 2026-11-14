# Smoke plan after publishing the static build

Run after every publication to the target address (replace `$URL` with the published base address). Use a private window so no earlier saved scenario interferes.

1. Open `$URL/`. The home page renders with fonts and the line-art illustration; the browser console shows no failed requests.
2. Open a deep link, for example `$URL/#/oferty/ai-product-manager`, in a new tab. The offer renders (hash routes need no server rewrite).
3. Sign in as Anna Kowalska (`/#/auth/sign-in`), open `/#/app/profil`, and use "Pobierz CV (PDF)". A PDF downloads and opens.
4. Open `$URL/case/baseline.csv`. It returns CSV text starting with `id,release,candidateId`.
5. Publish a job as Karolina Wiśniewska, switch to Anna, apply, switch back and record the employer decision. Reload: the data persists.
6. Open Settings, export the scenario, then reset and import the exported file. The scenario is restored.
7. Confirm the tab title is "DoRoboty.ai" and the favicon loads.

Failure of any step: re-publish the previous known-good commit (see the rollback procedure once a host is chosen), repeat this plan and tell the repository owner.
