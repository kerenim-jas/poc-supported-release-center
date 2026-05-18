"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Activity,
  CheckCircle2,
  CircleSlash,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import type { SupportedRelease } from "@/lib/types";
import {
  RELEASES,
  sortReleasesForList,
  countOpenBySeverity,
  worstSlaForRelease,
} from "@/lib/fixtures";
import { cn } from "@/lib/cn";

type CoreFilter =
  | "all"
  | "artifactory"
  | "xray"
  | "platform"
  | "apptrust"
  | "ml";

const CORE_RULES: { id: CoreFilter; label: string; test?: (name: string) => boolean }[] =
  [
    { id: "all", label: "All cores" },
    {
      id: "artifactory",
      label: "Artifactory",
      test: (n) => n.includes("artifactory"),
    },
    { id: "xray", label: "Xray", test: (n) => n.startsWith("xray") },
    {
      id: "platform",
      label: "Platform",
      test: (n) =>
        ["access", "metadata", "platform-", "connect-server"].some((x) =>
          n.startsWith(x),
        ),
    },
    {
      id: "apptrust",
      label: "AppTrust",
      test: (n) => n.includes("apptrust"),
    },
    { id: "ml", label: "AI/ML", test: (n) => n.startsWith("ml-") },
  ];

function lifecycleRank(st: SupportedRelease["cves"][number]["state"]) {
  const idx = ["backlog", "action", "released", "rolled_out"] as const;
  const i = idx.indexOf(st as (typeof idx)[number]);
  return i === -1 ? 0 : i;
}

function aggregateLifecycle(r: SupportedRelease): SupportedRelease["cves"][number]["state"] {
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
    { k: "critical" as const, bg: "#fff1f2", fg: "#b91c1c" },
    { k: "high" as const, bg: "#fff7ec", fg: "#b45309" },
    { k: "medium" as const, bg: "#eef3f8", fg: "#415980" },
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

function chipActive(active: boolean) {
  return cn(
    "rounded-full px-3 py-1 text-[12px] font-semibold border transition-colors",
    active
      ? "border-[color:var(--green-500)] bg-[color:var(--green-100)] text-[color:var(--green-500)]"
      : "border-[color:var(--border-secondary)] bg-white text-[color:var(--text-secondary)] hover:border-[color:var(--navy-500)]",
  );
}

export function ReleasesListView() {
  const [core, setCore] = useState<CoreFilter>("all");
  const [critPlus, setCritPlus] = useState(false);
  const [hasOpen, setHasOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [stage, setStage] = useState<"any" | "latest" | "supported">("any");
  const [q, setQ] = useState("");

  const sorted = sortReleasesForList(RELEASES);

  const filtered = useMemo(() => {
    const rule = CORE_RULES.find((c) => c.id === core);
    return sorted.filter((r) => {
      if (rule?.test && !rule.test(r.imageName)) return false;

      const openCrit = r.cves.some(
        (c) =>
          c.cve.severity === "critical" &&
          c.state !== "rolled_out",
      );
      const anyOpen = r.cves.some((c) => c.state !== "rolled_out");

      if (critPlus && !openCrit) return false;

      if (hasOpen && !anyOpen) return false;

      if (running && !r.runtime.isRunning) return false;

      if (customer && r.customerImpact <= 1) return false;

      if (stage === "latest" && r.supportTier !== "latest") return false;
      if (stage === "supported" && r.supportTier !== "supported") return false;

      const needle = q.trim().toLowerCase();
      if (needle) {
        const hay = `${r.imageName} ${r.version} ${r.cves.map((c) => c.cve.id).join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }

      return true;
    });
  }, [
    sorted,
    core,
    critPlus,
    hasOpen,
    running,
    customer,
    stage,
    q,
  ]);

  function borderUrgency(r: SupportedRelease) {
    const w = worstSlaForRelease(r);
    if (w.status === "breached")
      return "border-l-[3px] border-l-[color:var(--red-500)]";
    if (
      w.status === "within" &&
      (w.daysRemaining ?? 999) <= 2
    )
      return "border-l-[3px] border-l-[color:var(--orange-500)]";
    return "border-l-[3px] border-l-transparent";
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-12 pt-6">
      <PageHeader
        crumbs={[
          { label: "All Projects" },
          { label: "AppTrust" },
          { label: "Supported Releases", href: "/" },
          { label: "All" },
        ]}
      />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[24px] font-semibold leading-tight text-[color:var(--text-primary)]">
            Supported Releases
          </h1>
          <p className="mt-1 text-[13px] text-[color:var(--text-secondary)]">
            Trusted ∩ SLA-supported docker lines only · Runtime shows &nbsp;
            <em>Is it running?</em>, not exposures.
          </p>
          <span className="mt-3 inline-flex items-center rounded-md bg-[color:var(--navy-100)] px-2 py-0.5 text-[12px] font-semibold text-[color:var(--navy-600)]">
            {filtered.length} Trusted+Supported
          </span>
        </div>
        <div className="w-full lg:max-w-[320px]">
          <label className="sr-only" htmlFor="rel-search">
            Search by image or CVE
          </label>
          <input
            id="rel-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by image or CVE"
            className="h-9 w-full rounded-md border border-[color:var(--border-secondary)] bg-white px-3 text-[13px] outline-none ring-[color:var(--navy-500)] focus:ring-2"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CORE_RULES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={chipActive(core === c.id)}
            onClick={() => setCore(c.id)}
          >
            {c.label}
          </button>
        ))}
        <button
          type="button"
          className={chipActive(critPlus)}
          onClick={() => setCritPlus(!critPlus)}
        >
          Sev ≥ Crit
        </button>
        <button
          type="button"
          className={chipActive(hasOpen)}
          onClick={() => setHasOpen(!hasOpen)}
        >
          Open CVE
        </button>
        <button
          type="button"
          className={chipActive(running)}
          onClick={() => setRunning(!running)}
        >
          Is Running
        </button>
        <button
          type="button"
          className={chipActive(customer)}
          onClick={() => setCustomer(!customer)}
        >
          Cust impact
        </button>
        {(["any", "latest", "supported"] as const).map((st) => (
          <button
            key={st}
            type="button"
            className={chipActive(stage === st)}
            onClick={() => setStage(st)}
          >
            Stage: {st}
          </button>
        ))}
      </div>

      <div className="overflow-auto rounded-lg border border-[color:var(--border-primary)] bg-white shadow-sm">
        <table className="min-w-[1024px] w-full border-collapse text-[13px]">
          <thead className="bg-[color:var(--surface-secondary)] text-left text-[12px] font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">
            <tr>
              <th className="sticky top-0 px-4 py-3 font-semibold">
                Docker image · path
              </th>
              <th className="sticky top-0 px-4 py-3 font-semibold">Version · trust</th>
              <th className="sticky top-0 px-4 py-3 font-semibold">Running</th>
              <th className="sticky top-0 px-4 py-3 font-semibold">Open CVE</th>
              <th className="sticky top-0 px-4 py-3 font-semibold">SLA window</th>
              <th className="sticky top-0 px-4 py-3 font-semibold">Fix lifecycle</th>
              <th className="sticky top-0 px-4 py-3 font-semibold">Last promoted</th>
              <th className="sticky top-0 px-4 py-3 font-semibold" />
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
                  <td className="px-4 py-3 align-middle">
                    <Link
                      href={`/releases/${r.id}/`}
                      className="font-semibold text-[color:var(--platform-teal-accent)] hover:underline"
                    >
                      {r.imageName}
                    </Link>
                    <div className="mt-1 font-mono text-[11px] text-[color:var(--text-tertiary)]">
                      {r.imagePath}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
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
                        {r.supportTier === "latest"
                          ? "Latest"
                          : "Supported"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <RunningBadge r={r} />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <SeverityChips
                      counts={{
                        critical: counts.critical,
                        high: counts.high,
                        medium: counts.medium,
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <SLAPill worst={worst} />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <LifecycleStepBar current={lcState} />
                  </td>
                  <td className="px-4 py-3 align-middle text-[12px] text-[color:var(--text-secondary)]">
                    {formatShort(r.timeline[r.timeline.length - 1]?.ts ?? r.lastUpdated)} ·{" "}
                    <span className="font-semibold text-[color:var(--text-primary)]">
                      {(() => {
                        const idx = [...r.timeline]
                          .map((ev, i) => ({ ev, i }))
                          .filter(({ ev }) => ev.kind === "release")
                          .pop()?.i;
                        return typeof idx === "number" ? "STAGING→PROD" : `${r.currentStage}`;
                      })()}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle text-right">
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
  const tip = `${r.runtime.clusters.map((c) => `${c.name}: ${c.rolloutPercent}%`).join("; ") || "No prod clusters synced"}`;
  return (
    <span title={tip}>
      {r.runtime.isRunning ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--green-100)] px-2 py-1 text-[11px] font-semibold text-[color:var(--green-500)]">
          <Activity className="h-3.5 w-3.5" />
          Running
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--surface-secondary)] px-2 py-1 text-[11px] font-semibold text-[color:var(--text-tertiary)]">
          <CircleSlash className="h-3.5 w-3.5" />
          Idle
        </span>
      )}
    </span>
  );
}
