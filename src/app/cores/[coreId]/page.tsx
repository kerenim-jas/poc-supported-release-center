import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  Lock,
  ShieldCheck,
  ShieldOff,
  ScanSearch,
  Search,
  ChevronRight,
} from "lucide-react";
import {
  CORES,
  getCore,
  servicesByCore,
  latestVersion,
} from "@/lib/fixtures";
import { TrustBadge, SLAStatusPill } from "@/components/Pills";

export function generateStaticParams() {
  return CORES.map((c) => ({ coreId: c.id }));
}

/**
 * View B — Services grid within a Core.
 * Mirrors screenshot 9 from Barak's SSDLC dashboard.
 */
export default async function CoreServicesPage({
  params,
}: {
  params: Promise<{ coreId: string }>;
}) {
  const { coreId } = await params;
  const core = getCore(coreId);
  if (!core) notFound();
  const services = servicesByCore(coreId);

  return (
    <div className="px-6 py-6">
      <div className="mb-2 flex items-center gap-2 text-[12px] text-[color:var(--text-tertiary)]">
        <Link href="/" className="hover:text-[color:var(--navy-600)]">
          Cores
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[color:var(--text-secondary)]">{core.name}</span>
      </div>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-semibold text-[color:var(--text-primary)]">
            {core.name}
          </h2>
          <p className="mt-1 text-[12px] text-[color:var(--text-secondary)]">
            Owner: <span className="font-semibold">{core.ownerName}</span>{" "}
            &middot; {services.length} services in this core
          </p>
        </div>
        <div className="relative max-w-[320px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--icon-tertiary)]" />
          <input
            type="text"
            placeholder="or search a service"
            className="h-9 w-full rounded-full border border-[color:var(--border-secondary)] bg-white pl-9 pr-3 text-[13px] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:border-[color:var(--navy-500)] focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <FilterChip icon={AlertTriangle} label="Critical" tone="red" />
        <FilterChip icon={Lock} label="Secrets" tone="purple" />
        <FilterChip icon={ShieldCheck} label="Secure Distribution" tone="green" />
        <FilterChip icon={ShieldOff} label="Not Secure" tone="orange" />
        <FilterChip icon={ScanSearch} label="Not Scanned with Sonar" tone="orange" />
        <FilterChip icon={ScanSearch} label="Not Scanned by Xray" tone="red" />
      </div>

      <p className="mb-3 text-center text-[12px] text-[color:var(--text-secondary)]">
        Showing {services.length} out of {services.length} services
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => {
          const v = latestVersion(svc);
          const counts = countsFor(v.cves);
          const breachCounts = breachesByCounts(v.cves);
          return (
            <Link
              key={svc.id}
              href={`/services/${svc.id}`}
              className="group block rounded-md border border-[color:var(--border-primary)] bg-white p-4 shadow-sm transition-shadow hover:border-[color:var(--navy-200)] hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="truncate text-[14px] font-semibold text-[color:var(--text-primary)] group-hover:text-[color:var(--navy-600)]">
                  {svc.name}
                </h3>
                <TrustBadge state={v.trustState} variant="leaf" />
              </div>

              <div className="mb-3 flex items-center gap-2 text-[11px] text-[color:var(--text-tertiary)]">
                <span>v{v.version}</span>
                <span>&middot;</span>
                <span>{svc.ownerName}</span>
              </div>

              <div className="mb-3 grid grid-cols-4 gap-2 text-center">
                <Stat
                  icon={AlertTriangle}
                  label="Critical"
                  value={counts.critical}
                  tone="red"
                />
                <Stat
                  icon={AlertTriangle}
                  label="High"
                  value={counts.high}
                  tone="orange"
                />
                <Stat
                  icon={AlertTriangle}
                  label="Medium"
                  value={counts.medium}
                  tone="blue"
                />
                <Stat
                  icon={Lock}
                  label="Secrets"
                  value={(svc.id.length * 2) % 4}
                  tone="green"
                />
              </div>

              <div className="rounded-md bg-[color:var(--surface-secondary)] p-2">
                <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--text-secondary)]">
                  <ShieldCheck className="h-3 w-3" />
                  SLA Status
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {breachCounts.critical > 0 && (
                    <span className="inline-flex items-center gap-1 rounded bg-[color:var(--red-100)] px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--red-500)]">
                      Critical {breachCounts.critical}
                    </span>
                  )}
                  {breachCounts.high > 0 && (
                    <span className="inline-flex items-center gap-1 rounded bg-[#fff0e0] px-1.5 py-0.5 text-[10px] font-semibold text-[#d97706]">
                      High {breachCounts.high}
                    </span>
                  )}
                  {breachCounts.critical === 0 && breachCounts.high === 0 && (
                    <SLAStatusPill status="within" />
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

type Tone = "red" | "orange" | "blue" | "green" | "purple";

const TONE_CLS: Record<Tone, { bg: string; text: string }> = {
  red: { bg: "bg-[#fde7e9]", text: "text-[#c92a2a]" },
  orange: { bg: "bg-[#fff0e0]", text: "text-[#d97706]" },
  blue: { bg: "bg-[#dff0fb]", text: "text-[#1d6fa5]" },
  green: { bg: "bg-[#dff7ec]", text: "text-[#0f8a4f]" },
  purple: { bg: "bg-[#ece6fa]", text: "text-[#6b46c1]" },
};

function FilterChip({
  icon: Icon,
  label,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone: Tone;
}) {
  const t = TONE_CLS[tone];
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-full border border-current/20 ${t.bg} ${t.text} px-3 py-1 text-[11px] font-semibold hover:opacity-90`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: Tone;
}) {
  const t = TONE_CLS[tone];
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`relative flex h-7 w-7 items-center justify-center rounded-full ${t.bg} ${t.text}`}
      >
        <Icon className="h-3.5 w-3.5" />
        <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold tabular-nums shadow-sm">
          {value}
        </span>
      </span>
      <span className="text-[10px] text-[color:var(--text-tertiary)]">
        {label}
      </span>
    </div>
  );
}

function countsFor(cves: { cve: { severity: string } }[]) {
  const c = { critical: 0, high: 0, medium: 0 };
  for (const i of cves) {
    if (i.cve.severity === "critical") c.critical += 1;
    if (i.cve.severity === "high") c.high += 1;
    if (i.cve.severity === "medium") c.medium += 1;
  }
  return c;
}

function breachesByCounts(
  cves: { cve: { severity: string }; slaStatus: string }[]
) {
  const c = { critical: 0, high: 0, medium: 0 };
  for (const i of cves) {
    if (i.slaStatus !== "breached") continue;
    if (i.cve.severity === "critical") c.critical += 1;
    if (i.cve.severity === "high") c.high += 1;
    if (i.cve.severity === "medium") c.medium += 1;
  }
  return c;
}
