import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CORES, SERVICES, buildCVEMatrix, getCore } from "@/lib/fixtures";
import { cn } from "@/lib/cn";

/**
 * View D — CVE × Service matrix.
 * Mirrors screenshot 2 (Ambarish's Excel pivot).
 *
 * Rows: CVEs.  Columns: services (grouped by core).  Cells: # affected
 * components in that service, with the worst SLA status as background.
 */
export default function MatrixPage() {
  const rows = buildCVEMatrix();
  // Order services by core for stable column ordering
  const servicesOrdered = [...SERVICES].sort((a, b) => {
    const coreOrder =
      CORES.findIndex((c) => c.id === a.coreId) -
      CORES.findIndex((c) => c.id === b.coreId);
    if (coreOrder !== 0) return coreOrder;
    return a.name.localeCompare(b.name);
  });

  // Group services by core for the header band
  const coreGroups: { core: { id: string; name: string }; count: number }[] = [];
  for (const svc of servicesOrdered) {
    const last = coreGroups[coreGroups.length - 1];
    if (last && last.core.id === svc.coreId) {
      last.count += 1;
    } else {
      const c = getCore(svc.coreId)!;
      coreGroups.push({ core: c, count: 1 });
    }
  }

  // Column totals
  const colTotals: Record<string, number> = {};
  for (const r of rows) {
    for (const [sid, cell] of Object.entries(r.perService)) {
      if (!cell) continue;
      colTotals[sid] = (colTotals[sid] ?? 0) + cell.componentCount;
    }
  }

  return (
    <div className="px-6 py-6">
      <div className="mb-2 flex items-center gap-2 text-[12px] text-[color:var(--text-tertiary)]">
        <Link href="/" className="hover:text-[color:var(--navy-600)]">
          Cores
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[color:var(--text-secondary)]">
          CVE × Service matrix
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold text-[color:var(--text-primary)]">
            CVE × Service matrix
          </h2>
          <p className="mt-1 text-[12px] text-[color:var(--text-secondary)]">
            Ambarish&rsquo;s Excel pivot, productized. Each cell shows the number of
            components in that service affected by the CVE. Color reflects worst
            SLA status across instances.
          </p>
        </div>
        <Legend />
      </div>

      <div className="overflow-auto rounded-md border border-[color:var(--border-primary)] bg-white shadow-sm">
        <table className="min-w-full text-[11px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[color:var(--navy-600)] text-white">
              <th className="sticky left-0 z-20 min-w-[180px] bg-[color:var(--navy-600)] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider">
                CVE
              </th>
              <th className="bg-[color:var(--navy-600)] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider">
                Severity
              </th>
              <th className="bg-[color:var(--navy-600)] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider">
                JFrog severity
              </th>
              <th className="bg-[color:var(--navy-600)] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider">
                Component
              </th>
              <th className="bg-[color:var(--navy-600)] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider">
                Fix versions
              </th>
              {coreGroups.map((g) => (
                <th
                  key={g.core.id}
                  colSpan={g.count}
                  className="border-l border-white/20 bg-[color:var(--navy-600)] px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider"
                >
                  {g.core.name}
                </th>
              ))}
              <th className="border-l border-white/20 bg-[color:var(--navy-600)] px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wider">
                Total
              </th>
            </tr>
            <tr className="bg-[color:var(--navy-100)] text-[color:var(--text-primary)]">
              <th className="sticky left-0 z-20 bg-[color:var(--navy-100)] px-3 py-2" />
              <th className="bg-[color:var(--navy-100)] px-3 py-2" />
              <th className="bg-[color:var(--navy-100)] px-3 py-2" />
              <th className="bg-[color:var(--navy-100)] px-3 py-2" />
              <th className="bg-[color:var(--navy-100)] px-3 py-2" />
              {servicesOrdered.map((svc) => (
                <th
                  key={svc.id}
                  className="bg-[color:var(--navy-100)] px-2 py-2 text-center text-[10px] font-mono"
                  title={`${svc.name} (${getCore(svc.coreId)?.name})`}
                >
                  <Link
                    href={`/services/${svc.id}`}
                    className="block truncate hover:text-[color:var(--navy-600)] hover:underline"
                    style={{ writingMode: "vertical-rl", maxHeight: 110 }}
                  >
                    {svc.name}
                  </Link>
                </th>
              ))}
              <th className="bg-[color:var(--navy-100)] px-3 py-2 text-center text-[11px] font-semibold">
                Σ
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr
                key={r.cve.id}
                className="border-t border-[color:var(--border-primary)] hover:bg-[color:var(--surface-secondary)]"
              >
                <td className="sticky left-0 z-10 min-w-[180px] bg-white px-3 py-2 font-mono text-[11px] font-semibold text-[color:var(--navy-600)]">
                  {r.cve.id}
                </td>
                <td className="px-3 py-2">
                  <SeverityChip severity={r.cve.severity} />
                </td>
                <td className="px-3 py-2">
                  {r.cve.jfrogSeverity ? (
                    <SeverityChip severity={r.cve.jfrogSeverity} />
                  ) : (
                    <span className="text-[color:var(--text-tertiary)]">—</span>
                  )}
                </td>
                <td className="px-3 py-2 font-mono text-[10px] text-[color:var(--text-secondary)]">
                  {r.cve.component}
                </td>
                <td className="px-3 py-2 font-mono text-[10px] text-[color:var(--text-secondary)]">
                  {r.cve.fixedVersion ?? "—"}
                </td>
                {servicesOrdered.map((svc) => {
                  const cell = r.perService[svc.id];
                  if (!cell) {
                    return (
                      <td
                        key={svc.id}
                        className="border-l border-[color:var(--border-primary)] px-2 py-2 text-center text-[color:var(--text-tertiary)]"
                      >
                        ·
                      </td>
                    );
                  }
                  const tone =
                    cell.slaStatus === "breached"
                      ? "bg-[#fde7e9] text-[#c92a2a]"
                      : cell.slaStatus === "no_data"
                        ? "bg-[color:var(--surface-tertiary)] text-[color:var(--text-secondary)]"
                        : "bg-[color:var(--green-100)] text-[color:var(--green-500)]";
                  return (
                    <td
                      key={svc.id}
                      className={cn(
                        "border-l border-[color:var(--border-primary)] px-2 py-2 text-center font-semibold tabular-nums",
                        tone
                      )}
                      title={`${svc.name} — ${cell.componentCount} component(s) — ${cell.state}, SLA ${cell.slaStatus}`}
                    >
                      {cell.componentCount}
                    </td>
                  );
                })}
                <td className="border-l border-[color:var(--border-primary)] bg-[color:var(--navy-100)] px-3 py-2 text-center font-semibold text-[color:var(--navy-600)]">
                  {r.totalComponents}
                </td>
              </tr>
            ))}

            <tr className="border-t-2 border-[color:var(--navy-200)] bg-[color:var(--navy-100)] text-[color:var(--text-primary)]">
              <td className="sticky left-0 bg-[color:var(--navy-100)] px-3 py-2 text-[11px] font-semibold">
                Grand total
              </td>
              <td className="bg-[color:var(--navy-100)] px-3 py-2" colSpan={4} />
              {servicesOrdered.map((svc) => (
                <td
                  key={svc.id}
                  className="border-l border-[color:var(--border-primary)] bg-[color:var(--navy-100)] px-2 py-2 text-center text-[11px] font-semibold tabular-nums"
                >
                  {colTotals[svc.id] ?? 0}
                </td>
              ))}
              <td className="border-l border-[color:var(--border-primary)] bg-[color:var(--navy-100)] px-3 py-2 text-center text-[11px] font-semibold">
                {Object.values(colTotals).reduce((a, b) => a + b, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-center text-[11px] text-[color:var(--text-tertiary)]">
        This is the same view Ambarish maintains in Google Sheets today. Productized,
        it auto-updates as Xray + JAS findings change. Click any cell to drill into
        that service.
      </p>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-[11px]">
      <LegendChip color="bg-[color:var(--green-100)] text-[color:var(--green-500)]" label="Within SLA" />
      <LegendChip color="bg-[#fde7e9] text-[#c92a2a]" label="Exceeded SLA" />
      <LegendChip color="bg-[color:var(--surface-tertiary)] text-[color:var(--text-secondary)]" label="No data" />
    </div>
  );
}

function LegendChip({ color, label }: { color: string; label: string }) {
  return (
    <span className={cn("inline-flex items-center rounded px-2 py-0.5 font-semibold", color)}>
      {label}
    </span>
  );
}

function SeverityChip({
  severity,
}: {
  severity: "critical" | "high" | "medium" | "low";
}) {
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
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        m.bg,
        m.text
      )}
    >
      {severity}
    </span>
  );
}
