"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  CheckCircle2,
  CircleSlash,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CompactPageTitle } from "@/components/CompactPageTitle";
import { FilterToolbar } from "@/components/FilterToolbar";
import type { Severity, SupportedRelease } from "@/lib/types";
import {
  RELEASES,
  sortReleasesForList,
  countOpenBySeverity,
  worstSlaForRelease,
} from "@/lib/fixtures";
import {
  initRuntimeOn,
  initSeverityOn,
} from "@/lib/filter-utils";
import { cn } from "@/lib/cn";

function lifecycleRank(st: SupportedRelease["cves"][number]["state"]) {
  const idx = ["backlog", "action", "released", "rolled_out"] as const;
  const i = idx.indexOf(st as (typeof idx)[number]);
  return i === -1 ? 0 : i;
}

function aggregateLifecycle(
  r: SupportedRelease,
): SupportedRelease["cves"][number]["state"] {
  let minRank = Number.POSITIVE_INFINITY;
  let sel: SupportedRelease["cves"][number]["state"] | null = null;
  for (const c of r.cves) {
    if (c.state === "rolled_out") continue;
    const rnk = lifecycleRank(c.state);
    if (rnk < minRank) {
      minRank = rnk;
      sel = c.state;
    }
  }
  if (sel !== null) return sel;
  return "rolled_out";
}

function LifecycleStepBar({
  current,
}: {
  current: SupportedRelease["cves"][number]["state"];
}) {
  const seq = ["backlog", "action", "released", "rolled_out"] as const;
  const activeIdx =
    seq.indexOf(current as (typeof seq)[number]) === -1
      ? 0
      : seq.indexOf(current as (typeof seq)[number]);

  return (
    <div className="flex items-center gap-1">
      {seq.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <span
            className={cn(
              "rounded px-2 py-0.5 text-[11px]",
              i <= activeIdx
                ? "bg-[color:var(--green-100)] font-semibold text-[color:var(--green-500)]"
                : "bg-[color:var(--surface-secondary)] text-[color:var(--text-tertiary)]",
            )}
            title={s}
          >
            {s === "rolled_out"
              ? "Roll"
              : s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
          {i < seq.length - 1 && (
            <span className="text-[10px] text-[color:var(--text-tertiary)]">→</span>
          )}
        </div>
      ))}
    </div>
  );
}

function SeverityChips({
  counts,
}: {
  counts: Partial<Record<"critical" | "high" | "medium", number>>;
}) {
  const defs = [
    { k: "critical" as const, bg: "var(--severity-critical-bg)", fg: "var(--severity-critical)" },
    { k: "high" as const, bg: "var(--severity-high-bg)", fg: "var(--severity-high)" },
    { k: "medium" as const, bg: "var(--severity-medium-bg)", fg: "var(--severity-medium)" },
  ];
  return (
    <div className="flex flex-wrap gap-1">
      {defs.map(({ k, bg, fg }) =>
        counts[k] ? (
          <span
            key={k}
            className="rounded px-2 py-0.5 font-mono text-[11px] font-semibold"
            style={{ background: bg, color: fg }}
          >
            {k === "critical" ? "Crit" : k === "high" ? "High" : "Med"}{" "}
            {counts[k]}
          </span>
        ) : null,
      )}
    </div>
  );
}

export function ReleasesListView() {
  const [severityOn, setSeverityOn] = useState(initSeverityOn);
  const [cveId, setCveId] = useState("");
  const [runtimeOn, setRuntimeOn] = useState(initRuntimeOn);
  const [stage, setStage] = useState<"any" | "latest" | "supported">("any");

  const sorted = sortReleasesForList(RELEASES);

  const filtered = useMemo(() => {
    const allSevOn = Object.values(severityOn).every(Boolean);
    const allRunOn = Object.values(runtimeOn).every(Boolean);
    const cveNeedle = cveId.trim().toLowerCase();

    return sorted.filter((r) => {
      if (!allSevOn) {
        const allowed = new Set(
          (["critical", "high", "medium", "low"] as Severity[]).filter(
            (s) => severityOn[s],
          ),
        );
        if (!r.cves.some((c) => allowed.has(c.cve.severity))) return false;
      }

      if (
        cveNeedle &&
        !r.cves.some((c) => c.cve.id.toLowerCase().includes(cveNeedle))
      ) {
        return false;
      }

      if (!allRunOn && !runtimeOn[r.runtime.state]) return false;

      if (stage === "latest" && r.supportTier !== "latest") return false;
      if (stage === "supported" && r.supportTier !== "supported")
        return false;

      return true;
    });
  }, [sorted, severityOn, cveId, runtimeOn, stage]);

  function clearAll() {
    setSeverityOn(initSeverityOn());
    setRuntimeOn(initRuntimeOn());
    setStage("any");
    setCveId("");
  }

  function borderUrgency(r: SupportedRelease) {
    const w = worstSlaForRelease(r);
    if (w.status === "breached")
      return "border-l-[3px] border-l-[color:var(--red-500)]";
    if (w.status === "within" && (w.daysRemaining ?? 999) <= 2)
      return "border-l-[3px] border-l-[color:var(--orange-500)]";
    return "border-l-[3px] border-l-transparent";
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-10 pt-4">
      <PageHeader
        crumbs={[
          { label: "All Projects", href: "/" },
          { label: "Supported Releases", href: "/releases/" },
          { label: "All" },
        ]}
      />

      <CompactPageTitle
        title="Supported Releases"
        meta={`${filtered.length} Trusted+Supported`}
      />

      <FilterToolbar
        showFindingType={false}
        severityOn={severityOn}
        runtimeOn={runtimeOn}
        stage={stage}
        cveId={cveId}
        onSeverityChange={setSeverityOn}
        onRuntimeChange={setRuntimeOn}
        onStageChange={setStage}
        onCveChange={setCveId}
        onClearAll={clearAll}
      />

      <div className="overflow-auto rounded-lg border border-[color:var(--border-primary)] bg-white shadow-sm">
        <table className="min-w-[1024px] w-full border-collapse text-[13px]">
          <thead className="bg-[color:var(--surface-secondary)] text-left text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">
            <tr>
              <th className="sticky top-0 px-4 py-2.5 font-semibold">
                Docker image · path
              </th>
              <th className="sticky top-0 px-4 py-2.5 font-semibold">
                Version · trust
              </th>
              <th className="sticky top-0 px-4 py-2.5 font-semibold">Running</th>
              <th className="sticky top-0 px-4 py-2.5 font-semibold">Open CVE</th>
              <th className="sticky top-0 px-4 py-2.5 font-semibold">SLA window</th>
              <th className="sticky top-0 px-4 py-2.5 font-semibold">
                Fix lifecycle
              </th>
              <th className="sticky top-0 px-4 py-2.5 font-semibold">
                Last promoted
              </th>
              <th className="sticky top-0 px-4 py-2.5 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const counts = countOpenBySeverity(r.cves);
              const worst = worstSlaForRelease(r);
              const lcState = aggregateLifecycle(r);
              return (
                <tr
                  key={r.id}
                  className={`border-t border-[color:var(--border-primary)] hover:bg-[color:var(--surface-secondary)]/60 ${borderUrgency(r)}`}
                >
                  <td className="px-4 py-2.5 align-middle">
                    <Link
                      href={`/releases/${r.id}/`}
                      className="font-semibold text-[color:var(--text-link)] hover:underline"
                    >
                      {r.imageName}
                    </Link>
                    <div className="mt-0.5 font-mono text-[11px] text-[color:var(--text-tertiary)]">
                      {r.imagePath}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded bg-[color:var(--surface-tertiary)] px-2 py-0.5 font-mono text-[12px]">
                        {r.version}
                      </span>
                      {r.isTrusted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--green-100)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--green-500)]">
                          <CheckCircle2 className="h-3 w-3" />
                          Trusted
                        </span>
                      )}
                      <span className="rounded-full bg-[color:var(--navy-100)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--navy-600)]">
                        {r.supportTier === "latest" ? "Latest" : "Supported"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <RunningBadge r={r} />
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <SeverityChips
                      counts={{
                        critical: counts.critical,
                        high: counts.high,
                        medium: counts.medium,
                      }}
                    />
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <SLAPill worst={worst} />
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <LifecycleStepBar current={lcState} />
                  </td>
                  <td className="px-4 py-2.5 align-middle text-[12px] text-[color:var(--text-secondary)]">
                    {formatShort(
                      r.timeline[r.timeline.length - 1]?.ts ?? r.lastUpdated,
                    )}{" "}
                    ·{" "}
                    <span className="font-semibold text-[color:var(--text-primary)]">
                      {(() => {
                        const idx = [...r.timeline]
                          .map((ev, i) => ({ ev, i }))
                          .filter(({ ev }) => ev.kind === "release")
                          .pop()?.i;
                        return typeof idx === "number"
                          ? "STAGING→PROD"
                          : `${r.currentStage}`;
                      })()}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 align-middle text-right">
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

function formatShort(ts: string) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function SLAPill({
  worst,
}: {
  worst: ReturnType<typeof worstSlaForRelease>;
}) {
  if (worst.status === "breached") {
    return (
      <span className="inline-flex rounded-full bg-[color:var(--red-100)] px-3 py-1 text-[11px] font-semibold text-[color:var(--red-600)]">
        Exceeded SLA ({worst.daysRemaining ?? "?"} d)
      </span>
    );
  }
  if (worst.status === "within") {
    return (
      <span className="inline-flex rounded-full bg-[color:var(--green-100)] px-3 py-1 text-[11px] font-semibold text-[color:var(--green-500)]">
        Within SLA ({worst.daysRemaining ?? "?"} d)
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-[color:var(--surface-tertiary)] px-3 py-1 text-[11px] font-semibold text-[color:var(--text-tertiary)]">
      No SLA data
    </span>
  );
}

function RunningBadge({ r }: { r: SupportedRelease }) {
  const clusterTip = `${r.runtime.clusters.map((c) => `${c.name}: ${c.rolloutPercent}%`).join("; ") || "No prod clusters synced"}`;
  const integrityTip =
    "Workload is running but has drifted from the released image.";

  if (r.runtime.state === "running") {
    return (
      <span title={clusterTip} className="inline-flex cursor-default items-center gap-1.5 text-[11px] font-semibold text-[color:var(--text-secondary)]">
        <span className="h-2 w-2 rounded-full bg-[color:var(--color-success)]" />
        Running
      </span>
    );
  }

  if (r.runtime.state === "integrity_violation") {
    return (
      <span title={integrityTip} className="inline-flex cursor-default items-center gap-1.5 text-[11px] font-semibold text-[color:var(--text-secondary)]">
        <span className="h-2 w-2 rounded-full bg-[color:var(--color-error)]" />
        <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-error)]" />
        Integrity Violation
      </span>
    );
  }

  return (
    <span title={clusterTip} className="inline-flex cursor-default items-center gap-1.5 text-[11px] font-semibold text-[color:var(--text-tertiary)]">
      <span className="h-2 w-2 rounded-full bg-[color:var(--text-tertiary)]" />
      <CircleSlash className="h-3.5 w-3.5" />
      Idle
    </span>
  );
}
