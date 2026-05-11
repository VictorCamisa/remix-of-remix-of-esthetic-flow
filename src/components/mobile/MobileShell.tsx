import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, Home, Users, ClipboardList, DollarSign, MoreHorizontal } from "lucide-react";
import { MODULES, SYSTEM_ITEMS, findActiveModule } from "@/components/shell/nav-config";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAuthMenu } from "@/components/UserAuthMenu";
import { MobileWhatsApp } from "@/components/mobile/pages/MobileWhatsApp";

const PRIMARY = [
  { id: "home", label: "Início", to: "/", icon: Home, match: (p: string) => p === "/" },
  { id: "crm", label: "Comercial", to: "/crm/pipeline", icon: Users, match: (p: string) => p.startsWith("/crm") },
  { id: "gestao", label: "Gestão", to: "/gestao", icon: ClipboardList, match: (p: string) => p.startsWith("/gestao") },
  { id: "fin", label: "Financeiro", to: "/financeiro", icon: DollarSign, match: (p: string) => p.startsWith("/financeiro") },
];

function MoreSheet() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-full text-muted-foreground active:scale-95 transition-transform">
          <MoreHorizontal className="h-5 w-5" />
          <span className="text-[10px] font-medium">Mais</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88%] max-w-sm p-0 flex flex-col">
        <SheetHeader className="px-5 h-14 border-b border-border flex flex-row items-center justify-between">
          <SheetTitle className="text-[15px]">Navegação</SheetTitle>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserAuthMenu />
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-3">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.id} className="mb-3">
                <div className="flex items-center gap-2 px-5 mb-1">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {m.label}
                  </p>
                </div>
                <div>
                  {m.groups.flatMap((g) => g.items).map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 h-10 px-5 text-[14px] text-foreground hover:bg-accent active:bg-accent transition-colors"
                      >
                        <ItemIcon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="mt-2 pt-2 border-t border-border">
            <p className="px-5 mb-1 text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
              Sistema
            </p>
            {SYSTEM_ITEMS.map((it) => {
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 h-10 px-5 text-[14px] text-foreground hover:bg-accent transition-colors"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileTopbar() {
  const { pathname } = useLocation();
  const m = findActiveModule(pathname);
  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-border bg-background sticky top-0 z-40">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-display font-bold text-primary text-[15px]">Æ</span>
        <span className="text-2xs text-muted-foreground/70">/</span>
        <span className="text-[13px] font-medium text-foreground truncate">{m.label}</span>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  );
}

function MobileBottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-14 border-t border-border bg-background/95 backdrop-blur-md flex items-stretch">
      {PRIMARY.map((it) => {
        const Icon = it.icon;
        const active = it.match(pathname);
        return (
          <Link
            key={it.id}
            to={it.to}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
            <span className="text-[10px] font-medium">{it.label}</span>
          </Link>
        );
      })}
      <MoreSheet />
    </nav>
  );
}

export function MobileShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  if (pathname === "/crm/whatsapp") return <MobileWhatsApp />;
  const isFullHeight = pathname === "/assistente-ia";

  return (
    <div className={cn("flex flex-col w-full bg-background", isFullHeight ? "h-screen" : "min-h-screen")}>
      <MobileTopbar />
      <main className={cn("flex-1", isFullHeight ? "overflow-hidden flex flex-col" : "overflow-y-auto pb-16")}>
        <div className={cn(isFullHeight ? "flex-1 flex flex-col min-h-0" : "px-4 py-4")}>
          {children}
        </div>
      </main>
      {!isFullHeight && <MobileBottomNav />}
    </div>
  );
}
