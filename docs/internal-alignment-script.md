# Internal Alignment Script — Supported Release Center v0.2

> **Audience:** Sophie Starchenko (AppTrust PM), Asaf Barkan (Security Strategy), Barak Haryati (SSDLC dashboard owner), Ambarish (Release Coordinator).
>
> **Goal:** Get all four stakeholders to one shared picture of *what* the Supported Release Center is, *who* owns which piece, and *what we ship next*. **Not** customer validation &mdash; that comes after alignment.
>
> **Format:** 60 minutes, walking through the live POC together. Capture decisions in writing in a follow-up doc.

---

## Pre-meeting prep

- Send the POC URL + password 24h in advance with this note: *"v0.2 of the Supported Release Center, built directly from your screenshots and Ambarish&rsquo;s Excel. It&rsquo;s a strawman to align around &mdash; please poke holes."*
- Have Screenshot 7 (vulnerability lifecycle diagram) open in a separate tab as a reference for terminology.
- Confirm everyone understands this is **not** to validate &mdash; it&rsquo;s to align.

---

## Section 1 &mdash; Frame the conversation (5 min)

**Open with:**

> "We&rsquo;ve been doing customer-facing work on a Supported Releases concept for the last few weeks, but the picture only became sharp after Asaf&rsquo;s call with Barak on May 13. Three things became obvious:
>
> 1. Barak&rsquo;s SSDLC dashboard already proves about 70% of the product. We&rsquo;re productizing what he built, not designing it from scratch.
> 2. Ambarish&rsquo;s CVE&times;Service Excel is the cross-cutting view of the same data &mdash; not a separate product, the same product viewed differently.
> 3. Sophie&rsquo;s AppTrust is the trust-evidence engine this view consumes &mdash; we need to ensure we&rsquo;re aligned on which side owns what.
>
> So before we put another line of code in the wrong place or take this to a customer, I want all of us in one room to agree the picture and the boundaries."

**Decision needed:** Are we all signing up to the framing that JFrog is the **System of Record** for the build &rarr; release &rarr; deploy &rarr; support lifecycle, and this product is the proof of that position?

---

## Section 2 &mdash; Walk through the POC (25 min)

In order. Pause for reactions after each screen.

### View A &mdash; Cores landing (`/`)

> "This is your Choose-a-Core, Barak. Same nine cores, same owners, same severity columns. Two additions: SLA breaches column on the right, and the explainer cards under the table for non-Barak audiences."

**Probe:**
- *Barak:* Anything missing here that you have today and would lose?
- *Sophie:* Where would AppTrust trust score / verification status live in this row?
- *Asaf:* Is this the right "executive overview" frame, or do we need a separate exec-only view?

### View B &mdash; Services grid (`/cores/jfrog-security`)

> "This is your service grid for one Core, Barak. xray-* cards, severity counts, SLA status pill, secured-distribution badge."

**Probe:**
- *Barak:* The filter chips along the top &mdash; do those match what you actually use? Anything to add?
- *All:* Is the "Showing 8 out of 8 services" count meaningful, or noise?

### View C &mdash; Service detail (`/services/artifactory-federation`)

> "Drill-down. Metadata header, severity pills, Within / Exceeded / No Data buttons, repo locations on the left, scan facts on the right, and the evidence modal you can open. Vulnerability table at the bottom with the lifecycle state per CVE."

**Probe:**
- *Sophie:* The evidence modal &mdash; is this the right shape for AppTrust&rsquo;s evidence model? What changes when AppTrust is the source instead of RBv2 + ssdlc-evidence?
- *Barak:* Anything in your real service detail page that I missed?
- *Asaf:* The Jira column on the bottom right &mdash; is this where we expect the new JFrog-native Jira sync to land?

### View D &mdash; CVE&times;Service matrix (`/matrix`)

> "Ambarish&rsquo;s view, productized. Each cell = number of components in that service affected by that CVE, color = worst SLA status across instances. Sticky CVE column on the left, services grouped by Core in the column headers."

**Probe:**
- *Ambarish:* What&rsquo;s in your Excel that&rsquo;s not here? (Get the gaps so we can prioritize them.)
- *Barak:* Should this matrix collapse / expand by Core, or is the flat view what the team actually wants?
- *All:* Is "components affected" the right cell metric, or "instances" or "files"?

### `/lifecycle`

> "Your state diagram, Barak &mdash; rendered as the canonical model that drives every SLA pill in the product. SLA Counting / No Breach zone on the left, SLA + Breach zone on the right, with the auto-close back-edges."

**Probe:**
- *Barak:* Did I get any transition wrong? (Especially the Renovate auto-close path.)
- *Asaf:* For the JFrog-native Jira integration, do we agree this is the lifecycle that Jira sync must honor?

### `/policy`

> "SLA Policy editor. Critical 5d / High 30d / Medium 90d, support window months, severity coverage by support tier (latest = full, supported = critical-only). Save it once, every other view in the product reflects it."

**Probe:**
- *Sophie:* If a customer&rsquo;s policy is defined in AppTrust today, does this editor read from there, or are these two separate policies?
- *Barak:* The "n-1 critical only" pain point you mentioned &mdash; want to expand high to n-1 here as the default?

---

## Section 3 &mdash; Boundary alignment (15 min)

Two questions per screen, captured in writing:

| Component | Who owns the data? | Who owns the UI? |
|---|---|---|
| SLA Policy storage | AppTrust evidence store? Or Supported-Release-Center settings? | This product |
| SLA evaluation | Barak&rsquo;s SSDLC computation engine, or AppTrust policy engine, or new? | This product |
| Trust evidence | AppTrust | Surfaced here, edited there |
| CVE source | Xray + JAS | This product reads only |
| Runtime "what&rsquo;s in prod" | JFrog Runtime / Narcissus | This product reads only |
| Vulnerability lifecycle state | This product (canonical) | This product |
| Jira sync | This product (replacing existing JFrog Jira integration) | This product |
| Customer&rarr;tenant join | Narcissus | Surfaced via "Customer impact" view (later) |
| End-of-Life metadata | JFrog Help Center scrape (today) &mdash; needs canonical home | This product reads only |

---

## Section 4 &mdash; Decide what ships first (10 min)

Strawman roadmap; ask the room to confirm or adjust:

| Milestone | Target date | Owner | Deliverable |
|---|---|---|---|
| **M1 &mdash; Picture lock** | This week | Keren | Signed-off PRD update reflecting v0.2 |
| **M2 &mdash; Data adapter spec** | +2 weeks | Asaf + Barak + Sophie | One doc covering the 9 data sources, who exposes what API, what we read |
| **M3 &mdash; First customer validation** | +4 weeks | Keren + 1 design partner | 3 customers walked through the live POC for "is this what you do today + would you adopt this?" |
| **M4 &mdash; AppTrust + Supported Release Center alignment** | +6 weeks | Sophie + Keren | Single roadmap, no overlapping work |
| **M5 &mdash; Engineering handoff** | Sept (Swampup) | TBD | Skeleton implementation as a JFrog Platform module |

---

## Section 5 &mdash; Capture (5 min)

**End the meeting with one question to each person:**

- *Barak:* "Is there anything in your real product that we haven&rsquo;t represented here that would be a deal-breaker if we shipped without it?"
- *Sophie:* "Where do you see overlap risk between AppTrust and this product, and what&rsquo;s the boundary you want?"
- *Ambarish:* "What's the one cell of the matrix that, if it&rsquo;s wrong, your team can&rsquo;t do their job?"
- *Asaf:* "What&rsquo;s the one thing about the strategic position that needs to change?"

Capture verbatim. Send the capture + decisions to all four within 24h.

---

## Anti-patterns to avoid

- **Don&rsquo;t pitch.** This is alignment, not selling. If you find yourself defending a screen, stop and listen.
- **Don&rsquo;t demo every state.** Show the canonical happy path; let them ask for edge cases.
- **Don&rsquo;t make decisions in the room about engineering scope.** That&rsquo;s a separate conversation with engineering leads.
- **Don&rsquo;t conflate this with customer validation.** Different audience, different script, different goals.
