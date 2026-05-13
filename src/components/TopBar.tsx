import { Search, HelpCircle, Settings, ChevronDown } from "lucide-react";

export function TopBar() {
  return (
    <div className="flex h-[60px] items-center justify-between border-b border-[color:var(--border-primary)] bg-[color:var(--surface-primary)] px-6">
      {/* Left — search */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-7 items-center gap-1 rounded border border-[color:var(--border-secondary)] px-2 text-xs text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-secondary)]"
        >
          <span className="inline-block h-3 w-3 rounded-sm border border-current" />
          <ChevronDown className="h-3 w-3" />
        </button>
        <div className="relative w-[280px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--icon-tertiary)]" />
          <input
            type="text"
            placeholder="Search"
            className="h-7 w-full rounded border border-[color:var(--border-secondary)] bg-white pl-8 pr-2 text-xs text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:border-[color:var(--navy-500)] focus:outline-none"
          />
        </div>
      </div>

      {/* Right — icons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded text-[color:var(--icon-secondary)] hover:bg-[color:var(--surface-tertiary)] hover:text-[color:var(--icon-primary)]"
          title="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded text-[color:var(--icon-secondary)] hover:bg-[color:var(--surface-tertiary)] hover:text-[color:var(--icon-primary)]"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
        <div className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--green-500)] text-[10px] font-semibold text-white">
          SK
        </div>
      </div>
    </div>
  );
}
