"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheckIcon,
  CopyIcon,
  ExposureIcon,
  ExternalLinkIcon,
  GitBranchIcon,
} from "@/components/icons/JFrogIcons";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import type { Application, CVEInstance, SupportedRelease } from "@/lib/types";
import { cn } from "@/lib/cn";
import { dimensionCount } from "@/lib/findings";

const TAB_LABELS = [
  "Version Timeline",
  "Vulnerabilities",
  "Secrets",
  "Exposures",
  "SAST",
  "Contextual Analysis",
  "Content",
  "Evidence",
  "Risk",
] as const;

type TabId = (typeof TAB_LABELS)[number];

interface ReleaseDetailProps {
  release: SupportedRelease;
  application: Application;
  siblingsSameImage: SupportedRelease[];
}

function tabCount(release: SupportedRelease, tab: TabId): number {
  switch (tab) {
    case "Vulnerabilities":
      return dimensionCount(release, "vulnerabilities");
    case "Secrets":
      return release.secrets.length;
    case "Exposures":
      return release.exposures.length;
    case "SAST":
      return release.sastFindings.length;
    case "Contextual Analysis":
      return release.contextualAnalysis.length;
    default:
      return 0;
  }
}

function formatBytes(bytes: number) {
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(2)} GiB artifact`;
}

function toneDot(kind: SupportedRelease["timeline"][number]) {
  if (kind.status === "failed") return "bg-[color:var(--red-500)]";
  if (kind.status === "passed_warning") return "bg-[color:var(--orange-500)]";
  return "bg-[color:var(--green-500)]";
}

function lifecycleStepSmall(state: CVEInstance["state"]) {
  const seq = ["backlog", "action", "released", "rolled_out"] as const;
  const idx = seq.indexOf(state as (typeof seq)[number]);
  return (
    <div className="flex gap-1 text-[11px]">
      {seq.map((s, i) => (
        <span
          key={s}
          className={cn(
            "rounded px-1.5 py-0.5",
            i <= idx
              ? "bg-[color:var(--green-100)] text-[color:var(--green-500)]"
              : "bg-[color:var(--surface-secondary)] text-[color:var(--text-tertiary)]",
          )}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export function ReleaseDetailView({
  release: initial,
  application,
  siblingsSameImage,
}: ReleaseDetailProps) {
  const [tab, setTab] = useState<TabId>("Vulnerabilities");
  const [cveOpenId, setCveOpenId] = useState<string | null>(
    initial.cves[0]?.cve.id ?? null,
  );
  const [expandedRuntime, setExpandedRuntime] = useState(false);

  const orderedSiblings = useMemo(
    () =>
      [...siblingsSameImage].sort((a, b) =>
        a.version.localeCompare(b.version, undefined, { numeric: true }),
      ),
    [siblingsSameImage],
  );

  const router = useRouter();

  const postCritical = initial.cves.find(
    (c) =>
      c.detectedPostRelease && c.cve.severity === "critical",
  );

  return (
    <div className="mx-auto flex min-h-full max-w-[1380px] flex-col px-6 pb-10 pt-4">
      <PageHeader
        crumbs={[
          { label: "All Projects", href: "/" },
          { label: "Supported Releases", href: "/releases/" },
          {
            label: application.name,
            href: `/applications/${application.id}/`,
          },
          { label: initial.version },
        ]}
      />

      <div className="mt-6 flex gap-8">
        {/* Left facts */}
        <aside className="w-[320px] shrink-0 space-y-6">
          <div className="rounded-[var(--radius-s)] border border-[color:var(--border-primary)] bg-[color:var(--surface-primary)] p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-s)] bg-[color:var(--navy-100)] font-mono text-[11px] font-bold text-[color:var(--navy-600)]">
                img
              </div>
              <div className="min-w-0 flex-1">
                <label className="text-[11px] font-semibold uppercase text-[color:var(--text-secondary)]">
                  Release
                </label>
                <h1 className="truncate text-[20px] font-semibold text-[color:var(--text-primary)]">
                  {initial.imageName}
                </h1>
                <Link
                  href={`/applications/${application.id}/`}
                  className="mt-1 block text-[12px] font-semibold text-[color:var(--platform-teal-accent)] hover:underline"
                >
                  {application.name}
                </Link>
              </div>
            </div>
            <div className="relative">
              <label className="text-[11px] font-semibold uppercase text-[color:var(--text-secondary)]">
                Version focus
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-[color:var(--border-secondary)] bg-[color:var(--surface-primary)] px-3 py-2 text-[13px] font-semibold pr-10"
                value={initial.id}
                aria-label="Version switch"
                onChange={(e) => router.push(`/releases/${e.target.value}/`)}
              >
                {orderedSiblings.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.version}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {postCritical ? (
            <div className="rounded-md border border-[color:var(--orange-500)] bg-[color:var(--orange-100)] px-4 py-3 text-[13px] text-[color:var(--text-primary)]">
              <div className="flex items-start gap-2">
                <ExposureIcon size={16} className="mt-1 text-[color:var(--orange-500)]" />
                <span>
                  <strong>Newly detected Critical CVE post-release · </strong>
                  {new Date(
                    `${postCritical.detectedAt}T09:14:00.000Z`,
                  ).toLocaleString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-[color:var(--green-500)] bg-[color:var(--green-100)] px-4 py-3 text-[13px] text-[color:var(--green-500)] font-semibold">
              All clear · within SLA posture for Trusted+Supported.
            </div>
          )}

          <FactCard title="Source">
            <FactRow label="Commit">
              <span className="inline-flex items-center gap-1 font-mono text-[12px]">
                {initial.commit.shortSha}
                <a
                  href={`${initial.commit.repoUrl}/commit/${initial.commit.sha}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--platform-teal-accent)]"
                  aria-label="Open in git"
                >
                  <ExternalLinkIcon size={14} />
                </a>
                <button type="button" aria-label="Copy SHA" className="text-[color:var(--icon-tertiary)]">
                  <CopyIcon size={14} />
                </button>
              </span>
            </FactRow>
            <p className="line-clamp-2 text-[12px] text-[color:var(--text-secondary)]">
              {initial.commit.message}
            </p>
            <FactRow label="Author · branch">
              {initial.commit.author} on {initial.commit.branch}
            </FactRow>
            <FactRow label="Committed">
              {new Date(initial.commit.timestamp).toLocaleString()}
            </FactRow>
          </FactCard>

          <FactCard title="About this version">
            <FactRow label="Creation Date">
              {new Date(initial.createdAt).toLocaleString()}
            </FactRow>
            <FactRow label="Created By">{initial.createdBy}</FactRow>
            <FactRow label="Current Stage">
              <span className="font-semibold">{initial.currentStage}</span>
            </FactRow>
            <FactRow label="Last Updated">
              {new Date(initial.lastUpdated).toLocaleString()}
            </FactRow>
            <FactRow label="Tag">{initial.tag}</FactRow>
            <FactRow label="Signing Key">{initial.signingKey}</FactRow>
          </FactCard>

          <FactCard title="Runtime">
            <div className="space-y-2 text-[13px]">
              <p>
                <strong>Status:</strong>{" "}
                {initial.runtime.state === "running" ? (
                  <>
                    Running ·{" "}
                    <span className="font-semibold">
                      {
                        initial.runtime.clusters.filter(
                          (c) => c.rolloutPercent >= 95,
                        ).length
                      }
                      /{initial.runtime.clusters.length || 4}
                    </span>{" "}
                    clusters healthy · {initial.runtime.totalRolloutPercent}% rollout snapshot
                  </>
                ) : initial.runtime.state === "integrity_violation" ? (
                  <>
                    Integrity violation — workload live but drifted from released
                    image · {initial.runtime.totalRolloutPercent}% rollout snapshot
                  </>
                ) : (
                  "No active prod heartbeat on this SKU"
                )}
              </p>
              <button
                type="button"
                onClick={() => setExpandedRuntime((v) => !v)}
                className="text-[12px] font-semibold text-[color:var(--platform-teal-accent)]"
              >
                {expandedRuntime ? "Hide rollout" : "Show clusters"}
              </button>
              {expandedRuntime && (
                <div className="rounded border border-[color:var(--border-primary)] bg-[color:var(--surface-secondary)] p-2 font-mono text-[11px]">
                  {(initial.runtime.clusters.length === 0
                    ? [{ name: "—", rolloutPercent: 0 }]
                    : initial.runtime.clusters
                  ).map((c) => (
                    <div key={c.name}>
                      • {c.name} ·{" "}
                      <span className="font-semibold">{c.rolloutPercent}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FactCard>

          <FactCard title="Content">
            <FactRow label="Artifact size">{formatBytes(initial.sizeBytes)}</FactRow>
          </FactCard>

          <FactCard title="Tenants on this version">
            <p className="text-[22px] font-bold text-[color:var(--navy-600)]">
              {initial.customerImpact}
            </p>
          </FactCard>

          <div className="flex items-center gap-2 text-[13px] text-[color:var(--green-500)] font-semibold">
            <BadgeCheckIcon size={16} /> Trusted lineage with AppTrust certify
          </div>
          <Link
            href={`/applications/${application.id}/`}
            className="inline-flex text-[13px] font-semibold text-[color:var(--platform-teal-accent)] underline"
          >
            ← Back to {application.name}
          </Link>
        </aside>

        <section className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap gap-5 border-b border-[color:var(--border-secondary)] pb-px">
            {TAB_LABELS.map((tLabel) => (
              <button
                key={tLabel}
                type="button"
                onClick={() => setTab(tLabel)}
                className={`-mb-[2px] px-3 pb-2 text-[13px] font-semibold ${
                  tab === tLabel
                    ? "border-b-[3px] border-[color:var(--green-500)] text-[color:var(--green-500)]"
                    : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                }`}
              >
                {tLabel}
                {tabCount(initial, tLabel) > 0 &&
                (
                  [
                    "Vulnerabilities",
                    "Secrets",
                    "Exposures",
                    "SAST",
                    "Contextual Analysis",
                  ] as TabId[]
                ).includes(tLabel) ? (
                  <span className="ml-1 rounded-full bg-[color:var(--surface-tertiary)] px-1.5 text-[10px]">
                    {tabCount(initial, tLabel)}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="rounded-[var(--radius-s)] border border-[color:var(--border-primary)] bg-[color:var(--surface-primary)] p-6 shadow-sm">
            {tab === "Version Timeline" && <TimelinePane release={initial} />}
            {tab === "Vulnerabilities" && (
              <CvesPane release={initial} expandedId={cveOpenId} onPick={setCveOpenId} />
            )}
            {tab === "Secrets" && <SecretsPane release={initial} />}
            {tab === "Exposures" && <ExposuresPane release={initial} />}
            {tab === "SAST" && <SASTPane release={initial} />}
            {tab === "Contextual Analysis" && (
              <ContextualPane release={initial} />
            )}
            {tab === "Content" && (
              <div className="space-y-3 text-[13px] leading-relaxed text-[color:var(--text-secondary)]">
                <h3 className="text-[16px] font-semibold text-[color:var(--text-primary)]">Content · manifest summary</h3>
                <p>
                  Mirrors AppTrust artifact inventory without hitting live metadata services. Showing bundle digest and primary container layer count for lineage traceability reviewers.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Compressed artifact size matches left rail ({formatBytes(initial.sizeBytes)}).</li>
                  <li>OCI index references <strong>3 linux/amd64</strong> manifests + attestations envelope.</li>
                  <li>SBOM fingerprints align with Evidence tab CycloneDX linkage.</li>
                </ul>
              </div>
            )}
            {tab === "Evidence" && <EvidencePane release={initial} />}
            {tab === "Risk" && <RiskPane release={initial} />}
          </div>
        </section>
      </div>
    </div>
  );
}

function FactCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-s)] border border-[color:var(--border-primary)] bg-[color:var(--surface-primary)] px-5 py-4 shadow-sm">
      <div className="text-[13px] font-semibold">{title}</div>
      <div className="mt-3 space-y-2 text-[13px]">{children}</div>
    </div>
  );
}

function FactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase text-[color:var(--text-secondary)]">{label}</dt>
      <dd className="text-[color:var(--text-primary)]">{children}</dd>
    </div>
  );
}

function TimelinePane({ release }: { release: SupportedRelease }) {
  return (
    <div>
      <h3 className="text-[16px] font-semibold">Operational timeline · {release.version}</h3>
      <ol className="relative mt-6 space-y-0 border-l border-[color:var(--border-secondary)]">
        {[...release.timeline]
          .sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts))
          .map((ev, idx) => (
            <li key={`${ev.ts}-${idx}`} className="relative pb-8 pl-8 last:pb-0">
              <span className={`absolute left-[-5px] top-2 h-[10px] w-[10px] rounded-full ${toneDot(ev)} ring-4 ring-white shadow`} />
              <p className="text-[12px] text-[color:var(--text-tertiary)]">
                {new Date(ev.ts).toLocaleString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="font-semibold text-[color:var(--text-primary)]">{ev.description}</p>
              {ev.kind === "promotion" && (
                <p className="text-[12px] text-[color:var(--text-secondary)]">
                  Promotion {ev.fromStage ?? "—"}→{ev.toStage ?? ""} ({ev.status})
                </p>
              )}
            </li>
          ))}
      </ol>
    </div>
  );
}

function EvidencePane({ release }: { release: SupportedRelease }) {
  return (
    <>
      <h3 className="text-[16px] font-semibold">Evidence</h3>
      <div className="mt-4 overflow-auto rounded border border-[color:var(--border-primary)]">
        <table className="min-w-full border-collapse text-left text-[13px]">
          <thead className="bg-[color:var(--surface-secondary)] text-[12px] font-semibold uppercase text-[color:var(--text-secondary)]">
            <tr>
              <th className="border-b px-3 py-2">Verified</th>
              <th className="border-b px-3 py-2">Evidence type</th>
              <th className="border-b px-3 py-2">Time</th>
              <th className="border-b px-3 py-2">Created by</th>
              <th className="border-b px-3 py-2">Attached to</th>
            </tr>
          </thead>
          <tbody>
            {release.trustEvidence.map((ev) => (
              <tr key={ev.type + ev.time} className="border-t">
                <td className="px-3 py-2">
                  <span className={ev.verified ? "text-[color:var(--green-500)] font-semibold" : "text-[color:var(--text-tertiary)]"}>{ev.verified ? "●" : "○"} Verified</span>
                </td>
                <td className="px-3 py-2 font-mono text-[12px]">{ev.type}</td>
                <td className="px-3 py-2 text-[color:var(--text-secondary)]">
                  {new Date(ev.time).toLocaleString()}
                </td>
                <td className="px-3 py-2">{ev.createdBy}</td>
                <td className="px-3 py-2 font-mono text-[11px]">
                  <span title={ev.attachedTo} className="line-clamp-2">
                    {ev.attachedTo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CvesPane({
  release,
  expandedId,
  onPick,
}: {
  release: SupportedRelease;
  expandedId: string | null;
  onPick: (id: string | null) => void;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-[320px] shrink-0 divide-y divide-[color:var(--border-primary)] border border-[color:var(--border-primary)] rounded-[var(--radius-s)] bg-[color:var(--surface-secondary)] overflow-hidden">
        {release.cves.length === 0 ? (
          <p className="p-6 text-[13px] text-[color:var(--text-secondary)]">
            No outstanding CVE exposures on this Trusted+Supported line.
          </p>
        ) : (
          release.cves.map((ins) => {
            const sla = slaPill(ins);
            return (
              <button
                type="button"
                key={ins.cve.id}
                className={`w-full px-4 py-3 text-left hover:bg-[color:var(--surface-primary)]`}
                onClick={() => onPick(ins.cve.id === expandedId ? null : ins.cve.id)}
              >
                <div className="flex items-center gap-2">
                  <SeverityPill severity={ins.cve.severity} />
                  {ins.cve.jfrogSeverity && ins.cve.jfrogSeverity !== ins.cve.severity ? (
                    <SeverityPill label="JFrog" severity={ins.cve.jfrogSeverity} muted />
                  ) : null}
                </div>
                <div className="mt-1 font-mono text-[13px] font-semibold text-[color:var(--text-primary)]">{ins.cve.id}</div>
                <div className="truncate text-[12px] text-[color:var(--text-secondary)]">{ins.cve.component}</div>
                <div className="mt-3 space-y-1">
                  <div className="text-[11px] font-semibold text-[color:var(--text-secondary)] uppercase">Fix versions</div>
                  <span className="font-mono text-[12px]">{ins.cve.fixVersion ?? "pending"}</span>
                </div>
                <div className="mt-3">{lifecycleStepSmall(ins.state)}</div>
                <div className="mt-2">{sla}</div>
              </button>
            );
          })
        )}
      </div>
      <div className="min-w-0 flex-1 rounded-[var(--radius-s)] border border-[color:var(--border-primary)] bg-[color:var(--surface-secondary)] px-6 py-4">
        {expandedId ? (
          (() => {
            const sel = release.cves.find((c) => c.cve.id === expandedId)!;
            return (
              <>
                <h3 className="text-[18px] font-semibold text-[color:var(--text-primary)]">{sel.cve.id}</h3>
                <p className="mt-2 text-[13px] text-[color:var(--text-primary)]">{sel.cve.summary}</p>
                <div className="mt-4 grid gap-2 text-[13px]">
                  <Strong label="Suggested fix">Upgrade pinned component → {sel.cve.fixVersion}</Strong>
                  <Strong label="JFrog backlog">
                    <span className="font-mono text-[color:var(--platform-teal-accent)]">{sel.jiraKey ?? "DECORATIVE-JIRA"}</span>
                  </Strong>
                  <Strong label="Per-cluster rollout status">
                    {sel.perClusterStatus ? (
                      <ul className="mt-2 space-y-1 font-mono text-[11px]">
                        {sel.perClusterStatus.map((cs) => (
                          <li key={cs.cluster}>
                            {cs.fixed ? (
                              <span className="text-[color:var(--green-500)] font-semibold">✓ </span>
                            ) : (
                              <span className="text-[color:var(--red-600)] font-semibold">◯ </span>
                            )}
                            {cs.cluster}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>In sync fleet-wide snapshot not generated for POC.</span>
                    )}
                  </Strong>
                  <button
                    type="button"
                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-md bg-[color:var(--navy-600)] px-3 py-2 text-[13px] font-semibold text-white hover:opacity-90"
                  >
                    <GitBranchIcon size={16} />
                    Open automated PR chain
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-fit items-center gap-2 rounded-md border border-[color:var(--border-secondary)] bg-[color:var(--surface-primary)] px-3 py-2 text-[13px] font-semibold text-[color:var(--platform-teal-accent)]"
                  >
                    <ExternalLinkIcon size={16} />
                    Decorative Jira link
                  </button>
                </div>
              </>
            );
          })()
        ) : (
          release.cves.length > 0 && (
            <p className="text-[13px] text-[color:var(--text-secondary)]">
              Select a CVE rail item to drill into rollout + automation context.
            </p>
          )
        )}
      </div>
    </div>
  );
}

function Strong({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <strong className="text-[color:var(--text-secondary)] text-[11px] uppercase">{label}</strong>
      <div className="text-[13px] text-[color:var(--text-primary)]">{children}</div>
    </div>
  );
}

function slaPill(ins: CVEInstance) {
  let label =
    ins.slaStatus === "within"
      ? `${Math.ceil(ins.daysToSLA)}d remaining`
      : `${Math.ceil(ins.daysToSLA)}d`;
  if (ins.slaStatus === "breached") label = `SLA exceeded`;
  else if (ins.slaStatus === "no_data") label = `SLA not started`;

  const cls =
    ins.slaStatus === "within"
      ? "bg-[color:var(--green-100)] text-[color:var(--green-500)] border-[color:var(--green-500)]"
      : ins.slaStatus === "breached"
        ? "bg-[color:var(--red-100)] text-[color:var(--red-600)] border-[color:var(--red-600)]"
        : "bg-[color:var(--surface-tertiary)] text-[color:var(--text-tertiary)] border-transparent";

  return (
    <span className={`inline-flex rounded-full border px-3 py-0.5 text-[11px] font-semibold ${cls}`}>{label}</span>
  );
}

function SeverityPill({
  severity,
  label,
  muted,
}: {
  severity: CVEInstance["cve"]["severity"];
  label?: string;
  muted?: boolean;
}) {
  const display = `${label ?? ""} ${label ? severity : severity}`.trim();
  const map: Record<typeof severity, string> = {
    critical: "var(--severity-critical)",
    high: "var(--severity-high)",
    medium: "var(--severity-medium)",
    low: "var(--severity-low)",
  };
  if (muted) {
    return (
      <span className="rounded-full border border-[color:var(--border-secondary)] bg-[color:var(--surface-primary)] px-2 py-0.5 text-[11px] font-semibold capitalize text-[color:var(--text-secondary)]">
        {display}
      </span>
    );
  }
  const color = map[severity];
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold text-white`}
      style={{ backgroundColor: color }}
    >
      {display}
    </span>
  );
}

function RiskPane({ release }: { release: SupportedRelease }) {
  const openCrit = release.cves.filter(
    (c) => c.state !== "rolled_out" && c.cve.severity === "critical",
  ).length;
  let oldestDays = release.cves
    .map((c) => {
      const d = new Date(c.detectedAt);
      const now = Date.parse("2026-05-19T07:52:03.000Z");
      const diffMs = Math.max(1, now - d.getTime());
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    })
    .sort((a, b) => b - a)[0];
  oldestDays ||= 0;

  const rolloutLag = `${release.runtime.totalRolloutPercent}% on ${release.runtime.clusters.length || 4} monitored clusters`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-[var(--radius-s)] border border-[color:var(--border-primary)] p-6">
        <h4 className="text-[13px] font-semibold uppercase text-[color:var(--text-secondary)]">
          Exposure signal
        </h4>
        <p className="mt-2 text-[32px] font-bold text-[color:var(--red-500)]">{openCrit}</p>
        <p className="text-[13px] text-[color:var(--text-secondary)]">
          Critical CVEs unresolved on this Supported line  
        </p>
      </div>
      <div className="rounded-[var(--radius-s)] border border-[color:var(--border-primary)] p-6">
        <h4 className="text-[13px] font-semibold uppercase text-[color:var(--text-secondary)]">
          Oldest open vuln dwell
        </h4>
        <p className="mt-2 text-[30px] font-bold text-[color:var(--navy-600)]">{oldestDays} days</p>
      </div>
      <div className="rounded-[var(--radius-s)] border border-[color:var(--border-primary)] p-6">
        <h4 className="text-[13px] font-semibold uppercase text-[color:var(--text-secondary)]">
          Tenants on this version
        </h4>
        <p className="mt-2 text-[26px] font-bold">{release.customerImpact}</p>
      </div>
      <div className="rounded-[var(--radius-s)] border border-[color:var(--border-primary)] p-6">
        <h4 className="text-[13px] font-semibold uppercase text-[color:var(--text-secondary)]">
          Rollout health snapshot
        </h4>
        <p className="mt-2 text-[22px] font-semibold">{rolloutLag}</p>
      </div>
    </div>
  );
}

function FindingsTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  if (rows.length === 0) {
    return (
      <p className="text-[13px] text-[color:var(--text-secondary)]">
        No findings in this dimension on this release.
      </p>
    );
  }
  return (
    <div className="overflow-auto rounded border border-[color:var(--border-primary)]">
      <table className="min-w-full border-collapse text-left text-[13px]">
        <thead className="bg-[color:var(--surface-secondary)] text-[12px] font-semibold uppercase text-[color:var(--text-secondary)]">
          <tr>
            {headers.map((h) => (
              <th key={h} className="border-b px-3 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-t">
              {cells.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SecretsPane({ release }: { release: SupportedRelease }) {
  return (
    <FindingsTable
      headers={["Type", "Severity", "Location", "Description", "Jira"]}
      rows={release.secrets.map((s) => [
        <span key="t" className="font-mono text-[11px] uppercase">{s.type}</span>,
        <SeverityPill key="s" severity={s.severity} />,
        <span key="loc" className="font-mono text-[11px]">
          {s.file}:{s.line}
        </span>,
        <span key="d">{s.description}</span>,
        s.jiraKey ? (
          <span key="j" className="font-mono text-[color:var(--platform-teal-accent)]">
            {s.jiraKey}
          </span>
        ) : (
          "—"
        ),
      ])}
    />
  );
}

function ExposuresPane({ release }: { release: SupportedRelease }) {
  return (
    <FindingsTable
      headers={["Category", "Severity", "Resource", "Description", "Jira"]}
      rows={release.exposures.map((e) => [
        <span key="c" className="rounded bg-[color:var(--surface-tertiary)] px-2 py-0.5 text-[11px] font-semibold">
          {e.category}
        </span>,
        <SeverityPill key="s" severity={e.severity} />,
        <span key="r" className="font-mono text-[11px]">{e.resource}</span>,
        <span key="d">{e.description}</span>,
        <span key="j">{e.jiraKey ?? "—"}</span>,
      ])}
    />
  );
}

function SASTPane({ release }: { release: SupportedRelease }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {release.sastFindings.length === 0 ? (
        <p className="text-[13px] text-[color:var(--text-secondary)]">No SAST findings.</p>
      ) : (
        release.sastFindings.map((s) => (
          <div
            key={s.id}
            className="rounded-[var(--radius-s)] border border-[color:var(--border-primary)] p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[12px] font-semibold">{s.cweId}</span>
              <SeverityPill severity={s.severity} />
              <span className="text-[13px] font-semibold">{s.ruleName}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-[color:var(--text-tertiary)]">
              {s.file}:{s.line}
            </p>
            <p className="mt-2 text-[13px]">{s.description}</p>
            {s.codeSnippet ? (
              <button
                type="button"
                className="mt-2 text-[12px] font-semibold text-[color:var(--platform-teal-accent)]"
                onClick={() => setOpen(open === s.id ? null : s.id)}
              >
                {open === s.id ? "Hide snippet" : "Show snippet"}
              </button>
            ) : null}
            {open === s.id && s.codeSnippet ? (
              <pre className="mt-2 overflow-auto rounded bg-[color:var(--surface-secondary)] p-3 font-mono text-[11px]">
                {s.codeSnippet}
              </pre>
            ) : null}
          </div>
        ))
      )}
    </div>
  );
}

function ContextualPane({ release }: { release: SupportedRelease }) {
  const badge = (a: (typeof release.contextualAnalysis)[0]["applicability"]) => {
    const map = {
      applicable: "bg-[color:var(--red-100)] text-[color:var(--red-600)]",
      not_applicable: "bg-[color:var(--green-100)] text-[color:var(--green-500)]",
      not_covered: "bg-[color:var(--surface-tertiary)] text-[color:var(--text-tertiary)]",
      rescanning: "bg-[color:var(--orange-100)] text-[color:var(--orange-600)]",
    };
    return (
      <span className={cn("rounded px-2 py-0.5 text-[11px] font-semibold", map[a])}>
        {a.replace("_", " ")}
      </span>
    );
  };
  return (
    <FindingsTable
      headers={["CVE", "Applicability", "Evidence"]}
      rows={release.contextualAnalysis.map((c) => [
        <span key="cve" className="font-mono font-semibold">{c.relatedCveId}</span>,
        <span key="badge">{badge(c.applicability)}</span>,
        <span key="ev">{c.evidence}</span>,
      ])}
    />
  );
}
