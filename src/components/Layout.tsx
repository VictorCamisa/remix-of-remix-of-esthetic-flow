import { useIsMobile } from "@/hooks/use-mobile";
import { AppShell } from "@/components/shell/AppShell";
import { MobileShell } from "@/components/mobile/MobileShell";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  return isMobile ? <MobileShell>{children}</MobileShell> : <AppShell>{children}</AppShell>;
}
