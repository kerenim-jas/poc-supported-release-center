"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Save, RotateCcw, ExternalLink, Info } from "lucide-react";
import { DEFAULT_SLA_POLICY } from "@/lib/fixtures";
import { SLAPolicy, Severity } from "@/lib/types";
import { cn } from "@/lib/cn";

const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];

/**
 * SLA Policy editor.
 *
 * Drives the SLA timer durations, the support window, and which severities
 * apply to which support tier.  This is the single source of truth that the
 * lifecycle state machine (see /lifecycle) uses to compute "Within SLA",
 * "Exceeded SLA", "No Data" everywhere else.
 */
export default function PolicyPage() {
  const [policy, setPolicy] = useState<SLAPolicy>(DEFAULT_SLA_POLICY);

  function updateDuration(sev: Severity, value: number) {
    setPolicy((p) => ({
      ...p,
      durations: { ...p.durations, [sev]: value },
    }));
  }

  function toggleCoverage(tier: "latest" | "supported", sev: Severity) {
    setPolicy((p) => {
      const cur = new Set(p.coverage[tier]);
      if (cur.has(sev)) cur.delete(sev);
      else cur.add(sev);
      return {
        ...p,
        coverage: {
          ...p.coverage,
          [tier]: SEVERITIES.filter((s) => cur.has(s)),
        },
      };
    });
  }

  return (
    <div className="px-6 py-6">
      <div className="mb-2 flex items-center gap-2 text-[12px] text-[color:var(--text-tertiary)]">
        <Link href="/" className="hover:text-[color:var(--navy-600)]">
          Cores
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[color:var(--text-secondary)]">SLA Policy</span>
      </div>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold text-[color:var(--text-primary)]">
            SLA Policy
          </h2>
          <p className="mt-1 max-w-[820px] text-[12px] text-[color:var(--text-secondary)]">
            The rule that defines what counts as &ldquo;supported&rdquo; and how
            quickly a vulnerability must be fixed before it counts as a breach.
            This page is the only place these numbers should live — every SLA
            pill, count, and report in the product reads from here.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPolicy(DEFAULT_SLA_POLICY)}
            className="flex h-8 items-center gap-1.5 rounded border border-[color:var(--border-secondary)] bg-white px-3 text-[12px] font-semibold text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-secondary)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to defaults
          </button>
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded bg-[color:var(--green-500)] px-3 text-[12px] font-semibold text-white hover:opacity-90"
          >
            <Save className="h-3.5 w-3.5" />
            Save policy
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* SLA Durations */}
        <Section title="SLA durations per severity" subtitle="How long after detection a fix must ship before SLA is breached.">
          <div className="space-y-2">
            {SEVERITIES.map((sev) => (
              <div
                key={sev}
                className="flex items-center justify-between rounded-md border border-[color:var(--border-primary)] bg-white px-3 py-2"
              >
                <SeverityChip severity={sev} />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={policy.durations[sev]}
                    onChange={(e) => updateDuration(sev, Number(e.target.value))}
                    className="h-8 w-16 rounded border border-[color:var(--border-secondary)] bg-white px-2 text-right text-[12px] font-semibold text-[color:var(--text-primary)] focus:border-[color:var(--navy-500)] focus:outline-none"
                  />
                  <span className="text-[12px] text-[color:var(--text-tertiary)]">
                    days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Support window */}
        <Section
          title="Support window"
          subtitle="Pulled from the JFrog End-of-Life page. Versions older than this fall out of support automatically."
        >
          <div className="space-y-2">
            <Field label="Support window">
              <input
                type="number"
                min={6}
                max={36}
                value={policy.supportWindowMonths}
                onChange={(e) =>
                  setPolicy((p) => ({
                    ...p,
                    supportWindowMonths: Number(e.target.value),
                  }))
                }
                className="h-8 w-16 rounded border border-[color:var(--border-secondary)] bg-white px-2 text-right text-[12px] font-semibold text-[color:var(--text-primary)] focus:border-[color:var(--navy-500)] focus:outline-none"
              />
              <span className="text-[12px] text-[color:var(--text-tertiary)]">
                months (currently 18 for self-managed Artifactory)
              </span>
            </Field>
            <Field label="Minor versions back">
              <input
                type="number"
                min={1}
                max={6}
                value={policy.minorsSupported}
                onChange={(e) =>
                  setPolicy((p) => ({
                    ...p,
                    minorsSupported: Number(e.target.value),
                  }))
                }
                className="h-8 w-16 rounded border border-[color:var(--border-secondary)] bg-white px-2 text-right text-[12px] font-semibold text-[color:var(--text-primary)] focus:border-[color:var(--navy-500)] focus:outline-none"
              />
              <span className="text-[12px] text-[color:var(--text-tertiary)]">
                n−{policy.minorsSupported} = oldest supported branch
              </span>
            </Field>
            <Field label="EoL source">
              <a
                href={policy.endOfLifeSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 truncate text-[12px] text-[color:var(--navy-600)] hover:underline"
              >
                JFrog Help Center <ExternalLink className="h-3 w-3" />
              </a>
            </Field>
          </div>
        </Section>

        {/* Coverage matrix */}
        <Section
          title="Coverage by support tier"
          subtitle="Which severities require a fix on each support tier. (Barak: today only Critical on n-1; he wishes High also on n-1, but operationally can't.)"
          full
        >
          <div className="overflow-hidden rounded-md border border-[color:var(--border-primary)] bg-white">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-[color:var(--surface-secondary)] text-left text-[10px] uppercase tracking-wider text-[color:var(--text-secondary)]">
                  <th className="px-4 py-2.5">Support tier</th>
                  {SEVERITIES.map((s) => (
                    <th key={s} className="px-4 py-2.5 text-center">
                      <SeverityChip severity={s} />
                    </th>
                  ))}
                  <th className="px-4 py-2.5 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <CoverageRow
                  label="Latest version"
                  description="The current minor — full severity coverage including medium."
                  selected={policy.coverage.latest}
                  onToggle={(s) => toggleCoverage("latest", s)}
                />
                <CoverageRow
                  label={`Supported (n−1 … n−${policy.minorsSupported})`}
                  description="Older minor branches inside the support window. Today: Critical only."
                  selected={policy.coverage.supported}
                  onToggle={(s) => toggleCoverage("supported", s)}
                />
                <tr className="border-t border-[color:var(--border-primary)] bg-[color:var(--red-100)] text-[color:var(--red-500)]">
                  <td className="px-4 py-2.5 font-semibold">Out of support</td>
                  {SEVERITIES.map((s) => (
                    <td key={s} className="px-4 py-2.5 text-center text-[color:var(--red-500)] opacity-60">
                      —
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-[11px]">
                    Beyond support window. Surfaced as &ldquo;noise&rdquo; — Release
                    Manager wants these out of the daily view.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Implications panel */}
        <Section title="Live preview — what this policy means" subtitle="Computed from the values above. Updates as you edit." full>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <PreviewCard
              label="Critical fix window"
              value={`${policy.durations.critical} days`}
              caption="across every supported branch"
            />
            <PreviewCard
              label="High fix window"
              value={`${policy.durations.high} days`}
              caption={`tracked on ${policy.coverage.supported.includes("high") ? "all supported" : "latest only"}`}
            />
            <PreviewCard
              label="Branches in support"
              value={`n + ${policy.minorsSupported}`}
              caption={`${policy.supportWindowMonths}-month window`}
            />
            <PreviewCard
              label="Default Jira sync"
              value="Per CVE per service"
              caption="auto-close when CVE absent in next build"
            />
          </div>
        </Section>
      </div>

      <div className="mt-6 rounded-md border border-[color:var(--orange-500)]/30 bg-[color:var(--orange-100)]/40 p-4">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-[color:var(--orange-500)]" />
          <div className="text-[12px] text-[color:var(--text-primary)]">
            <p className="font-semibold">SOX traceability</p>
            <p className="mt-1 text-[color:var(--text-secondary)]">
              Every policy change is versioned and audit-logged with the user
              identity and timestamp. The CISO Policy document remains the
              source of truth for compliance; this editor is the operational
              implementation that&rsquo;s evaluated continuously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
  full,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={cn("rounded-md border border-[color:var(--border-primary)] bg-[color:var(--surface-secondary)] p-4", full && "lg:col-span-2") }>
      <h3 className="text-[14px] font-semibold text-[color:var(--text-primary)]">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-0.5 text-[11px] text-[color:var(--text-secondary)]">
          {subtitle}
        </p>
      )}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-[color:var(--border-primary)] bg-white px-3 py-2">
      <span className="text-[12px] font-semibold text-[color:var(--text-secondary)]">
        {label}
      </span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
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

function CoverageRow({
  label,
  description,
  selected,
  onToggle,
}: {
  label: string;
  description: string;
  selected: Severity[];
  onToggle: (s: Severity) => void;
}) {
  return (
    <tr className="border-t border-[color:var(--border-primary)]">
      <td className="px-4 py-3 font-semibold text-[color:var(--text-primary)]">
        {label}
      </td>
      {SEVERITIES.map((s) => {
        const on = selected.includes(s);
        return (
          <td key={s} className="px-4 py-3 text-center">
            <input
              type="checkbox"
              checked={on}
              onChange={() => onToggle(s)}
              className="h-4 w-4 cursor-pointer accent-[color:var(--green-500)]"
            />
          </td>
        );
      })}
      <td className="px-4 py-3 text-[11px] text-[color:var(--text-secondary)]">
        {description}
      </td>
    </tr>
  );
}

function PreviewCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="rounded-md border border-[color:var(--border-primary)] bg-white p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--text-tertiary)]">
        {label}
      </div>
      <div className="mt-1 text-[16px] font-semibold text-[color:var(--navy-600)]">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-[color:var(--text-secondary)]">
        {caption}
      </div>
    </div>
  );
}
