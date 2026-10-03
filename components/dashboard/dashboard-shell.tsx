"use client";

import { ReactNode, useState } from "react";
import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import LanguageProvider from "@/components/language/language-provider";

type DashboardShellProps = {
  children: ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-muted/30">
        <DashboardSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div
          className={`min-h-screen transition-[margin] duration-300 ${
            sidebarOpen ? "lg:ml-[250px]" : "lg:ml-[72px]"
          }`}
        >
          <DashboardHeader
            onMenuClick={() => setSidebarOpen((value) => !value)}
          />

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </LanguageProvider>
  );
}
