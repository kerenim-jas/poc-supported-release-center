"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/", label: "Cores" },
  { href: "/matrix", label: "CVE × Service matrix" },
  { href: "/lifecycle", label: "Vulnerability lifecycle" },
  { href: "/policy", label: "SLA policy" },
];

export function ProductHeader() {
  const pathname = usePathname() ?? "/";

  return (
    <div className="border-b border-[color:var(--border-primary)] bg-[color:var(--surface-primary)]">
      <div className="flex items-center justify-between px-6 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[color:var(--green-100)] text-[color:var(--green-500)]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <h1 className="text-[18px] font-semibold text-[color:var(--text-primary)]">
            Supported Release Center
          </h1>
          <span className="ml-2 inline-flex items-center rounded-full bg-[color:var(--orange-100)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--orange-500)]">
            Internal POC v0.2
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

      <nav className="flex items-end gap-1 px-6 pt-3">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/" || pathname.startsWith("/cores")
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative px-3 pb-2.5 pt-1 text-[13px] transition-colors",
                active
                  ? "font-semibold text-[color:var(--text-primary)]"
                  : "font-normal text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
              )}
            >
              {tab.label}
              {active && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t bg-[color:var(--green-500)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
