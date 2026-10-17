import { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardSessionGuard from "@/components/auth/dashboard-session-guard";

type PortalLayoutProps = {
  children: ReactNode;
};

export default function PortalLayout({
  children,
}: PortalLayoutProps) {
  return (
    <AuthGuard>
      <DashboardSessionGuard />
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}