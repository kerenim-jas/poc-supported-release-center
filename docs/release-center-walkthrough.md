# Trusted + Supported Release Center — walkthrough (v0.4)

Use this one-pager in alignment sessions with AppTrust + Release leadership. All data is **fixture-driven**; focus on **pattern**, not accuracy of numbers.

---

## Screen map

| Route | Intent |
| --- | --- |
| `/` | Morning digest + Asaf “dream widget” |
| `/releases/` | Prioritized registry of Trusted ∩ Supported docker lines |
| `/releases/[id]/` | Version-level drill-down (timeline, CVE rail, evidence) |
| `/policy/` | Slim SLA + automation contract editor |

---

## Walkthrough A — Sec Director morning check

1. Open `/` after password gate.
2. Call out **Supported Releases Overview** — tenant + SLA policy footnote + refresh timestamp.
3. Zoom **Post-Release · Newly Detected Critical CVEs on Supported Releases** — this is the emotional center: should be empty in real life, populated for demo.
4. Glance **Fix Lifecycle Bottlenecks** for stuck transitions (Barak model).
5. Finish on **SLA Breaches Today** KPI — red only when Release leadership must act.

---

## Walkthrough B — Release Coordinator triage

1. Navigate `/releases/`.
2. Toggle filters (Core, severity, running, customer impact) to show how the table reorders with **urgency rail** (red / amber / neutral left border).
3. Open `artifactory-federation-2.18.0` (or any hot row).
4. Walk **Version Timeline** tab first (promotion cadence + CVE lifecycle tail).
5. Switch to **Affected CVEs** — left rail selection matches Barak’s HTML prototype; expand cluster rollout on the right.
6. Mention **Runtime** card on the left — boolean + cluster mix only; no SecOps-style exposure graph.

---

## Walkthrough C — Release Manager SLA review

1. Open `/policy/`.
2. Explain **What is Supported?** (n−k minors + calendar window + severity coverage split between latest vs supported minors).
3. Adjust SLA durations live (decorative save) to show the form is lightweight vs v0.2 editor.
4. Highlight automation toggles as the bridge to Barak’s agent story (PR automation, clean-build closure, all-cluster DoD).

---

## Design decisions (POC scope)

1. **Trusted gate** — `isTrusted` + Evidence tab stand in for AppTrust certify + RBv2; we do not hit live APIs.
2. **Supported gate** — List view only includes `supportTier !== out_of_support`; KPI footnote still mentions Trusted-only versions aging out for narrative completeness.
3. **Runtime** — `RuntimeStatus` is intentionally shallow (clusters + rollout %). Anything resembling Wiz signal depth is out of scope on purpose.
4. **Customer impact** — Numeric field is decorative but keeps the Release Manager story tied to SaaS propagation.
5. **Empty dream widget** — Controlled via `SHOW_EMPTY_DREAM_WIDGET` in `DashboardView.tsx` for screenshot vs “happy path” demos.

---

## Password + hosting

- GitHub Pages URL + password remain stable from prior drops.
- `PasswordGate` component is unchanged; UI text may still reference earlier copy — ignore for functional access.
