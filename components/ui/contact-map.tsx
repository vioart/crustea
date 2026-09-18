import { ExternalLink, MapPin } from "lucide-react";

export default function ContactMap() {
  return (
    <section
      aria-labelledby="contact-map-title"
      className="border-t border-border bg-muted"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
              <MapPin
                className="size-5 text-primary"
                strokeWidth={2}
                aria-hidden="true"
              />
              Lokasi Kami
            </p>

            <h2
              id="contact-map-title"
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Temukan <span className="text-primary">Crustea Labs.</span>
            </h2>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Crustea+Labs+Semarang"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-dark transition-colors hover:text-brand-secondary"
          >
            Buka di Google Maps
            <ExternalLink className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-border bg-background">
          <iframe
            title="Lokasi Crustea Labs"
            src="https://www.google.com/maps?q=Crustea%20Labs%20Semarang&output=embed"
            className="h-[360px] w-full border-0 sm:h-[420px] lg:h-[480px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}