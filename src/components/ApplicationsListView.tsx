"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  FindingDimensionChips,
  ALL_FINDING_DIMENSIONS,
  FINDING_TYPE_LABELS,
} from "@/components/FindingChips";
import type {
  Application,
  FindingDimension,
  RuntimeState,
  Severity,
  SupportedRelease,
} from "@/lib/types";
import {
  APPLICATIONS,
  RELEASES,
  sortApplicationsForList,
} from "@/lib/fixtures";
import {
  appTenantSum,
  dimensionHasSeverity,
  dimensionHasType,
  getReleasesForApp,
  rollupDimensionCounts,
  worstSlaForApp,
} from "@/lib/findings";
import { cn } from "@/lib/cn";

const ALL_SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];
const ALL_RUNTIME_STATES: RuntimeState[] = [
  "running",
  "integrity_violation",
  "not_running",
];

function chipActive(active: boolean) {
  return cn(
    "rounded-full px-3 py-1 text-[12px] font-semibold border transition-colors",
    active
      ? "border-[color:var(--green-500)] bg-[color:var(--green-100)] text-[color:var(--green-500)]"
      : "border-[color:var(--border-secondary)] bg-white text-[color:var(--text-secondary)] hover:border-[color:var(--navy-500)]",
  );
}

function initSeverityOn(): Record<Severity, boolean> {
  return { critical: true, high: true, medium: true, low: true };
}

function initRuntimeOn(): Record<RuntimeState, boolean> {
  return {
    running: true,
    integrity_violation: true,
    not_running: true,
  };
}

function initFindingOn(): Record<FindingDimension, boolean> {
  return {
    vulnerabilities: true,
    secrets: true,
    exposures: true,
    sast: true,
    contextual: true,
  };
}

function releaseLabels(app: Application, releases: SupportedRelease[]) {
  const names = getReleasesForApp(app, releases).map((r) => r.imageName);
  return names.join(", ");
}

function releaseSummaryChip(app: Application, releases: SupportedRelease[]) {
  const rs = getReleasesForApp(app, releases);
  const supported = rs.filter((r) => r.supportTier === "supported").length;
  const latest = rs.filter((r) => r.supportTier === "latest").length;
  const violations = rs.filter(
    (r) => r.runtime.state === "integrity_violation",
  ).length;
  const idle = rs.filter((r) => r.runtime.state === "not_running").length;
  const parts: string[] = [];
  if (supported + latest > 0)
    parts.push(`${supported + latest} supported`);
  if (idle > 0) parts.push(`${idle} idle`);
  if (violations > 0) parts.push(`${violations} violation`);
  return parts.join(" · ") || `${rs.length} releases`;
}

function appMatchesFilters(
  app: Application,
  releases: SupportedRelease[],
  severityOn: Record<Severity, boolean>,
  findingOn: Record<FindingDimension, boolean>,
  runtimeOn: Record<RuntimeState, boolean>,
  stage: "any" | "latest" | "supported",
  cveNeedle: string,
): boolean {
  const rs = getReleasesForApp(app, releases);
  if (rs.length === 0) return false;

  const allSevOn = ALL_SEVERITIES.every((s) => severityOn[s]);
  if (!allSevOn) {
    const allowed = new Set(ALL_SEVERITIES.filter((s) => severityOn[s]));
    const hasSev = rs.some((r) =>
      ALL_FINDING_DIMENSIONS.some((dim) =>
        dimensionHasSeverity(r, dim, allowed),
      ),
    );
    if (!hasSev) return false;
  }

  const allFindOn = ALL_FINDING_DIMENSIONS.every((d) => findingOn[d]);
  if (!allFindOn) {
    const allowedDims = ALL_FINDING_DIMENSIONS.filter((d) => findingOn[d]);
    const hasType = rs.some((r) =>
      allowedDims.some((dim) => dimensionHasType(r, dim)),
    );
    if (!hasType) return false;
  }

  if (cveNeedle) {
    const hasCve = rs.some((r) =>
      r.cves.some((c) => c.cve.id.toLowerCase().includes(cveNeedle)),
    );
    if (!hasCve) return false;
  }

  const allRunOn = ALL_RUNTIME_STATES.every((s) => runtimeOn[s]);
  if (!allRunOn && !rs.some((r) => runtimeOn[r.runtime.state])) return false;

  if (stage === "latest" && !rs.some((r) => r.supportTier === "latest"))
    return false;
  if (stage === "supported" && !rs.some((r) => r.supportTier === "supported"))
    return false;

  return true;
}

function borderUrgency(releases: SupportedRelease[]) {
  const w = worstSlaForApp(releases);
  if (w.status === "breached")
    return "border-l-[3px] border-l-[color:var(--red-500)]";
  if (w.status === "within" && (w.daysRemaining ?? 999) <= 2)
    return "border-l-[3px] border-l-[color:var(--orange-500)]";
  return "border-l-[3px] border-l-transparent";
}

export function ApplicationsListView() {
  const [severityOn, setSeverityOn] = useState(initSeverityOn);
  const [findingOn, setFindingOn] = useState(initFindingOn);
  const [cveId, setCveId] = useState("");
  const [runtimeOn, setRuntimeOn] = useState(initRuntimeOn);
  const [stage, setStage] = useState<"any" | "latest" | "supported">("any");

  const sorted = sortApplicationsForList(APPLICATIONS, RELEASES);

  const filtered = useMemo(
    () =>
      sorted.filter((app) =>
        appMatchesFilters(
          app,
          RELEASES,
          severityOn,
          findingOn,
          runtimeOn,
          stage,
          cveId.trim().toLowerCase(),
        ),
      ),
    [sorted, severityOn, findingOn, cveId, runtimeOn, stage],
  );

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-12 pt-6">
      <PageHeader
        crumbs={[
          { label: "All Projects", href: "/" },
          { label: "Supported Releases", href: "/releases/" },
          { label: "Applications" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-[24px] font-semibold leading-tight text-[color:var(--text-primary)]">
          Supported Applications
        </h1>
        <p className="mt-1 text-[13px] text-[color:var(--text-secondary)]">
          Application-first view — each row is an AppTrust-labeled application with
          nested releases, SLA policy, and finding rollups.
        </p>
        <span className="mt-3 inline-flex items-center rounded-md bg-[color:var(--navy-100)] px-2 py-0.5 text-[12px] font-semibold text-[color:var(--navy-600)]">
          {filtered.length} applications · {RELEASES.length} releases
        </span>
      </div>

      <div className="mb-6 space-y-5">
        <FilterRow label="Severity">
          {ALL_SEVERITIES.map((s) => (
            <button
              key={s}
              type="button"
              className={chipActive(severityOn[s])}
              onClick={() => setSeverityOn((p) => ({ ...p, [s]: !p[s] }))}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </FilterRow>

        <FilterRow label="Finding type">
          {ALL_FINDING_DIMENSIONS.map((d) => (
            <button
              key={d}
              type="button"
              className={chipActive(findingOn[d])}
              onClick={() => setFindingOn((p) => ({ ...p, [d]: !p[d] }))}
            >
              {FINDING_TYPE_LABELS[d]}
            </button>
          ))}
        </FilterRow>

        <div>
          <label
            className="mb-2 block text-[12px] font-semibold uppercase text-[color:var(--text-secondary)]"
            htmlFor="cve-id-filter"
          >
            CVE ID (optional)
          </label>
          <input
            id="cve-id-filter"
            value={cveId}
            onChange={(e) => setCveId(e.target.value)}
            placeholder="e.g. CVE-2026-29145"
            className="h-9 max-w-md rounded-md border border-[color:var(--border-secondary)] bg-white px-3 text-[13px] outline-none ring-[color:var(--navy-500)] focus:ring-2"
          />
        </div>

        <FilterRow label="Runtime status">
          {(
            [
              ["running", "Running"],
              ["integrity_violation", "Integrity Violation"],
              ["not_running", "Not Running"],
            ] as const
          ).map(([rs, label]) => (
            <button
              key={rs}
              type="button"
              className={chipActive(runtimeOn[rs])}
              onClick={() => setRuntimeOn((p) => ({ ...p, [rs]: !p[rs] }))}
            >
              {label}
            </button>
          ))}
        </FilterRow>

        <FilterRow label="Stage">
          {(["any", "latest", "supported"] as const).map((st) => (
            <button
              key={st}
              type="button"
              className={chipActive(stage === st)}
              onClick={() => setStage(st)}
            >
              {st === "any" ? "Any" : st === "latest" ? "Latest" : "Supported"}
            </button>
          ))}
        </FilterRow>
      </div>

      <div className="overflow-auto rounded-lg border border-[color:var(--border-primary)] bg-white shadow-sm">
        <table className="min-w-[1100px] w-full border-collapse text-[13px]">
          <thead className="bg-[color:var(--surface-secondary)] text-left text-[12px] font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">
            <tr>
              <th className="px-4 py-3">Application</th>
              <th className="px-4 py-3">Dev owner</th>
              <th className="px-4 py-3">SLA policy</th>
              <th className="px-4 py-3">Releases</th>
              <th className="px-4 py-3">Findings rollup</th>
              <th className="px-4 py-3">Worst SLA</th>
              <th className="px-4 py-3">Tenants</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => {
              const rs = getReleasesForApp(app, RELEASES);
              const counts = rollupDimensionCounts(rs);
              const worst = worstSlaForApp(rs);
              const initial = app.devOwner.name.charAt(0).toUpperCase();
              return (
                <tr
                  key={app.id}
                  className={cn(
                    "border-t border-[color:var(--border-primary)] hover:bg-[color:var(--surface-secondary)]/60",
                    borderUrgency(rs),
                  )}
                >
                  <td className="px-4 py-3 align-middle">
                    <Link
                      href={`/applications/${app.id}/`}
                      className="font-semibold text-[color:var(--platform-teal-accent)] hover:underline"
                    >
                      {app.name}
                    </Link>
                    <div className="mt-1 font-mono text-[11px] text-[color:var(--text-tertiary)]">
                      {releaseLabels(app, RELEASES)}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--navy-100)] text-[12px] font-bold text-[color:var(--navy-600)]">
                        {initial}
                      </span>
                      <div>
                        <div className="font-semibold">{app.devOwner.name}</div>
                        <div className="text-[11px] text-[color:var(--text-tertiary)]">
                          {app.devOwner.team}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <Link
                      href="/policy/"
                      className="inline-flex rounded-full border border-[color:var(--border-secondary)] bg-[color:var(--surface-secondary)] px-2.5 py-0.5 text-[11px] font-semibold text-[color:var(--navy-600)] hover:border-[color:var(--navy-500)]"
                    >
                      {app.slaPolicy.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <span className="rounded bg-[color:var(--surface-tertiary)] px-2 py-0.5 text-[11px] font-semibold">
                      {releaseSummaryChip(app, RELEASES)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <FindingDimensionChips
                      counts={{
                        vulnerabilities: counts.vulnerabilities,
                        secrets: counts.secrets,
                        exposures: counts.exposures,
                        sast: counts.sast,
                        contextual: counts.contextual,
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <SLAPill worst={worst} />
                  </td>
                  <td className="px-4 py-3 align-middle font-semibold">
                    {appTenantSum(rs)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-[color:var(--surface-tertiary)]"
                      aria-label="Row actions"
                    >
                      <MoreHorizontal className="h-5 w-5 text-[color:var(--icon-tertiary)]" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-[12px] font-semibold uppercase text-[color:var(--text-secondary)]">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SLAPill({
  worst,
}: {
  worst: ReturnType<typeof worstSlaForApp>;
}) {
  if (worst.status === "breached") {
    return (
      <span className="inline-flex rounded-full bg-[color:var(--red-100)] px-3 py-1 text-[11px] font-semibold text-[color:var(--red-600)]">
        Exceeded ({worst.daysRemaining ?? "?"} d)
      </span>
    );
  }
  if (worst.status === "within") {
    return (
      <span className="inline-flex rounded-full bg-[color:var(--green-100)] px-3 py-1 text-[11px] font-semibold text-[color:var(--green-500)]">
        Within ({worst.daysRemaining ?? "?"} d)
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-[color:var(--surface-tertiary)] px-3 py-1 text-[11px] font-semibold text-[color:var(--text-tertiary)]">
      No data
    </span>
  );
}
