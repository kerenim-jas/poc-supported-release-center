"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Mail,
  ShieldAlert,
  CircleSlash,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FindingDimensionChips } from "@/components/FindingChips";
import type { Application, SupportedRelease } from "@/lib/types";
import {
  RECENT_ACTIVITY,
  sortReleasesForList,
} from "@/lib/fixtures";
import {
  dimensionCount,
  getReleasesForApp,
  rollupDimensionCounts,
  rollupSeverityForApp,
  worstSlaForRelease,
} from "@/lib/findings";
import { cn } from "@/lib/cn";

const TABS = ["Releases", "Findings summary", "Activity", "Settings"] as const;
type TabId = (typeof TABS)[number];

export function ApplicationDetailView({
  application,
  allReleases,
}: {
  application: Application;
  allReleases: SupportedRelease[];
}) {
  const [tab, setTab] = useState<TabId>("Releases");
  const releases = useMemo(
    () => sortReleasesForList(getReleasesForApp(application, allReleases)),
    [application, allReleases],
  );
  const counts = rollupDimensionCounts(releases);
  const sev = rollupSeverityForApp(releases);
  const activity = RECENT_ACTIVITY.filter(
    (a) => a.applicationId === application.id,
  );

  const tierColor =
    application.businessCriticality === "tier-1"
      ? "var(--red-500)"
      : application.businessCriticality === "tier-2"
        ? "var(--orange-500)"
        : "var(--navy-500)";

  return (
    <div className="mx-auto flex min-h-full max-w-[1380px] flex-col px-6 pb-12 pt-6">
      <PageHeader
        crumbs={[
          { label: "All Projects", href: "/" },
          { label: "Supported Releases", href: "/releases/" },
          { label: application.name },
        ]}
      />

      <div className="mt-6 flex gap-8">
        <aside className="w-[320px] shrink-0 space-y-4">
          <div className="overflow-hidden rounded-lg border border-[color:var(--border-primary)] bg-white shadow-sm">
            <div
              className="h-1 w-full"
              style={{ background: tierColor }}
            />
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--navy-100)] text-[14px] font-bold text-[color:var(--navy-600)]">
                app
              </div>
              <h1 className="mt-3 text-[20px] font-semibold">{application.name}</h1>
              <span className="mt-2 inline-block rounded bg-[color:var(--surface-tertiary)] px-2 py-0.5 font-mono text-[11px]">
                {application.label}
              </span>
              <p className="mt-3 text-[12px] leading-relaxed text-[color:var(--text-secondary)]">
                {application.description}
              </p>
            </div>
          </div>

          <div className="rounded-md border border-[color:var(--border-primary)] bg-[color:var(--surface-secondary)] px-4 py-3 text-[12px]">
            <strong>
              {application.businessCriticality.toUpperCase().replace("-", " ")}
            </strong>
            {" · "}
            {application.customerFacing ? "Customer-facing" : "Internal"}
            {" · "}
            {application.deploymentModel === "saas"
              ? "SaaS"
              : application.deploymentModel === "self_managed"
                ? "Self-managed"
                : "SaaS + Self-managed"}
          </div>

          <FactCard title="About this application">
            <FactRow label="Dev owner">
              <a
                href={`mailto:${application.devOwner.email}`}
                className="font-semibold text-[color:var(--platform-teal-accent)]"
              >
                {application.devOwner.name}
              </a>
              <div className="text-[11px]">{application.devOwner.team}</div>
            </FactRow>
            {application.productOwner ? (
              <FactRow label="Product owner">
                <a
                  href={`mailto:${application.productOwner.email}`}
                  className="text-[color:var(--platform-teal-accent)]"
                >
                  {application.productOwner.name}
                </a>
              </FactRow>
            ) : null}
            <FactRow label="SLA policy">
              <Link
                href="/policy/"
                className="inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold text-[color:var(--navy-600)]"
              >
                {application.slaPolicy.name}
              </Link>
            </FactRow>
            <FactRow label="Business criticality">
              <TierBadge tier={application.businessCriticality} />
            </FactRow>
            <FactRow label="Customer-facing">
              {application.customerFacing ? "Yes" : "No"}
            </FactRow>
            <FactRow label="Deployment model">
              {application.deploymentModel.replace("_", " ")}
            </FactRow>
          </FactCard>

          <FactCard title="Findings at a glance">
            <FindingDimensionChips
              counts={{
                vulnerabilities: counts.vulnerabilities,
                secrets: counts.secrets,
                exposures: counts.exposures,
                sast: counts.sast,
                contextual: counts.contextual,
              }}
            />
            <div className="mt-3 flex gap-1">
              {(["critical", "high", "medium", "low"] as const).map((s) => (
                <div
                  key={s}
                  className="h-2 flex-1 rounded-sm bg-[color:var(--surface-tertiary)]"
                  title={`${s}: ${sev[s]}`}
                  style={{
                    background:
                      sev[s] > 0
                        ? s === "critical"
                          ? "var(--red-500)"
                          : s === "high"
                            ? "var(--orange-500)"
                            : "var(--navy-400)"
                        : undefined,
                  }}
                />
              ))}
            </div>
          </FactCard>

          <div className="rounded-lg border border-[color:var(--border-primary)] bg-[color:var(--navy-100)]/40 p-4">
            <p className="text-[12px] font-semibold uppercase text-[color:var(--text-secondary)]">
              From runtime to owner
            </p>
            <p className="mt-2 text-[13px] text-[color:var(--text-primary)]">
              Trace any runtime finding back to{" "}
              <strong>{application.devOwner.name}</strong> for accountability.
            </p>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-[color:var(--navy-600)] px-3 py-2 text-[12px] font-semibold text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              Notify owner
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-5 border-b border-[color:var(--border-secondary)] pb-px">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "-mb-[2px] px-3 pb-2 text-[13px] font-semibold",
                  tab === t
                    ? "border-b-[3px] border-[color:var(--green-500)] text-[color:var(--green-500)]"
                    : "text-[color:var(--text-secondary)]",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-[color:var(--border-primary)] bg-white p-6 shadow-sm">
            {tab === "Releases" && (
              <ReleasesTable releases={releases} />
            )}
            {tab === "Findings summary" && (
              <FindingsSummary releases={releases} />
            )}
            {tab === "Activity" && <ActivityPane events={activity} />}
            {tab === "Settings" && (
              <SettingsPane application={application} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ReleasesTable({ releases }: { releases: SupportedRelease[] }) {
  return (
    <table className="min-w-full border-collapse text-[13px]">
      <thead className="text-left text-[12px] font-semibold uppercase text-[color:var(--text-secondary)]">
        <tr>
          <th className="pb-3">Version</th>
          <th className="pb-3">Commit</th>
          <th className="pb-3">Runtime</th>
          <th className="pb-3">Findings</th>
          <th className="pb-3">SLA</th>
          <th className="pb-3">Last promoted</th>
        </tr>
      </thead>
      <tbody>
        {releases.map((r) => {
          const worst = worstSlaForRelease(r);
          return (
            <tr
              key={r.id}
              className="border-t border-[color:var(--border-primary)] hover:bg-[color:var(--surface-secondary)]/50"
            >
              <td className="py-3">
                <Link
                  href={`/releases/${r.id}/`}
                  className="font-semibold text-[color:var(--platform-teal-accent)]"
                >
                  {r.version}
                </Link>
                <div className="mt-1 flex gap-1">
                  {r.isTrusted && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-[color:var(--green-100)] px-1.5 text-[10px] font-semibold text-[color:var(--green-500)]">
                      <CheckCircle2 className="h-3 w-3" /> Trusted
                    </span>
                  )}
                  <span className="rounded-full bg-[color:var(--navy-100)] px-1.5 text-[10px] font-semibold uppercase">
                    {r.supportTier === "latest" ? "Latest" : "Supported"}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-[color:var(--text-tertiary)]">
                  {r.imageName}
                </div>
              </td>
              <td className="py-3">
                <CommitCell commit={r.commit} />
              </td>
              <td className="py-3">
                <RuntimeBadge release={r} />
              </td>
              <td className="py-3">
                <FindingDimensionChips
                  size="xs"
                  counts={{
                    vulnerabilities: dimensionCount(r, "vulnerabilities"),
                    secrets: dimensionCount(r, "secrets"),
                    exposures: dimensionCount(r, "exposures"),
                    sast: dimensionCount(r, "sast"),
                    contextual: dimensionCount(r, "contextual"),
                  }}
                />
              </td>
              <td className="py-3">
                <SlaMini worst={worst} />
              </td>
              <td className="py-3 text-[12px] text-[color:var(--text-secondary)]">
                {new Date(r.lastUpdated).toLocaleDateString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function CommitCell({ commit }: { commit: SupportedRelease["commit"] }) {
  return (
    <div className="flex items-center gap-1 font-mono text-[11px]">
      <span title={commit.message}>{commit.shortSha}</span>
      <button type="button" aria-label="Copy SHA" className="p-0.5">
        <Copy className="h-3 w-3" />
      </button>
      <a
        href={`${commit.repoUrl}/commit/${commit.sha}`}
        target="_blank"
        rel="noreferrer"
        className="p-0.5 text-[color:var(--platform-teal-accent)]"
      >
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

function FindingsSummary({ releases }: { releases: SupportedRelease[] }) {
  const dims = [
    { key: "vulnerabilities" as const, label: "Vulnerabilities" },
    { key: "secrets" as const, label: "Secrets" },
    { key: "exposures" as const, label: "Exposures" },
    { key: "sast" as const, label: "SAST" },
    { key: "contextual" as const, label: "Contextual Analysis" },
  ];
  const counts = rollupDimensionCounts(releases);
  let hotspot = releases[0];
  let max = 0;
  for (const r of releases) {
    const t =
      dimensionCount(r, "vulnerabilities") +
      dimensionCount(r, "secrets") +
      dimensionCount(r, "exposures");
    if (t > max) {
      max = t;
      hotspot = r;
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {dims.map((d) => (
        <div
          key={d.key}
          className="rounded-lg border border-[color:var(--border-primary)] p-4"
        >
          <h4 className="text-[13px] font-semibold">{d.label}</h4>
          <p className="mt-2 text-[28px] font-bold">{counts[d.key]}</p>
          {hotspot ? (
            <Link
              href={`/releases/${hotspot.id}/`}
              className="mt-2 inline-block text-[12px] font-semibold text-[color:var(--platform-teal-accent)]"
            >
              View on {hotspot.imageName} {hotspot.version} →
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ActivityPane({
  events,
}: {
  events: typeof RECENT_ACTIVITY;
}) {
  if (events.length === 0) {
    return (
      <p className="text-[13px] text-[color:var(--text-secondary)]">
        No recent activity for this application in the demo window.
      </p>
    );
  }
  return (
    <ol className="space-y-4 border-l border-[color:var(--border-secondary)] pl-6">
      {events.map((evt) => (
        <li key={evt.ts} className="relative">
          <span className="absolute -left-[25px] top-1 h-2 w-2 rounded-full bg-[color:var(--green-500)]" />
          <p className="text-[13px]">{evt.label}</p>
          <p className="text-[11px] text-[color:var(--text-tertiary)]">
            {new Date(evt.ts).toLocaleString()}
          </p>
        </li>
      ))}
    </ol>
  );
}

function SettingsPane({ application }: { application: Application }) {
  return (
    <div className="space-y-4 text-[13px]">
      <p>
        SLA policy:{" "}
        <Link href="/policy/" className="font-semibold text-[color:var(--platform-teal-accent)]">
          {application.slaPolicy.name}
        </Link>
      </p>
      <label className="flex items-center gap-3">
        <input type="checkbox" className="h-4 w-4" />
        Override SLA for this application (decorative)
      </label>
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
    <div className="rounded-lg border border-[color:var(--border-primary)] bg-white px-5 py-4 shadow-sm">
      <div className="text-[13px] font-semibold">{title}</div>
      <div className="mt-3 space-y-2 text-[13px]">{children}</div>
    </div>
  );
}

function FactRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase text-[color:var(--text-secondary)]">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

function TierBadge({ tier }: { tier: Application["businessCriticality"] }) {
  const map = {
    "tier-1": "bg-[color:var(--red-100)] text-[color:var(--red-600)]",
    "tier-2": "bg-[color:var(--orange-100)] text-[color:var(--orange-600)]",
    "tier-3": "bg-[color:var(--surface-tertiary)] text-[color:var(--text-secondary)]",
  };
  return (
    <span className={cn("rounded px-2 py-0.5 text-[11px] font-semibold uppercase", map[tier])}>
      {tier.replace("-", " ")}
    </span>
  );
}

function RuntimeBadge({ release }: { release: SupportedRelease }) {
  if (release.runtime.state === "running") {
    return (
      <span className="text-[11px] font-semibold text-[color:var(--green-500)]">
        Running
      </span>
    );
  }
  if (release.runtime.state === "integrity_violation") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[color:var(--orange-600)]">
        <ShieldAlert className="h-3 w-3" /> Violation
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-[color:var(--text-tertiary)]">
      <CircleSlash className="h-3 w-3" /> Idle
    </span>
  );
}

function SlaMini({
  worst,
}: {
  worst: ReturnType<typeof worstSlaForRelease>;
}) {
  if (worst.status === "breached")
    return <span className="text-[11px] font-semibold text-[color:var(--red-600)]">Exceeded</span>;
  if (worst.status === "within")
    return <span className="text-[11px] font-semibold text-[color:var(--green-500)]">Within</span>;
  return <span className="text-[11px] text-[color:var(--text-tertiary)]">—</span>;
}
