"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

interface PageHeaderProps {
  crumbs: Crumb[];
  /** Optional trailing title (shown after breadcrumbs). */
  title?: string;
  subtitle?: string;
}

export function PageHeader({ crumbs, title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-3 flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-[color:var(--border-subtle)] bg-[color:var(--surface-primary)] pb-3 pt-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1 text-[13px] text-[color:var(--platform-teal-accent)]">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-[color:var(--text-tertiary)]" />
              )}
              {c.href ? (
                <Link href={c.href} className="hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span className="text-[color:var(--text-primary)]">{c.label}</span>
              )}
            </span>
          ))}
        </div>
        {(title || subtitle) && (
          <div className="mt-3 space-y-1">
            {title && (
              <h1 className="text-[22px] font-semibold leading-tight text-[color:var(--text-primary)]">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-[13px] text-[color:var(--text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0">
        <details className="relative">
          <summary className="list-none cursor-pointer select-none [&::-webkit-details-marker]:hidden">
            <span className="inline-flex h-9 items-center gap-2 rounded-md bg-[color:var(--green-500)] px-4 text-[13px] font-semibold text-white shadow-sm hover:opacity-95">
              Actions
              <ChevronDown className="h-4 w-4" />
            </span>
          </summary>
          <div className="absolute right-0 z-40 mt-1 min-w-[200px] rounded-md border border-[color:var(--border-primary)] bg-white py-1 text-[13px] shadow-lg">
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
