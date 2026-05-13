"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import { CORES, SERVICES, buildCVEMatrix } from "@/lib/fixtures";
import type { CVEMatrixCell, CVEMatrixRow, Severity } from "@/lib/types";
import { cn } from "@/lib/cn";

const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];
const APPLICABILITY = ["applicable", "not_applicable", "not_covered"] as const;
const PACKAGE_TYPES = ["npm", "maven", "go", "pypi", "docker", "rpm"] as const;

type RuntimeFilterKey =
  | "deployed"
  | "reachable"
  | "internetFacing"
  | "customerImpact";

const RUNTIME_FILTERS: { key: RuntimeFilterKey; label: string }[] = [
  { key: "deployed", label: "Deployed in prod" },
  { key: "reachable", label: "Reachable in execution" },
  { key: "internetFacing", label: "Internet-facing" },
  { key: "customerImpact", label: "Has customer impact" },
];

function packageUrl(cveId: string, component: string): string {
  const i = component.indexOf("://");
  if (i < 0) return `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cveId}`;
  const scheme = component.slice(0, i);
  const rest = component.slice(i + 3);
  if (scheme === "npm") {
    const name = rest.split(":")[0];
    return `https://www.npmjs.com/package/${encodeURIComponent(name)}`;
  }
  if (scheme === "gav") {
    const [g, a] = rest.split(":");
    return `https://search.maven.org/search?q=g:${encodeURIComponent(g)}+AND+a:${encodeURIComponent(a)}`;
  }
  if (scheme === "go") {
    return `https://pkg.go.dev/${encodeURIComponent(rest.split(":")[0])}`;
  }
  if (scheme === "pypi") {
    return `https://pypi.org/project/${encodeURIComponent(rest.split(":")[0])}/`;
  }
  return `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cveId}`;
}

function suggestedAction(c: CVEMatrixCell): string {
  if (c.slaStatus === "breached") {
    return "Emergency patch or formal risk acceptance";
  }
  if (c.runtime.deployed && c.runtime.reachable) {
    return "Prioritize patch — vulnerable path live in prod";
  }
  if (c.runtime.deployed) {
    return "Validate reachability; schedule maintenance window";
  }
  return "Track for next release train";
}

function cellHeatClass(c: CVEMatrixCell): "red" | "amber" | "green" {
  if (c.slaStatus === "breached") return "red";
  if (c.runtime.deployed && c.runtime.reachable) return "amber";
  return "green";
}

function cellSizePx(count: number): number {
  return Math.min(40, Math.max(14, 10 + count * 7));
}

function useFilterState() {
  const [severity, setSeverity] = useState<Set<Severity>>(
    () => new Set(SEVERITIES)
  );
  const [applicability, setApplicability] = useState<
    Set<(typeof APPLICABILITY)[number]>
  >(() => new Set(APPLICABILITY));
  const [packageType, setPackageType] = useState<
    Set<(typeof PACKAGE_TYPES)[number]>
  >(() => new Set(PACKAGE_TYPES));
  const [runtime, setRuntime] = useState<Set<RuntimeFilterKey>>(() => new Set());
  const [cores, setCores] = useState<Set<string>>(
    () => new Set(CORES.map((c) => c.id))
  );
  const [ownerQuery, setOwnerQuery] = useState("");
  const [scopeTenant, setScopeTenant] = useState("jfrog-cloud / all regions");

  const clearAll = useCallback(() => {
    setSeverity(new Set(SEVERITIES));
    setApplicability(new Set(APPLICABILITY));
    setPackageType(new Set(PACKAGE_TYPES));
    setRuntime(new Set());
    setCores(new Set(CORES.map((c) => c.id)));
    setOwnerQuery("");
  }, []);

  return {
    severity,
    setSeverity,
    applicability,
    setApplicability,
    packageType,
    setPackageType,
    runtime,
    setRuntime,
    cores,
    setCores,
    ownerQuery,
    setOwnerQuery,
    scopeTenant,
    setScopeTenant,
    clearAll,
  };
}

export function MatrixApp() {
  const rawRows = useMemo(() => buildCVEMatrix(), []);
  const filters = useFilterState();

  const servicesOrdered = useMemo(() => {
    return [...SERVICES].sort((a, b) => {
      const co =
        CORES.findIndex((c) => c.id === a.coreId) -
        CORES.findIndex((c) => c.id === b.coreId);
      if (co !== 0) return co;
      return a.name.localeCompare(b.name);
    });
  }, []);

  const visibleServices = useMemo(() => {
    const q = filters.ownerQuery.trim().toLowerCase();
    return servicesOrdered.filter((s) => {
      if (!filters.cores.has(s.coreId)) return false;
      if (q && !s.ownerName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [servicesOrdered, filters.cores, filters.ownerQuery]);

  const coreGroups = useMemo(() => {
    const groups: { coreId: string; coreName: string; count: number }[] = [];
    for (const svc of visibleServices) {
      const core = CORES.find((c) => c.id === svc.coreId)!;
      const last = groups[groups.length - 1];
      if (last && last.coreId === svc.coreId) last.count += 1;
      else groups.push({ coreId: svc.coreId, coreName: core.name, count: 1 });
    }
    return groups;
  }, [visibleServices]);

  const filteredRows = useMemo(() => {
    const sevRank: Record<Severity, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    function rowMatchesRuntime(row: CVEMatrixRow): boolean {
      if (filters.runtime.size === 0) return true;
      const vis = visibleServices.map((s) => s.id);
      for (const sid of vis) {
        const cell = row.perService[sid];
        if (!cell) continue;
        let ok = true;
        for (const key of filters.runtime) {
          if (key === "customerImpact") {
            if (!(cell.runtime.customerImpact > 0)) ok = false;
          } else if (!cell.runtime[key]) {
            ok = false;
          }
        }
        if (ok) return true;
      }
      return false;
    }

    return rawRows
      .filter((row) => {
        if (!filters.severity.has(row.cve.severity)) return false;
        if (!filters.applicability.has(row.cve.applicability)) return false;
        if (!filters.packageType.has(row.cve.packageType)) return false;
        if (!rowMatchesRuntime(row)) return false;
        const hitsService = visibleServices.some((s) => row.perService[s.id]);
        return hitsService;
      })
      .sort((a, b) => {
        const s =
          sevRank[a.cve.severity as Severity] -
          sevRank[b.cve.severity as Severity];
        if (s !== 0) return s;
        return b.prodDeployedServices - a.prodDeployedServices;
      });
  }, [rawRows, filters, visibleServices]);

  const stats = useMemo(() => {
    let deployedInProdCells = 0;
    let reachableCells = 0;
    let internetCells = 0;
    const distinctServicesHit = new Set<string>();

    for (const row of filteredRows) {
      for (const svc of visibleServices) {
        const cell = row.perService[svc.id];
        if (!cell) continue;
        distinctServicesHit.add(svc.id);
        if (cell.runtime.deployed) deployedInProdCells += 1;
        if (cell.runtime.reachable) reachableCells += 1;
        if (cell.runtime.internetFacing) internetCells += 1;
      }
    }

    return {
      nCves: filteredRows.length,
      mServices: distinctServicesHit.size,
      deployedInProdCells,
      reachableCells,
      internetCells,
    };
  }, [filteredRows, visibleServices]);

  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const [panel, setPanel] = useState<{
    row: CVEMatrixRow;
    focusServiceId: string | null;
  } | null>(null);

  const openPanel = (row: CVEMatrixRow, focusServiceId: string | null) => {
    setPanel({ row, focusServiceId });
  };

  const emptyFiltered = filteredRows.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[color:var(--background-plain)]">
      {/* Header band */}
      <div className="sticky top-0 z-40 shrink-0 border-b border-[color:var(--border-primary)] bg-[color:var(--surface-primary)] px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-[260px]">
            <h2 className="text-[17px] font-semibold text-[color:var(--text-primary)]">
              CVE × Service Matrix
            </h2>
            <p className="mt-0.5 max-w-xl text-[12px] text-[color:var(--text-secondary)]">
              Cross-cutting vulnerability triage, grounded in runtime exposure
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[color:var(--navy-100)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--navy-600)]">
              {stats.nCves} CVEs affecting {stats.mServices} services
            </span>
            <StatChip
              tone="green"
              label="Deployed in prod"
              value={stats.deployedInProdCells}
            />
            <StatChip
              tone="amber"
              label="Reachable in execution"
              value={stats.reachableCells}
            />
            <StatChip
              tone="red"
              label="Internet-facing"
              value={stats.internetCells}
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[color:var(--border-primary)] pt-3">
          <button
            type="button"
            className="rounded border border-[color:var(--border-secondary)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[color:var(--text-secondary)] opacity-70"
          >
            Export CSV
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded border border-[color:var(--border-secondary)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[color:var(--text-secondary)] opacity-70"
          >
            Open in Jira
            <ExternalLink className="h-3 w-3" />
          </button>
            <label className="ml-2 flex items-center gap-2 text-[12px] text-[color:var(--text-secondary)]">
              <span className="text-[color:var(--text-tertiary)]">Scope:</span>
              <select
                className="h-8 rounded border border-[color:var(--border-secondary)] bg-white px-2 text-[12px]"
                value={filters.scopeTenant}
                onChange={(e) => filters.setScopeTenant(e.target.value)}
              >
                <option value="jfrog-cloud / all regions">
                  jfrog-cloud / all regions
                </option>
                <option value="jfrog-cloud / EU-only">jfrog-cloud / EU-only</option>
                <option value="staging mirror">staging mirror</option>
              </select>
            </label>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Filter rail */}
        <aside
          className={cn(
            "shrink-0 border-r border-[color:var(--border-primary)] bg-[color:var(--surface-primary)] transition-[width] duration-200",
            filterCollapsed ? "w-10" : "w-[240px]"
          )}
        >
          <div className="flex h-full flex-col gap-2 overflow-y-auto p-2 pt-3">
            <button
              type="button"
              title={filterCollapsed ? "Expand filters" : "Collapse"}
              className="mb-1 flex h-8 w-full items-center justify-center rounded hover:bg-[color:var(--surface-secondary)]"
              onClick={() => setFilterCollapsed((c) => !c)}
            >
              {filterCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
            {!filterCollapsed && (
              <>
                <button
                  type="button"
                  onClick={filters.clearAll}
                  className="text-left text-[11px] font-semibold text-[color:var(--navy-600)] underline"
                >
                  Clear filters
                </button>

                <FilterSection title="Severity">
                  {SEVERITIES.map((s) => (
                    <CheckboxRow
                      key={s}
                      label={s}
                      checked={filters.severity.has(s)}
                      onChange={() => {
                        const next = new Set(filters.severity);
                        if (next.has(s)) next.delete(s);
                        else next.add(s);
                        filters.setSeverity(next);
                      }}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Applicability">
                  {APPLICABILITY.map((a) => (
                    <CheckboxRow
                      key={a}
                      label={a.replace("_", " ")}
                      checked={filters.applicability.has(a)}
                      onChange={() => {
                        const next = new Set(filters.applicability);
                        if (next.has(a)) next.delete(a);
                        else next.add(a);
                        filters.setApplicability(next);
                      }}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Package type">
                  {PACKAGE_TYPES.map((p) => (
                    <CheckboxRow
                      key={p}
                      label={p}
                      checked={filters.packageType.has(p)}
                      onChange={() => {
                        const next = new Set(filters.packageType);
                        if (next.has(p)) next.delete(p);
                        else next.add(p);
                        filters.setPackageType(next);
                      }}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Runtime status">
                  <p className="mb-1 text-[10px] text-[color:var(--text-tertiary)]">
                    Matches if any affected cell satisfies all checked signals.
                  </p>
                  {RUNTIME_FILTERS.map(({ key, label }) => (
                    <CheckboxRow
                      key={key}
                      label={label}
                      checked={filters.runtime.has(key)}
                      onChange={() => {
                        const next = new Set(filters.runtime);
                        if (next.has(key)) next.delete(key);
                        else next.add(key);
                        filters.setRuntime(next);
                      }}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Core">
                  {CORES.map((c) => (
                    <CheckboxRow
                      key={c.id}
                      label={c.name}
                      checked={filters.cores.has(c.id)}
                      onChange={() => {
                        const next = new Set(filters.cores);
                        if (next.has(c.id)) next.delete(c.id);
                        else next.add(c.id);
                        filters.setCores(next);
                      }}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Service owner">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[color:var(--icon-tertiary)]" />
                    <input
                      type="search"
                      placeholder="Search owners…"
                      value={filters.ownerQuery}
                      onChange={(e) => filters.setOwnerQuery(e.target.value)}
                      className="h-8 w-full rounded border border-[color:var(--border-secondary)] bg-white pl-7 pr-2 text-[11px]"
                    />
                  </div>
                </FilterSection>
              </>
            )}
          </div>
        </aside>

        {/* Matrix */}
        <div className="min-w-0 flex-1 overflow-auto">
          {emptyFiltered ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="text-[14px] font-semibold text-[color:var(--text-primary)]">
                No CVEs match these filters
              </p>
              <button
                type="button"
                onClick={filters.clearAll}
                className="text-[12px] font-semibold text-[color:var(--navy-600)] underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="inline-block min-w-full p-3">
              <table className="border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th
                      rowSpan={2}
                      className="sticky left-0 z-30 min-w-[200px] border-b border-r border-[color:var(--border-primary)] bg-[color:var(--navy-600)] px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white"
                    >
                      CVE impact
                    </th>
                    {coreGroups.map((g) => (
                      <th
                        key={g.coreId}
                        colSpan={g.count}
                        className="sticky top-0 z-20 h-9 border-b border-l border-white/15 bg-[color:var(--navy-500)] px-1 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-white"
                      >
                        {g.coreName}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {visibleServices.map((svc) => (
                      <th
                        key={svc.id}
                        className="sticky top-[36px] z-10 min-h-[110px] w-10 border-b border-l border-[color:var(--border-primary)] bg-[color:var(--navy-100)] px-1 pb-2 pt-6 text-[9px] font-medium text-[color:var(--text-primary)]"
                        title={`${svc.name} · ${CORES.find((c) => c.id === svc.coreId)?.name}`}
                      >
                        <span
                          className="inline-block max-h-[104px] overflow-hidden font-mono text-[9px] leading-tight text-[color:var(--text-secondary)]"
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                          }}
                        >
                          {svc.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <CVEHeatRow
                      key={row.cve.id}
                      row={row}
                      visibleServices={visibleServices}
                      onOpenRow={() => openPanel(row, null)}
                      onOpenCell={(sid) => openPanel(row, sid)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {panel && (
        <CVEPanel
          row={panel.row}
          visibleServices={visibleServices}
          focusServiceId={panel.focusServiceId}
          onClose={() => setPanel(null)}
        />
      )}
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded border border-[color:var(--border-primary)] p-2">
      <legend className="px-1 text-[10px] font-bold uppercase tracking-wide text-[color:var(--text-tertiary)]">
        {title}
      </legend>
      <div className="flex flex-col gap-1">{children}</div>
    </fieldset>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[11px] text-[color:var(--text-primary)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-[color:var(--border-secondary)]"
      />
      {label}
    </label>
  );
}

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "navy" | "green" | "amber" | "red";
}) {
  const tones = {
    navy: "bg-[color:var(--navy-100)] text-[color:var(--navy-600)]",
    green: "bg-[color:var(--green-100)] text-[color:var(--green-500)]",
    amber: "bg-[color:var(--orange-100)] text-[color:var(--orange-500)]",
    red: "bg-[#fde7e9] text-[#c92a2a]",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums",
        tones[tone]
      )}
    >
      <span className="font-normal opacity-80">{label}</span>
      {value}
    </span>
  );
}

function SeverityPill({ severity }: { severity: Severity }) {
  const map = {
    critical: { bg: "bg-[#fde7e9]", text: "text-[#c92a2a]" },
    high: { bg: "bg-[#fff0e0]", text: "text-[#d97706]" },
    medium: { bg: "bg-[#dff0fb]", text: "text-[#1d6fa5]" },
    low: { bg: "bg-[#e8eef8]", text: "text-[#3a486a]" },
  } as const;
  const m = map[severity];
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
        m.bg,
        m.text
      )}
    >
      {severity}
    </span>
  );
}

function CVEHeatRow({
  row,
  visibleServices,
  onOpenRow,
  onOpenCell,
}: {
  row: CVEMatrixRow;
  visibleServices: { id: string; name: string }[];
  onOpenRow: () => void;
  onOpenCell: (serviceId: string) => void;
}) {
  const totalHit = visibleServices.filter((s) => row.perService[s.id]).length;
  const prodHit = visibleServices.filter((s) => {
    const c = row.perService[s.id];
    return c?.runtime.deployed;
  }).length;

  const barPct = totalHit === 0 ? 0 : Math.round((prodHit / totalHit) * 100);

  return (
    <tr className="group border-t border-[color:var(--border-primary)] hover:bg-[color:var(--surface-secondary)]">
      <td className="sticky left-0 z-20 bg-white px-2 py-1.5 align-top shadow-[4px_0_8px_-4px_rgba(0,0,0,.08)] group-hover:bg-[color:var(--surface-secondary)]">
        <button
          type="button"
          onClick={onOpenRow}
          className="w-full text-left"
        >
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[color:var(--navy-600)]">
            {row.cve.id}
            <SeverityPill severity={row.cve.severity} />
            {row.cve.jfrogSeverity &&
              row.cve.jfrogSeverity !== row.cve.severity && (
                <span className="inline-flex items-center gap-1 text-[9px] text-[color:var(--text-tertiary)]">
                  JF:
                  <SeverityPill severity={row.cve.jfrogSeverity} />
                </span>
              )}
          </div>
          <div className="mt-1 font-mono text-[10px] text-[color:var(--text-secondary)]">
            Fix: {row.cve.fixedVersion ?? "—"}
          </div>
          <BlastRadiusBar pct={barPct} prod={prodHit} total={totalHit} />
        </button>
      </td>
      {visibleServices.map((svc) => {
        const cell = row.perService[svc.id];
        return (
          <td
            key={svc.id}
            className="border-l border-[color:var(--border-primary)] px-1 py-1 align-middle text-center"
          >
            <MatrixCellVisual
              cell={cell ?? null}
              onOpen={
                cell ? () => onOpenCell(svc.id) : undefined
              }
              serviceName={svc.name}
            />
          </td>
        );
      })}
    </tr>
  );
}

function BlastRadiusBar({
  pct,
  prod,
  total,
}: {
  pct: number;
  prod: number;
  total: number;
}) {
  return (
    <div className="mt-1.5" title={`${prod} / ${total} affected services deployed in prod`}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-tertiary)]">
        <div
          className="h-full rounded-full bg-[color:var(--orange-500)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-0.5 text-[9px] tabular-nums text-[color:var(--text-tertiary)]">
        Prod blast {prod}/{total}
      </div>
    </div>
  );
}

function MatrixCellVisual({
  cell,
  serviceName,
  onOpen,
}: {
  cell: CVEMatrixCell | null;
  serviceName: string;
  onOpen?: () => void;
}) {
  const [hover, setHover] = useState(false);

  if (!cell) {
    return (
      <div className="flex h-10 items-center justify-center text-[color:var(--text-tertiary)] opacity-40">
        ·
      </div>
    );
  }

  const heat = cellHeatClass(cell);

  const bg =
    heat === "red"
      ? "bg-[#fde7e9] border-[#f5aeb5]"
      : heat === "amber"
        ? "bg-[#fff7e6] border-[color:var(--orange-500)]"
        : "bg-[color:var(--green-100)] border-[color:var(--green-500)]";

  const muted =
    !cell.runtime.deployed &&
    "border border-[color:var(--border-secondary)] bg-[color:var(--surface-tertiary)] text-[color:var(--text-secondary)]";

  const px = cellSizePx(cell.componentCount);

  const tip = `${serviceName} · v${cell.serviceVersion} · ${cell.componentCount} component(s) · runtime: deployed=${cell.runtime.deployed ? "Y" : "N"}, reachable=${cell.runtime.reachable ? "Y" : "N"}, internet-facing=${cell.runtime.internetFacing ? "Y" : "N"}, customers affected=${cell.runtime.customerImpact}`;

  if (!cell.runtime.deployed) {
    return (
      <div className="relative flex h-10 items-center justify-center">
        <button
          type="button"
          title={tip}
          onClick={onOpen}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ width: px, height: px, minWidth: px, minHeight: px }}
          className={cn(
            "flex items-center justify-center rounded-[3px] text-[10px] font-bold tabular-nums",
            muted
          )}
        >
          {cell.componentCount}
        </button>
        {hover && <HoverTip text={tip} />}
      </div>
    );
  }

  return (
    <div className="relative flex h-10 items-center justify-center">
      <button
        type="button"
        title={tip}
        onClick={onOpen}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ width: px, height: px, minWidth: px, minHeight: px }}
        className={cn(
          "relative flex items-center justify-center rounded-[4px] border-2 text-[10px] font-bold tabular-nums text-[color:var(--text-primary)]",
          bg
        )}
      >
        {cell.componentCount}
        <span
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[color:var(--green-500)] ring-2 ring-white animate-pulse"
          title="Currently running in prod"
        />
      </button>
      {hover && <HoverTip text={tip} />}
    </div>
  );
}

function HoverTip({ text }: { text: string }) {
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 w-64 -translate-x-1/2 rounded border border-[color:var(--border-primary)] bg-white p-2 text-left text-[10px] leading-snug text-[color:var(--text-primary)] shadow-lg"
    >
      {text}
    </div>
  );
}

function CVEPanel({
  row,
  visibleServices,
  focusServiceId,
  onClose,
}: {
  row: CVEMatrixRow;
  visibleServices: { id: string; name: string; ownerName: string }[];
  focusServiceId: string | null;
  onClose: () => void;
}) {
  const affected = visibleServices.filter((s) => row.perService[s.id]);

  useEffect(() => {
    if (!focusServiceId) return;
    const t = window.setTimeout(() => {
      document
        .getElementById(`matrix-svc-${focusServiceId}`)
        ?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [focusServiceId, row.cve.id]);

  return (
    <>
      <button
        type="button"
        aria-label="Close panel"
        className="fixed inset-0 z-40 bg-black/25"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-[min(480px,100vw)] flex-col border-l border-[color:var(--border-primary)] bg-[color:var(--surface-primary)] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[color:var(--border-primary)] px-4 py-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[15px] font-bold text-[color:var(--navy-600)]">
              {row.cve.id}
              <SeverityPill severity={row.cve.severity} />
              {row.cve.jfrogSeverity &&
                row.cve.jfrogSeverity !== row.cve.severity && (
                <span className="text-[11px] text-[color:var(--text-secondary)]">
                  JFrog:{" "}
                  <SeverityPill severity={row.cve.jfrogSeverity} />
                </span>
              )}
            </div>
            <div className="mt-2 space-y-1 text-[11px] text-[color:var(--text-secondary)]">
              <div>
                Fix versions:{" "}
                <span className="font-mono">{row.cve.fixedVersion ?? "—"}</span>
              </div>
              <a
                className="inline-flex items-center gap-1 text-[color:var(--navy-600)] underline"
                href={packageUrl(row.cve.id, row.cve.component)}
                target="_blank"
                rel="noreferrer"
              >
                Package reference
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 hover:bg-[color:var(--surface-secondary)]"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[color:var(--icon-tertiary)]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <h3 className="text-[12px] font-bold uppercase tracking-wide text-[color:var(--text-tertiary)]">
            Summary
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--text-primary)]">
            {row.cve.summary}
          </p>

          <h3 className="mt-6 text-[12px] font-bold uppercase tracking-wide text-[color:var(--text-tertiary)]">
            Blast radius · affected services
          </h3>
          <div className="mt-2 flex flex-col gap-3">
            {affected.map((svc) => {
              const cell = row.perService[svc.id]!;
              return (
                <div
                  key={svc.id}
                  id={`matrix-svc-${svc.id}`}
                  className={cn(
                    "scroll-mt-24 rounded-md border border-[color:var(--border-primary)] bg-white p-3",
                    focusServiceId === svc.id &&
                      "ring-2 ring-[color:var(--green-500)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono text-[13px] font-semibold text-[color:var(--navy-600)]">
                        {svc.name}
                      </div>
                      <div className="text-[11px] text-[color:var(--text-secondary)]">
                        Owner: {svc.ownerName}
                      </div>
                    </div>
                    <SLAPill status={cell.slaStatus} />
                  </div>
                  <div className="mt-2 text-[11px] text-[color:var(--text-secondary)]">
                    v{cell.serviceVersion} · {cell.componentCount} affected
                    component(s)
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <RuntimeBadge label="Deployed" on={cell.runtime.deployed} />
                    <RuntimeBadge label="Reachable" on={cell.runtime.reachable} />
                    <RuntimeBadge
                      label="Internet-facing"
                      on={cell.runtime.internetFacing}
                    />
                    <RuntimeBadge
                      label={`Customers ${cell.runtime.customerImpact}`}
                      on={cell.runtime.customerImpact > 0}
                    />
                  </div>
                  <p className="mt-2 border-t border-[color:var(--border-primary)] pt-2 text-[11px] text-[color:var(--text-secondary)]">
                    <span className="font-semibold text-[color:var(--text-primary)]">
                      Suggested action:
                    </span>{" "}
                    {suggestedAction(cell)}
                  </p>
                  {cell.runtime.deployed && (
                    <>
                      <h4 className="mt-3 text-[10px] font-bold uppercase tracking-wide text-[color:var(--text-tertiary)]">
                        Currently running in
                      </h4>
                      <ul className="mt-1 list-inside list-disc text-[11px] text-[color:var(--text-secondary)]">
                        {cell.runtime.runningPods.map((pod) => (
                          <li key={pod}>
                            Pod <span className="font-mono">{pod}</span>{" "}
                            <span className="text-[color:var(--text-tertiary)]">
                              (
                              {cell.runtime.runningClusters.join(", ")} ·{" "}
                              {cell.runtime.customerImpact > 0
                                ? `${cell.runtime.customerImpact} SaaS tenants`
                                : "self-managed footprint"}
                              )
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[color:var(--border-primary)] bg-[color:var(--surface-secondary)] px-4 py-3">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="h-9 rounded bg-[color:var(--navy-600)] text-[12px] font-semibold text-white opacity-80"
            >
              Open Jira tickets for all affected services
            </button>
            <button
              type="button"
              className="h-9 rounded border border-[color:var(--border-secondary)] bg-white text-[12px] font-semibold text-[color:var(--text-secondary)] opacity-80"
            >
              Notify service owners
            </button>
            <button
              type="button"
              className="h-9 rounded border border-[color:var(--border-secondary)] bg-white text-[12px] font-semibold text-[color:var(--text-secondary)] opacity-80"
            >
              Mark as accepted risk
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SLAPill({ status }: { status: CVEMatrixCell["slaStatus"] }) {
  const map = {
    breached: "bg-[#fde7e9] text-[#c92a2a]",
    within: "bg-[color:var(--green-100)] text-[color:var(--green-500)]",
    no_data: "bg-[color:var(--surface-tertiary)] text-[color:var(--text-secondary)]",
  } as const;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
        map[status]
      )}
    >
      SLA {status.replace("_", " ")}
    </span>
  );
}

function RuntimeBadge({ label, on }: { label: string; on: boolean }) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase",
        on
          ? "bg-[color:var(--green-100)] text-[color:var(--green-500)]"
          : "bg-[color:var(--surface-tertiary)] text-[color:var(--text-tertiary)]"
      )}
    >
      {label}
    </span>
  );
}
