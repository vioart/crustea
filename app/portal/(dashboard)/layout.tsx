import { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

type PortalLayoutProps = {
  children: ReactNode;
};

export default function PortalLayout({
  children,
}: PortalLayoutProps) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}