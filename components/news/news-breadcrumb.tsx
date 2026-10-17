"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

type NewsBreadcrumbProps = {
  title: string;
};

export default function NewsBreadcrumb({
  title,
}: NewsBreadcrumbProps) {
  const t = useTranslations("DetailNews.breadcrumb");

  return (
    <section className="bg-background pt-18">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:py-7 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-brand-secondary"
              >
                {t("home")}
              </Link>
            </li>

            <li aria-hidden="true">
              <ChevronRight className="size-4 text-muted-foreground/60" />
            </li>

            <li>
              <Link
                href="/berita"
                className="text-muted-foreground transition-colors hover:text-brand-secondary"
              >
                {t("news")}
              </Link>
            </li>

            <li aria-hidden="true">
              <ChevronRight className="size-4 text-muted-foreground/60" />
            </li>

            <li
              className="min-w-0 max-w-full font-medium text-foreground"
              aria-current="page"
            >
              <span className="line-clamp-1">{title}</span>
            </li>
          </ol>
        </nav>
      </div>
    </section>
  );
}