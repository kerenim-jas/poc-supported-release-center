# poc-supported-release-center — v0.4

> Internal POC: **Trusted + Supported Release Center**. This drop mirrors **JFrog Platform / AppTrust** chrome fidelity while reframing runtime as an **Is it running?** rollup only (no exposures deep-dive).

**Live demo:**  
[https://kerenim-jas.github.io/poc-supported-release-center/](https://kerenim-jas.github.io/poc-supported-release-center/)

Password (unchanged): `supported-releases-2026`

---

## What changed from v0.3

| v0.3 | v0.4 |
| --- | --- |
| Single CVE×Service matrix workspace | Four-screen Trusted ∩ Supported navigator |
| Emphasis on Wiz-style overlays per matrix cell | Runtime limited to rollout + heartbeat hints |
| No AppTrust breadcrumbs / evidence tables | Sidebar + breadcrumbs + Evidence tab match AppTrust language |

All matrix-only components were removed (`MatrixApp`, old shell). Data is now modeled as **`SupportedRelease` docker lines intersecting SLA policy.**

---

## Strategic position

- Persona pivot: Release Manager / Release Coordinator **morning view** (distinct from SecOps triage dashboards like Wiz).
- Canonical filter: **`Trusted ∩ Supported`** — Trusted evidence from AppTrust / RBv2 / ssdlc, Supported per active SLA playbook; anything outside the window disappears automatically from the POC list.
- **Asaf dream widget**: *Post-Release | Newly Detected Critical CVEs on Supported Releases* — should default to smiles; demo ships with sample rows + `SHOW_EMPTY_DREAM_WIDGET` toggle in `DashboardView.tsx`.
- Fix lifecycle language follows Barak’s agent pattern: **Backlog → Action → Released → Rolled-out** with SLA pills.

---

## Screens

1. **`/` · Dashboard** — Overview card, dream widget, bottleneck card, KPI tiles, recent timeline.
2. **`/releases/` · Supported list** — Filter chips, search, urgency borders, lifecycle stepper, running badge.
3. **`/releases/[id]/`** — AppTrust-style version page: left metadata + runtime card, tabs (Timeline, CVEs, Content, Graph placeholder, Evidence, Risk).
4. **`/policy/` · SLA policy** — Support window, severity coverage by tier, SLA durations, automation toggles (decorative save).

---

## Local dev

```bash
cd /Users/kerenim/MCP/poc-supported-release-center
npm install
npm run dev
```

Static export (GitHub Pages):

```bash
npm run build   # writes to out/
```

Base path remains `/poc-supported-release-center` per `next.config.ts` (do not change for this repo).

---

## Docs

- [`docs/release-center-walkthrough.md`](docs/release-center-walkthrough.md) — three stakeholder walkthroughs + design notes.

---

## File map (v0.4)

```
src/
  app/
    layout.tsx
    page.tsx                 # Dashboard
    globals.css
    releases/page.tsx
    releases/[id]/page.tsx
    policy/page.tsx
  components/
    AppShell.tsx
    JFrogTopBar.tsx
    JFrogSidebar.tsx
    PageHeader.tsx
    PasswordGate.tsx         # unchanged contract
    DashboardView.tsx
    ReleasesListView.tsx
    ReleaseDetailView.tsx
    PolicyView.tsx
  lib/
    types.ts
    fixtures.ts
    cn.ts
```
