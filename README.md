# poc-supported-release-center — v0.2

> **Internal alignment POC** for the JFrog Supported Release Center.
> Built from Barak Haryati&rsquo;s SSDLC dashboard (the working internal product
> at JFrog P&E, May 2026) and Ambarish&rsquo;s CVE&times;Service Excel matrix.
>
> Replaces [`poc-release-center`](https://github.com/kerenim-jas/poc-release-center) (v0.1) which framed the product around a generic Release Manager persona and standalone Runtime data &mdash; both invalidated by the calls with Sahar Bracha (May 10) and Barak Haryati (May 13).

## Live preview

[https://kerenim-jas.github.io/poc-supported-release-center/](https://kerenim-jas.github.io/poc-supported-release-center/)

Password: `supported-releases-2026`

## Why this version exists

Two May 2026 calls reshaped the product:

| What we thought (v0.1) | What we know now (v0.2) |
|---|---|
| Persona = generic Release Manager | Personas = Sec Director (Barak), Release Coordinator (Ambarish), Service Owner (per-Core lead) |
| Flat list of "supported releases" by quarter | Cores &rarr; Services &rarr; Service Versions &rarr; CVE instances |
| Headline value = runtime tie-in | Runtime is one data source feeding the SLA dashboard, not the headline |
| "Validated in runtime" is the trust signal | Trusted Apps / Secured Distribution (RBv2 + ssdlc-evidence) is the actual trust signal already in JFrog |
| Per-quarter calendar | SLA Policy + Vulnerability Lifecycle state machine |
| Integrity drift inside the RM POC | Integrity belongs in the Wiz augmentation POC (separate) |

## What&rsquo;s in the POC

Five canonical screens, all hardcoded from fixture data that mirrors real JFrog Cores, services, and owners:

| Screen | Source screenshot | Purpose |
|---|---|---|
| `/` &mdash; Cores landing | Screenshot 3 (Choose a Core) | Executive overview &mdash; SLA breaches per Core, trust counts |
| `/cores/[coreId]` &mdash; Services grid | Screenshot 9 (xray-* cards) | Daily triage view for a Core lead |
| `/services/[serviceId]` &mdash; Service detail | Screenshots 6/8/10 (artifactory-federation) | Drill-down with repo locations, scan status, evidence modal |
| `/matrix` &mdash; CVE&times;Service matrix | Screenshot 2 (Ambarish&rsquo;s pivot) | Cross-cutting triage &mdash; one CVE across many services |
| `/lifecycle` &mdash; Vulnerability lifecycle | Screenshot 7 (Backlog &rarr; Action &rarr; Released &rarr; Closed) | The state machine that drives every SLA pill |
| `/policy` &mdash; SLA Policy editor | New &mdash; based on CISO Policy doc | Edit Critical 5d / High 30d / Medium 90d, support window, severity coverage |

## Strategic position to land in alignment meetings

**JFrog must be the System of Record for the build &rarr; release &rarr; deploy &rarr; support lifecycle.** The Supported Release Center is the proof of that position.

- Barak&rsquo;s SSDLC dashboard exists today because no one else gives him this view &mdash; he had to build it. We productize his pattern so every JFrog customer gets it without needing a Barak.
- Ambarish&rsquo;s CVE&times;Service Excel is the cross-cutting view of the same data &mdash; same product, different cut.
- Sophie&rsquo;s AppTrust is the policy + evidence engine that this view *consumes*, not competes with.
- Sahar (Mar Tech / consumer side) opens this every morning to triage his Core.

## Audience for this POC

This v0.2 POC is built for **internal alignment**, not customer validation. Use it to:

1. Land the picture with Asaf so we share one mental model.
2. Show Sophie how AppTrust&rsquo;s evidence integrates with the Cores view.
3. Show Barak that we&rsquo;re productizing what he already built (not competing with it).
4. Show Ambarish that the matrix view is in the product, not a sidecar.
5. Take a separate validation script to **customers** &mdash; that&rsquo;s a later artifact, not this one.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy

GitHub Actions auto-deploys on push to `main`. The site is published at the URL above.

If `npm ci` fails with `403 Forbidden` from `jfrogrepo24.jfrog.io`, the lockfile contains internal Artifactory references &mdash; rewrite with:

```bash
sed -i '' 's|https://jfrogrepo24.jfrog.io/artifactory/api/npm/npm-virtual|https://registry.npmjs.org|g' package-lock.json
```

## File map

```
src/
  app/
    page.tsx                          View A — Cores landing
    cores/[coreId]/page.tsx           View B — Services grid
    services/[serviceId]/             View C — Service detail
    matrix/page.tsx                   View D — CVE × Service matrix
    lifecycle/page.tsx                Vulnerability Lifecycle diagram
    policy/page.tsx                   SLA Policy editor
  components/
    AppShell, LeftSidebar, TopBar     JFrog platform shell
    ProductHeader                     Tab navigation across the 5 views
    Pills                             SeverityPill, SLAStatusPill, TrustBadge, SupportTierPill, JFrogLogo
    EvidenceModal                     Secured Distribution evidence (Screenshot 11)
    PasswordGate                      Client-side password protection
  lib/
    types.ts                          Domain model (Core, Service, ServiceVersion, CVE, SLAPolicy, ...)
    fixtures.ts                       Hardcoded data mirroring real JFrog org + screenshots
    cn.ts                             Tailwind class helper
```
