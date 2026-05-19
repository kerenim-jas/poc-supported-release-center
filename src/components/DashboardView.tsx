"use client";

import Link from "next/link";
import { Pencil, BadgeCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FindingDimensionChips } from "@/components/FindingChips";
import {
  LAST_REFRESH_ISO,
  TENANT_NAME,
  OVERVIEW_POLICY_BLURB,
  APPLICATIONS,
  RELEASES,
  FIX_BOTTLENECKS,
  RECENT_ACTIVITY,
  buildPostReleaseCriticalRows,
  OUT_OF_SUPPORT_TRUSTED_COUNT,
} from "@/lib/fixtures";
import { worstSlaForRelease } from "@/lib/findings";

/**
 * DEMO: set to true to showcase Asaf’s “always empty, smiling dashboard” empty state.
 * Default false keeps the post-release critical widget populated for stakeholder demos.
 */
const SHOW_EMPTY_DREAM_WIDGET = false;

function fmtTime(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} · ${d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function DashboardView() {
  const dreamRowsRaw = buildPostReleaseCriticalRows(RELEASES);
  const dreamRows = SHOW_EMPTY_DREAM_WIDGET ? [] : dreamRowsRaw;

  const prodRunning = RELEASES.filter(
    (r) =>
      (r.runtime.state === "running" ||
        r.runtime.state === "integrity_violation") &&
      r.currentStage === "PROD",
  ).length;
  const runningPct =
    RELEASES.length > 0
      ? Math.round((prodRunning / RELEASES.length) * 100)
      : 0;

  const breachReleaseCount = RELEASES.filter((r) => {
    const w = worstSlaForRelease(r);
    return w.status === "breached";
  }).length;

  return (
    <div className="mx-auto flex min-h-full max-w-[1280px] flex-col px-6 pb-10">
      <PageHeader
        crumbs={[
          { label: "All Projects", href: "/" },
          { label: "Supported Releases", href: "/releases/" },
          { label: "Dashboard" },
        ]}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {/* Overview */}
        <div className="rounded-lg border border-[color:var(--border-primary)] bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">
                Supported Releases Overview
              </p>
              <h2 className="mt-2 text-[16px] font-semibold text-[color:var(--text-primary)]">
                Release Center Overview
              </h2>
            </div>
            <button
              type="button"
              className="rounded p-1.5 text-[color:var(--icon-secondary)] hover:bg-[color:var(--surface-secondary)]"
              aria-label="Edit overview"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <dl className="mt-4 space-y-3 text-[13px]">
            <div>
              <dt className="text-[color:var(--text-secondary)]">Tenant</dt>
              <dd className="font-semibold text-[color:var(--text-primary)]">
                {TENANT_NAME}
              </dd>
            </div>
            <div>
              <dt className="text-[color:var(--text-secondary)]">Active SLA policy</dt>
              <dd>{OVERVIEW_POLICY_BLURB}</dd>
            </div>
            <div>
              <dt className="text-[color:var(--text-secondary)]">
                Trusted + Supported intersection
              </dt>
              <dd className="inline-flex items-center gap-2 font-semibold">
                <BadgeCheck className="h-4 w-4 text-[color:var(--green-500)]" />
                {APPLICATIONS.length} applications · {RELEASES.length} releases
              </dd>
            </div>
            <div>
              <dt className="text-[color:var(--text-secondary)]">Last refresh</dt>
              <dd>{fmtTime(LAST_REFRESH_ISO)}</dd>
            </div>
          </dl>
        </div>

        {/* Dream widget */}
        <div
          className="flex flex-col rounded-lg border-[3px] bg-[color:var(--platform-post-release-bg)] p-4 shadow-sm lg:col-span-1"
          style={{ borderColor: "var(--platform-post-release-border)" }}
        >
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Post-Release · Newly Detected Critical Findings on Supported Applications
          </h3>
          <p className="mt-1 text-[12px] text-[color:var(--text-secondary)]">
            Aggregated by application across five finding dimensions.
          </p>

          {dreamRows.length === 0 ? (
            <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-3 pb-10 text-center">
              <span className="text-5xl leading-none">🐸</span>
              <p className="max-w-[280px] text-[14px] font-semibold text-[color:var(--green-500)]">
                You&apos;re good! No newly detected critical findings on supported applications.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {dreamRows.slice(0, 6).map((row) => (
                <li
                  key={row.applicationId}
                  className="rounded-md border border-[color:var(--border-primary)] bg-white px-3 py-2.5 shadow-sm"
                >
                  <Link
                    href={`/applications/${row.applicationId}/`}
                    className="block truncate text-[13px] font-semibold text-[color:var(--platform-teal-accent)]"
                  >
                    {row.applicationName}
                  </Link>
                  <span className="block font-mono text-[11px] text-[color:var(--text-tertiary)]">
                    {row.label}
                  </span>
                  <span className="block text-[12px] text-[color:var(--text-secondary)]">
                    {new Date(row.detectedDate).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <FindingDimensionChips
                    size="xs"
                    counts={{
                      vulnerabilities: row.vulnCount,
                      secrets: row.secretCount,
                      exposures: row.exposureCount,
                      sast: row.sastCount,
                      contextual: row.contextualCount,
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottlenecks */}
        <div className="rounded-lg border-[2px] border-[color:var(--green-500)] bg-[color:var(--green-100)]/35 p-4 shadow-sm">
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Fix Lifecycle Bottlenecks
          </h3>
          <p className="mt-1 text-[12px] text-[color:var(--text-secondary)]">
            Barak&apos;s lifecycle model · top stuck transitions
          </p>
          <ul className="mt-4 space-y-3 text-[13px]">
            {FIX_BOTTLENECKS.map((b) => (
              <li key={b.cveId + b.service} className="rounded-md bg-white/80 px-3 py-2 shadow-sm">
                <span className="font-semibold text-[color:var(--text-primary)]">{b.cveId}</span>{" "}
                <span className="text-[color:var(--text-secondary)]">
                  · {b.applicationName ?? b.service}
                  {b.releaseVersion ? ` / ${b.releaseVersion}` : ""} — {b.stage}{" "}
                  <span className="italic text-[color:var(--text-tertiary)]">
                    ({b.daysInStage}d in stage)
                  </span>
                </span>
                <span className="mt-1 block text-[12px] text-[color:var(--text-secondary)]">
                  {b.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Kpi
          title="Supported Applications"
          value={`${APPLICATIONS.length}`}
          sub={`Tier-1 · ${APPLICATIONS.filter((a) => a.businessCriticality === "tier-1").length} · customer-facing · ${APPLICATIONS.filter((a) => a.customerFacing).length}`}
        />
        <Kpi
          title="Supported Docker Releases"
          value={`${RELEASES.length}`}
          sub={`Latest · ${RELEASES.filter((r) => r.supportTier === "latest").length} · Supported back · ${RELEASES.filter((r) => r.supportTier === "supported").length} · Out of support · ${OUT_OF_SUPPORT_TRUSTED_COUNT}`}
        />
        <Kpi
          title="Currently Running in Prod"
          value={`${prodRunning}`}
          sub={`${runningPct}% of Trusted+Supported (${RELEASES.length})`}
          accent={
            prodRunning >= RELEASES.length * 0.6
              ? "green"
              : "amber"
          }
        />
        <Kpi
          title="SLA Breaches Today"
          value={`${breachReleaseCount}`}
          sub={`across ${RELEASES.length} Trusted+Supported releases`}
          accent={breachReleaseCount === 0 ? "green" : "red"}
        />
      </section>

      <section className="mt-10 rounded-lg border border-[color:var(--border-primary)] bg-white p-6 shadow-sm">
        <h3 className="text-[14px] font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">
          Recent Activity
        </h3>
        <ol className="relative mt-6 space-y-0 border-l border-[color:var(--border-secondary)]">
          {RECENT_ACTIVITY.map((evt, idx) => (
            <li key={evt.ts + idx} className="relative pl-9 pb-6 last:pb-0">
              <span
                className="absolute left-[-5px] top-1 flex h-[10px] w-[10px] rounded-full bg-[color:var(--border-secondary)] ring-4 ring-white"
                style={{
                  background:
                    evt.tone === "green"
                      ? "var(--green-500)"
                      : evt.tone === "amber"
                        ? "var(--orange-500)"
                        : "var(--red-500)",
                  boxShadow: "0 0 0 3px rgba(62,176,101,0.15)",
                }}
              />
              <p className="text-[13px] text-[color:var(--text-secondary)]">
                <span className="font-semibold text-[color:var(--text-primary)]">
                  {fmtActivityDate(evt.ts)}
                </span>{" "}
                — {evt.label}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function fmtActivityDate(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} · ${d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function Kpi({
  title,
  value,
  sub,
  accent,
}: {
  title: string;
  value: string;
  sub: string;
  accent?: "green" | "amber" | "red";
}) {
  const tint =
    accent === "green"
      ? "text-[color:var(--green-500)]"
      : accent === "red"
        ? "text-[color:var(--red-500)]"
        : accent === "amber"
          ? "text-[color:var(--orange-500)]"
          : "text-[color:var(--text-primary)]";
  return (
    <article className="rounded-lg border border-[color:var(--border-primary)] bg-white px-5 py-4 shadow-sm">
      <h4 className="text-[12px] font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">
        {title}
      </h4>
      <p className={`mt-2 text-[28px] font-bold leading-none ${tint}`}>{value}</p>
      <p className="mt-2 text-[12px] text-[color:var(--text-secondary)]">{sub}</p>
    </article>
  );
}
