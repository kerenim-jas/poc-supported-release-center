"use client";

import {
  Search,
  Download,
  ShieldCheck,
  Settings,
  Box,
  Activity,
  GitBranch,
  Share2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
};

const TOP_ITEMS: NavItem[] = [
  { icon: Search, label: "Search" },
  { icon: Download, label: "Distribution" },
  { icon: ShieldCheck, label: "Supported Releases", active: true },
  { icon: Box, label: "Artifactory" },
  { icon: Activity, label: "Insights" },
  { icon: GitBranch, label: "Release Lifecycle" },
];

const BOTTOM_ITEMS: NavItem[] = [
  { icon: Share2, label: "Integrations" },
  { icon: Layers, label: "Apps" },
  { icon: Settings, label: "Settings" },
];

function IconButton({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      title={item.label}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded transition-colors",
        item.active
          ? "bg-[color:var(--sidebar-bg-active)] text-white"
          : "text-[color:var(--sidebar-text)] hover:bg-[color:var(--sidebar-bg-hover)] hover:text-white"
      )}
    >
      <Icon className="h-5 w-5" />
      {item.active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r bg-[color:var(--green-500)]" />
      )}
    </button>
  );
}

export function LeftSidebar() {
  return (
    <aside className="flex h-screen w-[72px] shrink-0 flex-col items-center bg-[color:var(--sidebar-bg)] py-3">
      <div className="mb-2 flex h-11 w-11 items-center justify-center text-white text-base font-semibold">
        JP
      </div>

      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded bg-[color:var(--sidebar-bg-active)] text-white text-sm font-semibold">
        BA
      </div>

      <div className="mb-4 h-px w-10 bg-white/10" />

      <nav className="flex flex-col gap-1">
        {TOP_ITEMS.map((it) => (
          <IconButton key={it.label} item={it} />
        ))}
      </nav>

      <div className="my-4 h-px w-10 bg-white/10" />

      <nav className="flex flex-col gap-1">
        {BOTTOM_ITEMS.map((it) => (
          <IconButton key={it.label} item={it} />
        ))}
      </nav>

      <div className="flex-1" />

      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded bg-[color:var(--sidebar-bg-active)] text-white text-xs font-semibold">
        z0
      </div>

      <div className="mb-2 flex h-8 w-8 items-center justify-center text-[color:var(--green-500)]">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M12 2C7 2 3 6 3 11c0 3 1.5 5.5 4 7v2a2 2 0 002 2h6a2 2 0 002-2v-2c2.5-1.5 4-4 4-7 0-5-4-9-9-9zm-3 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
      </div>

      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded bg-[color:var(--sidebar-bg-hover)] text-[color:var(--sidebar-text)] hover:text-white"
        title="Collapse"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </aside>
  );
}
