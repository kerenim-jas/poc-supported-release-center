# Supported Release Center v0.3 — Matrix walkthrough (~5 min read)

Audience: Security leadership, Release Coordination, and Service Owners who need **one credible triage surface** tying vulnerability findings to runtime posture.

---

## Layout

1. **Header band** (full width above the workspace) — Title/subtitle (“CVE × Service Matrix” / grounded in runtime), **live-ish stats** from the current filtered set (CVE count vs services impacted, totals for deployed/reachable/internet-facing **cell counts**), and decorative actions (`Export CSV`, `Open in Jira`, Scope dropdown).
2. **Left filter rail** (~240 px, collapsible) — Mirrors tools like Wiz or GitHub Security: severity, applicability, package type, **runtime dimensions** (AND logic inside the category once checkboxes exist), cores, plus owner substring search.
3. **Main grid** — **Core sub-headers** then **rotated service names**. Each CVE row combines a sticky **CVE rail** (ID, severity + JFrog delta when relevant, fix version, **prod blast bar**) with **heatmap tiles** per visible service column.
4. **Right CVE drawer** — Triggered by a CVE rail click (overview) or a tile click (scrolls/accent-highlight to that service section). Sections: summary, blast-radius cards, runtime “currently running in” bullets when deployed, footer actions.

**Design decisions (unilateral POC calls)**

- **Runtime filter semantics:** If multiple runtime boxes are checked, a CVE row is shown only if **some affected cell satisfies all checked signals at once**. Unchecked runtime set = **no runtime filter**.
- **Header stat “internet-facing”** counts **heatmap cells** with `internetFacing=true`, not unique CVE IDs — faster to scan breadth of risky placements.
- **Column header highlighting:** Hovering column headers **does not** highlight the column; only row-level hover (light background) and cell tooltips emphasize focus.
- **Heat colors:** SLA breach dominates (red); else deployed+reachable ⇒ amber (“live path suspicion”); else green (within SLA / not in that hot combo). Grey tiles ⇒ affected but **not** deployed per fixture rules.

---

## Walkthrough A — Security Director morning triage

1. Open `https://kerenim-jas.github.io/poc-supported-release-center/` (gate password unchanged).
2. Glance header stats → confirm spike in amber/red-heavy rows after filters default to broad.
3. In the filter rail, tick **Deployed in prod + Reachable in execution** under Runtime — list narrows to “real morning panic” candidates.
4. Sorting is automatic: **Critical first**, then rows with more **prod-deployed** services rise.
5. Click a hot row → drawer opens; read blast radius; expand mental model with “Currently running in” pod/cluster lines.
6. Clear runtime filters, add **Critical** only under Severity — discuss organizational motion vs engineering queue.

---

## Walkthrough B — Service Owner “show me my estate”

1. Filter rail → **Service owner** search: type e.g. `Dyment` or `Korenfeld`.
2. Columns collapse to that owner’s services; CVE rows still show global context but limited columns.
3. Scan **vertical** slice: which CVEs touch my services? Where is the **green pulse** (deployed) vs grey (build-only)?
4. Click a tile on your service → drawer highlights that service card with a ring; use suggested action text to drive next step messaging.

---

## Walkthrough C — Release Coordinator fix ordering

1. Clear filters; Core checkboxes → multi-select only **JFrog DevOps + JFrog Security** to mimic cross-core dependency discussion.
2. Compare two Critical rows with similar width but different **prod blast** fill (orange micro-bar under fix version).
3. Prioritize the row whose orange bar shows **higher prod/total** ratio **and** more amber tiles (reachable + deployed).
4. Use decorative **Open Jira** / **Export CSV** in the header storyboard to discuss automation hooks (not wired in POC).

---

## Empty / edge states

- If filters eliminate every CVE, the main canvas shows **“No CVEs match these filters”** with a **Clear filters** affordance.
- Old v0.2 URLs (`/matrix`, `/cores/...`, `/services/...`, `/lifecycle`, `/policy`) **404 on static hosting** after deploy — expected.
