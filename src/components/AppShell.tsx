"use client";

import { JFrogSidebar } from "./JFrogSidebar";
import { JFrogTopBar } from "./JFrogTopBar";

interface AppShellProps {
  children: React.ReactNode;
  /** Static decorative federated-repository banner — matches Platform feel. */
  showFederatedAlert?: boolean;
}

export function AppShell({
  children,
  showFederatedAlert = true,
}: AppShellProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[color:var(--bg-page)]">
      <JFrogSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[color:var(--bg-page)]">
        <JFrogTopBar />
        {showFederatedAlert && (
          <div
            className="shrink-0 border-b px-5 py-2 text-[12px] leading-snug text-[color:var(--text-primary)]"
            style={{
              background: "var(--platform-alert-yellow-bg)",
              borderColor: "var(--platform-alert-yellow-border)",
            }}
            role="note"
          >
            Please review the repository settings and select &apos;Push
            Configuration&apos; to resynchronize. The Federated repository
            settings are not synchronized between these repositories:
            alex-cargo-local.
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
