import { cn } from "@/lib/utils";

interface StatProps {
  label: string;
  value: string | number;
  delta?: { value: number; suffix?: string };
  hint?: string;
  className?: string;
}

export function Stat({ label, value, delta, hint, className }: StatProps) {
  const positive = delta && delta.value >= 0;
  return (
    <div className={cn("flex flex-col gap-1 p-4 border border-border bg-card", className)}>
      <p className="text-2xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-2xl font-display font-semibold text-foreground tabular leading-none">{value}</p>
      <div className="flex items-center gap-2 text-xs mt-0.5">
        {delta && (
          <span className={cn("tabular font-medium", positive ? "text-success" : "text-destructive")}>
            {positive ? "▲" : "▼"} {Math.abs(delta.value).toFixed(1)}{delta.suffix ?? "%"}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
  className?: string;
}

export function SectionHeader({ title, description, actions, eyebrow, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4 pb-3 mb-4 border-b border-border", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="text-xl font-display font-semibold text-foreground">{title}</h1>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

export function Toolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 h-10 px-3 border-b border-border bg-surface-1", className)}>
      {children}
    </div>
  );
}
