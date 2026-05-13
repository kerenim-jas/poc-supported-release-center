# poc-supported-release-center — v0.3

> **Internal alignment POC** for the JFrog Supported Release Center.
> Built from Barak Haryati&rsquo;s SSDLC dashboard context and Ambarish&rsquo;s
> CVE&times;Service matrix — **v0.3 is a single-screen pivot**: the matrix is
> the product surface, with **mock runtime / Wiz-style exposure** wired per cell.

## Live preview

[https://kerenim-jas.github.io/poc-supported-release-center/](https://kerenim-jas.github.io/poc-supported-release-center/)

Password: `supported-releases-2026`

## Why a single screen?

After v0.2 shipped six navigation tabs, feedback was blunt: **the CVE&times;Service
matrix is the real deliverable** — the “Ambarish Excel” view — and the rest read
as context switching, not incremental insight. Separately, showing CVEs without
any sense of **what is running in prod, reachable in process, or internet-facing**
felt like a static report, not a triage workspace.

So v0.3 **drops Cores landing, Core/Services grids, Service detail, lifecycle
diagram, and SLA policy pages**. One full-height application view: filtered
heatmap + slide-in CVE intelligence + runtime badges. Fixtures still carry the
same org-aligned services and CVE catalog; overlays are synthesized for demo
purposes.

## What ships in v0.3

| Area | Behavior |
|---|---|
| Matrix home (`/`) | Tile heatmap: rows = CVEs (severity then prod exposure), columns = services grouped by Core |
| Filters | Left rail: severity, applicability, package ecosystem, runtime signals, cores, owner search |
| Runtime | Per cell: deployed / reachable / internet-facing / customer impact (+ mock pods & clusters when deployed) |
| Detail | Right drawer: CVE summary, blast radius list, runtime subsection, decorative actions |

See [docs/matrix-walkthrough.md](docs/matrix-walkthrough.md) for how to demo the layout to stakeholders.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy

GitHub Actions auto-deploys on push to `main`. The site is published at the URL above.

If `npm ci` fails with `403 Forbidden` from `jfrogrepo24.jfrog.io`, the lockfile contains internal Artifactory references — rewrite with:

```bash
sed -i '' 's|https://jfrogrepo24.jfrog.io/artifactory/api/npm/npm-virtual|https://registry.npmjs.org|g' package-lock.json
```

## File map

```
src/
  app/
    page.tsx                    Home — CVE × Service matrix application
    layout.tsx                  App shell + password gate wrapper
    globals.css                 JFrog design tokens
  components/
    MatrixApp.tsx               Client matrix + filters + slide-in CVE panel
    AppShell.tsx                Sidebar + chrome
    LeftSidebar.tsx             JFrog platform-style icon rail (Supported Releases active)
    ProductHeader.tsx           Product title, tenant/quarter labels (no tabs)
    TopBar.tsx                  Platform top bar chrome
    PasswordGate.tsx            Client-side password gate (unchanged)
  lib/
    types.ts                    Core, Service, CVE, CVEInstance, RuntimeSignal, CVEMatrixRow
    fixtures.ts                 Mirrors JFrog cores/services/CVEs + runtime injection pass
    cn.ts
```
