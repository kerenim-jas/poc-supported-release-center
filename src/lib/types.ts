/**
 * v0.7 domain model — Application-centric Trusted ∩ Supported releases.
 * Runtime is a light "Is It Running" touchpoint only.
 */

export type Severity = "critical" | "high" | "medium" | "low";
export type SupportTier = "latest" | "supported" | "out_of_support";
export type LifecycleState = "backlog" | "action" | "released" | "rolled_out";
export type SLAStatus = "within" | "breached" | "no_data";

export type RuntimeState = "running" | "integrity_violation" | "not_running";

export type FindingDimension =
  | "vulnerabilities"
  | "secrets"
  | "exposures"
  | "sast"
  | "contextual";

export interface RuntimeStatus {
  state: RuntimeState;
  clusters: { name: string; rolloutPercent: number }[];
  totalRolloutPercent: number;
}

export interface Application {
  id: string;
  name: string;
  label: string;
  description: string;
  devOwner: { name: string; email: string; team: string };
  productOwner?: { name: string; email: string };
  slaPolicy: {
    id: string;
    name: string;
    sourceUrl: string;
  };
  businessCriticality: "tier-1" | "tier-2" | "tier-3";
  customerFacing: boolean;
  deploymentModel: "saas" | "self_managed" | "both";
  releaseIds: string[];
}

export interface CommitInfo {
  sha: string;
  shortSha: string;
  message: string;
  author: string;
  authorEmail: string;
  repoUrl: string;
  branch: string;
  timestamp: string;
}

export interface SecretFinding {
  id: string;
  type: "api-key" | "aws-key" | "github-token" | "password" | "private-key" | "jwt";
  severity: Severity;
  file: string;
  line: number;
  description: string;
  detectedAt: string;
  jiraKey?: string;
}

export interface ExposureFinding {
  id: string;
  category:
    | "iac-misconfig"
    | "exposed-port"
    | "weak-tls"
    | "permissive-cors"
    | "unauthenticated-endpoint";
  severity: Severity;
  resource: string;
  description: string;
  detectedAt: string;
  jiraKey?: string;
}

export interface SASTFinding {
  id: string;
  cweId: string;
  ruleName: string;
  severity: Severity;
  file: string;
  line: number;
  description: string;
  codeSnippet?: string;
  detectedAt: string;
  jiraKey?: string;
}

export interface ContextualAnalysisFinding {
  id: string;
  relatedCveId: string;
  applicability: "applicable" | "not_applicable" | "not_covered" | "rescanning";
  evidence: string;
  detectedAt: string;
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
  applicationId: string;
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
  commit: CommitInfo;
  cves: CVEInstance[];
  secrets: SecretFinding[];
  exposures: ExposureFinding[];
  sastFindings: SASTFinding[];
  contextualAnalysis: ContextualAnalysisFinding[];
  timeline: PromotionEvent[];
}

export interface SLAPolicyConfig {
  minorsSupported: number;
  supportWindowMonths: number;
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
  applicationId?: string;
}

export interface FixBottleneck {
  cveId: string;
  service: string;
  applicationName?: string;
  releaseVersion?: string;
  stage: string;
  daysInStage: number;
  detail: string;
}
