# Trusted + Supported Release Center — Demo Script

> **Audience:** Internal JFrog stakeholders (Release Managers, Product Security, Dev Owners, AppTrust + Xray + JAS PMs)
> **Length:** ~8 minutes spoken
> **Goal:** Get alignment that this is the right shape of the product before we invest deeper.
> **Live demo URL:** https://kerenim-jas.github.io/poc-supported-release-center/ — password `supported-releases-2026`

---

## 0. Opening (45s)

**Open at:** the password gate / dashboard.

> "Today I'm showing a prototype called the **Trusted + Supported Release Center**. The problem we're solving is simple to state, painful to live with: today nobody at JFrog can answer, in one place, **'which application releases are supported, are running in production, and have a security debt I need to act on this week?'** Teams answer this with spreadsheets and Slack threads. This prototype is an opinionated, productized version of what Barak and Ambarish built internally — so any team can have a Barak without needing to actually hire one."

> "It's an application-first view, with the dev owner, the SLA policy, the commit, and five finding dimensions — vulnerabilities, secrets, exposures, SAST, and contextual analysis — all in one surface. Let me show you."

---

## 1. Dashboard — the morning glance (90s)

**Navigate to:** `/` (Dashboard, the landing page).

**Point to:** "Newly Detected Critical Findings on Supported Applications" widget.

> "This is what a Release Manager opens at 9am. The top widget is what Asaf called the 'dream widget' — anything critical that just landed on a release we still support. Application, finding dimension, count, when it was detected. One scan, one decision: is this on my plate today?"

**Point to:** the **Fix Lifecycle Bottlenecks** widget (the stepper rows).

> "Below that, the bottlenecks view. Each row is a fix that's stuck somewhere on its journey from code → build → release → rollout. The red dot tells you where it's stuck and for how long. No prose, no JQL. A glance tells you the build pipeline is the chokepoint, not the dev team."

**Point to:** the supported-applications KPI tile at top.

> "And at the very top, the rolled-up numbers — supported applications, supported releases, integrity violations in production, tenants impacted. The 'so what' number."

---

## 2. Applications list — the daily working surface (2 min)

**Navigate to:** `/releases/` (titled **Supported Applications**).

> "When the dashboard says I have work to do, this is where I do it. Each row is one **application** — that's the unit a release manager actually owns. Image-and-version comes second; it's a drill-in."

**Point to** one row, e.g. **JFrog Artifactory**:

> "On a single row I see: the application name, the dev owner — name, email, team — and the **SLA policy** that governs it, which comes from AppTrust. That little chip is clickable; it tells me *why* this app is in scope and *what* 'supported' even means for it."

**Point to** the 5 small finding-dimension icons in the row.

> "Then the five finding dimensions — vulnerabilities, secrets, exposures, SAST, contextual analysis — each with a severity-aware count. This is where Ambarish's matrix lives now: every dimension that matters to a dev owner, rolled up by application."

**Point to** the runtime status indicator and tenants column.

> "And the runtime side: is it actually running? How many tenants are on it? Because a critical CVE on a release nobody runs is a different conversation than one with 200 tenants exposed."

**Point to** the **filter toolbar** at the top.

> "Filters along the top — JFrog Platform standard chips: severity, finding type, runtime status, stage. Nothing fancy, nothing that buries the table. The data is what the page is about."

---

## 3. Application detail — runtime to owner in one click (90s)

**Click** the **JFrog Artifactory** row → `/applications/app-artifactory/`.

> "Drilling in. On the left, the application card: the dev owner with email, the SLA policy as a clickable chip, business criticality, customer-facing flag, deployment model. This card is the answer to a question the runtime team has every week — *'who owns this thing, and who do I call?'*. The 'Notify owner' button is the **runtime-to-owner path** in one click."

**Point to** the right-side **Releases** tab.

> "On the right, this app's releases. Each row is an image-and-version with its commit SHA — and that's a piece of traceability the team explicitly told us they don't have today. From here you go one level deeper into a specific release."

---

## 4. Release detail — image, commit, five dimensions (2 min)

**Click** any release row → `/releases/<release-id>/`.

> "This is the leaf — one image at one version. AppTrust-style: timeline of stage promotions, evidence, risk. But three things that are deliberately not AppTrust:"

**Point to** the **Source** block on the left card.

> "One — the commit. Short SHA, message, author, branch, repo link. Click to go straight to the source. Traceability the SOX auditor and the dev owner both want."

**Point to** the **runtime status** + tenants on the left card.

> "Two — runtime context. Is it deployed? In which clusters? How many tenants?"

**Point to** the **five tabs**: Vulnerabilities / Secrets / Exposures / SAST / Contextual Analysis.

> "Three — and this is the biggest shift from the v0 prototype — five finding dimensions, not one. The reviewer feedback was very clear: CVE is just one lens. Secrets, exposures, SAST, and contextual analysis matter just as much. Each tab has its own table with severity, fix info, Jira link, lifecycle. Same chrome, same icons — the real JFrog severity icons from the Xray design — across every tab."

---

## 5. Optional 30-second deep dive — SLA policy (skip if running short)

**Navigate to:** `/policy/`.

> "And the SLA policy itself is editable. Critical 5 days, High 30 days, etc. Per support tier. Per severity. This is what powers the 'is it supported' question on every release across the whole product."

---

## 6. Closing — what this is, what's next (1 min)

**Navigate back to:** `/` (Dashboard).

> "To sum up — this is the same job Barak and Ambarish do today in spreadsheets and shell scripts, but as a JFrog Platform native product. Application-first, dev-owner-aware, commit-traceable, five-finding-dimension. Built on AppTrust SLA policies. Surfaces runtime through one lightweight signal: is it running, is it integrity-violated, is it idle."

> "What I want from this session: three things. **One**, does the application-first framing match how *you* think about your work? **Two**, are the five finding dimensions the right five, or am I missing one? **Three**, who's missing from this picture — what persona should I be showing this to next?"

> "Demo URL is in the chat. Password is `supported-releases-2026`. Happy to dig into any screen."

---

## Backup talking points (if asked)

- **"How does this relate to AppTrust?"** → The SLA policy *is* an AppTrust artifact. We're not replacing AppTrust — we're consuming its policies and applying them to the supported-release lifecycle.
- **"How does this relate to Wiz?"** → Runtime data could come from Wiz or from JFrog Runtime — the product is source-agnostic. The product cares about *the signal* (running / integrity-violated / not-running), not who provides it.
- **"What's productized vs. fixture data?"** → Today: 100% fixture data. The data model and the SLA evaluation logic are designed to map directly onto Jira fields + AppTrust release bundles + Xray findings + runtime signals.
- **"What's the smallest version that ships?"** → Applications list + Application detail + SLA policy editor + one finding dimension (vulnerabilities). The rest is incremental.
