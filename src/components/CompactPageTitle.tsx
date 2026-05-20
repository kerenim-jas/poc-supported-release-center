"use client";

import { Info } from "lucide-react";

interface CompactPageTitleProps {
  title: string;
  meta?: string;
  infoTooltip?: string;
}

export function CompactPageTitle({
  title,
  meta,
  infoTooltip,
}: CompactPageTitleProps) {
  return (
    <div className="mb-[var(--space-l)] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <div className="flex min-w-0 items-center gap-[var(--space-xs)]">
        <h1 className="text-h1 text-[color:var(--text-primary)]">{title}</h1>
        {infoTooltip ? (
          <span className="group relative inline-flex">
            <button
              type="button"
              className="rounded-[var(--radius-s)] p-0.5 text-[color:var(--icon-tertiary)] hover:bg-[color:var(--surface-secondary)] hover:text-[color:var(--icon-secondary)]"
              aria-label="About this view"
            >
              <Info className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden w-[min(320px,90vw)] rounded-[var(--radius-s)] border border-[color:var(--border-secondary)] bg-[color:var(--surface-primary)] px-3 py-2 text-[12px] font-normal leading-snug text-[color:var(--text-secondary)] shadow-[var(--shadow-sunken)] group-hover:block group-focus-within:block"
            >
              {infoTooltip}
            </span>
          </span>
        ) : null}
      </div>
      {meta ? (
        <span className="shrink-0 text-[12px] font-normal text-[color:var(--text-tertiary)]">
          {meta}
        </span>
      ) : null}
    </div>
  );
}
