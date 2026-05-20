"use client";

import { useCallback, useId, useRef, useState } from "react";
import {
  ChevronDownIcon,
  CloseIcon,
  FilterIcon,
  SearchIcon,
} from "@/components/icons/JFrogIcons";
import type { FindingDimension, RuntimeState, Severity } from "@/lib/types";
import { ALL_FINDING_DIMENSIONS, FINDING_TYPE_LABELS } from "@/components/FindingChips";
import {
  ALL_RUNTIME_STATES,
  ALL_SEVERITIES,
  countActiveFilters,
} from "@/lib/filter-utils";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/cn";

export type StageFilter = "any" | "latest" | "supported";

export interface FilterToolbarState {
  severityOn: Record<Severity, boolean>;
  findingOn?: Record<FindingDimension, boolean>;
  runtimeOn: Record<RuntimeState, boolean>;
  stage: StageFilter;
  cveId: string;
  appSearch?: string;
}

export interface FilterToolbarProps extends FilterToolbarState {
  showFindingType?: boolean;
  showAppSearch?: boolean;
  onSeverityChange: (next: Record<Severity, boolean>) => void;
  onFindingChange?: (next: Record<FindingDimension, boolean>) => void;
  onRuntimeChange: (next: Record<RuntimeState, boolean>) => void;
  onStageChange: (next: StageFilter) => void;
  onCveChange: (next: string) => void;
  onAppSearchChange?: (next: string) => void;
  onClearAll: () => void;
}

const RUNTIME_LABELS: Record<RuntimeState, string> = {
  running: "Running",
  integrity_violation: "Integrity Violation",
  not_running: "Not Running",
};

const STAGE_OPTIONS: { value: StageFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "latest", label: "Latest" },
  { value: "supported", label: "Supported" },
];

const filterInputClass =
  "h-7 rounded-[var(--radius-s)] border border-[color:var(--border-secondary)] bg-[color:var(--surface-primary)] text-[14px] font-normal leading-[19px] text-[color:var(--text-primary)] outline-none focus:border-[color:var(--border-active)]";

function pillClass(open: boolean, active: boolean) {
  return cn(
    "inline-flex h-7 shrink-0 items-center gap-[var(--space-2xs)] rounded-[var(--radius-s)] border px-[var(--space-s)] transition-colors",
    "text-[14px] font-semibold leading-[19px] text-[color:var(--text-primary)]",
    open
      ? "border-[color:var(--border-active)] bg-[color:var(--surface-primary)]"
      : active
        ? "border-[color:var(--border-active)] bg-[color:var(--surface-primary)]"
        : "border-[color:var(--border-secondary)] bg-[color:var(--surface-primary)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-secondary)]",
  );
}

function CountBadge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--bg-brand-primary)] px-1 text-[11px] font-semibold leading-none text-[color:var(--text-inverse)]">
      {n}
    </span>
  );
}

type PopoverId = "severity" | "finding" | "runtime" | "stage" | null;

export function FilterToolbar({
  severityOn,
  findingOn,
  runtimeOn,
  stage,
  cveId,
  appSearch = "",
  showFindingType = true,
  showAppSearch = false,
  onSeverityChange,
  onFindingChange,
  onRuntimeChange,
  onStageChange,
  onCveChange,
  onAppSearchChange,
  onClearAll,
}: FilterToolbarProps) {
  const [open, setOpen] = useState<PopoverId>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(null), []);
  useClickOutside(barRef, close, open !== null);

  const findingDims = ALL_FINDING_DIMENSIONS;
  const activeCount = countActiveFilters({
    severityOn,
    findingOn: showFindingType ? findingOn : undefined,
    findingDims: showFindingType ? findingDims : undefined,
    runtimeOn,
    stage,
    cveId,
  });

  const sevActive = ALL_SEVERITIES.filter((s) => severityOn[s]).length;
  const sevBadge =
    sevActive > 0 && sevActive < ALL_SEVERITIES.length ? sevActive : 0;

  const findBadge =
    findingOn &&
    (() => {
      const n = findingDims.filter((d) => findingOn[d]).length;
      return n > 0 && n < findingDims.length ? n : 0;
    })();

  const runBadge = (() => {
    const n = ALL_RUNTIME_STATES.filter((s) => runtimeOn[s]).length;
    return n > 0 && n < ALL_RUNTIME_STATES.length ? n : 0;
  })();

  const stageBadge = stage !== "any" ? 1 : 0;
  const cveInputId = useId();

  return (
    <div
      ref={barRef}
      className="mb-[var(--space-l)] flex h-7 min-h-7 items-center gap-[var(--space-xs)] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {showAppSearch && onAppSearchChange ? (
        <div className="relative shrink-0">
          <SearchIcon
            size={14}
            className="pointer-events-none absolute left-[var(--space-s)] top-1/2 -translate-y-1/2 text-[color:var(--icon-secondary)]"
          />
          <input
            type="search"
            value={appSearch}
            onChange={(e) => onAppSearchChange(e.target.value)}
            placeholder="Search applications…"
            className={cn(filterInputClass, "w-[200px] pl-8 pr-[var(--space-s)]")}
          />
        </div>
      ) : null}

      <FilterDropdown
        label="Severity"
        badge={sevBadge}
        open={open === "severity"}
        onToggle={() => setOpen(open === "severity" ? null : "severity")}
      >
        {ALL_SEVERITIES.map((s) => (
          <CheckboxRow
            key={s}
            checked={severityOn[s]}
            onChange={() =>
              onSeverityChange({ ...severityOn, [s]: !severityOn[s] })
            }
            label={s.charAt(0).toUpperCase() + s.slice(1)}
          />
        ))}
      </FilterDropdown>

      {showFindingType && findingOn && onFindingChange ? (
        <FilterDropdown
          label="Finding Type"
          badge={findBadge ?? 0}
          open={open === "finding"}
          onToggle={() => setOpen(open === "finding" ? null : "finding")}
        >
          {findingDims.map((d) => (
            <CheckboxRow
              key={d}
              checked={findingOn[d]}
              onChange={() =>
                onFindingChange({ ...findingOn, [d]: !findingOn[d] })
              }
              label={FINDING_TYPE_LABELS[d]}
            />
          ))}
        </FilterDropdown>
      ) : null}

      <FilterDropdown
        label="Runtime"
        badge={runBadge}
        open={open === "runtime"}
        onToggle={() => setOpen(open === "runtime" ? null : "runtime")}
      >
        {ALL_RUNTIME_STATES.map((rs) => (
          <CheckboxRow
            key={rs}
            checked={runtimeOn[rs]}
            onChange={() =>
              onRuntimeChange({ ...runtimeOn, [rs]: !runtimeOn[rs] })
            }
            label={RUNTIME_LABELS[rs]}
            dot={
              rs === "running"
                ? "var(--color-success)"
                : rs === "integrity_violation"
                  ? "var(--color-error)"
                  : "var(--text-tertiary)"
            }
          />
        ))}
      </FilterDropdown>

      <FilterDropdown
        label="Stage"
        badge={stageBadge}
        open={open === "stage"}
        onToggle={() => setOpen(open === "stage" ? null : "stage")}
      >
        {STAGE_OPTIONS.map(({ value, label }) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-s)] px-2 py-1.5 text-[12px] hover:bg-[color:var(--surface-secondary)]"
          >
            <input
              type="radio"
              name="stage-filter"
              checked={stage === value}
              onChange={() => onStageChange(value)}
              className="accent-[color:var(--brand-green)]"
            />
            {label}
          </label>
        ))}
      </FilterDropdown>

      <div className="relative flex shrink-0 items-center">
        <SearchIcon
          size={14}
          className="pointer-events-none absolute left-[var(--space-s)] top-1/2 -translate-y-1/2 text-[color:var(--icon-secondary)]"
        />
        <input
          id={cveInputId}
          type="text"
          value={cveId}
          onChange={(e) => onCveChange(e.target.value)}
          placeholder="CVE ID"
          className={cn(filterInputClass, "w-[180px] pl-8 pr-7 font-mono")}
          aria-label="CVE ID filter"
        />
        {cveId ? (
          <button
            type="button"
            onClick={() => onCveChange("")}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-[var(--radius-xs)] p-0.5 text-[color:var(--icon-tertiary)] hover:bg-[color:var(--surface-secondary)]"
            aria-label="Clear CVE ID"
          >
            <CloseIcon size={14} />
          </button>
        ) : null}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-[var(--space-xs)] pl-[var(--space-s)]">
        {activeCount > 0 ? (
          <>
            <span className="inline-flex items-center gap-1 text-[12px] font-normal text-[color:var(--text-secondary)]">
              <FilterIcon size={14} className="text-[color:var(--icon-secondary)]" />
              Filters: {activeCount}
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1 text-[12px] font-normal text-[color:var(--text-link)] hover:underline"
            >
              <CloseIcon size={14} />
              Clear all
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function FilterDropdown({
  label,
  badge,
  open,
  onToggle,
  children,
}: {
  label: string;
  badge: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="relative shrink-0">
      <button type="button" onClick={onToggle} className={pillClass(open, badge > 0)} aria-expanded={open}>
        {label}
        <CountBadge n={badge} />
        <ChevronDownIcon
          size={14}
          className={cn(
            "text-[color:var(--icon-secondary)] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-[var(--radius-s)] border border-[color:var(--border-secondary)] bg-[color:var(--surface-primary)] py-1 shadow-[var(--shadow-sunken)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
  dot,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  dot?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-s)] px-2 py-1.5 text-[12px] hover:bg-[color:var(--surface-secondary)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-[color:var(--brand-green)]"
      />
      {dot ? (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: dot }}
        />
      ) : null}
      {label}
    </label>
  );
}
