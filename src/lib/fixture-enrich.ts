import type {
  CommitInfo,
  ExposureFinding,
  SASTFinding,
  SecretFinding,
  Severity,
  SupportedRelease,
} from "./types";
import { contextualForCves } from "./findings";

const SHAS: Record<string, string> = {
  "artifactory-federation-2.18.0": "a4f2c91e8b3d4f5a6c7e8d9f0a1b2c3d4e5f6a7b",
  "artifactory-server-7.146.10": "b7e3d21f4a5c6b7d8e9f0a1b2c3d4e5f6a7b8c9d",
  "xray-server-3.110.0": "c1a9f83e2d4b5c6a7f8e9d0c1b2a3f4e5d6c7b8a",
  "artifactory-router-2.94.5": "d2b8e74f1c3a4b5d6e7f8a9b0c1d2e3f4a5b6c7d",
  "xray-indexer-3.109.8": "e3c7d65a0b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e",
  "xray-jas-exposures-5.41.18": "f4d6c54b9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "access-1.134.41": "1a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b",
  "metadata-1.71.43": "2b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c",
  "apptrust-server-14.82.51": "3c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d",
  "connect-server-3.62.91": "4d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e",
  "ml-runtime-2.51.72": "5e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f",
  "platform-cli-1.118.92": "6f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a",
};

const MESSAGES: Record<string, string> = {
  "artifactory-federation-2.18.0":
    "fix(scan): handle nil response in JAS contextual analysis",
  "artifactory-server-7.146.10": "chore(release): bump pgx pool for CVE-2026-33815",
  "xray-server-3.110.0": "fix(deps): axios SSRF guard for proxy bypass CVE-2025-62718",
  "artifactory-router-2.94.5": "feat(routing): tighten requests redirect validation",
  "xray-indexer-3.109.8": "fix(template): lodash.template gadget mitigation",
  "xray-jas-exposures-5.41.18": "fix(pgx): credential leak guard on SSL negotiation",
  "access-1.134.41": "chore(security): ejs render path audit for disputed CVE",
  "metadata-1.71.43": "chore: metadata service hygiene — no open findings",
  "apptrust-server-14.82.51": "fix(jackson): default typing gadget chain patch",
  "connect-server-3.62.91": "chore: connect control plane release candidate",
  "ml-runtime-2.51.72": "feat(ml): staging bundle for node-forge bump",
  "platform-cli-1.118.92": "chore(cli): platform CLI signing refresh",
};

const AUTHORS: Record<string, { author: string; email: string }> = {
  "artifactory-federation-2.18.0": { author: "ido.zurel", email: "ido.zurel@jfrog.com" },
  "artifactory-server-7.146.10": { author: "gal.cohen", email: "gal.cohen@jfrog.com" },
  "xray-server-3.110.0": { author: "nurit.levy", email: "nurit.levy@jfrog.com" },
  "artifactory-router-2.94.5": { author: "rami.elbaz", email: "rami.elbaz@jfrog.com" },
  "xray-indexer-3.109.8": { author: "itay.sarfati", email: "itay.sarfati@jfrog.com" },
  "xray-jas-exposures-5.41.18": { author: "keren.michaeli", email: "keren.michaeli@jfrog.com" },
  "access-1.134.41": { author: "oded.watts", email: "oded.watts@jfrog.com" },
  "metadata-1.71.43": { author: "platform.bot", email: "platform.bot@jfrog.com" },
  "apptrust-server-14.82.51": { author: "sophie.starchenko", email: "sophie.starchenko@jfrog.com" },
  "connect-server-3.62.91": { author: "yoni.avidan", email: "yoni.avidan@jfrog.com" },
  "ml-runtime-2.51.72": { author: "ml.release", email: "ml.release@jfrog.com" },
  "platform-cli-1.118.92": { author: "devtools.bot", email: "devtools.bot@jfrog.com" },
};

export function makeCommit(r: Pick<SupportedRelease, "id" | "imageName" | "version" | "supportTier">): CommitInfo {
  const sha = SHAS[r.id] ?? "0000000000000000000000000000000000000000";
  const meta = AUTHORS[r.id] ?? { author: "release.bot", email: "release.bot@jfrog.com" };
  const branch =
    r.supportTier === "latest" ? "main" : `${r.version.split(".").slice(0, 2).join(".")}.x`;
  return {
    sha,
    shortSha: sha.slice(0, 7),
    message: MESSAGES[r.id] ?? `release(${r.imageName}): ${r.version}`,
    author: meta.author,
    authorEmail: meta.email,
    repoUrl: `https://github.com/jfrog/${r.imageName}`,
    branch,
    timestamp: "2026-05-09T14:22:00.000Z",
  };
}

function secretsFor(id: string): SecretFinding[] {
  const base: SecretFinding[] = [
    {
      id: `${id}-sec-1`,
      type: "aws-key",
      severity: "critical",
      file: "src/integrations/aws/client.go",
      line: 42,
      description: "AWS access key embedded in source",
      detectedAt: "2026-05-17",
      jiraKey: "SEC-88001",
    },
    {
      id: `${id}-sec-2`,
      type: "github-token",
      severity: "high",
      file: "scripts/ci/publish.sh",
      line: 18,
      description: "GitHub PAT in shell script",
      detectedAt: "2026-05-14",
      jiraKey: "SEC-88002",
    },
    {
      id: `${id}-sec-3`,
      type: "api-key",
      severity: "medium",
      file: "config/local.example.yaml",
      line: 7,
      description: "Placeholder API key committed to repo",
      detectedAt: "2026-05-10",
    },
  ];
  if (id === "metadata-1.71.43" || id === "connect-server-3.62.91") return [];
  if (id === "platform-cli-1.118.92")
    return [base[2]!];
  if (id === "ml-runtime-2.51.72") return base.slice(0, 2);
  return base;
}

function exposuresFor(id: string): ExposureFinding[] {
  if (id === "metadata-1.71.43") return [];
  const items: ExposureFinding[] = [
    {
      id: `${id}-exp-1`,
      category: "iac-misconfig",
      severity: "high",
      resource: "kubernetes/ingress.yaml",
      description: "Ingress allows wildcard host without TLS enforcement",
      detectedAt: "2026-05-16",
      jiraKey: "EXP-12001",
    },
    {
      id: `${id}-exp-2`,
      category: "exposed-port",
      severity: "medium",
      resource: "0.0.0.0:8081",
      description: "Admin port bound on all interfaces in default chart",
      detectedAt: "2026-05-12",
    },
    {
      id: `${id}-exp-3`,
      category: "permissive-cors",
      severity: "low",
      resource: "api/handlers/cors.go",
      description: "Access-Control-Allow-Origin: * on internal API",
      detectedAt: "2026-05-08",
    },
  ];
  if (id === "xray-jas-exposures-5.41.18") {
    items.push({
      id: `${id}-exp-4`,
      category: "unauthenticated-endpoint",
      severity: "critical",
      resource: "/api/v1/jas/debug",
      description: "Debug endpoint reachable without auth in staging profile",
      detectedAt: "2026-05-18",
      jiraKey: "EXP-12044",
    });
  }
  if (id === "platform-cli-1.118.92") return [items[1]!];
  return items.slice(0, id === "access-1.134.41" ? 2 : 3);
}

function sastFor(id: string): SASTFinding[] {
  if (id === "connect-server-3.62.91" || id === "metadata-1.71.43") return [];
  const items: SASTFinding[] = [
    {
      id: `${id}-sast-1`,
      cweId: "CWE-89",
      ruleName: "SQL Injection via string concatenation",
      severity: "critical" as Severity,
      file: "internal/store/query.go",
      line: 128,
      description: "User input concatenated into SQL query",
      codeSnippet: `query := "SELECT * FROM artifacts WHERE name = '" + name + "'"\ndb.Query(query)`,
      detectedAt: "2026-05-15",
      jiraKey: "SAST-3301",
    },
    {
      id: `${id}-sast-2`,
      cweId: "CWE-798",
      ruleName: "Hard-coded credentials",
      severity: "high" as Severity,
      file: "pkg/auth/legacy.go",
      line: 44,
      description: "Hard-coded password in authentication helper",
      detectedAt: "2026-05-11",
    },
    {
      id: `${id}-sast-3`,
      cweId: "CWE-22",
      ruleName: "Path traversal in file handler",
      severity: "medium" as Severity,
      file: "api/files/handler.go",
      line: 67,
      description: "Unsanitized path segment passed to os.Open",
      detectedAt: "2026-05-09",
    },
    {
      id: `${id}-sast-4`,
      cweId: "CWE-502",
      ruleName: "Unsafe deserialization",
      severity: "high" as Severity,
      file: "internal/cache/serde.go",
      line: 31,
      description: "gob.Decode on untrusted cache payload",
      detectedAt: "2026-05-07",
      jiraKey: "SAST-3308",
    },
  ];
  return items.slice(0, id === "platform-cli-1.118.92" ? 2 : 4);
}

export function enrichRelease(
  base: Omit<
    SupportedRelease,
    | "applicationId"
    | "commit"
    | "secrets"
    | "exposures"
    | "sastFindings"
    | "contextualAnalysis"
  > & { applicationId: string },
): SupportedRelease {
  const partial = { ...base } as SupportedRelease;
  return {
    ...base,
    commit: makeCommit(partial),
    secrets: secretsFor(base.id),
    exposures: exposuresFor(base.id),
    sastFindings: sastFor(base.id),
    contextualAnalysis: contextualForCves(base.cves),
  };
}
