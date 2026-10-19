"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
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
  Shield,
  ShoppingCart,
  Sprout,
  Users,
  Route,
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
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Header");

  const language = locale === "en" ? "en" : "id";

  const [open, setOpen] = React.useState(false);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] =
    React.useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] =
    React.useState(false);

  const chooseLanguage = (value: "id" | "en") => {
    setLanguageOpen(false);
    setOpen(false);

    if (value === language) return;

    router.replace(pathname, { locale: value });
  };

  const scrolled = useScroll(10);
  const isHomePage = pathname === "/";
  const isSolid = !isHomePage || scrolled;

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const productLinks: LinkItem[] = [
    {
      title: t("productsList.hardware.title"),
      href: "/produk/hardware-teknologi",
      description: t("productsList.hardware.description"),
      icon: Cpu,
    },
    {
      title: t("productsList.software.title"),
      href: "/produk/software",
      description: t("productsList.software.description"),
      icon: Code2,
    },
    {
      title: t("productsList.processedProduct.title"),
      href: "/produk/produk-olahan",
      description: t("productsList.processedProduct.description"),
      icon: Package,
    },
    {
      title: t("productsList.aquagrowth.title"),
      href: "/produk/aquagrowth",
      description: t("productsList.aquagrowth.description"),
      icon: Sprout,
    },
    {
      title: t("productsList.calculator.title"),
      href: "/produk/kalkulator-budidaya",
      description: t("productsList.calculator.description"),
      icon: Calculator,
    },
  ];

  const companyLinks: LinkItem[] = [
    {
      title: t("companyLinks.about.title"),
      href: "/tentang-kami",
      description: t("companyLinks.about.description"),
      icon: Users,
    },
    {
      title: t("companyLinks.roadmap.title"),
      href: "/roadmap-sertifikasi",
      description: t("companyLinks.roadmap.description"),
      icon: Route,
    },
  ];

  const companyLinks2: LinkItem[] = [
    {
      title: t("companyLinks.terms"),
      href: "/syarat-ketentuan",
      icon: FileText,
    },
    {
      title: t("companyLinks.privacy"),
      href: "/kebijakan-privasi",
      icon: Shield,
    },
    {
      title: t("companyLinks.faq"),
      href: "/faq",
      icon: HelpCircle,
    },
  ];

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
          {/* Logo: transisi dari putih ke logo normal */}
          <Link
            href="/"
            className="grid items-center"
            aria-label="Crustea"
          >
            <img
              src="/logo-white.png"
              alt="Crustea logo"
              aria-hidden={isSolid}
              className={cn(
                "col-start-1 row-start-1 h-9 w-auto object-contain transition-opacity duration-300",
                isSolid ? "opacity-0" : "opacity-100",
              )}
            />

            <img
              src="/logo.svg"
              alt="Crustea logo"
              aria-hidden={!isSolid}
              className={cn(
                "col-start-1 row-start-1 h-9 w-auto object-contain transition-opacity duration-300",
                isSolid ? "opacity-100" : "opacity-0",
              )}
            />
          </Link>

          {/* Navigasi desktop: tidak diubah */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
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
                    {t("home")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "!bg-transparent",
                    isSolid
                      ? "text-foreground hover:bg-accent"
                      : "!text-white hover:!bg-white/10 hover:!text-white",
                  )}
                >
                  {t("products")}
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="grid w-[760px] grid-cols-[1fr_210px] gap-2 p-3">
                    <ul className="grid grid-cols-2 gap-1">
                      {productLinks.map((item) => (
                        <ListItem key={item.href} {...item} />
                      ))}
                    </ul>

                    <div className="flex flex-col justify-between rounded-md bg-secondary p-5">
                      <div>
                        <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                          <Layers3 className="size-5" />
                        </div>

                        <p className="font-display text-lg font-semibold text-secondary-foreground">
                          {t("productSolutionTitle")}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {t("productSolutionDescription")}
                        </p>
                      </div>

                      <p className="mt-7 text-sm text-muted-foreground">
                        {t("learnMore")}{" "}
                        <Link
                          href="/kontak"
                          className="font-medium text-foreground underline underline-offset-4"
                        >
                          {t("contactUsLink")}
                        </Link>
                      </p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "!bg-transparent",
                    isSolid
                      ? "text-foreground hover:bg-accent"
                      : "!text-white hover:!bg-white/10 hover:!text-white",
                  )}
                >
                  {t("about")}
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="grid w-[620px] grid-cols-[1fr_210px] gap-2 p-3">
                    <ul className="space-y-1">
                      {companyLinks.map((item) => (
                        <ListItem key={item.href} {...item} />
                      ))}
                    </ul>

                    <ul className="rounded-md bg-secondary p-2">
                      {companyLinks2.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-background"
                            >
                              <item.icon className="size-4 text-muted-foreground" />
                              {item.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

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
                    {t("news")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

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
                    {t("contact")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Pemilih bahasa desktop */}
          <div className="hidden items-center gap-2 md:flex">
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setLanguageOpen((current) => !current)}
                aria-expanded={languageOpen}
                aria-label={t("chooseLanguage")}
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

              {languageOpen && (
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
                    <span className="text-xs text-muted-foreground">
                      ID
                    </span>
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
                    <span className="text-xs text-muted-foreground">
                      EN
                    </span>
                  </Button>
                </div>
              )}
            </div>

            <Button asChild>
              <a
                href="https://wa.me/6282140773592"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("contactUs")}
              </a>
            </Button>
          </div>

          {/* Tombol menu mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((current) => !current)}
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            <MenuToggleIcon open={open} />
          </Button>
        </div>
      </header>

      {/* Navigasi mobile */}
      <MobileMenu open={open} id="mobile-menu">
        <nav
          className="flex flex-1 flex-col overflow-y-auto px-5 pb-5 pt-28"
          aria-label={t("mainNavigation")}
        >
          {/* Beranda */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center border-b border-border py-4 text-sm font-semibold text-foreground"
          >
            {t("home")}
          </Link>

          {/* Dropdown Produk: tanpa margin tambahan */}
          <div className="border-b border-border">
            <button
              type="button"
              onClick={() =>
                setMobileProductsOpen((current) => !current)
              }
              className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-foreground"
              aria-expanded={mobileProductsOpen}
              aria-controls="mobile-products-submenu"
            >
              <span>{t("products")}</span>

              <ChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200",
                  mobileProductsOpen && "rotate-180",
                )}
              />
            </button>

            {mobileProductsOpen && (
              <div id="mobile-products-submenu" className="pb-2 pl-2">
                {productLinks.map((link) => (
                  <MobileLink
                    key={link.href}
                    item={link}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Dropdown Tentang Kami */}
          <div className="border-b border-border">
            <button
              type="button"
              onClick={() =>
                setMobileAboutOpen((current) => !current)
              }
              className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-foreground"
              aria-expanded={mobileAboutOpen}
              aria-controls="mobile-about-submenu"
            >
              <span>{t("about")}</span>

              <ChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200",
                  mobileAboutOpen && "rotate-180",
                )}
              />
            </button>

            {mobileAboutOpen && (
              <div id="mobile-about-submenu" className="pb-2 pl-2">
                {companyLinks.map((link) => (
                  <MobileLink
                    key={link.href}
                    item={link}
                    onClick={() => setOpen(false)}
                  />
                ))}

                {companyLinks2.map((link) => (
                  <MobileLink
                    key={link.href}
                    item={link}
                    onClick={() => setOpen(false)}
                    compact
                  />
                ))}
              </div>
            )}
          </div>

          {/* Berita: tinggi dan padding konsisten */}
          <Link
            href="/berita"
            onClick={() => setOpen(false)}
            className="flex items-center border-b border-border py-4 text-sm font-semibold text-foreground"
          >
            {t("news")}
          </Link>

          {/* Kontak: tinggi dan padding konsisten */}
          <Link
            href="/kontak"
            onClick={() => setOpen(false)}
            className="flex items-center border-b border-border py-4 text-sm font-semibold text-foreground"
          >
            {t("contact")}
          </Link>

          {/* Pemilih bahasa mobile */}
          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
              {t("language")}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => chooseLanguage("id")}
                className={cn(
                  language === "id" && "border-primary bg-accent",
                )}
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
                className={cn(
                  language === "en" && "border-primary bg-accent",
                )}
              >
                English
                <span className="ml-auto text-xs text-muted-foreground">
                  EN
                </span>
              </Button>
            </div>
          </div>
        </nav>

        <div className="border-t border-border p-5">
          <Button className="w-full" onClick={() => setOpen(false)} asChild>
            <Link href="/kontak">{t("contactUs")}</Link>
          </Button>
        </div>
      </MobileMenu>
    </>
  );
}

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};

function MobileMenu({
  open,
  children,
  className,
  ...props
}: MobileMenuProps) {
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
        <Link
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
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

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
    <Link
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
    </Link>
  );
}

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

  const getServerSnapshot = React.useCallback(() => false, []);

  return React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}