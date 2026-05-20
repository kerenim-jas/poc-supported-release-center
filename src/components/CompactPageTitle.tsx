"use client";

import { Info } from "lucide-react";

interface CompactPageTitleProps {
  title: string;
  /** Right-aligned secondary line (e.g. "7 applications · 12 releases"). */
  meta?: string;
  /** Optional helper copy — shown in an info tooltip, not as a full subtitle block. */
  infoTooltip?: string;
}

export function CompactPageTitle({
  title,
  meta,
  infoTooltip,
}: CompactPageTitleProps) {
  return (
    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <div className="flex min-w-0 items-center gap-2">
        <h1 className="text-[20px] font-semibold leading-tight text-[color:var(--text-primary)]">
          {title}
        </h1>
        {infoTooltip ? (
          <span className="group relative inline-flex">
            <button
              type="button"
              className="rounded p-0.5 text-[color:var(--icon-tertiary)] hover:bg-[color:var(--surface-tertiary)] hover:text-[color:var(--icon-secondary)]"
              aria-label="About this view"
            >
              <Info className="h-4 w-4" />
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden w-[min(320px,90vw)] rounded-md border border-[color:var(--border-secondary)] bg-white px-3 py-2 text-[12px] font-normal leading-snug text-[color:var(--text-secondary)] shadow-lg group-hover:block group-focus-within:block"
            >
              {infoTooltip}
            </span>
          </span>
        ) : null}
      </div>
      {meta ? (
        <span className="shrink-0 text-[12px] font-semibold text-[color:var(--text-secondary)]">
          {meta}
        </span>
      ) : null}
    </div>
  );
}
