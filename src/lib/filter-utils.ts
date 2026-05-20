import type { FindingDimension, RuntimeState, Severity } from "@/lib/types";

export const ALL_SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];
export const ALL_RUNTIME_STATES: RuntimeState[] = [
  "running",
  "integrity_violation",
  "not_running",
];

export function initSeverityOn(): Record<Severity, boolean> {
  return { critical: true, high: true, medium: true, low: true };
}

export function initRuntimeOn(): Record<RuntimeState, boolean> {
  return {
    running: true,
    integrity_violation: true,
    not_running: true,
  };
}

export function initFindingOn(
  dims: FindingDimension[],
): Record<FindingDimension, boolean> {
  return Object.fromEntries(dims.map((d) => [d, true])) as Record<
    FindingDimension,
    boolean
  >;
}

export function countActiveMulti<T extends string>(
  all: readonly T[],
  on: Record<T, boolean>,
): number {
  const active = all.filter((k) => on[k]).length;
  if (active === 0 || active === all.length) return 0;
  return active;
}

export function countActiveFilters(opts: {
  severityOn: Record<Severity, boolean>;
  findingOn?: Record<FindingDimension, boolean>;
  findingDims?: FindingDimension[];
  runtimeOn: Record<RuntimeState, boolean>;
  stage: "any" | "latest" | "supported";
  cveId: string;
}): number {
  let n = 0;
  if (countActiveMulti(ALL_SEVERITIES, opts.severityOn) > 0) n++;
  if (
    opts.findingOn &&
    opts.findingDims &&
    countActiveMulti(opts.findingDims, opts.findingOn) > 0
  )
    n++;
  if (countActiveMulti(ALL_RUNTIME_STATES, opts.runtimeOn) > 0) n++;
  if (opts.stage !== "any") n++;
  if (opts.cveId.trim()) n++;
  return n;
}
