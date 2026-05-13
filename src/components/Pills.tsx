import { cn } from "@/lib/cn";
import {
  AlertTriangle,
  Flame,
  Info,
  Lock,
  PackageX,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Severity, SLAStatus, TrustState } from "@/lib/types";

/* ----------------------------------------------------------------- */
/* Severity pill — matches the colored counts in screenshots 4, 6, 9 */
/* ----------------------------------------------------------------- */

const SEVERITY_STYLES: Record<
  Severity | "secrets" | "malicious",
  { bg: string; text: string; icon: React.ComponentType<{ className?: string }> }
> = {
  critical: {
    bg: "bg-[#fde7e9]",
    text: "text-[#c92a2a]",
    icon: AlertTriangle,
  },
  high: { bg: "bg-[#fff0e0]", text: "text-[#d97706]", icon: Flame },
  medium: { bg: "bg-[#dff0fb]", text: "text-[#1d6fa5]", icon: Info },
  low: { bg: "bg-[#e8eef8]", text: "text-[#3a486a]", icon: Info },
  secrets: {
    bg: "bg-[#dff7ec]",
    text: "text-[#0f8a4f]",
    icon: Lock,
  },
  malicious: {
    bg: "bg-[#fde7f3]",
    text: "text-[#b3197d]",
    icon: PackageX,
  },
};

const SEVERITY_LABELS: Record<Severity | "secrets" | "malicious", string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  secrets: "Secrets",
  malicious: "Malicious Packages",
};

export function SeverityPill({
  severity,
  count,
  size = "md",
}: {
  severity: Severity | "secrets" | "malicious";
  count: number;
  size?: "sm" | "md";
}) {
  const s = SEVERITY_STYLES[severity];
  const Icon = s.icon;
  const px = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const text = size === "sm" ? "text-[11px]" : "text-[12px]";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider",
        s.bg,
        s.text,
        px,
        text
      )}
    >
      <Icon className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />
      {SEVERITY_LABELS[severity]}
      <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white/70 px-1 text-[10px] tabular-nums">
        {count}
      </span>
    </span>
  );
}

/* ----------------------------------------------------------------- */
/* SLA status pill — matches "Within SLA / Exceeded SLA / No Data"    */
/* in screenshots 4 and 6                                              */
/* ----------------------------------------------------------------- */

const SLA_STYLES: Record<
  SLAStatus,
  { bg: string; text: string; label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  within: {
    bg: "bg-[color:var(--green-100)]",
    text: "text-[color:var(--green-500)]",
    label: "Within SLA",
    icon: CheckCircle2,
  },
  breached: {
    bg: "bg-[color:var(--red-100)]",
    text: "text-[color:var(--red-500)]",
    label: "Exceeded SLA",
    icon: AlertCircle,
  },
  no_data: {
    bg: "bg-[color:var(--surface-tertiary)]",
    text: "text-[color:var(--text-secondary)]",
    label: "No Data",
    icon: Clock,
  },
};

export function SLAStatusPill({
  status,
  showIcon = true,
  count,
}: {
  status: SLAStatus;
  showIcon?: boolean;
  count?: number;
}) {
  const s = SLA_STYLES[status];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        s.bg,
        s.text
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {s.label}
      {typeof count === "number" && (
        <span className="ml-0.5 tabular-nums">{count}</span>
      )}
    </span>
  );
}

/* ----------------------------------------------------------------- */
/* Trusted App / Secured Distribution badge                           */
/* (Barak's pre-AppTrust prototype — green leaf icon in screenshots)  */
/* ----------------------------------------------------------------- */

const TRUST_STYLES: Record<
  TrustState,
  { dot: string; text: string; label: string; bg: string }
> = {
  trusted: {
    dot: "bg-[color:var(--green-500)]",
    text: "text-[color:var(--green-500)]",
    bg: "bg-[color:var(--green-100)]",
    label: "Trusted",
  },
  partial: {
    dot: "bg-[color:var(--orange-500)]",
    text: "text-[color:var(--orange-500)]",
    bg: "bg-[color:var(--orange-100)]",
    label: "Partial",
  },
  not_trusted: {
    dot: "bg-[color:var(--red-500)]",
    text: "text-[color:var(--red-500)]",
    bg: "bg-[color:var(--red-100)]",
    label: "Not Trusted",
  },
};

export function TrustBadge({
  state,
  variant = "pill",
}: {
  state: TrustState;
  variant?: "pill" | "leaf";
}) {
  const s = TRUST_STYLES[state];
  if (variant === "leaf") {
    return (
      <span
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full",
          s.bg,
          s.text
        )}
        title={`Secured Distribution: ${s.label}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.5 3 8.3 7 9.6V14H7v-2h2v-1.5C9 8.6 10.6 7 12.5 7c.7 0 1.5.1 1.5.1v2H13c-1 0-1 .5-1 1v1.4h2.5l-.5 2H12v7.6c4-.7 7-4.6 7-9.6 0-5.5-4.5-10-10-10z" />
        </svg>
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        s.bg,
        s.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      Secured Distribution: {s.label}
    </span>
  );
}

/* ----------------------------------------------------------------- */
/* Support tier pill — Latest / Supported (n-1, n-2) / Out of support */
/* ----------------------------------------------------------------- */

export function SupportTierPill({
  tier,
}: {
  tier: "latest" | "supported" | "out_of_support";
}) {
  if (tier === "latest") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--navy-100)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--navy-600)]">
        Latest version
      </span>
    );
  }
  if (tier === "supported") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--surface-tertiary)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--text-secondary)]">
        Supported
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--red-100)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--red-500)]">
      Out of support
    </span>
  );
}

/* ----------------------------------------------------------------- */
/* JFrog frog mini-logo (used to mark "this signal came from JFrog")  */
/* ----------------------------------------------------------------- */

export function JFrogLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center text-[color:var(--green-500)]",
        className
      )}
      title="JFrog"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M12 2C7 2 3 6 3 11c0 3 1.5 5.5 4 7v2a2 2 0 002 2h6a2 2 0 002-2v-2c2.5-1.5 4-4 4-7 0-5-4-9-9-9zm-3 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
      </svg>
    </span>
  );
}
