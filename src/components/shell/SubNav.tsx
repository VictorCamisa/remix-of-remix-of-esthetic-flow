import { useLocation, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { findActiveModule, isItemActive } from "./nav-config";

export function SubNav() {
  const { pathname, search } = useLocation();
  const active = findActiveModule(pathname);

  return (
    <aside className="hidden lg:flex flex-col w-subnav flex-shrink-0 border-r border-border bg-sidebar h-screen">
      <div className="h-14 flex items-center px-4 border-b border-border">
        <div className="min-w-0">
          <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
            Módulo
          </p>
          <p className="text-[13px] font-semibold text-foreground truncate -mt-0.5">
            {active.label}
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-3">
        {active.groups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {group.label}
              </p>
            )}
            <div className="space-y-px">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = isItemActive(item.to, pathname, search, item.end);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-2.5 h-7.5 px-2 rounded text-[13px] transition-colors",
                      isActive
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                    )}
                    style={{ height: "28px" }}
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5 flex-shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                      )}
                      strokeWidth={2}
                    />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="h-9 flex items-center px-3 border-t border-border text-2xs text-muted-foreground/70">
        <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-muted border border-border mr-1.5">⌘K</kbd>
        Buscar
      </div>
    </aside>
  );
}
