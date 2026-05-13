"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  ExternalLink,
  Info,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  Service,
  ServiceVersion,
  Severity,
  SLAStatus,
  Core,
} from "@/lib/types";
import { DEFAULT_SLA_POLICY } from "@/lib/fixtures";
import {
  SeverityPill,
  SLAStatusPill,
  TrustBadge,
  SupportTierPill,
  JFrogLogo,
} from "@/components/Pills";
import { EvidenceModal } from "@/components/EvidenceModal";

export function ServiceDetailClient({
  service,
  core,
}: {
  service: Service;
  core: Core;
}) {
  const [versionIdx, setVersionIdx] = useState(0);
  const [showEvidence, setShowEvidence] = useState(false);
  const [activeRepoIdx, setActiveRepoIdx] = useState(0);
  const v = service.versions[versionIdx];
  const counts = countSeverities(v.cves);

  return (
    <div className="px-6 py-6">
      <div className="mb-2 flex items-center gap-2 text-[12px] text-[color:var(--text-tertiary)]">
        <Link href="/" className="hover:text-[color:var(--navy-600)]">
          Cores
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/cores/${core.id}`}
          className="hover:text-[color:var(--navy-600)]"
        >
          {core.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[color:var(--text-secondary)]">
          {service.name}
        </span>
      </div>

      <h2 className="mb-4 text-center text-[20px] font-semibold text-[color:var(--navy-600)]">
        Service Overview
      </h2>

      {/* Version selector */}
      <div className="mx-auto mb-3 flex max-w-[480px] items-center justify-center gap-2 rounded-md border border-[color:var(--border-primary)] bg-white px-3 py-2 text-[12px]">
        <span className="text-[color:var(--text-tertiary)]">
          View previous version:
        </span>
        <select
          value={versionIdx}
          onChange={(e) => setVersionIdx(Number(e.target.value))}
          className="rounded border border-[color:var(--border-secondary)] bg-white px-2 py-1 text-[12px] font-semibold text-[color:var(--navy-600)] focus:border-[color:var(--navy-500)] focus:outline-none"
        >
          {service.versions.map((sv, i) => (
            <option key={sv.version} value={i}>
              {i === 0 ? "Latest" : ""} v{sv.version} —{" "}
              {sv.supportTier === "latest"
                ? "Latest"
                : sv.supportTier === "supported"
                  ? "Supported"
                  : "Out of support"}
            </option>
          ))}
        </select>
      </div>

      {/* Service Metadata card */}
      <div className="mx-auto mb-5 max-w-[1100px] rounded-md border border-[color:var(--border-primary)] bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-[color:var(--text-primary)]">
              Service Metadata
            </h3>
            <ExternalLink className="h-3.5 w-3.5 text-[color:var(--icon-tertiary)]" />
            <TrustBadge state={v.trustState} variant="leaf" />
          </div>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded text-[color:var(--icon-tertiary)] hover:bg-[color:var(--surface-tertiary)] hover:text-[color:var(--icon-primary)]"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[12px] sm:grid-cols-4">
          <Field label="Service Name" value={service.name} />
          <Field label="Service Version" value={v.version} />
          <Field label="Core P&E Group" value={core.name} />
          <Field label="Service Owner" value={service.ownerName} accent />
        </div>
      </div>

      {/* Severity counts row */}
      <div className="mx-auto mb-3 flex max-w-[1100px] flex-wrap items-center justify-center gap-3">
        <SeverityPill severity="critical" count={counts.critical} />
        <SeverityPill severity="high" count={counts.high} />
        <SeverityPill severity="medium" count={counts.medium} />
        <SeverityPill severity="secrets" count={counts.secrets} />
        <SeverityPill severity="malicious" count={counts.malicious} />
      </div>

      {/* SLA buttons */}
      <div className="mx-auto mb-1 flex max-w-[1100px] flex-wrap items-center justify-center gap-2">
        <SLABanner
          status="within"
          count={countByStatus(v.cves, "within")}
        />
        <SLABanner
          status="breached"
          count={countByStatus(v.cves, "breached")}
        />
        <SLABanner status="no_data" count={countByStatus(v.cves, "no_data")} />
      </div>
      <p className="mb-5 text-center text-[10px] text-[color:var(--text-tertiary)]">
        Critical: {DEFAULT_SLA_POLICY.durations.critical} days &middot; High:{" "}
        {DEFAULT_SLA_POLICY.durations.high} days &middot; Medium:{" "}
        {DEFAULT_SLA_POLICY.durations.medium} days &middot;{" "}
        <Link href="/policy" className="underline hover:text-[color:var(--navy-600)]">
          Edit SLA Policy
        </Link>
      </p>

      {counts.critical === 0 && (
        <p className="mb-5 text-center text-[12px] font-semibold text-[color:var(--green-500)]">
          We are good! There are no Critical vulnerabilities.
        </p>
      )}

      {/* Repo locations + scan info */}
      <div className="mx-auto mb-5 max-w-[1100px] rounded-md border border-[color:var(--border-primary)] bg-white shadow-sm">
        <header className="border-b border-[color:var(--border-primary)] px-4 py-3 text-[14px] font-semibold text-[color:var(--text-primary)]">
          Service Repository Locations
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <ul className="border-b border-[color:var(--border-primary)] md:border-b-0 md:border-r">
            {v.repoLocations.map((r, i) => (
              <li key={`${r.name}-${i}`}>
                <button
                  type="button"
                  onClick={() => setActiveRepoIdx(i)}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-[12px]",
                    i === activeRepoIdx
                      ? "bg-[color:var(--navy-600)] text-white"
                      : "hover:bg-[color:var(--surface-secondary)]"
                  )}
                >
                  <span className="font-mono">{r.name}</span>
                  {r.isTrustedSource && (
                    <TrustBadge state="trusted" variant="leaf" />
                  )}
                  {r.isCurrent && i !== activeRepoIdx && (
                    <span className="text-[color:var(--green-500)]">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="p-4 text-[12px]">
            <RepoFact label="Xray URL" value={<ExternalLink className="h-4 w-4 text-[color:var(--navy-600)]" />} />
            <RepoFact label="Release Bundle V2 URL" value={<ExternalLink className="h-4 w-4 text-[color:var(--navy-600)]" />} />
            <RepoFact
              label="Scanned by Xray"
              value={<TruthChip value={v.scanStatus.xray} />}
            />
            <RepoFact label="Last Scan Time" value={v.scanStatus.xrayLastScan ?? "—"} />
            <RepoFact
              label="Vuln Contextual Analysis (Indexed Repo)"
              value={<NAChip />}
            />
            <RepoFact
              label="Applied Watches"
              value={
                <div className="flex flex-wrap justify-end gap-1 text-right">
                  {v.scanStatus.appliedWatches.map((w) => (
                    <span
                      key={w}
                      className="rounded bg-[color:var(--surface-tertiary)] px-1.5 py-0.5 text-[10px] font-mono text-[color:var(--text-secondary)]"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              }
            />
            <RepoFact label="Block Download" value={<NAChip />} />
            <RepoFact label="Block Unscanned" value={<NAChip />} />
            <RepoFact label="Fail Build" value={<NAChip />} />
            <RepoFact label="Block Release Bundle Promotion" value={<NAChip />} />
            <RepoFact label="Block Release Bundle Distribution" value={<NAChip />} />

            {v.evidence && (
              <div className="mt-3 border-t border-[color:var(--border-primary)] pt-3">
                <button
                  type="button"
                  onClick={() => setShowEvidence(true)}
                  className="flex h-8 items-center gap-1.5 rounded bg-[color:var(--green-500)] px-3 text-[12px] font-semibold text-white hover:opacity-90"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Show Secured Distribution Evidence
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CVE list for this version */}
      <div className="mx-auto max-w-[1100px] rounded-md border border-[color:var(--border-primary)] bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-[color:var(--border-primary)] px-4 py-3">
          <h3 className="text-[14px] font-semibold text-[color:var(--text-primary)]">
            Vulnerabilities ({v.cves.length})
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] text-[color:var(--text-tertiary)]">
            <SupportTierPill tier={v.supportTier} />
          </div>
        </header>
        {v.cves.length === 0 ? (
          <p className="px-4 py-6 text-center text-[12px] text-[color:var(--text-tertiary)]">
            No tracked vulnerabilities at this version.
          </p>
        ) : (
          <table className="w-full text-[12px]">
            <thead className="bg-[color:var(--surface-secondary)] text-left text-[10px] uppercase tracking-wider text-[color:var(--text-secondary)]">
              <tr>
                <th className="px-4 py-2.5">CVE</th>
                <th className="px-4 py-2.5">JFrog</th>
                <th className="px-4 py-2.5">Severity</th>
                <th className="px-4 py-2.5">Component</th>
                <th className="px-4 py-2.5">Fix version</th>
                <th className="px-4 py-2.5">Lifecycle</th>
                <th className="px-4 py-2.5">SLA</th>
                <th className="px-4 py-2.5">Detected</th>
                <th className="px-4 py-2.5">Jira</th>
              </tr>
            </thead>
            <tbody>
              {v.cves.map((inst) => (
                <tr
                  key={inst.cve.id + inst.detectedAt}
                  className="border-t border-[color:var(--border-primary)]"
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-[color:var(--navy-600)]">
                    {inst.cve.id}
                  </td>
                  <td className="px-4 py-3">
                    <JFrogLogo />
                  </td>
                  <td className="px-4 py-3">
                    <SeverityChip severity={inst.cve.severity} />
                    {inst.cve.jfrogSeverity && inst.cve.jfrogSeverity !== inst.cve.severity && (
                      <div className="mt-1 text-[10px] text-[color:var(--text-tertiary)]">
                        AppSec: {inst.cve.jfrogSeverity}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[color:var(--text-secondary)]">
                    {inst.cve.component}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[color:var(--text-secondary)]">
                    {inst.cve.fixedVersion ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <LifecycleChip state={inst.state} />
                  </td>
                  <td className="px-4 py-3">
                    <SLAStatusPill status={inst.slaStatus} />
                    <div className="mt-1 text-[10px] text-[color:var(--text-tertiary)]">
                      {inst.slaStatus === "breached"
                        ? `${Math.abs(inst.daysToSLA)} days over`
                        : inst.slaStatus === "within"
                          ? `${inst.daysToSLA} days left`
                          : "Not yet released"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--text-secondary)]">
                    {inst.detectedAt}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[color:var(--navy-600)]">
                    {inst.jiraKey}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showEvidence && v.evidence && (
        <EvidenceModal
          evidence={v.evidence}
          serviceName={service.name}
          serviceVersion={v.version}
          onClose={() => setShowEvidence(false)}
        />
      )}
    </div>
  );
}

function Field({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--text-tertiary)]">
        {label}
      </div>
      <div
        className={cn(
          "mt-0.5",
          accent
            ? "font-semibold text-[color:var(--navy-600)]"
            : "text-[color:var(--text-primary)]"
        )}
      >
        {value}
      </div>
    </div>
  );
}

function SLABanner({ status, count }: { status: SLAStatus; count: number }) {
  const map: Record<SLAStatus, { label: string; cls: string }> = {
    within: {
      label: "Within SLA",
      cls: "bg-[color:var(--green-100)] text-[color:var(--green-500)] border-[color:var(--green-500)]/30",
    },
    breached: {
      label: "Exceeded SLA",
      cls: "bg-[color:var(--red-100)] text-[color:var(--red-500)] border-[color:var(--red-500)]/30",
    },
    no_data: {
      label: "No Data",
      cls: "bg-[color:var(--surface-tertiary)] text-[color:var(--text-secondary)] border-[color:var(--gray-300)]",
    },
  };
  const m = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold",
        m.cls
      )}
    >
      {m.label}
      <span className="tabular-nums">{count}</span>
    </span>
  );
}

function RepoFact({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[color:var(--border-primary)] py-2 last:border-b-0">
      <span className="text-[color:var(--text-secondary)]">{label}:</span>
      <div>{value}</div>
    </div>
  );
}

function NAChip() {
  return (
    <span className="inline-flex items-center rounded bg-[color:var(--orange-100)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--orange-500)]">
      N/A
    </span>
  );
}

function TruthChip({ value }: { value: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold text-white",
        value ? "bg-[color:var(--green-500)]" : "bg-[color:var(--red-500)]"
      )}
    >
      {value ? "True" : "False"}
    </span>
  );
}

function SeverityChip({ severity }: { severity: Severity }) {
  const map: Record<Severity, { bg: string; text: string }> = {
    critical: { bg: "bg-[#fde7e9]", text: "text-[#c92a2a]" },
    high: { bg: "bg-[#fff0e0]", text: "text-[#d97706]" },
    medium: { bg: "bg-[#dff0fb]", text: "text-[#1d6fa5]" },
    low: { bg: "bg-[#e8eef8]", text: "text-[#3a486a]" },
  };
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

function LifecycleChip({
  state,
}: {
  state: "backlog" | "action" | "released" | "closed";
}) {
  const map = {
    backlog: { bg: "bg-[color:var(--surface-tertiary)]", text: "text-[color:var(--text-secondary)]", label: "Backlog" },
    action: { bg: "bg-[color:var(--orange-100)]", text: "text-[color:var(--orange-500)]", label: "Action" },
    released: { bg: "bg-[color:var(--red-100)]", text: "text-[color:var(--red-500)]", label: "Released" },
    closed: { bg: "bg-[color:var(--green-100)]", text: "text-[color:var(--green-500)]", label: "Closed" },
  } as const;
  const m = map[state];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold",
        m.bg,
        m.text
      )}
    >
      {m.label}
    </span>
  );
}

function countSeverities(cves: ServiceVersion["cves"]) {
  const c = { critical: 0, high: 0, medium: 0, secrets: 0, malicious: 0 };
  for (const i of cves) {
    if (i.cve.severity === "critical") c.critical += 1;
    if (i.cve.severity === "high") c.high += 1;
    if (i.cve.severity === "medium") c.medium += 1;
  }
  return c;
}

function countByStatus(cves: ServiceVersion["cves"], status: SLAStatus) {
  return cves.filter((c) => c.slaStatus === status).length;
}
