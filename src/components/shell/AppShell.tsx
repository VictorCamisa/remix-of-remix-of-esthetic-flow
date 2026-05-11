import { ModuleRail } from "./ModuleRail";
import { SubNav } from "./SubNav";
import { Topbar } from "./Topbar";
import { CommandPalette, useCommandPalette } from "./CommandPalette";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useCommandPalette();
  const { pathname } = useLocation();
  const isFullHeight = pathname === "/assistente-ia" || pathname === "/crm/whatsapp";

  return (
    <div className={cn("flex w-full bg-background", isFullHeight ? "h-screen overflow-hidden" : "min-h-screen")}>
      <ModuleRail />
      <SubNav />
      <div className={cn("flex-1 flex flex-col min-w-0", isFullHeight && "h-screen overflow-hidden")}>
        <Topbar onCommandOpen={() => setOpen(true)} />
        <main className={cn("flex-1", isFullHeight ? "min-h-0 overflow-hidden flex flex-col" : "overflow-y-auto")}>
          <div className={cn(isFullHeight ? "flex-1 flex flex-col min-h-0" : "px-6 lg:px-8 py-6 max-w-[1600px] mx-auto w-full")}>
            {children}
          </div>
        </main>
      </div>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </div>
  );
}
