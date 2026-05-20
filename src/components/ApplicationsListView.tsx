"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CompactPageTitle } from "@/components/CompactPageTitle";
import { FilterToolbar } from "@/components/FilterToolbar";
import {
  FindingDimensionChips,
  ALL_FINDING_DIMENSIONS,
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
import {
  ALL_RUNTIME_STATES,
  ALL_SEVERITIES,
  initFindingOn,
  initRuntimeOn,
  initSeverityOn,
} from "@/lib/filter-utils";
import { cn } from "@/lib/cn";

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
  appSearch: string,
): boolean {
  const rs = getReleasesForApp(app, releases);
  if (rs.length === 0) return false;

  if (appSearch) {
    const hay = `${app.name} ${app.label}`.toLowerCase();
    if (!hay.includes(appSearch)) return false;
  }

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
  const [findingOn, setFindingOn] = useState(() =>
    initFindingOn(ALL_FINDING_DIMENSIONS),
  );
  const [cveId, setCveId] = useState("");
  const [runtimeOn, setRuntimeOn] = useState(initRuntimeOn);
  const [stage, setStage] = useState<"any" | "latest" | "supported">("any");
  const [appSearch, setAppSearch] = useState("");

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
          appSearch.trim().toLowerCase(),
        ),
      ),
    [sorted, severityOn, findingOn, cveId, runtimeOn, stage, appSearch],
  );

  function clearAll() {
    setSeverityOn(initSeverityOn());
    setFindingOn(initFindingOn(ALL_FINDING_DIMENSIONS));
    setRuntimeOn(initRuntimeOn());
    setStage("any");
    setCveId("");
    setAppSearch("");
  }

  return (
    <div className="mx-auto max-w-[1400px] px-[var(--space-l)] pb-[var(--space-l)] pt-[var(--space-s)]">
      <PageHeader
        crumbs={[
          { label: "All Projects", href: "/" },
          { label: "Supported Releases", href: "/releases/" },
          { label: "Applications" },
        ]}
      />

      <CompactPageTitle
        title="Supported Applications"
        meta={`${filtered.length} applications · ${RELEASES.length} releases`}
        infoTooltip="Application-first view — each row is an AppTrust-labeled application with nested releases, SLA policy, and finding rollups."
      />

      <FilterToolbar
        showAppSearch
        appSearch={appSearch}
        onAppSearchChange={setAppSearch}
        severityOn={severityOn}
        findingOn={findingOn}
        runtimeOn={runtimeOn}
        stage={stage}
        cveId={cveId}
        onSeverityChange={setSeverityOn}
        onFindingChange={setFindingOn}
        onRuntimeChange={setRuntimeOn}
        onStageChange={setStage}
        onCveChange={setCveId}
        onClearAll={clearAll}
      />

      <div className="overflow-auto rounded-[var(--radius-s)] border border-[color:var(--border-primary)] bg-[color:var(--surface-primary)] shadow-[var(--shadow-sunken)]">
        <table className="min-w-[1100px] w-full border-collapse">
          <thead className="text-left">
            <tr className="table-header-row">
              <th>Application</th>
              <th>Dev owner</th>
              <th>SLA policy</th>
              <th>Releases</th>
              <th>Findings rollup</th>
              <th>Worst SLA</th>
              <th>Tenants</th>
              <th />
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
                  className={cn("table-data-row", borderUrgency(rs))}
                >
                  <td>
                    <Link
                      href={`/applications/${app.id}/`}
                      className="font-semibold text-[color:var(--text-link)] no-underline hover:underline"
                    >
                      {app.name}
                    </Link>
                    <div className="mt-0.5 font-mono text-[11px] text-[color:var(--text-tertiary)]">
                      {releaseLabels(app, RELEASES)}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--navy-100)] text-[11px] font-bold text-[color:var(--navy-600)]">
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
                  <td>
                    <Link
                      href="/policy/"
                      className="inline-flex rounded-[var(--radius-s)] border border-[color:var(--border-secondary)] bg-[color:var(--surface-secondary)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--text-link)] no-underline hover:border-[color:var(--border-strong)] hover:underline"
                    >
                      {app.slaPolicy.name}
                    </Link>
                  </td>
                  <td>
                    <span className="rounded-[var(--radius-s)] bg-[color:var(--navy-100)] px-2 py-0.5 text-[11px] font-semibold">
                      {releaseSummaryChip(app, RELEASES)}
                    </span>
                  </td>
                  <td>
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
                  <td>
                    <SLAPill worst={worst} />
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Building2 className="h-3.5 w-3.5 text-[color:var(--icon-secondary)]" />
                      {appTenantSum(rs)}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="rounded-[var(--radius-s)] p-1 hover:bg-[color:var(--surface-secondary)]"
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

function SLAPill({
  worst,
}: {
  worst: ReturnType<typeof worstSlaForApp>;
}) {
  if (worst.status === "breached") {
    return (
      <span className="inline-flex rounded-[var(--radius-s)] bg-[color:var(--severity-critical-bg)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--severity-critical)]">
        Exceeded ({worst.daysRemaining ?? "?"} d)
      </span>
    );
  }
  if (worst.status === "within") {
    return (
      <span className="inline-flex rounded-[var(--radius-s)] bg-[color:var(--severity-low-bg)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--severity-low)]">
        Within ({worst.daysRemaining ?? "?"} d)
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-[var(--radius-s)] bg-[color:var(--surface-secondary)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--text-tertiary)]">
      No data
    </span>
  );
}
