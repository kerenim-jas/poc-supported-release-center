"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

interface PageHeaderProps {
  crumbs: Crumb[];
  title?: string;
  subtitle?: string;
}

export function PageHeader({ crumbs, title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-[var(--space-xs)] flex shrink-0 flex-wrap items-start justify-between gap-3 bg-[color:var(--bg-page)] pb-[var(--space-xs)] pt-[var(--space-xs)]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1 text-[12px] font-normal text-[color:var(--text-tertiary)]">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="h-3 w-3 text-[color:var(--text-tertiary)]" strokeWidth={1.5} />
              )}
              {c.href ? (
                <Link
                  href={c.href}
                  className="text-[color:var(--text-tertiary)] hover:text-[color:var(--text-link)] hover:underline"
                >
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
            </span>
          ))}
        </div>
        {(title || subtitle) && (
          <div className="mt-[var(--space-xs)] space-y-1">
            {title && (
              <h1 className="text-h1 text-[color:var(--text-primary)]">{title}</h1>
            )}
            {subtitle && (
              <p className="text-[12px] font-normal text-[color:var(--text-tertiary)]">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0">
        <details className="relative">
          <summary className="list-none cursor-pointer select-none [&::-webkit-details-marker]:hidden">
            <span className="btn-primary gap-[var(--space-2xs)] px-[var(--space-s)]">
              Actions
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </summary>
          <div className="absolute right-0 z-40 mt-1 min-w-[200px] rounded-[var(--radius-s)] border border-[color:var(--border-primary)] bg-[color:var(--surface-primary)] py-1 text-[14px] shadow-[var(--shadow-sunken)]">
            <button
              type="button"
              className="block w-full px-3 py-2 text-left hover:bg-[color:var(--surface-secondary)]"
            >
              Refresh fixtures
            </button>
            <button
              type="button"
              className="block w-full px-3 py-2 text-left hover:bg-[color:var(--surface-secondary)]"
            >
              Export CSV (decorative)
            </button>
            <button
              type="button"
              className="block w-full px-3 py-2 text-left hover:bg-[color:var(--surface-secondary)]"
            >
              Notify owners (decorative)
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}
