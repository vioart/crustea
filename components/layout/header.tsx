"use client";

import React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  ChevronDown,
  Code2,
  Cpu,
  FileText,
  Globe2,
  Handshake,
  HelpCircle,
  Layers3,
  Package,
  RotateCcw,
  Shield,
  ShoppingCart,
  Sprout,
  Star,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export default function Header() {
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const [language, setLanguage] = React.useState<"id" | "en">("id");

  const scrolled = useScroll(10);

  const isHomePage = pathname === "/";
  const isSolid = !isHomePage || scrolled;

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const chooseLanguage = (value: "id" | "en") => {
    setLanguage(value);
    setLanguageOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all duration-300",
          isSolid
            ? "border-border bg-background/95 shadow-sm backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          {/* =====================================================
              LOGO
          ===================================================== */}
          <Link href="/" className="flex items-center" aria-label="Crustea">
            <img
              src={isSolid ? "/logo.svg" : "/logo.svg"}
              alt="Crustea logo"
              className="h-9 w-auto object-contain transition-opacity duration-300"
            />
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {/* -------------------------------------------------
                  BERANDA
              ------------------------------------------------- */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className={cn(
                      "inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      isSolid
                        ? "text-foreground hover:bg-accent"
                        : "text-white hover:bg-white/10",
                    )}
                  >
                    Beranda
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* -------------------------------------------------
                  PRODUK
              ------------------------------------------------- */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "!bg-transparent",
                    isSolid
                      ? "text-foreground hover:bg-accent"
                      : "!text-white hover:!bg-white/10 hover:!text-white",
                  )}
                >
                  Produk
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="grid w-[760px] grid-cols-[1fr_210px] gap-2 p-3">
                    {/* Product Links */}
                    <ul className="grid grid-cols-2 gap-1">
                      {productLinks.map((item) => (
                        <ListItem key={item.title} {...item} />
                      ))}
                    </ul>

                    {/* Product Highlight */}
                    <div className="flex flex-col justify-between rounded-md bg-secondary p-5">
                      <div>
                        <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                          <Layers3 className="size-5" />
                        </div>

                        <p className="font-display text-lg font-semibold text-secondary-foreground">
                          Solusi Akuakultur Crustea
                        </p>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Teknologi dan solusi terintegrasi untuk mendukung
                          kebutuhan budidaya dan bisnis akuakultur.
                        </p>
                      </div>

                      <p className="mt-7 text-sm text-muted-foreground">
                        Ingin mengetahui lebih lanjut?{" "}
                        <a
                          href="/kontak"
                          className="font-medium text-foreground underline underline-offset-4"
                        >
                          Hubungi kami
                        </a>
                      </p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* -------------------------------------------------
                  TENTANG KAMI
                  Menggunakan struktur Company dari template awal
              ------------------------------------------------- */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "!bg-transparent",
                    isSolid
                      ? "text-foreground hover:bg-accent"
                      : "!text-white hover:!bg-white/10 hover:!text-white",
                  )}
                >
                  Tentang Kami
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="grid w-[620px] grid-cols-[1fr_210px] gap-2 p-3">
                    {/* Company Links - kiri */}
                    <ul className="space-y-1">
                      {companyLinks.map((item) => (
                        <ListItem key={item.title} {...item} />
                      ))}
                    </ul>

                    {/* Company Links - kanan */}
                    <ul className="rounded-md bg-secondary p-2">
                      {companyLinks2.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <a
                              href={item.href}
                              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-background"
                            >
                              <item.icon className="size-4 text-muted-foreground" />
                              {item.title}
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* -------------------------------------------------
                  BERITA
              ------------------------------------------------- */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/berita"
                    className={cn(
                      "inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      isSolid
                        ? "text-foreground hover:bg-accent"
                        : "text-white hover:bg-white/10",
                    )}
                  >
                    Berita
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* -------------------------------------------------
                  KONTAK
              ------------------------------------------------- */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/kontak"
                    className={cn(
                      "inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      isSolid
                        ? "text-foreground hover:bg-accent"
                        : "text-white hover:bg-white/10",
                    )}
                  >
                    Kontak
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* =====================================================
              DESKTOP ACTIONS
          ===================================================== */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Language */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setLanguageOpen((current) => !current)}
                aria-expanded={languageOpen}
                aria-label="Pilih bahasa"
                className={cn(
                  isSolid
                    ? "text-foreground hover:bg-accent"
                    : "text-white hover:bg-white/10 hover:text-white",
                )}
              >
                <Globe2 className="size-4" />

                {language === "id" ? "ID" : "EN"}

                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    languageOpen && "rotate-180",
                  )}
                />
              </Button>

              {languageOpen ? (
                <div className="absolute right-0 top-11 w-44 rounded-md border border-border bg-popover p-1.5 text-popover-foreground shadow-lg">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => chooseLanguage("id")}
                    className={cn(
                      "w-full justify-between shadow-none",
                      language === "id" && "bg-accent font-semibold",
                    )}
                  >
                    Indonesia
                    <span className="text-xs text-muted-foreground">ID</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => chooseLanguage("en")}
                    className={cn(
                      "w-full justify-between shadow-none",
                      language === "en" && "bg-accent font-semibold",
                    )}
                  >
                    English
                    <span className="text-xs text-muted-foreground">EN</span>
                  </Button>
                </div>
              ) : null}
            </div>

            {/* CTA */}
            <Button asChild>
              <a
                href="https://wa.me/6282140773592"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hubungi Kami
              </a>
            </Button>
          </div>

          {/* =====================================================
              MOBILE MENU BUTTON
          ===================================================== */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((current) => !current)}
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            <MenuToggleIcon open={open} />
          </Button>
        </div>
      </header>

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}
      <MobileMenu open={open} id="mobile-menu">
        <nav
          className="flex flex-1 flex-col overflow-y-auto px-5 pb-5 pt-28"
          aria-label="Navigasi utama"
        >
          {/* Beranda */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center border-b border-border py-4 text-sm font-semibold text-foreground"
          >
            Beranda
          </Link>

          {/* Produk */}
          <p className="mb-3 mt-8 text-xs font-semibold uppercase text-muted-foreground">
            Produk
          </p>

          {productLinks.map((link) => (
            <MobileLink
              key={link.title}
              item={link}
              onClick={() => setOpen(false)}
            />
          ))}

          {/* Tentang Kami */}
          <p className="mb-3 mt-8 text-xs font-semibold uppercase text-muted-foreground">
            Tentang Kami
          </p>

          {companyLinks.map((link) => (
            <MobileLink
              key={link.title}
              item={link}
              onClick={() => setOpen(false)}
            />
          ))}

          {companyLinks2.map((link) => (
            <MobileLink
              key={link.title}
              item={link}
              onClick={() => setOpen(false)}
              compact
            />
          ))}

          {/* Artikel */}
          <a
            href="/artikel"
            onClick={() => setOpen(false)}
            className="mt-8 flex items-center border-b border-border py-4 text-sm font-semibold text-foreground"
          >
            Artikel
          </a>

          {/* Kontak */}
          <a
            href="/kontak"
            onClick={() => setOpen(false)}
            className="flex items-center border-b border-border py-4 text-sm font-semibold text-foreground"
          >
            Kontak
          </a>

          {/* Bahasa */}
          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
              Bahasa
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => chooseLanguage("id")}
                className={cn(language === "id" && "border-primary bg-accent")}
              >
                Indonesia
                <span className="ml-auto text-xs text-muted-foreground">
                  ID
                </span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => chooseLanguage("en")}
                className={cn(language === "en" && "border-primary bg-accent")}
              >
                English
                <span className="ml-auto text-xs text-muted-foreground">
                  EN
                </span>
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile CTA */}
        <div className="border-t border-border p-5">
          <Button className="w-full" onClick={() => setOpen(false)} asChild>
            <a href="/kontak">Hubungi Kami</a>
          </Button>
        </div>
      </MobileMenu>
    </>
  );
}

/* =========================================================
   MOBILE MENU
   ========================================================= */

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-40 flex flex-col bg-background md:hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}

/* =========================================================
   DESKTOP DROPDOWN ITEM
   ========================================================= */

function ListItem({
  title,
  description,
  icon: Icon,
  className,
  href,
  ...props
}: LinkItem & React.ComponentProps<"li">) {
  return (
    <li className={className} {...props}>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className="flex gap-3 rounded-md p-3 transition-colors hover:bg-accent focus:bg-accent"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Icon className="size-4" />
          </span>

          <span>
            <span className="block text-sm font-semibold text-foreground">
              {title}
            </span>

            {description && (
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                {description}
              </span>
            )}
          </span>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

/* =========================================================
   MOBILE LINK
   ========================================================= */

function MobileLink({
  item,
  onClick,
  compact = false,
}: {
  item: LinkItem;
  onClick: () => void;
  compact?: boolean;
}) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 border-b border-border py-4",
        compact && "py-3",
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
        <Icon className="size-4" />
      </span>

      <span>
        <span className="block text-sm font-semibold text-foreground">
          {item.title}
        </span>

        {!compact && item.description && (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {item.description}
          </span>
        )}
      </span>
    </a>
  );
}

/* =========================================================
   PRODUCT MENU
   ========================================================= */

const productLinks: LinkItem[] = [
  {
    title: "Hardware Teknologi",
    href: "/produk/hardware-teknologi",
    description: "Teknologi perangkat untuk mendukung kebutuhan akuakultur.",
    icon: Cpu,
  },
  {
    title: "Software",
    href: "/produk/software",
    description: "Solusi perangkat lunak untuk membantu pengelolaan bisnis.",
    icon: Code2,
  },
  {
    title: "Produk Olahan - Krasty",
    href: "/produk/produk-olahan",
    description: "Produk olahan hasil perikanan dengan cita rasa khas.",
    icon: Package,
  },
  {
    title: "Trading",
    href: "/produk/trading",
    description: "Solusi perdagangan dan distribusi produk akuakultur.",
    icon: ShoppingCart,
  },
  {
    title: "Aquagrowth",
    href: "/produk/aquagrowth",
    description: "Solusi untuk mendukung pertumbuhan dan pengembangan usaha.",
    icon: Sprout,
  },
  {
    title: "Kemitraan",
    href: "/produk/kemitraan",
    description: "Peluang kolaborasi dan kemitraan bersama Crustea.",
    icon: Handshake,
  },
  {
    title: "Kalkulator Budidaya",
    href: "/produk/kalkulator-budidaya",
    description: "Alat bantu perhitungan untuk kebutuhan budidaya.",
    icon: Calculator,
  },
];

/* =========================================================
   TENTANG KAMI
   Struktur ini sengaja mengikuti COMPANY dari template awal
   ========================================================= */

const companyLinks: LinkItem[] = [
  {
    title: "Tentang Kami",
    href: "/tentang-kami",
    description: "Mengenal lebih dekat Crustea, perjalanan, dan tim kami.",
    icon: Users,
  },
  {
    title: "Kemitraan",
    href: "/produk/kemitraan",
    description: "Kolaborasi dan peluang kemitraan bersama Crustea.",
    icon: Handshake,
  },
];

const companyLinks2: LinkItem[] = [
  {
    title: "Syarat & Ketentuan",
    href: "/syarat-ketentuan",
    icon: FileText,
  },
  {
    title: "Kebijakan Privasi",
    href: "/kebijakan-privasi",
    icon: Shield,
  },
  {
    title: "FAQ",
    href: "/faq",
    icon: HelpCircle,
  },
];

/* =========================================================
   SCROLL DETECTION
   ========================================================= */

function useScroll(threshold: number) {
  const subscribe = React.useCallback((callback: () => void) => {
    window.addEventListener("scroll", callback, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", callback);
    };
  }, []);

  const getSnapshot = React.useCallback(() => {
    return window.scrollY > threshold;
  }, [threshold]);

  const getServerSnapshot = React.useCallback(() => {
    return false;
  }, []);

  return React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}
