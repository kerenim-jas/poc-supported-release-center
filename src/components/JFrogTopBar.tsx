"use client";

import {
  ChevronDownIcon,
  FilterIcon,
  HelpCircleIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons/JFrogIcons";

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
      <div className="flex min-w-[180px] items-center gap-2">
        <span className="text-[14px] font-semibold leading-[19px] tracking-tight text-[color:var(--text-primary)]">
          JFrog Platform
        </span>
      </div>

      <div className="flex flex-1 justify-center px-8">
        <nav className="flex items-center gap-[var(--space-xl)] text-[14px] font-semibold leading-[19px] text-[color:var(--text-secondary)]">
          <button
            type="button"
            className={`relative flex h-10 min-w-[28px] flex-col items-center justify-center pb-0.5 ${
              activeTab === "platform"
                ? "text-[color:var(--text-active)]"
                : "hover:text-[color:var(--text-primary)]"
            }`}
          >
            Platform
            {activeTab === "platform" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t bg-[color:var(--border-active)]" />
            )}
          </button>
          <button
            type="button"
            className={`relative flex h-10 min-w-[28px] flex-col items-center justify-center pb-0.5 ${
              activeTab === "administration"
                ? "text-[color:var(--text-active)]"
                : "hover:text-[color:var(--text-primary)]"
            }`}
          >
            Administration
            {activeTab === "administration" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t bg-[color:var(--border-active)]" />
            )}
          </button>
        </nav>
      </div>

      <div className="flex min-w-[280px] items-center justify-end gap-3">
        <div className="flex items-center rounded-[var(--radius-s)] border border-[color:var(--border-secondary)] bg-[color:var(--surface-primary)]">
          <button
            type="button"
            className="flex h-7 items-center gap-1 border-r border-[color:var(--border-primary)] px-2 text-[color:var(--icon-tertiary)] hover:bg-[color:var(--surface-secondary)]"
            aria-label="Package scope"
          >
            <span className="text-[12px]">All</span>
            <ChevronDownIcon size={12} />
          </button>
          <div className="relative">
            <input
              type="search"
              placeholder="Search Packages"
              className="h-7 w-[200px] border-0 bg-transparent pl-8 pr-2 text-[14px] leading-[19px] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
            />
            <SearchIcon
              size={14}
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[color:var(--icon-tertiary)]"
            />
          </div>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center border-l border-[color:var(--border-primary)] text-[color:var(--icon-secondary)] hover:bg-[color:var(--surface-secondary)]"
            aria-label="Filters"
          >
            <FilterIcon size={14} />
          </button>
        </div>

        <button type="button" className="btn-primary gap-[var(--space-2xs)] px-[var(--space-m)]">
          Ask AI
        </button>

        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-s)] text-[color:var(--icon-secondary)] hover:bg-[color:var(--surface-secondary)]"
          aria-label="Help"
        >
          <HelpCircleIcon size={16} />
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-s)] text-[color:var(--icon-secondary)] hover:bg-[color:var(--surface-secondary)]"
          aria-label="User menu"
        >
          <UserIcon size={16} />
        </button>

        <span className="hidden whitespace-nowrap text-[11px] text-[color:var(--text-tertiary)] sm:inline">
          Internal POC v0.11
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
