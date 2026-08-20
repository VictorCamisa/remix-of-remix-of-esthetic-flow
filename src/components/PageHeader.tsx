import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  /** The page's primary CTA (e.g. "Novo Paciente") always goes here, never elsewhere on the page. */
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  eyebrow?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  children,
  eyebrow,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-between gap-4 pb-3 mb-5 border-b border-border",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="text-xl font-display font-semibold text-foreground tracking-tight">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>

      {(actions || children) && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}
