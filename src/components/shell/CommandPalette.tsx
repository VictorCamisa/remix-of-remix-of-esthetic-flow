import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { MODULES, SYSTEM_ITEMS } from "./nav-config";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();

  const go = (to: string) => {
    onOpenChange(false);
    navigate(to);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar página, módulo ou ação…" />
      <CommandList>
        <CommandEmpty>Nenhum resultado.</CommandEmpty>
        {MODULES.map((m) => (
          <CommandGroup key={m.id} heading={m.label}>
            {m.groups.flatMap((g) => g.items).map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem key={item.to} onSelect={() => go(item.to)} value={`${m.label} ${item.label}`}>
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Sistema">
          {SYSTEM_ITEMS.map((it) => {
            const Icon = it.icon;
            return (
              <CommandItem key={it.to} onSelect={() => go(it.to)}>
                <Icon className="h-4 w-4 mr-2" />
                {it.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return { open, setOpen };
}
