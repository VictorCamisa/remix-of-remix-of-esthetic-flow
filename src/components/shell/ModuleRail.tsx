import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MODULES, SYSTEM_ITEMS, findActiveModule } from "./nav-config";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ModuleRail() {
  const { pathname } = useLocation();
  const active = findActiveModule(pathname);

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="hidden lg:flex flex-col w-rail flex-shrink-0 border-r border-sidebar-border bg-sidebar h-screen">
        {/* Brand */}
        <Link
          to="/"
          className="h-14 flex items-center justify-center border-b border-sidebar-border"
          aria-label="Início"
        >
          <span className="font-display font-bold text-[15px] tracking-tight text-primary">Æ</span>
        </Link>

        <nav className="flex-1 flex flex-col items-center gap-0.5 py-2">
          {MODULES.map((m) => {
            const Icon = m.icon;
            const isActive = active.id === m.id;
            return (
              <Tooltip key={m.id}>
                <TooltipTrigger asChild>
                  <Link
                    to={m.basePath === "/" ? "/" : m.basePath}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 rounded-md mx-1.5 my-0.5 transition-colors",
                      isActive
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-primary" />
                    )}
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {m.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-0.5 py-2 border-t border-sidebar-border">
          {SYSTEM_ITEMS.map((it) => {
            const Icon = it.icon;
            const isActive = pathname === it.to;
            return (
              <Tooltip key={it.to}>
                <TooltipTrigger asChild>
                  <Link
                    to={it.to}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-md mx-1.5 transition-colors",
                      isActive
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{it.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </aside>
    </TooltipProvider>
  );
}
