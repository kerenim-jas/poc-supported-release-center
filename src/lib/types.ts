/**
 * Domain model for the Supported Release Center.
 *
 * Modeled after Barak Haryati's SSDLC dashboard (running internally at JFrog
 * P&E, May 2026) and Ambarish's CVE × Service Excel matrix.
 *
 * Hierarchy:  Core -> Service -> ServiceVersion -> CVE
 *
 * SLA policy is global (per-tenant) and defines duration per severity and
 * which severities apply to which "support tier" (latest vs n-1 vs n-2).
 */

export type Severity = "critical" | "high" | "medium" | "low";

/** Trust state for a service version, backed by Release Bundle V2 + ssdlc-evidence. */
export type TrustState = "trusted" | "partial" | "not_trusted";

/** SLA status of an item — within / breached / no scan data yet. */
export type SLAStatus = "within" | "breached" | "no_data";

/**
 * Vulnerability lifecycle state, modeled directly from Barak's diagram:
 *
 *   [SLA counting · no breach]   [SLA + breach]
 *   Backlog  ->  Action  ->  Released  ->  Closed
 *                            ^- vuln in release+prod
 *                  vuln only in build  ^
 */
export type LifecycleState =
  | "backlog" // exists in build only — SLA timer running, no breach
  | "action" // dev work in progress on it
  | "released" // shipped — exists in release and prod (or prod only)
  | "closed"; // no longer in runtime or release

/** Support tier of a particular service version, derived from the SLA policy. */
export type SupportTier =
  | "latest" // current minor — full severity coverage
  | "supported" // n-1, n-2, ... — usually critical-only
  | "out_of_support"; // beyond support window

export interface SLAPolicy {
  /** Days within which we expect a fix per severity. */
  durations: Record<Severity, number>;
  /** Which severities require a fix on each support tier. */
  coverage: {
    latest: Severity[];
    supported: Severity[]; // typically just ["critical"] today, but can be expanded
  };
  /** How many minor versions back are considered "supported". */
  minorsSupported: number;
  /** Hard support window (e.g., 18 months for self-managed Artifactory). */
  supportWindowMonths: number;
  /** Pulled from the JFrog public End-of-Life page (or equivalent source). */
  endOfLifeSource: string;
}

export interface RuntimeSignal {
  deployed: boolean; // Currently running in any prod cluster?
  reachable: boolean; // Wiz/eBPF: vulnerable code path is loaded?
  internetFacing: boolean; // Workload has ingress / public exposure?
  customerImpact: number; // Number of SaaS customer tenants affected (0 = self-managed only)
  runningPods: string[]; // Mock pod names
  runningClusters: string[]; // Mock cluster names
}

export interface CVE {
  id: string; // e.g., CVE-2025-62718
  jfrogId?: string; // e.g., XRAY-983018
  severity: Severity;
  jfrogSeverity?: Severity; // adjusted by AppSec, often lower (e.g., XRAY-520200 Critical -> Low)
  applicability: "applicable" | "not_applicable" | "not_covered";
  component: string; // e.g., npm://axios:1.13.6
  packageType: "npm" | "maven" | "go" | "pypi" | "docker" | "rpm";
  fixedVersion?: string;
  summary: string;
  publishedAt: string; // ISO date
}

export interface CVEInstance {
  cve: CVE;
  /** Lifecycle state of THIS instance (per service version). */
  state: LifecycleState;
  /** SLA status derived from detection date + state + policy. */
  slaStatus: SLAStatus;
  /** Days remaining in SLA (negative if breached). */
  daysToSLA: number;
  /** When we first saw this CVE in a build for this service. */
  detectedAt: string;
  /** Optional Jira ticket tracking the fix. */
  jiraKey?: string;
  /** Runtime / Wiz-style exposure for this CVE on this service version. */
  runtime: RuntimeSignal;
}

export interface RepoLocation {
  name: string;
  type:
    | "release-bundles-v2"
    | "docker-local"
    | "dev-master-docker-local"
    | "art-docker-dev-local"
    | "helm-local";
  isTrustedSource: boolean; // green leaf icon in screenshots = release-bundles-v2 with evidence
  isCurrent: boolean; // checkmark = the location actually serving prod today
}

export interface ServiceVersion {
  version: string; // e.g., "2.18.0"
  releasedAt: string;
  supportTier: SupportTier;
  trustState: TrustState;
  /** When trustState=="trusted", the evidence modal payload (Screenshot 11). */
  evidence?: SecuredDistributionEvidence;
  scanStatus: {
    xray: boolean;
    xrayLastScan?: string;
    jasContextual: "true" | "false" | "na";
    sonarScanned: boolean;
    appliedWatches: string[];
  };
  repoLocations: RepoLocation[];
  cves: CVEInstance[];
}

export interface SecuredDistributionEvidence {
  signingKey: string;
  isVerified: boolean;
  bundleName: string;
  project: string;
  promoted: boolean;
  distributed: boolean;
  url: string;
  artifacts: { path: string; sha256: string }[];
  clamavInfectedCount: number;
}

export interface Service {
  id: string;
  name: string; // e.g., "artifactory-federation"
  coreId: string;
  ownerName: string;
  ownerEmail: string;
  /** Versions ordered newest first; first one is "latest". */
  versions: ServiceVersion[];
}

export interface Core {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  /** Color used in screenshot 3 column header — currently all navy, but kept for future. */
  accentColor?: string;
}

/* ------------------------------------------------------------------ */
/* Aggregation helpers                                                 */
/* ------------------------------------------------------------------ */

export interface CVEMatrixCell {
  /** Number of components in this service affected by this CVE. */
  componentCount: number;
  /** Worst SLA status across all instances of this CVE in this service. */
  slaStatus: SLAStatus;
  /** Worst lifecycle state. */
  state: LifecycleState;
  /** Exposure on the latest version row used for the matrix. */
  runtime: RuntimeSignal;
  /** Semver shown in the matrix popover / panel. */
  serviceVersion: string;
}

export interface CVEMatrixRow {
  cve: CVE;
  /** Total components across all services affected by this CVE. */
  totalComponents: number;
  /** Count of affected services where runtime.deployed (latest row). */
  prodDeployedServices: number;
  /** Per-service cell. Key = serviceId. Empty cell = service not affected. */
  perService: Record<string, CVEMatrixCell | undefined>;
}
