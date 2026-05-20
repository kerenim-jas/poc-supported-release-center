"use client";

import {
  Bug,
  Key,
  AlertTriangle,
  Code,
  Search,
} from "lucide-react";
import type { FindingDimension } from "@/lib/types";
import { cn } from "@/lib/cn";

const DIM_META: Record<
  FindingDimension,
  { icon: typeof Bug; label: string }
> = {
  vulnerabilities: { icon: Bug, label: "Vulnerabilities" },
  secrets: { icon: Key, label: "Secrets" },
  exposures: { icon: AlertTriangle, label: "Exposures" },
  sast: { icon: Code, label: "SAST" },
  contextual: { icon: Search, label: "Contextual" },
};

export function FindingDimensionChips({
  counts,
  size = "sm",
}: {
  counts: Record<FindingDimension, number>;
  size?: "sm" | "xs";
}) {
  const dims = Object.keys(DIM_META) as FindingDimension[];
  return (
    <div className="flex flex-wrap gap-1">
      {dims.map((dim) => {
        const { icon: Icon } = DIM_META[dim];
        const n = counts[dim];
        const active = n > 0;
        return (
          <span
            key={dim}
            title={`${DIM_META[dim].label}: ${n}`}
            className={cn(
              "inline-flex items-center gap-0.5 rounded font-mono font-semibold",
              size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
              active
                ? "bg-[color:var(--red-100)] text-[color:var(--red-600)]"
                : "bg-[color:var(--surface-tertiary)] text-[color:var(--text-tertiary)]",
            )}
          >
            <Icon className={size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5"} />
            {n}
          </span>
        );
      })}
    </div>
  );
}

export const ALL_FINDING_DIMENSIONS: FindingDimension[] = [
  "vulnerabilities",
  "secrets",
  "exposures",
  "sast",
  "contextual",
];

export const FINDING_TYPE_LABELS: Record<FindingDimension, string> = {
  vulnerabilities: "Vulnerabilities",
  secrets: "Secrets",
  exposures: "Exposures",
  sast: "SAST",
  contextual: "Contextual Analysis",
};
