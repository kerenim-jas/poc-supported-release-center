import { LeftSidebar } from "./LeftSidebar";
import { TopBar } from "./TopBar";
import { ProductHeader } from "./ProductHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[color:var(--background-plain)]">
      <LeftSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <ProductHeader />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
