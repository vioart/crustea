"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, MessageCircle } from "lucide-react";
import { useState } from "react";

export type ProductDetailData = {
  name: string;
  category: string;
  categoryHref: string;
  description: string;
  images: string[];
  highlights: string[];
  specifications?: {
    label: string;
    value: string;
  }[];
};

type ProductDetailProps = {
  product: ProductDetailData;
};

const WHATSAPP_NUMBER = "6282140773592";

export default function ProductDetail({ product }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0);

  const whatsappMessage = encodeURIComponent(
    `Halo Crustea, saya tertarik dengan produk ${product.name}. Saya ingin mendapatkan informasi lebih lanjut mengenai produk tersebut.`,
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <main className="bg-background">
      {/* Breadcrumb */}
      <section className="pt-18">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-brand-secondary"
                >
                  Beranda
                </Link>
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-muted-foreground/60" />
              </li>

              <li>
                <Link
                  href={product.categoryHref}
                  className="text-muted-foreground transition-colors hover:text-brand-secondary"
                >
                  {product.category}
                </Link>
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-muted-foreground/60" />
              </li>

              <li className="font-medium text-foreground" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Product Hero */}
      <section className="pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)] lg:gap-14">
            {/* Gallery */}
            <div className="flex items-start gap-3">
              {/* Main Image */}
              <div className="min-w-0 flex-1">
                <div className="overflow-hidden rounded-[28px] border border-border bg-muted shadow-sm">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.images[activeImage]}
                      alt={product.name}
                      fill
                      priority
                      className="object-cover transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex w-24 shrink-0 flex-col gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Lihat gambar ${index + 1}`}
                      className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted transition-all duration-300 ${
                        activeImage === index
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="self-start lg:pt-2">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                {product.category}
              </p>

              <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-brand-dark sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-6 h-px w-16 bg-primary" />

              <p className="mt-6 text-[15px] leading-7 text-muted-foreground">
                {product.description}
              </p>

              {/* CTA */}
              <div className="mt-8">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <MessageCircle className="size-5" />
                  Konsultasikan Produk
                </a>
              </div>

              <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
                Hubungi tim Crustea untuk informasi produk dan kebutuhan
                budidaya Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      {product.highlights.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                Keunggulan
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-dark sm:text-4xl">
                Dirancang untuk Kebutuhan Akuakultur
              </h2>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-start gap-4 rounded-[20px] border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-dark">
                    <Check className="size-5" />
                  </span>

                  <p className="pt-2 text-sm font-medium leading-5 text-foreground">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <section className="bg-muted/40 py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                Informasi Produk
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-dark sm:text-4xl">
                Spesifikasi
              </h2>
            </div>

            <div className="mt-10 overflow-hidden rounded-[24px] border border-border bg-card shadow-sm">
              <div className="divide-y divide-border">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="grid gap-2 px-6 py-5 sm:grid-cols-2"
                  >
                    <p className="text-sm font-medium text-muted-foreground">
                      {spec.label}
                    </p>

                    <p className="text-sm font-semibold text-brand-dark sm:text-right">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
