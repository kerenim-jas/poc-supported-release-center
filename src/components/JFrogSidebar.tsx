"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Box,
  Bot,
  ChevronRight,
  Cloud,
  Cpu,
  FileText,
  GitBranch,
  Layers,
  Plug,
  ScrollText,
  Share2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/cn";

type NavHref = "/" | "/releases/" | "/policy/";

function FrogMark() {
  return (
    <div className="flex h-8 w-8 items-center justify-center text-[color:var(--brand-green)]">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2C7 2 3 6 3 11c0 3 1.5 5.5 4 7v2a2 2 0 002 2h6a2 2 0 002-2v-2c2.5-1.5 4-4 4-7 0-5-4-9-9-9zm-3 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
      </svg>
    </div>
  );
}

function RailItem({
  icon: Icon,
  label,
  href,
  active,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  href?: NavHref;
  active?: boolean;
}) {
  const inner = (
    <span
      className={cn(
        "relative flex w-full flex-col items-center gap-0.5 px-1 py-2 text-center transition-colors",
        active
          ? "bg-[color:var(--surface-inverse-hover)] text-[color:var(--text-inverse)]"
          : "text-[color:var(--text-inverse)] hover:bg-[color:var(--surface-inverse-hover)]",
      )}
      title={label}
    >
      {active && (
        <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r bg-[color:var(--brand-green)]" />
      )}
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
      <span className="max-w-full truncate text-[9px] font-semibold leading-tight">
        {label}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full">
        {inner}
      </Link>
    );
  }
  return <div className="block w-full opacity-70">{inner}</div>;
}

function RailSection({ label }: { label: string }) {
  return (
    <div
      className="px-1 py-2 text-center text-[8px] font-bold uppercase tracking-wider text-[color:var(--icon-tertiary)]"
      style={{ color: "var(--border-inverse)" }}
    >
      {label}
    </div>
  );
}

export function JFrogSidebar() {
  const pathname = usePathname();
  const appsActive =
    pathname === "/releases" ||
    pathname === "/releases/" ||
    pathname.startsWith("/releases/") ||
    pathname.startsWith("/applications/");
  const releasesActive = pathname === "/" || pathname === "";

  return (
    <aside
      className="flex h-screen w-[72px] shrink-0 flex-col bg-[color:var(--surface-inverse)]"
      aria-label="Product navigation"
    >
      <div className="flex flex-col items-center border-b border-[color:var(--border-inverse)] py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--surface-inverse-deep)] text-[11px] font-bold text-[color:var(--text-inverse)]">
          K
        </span>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <RailSection label="App" />
        <RailItem icon={Activity} label="Insights" />
        <RailItem href="/releases/" icon={Layers} label="Apps" active={appsActive} />
        <RailItem href="/" icon={Shield} label="Releases" active={releasesActive} />
        <RailItem
          href="/policy/"
          icon={FileText}
          label="Policy"
          active={pathname === "/policy" || pathname === "/policy/"}
        />
        <RailItem icon={ScrollText} label="Waivers" />

        <RailSection label="More" />
        <RailItem icon={Box} label="Artifactory" />
        <RailItem icon={ScrollText} label="Scans" />
        <RailItem icon={Cpu} label="Curation" />
        <RailItem icon={Cloud} label="Runtime" />
        <RailItem icon={Share2} label="Distrib" />
        <RailItem icon={Bot} label="AI/ML" />
        <RailItem icon={GitBranch} label="Pipeline" />
        <RailItem icon={Plug} label="Integr." />
      </nav>

      <button
        type="button"
        className="flex h-8 items-center justify-center text-[color:var(--icon-inverse)] hover:bg-[color:var(--surface-inverse-hover)]"
        title="Expand navigation"
      >
        <ChevronRight className="h-4 w-4 rotate-180" strokeWidth={1.5} />
      </button>

      <div className="flex justify-center py-2">
        <FrogMark />
      </div>
    </aside>
  );
}
