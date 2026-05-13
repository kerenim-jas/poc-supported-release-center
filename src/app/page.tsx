import Link from "next/link";
import { ArrowRight, Filter, FileText, Search, ShieldCheck } from "lucide-react";
import { CORES, coreSummary } from "@/lib/fixtures";

/**
 * View A — "CHOOSE A CORE" landing page.
 * Mirrors screenshot 3 from Barak's SSDLC dashboard (May 13 2026).
 */
export default function CoresLandingPage() {
  const summaries = CORES.map((c) => coreSummary(c.id));
  const grandTotals = summaries.reduce(
    (acc, s) => {
      acc.services += s.serviceCount;
      acc.trusted += s.trustedCount;
      acc.critical += s.counts.critical;
      acc.high += s.counts.high;
      acc.medium += s.counts.medium;
      acc.secrets += s.counts.secrets;
      acc.malicious += s.counts.maliciousPackages;
      acc.breaches += s.slaBreaches;
      return acc;
    },
    {
      services: 0,
      trusted: 0,
      critical: 0,
      high: 0,
      medium: 0,
      secrets: 0,
      malicious: 0,
      breaches: 0,
    }
  );

  return (
    <div className="px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-[color:var(--text-primary)]">
          Choose a Core
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded border border-[color:var(--border-secondary)] bg-white px-3 text-[12px] font-semibold text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-secondary)]"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded bg-[color:var(--green-500)] px-3 text-[12px] font-semibold text-white hover:opacity-90"
          >
            <FileText className="h-3.5 w-3.5" />
            Create Report (Beta)
          </button>
        </div>
      </div>

      <div className="mb-4 max-w-[420px] relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--icon-tertiary)]" />
        <input
          type="text"
          placeholder="or search a service"
          className="h-9 w-full rounded-full border border-[color:var(--border-secondary)] bg-white pl-9 pr-3 text-[13px] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:border-[color:var(--navy-500)] focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-md border border-[color:var(--border-primary)] bg-white shadow-sm">
        <table className="w-full text-[12px]">
          <thead className="bg-[color:var(--navy-600)] text-white">
            <tr className="text-left uppercase tracking-wider">
              <Th>Core name</Th>
              <Th>Owner</Th>
              <Th align="center">Trusted apps</Th>
              <Th align="center">Latest version</Th>
              <Th align="center">Critical</Th>
              <Th align="center">High</Th>
              <Th align="center">Medium</Th>
              <Th align="center">Secrets</Th>
              <Th align="center">Malicious packages</Th>
              <Th align="center">SLA breaches</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {summaries.map((s) => (
              <tr
                key={s.id}
                className="group border-t border-[color:var(--border-primary)] transition-colors hover:bg-[color:var(--surface-secondary)]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/cores/${s.id}`}
                    className="font-semibold text-[color:var(--navy-600)] hover:underline"
                  >
                    {s.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[color:var(--text-secondary)]">
                  {s.ownerName}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--green-100)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--green-500)]">
                    <ShieldCheck className="h-3 w-3" />
                    {s.trustedCount}/{s.serviceCount}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-[color:var(--text-secondary)]">
                  Latest
                </td>
                <td className="px-4 py-3 text-center">
                  <CountChip value={s.counts.critical} severity="critical" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CountChip value={s.counts.high} severity="high" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CountChip value={s.counts.medium} severity="medium" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CountChip value={s.counts.secrets} severity="secrets" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CountChip
                    value={s.counts.maliciousPackages}
                    severity="malicious"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  {s.slaBreaches > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--red-100)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--red-500)]">
                      {s.slaBreaches}
                    </span>
                  ) : (
                    <span className="text-[color:var(--text-tertiary)]">0</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/cores/${s.id}`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded text-[color:var(--icon-tertiary)] group-hover:bg-[color:var(--surface-tertiary)] group-hover:text-[color:var(--navy-600)]"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-[color:var(--navy-200)] bg-[color:var(--navy-100)] font-semibold text-[color:var(--text-primary)]">
              <td className="px-4 py-3">Grand Total</td>
              <td className="px-4 py-3 text-[color:var(--text-secondary)]">
                {summaries.length} cores
              </td>
              <td className="px-4 py-3 text-center">
                {grandTotals.trusted}/{grandTotals.services}
              </td>
              <td className="px-4 py-3 text-center text-[color:var(--text-tertiary)]">
                —
              </td>
              <td className="px-4 py-3 text-center">{grandTotals.critical}</td>
              <td className="px-4 py-3 text-center">{grandTotals.high}</td>
              <td className="px-4 py-3 text-center">{grandTotals.medium}</td>
              <td className="px-4 py-3 text-center">{grandTotals.secrets}</td>
              <td className="px-4 py-3 text-center">{grandTotals.malicious}</td>
              <td className="px-4 py-3 text-center">{grandTotals.breaches}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ExplainerCard
          title="What is a Core?"
          body="A Core is a functional grouping of services owned by one P&E group (DevOps, Security, ML, etc.). The Core view aggregates SLA and trust state across every service in the group."
        />
        <ExplainerCard
          title="What is a Trusted App?"
          body="A service version that passed Release Bundle V2 + ssdlc-evidence verification (Barak's pre-AppTrust prototype). v0.2 will source this from AppTrust evidence stores once available."
        />
        <ExplainerCard
          title="What drives SLA breaches?"
          body="The active SLA Policy: Critical 5d, High 30d, Medium 90d on the latest minor — Critical only on n-1, n-2. Visit the SLA Policy tab to edit."
        />
      </div>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-[10px] font-semibold ${
        align === "center"
          ? "text-center"
          : align === "right"
            ? "text-right"
            : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function CountChip({
  value,
  severity,
}: {
  value: number;
  severity: "critical" | "high" | "medium" | "secrets" | "malicious";
}) {
  const styles = {
    critical: "bg-[#fde7e9] text-[#c92a2a]",
    high: "bg-[#fff0e0] text-[#d97706]",
    medium: "bg-[#dff0fb] text-[#1d6fa5]",
    secrets:
      value > 0 ? "bg-[#dff7ec] text-[#0f8a4f]" : "bg-[color:var(--surface-tertiary)] text-[color:var(--text-tertiary)]",
    malicious:
      value > 0 ? "bg-[#fde7f3] text-[#b3197d]" : "bg-[color:var(--surface-tertiary)] text-[color:var(--text-tertiary)]",
  } as const;
  return (
    <span
      className={`inline-flex h-6 min-w-[28px] items-center justify-center rounded-full px-2 text-[11px] font-semibold tabular-nums ${styles[severity]}`}
    >
      {value}
    </span>
  );
}

function ExplainerCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-[color:var(--border-primary)] bg-white p-4">
      <h3 className="text-[13px] font-semibold text-[color:var(--text-primary)]">
        {title}
      </h3>
      <p className="mt-1.5 text-[12px] leading-relaxed text-[color:var(--text-secondary)]">
        {body}
      </p>
    </div>
  );
}
