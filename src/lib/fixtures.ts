/**
 * Fixture data — modeled directly on the SSDLC dashboard screenshots from
 * Barak Haryati (May 13 2026) and Ambarish's CVE × service Excel pivot.
 *
 * Cores, owners, and service names come from the actual JFrog org chart shown
 * in screenshot 3. CVE IDs and component identifiers mirror the real CVEs in
 * screenshots 1–2 (CVE-2025-62718 axios, CVE-2026-29145 tomcat-embed,
 * CVE-2026-33815/33816 pgx, CVE-2023-29827 ejs, CVE-2026-4800 lodash).
 */

import {
  Core,
  CoreSummary,
  CVE,
  CVEInstance,
  CVEMatrixRow,
  RepoLocation,
  Service,
  ServiceVersion,
  SLAPolicy,
  SecuredDistributionEvidence,
} from "./types";

/* ------------------------------------------------------------------ */
/* Default SLA Policy                                                  */
/* ------------------------------------------------------------------ */

export const DEFAULT_SLA_POLICY: SLAPolicy = {
  durations: { critical: 5, high: 30, medium: 90, low: 180 },
  coverage: {
    latest: ["critical", "high", "medium"],
    supported: ["critical"],
  },
  minorsSupported: 3,
  supportWindowMonths: 18,
  endOfLifeSource:
    "https://jfrog.com/help/r/jfrog-platform-administration-documentation/artifactory-end-of-life",
};

/* ------------------------------------------------------------------ */
/* Cores — mirror screenshot 3                                         */
/* ------------------------------------------------------------------ */

export const CORES: Core[] = [
  {
    id: "jfrog-devops",
    name: "JFrog DevOps",
    ownerName: "Yossi Shaul",
    ownerEmail: "yossi.shaul@jfrog.com",
  },
  {
    id: "jfrog-security",
    name: "JFrog Security",
    ownerName: "Eyal Dyment",
    ownerEmail: "eyal.dyment@jfrog.com",
  },
  {
    id: "platform-services",
    name: "Platform Services",
    ownerName: "Boris Korenfeld",
    ownerEmail: "boris.korenfeld@jfrog.com",
  },
  {
    id: "jfrog-ml",
    name: "JFrog ML",
    ownerName: "Alon Lev",
    ownerEmail: "alon.lev@jfrog.com",
  },
  {
    id: "platform-engineering",
    name: "Platform Engineering",
    ownerName: "Eyal Cohen",
    ownerEmail: "eyal.cohen@jfrog.com",
  },
  {
    id: "jfrog-fly",
    name: "JFrog Fly",
    ownerName: "Guy Levi",
    ownerEmail: "guy.levi@jfrog.com",
  },
  {
    id: "apptrust",
    name: "AppTrust",
    ownerName: "Haggai Schechtman",
    ownerEmail: "haggai.schechtman@jfrog.com",
  },
  {
    id: "jfrog-connect",
    name: "JFrog Connect",
    ownerName: "Haggai Schechtman",
    ownerEmail: "haggai.schechtman@jfrog.com",
  },
  {
    id: "unmapped",
    name: "Unmapped Services",
    ownerName: "N/A",
    ownerEmail: "platform@jfrog.com",
  },
];

/* ------------------------------------------------------------------ */
/* CVE catalog — mirrors the Excel rows                                */
/* ------------------------------------------------------------------ */

export const CVES: CVE[] = [
  {
    id: "CVE-2025-62718",
    jfrogId: "XRAY-983018",
    severity: "critical",
    jfrogSeverity: "medium",
    applicability: "not_covered",
    component: "npm://axios:1.13.6",
    packageType: "npm",
    fixedVersion: "1.15.0",
    summary:
      "Axios is a promise-based HTTP client. Prior to 1.15.0, Axios does not correctly handle hostname normalization when checking NO_PROXY rules, allowing proxy bypass and SSRF against internal services.",
    publishedAt: "2026-04-08",
  },
  {
    id: "CVE-2026-29145",
    jfrogId: "XRAY-963113",
    severity: "critical",
    applicability: "not_covered",
    component: "gav://org.apache.tomcat.embed:tomcat-embed-core:10.1.52",
    packageType: "maven",
    fixedVersion: "10.1.53, 11.0.20, 9.0.116",
    summary:
      "CLIENT_CERT authentication does not fail as expected for some scenarios when soft fail is disabled. Vulnerability in Apache Tomcat affecting 11.0.0-M1 through 11.0.18.",
    publishedAt: "2026-04-21",
  },
  {
    id: "CVE-2026-33815",
    jfrogId: "XRAY-987612",
    severity: "critical",
    applicability: "not_covered",
    component: "go://github.com/jackc/pgx/v5:5.7.4",
    packageType: "go",
    fixedVersion: "5.9.0",
    summary:
      "pgx may panic on malformed PostgreSQL frontend messages, allowing a downstream client to crash a connection pool.",
    publishedAt: "2026-04-30",
  },
  {
    id: "CVE-2026-33816",
    jfrogId: "XRAY-987613",
    severity: "critical",
    applicability: "not_covered",
    component: "go://github.com/jackc/pgx/v5:5.7.4",
    packageType: "go",
    fixedVersion: "5.9.0",
    summary:
      "pgx may leak credentials in connection error logs when SSL renegotiation fails after authentication.",
    publishedAt: "2026-04-30",
  },
  {
    id: "CVE-2023-29827",
    jfrogId: "XRAY-520200",
    severity: "critical",
    jfrogSeverity: "low",
    applicability: "not_applicable",
    component: "npm://ejs:3.1.10",
    packageType: "npm",
    fixedVersion: "3.1.11",
    summary:
      "ejs v3.1.9 is vulnerable to server-side template injection. The vulnerable function render is not exposed by ejs itself unless the application explicitly invokes it; many integrations do not. Disputed status — JFrog AppSec marks Low.",
    publishedAt: "2024-06-11",
  },
  {
    id: "CVE-2026-4800",
    jfrogId: "XRAY-959813",
    severity: "critical",
    jfrogSeverity: "high",
    applicability: "not_applicable",
    component: "npm://lodash:4.17.23",
    packageType: "npm",
    fixedVersion: "4.17.24",
    summary:
      "lodash.template prototype-pollution gadget. AppSec re-rated to High because exploit requires attacker-controlled template strings, which most JFrog services do not pass through.",
    publishedAt: "2026-02-15",
  },
  {
    id: "CVE-2026-29871",
    jfrogId: "XRAY-988011",
    severity: "high",
    applicability: "applicable",
    component: "pypi://requests:2.31.0",
    packageType: "pypi",
    fixedVersion: "2.32.0",
    summary:
      "requests library leaks Proxy-Authorization header on cross-host redirect.",
    publishedAt: "2026-03-20",
  },
  {
    id: "CVE-2026-30012",
    jfrogId: "XRAY-989044",
    severity: "high",
    applicability: "applicable",
    component: "gav://com.fasterxml.jackson.core:jackson-databind:2.16.1",
    packageType: "maven",
    fixedVersion: "2.17.1",
    summary:
      "Jackson databind deserialization of untrusted data via polymorphic typing in specific configurations.",
    publishedAt: "2026-03-28",
  },
  {
    id: "CVE-2026-31204",
    jfrogId: "XRAY-989903",
    severity: "medium",
    applicability: "applicable",
    component: "npm://node-forge:1.3.1",
    packageType: "npm",
    fixedVersion: "1.3.2",
    summary:
      "node-forge URL parsing inconsistency may allow open-redirect when handed user-supplied URLs.",
    publishedAt: "2026-04-02",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers to build service versions with realistic CVE distributions  */
/* ------------------------------------------------------------------ */

const REPOS_TYPICAL: RepoLocation[] = [
  {
    name: "rtfsgh-release-bundles-v2",
    type: "release-bundles-v2",
    isTrustedSource: true,
    isCurrent: false,
  },
  {
    name: "docker-releases-local",
    type: "docker-local",
    isTrustedSource: false,
    isCurrent: false,
  },
  {
    name: "dev-master-docker-local",
    type: "dev-master-docker-local",
    isTrustedSource: false,
    isCurrent: false,
  },
  {
    name: "rtfsgh-release-bundles-v2",
    type: "release-bundles-v2",
    isTrustedSource: true,
    isCurrent: true,
  },
  {
    name: "art-docker-dev-local",
    type: "art-docker-dev-local",
    isTrustedSource: false,
    isCurrent: false,
  },
  {
    name: "rtfsgh-release-bundles-v2",
    type: "release-bundles-v2",
    isTrustedSource: false,
    isCurrent: false,
  },
];

const STANDARD_EVIDENCE: SecuredDistributionEvidence = {
  signingKey: "ssdlc-evidence",
  isVerified: true,
  bundleName: "onprem-artifactory-federation",
  project: "rtfsgh",
  promoted: false,
  distributed: true,
  url: "https://entplus.jfrog.io/ui/artifactory/lifecycle?projectKey=rtfsgh&bundleName=onprem-artifactory-federation",
  artifacts: [
    {
      path: "helm-releases-local/./artifactory-federation-102.18.0.tgz",
      sha256: "5ed2abc4d054e1cf145b93ad0a03bed83c437b423cd4a136f293c13940878392",
    },
    {
      path: "docker-releases-local/jfrog/artifactory-federation/2.18.0/list.manifest.json",
      sha256: "90a5d0765c90484ad5258fa60d4ab1802770e8d6df81e8a319099f220c987e46",
    },
  ],
  clamavInfectedCount: 0,
};

let cveSerial = 0;
function makeCveInstance(
  cve: CVE,
  state: CVEInstance["state"],
  daysOld: number
): CVEInstance {
  cveSerial += 1;
  const slaDuration =
    cve.severity === "critical"
      ? 5
      : cve.severity === "high"
        ? 30
        : cve.severity === "medium"
          ? 90
          : 180;
  const daysToSLA = state === "backlog" ? slaDuration : slaDuration - daysOld;
  const slaStatus: CVEInstance["slaStatus"] =
    state === "backlog"
      ? "no_data"
      : daysToSLA < 0
        ? "breached"
        : "within";
  const detected = new Date();
  detected.setDate(detected.getDate() - daysOld);
  return {
    cve,
    state,
    slaStatus,
    daysToSLA,
    detectedAt: detected.toISOString().split("T")[0],
    jiraKey: `JSEC-${1200 + cveSerial}`,
  };
}

function makeVersion(
  version: string,
  releasedDaysAgo: number,
  supportTier: ServiceVersion["supportTier"],
  trustState: ServiceVersion["trustState"],
  cveSpec: { cve: CVE; state: CVEInstance["state"]; daysOld: number }[]
): ServiceVersion {
  const released = new Date();
  released.setDate(released.getDate() - releasedDaysAgo);
  return {
    version,
    releasedAt: released.toISOString().split("T")[0],
    supportTier,
    trustState,
    evidence: trustState === "trusted" ? { ...STANDARD_EVIDENCE } : undefined,
    scanStatus: {
      xray: true,
      xrayLastScan: released.toISOString().split("T")[0],
      jasContextual: "na",
      sonarScanned: trustState !== "not_trusted",
      appliedWatches: [
        "jsec-psirt-watch",
        "jsec-secrets-watch",
        "rbv1-global-block-distribution",
      ],
    },
    repoLocations: REPOS_TYPICAL,
    cves: cveSpec.map((c) => makeCveInstance(c.cve, c.state, c.daysOld)),
  };
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

const cve = (id: string) => CVES.find((c) => c.id === id)!;

export const SERVICES: Service[] = [
  /* ---- JFrog DevOps (Artifactory) ---- */
  {
    id: "artifactory-federation",
    name: "artifactory-federation",
    coreId: "jfrog-devops",
    ownerName: "Ido Zurel",
    ownerEmail: "ido.zurel@jfrog.com",
    versions: [
      makeVersion("2.18.0", 8, "latest", "trusted", [
        { cve: cve("CVE-2026-29145"), state: "released", daysOld: 14 },
        { cve: cve("CVE-2026-30012"), state: "released", daysOld: 12 },
        { cve: cve("CVE-2025-62718"), state: "action", daysOld: 6 },
        { cve: cve("CVE-2026-33815"), state: "backlog", daysOld: 2 },
      ]),
      makeVersion("2.17.4", 95, "supported", "trusted", [
        { cve: cve("CVE-2026-29145"), state: "released", daysOld: 14 },
      ]),
      makeVersion("2.16.2", 220, "out_of_support", "partial", [
        { cve: cve("CVE-2026-29145"), state: "released", daysOld: 14 },
        { cve: cve("CVE-2025-62718"), state: "released", daysOld: 6 },
      ]),
    ],
  },
  {
    id: "artifactory-server",
    name: "artifactory-server",
    coreId: "jfrog-devops",
    ownerName: "Yossi Shaul",
    ownerEmail: "yossi.shaul@jfrog.com",
    versions: [
      makeVersion("7.146.10", 7, "latest", "trusted", [
        { cve: cve("CVE-2026-29145"), state: "released", daysOld: 14 },
        { cve: cve("CVE-2026-30012"), state: "released", daysOld: 12 },
        { cve: cve("CVE-2026-4800"), state: "released", daysOld: 60 },
      ]),
      makeVersion("7.146.8", 21, "supported", "trusted", [
        { cve: cve("CVE-2026-29145"), state: "released", daysOld: 14 },
        { cve: cve("CVE-2026-4800"), state: "released", daysOld: 60 },
      ]),
      makeVersion("7.146.7", 31, "supported", "trusted", []),
      makeVersion("7.133.2", 200, "supported", "trusted", [
        { cve: cve("CVE-2026-29145"), state: "released", daysOld: 14 },
      ]),
    ],
  },
  {
    id: "artifactory-router",
    name: "artifactory-router",
    coreId: "jfrog-devops",
    ownerName: "Eli Bohbot",
    ownerEmail: "eli.bohbot@jfrog.com",
    versions: [
      makeVersion("7.146.10", 7, "latest", "trusted", [
        { cve: cve("CVE-2026-33815"), state: "released", daysOld: 4 },
        { cve: cve("CVE-2026-33816"), state: "released", daysOld: 4 },
      ]),
    ],
  },

  /* ---- JFrog Security (Xray) ---- */
  {
    id: "xray-server",
    name: "xray-server",
    coreId: "jfrog-security",
    ownerName: "Eyal Dyment",
    ownerEmail: "eyal.dyment@jfrog.com",
    versions: [
      makeVersion("3.110.0", 5, "latest", "trusted", [
        { cve: cve("CVE-2026-30012"), state: "action", daysOld: 32 },
        { cve: cve("CVE-2026-29871"), state: "released", daysOld: 18 },
        { cve: cve("CVE-2025-62718"), state: "backlog", daysOld: 1 },
      ]),
      makeVersion("3.109.4", 40, "supported", "trusted", []),
    ],
  },
  {
    id: "xray-indexer",
    name: "xray-indexer",
    coreId: "jfrog-security",
    ownerName: "Avishay Bar",
    ownerEmail: "avishay.bar@jfrog.com",
    versions: [
      makeVersion("3.110.0", 5, "latest", "trusted", [
        { cve: cve("CVE-2026-29871"), state: "released", daysOld: 18 },
      ]),
    ],
  },
  {
    id: "xray-analysis",
    name: "xray-analysis",
    coreId: "jfrog-security",
    ownerName: "Eyal Dyment",
    ownerEmail: "eyal.dyment@jfrog.com",
    versions: [
      makeVersion("3.110.0", 5, "latest", "trusted", [
        { cve: cve("CVE-2026-31204"), state: "released", daysOld: 8 },
      ]),
    ],
  },
  {
    id: "xray-jas-exposures",
    name: "xray-jas-exposures",
    coreId: "jfrog-security",
    ownerName: "Sophie Starchenko",
    ownerEmail: "sophie.starchenko@jfrog.com",
    versions: [
      makeVersion("3.110.0", 5, "latest", "trusted", [
        { cve: cve("CVE-2025-62718"), state: "released", daysOld: 6 },
        { cve: cve("CVE-2026-30012"), state: "action", daysOld: 35 },
      ]),
    ],
  },
  {
    id: "xray-policyenforcer",
    name: "xray-policyenforcer",
    coreId: "jfrog-security",
    ownerName: "Eyal Dyment",
    ownerEmail: "eyal.dyment@jfrog.com",
    versions: [
      makeVersion("3.110.0", 5, "latest", "not_trusted", [
        { cve: cve("CVE-2026-29871"), state: "action", daysOld: 28 },
      ]),
    ],
  },
  {
    id: "xray-sbom",
    name: "xray-sbom",
    coreId: "jfrog-security",
    ownerName: "Eyal Dyment",
    ownerEmail: "eyal.dyment@jfrog.com",
    versions: [
      makeVersion("3.110.0", 5, "latest", "trusted", [
        { cve: cve("CVE-2026-31204"), state: "released", daysOld: 8 },
      ]),
    ],
  },
  {
    id: "xray-persist",
    name: "xray-persist",
    coreId: "jfrog-security",
    ownerName: "Avishay Bar",
    ownerEmail: "avishay.bar@jfrog.com",
    versions: [
      makeVersion("3.110.0", 5, "latest", "trusted", []),
    ],
  },

  /* ---- Platform Services ---- */
  {
    id: "access",
    name: "access",
    coreId: "platform-services",
    ownerName: "Boris Korenfeld",
    ownerEmail: "boris.korenfeld@jfrog.com",
    versions: [
      makeVersion("7.146.0", 9, "latest", "trusted", [
        { cve: cve("CVE-2026-29145"), state: "released", daysOld: 14 },
        { cve: cve("CVE-2026-29871"), state: "released", daysOld: 18 },
      ]),
    ],
  },
  {
    id: "metadata",
    name: "metadata",
    coreId: "platform-services",
    ownerName: "Boris Korenfeld",
    ownerEmail: "boris.korenfeld@jfrog.com",
    versions: [
      makeVersion("7.146.0", 9, "latest", "trusted", [
        { cve: cve("CVE-2026-30012"), state: "released", daysOld: 12 },
      ]),
    ],
  },
  {
    id: "frontend",
    name: "frontend",
    coreId: "platform-services",
    ownerName: "Niv Maman",
    ownerEmail: "niv.maman@jfrog.com",
    versions: [
      makeVersion("7.146.0", 9, "latest", "trusted", [
        { cve: cve("CVE-2025-62718"), state: "released", daysOld: 6 },
        { cve: cve("CVE-2026-4800"), state: "released", daysOld: 60 },
        { cve: cve("CVE-2023-29827"), state: "released", daysOld: 90 },
      ]),
    ],
  },
  {
    id: "onemodel",
    name: "onemodel",
    coreId: "platform-services",
    ownerName: "Boris Korenfeld",
    ownerEmail: "boris.korenfeld@jfrog.com",
    versions: [
      makeVersion("1.4.2", 12, "latest", "trusted", [
        { cve: cve("CVE-2026-29145"), state: "released", daysOld: 14 },
      ]),
    ],
  },
  {
    id: "platform-federated-topology",
    name: "platform-federated-topology",
    coreId: "platform-services",
    ownerName: "Boris Korenfeld",
    ownerEmail: "boris.korenfeld@jfrog.com",
    versions: [
      makeVersion("2.0.5", 30, "latest", "partial", [
        { cve: cve("CVE-2026-33815"), state: "action", daysOld: 6 },
      ]),
    ],
  },

  /* ---- AppTrust ---- */
  {
    id: "apptrust-server",
    name: "apptrust-server",
    coreId: "apptrust",
    ownerName: "Haggai Schechtman",
    ownerEmail: "haggai.schechtman@jfrog.com",
    versions: [
      makeVersion("1.2.0", 18, "latest", "trusted", [
        { cve: cve("CVE-2025-62718"), state: "released", daysOld: 6 },
      ]),
    ],
  },
  {
    id: "apptrust-evidence",
    name: "apptrust-evidence",
    coreId: "apptrust",
    ownerName: "Sophie Starchenko",
    ownerEmail: "sophie.starchenko@jfrog.com",
    versions: [
      makeVersion("1.2.0", 18, "latest", "trusted", [
        { cve: cve("CVE-2025-62718"), state: "released", daysOld: 6 },
        { cve: cve("CVE-2026-29871"), state: "released", daysOld: 18 },
      ]),
    ],
  },

  /* ---- JFrog ML ---- */
  {
    id: "ml-runtime",
    name: "ml-runtime",
    coreId: "jfrog-ml",
    ownerName: "Alon Lev",
    ownerEmail: "alon.lev@jfrog.com",
    versions: [
      makeVersion("0.9.4", 21, "latest", "partial", [
        { cve: cve("CVE-2026-29871"), state: "action", daysOld: 35 },
        { cve: cve("CVE-2026-31204"), state: "released", daysOld: 8 },
      ]),
    ],
  },
  {
    id: "ml-registry",
    name: "ml-registry",
    coreId: "jfrog-ml",
    ownerName: "Alon Lev",
    ownerEmail: "alon.lev@jfrog.com",
    versions: [
      makeVersion("0.9.4", 21, "latest", "trusted", [
        { cve: cve("CVE-2026-29145"), state: "released", daysOld: 14 },
      ]),
    ],
  },

  /* ---- JFrog Connect ---- */
  {
    id: "connect-server",
    name: "connect-server",
    coreId: "jfrog-connect",
    ownerName: "Haggai Schechtman",
    ownerEmail: "haggai.schechtman@jfrog.com",
    versions: [
      makeVersion("4.5.1", 25, "latest", "not_trusted", [
        { cve: cve("CVE-2026-30012"), state: "action", daysOld: 38 },
        { cve: cve("CVE-2026-29145"), state: "released", daysOld: 14 },
      ]),
    ],
  },

  /* ---- Platform Engineering ---- */
  {
    id: "platform-cli",
    name: "platform-cli",
    coreId: "platform-engineering",
    ownerName: "Eyal Cohen",
    ownerEmail: "eyal.cohen@jfrog.com",
    versions: [
      makeVersion("2.55.0", 14, "latest", "trusted", []),
    ],
  },
  {
    id: "platform-api-gateway",
    name: "platform-api-gateway",
    coreId: "platform-engineering",
    ownerName: "Eyal Cohen",
    ownerEmail: "eyal.cohen@jfrog.com",
    versions: [
      makeVersion("2.55.0", 14, "latest", "trusted", [
        { cve: cve("CVE-2026-30012"), state: "released", daysOld: 12 },
      ]),
    ],
  },

  /* ---- JFrog Fly ---- */
  {
    id: "fly-server",
    name: "fly-server",
    coreId: "jfrog-fly",
    ownerName: "Guy Levi",
    ownerEmail: "guy.levi@jfrog.com",
    versions: [
      makeVersion("0.4.2", 30, "latest", "trusted", []),
    ],
  },

  /* ---- Unmapped (the "we don't know who owns this" bucket) ---- */
  {
    id: "legacy-mission-control",
    name: "legacy-mission-control",
    coreId: "unmapped",
    ownerName: "N/A",
    ownerEmail: "platform@jfrog.com",
    versions: [
      makeVersion("4.7.10", 380, "out_of_support", "not_trusted", [
        { cve: cve("CVE-2025-62718"), state: "released", daysOld: 6 },
        { cve: cve("CVE-2026-29145"), state: "released", daysOld: 14 },
        { cve: cve("CVE-2023-29827"), state: "released", daysOld: 90 },
      ]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Aggregations                                                        */
/* ------------------------------------------------------------------ */

export function servicesByCore(coreId: string): Service[] {
  return SERVICES.filter((s) => s.coreId === coreId);
}

export function getCore(coreId: string): Core | undefined {
  return CORES.find((c) => c.id === coreId);
}

export function getService(serviceId: string): Service | undefined {
  return SERVICES.find((s) => s.id === serviceId);
}

export function latestVersion(svc: Service): ServiceVersion {
  return svc.versions[0];
}

export function coreSummary(coreId: string): CoreSummary {
  const core = CORES.find((c) => c.id === coreId)!;
  const svcs = servicesByCore(coreId);
  const counts = { critical: 0, high: 0, medium: 0, secrets: 0, maliciousPackages: 0 };
  let trustedCount = 0;
  let slaBreaches = 0;
  for (const svc of svcs) {
    const v = latestVersion(svc);
    if (v.trustState === "trusted") trustedCount += 1;
    let breach = false;
    for (const ci of v.cves) {
      if (ci.cve.severity === "critical") counts.critical += 1;
      if (ci.cve.severity === "high") counts.high += 1;
      if (ci.cve.severity === "medium") counts.medium += 1;
      if (ci.slaStatus === "breached") breach = true;
    }
    if (breach) slaBreaches += 1;
  }
  // Sprinkle some secrets/malicious counts to mirror screenshot 3
  const seed = coreId.length;
  counts.secrets = (seed * 7) % 50;
  counts.maliciousPackages = (seed * 3) % 5;
  return {
    id: core.id,
    name: core.name,
    ownerName: core.ownerName,
    ownerEmail: core.ownerEmail,
    serviceCount: svcs.length,
    trustedCount,
    counts,
    slaBreaches,
  };
}

export function buildCVEMatrix(): CVEMatrixRow[] {
  const rows: CVEMatrixRow[] = CVES.map((c) => ({
    cve: c,
    totalComponents: 0,
    perService: {},
  }));
  for (const svc of SERVICES) {
    const v = latestVersion(svc);
    for (const inst of v.cves) {
      const row = rows.find((r) => r.cve.id === inst.cve.id);
      if (!row) continue;
      const cell = row.perService[svc.id] ?? {
        componentCount: 0,
        slaStatus: "within",
        state: "backlog",
      };
      cell.componentCount += 1;
      // Worst-of policy: breached > no_data > within
      if (
        inst.slaStatus === "breached" ||
        (inst.slaStatus === "no_data" && cell.slaStatus !== "breached")
      ) {
        cell.slaStatus = inst.slaStatus;
      }
      // State priority: released > action > backlog > closed
      const order = { closed: 0, backlog: 1, action: 2, released: 3 };
      if (order[inst.state] > order[cell.state]) cell.state = inst.state;
      row.perService[svc.id] = cell;
      row.totalComponents += 1;
    }
  }
  return rows.filter((r) => r.totalComponents > 0);
}
