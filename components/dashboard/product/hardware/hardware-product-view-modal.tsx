"use client";

import { useEffect, useState } from "react";
import {
  Package,
  X,
  Image as ImageIcon,
  Star,
  ListChecks,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/components/language/language-provider";
import { getAuthToken } from "@/lib/auth";

type ProductImage = {
  id?: number;
  file_url?: string;
  image_url?: string;
  url?: string;
};

type ProductExcellence = {
  id?: number;
  title_idn: string;
  title_en: string;
};

type ProductSpecification = {
  id?: number;
  name_idn: string;
  name_en: string;
  value_idn: string;
  value_en: string;
};

type HardwareProduct = {
  id: number;
  category: string;
  slug: string;
  name_idn: string;
  name_en: string;
  description_idn: string;
  description_en: string;
  images?: ProductImage[];
  excellences?: ProductExcellence[];
  specifications?: ProductSpecification[];
  created_at?: string;
  updated_at?: string;
};

type HardwareProductViewModalProps = {
  open: boolean;
  product: HardwareProduct | null;
  onClose: () => void;
};

const translations = {
  id: {
    title: "Detail Produk Hardware",
    subtitle: "Informasi lengkap produk hardware.",
    images: "Gambar Produk",
    noImages: "Tidak ada gambar produk.",
    category: "Kategori",
    slug: "Slug",
    productName: "Nama Produk",
    productDescription: "Deskripsi Produk",
    excellences: "Keunggulan Produk",
    noExcellences: "Belum ada keunggulan produk.",
    specifications: "Spesifikasi Produk",
    noSpecifications: "Belum ada spesifikasi produk.",
    specificationName: "Spesifikasi",
    specificationValue: "Nilai",
    indonesian: "Bahasa Indonesia",
    english: "Bahasa Inggris",
    createdAt: "Dibuat pada",
    updatedAt: "Terakhir diperbarui",
    close: "Tutup",
    closeModal: "Tutup modal",
    notAvailable: "Belum tersedia",
    loading: "Memuat detail produk...",
    loadFailed: "Gagal memuat detail produk.",
    hardware: "Hardware",
  },
  en: {
    title: "Hardware Product Details",
    subtitle: "Complete hardware product information.",
    images: "Product Images",
    noImages: "No product images.",
    category: "Category",
    slug: "Slug",
    productName: "Product Name",
    productDescription: "Product Description",
    excellences: "Product Benefits",
    noExcellences: "No product benefits available.",
    specifications: "Product Specifications",
    noSpecifications: "No product specifications available.",
    specificationName: "Specification",
    specificationValue: "Value",
    indonesian: "Indonesian",
    english: "English",
    createdAt: "Created at",
    updatedAt: "Last updated",
    close: "Close",
    closeModal: "Close modal",
    notAvailable: "Not available",
    loading: "Loading product details...",
    loadFailed: "Failed to load product details.",
    hardware: "Hardware",
  },
};

function formatDate(value: string | undefined, fallback: string): string {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function getImageURL(image: ProductImage): string {
  return image.file_url || image.image_url || image.url || "";
}

function resolveImageURL(path: string): string {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const apiURL = process.env.NEXT_PUBLIC_API_URL || "";

  try {
    return new URL(path, apiURL).toString();
  } catch {
    return path;
  }
}

function normalizeProduct(
  base: HardwareProduct,
  raw: Record<string, unknown>,
): HardwareProduct {
  const nested = (
    raw.data && typeof raw.data === "object"
      ? raw.data
      : raw.product && typeof raw.product === "object"
        ? raw.product
        : raw
  ) as Record<string, unknown>;

  return {
    ...base,
    ...nested,
    id: Number(nested.id ?? base.id),

    images: getArray<ProductImage>(nested.images ?? nested.product_images),

    excellences: getArray<ProductExcellence>(
      nested.excellences ?? nested.product_excellences,
    ),

    specifications: getArray<ProductSpecification>(
      nested.specifications ?? nested.product_specifications,
    ),
  } as HardwareProduct;
}

export default function HardwareProductViewModal({
  open,
  product,
  onClose,
}: HardwareProductViewModalProps) {
  const { language } = useLanguage();

  const t = translations[language === "en" ? "en" : "id"];

  const [detail, setDetail] = useState<HardwareProduct | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!open || !product) return;

    const selectedProduct: HardwareProduct = product;

    let cancelled = false;

    async function fetchDetail() {
      // Menunda pembaruan state agar tidak dilakukan
      // secara langsung ketika effect mulai dijalankan.
      await Promise.resolve();

      if (cancelled) return;

      setLoading(true);
      setError("");
      setDetail(selectedProduct);
      setActiveImageIndex(0);
      setFailedImages([]);

      const token = getAuthToken();

      if (!token) {
        if (!cancelled) {
          setError(t.loadFailed);
          setLoading(false);
        }

        return;
      }

      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL;

        if (!apiURL) {
          throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
        }

        const response = await fetch(
          `${apiURL}/api/admin/products/${encodeURIComponent(selectedProduct.slug)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            typeof data.message === "string" ? data.message : t.loadFailed,
          );
        }

        if (cancelled) return;

        const normalized = normalizeProduct(
          selectedProduct,
          data as Record<string, unknown>,
        );

        if (normalized.category !== "hardware") {
          throw new Error(t.loadFailed);
        }

        setDetail(normalized);
        setError("");
      } catch (err) {
        if (cancelled) return;

        console.error("Fetch hardware product detail error:", err);

        setDetail(selectedProduct);

        setError(err instanceof Error ? err.message : t.loadFailed);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [open, product, t.loadFailed]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !product) {
    return null;
  }

  // Pastikan detail yang ditampilkan milik produk yang sedang dipilih.
  const current = detail?.id === product.id ? detail : product;

  const images = current.images ?? [];
  const excellences = current.excellences ?? [];
  const specifications = current.specifications ?? [];

  const activeImage = images[activeImageIndex];
  const activeImagePath = activeImage ? getImageURL(activeImage) : "";
  const activeImageSrc = resolveImageURL(activeImagePath);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hardware-product-modal-title"
        className="flex max-h-[calc(100vh-32px)] w-full max-w-[900px] flex-col overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-dark">
              <Package className="size-6" />
            </div>

            <div className="min-w-0">
              <h2
                id="hardware-product-modal-title"
                className="text-lg font-bold text-foreground"
              >
                {t.title}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {t.subtitle} #{product.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeModal}
            className="ml-4 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-7 overflow-y-auto px-6 py-6">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              {t.loading}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* 1. Gambar produk */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ImageIcon className="size-4" />
              {t.images}
            </h3>

            {images.length > 0 ? (
              <div className="space-y-3">
                {/* Gambar utama */}
                <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/20">
                  {activeImageSrc && !failedImages.includes(activeImageSrc) ? (
                    <img
                      key={activeImageSrc}
                      src={activeImageSrc}
                      alt={`${current.name_idn} ${activeImageIndex + 1}`}
                      className="h-[320px] w-full object-contain p-3 sm:h-[420px]"
                      onError={() => {
                        setFailedImages((previous) =>
                          previous.includes(activeImageSrc)
                            ? previous
                            : [...previous, activeImageSrc],
                        );
                      }}
                    />
                  ) : (
                    <div className="flex h-[320px] w-full items-center justify-center text-sm text-muted-foreground sm:h-[420px]">
                      <ImageIcon className="mr-2 size-5" />
                      {t.noImages}
                    </div>
                  )}
                </div>

                {/* Thumbnail horizontal */}
                <div
                  className="flex gap-3 overflow-x-auto pb-2"
                  aria-label={t.images}
                >
                  {images.map((image, index) => {
                    const path = getImageURL(image);
                    const src = resolveImageURL(path);
                    const isActive = index === activeImageIndex;
                    const isFailed = !src || failedImages.includes(src);

                    return (
                      <button
                        key={image.id ?? `${path}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        aria-label={`${t.images} ${index + 1}`}
                        aria-pressed={isActive}
                        className={`size-20 shrink-0 overflow-hidden rounded-lg border-2 bg-muted/20 transition-colors sm:size-24 ${
                          isActive
                            ? "border-brand-dark"
                            : "border-border hover:border-brand-dark/50"
                        }`}
                      >
                        {isFailed ? (
                          <span className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="size-5 text-muted-foreground" />
                          </span>
                        ) : (
                          <img
                            src={src}
                            alt={`${current.name_idn} thumbnail ${index + 1}`}
                            className="h-full w-full object-cover"
                            onError={() => {
                              setFailedImages((previous) =>
                                previous.includes(src)
                                  ? previous
                                  : [...previous, src],
                              );
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
                {t.noImages}
              </div>
            )}
          </section>

          {/* 2. Informasi utama */}
          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">
                  {t.category}
                </p>

                <span className="inline-flex rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-brand-dark">
                  {current.category || t.hardware}
                </span>
              </div>

              <div className="min-w-0">
                <p className="mb-2 text-sm font-semibold text-foreground">
                  {t.slug}
                </p>

                <span className="inline-flex max-w-full break-all rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-foreground">
                  {current.slug || "-"}
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {t.productName}
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-brand-dark">
                    ID
                  </span>

                  <p className="mt-3 break-words text-sm font-semibold leading-6 text-foreground">
                    {current.name_idn || "-"}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-brand-dark">
                    EN
                  </span>

                  <p className="mt-3 break-words text-sm font-semibold leading-6 text-foreground">
                    {current.name_en || "-"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Deskripsi */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t.productDescription}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-brand-dark">
                  {t.indonesian}
                </span>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                  {current.description_idn || "-"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-brand-dark">
                  {t.english}
                </span>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                  {current.description_en || "-"}
                </p>
              </div>
            </div>
          </section>

          {/* 4. Keunggulan produk */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Star className="size-4" />
              {t.excellences}
            </h3>

            {excellences.length > 0 ? (
              <div className="space-y-3">
                {excellences.map((item, index) => (
                  <div
                    key={item.id ?? index}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-2"
                  >
                    <div>
                      <span className="text-xs font-semibold text-brand-dark">
                        ID
                      </span>

                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
                        {item.title_idn || "-"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-brand-dark">
                        EN
                      </span>

                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
                        {item.title_en || "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                {t.noExcellences}
              </p>
            )}
          </section>

          {/* 5. Spesifikasi produk */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ListChecks className="size-4" />
              {t.specifications}
            </h3>

            {specifications.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="px-4 py-3 font-semibold text-foreground">
                        {t.specificationName} (ID)
                      </th>

                      <th className="px-4 py-3 font-semibold text-foreground">
                        {t.specificationName} (EN)
                      </th>

                      <th className="px-4 py-3 font-semibold text-foreground">
                        {t.specificationValue} (ID)
                      </th>
                      <th className="px-4 py-3 font-semibold text-foreground">
                        {t.specificationValue} (EN)
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {specifications.map((item, index) => (
                      <tr
                        key={item.id ?? index}
                        className="border-t border-border"
                      >
                        <td className="px-4 py-3 leading-6 text-foreground">
                          {item.name_idn || "-"}
                        </td>

                        <td className="px-4 py-3 leading-6 text-foreground">
                          {item.name_en || "-"}
                        </td>

                        <td className="px-4 py-3 leading-6 text-muted-foreground">
                          {item.value_idn || "-"}
                        </td>
                        <td className="px-4 py-3 leading-6 text-muted-foreground">
                          {item.value_en || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                {t.noSpecifications}
              </p>
            )}
          </section>

          {/* 6. Waktu pembuatan dan pembaruan */}
          <section className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {t.createdAt}
              </p>

              <p className="text-sm text-foreground">
                {formatDate(current.created_at, t.notAvailable)}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {t.updatedAt}
              </p>

              <p className="text-sm text-foreground">
                {formatDate(current.updated_at, t.notAvailable)}
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
