"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ActivityIcon,
  FileTextIcon,
  LayersIcon,
  NoteIcon,
  PlatformSecurityIcon,
  ProjectsIcon,
  RuntimeIcon,
  ShieldIcon,
  SidebarExpandIcon,
} from "@/components/icons/JFrogIcons";
import { cn } from "@/lib/cn";

type NavHref = "/" | "/releases/" | "/policy/";

function JFrogWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 47 18"
      className={cn("h-[17px] w-[46px] text-[color:var(--brand-green)]", className)}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M8.2 2.5h2.8v13H8.2V2.5zm6.5 0h2.6c3.2 0 5.4 2 5.4 6.5s-2.2 6.5-5.4 6.5h-2.6V2.5zm2.6 10.8c1.8 0 2.8-1.2 2.8-4.3s-1-4.3-2.8-4.3h-.2v8.6h.2zM2.5 2.5H5v5.8L9.8 2.5h2.9L9 9.2l3.5 6.3H9.6L6.2 10.5 5 12.1v3.4H2.5V2.5z"
      />
    </svg>
  );
}

function RailItem({
  icon: Icon,
  label,
  href,
  active,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  href?: NavHref;
  active?: boolean;
}) {
  const inner = (
    <span
      className={cn(
        "relative flex w-[72px] items-center justify-center py-[var(--space-s)] transition-colors",
        active
          ? "bg-[color:var(--surface-inverse-hover)]"
          : "hover:bg-[color:var(--surface-inverse-hover)]",
      )}
      title={label}
    >
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[color:var(--brand-green)]" />
      )}
      <Icon
        className={cn(
          "text-[color:var(--icon-inverse)]",
          active && "text-[color:var(--text-inverse)]",
        )}
        size={24}
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full" aria-current={active ? "page" : undefined}>
        {inner}
      </Link>
    );
  }
  return <div className="block w-full opacity-80">{inner}</div>;
}

function RailDivider() {
  return (
    <div className="flex w-full justify-center px-[var(--space-l)] py-[var(--space-xs)]">
      <div className="h-px w-full rounded-[1px] bg-[color:var(--border-secondary)]" />
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
      className="flex h-screen w-[72px] shrink-0 flex-col justify-between bg-[color:var(--surface-inverse)]"
      aria-label="Product navigation"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-[72px] shrink-0 items-center justify-center border-b border-[color:var(--border-primary)]">
          <JFrogWordmark />
        </div>

        <nav className="flex flex-col overflow-y-auto py-[var(--space-2xs)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <RailItem icon={ActivityIcon} label="Insights" />
          <RailItem href="/releases/" icon={LayersIcon} label="Applications" active={appsActive} />
          <RailItem href="/" icon={ShieldIcon} label="Supported Releases" active={releasesActive} />
          <RailItem href="/policy/" icon={FileTextIcon} label="Policy" active={pathname === "/policy" || pathname === "/policy/"} />
          <RailItem icon={NoteIcon} label="Waivers" />

          <RailDivider />

          <RailItem icon={ProjectsIcon} label="Artifactory" />
          <RailItem icon={NoteIcon} label="Scans" />
          <RailItem icon={RuntimeIcon} label="Curation" />
          <RailItem icon={RuntimeIcon} label="Runtime" />
          <RailItem icon={PlatformSecurityIcon} label="Distribution" />
          <RailItem icon={ActivityIcon} label="AI/ML" />
          <RailItem icon={ProjectsIcon} label="Pipelines" />
          <RailItem icon={PlatformSecurityIcon} label="Integrations" />
        </nav>
      </div>

      <div className="border-t border-[color:var(--border-inverse)] px-[var(--space-l)] pt-[var(--space-s)] pb-[var(--space-m)]">
        <button
          type="button"
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-bl-[var(--radius-s)] rounded-tl-[var(--radius-s)] bg-[color:var(--surface-inverse-hover)] text-[color:var(--icon-inverse)] hover:opacity-90"
          title="Expand navigation"
        >
          <SidebarExpandIcon size={20} className="rotate-90" />
        </button>
      </div>
    </aside>
  );
}
