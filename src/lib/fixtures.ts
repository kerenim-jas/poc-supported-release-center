/**
 * Fixture data — v0.8 Application-centric Trusted ∩ Supported Release Center.
 * CVE catalog condensed from legacy v0.3 fixtures.
 *
 * DEMO: Toggle empty dream widget → see `SHOW_EMPTY_DREAM_WIDGET` in DashboardView.tsx
 */

import type {
  Application,
  CVE,
  CVEInstance,
  Evidence,
  FixBottleneck,
  PromotionEvent,
  SupportedRelease,
  LifecycleState,
  SLAStatus,
  SLAPolicyConfig,
  DashboardActivity,
  RuntimeStatus,
} from "./types";
import { enrichRelease } from "./fixture-enrich";
import {
  countOpenBySeverity,
  sortReleasesForList,
  sortApplicationsForList,
  urgencyRank,
  worstSlaForRelease,
} from "./findings";

export {
  countOpenBySeverity,
  sortReleasesForList,
  sortApplicationsForList,
  urgencyRank,
  worstSlaForRelease,
};

/** Trusted but excluded from Trusted∩Supported rollup (shown in KPI footnote only). */
export const OUT_OF_SUPPORT_TRUSTED_COUNT = 4;

export const LAST_REFRESH_ISO = "2026-05-19T07:52:03.000Z";
export const TENANT_NAME = "JFrog SaaS — Keren Demo";
export const OVERVIEW_POLICY_BLURB =
  "Critical 5d / High 30d · n−2 minors · 18-month window";

export const SLA_POLICY_SELF_MANAGED = {
  id: "sla-jfrog-platform-self-managed",
  name: "JFrog Platform SLA — Self-Managed",
  sourceUrl:
    "https://apptrust.jfrog.io/policies/jfrog-platform-self-managed-sla",
} as const;

export const SLA_POLICY_SAAS = {
  id: "sla-jfrog-saas",
  name: "JFrog SaaS SLA",
  sourceUrl: "https://apptrust.jfrog.io/policies/jfrog-saas-sla",
} as const;

export const APPLICATIONS: Application[] = [
  {
    id: "app-artifactory",
    name: "JFrog Artifactory",
    label: "artifactory",
    description:
      "Core binary repository — federation, server, and edge routing for artifact lifecycle.",
    devOwner: {
      name: "Gal Cohen",
      email: "gal.cohen@jfrog.com",
      team: "Artifactory Core",
    },
    productOwner: { name: "Ron Peled", email: "ron.peled@jfrog.com" },
    slaPolicy: SLA_POLICY_SELF_MANAGED,
    businessCriticality: "tier-1",
    customerFacing: true,
    deploymentModel: "both",
    releaseIds: [
      "artifactory-federation-2.18.0",
      "artifactory-server-7.146.10",
      "artifactory-router-2.94.5",
    ],
  },
  {
    id: "app-xray",
    name: "JFrog Xray",
    label: "xray",
    description:
      "Security scanning control plane — server, indexer, and JAS exposures runtime.",
    devOwner: {
      name: "Nurit Levy",
      email: "nurit.levy@jfrog.com",
      team: "Xray Platform",
    },
    productOwner: { name: "Asaf Hefetz", email: "asaf.hefetz@jfrog.com" },
    slaPolicy: SLA_POLICY_SELF_MANAGED,
    businessCriticality: "tier-1",
    customerFacing: true,
    deploymentModel: "both",
    releaseIds: [
      "xray-server-3.110.0",
      "xray-indexer-3.109.8",
      "xray-jas-exposures-5.41.18",
    ],
  },
  {
    id: "app-access",
    name: "JFrog Access",
    label: "access",
    description: "Identity, permissions, and metadata services for the JFrog Platform.",
    devOwner: {
      name: "Oded Watts",
      email: "oded.watts@jfrog.com",
      team: "Platform Access",
    },
    slaPolicy: SLA_POLICY_SELF_MANAGED,
    businessCriticality: "tier-1",
    customerFacing: true,
    deploymentModel: "self_managed",
    releaseIds: ["access-1.134.41", "metadata-1.71.43"],
  },
  {
    id: "app-apptrust",
    name: "JFrog AppTrust",
    label: "apptrust",
    description: "Trusted release orchestration, SLA policy, and evidence attestation.",
    devOwner: {
      name: "Sophie Starchenko",
      email: "sophie.starchenko@jfrog.com",
      team: "AppTrust",
    },
    slaPolicy: SLA_POLICY_SELF_MANAGED,
    businessCriticality: "tier-2",
    customerFacing: true,
    deploymentModel: "saas",
    releaseIds: ["apptrust-server-14.82.51"],
  },
  {
    id: "app-connect",
    name: "JFrog Connect",
    label: "connect",
    description: "Hybrid connectivity control plane for edge and SaaS tenants.",
    devOwner: {
      name: "Yoni Avidan",
      email: "yoni.avidan@jfrog.com",
      team: "Connect",
    },
    slaPolicy: SLA_POLICY_SAAS,
    businessCriticality: "tier-2",
    customerFacing: true,
    deploymentModel: "saas",
    releaseIds: ["connect-server-3.62.91"],
  },
  {
    id: "app-ml",
    name: "JFrog ML",
    label: "ml",
    description: "ML model serving runtime for curated package intelligence.",
    devOwner: {
      name: "Itay Sarfati",
      email: "itay.sarfati@jfrog.com",
      team: "ML Platform",
    },
    slaPolicy: SLA_POLICY_SAAS,
    businessCriticality: "tier-2",
    customerFacing: false,
    deploymentModel: "saas",
    releaseIds: ["ml-runtime-2.51.72"],
  },
  {
    id: "app-platform-cli",
    name: "JFrog Platform CLI",
    label: "platform-cli",
    description: "Developer CLI for platform automation and release operations.",
    devOwner: {
      name: "DevTools Bot",
      email: "devtools.bot@jfrog.com",
      team: "Developer Experience",
    },
    slaPolicy: SLA_POLICY_SELF_MANAGED,
    businessCriticality: "tier-3",
    customerFacing: false,
    deploymentModel: "both",
    releaseIds: ["platform-cli-1.118.92"],
  },
];

export function getApplication(id: string): Application | undefined {
  return APPLICATIONS.find((a) => a.id === id);
}

export function getApplicationForRelease(
  release: SupportedRelease,
): Application | undefined {
  return getApplication(release.applicationId);
}

export function applicationsUsingPolicy(policyId: string): Application[] {
  return APPLICATIONS.filter((a) => a.slaPolicy.id === policyId);
}

export const DEFAULT_SLA_POLICY: SLAPolicyConfig = {
  minorsSupported: 3,
  supportWindowMonths: 18,
  coverage: {
    latest: ["critical", "high", "medium"],
    supportedBack: ["critical"],
  },
  durations: {
    critical: 5,
    high: 30,
    medium: 90,
    low: 180,
  },
  automation: {
    autoOpenPR: true,
    autoCloseOnCleanBuild: true,
    dodRequiresAllClusters: true,
  },
};

/** Shared CVE definitions (reuse across releases). */
const CATALOG: Record<string, CVE> = {
  "CVE-2025-62718": {
    id: "CVE-2025-62718",
    jfrogId: "XRAY-983018",
    severity: "critical",
    jfrogSeverity: "medium",
    component: "npm://axios:1.13.6",
    packageType: "npm",
    fixVersion: "1.15.0",
    summary:
      "Axios NO_PROXY hostname normalization can allow proxy bypass / SSRF against internal services.",
    publishedAt: "2026-04-08",
  },
  "CVE-2026-29145": {
    id: "CVE-2026-29145",
    jfrogId: "XRAY-963113",
    severity: "critical",
    component: "gav://org.apache.tomcat.embed:tomcat-embed-core:10.1.52",
    packageType: "maven",
    fixVersion: "10.1.53",
    summary:
      "Apache Tomcat CLIENT_CERT authentication misbehaves under certain soft-fail configurations.",
    publishedAt: "2026-04-21",
  },
  "CVE-2026-33815": {
    id: "CVE-2026-33815",
    jfrogId: "XRAY-987612",
    severity: "critical",
    component: "go://github.com/jackc/pgx/v5:5.7.4",
    packageType: "go",
    fixVersion: "5.9.0",
    summary: "Malformed PostgreSQL frontend messages may panic pgx connection pools.",
    publishedAt: "2026-04-30",
  },
  "CVE-2026-33816": {
    id: "CVE-2026-33816",
    jfrogId: "XRAY-987613",
    severity: "critical",
    component: "go://github.com/jackc/pgx/v5:5.7.4",
    packageType: "go",
    fixVersion: "5.9.0",
    summary:
      "Credentials may leak in connection logs under rare SSL negotiation failure paths.",
    publishedAt: "2026-04-30",
  },
  "CVE-2023-29827": {
    id: "CVE-2023-29827",
    jfrogId: "XRAY-520200",
    severity: "critical",
    jfrogSeverity: "low",
    component: "npm://ejs:3.1.10",
    packageType: "npm",
    fixVersion: "3.1.11",
    summary:
      "Server-side template injection in ejs disputed — many deployments do not expose render().",
    publishedAt: "2024-06-11",
  },
  "CVE-2026-4800": {
    id: "CVE-2026-4800",
    jfrogId: "XRAY-959813",
    severity: "critical",
    jfrogSeverity: "high",
    component: "npm://lodash:4.17.23",
    packageType: "npm",
    fixVersion: "4.17.24",
    summary:
      "lodash.template gadget requires attacker-controlled template strings in uncommon configurations.",
    publishedAt: "2026-02-15",
  },
  "CVE-2026-29871": {
    id: "CVE-2026-29871",
    jfrogId: "XRAY-988011",
    severity: "high",
    component: "pypi://requests:2.31.0",
    packageType: "pypi",
    fixVersion: "2.32.0",
    summary: "requests may leak Proxy-Authorization on cross-host redirects.",
    publishedAt: "2026-03-20",
  },
  "CVE-2026-30012": {
    id: "CVE-2026-30012",
    jfrogId: "XRAY-989044",
    severity: "high",
    component: "gav://com.fasterxml.jackson.core:jackson-databind:2.16.1",
    packageType: "maven",
    fixVersion: "2.17.1",
    summary:
      "Polymorphic deserialization gadget chain in databind configurations that enable default typing.",
    publishedAt: "2026-03-28",
  },
  "CVE-2026-31204": {
    id: "CVE-2026-31204",
    jfrogId: "XRAY-989903",
    severity: "medium",
    component: "npm://node-forge:1.3.1",
    packageType: "npm",
    fixVersion: "1.3.2",
    summary:
      "node-forge URL parsing edge case enabling open redirects in naive integrations.",
    publishedAt: "2026-04-02",
  },
};

function clustersFull(): RuntimeStatus["clusters"] {
  return [
    { name: "us-east-1-prod", rolloutPercent: 100 },
    { name: "eu-central-1-prod", rolloutPercent: 100 },
    { name: "us-west-2-prod", rolloutPercent: 100 },
    { name: "ap-southeast-2-prod", rolloutPercent: 100 },
  ];
}

function ci(
  cveKey: keyof typeof CATALOG,
  opts: {
    state: LifecycleState;
    slaStatus?: SLAStatus;
    daysToSLA: number;
    detectedAt: string;
    detectedPostRelease: boolean;
    jiraKey?: string;
    fixPR?: string;
    perCluster?: { cluster: string; fixed: boolean }[];
  },
): CVEInstance {
  const cve = CATALOG[cveKey];
  return {
    cve,
    state: opts.state,
    slaStatus: opts.slaStatus ?? "within",
    daysToSLA: opts.daysToSLA,
    detectedAt: opts.detectedAt,
    detectedPostRelease: opts.detectedPostRelease,
    jiraKey: opts.jiraKey ?? `SEC-${cveKey}`,
    fixPR: opts.fixPR,
    perClusterStatus: opts.perCluster,
  };
}

const standardEvidence = (attached: string): Evidence[] => [
  {
    verified: true,
    type: "slsa-provenance",
    time: "2026-05-09T06:58:41.000Z",
    createdBy: "rb-v2.promoter.saas",
    attachedTo: attached,
  },
  {
    verified: true,
    type: "atlassian-jira-release",
    time: "2026-05-09T06:54:58.000Z",
    createdBy: "lifecycle-automation.saas",
    attachedTo: attached,
  },
  {
    verified: true,
    type: "promotion",
    time: "2026-05-09T05:52:41.000Z",
    createdBy: "staging-router.saas",
    attachedTo: attached,
  },
  {
    verified: true,
    type: "cyclonedx-sbom",
    time: "2026-05-09T06:35:51.000Z",
    createdBy: "jfrog-scan-pipeline.saas",
    attachedTo: attached,
  },
  {
    verified: true,
    type: "apptrust-gate-certify",
    time: "2026-05-09T08:51:52.000Z",
    createdBy: "trust-orchestration.saas",
    attachedTo: attached,
  },
  {
    verified: false,
    type: "rbv2-signature-bundle",
    time: "2026-05-09T06:02:51.000Z",
    createdBy: "supply-chain-hooks.saas",
    attachedTo: attached,
  },
];

function promotionTimelineFed(): PromotionEvent[] {
  return [
    {
      ts: "2026-05-09T06:22:51.000Z",
      kind: "created",
      status: "passed",
      description: "Version 2.18.0 bundle materialized",
    },
    {
      ts: "2026-05-09T06:54:52.000Z",
      kind: "promotion",
      fromStage: "INTEGRATION",
      toStage: "DEV",
      status: "passed",
      description: "Promotion to DEV (RBv2 + sbom)",
    },
    {
      ts: "2026-05-10T05:54:52.000Z",
      kind: "promotion",
      fromStage: "DEV",
      toStage: "STAGING",
      status: "passed_warning",
      description: "Promotion to STAGING — passed with waivers",
    },
    {
      ts: "2026-05-13T06:54:52.000Z",
      kind: "release",
      fromStage: "STAGING",
      toStage: "PROD",
      status: "passed",
      description: "Release to PROD",
    },
    {
      ts: "2026-05-18T09:14:00.000Z",
      kind: "cve_detected",
      status: "failed",
      description: "CVE-2026-29145 detected post-release on PROD lineage",
    },
    {
      ts: "2026-05-18T11:02:00.000Z",
      kind: "cve_detected",
      status: "passed",
      description: "Code fix PR opened by detect-agent",
    },
    {
      ts: "2026-05-18T14:30:00.000Z",
      kind: "fix_released",
      status: "passed",
      description: "Fix released as docker tag 2.18.1 (candidate)",
    },
    {
      ts: "2026-05-18T14:32:00.000Z",
      kind: "rollout_progress",
      status: "passed_warning",
      description: "Rollout started to us-east-1-prod (1/4 clusters)",
    },
  ];
}

function timelineGeneric(name: string, stage: string): PromotionEvent[] {
  return [
    {
      ts: "2026-05-06T06:22:51.000Z",
      kind: "created",
      status: "passed",
      description: `${name} image lineage created`,
    },
    {
      ts: "2026-05-07T06:54:52.000Z",
      kind: "promotion",
      fromStage: "CI",
      toStage: "DEV",
      status: "passed",
      description: `Promotion to DEV`,
    },
    {
      ts: "2026-05-07T07:54:52.000Z",
      kind: "promotion",
      fromStage: "DEV",
      toStage: "STAGING",
      status: "passed_warning",
      description: `Promotion to STAGING — passed with warnings`,
    },
    {
      ts: "2026-05-07T09:54:52.000Z",
      kind: "release",
      fromStage: "STAGING",
      toStage: stage,
      status: "passed",
      description: stage === "PROD" ? `Release to PROD` : `Promoted to ${stage}`,
    },
  ];
}

const BASE_RELEASES: Omit<
  SupportedRelease,
  "commit" | "secrets" | "exposures" | "sastFindings" | "contextualAnalysis"
>[] = [
  {
    id: "artifactory-federation-2.18.0",
    applicationId: "app-artifactory",
    imageName: "artifactory-federation",
    imagePath:
      "jfrog-docker-releases-remote.jfrog.io/jfrog/artifactory-federation",
    version: "2.18.0",
    tag: "latest",
    supportTier: "latest",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-05-09T06:22:51.000Z",
    createdBy: "lifecycle-automation.saas",
    currentStage: "PROD",
    lastUpdated: "2026-05-19T06:54:52.000Z",
    sizeBytes: 892_663_912,
    customerImpact: 12,
    runtime: {
      state: "running",
      clusters: clustersFull(),
      totalRolloutPercent: 100,
    },
    trustEvidence: standardEvidence(
      "rtfsgh/onprem-artifactory-federation@2.18.0",
    ),
    cves: [
      ci("CVE-2026-29145", {
        state: "action",
        slaStatus: "within",
        daysToSLA: 2,
        detectedAt: "2026-05-18",
        detectedPostRelease: true,
        jiraKey: "SEC-44521",
        fixPR: "https://github.jfrog.internal/devops/dockerfiles/pull/11882",
      }),
      ci("CVE-2026-29871", {
        state: "released",
        slaStatus: "within",
        daysToSLA: 18,
        detectedAt: "2026-05-12",
        detectedPostRelease: false,
      }),
    ],
    timeline: promotionTimelineFed(),
  },
  {
    id: "artifactory-server-7.146.10",
    applicationId: "app-artifactory",
    imageName: "artifactory-server",
    imagePath: "releases-docker.jfrog.io/jfrog/artifactory-pro",
    version: "7.146.10",
    tag: "stable",
    supportTier: "supported",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-05-06T06:22:51.000Z",
    createdBy: "release-automation.artifactory",
    currentStage: "PROD",
    lastUpdated: "2026-05-17T06:54:52.000Z",
    sizeBytes: 1_102_938_811,
    customerImpact: 47,
    runtime: {
      state: "running",
      clusters: clustersFull(),
      totalRolloutPercent: 100,
    },
    trustEvidence: standardEvidence("releases/artifactory-pro@7.146.10"),
    cves: [
      ci("CVE-2026-33815", {
        state: "rolled_out",
        slaStatus: "within",
        daysToSLA: 14,
        detectedAt: "2026-05-17",
        detectedPostRelease: true,
        perCluster: [
          { cluster: "us-east-1-prod", fixed: true },
          { cluster: "eu-central-1-prod", fixed: true },
          { cluster: "us-west-2-prod", fixed: true },
          { cluster: "ap-southeast-2-prod", fixed: false },
        ],
      }),
      ci("CVE-2026-30012", {
        state: "backlog",
        slaStatus: "no_data",
        daysToSLA: 30,
        detectedAt: "2026-05-10",
        detectedPostRelease: false,
      }),
    ],
    timeline: timelineGeneric("Artifactory", "PROD"),
  },
  {
    id: "xray-server-3.110.0",
    applicationId: "app-xray",
    imageName: "xray-server",
    imagePath: "releases-docker.jfrog.io/jfrog/xray-server",
    version: "3.110.0",
    tag: "latest",
    supportTier: "latest",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-05-07T06:02:51.000Z",
    createdBy: "release-engineering.saas",
    currentStage: "PROD",
    lastUpdated: "2026-05-17T17:54:52.000Z",
    sizeBytes: 621_884_392,
    customerImpact: 31,
    runtime: {
      state: "running",
      clusters: clustersFull(),
      totalRolloutPercent: 100,
    },
    trustEvidence: standardEvidence("security/xray-server@3.110.0"),
    cves: [
      ci("CVE-2025-62718", {
        state: "released",
        slaStatus: "within",
        daysToSLA: 4,
        detectedAt: "2026-05-17",
        detectedPostRelease: true,
        jiraKey: "SEC-44102",
      }),
      ci("CVE-2026-31204", {
        state: "backlog",
        slaStatus: "within",
        daysToSLA: 71,
        detectedAt: "2026-05-03",
        detectedPostRelease: false,
      }),
    ],
    timeline: timelineGeneric("Xray Control Plane", "PROD"),
  },
  {
    id: "artifactory-router-2.94.5",
    applicationId: "app-artifactory",
    imageName: "artifactory-router",
    imagePath: "releases-docker.jfrog.io/jfrog/artifactory-router",
    version: "2.94.5",
    tag: "stable",
    supportTier: "supported",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-04-05T06:22:51.000Z",
    createdBy: "release-automation.routing",
    currentStage: "PROD",
    lastUpdated: "2026-05-15T06:54:52.000Z",
    sizeBytes: 112_938_811,
    customerImpact: 8,
    runtime: {
      state: "integrity_violation",
      clusters: clustersFull(),
      totalRolloutPercent: 100,
    },
    trustEvidence: standardEvidence("edge/artifactory-router@2.94.5"),
    cves: [
      ci("CVE-2026-29871", {
        state: "rolled_out",
        slaStatus: "breached",
        daysToSLA: -1,
        detectedAt: "2026-05-09",
        detectedPostRelease: false,
      }),
    ],
    timeline: timelineGeneric("Routing", "PROD"),
  },
  {
    id: "xray-indexer-3.109.8",
    applicationId: "app-xray",
    imageName: "xray-indexer",
    imagePath: "releases-docker.jfrog.io/jfrog/xray-indexer",
    version: "3.109.8",
    tag: "stable",
    supportTier: "supported",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-04-09T06:22:51.000Z",
    createdBy: "release-engineering.saas",
    currentStage: "PROD",
    lastUpdated: "2026-05-16T06:54:52.000Z",
    sizeBytes: 401_220_512,
    customerImpact: 6,
    runtime: {
      state: "not_running",
      clusters: [],
      totalRolloutPercent: 0,
    },
    trustEvidence: standardEvidence("security/xray-indexer@3.109.8"),
    cves: [
      ci("CVE-2026-4800", {
        state: "action",
        slaStatus: "within",
        daysToSLA: 1,
        detectedAt: "2026-05-16",
        detectedPostRelease: false,
      }),
    ],
    timeline: timelineGeneric("Xray Indexer", "PROD"),
  },
  {
    id: "xray-jas-exposures-5.41.18",
    applicationId: "app-xray",
    imageName: "xray-jas-exposures",
    imagePath: "releases-docker.jfrog.io/jfrog/xray-jas-exposures",
    version: "5.41.18",
    tag: "latest",
    supportTier: "latest",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-05-11T06:22:51.000Z",
    createdBy: "release-engineering.saas",
    currentStage: "PROD",
    lastUpdated: "2026-05-18T06:54:52.000Z",
    sizeBytes: 238_112_900,
    customerImpact: 19,
    runtime: {
      state: "running",
      clusters: [
        { name: "us-east-1-prod", rolloutPercent: 100 },
        { name: "eu-central-1-prod", rolloutPercent: 50 },
        { name: "us-west-2-prod", rolloutPercent: 0 },
        { name: "ap-southeast-2-prod", rolloutPercent: 0 },
      ],
      totalRolloutPercent: 38,
    },
    trustEvidence: standardEvidence("security/xray-jas-exposures@5.41.18"),
    cves: [
      ci("CVE-2026-33816", {
        state: "released",
        slaStatus: "within",
        daysToSLA: 3,
        detectedAt: "2026-05-18",
        detectedPostRelease: false,
      }),
    ],
    timeline: timelineGeneric("JAS Exposures", "PROD"),
  },
  {
    id: "access-1.134.41",
    applicationId: "app-access",
    imageName: "access",
    imagePath: "releases-docker.jfrog.io/jfrog/access",
    version: "1.134.41",
    tag: "stable",
    supportTier: "supported",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-04-11T06:22:51.000Z",
    createdBy: "platform-access.release",
    currentStage: "PROD",
    lastUpdated: "2026-05-14T06:54:52.000Z",
    sizeBytes: 188_220_512,
    customerImpact: 54,
    runtime: {
      state: "running",
      clusters: clustersFull(),
      totalRolloutPercent: 100,
    },
    trustEvidence: standardEvidence("platform/access@1.134.41"),
    cves: [
      ci("CVE-2023-29827", {
        state: "backlog",
        slaStatus: "within",
        daysToSLA: 4,
        detectedAt: "2026-05-14",
        detectedPostRelease: false,
      }),
    ],
    timeline: timelineGeneric("Access", "PROD"),
  },
  {
    id: "metadata-1.71.43",
    applicationId: "app-access",
    imageName: "metadata",
    imagePath: "releases-docker.jfrog.io/jfrog/metadata",
    version: "1.71.43",
    tag: "stable",
    supportTier: "supported",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-04-03T06:22:51.000Z",
    createdBy: "platform-services.bot",
    currentStage: "PROD",
    lastUpdated: "2026-05-02T06:54:52.000Z",
    sizeBytes: 122_938_811,
    customerImpact: 3,
    runtime: {
      state: "not_running",
      clusters: [],
      totalRolloutPercent: 0,
    },
    trustEvidence: standardEvidence("platform/metadata@1.71.43"),
    cves: [],
    timeline: timelineGeneric("Metadata Service", "PROD"),
  },
  {
    id: "apptrust-server-14.82.51",
    applicationId: "app-apptrust",
    imageName: "apptrust-server",
    imagePath: "releases-docker.jfrog.io/jfrog/apptrust-server",
    version: "14.82.51",
    tag: "latest",
    supportTier: "latest",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-05-03T06:22:51.000Z",
    createdBy: "apptrust.saas-bot",
    currentStage: "PROD",
    lastUpdated: "2026-05-17T06:54:52.000Z",
    sizeBytes: 432_938_811,
    customerImpact: 22,
    runtime: {
      state: "integrity_violation",
      clusters: clustersFull(),
      totalRolloutPercent: 100,
    },
    trustEvidence: standardEvidence("apptrust/apptrust-server@14.82.51"),
    cves: [
      ci("CVE-2026-30012", {
        state: "action",
        slaStatus: "breached",
        daysToSLA: -3,
        detectedAt: "2026-05-04",
        detectedPostRelease: false,
      }),
    ],
    timeline: timelineGeneric("AppTrust", "PROD"),
  },
  {
    id: "connect-server-3.62.91",
    applicationId: "app-connect",
    imageName: "connect-server",
    imagePath: "releases-docker.jfrog.io/jfrog/connect-server",
    version: "3.62.91",
    tag: "stable",
    supportTier: "supported",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-04-06T06:22:51.000Z",
    createdBy: "connect.saas-bot",
    currentStage: "PROD",
    lastUpdated: "2026-05-06T06:54:52.000Z",
    sizeBytes: 212_938_811,
    customerImpact: 9,
    runtime: {
      state: "running",
      clusters: clustersFull(),
      totalRolloutPercent: 100,
    },
    trustEvidence: standardEvidence("connect/connect-server@3.62.91"),
    cves: [],
    timeline: timelineGeneric("Connect Control", "PROD"),
  },
  {
    id: "ml-runtime-2.51.72",
    applicationId: "app-ml",
    imageName: "ml-runtime",
    imagePath: "releases-docker.jfrog.io/jfrog/ml-runtime",
    version: "2.51.72",
    tag: "beta",
    supportTier: "latest",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-05-09T06:22:51.000Z",
    createdBy: "ml.saas-bot",
    currentStage: "STAGING",
    lastUpdated: "2026-05-19T06:54:52.000Z",
    sizeBytes: 1_432_938_811,
    customerImpact: 1,
    runtime: {
      state: "not_running",
      clusters: [{ name: "staging-use1", rolloutPercent: 100 }],
      totalRolloutPercent: 100,
    },
    trustEvidence: standardEvidence("ml/ml-runtime@2.51.72"),
    cves: [
      ci("CVE-2026-31204", {
        state: "backlog",
        slaStatus: "within",
        daysToSLA: 66,
        detectedAt: "2026-05-18",
        detectedPostRelease: false,
      }),
    ],
    timeline: timelineGeneric("ML Runtime", "STAGING"),
  },
  {
    id: "platform-cli-1.118.92",
    applicationId: "app-platform-cli",
    imageName: "platform-cli",
    imagePath: "releases-docker.jfrog.io/jfrog/platform-cli",
    version: "1.118.92",
    tag: "alpha",
    supportTier: "supported",
    isTrusted: true,
    signingKey: "ssdlc-evidence",
    createdAt: "2026-04-07T06:22:51.000Z",
    createdBy: "devtools.bot",
    currentStage: "PROD",
    lastUpdated: "2026-05-07T06:54:52.000Z",
    sizeBytes: 52_938_811,
    customerImpact: 0,
    runtime: {
      state: "integrity_violation",
      clusters: clustersFull(),
      totalRolloutPercent: 100,
    },
    trustEvidence: standardEvidence("devtools/platform-cli@1.118.92"),
    cves: [],
    timeline: timelineGeneric("Platform CLI", "PROD"),
  },
];

export const RELEASES: SupportedRelease[] = BASE_RELEASES.map((r) =>
  enrichRelease(r),
);

export const FIX_BOTTLENECKS: FixBottleneck[] = [
  {
    applicationName: "JFrog Artifactory",
    serviceLabel: "Artifactory federation",
    currentStage: "released",
    count: 2,
    avgDays: 3,
  },
  {
    applicationName: "JFrog Artifactory",
    serviceLabel: "Artifactory router",
    currentStage: "rolling-out",
    count: 1,
    avgDays: 5,
  },
  {
    applicationName: "JFrog Artifactory",
    serviceLabel: "Artifactory server",
    currentStage: "released",
    count: 1,
    avgDays: 2,
  },
  {
    applicationName: "JFrog Xray",
    serviceLabel: "jas-exposures",
    currentStage: "build-pending",
    count: 3,
    avgDays: 12,
  },
  {
    applicationName: "JFrog Xray",
    serviceLabel: "xray-indexer",
    currentStage: "build-pending",
    count: 2,
    avgDays: 8,
  },
  {
    applicationName: "JFrog AppTrust",
    serviceLabel: "apptrust-api",
    currentStage: "code-fixed",
    count: 4,
    avgDays: 6,
  },
];

export const RECENT_ACTIVITY: DashboardActivity[] = [
  {
    ts: "2026-05-19T09:42:00.000Z",
    label:
      "promoted JFrog Artifactory v7.146.11 from DEV→STAGING — Passed (AppTrust gate)",
    tone: "green",
    applicationId: "app-artifactory",
  },
  {
    ts: "2026-05-19T09:14:00.000Z",
    label:
      "JFrog Artifactory — CVE-2026-29145 fix released for federation 2.18.1 (build 18291)",
    tone: "amber",
    applicationId: "app-artifactory",
  },
  {
    ts: "2026-05-18T18:30:00.000Z",
    label:
      "JFrog AppTrust 14.82.51 — SLA reminder: High severity approaching deadline",
    tone: "amber",
    applicationId: "app-apptrust",
  },
  {
    ts: "2026-05-18T15:40:00.000Z",
    label:
      "JFrog Xray / jas-exposures — Rollout started to us-west-2-prod (1/4 clusters)",
    tone: "green",
    applicationId: "app-xray",
  },
  {
    ts: "2026-05-18T11:02:00.000Z",
    label:
      "detect-agent opened PR for CVE-2025-62718 safe bump across JFrog Xray stack",
    tone: "green",
    applicationId: "app-xray",
  },
];

/** Post-release critical findings aggregated by application. */
export function buildPostReleaseCriticalRows(
  releases: SupportedRelease[],
  apps: Application[] = APPLICATIONS,
): {
  applicationId: string;
  applicationName: string;
  label: string;
  detectedDate: string;
  vulnCount: number;
  secretCount: number;
  exposureCount: number;
  sastCount: number;
  contextualCount: number;
}[] {
  return apps
    .map((app) => {
      const appReleases = releases.filter((r) => r.applicationId === app.id);
      let vulnCount = 0;
      let secretCount = 0;
      let exposureCount = 0;
      let sastCount = 0;
      let contextualCount = 0;
      let detectedDate = "";

      for (const r of appReleases) {
        const postCrit = r.cves.filter(
          (c) => c.detectedPostRelease && c.cve.severity === "critical",
        );
        vulnCount += postCrit.length;
        if (postCrit.length > 0) {
          const d = postCrit.map((p) => p.detectedAt).sort().slice(-1)[0]!;
          if (!detectedDate || d > detectedDate) detectedDate = d;
        }
        secretCount += r.secrets.filter((s) => s.severity === "critical").length;
        exposureCount += r.exposures.filter((e) => e.severity === "critical")
          .length;
        sastCount += r.sastFindings.filter((s) => s.severity === "critical")
          .length;
        contextualCount += r.contextualAnalysis.filter(
          (c) => c.applicability === "applicable",
        ).length;
      }

      const total =
        vulnCount + secretCount + exposureCount + sastCount + contextualCount;
      if (total === 0) return null;

      return {
        applicationId: app.id,
        applicationName: app.name,
        label: app.label,
        detectedDate: detectedDate || "2026-05-18",
        vulnCount,
        secretCount,
        exposureCount,
        sastCount,
        contextualCount,
      };
    })
    .filter(Boolean) as {
    applicationId: string;
    applicationName: string;
    label: string;
    detectedDate: string;
    vulnCount: number;
    secretCount: number;
    exposureCount: number;
    sastCount: number;
    contextualCount: number;
  }[];
}
