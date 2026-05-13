"use client";

import { ShieldCheck, ChevronRight } from "lucide-react";

export function ProductHeader() {
  return (
    <div className="shrink-0 border-b border-[color:var(--border-primary)] bg-[color:var(--surface-primary)]">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[color:var(--green-100)] text-[color:var(--green-500)]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <h1 className="text-[18px] font-semibold text-[color:var(--text-primary)]">
            Supported Release Center
          </h1>
          <span className="ml-2 inline-flex items-center rounded-full bg-[color:var(--orange-100)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--orange-500)]">
            Internal POC v0.3
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-[color:var(--text-tertiary)]">
          <span>Tenant:</span>
          <span className="font-semibold text-[color:var(--text-secondary)]">
            jfrog-cloud
          </span>
          <ChevronRight className="h-3 w-3" />
          <span>Quarter:</span>
          <span className="font-semibold text-[color:var(--text-secondary)]">
            2026-Q2
          </span>
        </div>
      </div>
    </div>
  );
}
