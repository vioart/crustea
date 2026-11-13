"use client";

import { Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

type AkuaturDestination = {
  id: string;
  city: string;
  name: string;
  is_active: boolean;
};

type AkuaturPackage = {
  id: string;
  destination_id: string | null;
  title: string;
  category: "regular" | "group";
  duration: string;
  participants: string;
  price: string;
  price_note: string | null;
  sort_order: number;
  is_active: boolean;
};

type PriceTableSectionProps = {
  packages: AkuaturPackage[];
  destinations: AkuaturDestination[];
};

function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  icon: typeof Wallet;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-4 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
        <Icon
          className="size-5 text-primary"
          strokeWidth={2}
          aria-hidden="true"
        />
        {eyebrow}
      </p>

      <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[40px]">
        {title}
        {highlight && (
          <span className="mt-1 block text-primary">{highlight}</span>
        )}
      </h2>

      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
          {description}
        </p>
      )}
    </div>
  );
}

export default function PriceTableSection({
  packages,
  destinations,
}: PriceTableSectionProps) {
  const t = useTranslations("Akuatur.priceTable");

  function getDestinationById(destinationId: string | null) {
    if (!destinationId) return null;

    return (
      destinations.find(
        (destination) =>
          destination.id === destinationId && destination.is_active,
      ) ?? null
    );
  }

  return (
    <section id="harga" className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("heading")}
          highlight={t("headingHighlight")}
          description={t("description")}
          icon={Wallet}
        />

        <div className="mt-12 overflow-hidden rounded-[24px] border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-secondary">
                <tr className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                  <th className="px-6 py-5">{t("columns.program")}</th>
                  <th className="px-6 py-5">{t("columns.destination")}</th>
                  <th className="px-6 py-5">{t("columns.city")}</th>
                  <th className="px-6 py-5">{t("columns.duration")}</th>
                  <th className="px-6 py-5">{t("columns.participants")}</th>
                  <th className="px-6 py-5">{t("columns.price")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {packages
                  .filter((item) => item.is_active)
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((item) => {
                    const destination = getDestinationById(item.destination_id);

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors hover:bg-secondary/40 ${
                          item.category === "group" ? "bg-orange-50/50" : ""
                        }`}
                      >
                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-foreground">
                            {item.title}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-muted-foreground">
                          {destination?.name ?? t("fallback.destination")}
                        </td>

                        <td className="px-6 py-5 text-sm text-muted-foreground">
                          {destination?.city ?? t("fallback.city")}
                        </td>

                        <td className="px-6 py-5 text-sm text-muted-foreground">
                          {item.duration}
                        </td>

                        <td className="px-6 py-5 text-sm text-muted-foreground">
                          {item.participants}
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-brand-dark">
                            {item.price}
                          </p>

                          {item.price_note && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.price_note}
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-border bg-secondary/50 px-5 py-4 sm:px-6">
            <p className="text-xs leading-6 text-muted-foreground">
              {t("footerNote")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
