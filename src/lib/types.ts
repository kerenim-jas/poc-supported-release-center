/**
 * v0.4 domain model — Trusted ∩ Supported releases, AppTrust-style UI.
 * Runtime is a light "Is It Running" touchpoint only.
 */

export type Severity = "critical" | "high" | "medium" | "low";
export type SupportTier = "latest" | "supported" | "out_of_support";
export type LifecycleState = "backlog" | "action" | "released" | "rolled_out";
export type SLAStatus = "within" | "breached" | "no_data";

export type RuntimeState = "running" | "integrity_violation" | "not_running";

export interface RuntimeStatus {
  state: RuntimeState;
  clusters: { name: string; rolloutPercent: number }[];
  totalRolloutPercent: number;
}

export interface CVE {
  id: string;
  severity: Severity;
  jfrogSeverity?: Severity;
  component: string;
  packageType: string;
  fixVersion?: string;
  summary: string;
  publishedAt: string;
  jfrogId?: string;
}

export interface CVEInstance {
  cve: CVE;
  state: LifecycleState;
  slaStatus: SLAStatus;
  daysToSLA: number;
  detectedAt: string;
  detectedPostRelease: boolean;
  jiraKey?: string;
  fixPR?: string;
  perClusterStatus?: { cluster: string; fixed: boolean }[];
}

export interface PromotionEvent {
  ts: string;
  kind:
    | "created"
    | "promotion"
    | "release"
    | "cve_detected"
    | "fix_released"
    | "rollout_progress";
  fromStage?: string;
  toStage?: string;
  status: "passed" | "passed_warning" | "failed";
  description: string;
}

export interface Evidence {
  verified: boolean;
  type: string;
  time: string;
  createdBy: string;
  attachedTo: string;
}

export interface SupportedRelease {
  id: string;
  imageName: string;
  imagePath: string;
  version: string;
  tag: string;
  supportTier: SupportTier;
  isTrusted: boolean;
  trustEvidence: Evidence[];
  signingKey: string;
  createdAt: string;
  createdBy: string;
  currentStage: "DEV" | "STAGING" | "PROD";
  lastUpdated: string;
  sizeBytes: number;
  customerImpact: number;
  runtime: RuntimeStatus;
  cves: CVEInstance[];
  timeline: PromotionEvent[];
}

export interface SLAPolicyConfig {
  minorsSupported: number;
  supportWindowMonths: number;
  /** Which severities apply to latest vs n−1/n−2 style tiers. */
  coverage: { latest: Severity[]; supportedBack: Severity[] };
  durations: Record<Severity, number>;
  automation: {
    autoOpenPR: boolean;
    autoCloseOnCleanBuild: boolean;
    dodRequiresAllClusters: boolean;
  };
}

export interface DashboardActivity {
  ts: string;
  label: string;
  tone: "green" | "amber" | "red";
}

export interface FixBottleneck {
  cveId: string;
  service: string;
  stage: string;
  daysInStage: number;
  detail: string;
}
