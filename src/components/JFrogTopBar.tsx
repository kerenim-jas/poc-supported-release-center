"use client";

import {
  Search,
  Filter,
  HelpCircle,
  User,
  Sparkles,
  Package,
  ChevronDown,
} from "lucide-react";

type Tab = "platform" | "administration";

interface JFrogTopBarProps {
  activeTab?: Tab;
}

export function JFrogTopBar({ activeTab = "platform" }: JFrogTopBarProps) {
  return (
    <header
      className="flex h-[52px] shrink-0 items-center border-b border-[color:var(--border-primary)] bg-[color:var(--surface-primary)] px-[var(--space-l)]"
      role="banner"
    >
      {/* Wordmark */}
      <div className="flex min-w-[180px] items-center gap-2">
        <span className="text-[14px] font-semibold tracking-tight text-[color:var(--text-primary)]">
          JFrog Platform
        </span>
      </div>

      {/* Center tabs */}
      <div className="flex flex-1 justify-center px-8">
        <nav className="flex items-center gap-10 text-[14px] font-semibold leading-[19px] text-[color:var(--text-secondary)]">
          <button
            type="button"
            className={`relative pb-1 pt-0.5 ${
              activeTab === "platform"
                ? "text-[color:var(--brand-green)]"
                : "hover:text-[color:var(--text-primary)]"
            }`}
          >
            Platform
            {activeTab === "platform" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t bg-[color:var(--brand-green)]" />
            )}
          </button>
          <button
            type="button"
            className={`relative pb-1 pt-0.5 ${
              activeTab === "administration"
                ? "text-[color:var(--brand-green)]"
                : "hover:text-[color:var(--text-primary)]"
            }`}
          >
            Administration
            {activeTab === "administration" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t bg-[color:var(--brand-green)]" />
            )}
          </button>
        </nav>
      </div>

      {/* Right cluster */}
      <div className="flex min-w-[280px] items-center justify-end gap-3">
        <div className="flex items-center rounded-[var(--radius-s)] border border-[color:var(--border-secondary)] bg-[color:var(--surface-primary)]">
          <button
            type="button"
            className="flex h-7 items-center gap-1 border-r border-[color:var(--border-primary)] px-2 text-[color:var(--text-tertiary)] hover:bg-[color:var(--surface-secondary)]"
            aria-label="Package scope"
          >
            <Package className="h-3.5 w-3.5" />
            <ChevronDown className="h-3 w-3" />
          </button>
          <div className="relative">
            <input
              type="search"
              placeholder="Search Packages"
              className="h-7 w-[200px] border-0 bg-transparent pl-8 pr-2 text-[14px] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--icon-tertiary)]" />
          </div>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center border-l border-[color:var(--border-primary)] text-[color:var(--icon-secondary)] hover:bg-[color:var(--surface-secondary)]"
            aria-label="Filters"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          className="btn-primary gap-[var(--space-2xs)]"
        >
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
          Ask AI
        </button>

        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-s)] text-[color:var(--icon-secondary)] hover:bg-[color:var(--surface-secondary)]"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-s)] text-[color:var(--icon-secondary)] hover:bg-[color:var(--surface-secondary)]"
          aria-label="User menu"
        >
          <User className="h-4 w-4" />
        </button>

        <span className="hidden text-[11px] text-[color:var(--text-tertiary)] sm:inline whitespace-nowrap">
          Internal POC v0.7
        </span>

        <div
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--brand-green)] text-[11px] font-semibold uppercase text-[color:var(--text-inverse)]"
          title="User"
        >
          K
        </div>
      </div>
    </header>
  );
}
