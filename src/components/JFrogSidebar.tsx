"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Layers,
  Box,
  Activity,
  FileText,
  ScrollText,
  Shield,
  Cpu,
  Cloud,
  GitBranch,
  Bot,
  Share2,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/cn";

type NavHref = "/" | "/releases/" | "/policy/";

function FrogMark() {
  return (
    <div className="flex h-7 w-7 items-center justify-center text-[color:var(--green-500)]">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 2C7 2 3 6 3 11c0 3 1.5 5.5 4 7v2a2 2 0 002 2h6a2 2 0 002-2v-2c2.5-1.5 4-4 4-7 0-5-4-9-9-9zm-3 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
      </svg>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  href,
  active,
  indent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: NavHref;
  active?: boolean;
  indent?: boolean;
}) {
  const content = (
    <span
      className={cn(
        "relative flex min-h-[38px] w-full cursor-pointer items-center gap-3 rounded-[6px] px-3 text-[13px] transition-colors",
        indent && "pl-8",
        active
          ? "bg-[color:var(--platform-nav-active-bg)] font-semibold text-[color:var(--green-500)]"
          : "font-medium text-[color:var(--text-primary)] hover:bg-white/70",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-[color:var(--platform-nav-active-bar)]" />
      )}
      <Icon className="h-[18px] w-[18px] shrink-0 text-[color:var(--icon-secondary)]" />
      <span>{label}</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return <div className="block">{content}</div>;
}

function CollapsedSection({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full min-h-[38px] items-center justify-between gap-2 rounded-[6px] px-3 text-left text-[13px] font-semibold text-[color:var(--text-primary)] hover:bg-white/60"
    >
      <span className="flex items-center gap-3">
        <Icon className="h-[18px] w-[18px] shrink-0 text-[color:var(--icon-secondary)]" />
        {label}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-[color:var(--text-tertiary)]" />
    </button>
  );
}

export function JFrogSidebar() {
  return (
    <aside
      className="flex h-screen w-[220px] shrink-0 flex-col border-r border-[color:var(--platform-sidebar-border)] bg-[color:var(--platform-sidebar-bg)]"
      aria-label="Product navigation"
    >
      {/* Project switcher */}
      <div className="border-b border-[color:var(--platform-sidebar-border)] p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-[8px] bg-[color:var(--platform-switcher-fill)] px-3 py-2.5 text-left shadow-sm"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--navy-600)] text-[12px] font-bold text-white">
            K
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-[color:var(--text-primary)]">
              Keren Demo
            </span>
            <span className="text-[11px] text-[color:var(--text-secondary)]">
              All Projects
            </span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-[color:var(--icon-tertiary)]" />
        </button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
        <div className="px-1">
          <button
            type="button"
            className="mb-1 flex w-full items-center justify-between rounded-[6px] px-2 py-1.5 text-[12px] font-bold uppercase tracking-wide text-[color:var(--text-secondary)]"
          >
            AppTrust
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <div className="space-y-0.5">
            <SidebarItem icon={Activity} label="Insights" />
            <SidebarItem href="/releases/" icon={Layers} label="Applications" />
            <SidebarItem href="/" icon={Shield} label="Supported Releases" active />
            <SidebarItem href="/policy/" icon={FileText} label="Lifecycle Policies" />
            <SidebarItem icon={ScrollText} label="Waivers" />
            <SidebarItem icon={ScrollText} label="Activity Log" />
          </div>
        </div>

        <CollapsedSection icon={Box} label="Artifactory" />

        <div className="px-1 pt-2">
          <button
            type="button"
            className="mb-1 flex w-full items-center justify-between rounded-[6px] px-2 py-1.5 text-[12px] font-bold uppercase tracking-wide text-[color:var(--text-secondary)]"
          >
            Xray
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <SidebarItem indent icon={ScrollText} label="Scans List" />
          <SidebarItem indent icon={Activity} label="Overview" />
          <SidebarItem indent icon={Shield} label="Watch Violations" />
        </div>

        <CollapsedSection icon={Cpu} label="Curation" />
        <CollapsedSection icon={Layers} label="Catalog" />
        <CollapsedSection icon={Cloud} label="Runtime" />
        <CollapsedSection icon={Share2} label="Distribution" />
        <CollapsedSection icon={Bot} label="AI/ML" />
        <CollapsedSection icon={GitBranch} label="Pipelines" />
        <CollapsedSection icon={Plug} label="Integrations" />
      </nav>

      <div className="border-t border-[color:var(--platform-sidebar-border)] px-3 py-2 text-[10px] leading-snug text-[color:var(--text-tertiary)]">
        JFrog Platform / JFrog Cloud / © Copyright 2026 JFrog Ltd.
      </div>

      <button
        type="button"
        className="flex h-9 items-center justify-center border-t border-[color:var(--platform-sidebar-border)] text-[color:var(--icon-tertiary)] hover:bg-white/70"
        title="Collapse"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
      </button>

      <div className="flex justify-center pb-3">
        <FrogMark />
      </div>
    </aside>
  );
}
