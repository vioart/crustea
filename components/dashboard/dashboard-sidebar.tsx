"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
  Handshake,
  UserRound,
  X,
} from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";
import { clearAuth } from "@/lib/auth";

type DashboardSidebarProps = {
  open?: boolean;
  onClose?: () => void;
  onExpand?: () => void;
};

const menuItems = [
  {
    key: "dashboard",
    href: "/portal",
    icon: LayoutDashboard,
  },
  {
    key: "news",
    icon: FileText,
    children: [
      {
        key: "category",
        href: "/portal/berita/kategori",
      },
      {
        key: "post",
        href: "/portal/berita/post",
      },
    ],
  },
  {
    key: "products",
    icon: Package,
    children: [
      {
        key: "technology",
        href: "/portal/produk/teknologi-budidaya",
      },
      {
        key: "krasty",
        href: "/portal/produk/krasty",
      },
      {
        key: "trading",
        href: "/portal/produk/trading",
      },
    ],
  },
  {
    key: "partnerships",
    icon: Handshake,
    children: [
      {
        key: "partnerList",
        href: "/portal/partners",
      },
      {
        key: "partnershipProjects",
        href: "/portal/partnership-projects",
      },
    ],
  },
  {
    key: "faq",
    href: "/portal/faq",
    icon: HelpCircle,
  },
  {
    key: "team",
    href: "/portal/team",
    icon: UserRound,
  },
  {
    key: "users",
    href: "/portal/users",
    icon: Users,
  },
];

const translations = {
  id: {
    dashboard: "Dashboard",
    news: "Berita",
    category: "Kategori",
    post: "Post",
    products: "Produk",
    technology: "Teknologi Budidaya",
    krasty: "Krasty",
    trading: "Trading",
    partnerships: "Kemitraan",
    partnerList: "Daftar Partner",
    partnershipProjects: "Proyek Kemitraan",
    faq: "FAQ",
    users: "Pengguna",
    team: "Tim",
    menu: "Menu",
    system: "Sistem",
    website: "Website",
    logout: "Keluar",
    closeSidebar: "Tutup sidebar",
    closeMenu: "Tutup menu",
    logoutTitle: "Keluar Dari Akun?",
    logoutDescription: "Apakah Anda yakin ingin keluar dari akun saat ini?",
    cancel: "Batal",
    confirmLogout: "Ya, Keluar",
  },
  en: {
    dashboard: "Dashboard",
    news: "News",
    category: "Categories",
    post: "Posts",
    products: "Products",
    technology: "Aquaculture Technology",
    krasty: "Krasty",
    trading: "Trading",
    partnerships: "Partnerships",
    partnerList: "Partner List",
    partnershipProjects: "Partnership Projects",
    faq: "FAQ",
    users: "Users",
    team: "Team",
    menu: "Menu",
    system: "System",
    website: "Website",
    logout: "Logout",
    closeSidebar: "Close sidebar",
    closeMenu: "Close menu",
    logoutTitle: "Log Out of Account?",
    logoutDescription:
      "Are you sure you want to log out of your current account?",
    cancel: "Cancel",
    confirmLogout: "Yes, Log Out",
  },
};

export default function DashboardSidebar({
  open = false,
  onClose,
  onExpand,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { language } = useLanguage();
  const t = translations[language];

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    news: pathname.startsWith("/portal/berita"),
    products: pathname.startsWith("/portal/produk"),
  });

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const toggleMenu = (key: string) => {
    setExpandedMenus((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const getTitle = (key: string) => {
    return t[key as keyof typeof t];
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogout = () => {
    clearAuth();
    setLogoutModalOpen(false);
    router.replace("/portal/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <button
          type="button"
          aria-label={t.closeSidebar}
          onClick={onClose}
          className="fixed inset-0 z-[190] bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[200] flex flex-col border-r border-border bg-background transition-[width,transform] duration-300 ${
          open
            ? "w-[250px] translate-x-0"
            : "w-[250px] -translate-x-full lg:w-[72px] lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div
          className={`flex h-16 shrink-0 items-center ${
            open ? "justify-between px-5" : "justify-center px-3"
          }`}
        >
          <Link
            href="/portal"
            className={`flex items-center ${
              open ? "w-full" : "justify-center"
            }`}
          >
            {open ? (
              <Image
                src="/logo.svg"
                alt="Crustea"
                width={140}
                height={40}
                priority
                className="h-9 w-auto object-contain"
              />
            ) : (
              <Image
                src="/favicon.svg"
                alt="Crustea"
                width={36}
                height={36}
                priority
                className="size-9 object-contain"
              />
            )}
          </Link>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            aria-label={t.closeMenu}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {/* Menu Label */}
          <p
            className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground transition-all duration-300 ${
              open ? "opacity-100" : "h-0 overflow-hidden opacity-0"
            }`}
          >
            {t.menu}
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const title = getTitle(item.key);
              const hasChildren = "children" in item && item.children;

              {
                /* Menu dengan submenu */
              }
              if (hasChildren) {
                const isParentActive = item.children.some((child) =>
                  pathname.startsWith(child.href),
                );

                const isExpanded = expandedMenus[item.key] ?? false;

                return (
                  <div key={item.key}>
                    {/* Parent Menu */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!open) {
                          setExpandedMenus((current) => ({
                            ...current,
                            [item.key]: true,
                          }));

                          onExpand?.();
                          return;
                        }

                        toggleMenu(item.key);
                      }}
                      title={!open ? title : undefined}
                      className={`group flex h-10 w-full items-center rounded-lg text-[13px] font-medium transition-all duration-200 ${
                        open ? "gap-3 px-3" : "justify-center px-0"
                      } ${
                        isParentActive
                          ? "bg-brand-dark text-white shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className={`size-[17px] shrink-0 ${
                          isParentActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />

                      {/* Parent Text */}
                      <span
                        className={`whitespace-nowrap transition-all duration-300 ${
                          open ? "w-auto opacity-100" : "hidden w-0 opacity-0"
                        }`}
                      >
                        {title}
                      </span>

                      {/* Arrow */}
                      {open && (
                        <ChevronRight
                          className={`ml-auto size-3.5 text-primary transition-transform duration-200 ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Submenu */}
                    {open && isExpanded && (
                      <div className="ml-5 mt-1 space-y-1 border-l border-border pl-3">
                        {item.children.map((child) => {
                          const isChildActive =
                            pathname === child.href ||
                            pathname.startsWith(`${child.href}/`);

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className={`flex min-h-9 items-center rounded-lg px-3 text-[12px] font-medium transition-colors ${
                                isChildActive
                                  ? "bg-accent text-brand-dark"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              <span
                                className={`mr-2 size-1.5 shrink-0 rounded-full ${
                                  isChildActive
                                    ? "bg-brand-secondary"
                                    : "bg-muted-foreground/50"
                                }`}
                              />

                              <span>{getTitle(child.key)}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              {
                /* Menu tanpa submenu */
              }
              const isActive =
                item.href === "/portal"
                  ? pathname === "/portal"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  title={!open ? title : undefined}
                  className={`group flex h-10 items-center rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    open ? "gap-3 px-3" : "justify-center px-0"
                  } ${
                    isActive
                      ? "bg-brand-dark text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`size-[17px] shrink-0 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />

                  {/* Menu Text */}
                  <span
                    className={`whitespace-nowrap transition-all duration-300 ${
                      open ? "w-auto opacity-100" : "hidden w-0 opacity-0"
                    }`}
                  >
                    {title}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-border" />

          {/* System Label */}
          <p
            className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground transition-all duration-300 ${
              open ? "opacity-100" : "h-0 overflow-hidden opacity-0"
            }`}
          >
            {t.system}
          </p>

          {/* Website */}
          <Link
            href="/"
            title={!open ? t.website : undefined}
            className={`group flex h-10 items-center rounded-lg text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${
              open ? "gap-3 px-3" : "justify-center px-0"
            }`}
          >
            <BarChart3 className="size-[17px] shrink-0" />

            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                open ? "w-auto opacity-100" : "hidden w-0 opacity-0"
              }`}
            >
              {t.website}
            </span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-border p-3">
          <button
            type="button"
            onClick={handleLogoutClick}
            title={!open ? t.logout : undefined}
            className={`group flex h-10 w-full items-center rounded-lg text-[13px] font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 ${
              open ? "gap-3 px-3" : "justify-center px-0"
            }`}
          >
            <LogOut className="size-[17px] shrink-0" />

            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                open ? "w-auto opacity-100" : "hidden w-0 opacity-0"
              }`}
            >
              {t.logout}
            </span>
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sidebar-logout-title"
            className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Icon */}
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <LogOut className="size-7" />
            </div>

            {/* Content */}
            <div className="mt-4 text-center">
              <h3
                id="sidebar-logout-title"
                className="text-xl font-bold text-foreground"
              >
                {t.logoutTitle}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.logoutDescription}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="flex h-11 items-center justify-center rounded-lg border border-border text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
              >
                {t.cancel}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-red-500 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                <LogOut className="size-4" />
                {t.confirmLogout}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
