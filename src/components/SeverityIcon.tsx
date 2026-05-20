"use client";

import {
  SeverityCriticalIcon,
  SeverityHighIcon,
  SeverityLowIcon,
  SeverityMediumIcon,
  SeverityUnknownIcon,
} from "@/components/icons/JFrogIcons";
import type { Severity } from "@/lib/types";
import { cn } from "@/lib/cn";

const SEVERITY_ICONS = {
  critical: SeverityCriticalIcon,
  high: SeverityHighIcon,
  medium: SeverityMediumIcon,
  low: SeverityLowIcon,
} as const;

export function SeverityIcon({
  severity,
  size = 16,
  className,
}: {
  severity: Severity | "unknown";
  size?: number;
  className?: string;
}) {
  const Icon =
    severity === "unknown"
      ? SeverityUnknownIcon
      : SEVERITY_ICONS[severity] ?? SeverityUnknownIcon;
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);
  return <Icon size={size} className={cn("shrink-0", className)} title={label} />;
}

const PILL_BG: Record<Severity, string> = {
  critical: "var(--severity-critical)",
  high: "var(--severity-high)",
  medium: "var(--severity-medium)",
  low: "var(--severity-low)",
};

export function SeverityPill({
  severity,
  label,
  muted,
  showIcon = true,
}: {
  severity: Severity;
  label?: string;
  muted?: boolean;
  showIcon?: boolean;
}) {
  const display = `${label ?? ""} ${label ? severity : severity}`.trim();
  if (muted) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border-secondary)] bg-[color:var(--surface-primary)] px-2 py-0.5 text-[11px] font-semibold capitalize text-[color:var(--text-secondary)]">
        {showIcon ? <SeverityIcon severity={severity} size={14} /> : null}
        {display}
      </span>
    );
  }
  const color = PILL_BG[severity];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize text-white"
      style={{ backgroundColor: color }}
    >
      {showIcon ? <SeverityIcon severity={severity} size={14} /> : null}
      {display}
    </span>
  );
}
