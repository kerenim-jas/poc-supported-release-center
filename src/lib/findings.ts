import type {
  Application,
  ContextualAnalysisFinding,
  ExposureFinding,
  FindingDimension,
  SASTFinding,
  SecretFinding,
  Severity,
  SLAStatus,
  SupportedRelease,
  CVEInstance,
} from "./types";

export function worstSlaForRelease(r: SupportedRelease): {
  status: SLAStatus;
  daysRemaining: number | null;
} {
  let worst: SLAStatus = "no_data";
  let days: number | null = null;
  for (const c of r.cves) {
    if (c.state === "rolled_out") continue;
    if (c.slaStatus === "breached") {
      worst = "breached";
      days = c.daysToSLA;
    } else if (worst !== "breached") {
      if (c.slaStatus === "within") {
        worst = "within";
        days = days === null ? c.daysToSLA : Math.min(days, c.daysToSLA);
      } else if (worst === "no_data") {
        worst = "no_data";
        days = c.daysToSLA;
      }
    }
  }
  if (r.cves.length === 0) return { status: "no_data", daysRemaining: null };
  return { status: worst, daysRemaining: days };
}

export function countOpenBySeverity(
  cves: CVEInstance[],
): Record<Severity, number> {
  return countCveBySeverity(cves);
}

export function urgencyRank(r: SupportedRelease): number {
  const w = worstSlaForRelease(r);
  if (w.status === "breached") return 0;
  if (w.status === "within" && (w.daysRemaining ?? 99) <= 2) return 1;
  if (w.status === "within") return 2;
  return 3;
}

export function sortReleasesForList(releases: SupportedRelease[]) {
  return [...releases].sort((a, b) => {
    const ra = urgencyRank(a);
    const rb = urgencyRank(b);
    if (ra !== rb) return ra - rb;
    return a.imageName.localeCompare(b.imageName);
  });
}

export function sortApplicationsForList(
  apps: Application[],
  allReleases: SupportedRelease[],
) {
  return [...apps].sort((a, b) => {
    const ra = urgencyRankApp(getReleasesForApp(a, allReleases));
    const rb = urgencyRankApp(getReleasesForApp(b, allReleases));
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  });
}

export function countBySeverity<T extends { severity: Severity }>(
  items: T[],
): Record<Severity, number> {
  const out: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  for (const item of items) out[item.severity] += 1;
  return out;
}

export function countCveBySeverity(cves: CVEInstance[]): Record<Severity, number> {
  const out: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  for (const c of cves) {
    if (c.state === "rolled_out") continue;
    out[c.cve.severity] += 1;
  }
  return out;
}

export function dimensionCount(
  release: SupportedRelease,
  dim: FindingDimension,
): number {
  switch (dim) {
    case "vulnerabilities":
      return release.cves.filter((c) => c.state !== "rolled_out").length;
    case "secrets":
      return release.secrets.length;
    case "exposures":
      return release.exposures.length;
    case "sast":
      return release.sastFindings.length;
    case "contextual":
      return release.contextualAnalysis.length;
  }
}

export function dimensionHasSeverity(
  release: SupportedRelease,
  dim: FindingDimension,
  severities: Set<Severity>,
): boolean {
  switch (dim) {
    case "vulnerabilities":
      return release.cves.some(
        (c) => c.state !== "rolled_out" && severities.has(c.cve.severity),
      );
    case "secrets":
      return release.secrets.some((s) => severities.has(s.severity));
    case "exposures":
      return release.exposures.some((e) => severities.has(e.severity));
    case "sast":
      return release.sastFindings.some((s) => severities.has(s.severity));
    case "contextual":
      return release.contextualAnalysis.some((c) => {
        const related = release.cves.find((x) => x.cve.id === c.relatedCveId);
        return related && severities.has(related.cve.severity);
      });
  }
}

export function dimensionHasType(
  release: SupportedRelease,
  dim: FindingDimension,
): boolean {
  return dimensionCount(release, dim) > 0;
}

export function rollupDimensionCounts(releases: SupportedRelease[]) {
  return {
    vulnerabilities: releases.reduce(
      (n, r) => n + dimensionCount(r, "vulnerabilities"),
      0,
    ),
    secrets: releases.reduce((n, r) => n + r.secrets.length, 0),
    exposures: releases.reduce((n, r) => n + r.exposures.length, 0),
    sast: releases.reduce((n, r) => n + r.sastFindings.length, 0),
    contextual: releases.reduce((n, r) => n + r.contextualAnalysis.length, 0),
  };
}

export function rollupSeverityForApp(releases: SupportedRelease[]) {
  const merged: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  for (const r of releases) {
    const cve = countCveBySeverity(r.cves);
    const sec = countBySeverity(r.secrets);
    const exp = countBySeverity(r.exposures);
    const sast = countBySeverity(r.sastFindings);
    for (const sev of ["critical", "high", "medium", "low"] as Severity[]) {
      merged[sev] += cve[sev] + sec[sev] + exp[sev] + sast[sev];
    }
  }
  return merged;
}

export function worstSlaForApp(releases: SupportedRelease[]) {
  if (releases.length === 0) return { status: "no_data" as const, daysRemaining: null };
  let worst = worstSlaForRelease(releases[0]!);
  for (const r of releases.slice(1)) {
    const w = worstSlaForRelease(r);
    if (w.status === "breached") return w;
    if (
      worst.status !== "breached" &&
      w.status === "within" &&
      (w.daysRemaining ?? 999) < (worst.daysRemaining ?? 999)
    ) {
      worst = w;
    }
  }
  return worst;
}

export function appTenantSum(releases: SupportedRelease[]) {
  return releases.reduce((n, r) => n + r.customerImpact, 0);
}

export function urgencyRankApp(releases: SupportedRelease[]): number {
  const w = worstSlaForApp(releases);
  if (w.status === "breached") return 0;
  const crit =
    rollupSeverityForApp(releases).critical > 0 ||
    releases.some((r) =>
      r.cves.some(
        (c) => c.cve.severity === "critical" && c.state !== "rolled_out",
      ),
    );
  if (crit) return 1;
  if (w.status === "within" && (w.daysRemaining ?? 99) <= 2) return 2;
  return 3;
}

export function getReleasesForApp(
  app: Application,
  all: SupportedRelease[],
): SupportedRelease[] {
  return all.filter((r) => app.releaseIds.includes(r.id));
}

export function contextualForCves(
  cves: CVEInstance[],
): ContextualAnalysisFinding[] {
  return cves.map((c, i) => {
    const applicable =
      c.cve.severity === "critical" && c.state !== "rolled_out"
        ? "applicable"
        : c.cve.jfrogSeverity && c.cve.jfrogSeverity !== c.cve.severity
          ? "not_applicable"
          : i % 4 === 0
            ? "not_covered"
            : "not_applicable";
    const evidence =
      applicable === "applicable"
        ? "Runtime package path matches vulnerable component in production workload."
        : applicable === "not_applicable"
          ? "JFrog contextual analysis: vulnerable code path not reachable in deployed configuration."
          : applicable === "not_covered"
            ? "Package not indexed for contextual analysis in this tenant slice."
            : "Rescan queued after dependency graph refresh.";
    return {
      id: `ca-${c.cve.id}`,
      relatedCveId: c.cve.id,
      applicability: applicable as ContextualAnalysisFinding["applicability"],
      evidence,
      detectedAt: c.detectedAt,
    };
  });
}

export type FindingItem =
  | { kind: "secret"; item: SecretFinding }
  | { kind: "exposure"; item: ExposureFinding }
  | { kind: "sast"; item: SASTFinding };
