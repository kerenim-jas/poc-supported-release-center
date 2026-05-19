"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import type { Severity } from "@/lib/types";
import {
  APPLICATIONS,
  DEFAULT_SLA_POLICY,
  SLA_POLICY_SELF_MANAGED,
  applicationsUsingPolicy,
} from "@/lib/fixtures";

const SEVERITY_OPTIONS: Severity[] = ["critical", "high", "medium", "low"];

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  hint: string;
}) {
  return (
    <div className="flex items-start gap-4 border-b border-[color:var(--border-primary)] py-5 last:border-0">
      <button
        type="button"
        aria-pressed={checked}
        onClick={onChange}
        className={`relative mt-1 h-6 w-11 rounded-full transition-colors ${checked ? "bg-[color:var(--green-500)]" : "bg-[color:var(--gray-400)]"
          }`}
      >
        <span
          className={`absolute top-0.5 left-1 h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${checked ? "translate-x-5" : ""
            }`}
        />
      </button>
      <div>
        <div className="text-[13px] font-semibold">{label}</div>
        <div className="mt-2 text-[12px] text-[color:var(--text-secondary)]">{hint}</div>
      </div>
    </div>
  );
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-[11px] font-semibold capitalize ${selected
          ? "border-[color:var(--green-500)] bg-[color:var(--green-100)] text-[color:var(--green-500)]"
          : "border-[color:var(--border-secondary)] bg-white text-[color:var(--text-secondary)]"
        }`}
    >
      {label}
    </button>
  );
}

export function PolicyView() {
  const [policy, setPolicy] = useState(DEFAULT_SLA_POLICY);

  const coverageSummary = useMemo(
    () => ({
      latest: policy.coverage.latest.join(", "),
      supported: policy.coverage.supportedBack.join(", "),
    }),
    [policy.coverage],
  );

  return (
    <div className="mx-auto max-w-[960px] px-6 pb-16 pt-6">
      <PageHeader
        crumbs={[
          { label: "All Projects", href: "/" },
          { label: "Supported Releases", href: "/releases/" },
          { label: "SLA Policy" },
        ]}
        title="SLA policy · Supported Release Center"
      />

      <section className="mt-8 space-y-8">
        <Card title="What is “Supported”?">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Minor branches supported (n−k)">
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
                className="h-9 w-full rounded-md border border-[color:var(--border-secondary)] px-3 text-[13px]"
              />
              <p className="mt-2 text-[12px] text-[color:var(--text-secondary)]">
                Default aligns with SaaS playbook: newest minor counts as Latest, preceding branches fall into Supported tiers.
              </p>
            </Field>
            <Field label="Calendar support window">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={6}
                  max={48}
                  value={policy.supportWindowMonths}
                  onChange={(e) =>
                    setPolicy((p) => ({
                      ...p,
                      supportWindowMonths: Number(e.target.value),
                    }))
                  }
                  className="h-9 flex-1 rounded-md border border-[color:var(--border-secondary)] px-3 text-[13px]"
                />
                <span className="text-[13px] text-[color:var(--text-secondary)]">months rolling</span>
              </div>
            </Field>
          </div>
          <div className="mt-8 rounded-lg bg-[color:var(--surface-secondary)] p-4">
            <h4 className="text-[13px] font-semibold uppercase text-[color:var(--text-secondary)]">
              Severity applicability by tier (demo editable)
            </h4>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-[12px] font-semibold">Latest minors</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SEVERITY_OPTIONS.map((sev) => (
                    <Chip
                      key={sev}
                      label={sev}
                      selected={policy.coverage.latest.includes(sev)}
                      onClick={() =>
                        setPolicy((p) => ({
                          ...p,
                          coverage: {
                            ...p.coverage,
                            latest: toggleSet(p.coverage.latest, sev),
                          },
                        }))
                      }
                    />
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-[color:var(--text-secondary)]">{coverageSummary.latest}</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold">Supported backlog minors</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SEVERITY_OPTIONS.map((sev) => (
                    <Chip
                      key={sev}
                      label={sev}
                      selected={policy.coverage.supportedBack.includes(sev)}
                      onClick={() =>
                        setPolicy((p) => ({
                          ...p,
                          coverage: {
                            ...p.coverage,
                            supportedBack: toggleSet(p.coverage.supportedBack, sev),
                          },
                        }))
                      }
                    />
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-[color:var(--text-secondary)]">{coverageSummary.supported}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="SLA durations (days)">
          <div className="grid gap-4 sm:grid-cols-2">
            {SEVERITY_OPTIONS.map((sev) => (
              <Field key={sev} label={`${sev} SLA`}>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={policy.durations[sev]}
                  onChange={(e) =>
                    setPolicy((p) => ({
                      ...p,
                      durations: {
                        ...p.durations,
                        [sev]: Number(e.target.value),
                      },
                    }))
                  }
                  className="h-9 w-full rounded-md border border-[color:var(--border-secondary)] px-3 text-[13px]"
                />
              </Field>
            ))}
          </div>
        </Card>

        <Card title="Applications using this policy">
          <p className="text-[13px] text-[color:var(--text-secondary)]">
            Demo lists applications referencing{" "}
            <strong>{SLA_POLICY_SELF_MANAGED.name}</strong> (active editor default).
          </p>
          <ul className="mt-4 space-y-2">
            {applicationsUsingPolicy(SLA_POLICY_SELF_MANAGED.id).map((app) => (
              <li
                key={app.id}
                className="flex items-center justify-between rounded-md border border-[color:var(--border-primary)] bg-[color:var(--surface-secondary)] px-3 py-2 text-[13px]"
              >
                <span className="font-semibold">{app.name}</span>
                <span className="font-mono text-[11px] text-[color:var(--text-tertiary)]">
                  {app.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-[color:var(--text-tertiary)]">
            SaaS SLA policy also used by{" "}
            {APPLICATIONS.filter((a) => a.slaPolicy.id !== SLA_POLICY_SELF_MANAGED.id)
              .map((a) => a.name)
              .join(", ") || "—"}
          </p>
        </Card>

        <Card title="Fix lifecycle gating (Barak-style automation)">
          <Toggle
            checked={policy.automation.autoOpenPR}
            onChange={() =>
              setPolicy((p) => ({
                ...p,
                automation: {
                  ...p.automation,
                  autoOpenPR: !p.automation.autoOpenPR,
                },
              }))
            }
            label="Auto-open PR for safe CVE version bumps"
            hint="Detect-agent bumps dependencies when policy classifies the change as low operational risk."
          />
          <Toggle
            checked={policy.automation.autoCloseOnCleanBuild}
            onChange={() =>
              setPolicy((p) => ({
                ...p,
                automation: {
                  ...p.automation,
                  autoCloseOnCleanBuild: !p.automation.autoCloseOnCleanBuild,
                },
              }))
            }
            label="Auto-close CVE when next build no longer contains it"
            hint="Closes backlog noise once CI proves the vulnerable component is gone — still requires evidence row."
          />
          <Toggle
            checked={policy.automation.dodRequiresAllClusters}
            onChange={() =>
              setPolicy((p) => ({
                ...p,
                automation: {
                  ...p.automation,
                  dodRequiresAllClusters: !p.automation.dodRequiresAllClusters,
                },
              }))
            }
            label="Definition of Done requires rollout to ALL clusters"
            hint="Aligns with Asaf’s Release Manager lens: partial rollouts stay amber until every prod slice is clean."
          />
        </Card>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="h-10 rounded-md bg-[color:var(--green-500)] px-5 text-[13px] font-semibold text-white shadow-sm hover:opacity-95"
          >
            Save policy (decorative)
          </button>
          <button
            type="button"
            onClick={() => setPolicy(DEFAULT_SLA_POLICY)}
            className="h-10 rounded-md border border-[color:var(--border-secondary)] bg-white px-5 text-[13px] font-semibold text-[color:var(--text-primary)] hover:bg-[color:var(--surface-secondary)]"
          >
            Reset to defaults
          </button>
        </div>

        <p className="text-[12px] text-[color:var(--text-secondary)]">
          SOX traceability: policy mutations would flow through AppTrust evidence + Jira change records in a production rollout.
        </p>
      </section>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[color:var(--border-primary)] bg-white p-6 shadow-sm">
      <h2 className="text-[18px] font-semibold text-[color:var(--text-primary)]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase text-[color:var(--text-secondary)]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function toggleSet(list: Severity[], sev: Severity): Severity[] {
  if (list.includes(sev)) return list.filter((s) => s !== sev);
  return [...list, sev].sort(
    (a, b) => SEVERITY_OPTIONS.indexOf(a) - SEVERITY_OPTIONS.indexOf(b),
  );
}
