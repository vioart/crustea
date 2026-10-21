
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  ImagePlus,
  Languages,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  X,
  WandSparkles,
} from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";
import { getAuthToken } from "@/lib/auth";

type Language = "id" | "en";

type ExcellenceForm = {
  title_idn: string;
  title_en: string;
};

type SpecificationForm = {
  name_idn: string;
  name_en: string;
  value_idn: string;
  value_en: string;
};

type ImageForm = {
  id: string;
  file: File;
  preview: string;
};

type ExistingImage = {
  id: string;
  url: string;
  fileUrl: string;
};

type FieldErrors = Record<string, string>;

type ToastType = "success" | "error";

type Toast = {
  type: ToastType;
  message: string;
};

type ProductDetail = {
  id: string | number;
  category: string;
  slug: string;
  name_idn: string;
  name_en: string;
  description_idn: string;
  description_en: string;
  images?: Array<{
    id?: string | number;
    file_url?: string;
  }>;
  excellences?: ExcellenceForm[];
  specifications?: SpecificationForm[];
};

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const translations = {
  id: {
    pageTitle: "Edit Produk Teknologi Budidaya",
    dashboard: "Dashboard",
    product: "Produk",
    technology: "Teknologi Budidaya",
    editProduct: "Edit Produk",
    intro: "Perbarui informasi produk yang dipilih.",
    productInfo: "Informasi Produk",
    category: "Kategori",
    nameIDN: "Nama Produk (Bahasa Indonesia)",
    nameEN: "Nama Produk (Bahasa Inggris)",
    descriptionIDN: "Deskripsi (Bahasa Indonesia)",
    descriptionEN: "Deskripsi (Bahasa Inggris)",
    slug: "Slug",
    slugHelp: "Slug digunakan sebagai identitas produk pada URL.",
    generateSlug: "Buat slug",
    images: "Gambar Produk",
    imageDescription:
      "Pertahankan gambar lama atau tambahkan gambar baru. Format JPG, PNG, atau WebP, maksimal 2 MB per gambar.",
    addImage: "Tambah Gambar",
    removeImage: "Hapus gambar",
    existingImage: "Gambar tersimpan",
    newImage: "Gambar baru",
    excellences: "Keunggulan Produk",
    excellenceDescription:
      "Perbarui keunggulan produk dalam Bahasa Indonesia dan Inggris.",
    excellenceTitleIDN: "Keunggulan (Bahasa Indonesia)",
    excellenceTitleEN: "Keunggulan (Bahasa Inggris)",
    addExcellence: "Tambah Keunggulan",
    removeExcellence: "Hapus keunggulan",
    specifications: "Spesifikasi Produk",
    specificationDescription:
      "Perbarui nama dan nilai spesifikasi dalam Bahasa Indonesia dan Inggris.",
    specificationNameIDN: "Nama Spesifikasi (Bahasa Indonesia)",
    specificationNameEN: "Nama Spesifikasi (Bahasa Inggris)",
    specificationValueIDN: "Nilai Spesifikasi (Bahasa Indonesia)",
    specificationValueEN: "Nilai Spesifikasi (Bahasa Inggris)",
    specificationValuePlaceholder: "Contoh: 220 Volt, Baja tahan karat",
    addSpecification: "Tambah Spesifikasi",
    removeSpecification: "Hapus spesifikasi",
    required: "Kolom ini wajib diisi.",
    invalidSlug:
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.",
    authError: "Token autentikasi tidak ditemukan. Silakan login kembali.",
    loadError: "Gagal mengambil data produk.",
    notFound: "Produk tidak ditemukan.",
    save: "Simpan Perubahan",
    saving: "Menyimpan perubahan...",
    cancel: "Batal",
    back: "Kembali",
    success: "Produk teknologi budidaya berhasil diperbarui.",
    failed: "Gagal memperbarui produk.",
    translate: "Terjemahkan",
    translateAll: "Terjemahkan dari Bahasa Indonesia",
    translating: "Menerjemahkan...",
    translateError: "Gagal menerjemahkan teks.",
    loading: "Memuat data produk...",
    chooseImage: "Pilih gambar",
    imageRequired: "Produk harus memiliki minimal satu gambar.",
  },
  en: {
    pageTitle: "Edit Aquaculture Technology Product",
    dashboard: "Dashboard",
    product: "Products",
    technology: "Aquaculture Technology",
    editProduct: "Edit Product",
    intro: "Update the information for the selected product.",
    productInfo: "Product Information",
    category: "Category",
    nameIDN: "Product Name (Indonesian)",
    nameEN: "Product Name (English)",
    descriptionIDN: "Description (Indonesian)",
    descriptionEN: "Description (English)",
    slug: "Slug",
    slugHelp: "The slug identifies the product in its URL.",
    generateSlug: "Generate slug",
    images: "Product Images",
    imageDescription:
      "Keep existing images or add new ones. JPG, PNG, or WebP, maximum 2 MB per image.",
    addImage: "Add Images",
    removeImage: "Remove image",
    existingImage: "Saved images",
    newImage: "New images",
    excellences: "Product Advantages",
    excellenceDescription:
      "Update product advantages in Indonesian and English.",
    excellenceTitleIDN: "Advantage (Indonesian)",
    excellenceTitleEN: "Advantage (English)",
    addExcellence: "Add Advantage",
    removeExcellence: "Remove advantage",
    specifications: "Product Specifications",
    specificationDescription:
      "Update specification names and values in Indonesian and English.",
    specificationNameIDN: "Specification Name (Indonesian)",
    specificationNameEN: "Specification Name (English)",
    specificationValueIDN: "Specification Value (Indonesian)",
    specificationValueEN: "Specification Value (English)",
    specificationValuePlaceholder: "Example: 220 Volts, Stainless steel",
    addSpecification: "Add Specification",
    removeSpecification: "Remove specification",
    required: "This field is required.",
    invalidSlug:
      "Slug may only contain lowercase letters, numbers, and hyphens.",
    authError: "Authentication token not found. Please log in again.",
    loadError: "Failed to load product data.",
    notFound: "Product not found.",
    save: "Save Changes",
    saving: "Saving changes...",
    cancel: "Cancel",
    back: "Back",
    success: "Aquaculture technology product updated successfully.",
    failed: "Failed to update product.",
    translate: "Translate",
    translateAll: "Translate from Indonesian",
    translating: "Translating...",
    translateError: "Failed to translate text.",
    loading: "Loading product data...",
    chooseImage: "Choose image",
    imageRequired: "The product must have at least one image.",
  },
} satisfies Record<Language, Record<string, string>>;

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const createEmptyExcellence = (): ExcellenceForm => ({
  title_idn: "",
  title_en: "",
});

const createEmptySpecification = (): SpecificationForm => ({
  name_idn: "",
  name_en: "",
  value_idn: "",
  value_en: "",
});

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export default function EditTechnologyProductPage() {
  const { language } = useLanguage();
  const t = translations[language as Language] ?? translations.id;
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const productSlug = params.slug;

  const [productId, setProductId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const [nameIDN, setNameIDN] = useState("");
  const [nameEN, setNameEN] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionIDN, setDescriptionIDN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");

  // Gambar lama yang masih dipertahankan.
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);

  // File gambar baru yang dipilih dari perangkat.
  const [images, setImages] = useState<ImageForm[]>([]);

  // URL gambar lama yang akan dihapus saat update.
  const [deletedImageURLs, setDeletedImageURLs] = useState<string[]>([]);

  const [imageError, setImageError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  const [excellences, setExcellences] = useState<ExcellenceForm[]>([
    createEmptyExcellence(),
  ]);

  const [specifications, setSpecifications] = useState<SpecificationForm[]>([
    createEmptySpecification(),
  ]);

  const [slugEdited, setSlugEdited] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const inputClass = (key?: string) =>
    `mt-2 w-full rounded-lg border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 ${
      key && errors[key] ? "border-red-400" : "border-border"
    }`;

  const updateTextField = (
    field: "nameIDN" | "nameEN" | "descriptionIDN" | "descriptionEN",
    value: string,
  ) => {
    setErrors((previous) => ({ ...previous, [field]: "" }));

    switch (field) {
      case "nameIDN":
        setNameIDN(value);
        // Slug produk lama tidak berubah otomatis saat halaman edit dibuka.
        // Slug hanya dibuat otomatis jika pengguna meminta secara manual.
        break;
      case "nameEN":
        setNameEN(value);
        break;
      case "descriptionIDN":
        setDescriptionIDN(value);
        break;
      case "descriptionEN":
        setDescriptionEN(value);
        break;
    }
  };

  const loadProduct = useCallback(
    async (signal: AbortSignal) => {
      const token = getAuthToken();

      if (!token) {
        setError(t.authError);
        setLoading(false);
        return;
      }

      try {
        setError("");

        const apiBaseUrl = getApiBaseUrl();

        const response = await fetch(
          `${apiBaseUrl}/api/admin/products/${encodeURIComponent(productSlug)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
            signal,
          },
        );

        const data = await response.json().catch(() => ({}));

        if (signal.aborted) return;

        if (response.status === 404) {
          throw new Error(t.notFound);
        }

        if (!response.ok) {
          throw new Error(data.message || t.loadError);
        }

        // Menangani respons dengan atau tanpa pembungkus "data".
        const responseData = data.data ?? data;

        // Backend mengirim produk dan detailnya secara terpisah.
        const product: ProductDetail | undefined = responseData.product
          ? {
              ...responseData.product,
              images: responseData.images ?? [],
              excellences: responseData.excellences ?? [],
              specifications: responseData.specifications ?? [],
            }
          : responseData;

        if (!product || product.id == null) {
          console.error("Unexpected product response:", data);
          throw new Error(t.loadError);
        }

        setProductId(String(product.id));

        setNameIDN(product.name_idn ?? "");
        setNameEN(product.name_en ?? "");
        setSlug(product.slug ?? "");
        setDescriptionIDN(product.description_idn ?? "");
        setDescriptionEN(product.description_en ?? "");

        // Memuat gambar lama dari backend.
        // Contoh path: /uploads/products/nama-gambar.webp
        const loadedImages: ExistingImage[] = (product.images ?? [])
          .map((image, index) => {
            const path = image.file_url;

            if (!path) return null;

            // Jika URL sudah absolut, gunakan langsung.
            // Jika relatif, gabungkan dengan alamat backend.
            const url = /^https?:\/\//i.test(path)
              ? path
              : `${apiBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

            return {
              id: String(image.id ?? `existing-${index}`),
              url,
              fileUrl: path,
            };
          })
          .filter((image): image is ExistingImage => image !== null);

        setExistingImages(loadedImages);
        setDeletedImageURLs([]);

        // Memuat keunggulan produk.
        setExcellences(
          product.excellences?.length
            ? product.excellences.map((item) => ({
                title_idn: item.title_idn ?? "",
                title_en: item.title_en ?? "",
              }))
            : [createEmptyExcellence()],
        );

        // Memuat spesifikasi produk.
        setSpecifications(
          product.specifications?.length
            ? product.specifications.map((item) => ({
                name_idn: item.name_idn ?? "",
                name_en: item.name_en ?? "",
                value_idn: item.value_idn ?? "",
                value_en: item.value_en ?? "",
              }))
            : [createEmptySpecification()],
        );

        setSlugEdited(true);
      } catch (err) {
        if (signal.aborted) return;

        console.error("Load aquaculture technology product error:", err);
        setError(err instanceof Error ? err.message : t.loadError);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [productSlug, t.authError, t.loadError, t.notFound],
  );

  useEffect(() => {
    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      void loadProduct(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadProduct]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const translateText = async (text: string): Promise<string> => {
    if (!text.trim()) {
      throw new Error(t.required);
    }

    const token = getAuthToken();

    if (!token) {
      throw new Error(t.authError);
    }

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        q: text.trim(),
        source: "id",
        target: "en",
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || t.translateError);
    }

    if (
      typeof data.translatedText !== "string" ||
      !data.translatedText.trim()
    ) {
      throw new Error(t.translateError);
    }

    return data.translatedText.trim();
  };

  const translateMainFields = async () => {
    if (!nameIDN.trim() || !descriptionIDN.trim()) {
      setErrors((previous) => ({
        ...previous,
        ...(!nameIDN.trim() ? { nameIDN: t.required } : {}),
        ...(!descriptionIDN.trim()
          ? { descriptionIDN: t.required }
          : {}),
      }));
      return;
    }

    try {
      setError("");
      setTranslating(true);

      const [translatedName, translatedDescription] = await Promise.all([
        translateText(nameIDN),
        translateText(descriptionIDN),
      ]);

      setNameEN(translatedName);
      setDescriptionEN(translatedDescription);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : t.translateError,
      });
    } finally {
      setTranslating(false);
    }
  };

  const translateExcellence = async (index: number) => {
    const source = excellences[index]?.title_idn;

    if (!source?.trim()) {
      setErrors((previous) => ({
        ...previous,
        [`excellence-id-${index}`]: t.required,
      }));
      return;
    }

    try {
      setTranslating(true);

      const translated = await translateText(source);

      setExcellences((previous) =>
        previous.map((item, i) =>
          i === index ? { ...item, title_en: translated } : item,
        ),
      );

      setErrors((previous) => ({
        ...previous,
        [`excellence-id-${index}`]: "",
        [`excellence-en-${index}`]: "",
      }));
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : t.translateError,
      });
    } finally {
      setTranslating(false);
    }
  };

  const translateSpecification = async (index: number) => {
    const source = specifications[index]?.name_idn;

    if (!source?.trim()) {
      setErrors((previous) => ({
        ...previous,
        [`specification-id-${index}`]: t.required,
      }));
      return;
    }

    try {
      setTranslating(true);

      const translated = await translateText(source);

      setSpecifications((previous) =>
        previous.map((item, i) =>
          i === index ? { ...item, name_en: translated } : item,
        ),
      );

      setErrors((previous) => ({
        ...previous,
        [`specification-id-${index}`]: "",
        [`specification-en-${index}`]: "",
      }));
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : t.translateError,
      });
    } finally {
      setTranslating(false);
    }
  };

  const translateSpecificationValue = async (index: number) => {
    const source = specifications[index]?.value_idn;

    if (!source?.trim()) {
      setErrors((previous) => ({
        ...previous,
        [`specification-value-idn-${index}`]: t.required,
      }));
      return;
    }

    try {
      setTranslating(true);

      const translated = await translateText(source);

      setSpecifications((previous) =>
        previous.map((item, i) =>
          i === index ? { ...item, value_en: translated } : item,
        ),
      );

      setErrors((previous) => ({
        ...previous,
        [`specification-value-idn-${index}`]: "",
        [`specification-value-en-${index}`]: "",
      }));
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : t.translateError,
      });
    } finally {
      setTranslating(false);
    }
  };

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;

    setImageError("");

    const selectedFiles = Array.from(files);
    const totalImages = existingImages.length + images.length;
    const validFiles: ImageForm[] = [];

    for (const file of selectedFiles) {
      if (totalImages + validFiles.length >= MAX_IMAGES) {
        setImageError(`Maksimal ${MAX_IMAGES} gambar.`);
        break;
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setImageError("Format gambar harus JPG, PNG, atau WebP.");
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setImageError(`${file.name} melebihi batas ukuran 2 MB.`);
        continue;
      }

      validFiles.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setImages((previous) => [...previous, ...validFiles]);
  };

  const removeImage = (id: string) => {
    const newImage = images.find((image) => image.id === id);

    if (newImage) {
      URL.revokeObjectURL(newImage.preview);
      setImages((previous) => previous.filter((image) => image.id !== id));
    } else {
      const existingImage = existingImages.find((image) => image.id === id);

      if (existingImage) {
        setExistingImages((previous) =>
          previous.filter((image) => image.id !== id),
        );

        if (!id.startsWith("existing-")) {
          setDeletedImageURLs((previous) =>
            previous.includes(existingImage.fileUrl)
              ? previous
              : [...previous, existingImage.fileUrl],
          );
        }
      }
    }

    setImageError("");
  };

  const validateForm = () => {
    const nextErrors: FieldErrors = {};

    if (!nameIDN.trim()) nextErrors.nameIDN = t.required;
    if (!nameEN.trim()) nextErrors.nameEN = t.required;
    if (!descriptionIDN.trim()) nextErrors.descriptionIDN = t.required;
    if (!descriptionEN.trim()) nextErrors.descriptionEN = t.required;

    if (!slug.trim()) {
      nextErrors.slug = t.required;
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      nextErrors.slug = t.invalidSlug;
    }

    if (existingImages.length + images.length === 0) {
      setImageError(t.imageRequired);
    } else {
      setImageError("");
    }

    excellences.forEach((item, index) => {
      const hasIDN = item.title_idn.trim();
      const hasEN = item.title_en.trim();

      if (hasIDN && !hasEN) {
        nextErrors[`excellence-en-${index}`] = t.required;
      }

      if (hasEN && !hasIDN) {
        nextErrors[`excellence-id-${index}`] = t.required;
      }
    });

    specifications.forEach((item, index) => {
      const hasNameIDN = item.name_idn.trim();
      const hasNameEN = item.name_en.trim();
      const hasValueIDN = item.value_idn.trim();
      const hasValueEN = item.value_en.trim();

      const rowHasData =
        hasNameIDN || hasNameEN || hasValueIDN || hasValueEN;

      if (rowHasData && !hasNameIDN) {
        nextErrors[`specification-id-${index}`] = t.required;
      }

      if (rowHasData && !hasNameEN) {
        nextErrors[`specification-en-${index}`] = t.required;
      }

      if (rowHasData && !hasValueIDN) {
        nextErrors[`specification-value-idn-${index}`] = t.required;
      }

      if (rowHasData && !hasValueEN) {
        nextErrors[`specification-value-en-${index}`] = t.required;
      }
    });

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0 &&
      existingImages.length + images.length > 0
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) return;

    const token = getAuthToken();

    if (!token) {
      setToast({ type: "error", message: t.authError });
      return;
    }

    try {
      setSaving(true);
      setUploadingImages(true);

      const formData = new FormData();

      // Kategori baru: technology
      formData.append("category", "technology");
      formData.append("slug", slug.trim());
      formData.append("name_idn", nameIDN.trim());
      formData.append("name_en", nameEN.trim());
      formData.append("description_idn", descriptionIDN.trim());
      formData.append("description_en", descriptionEN.trim());

      images.forEach((image) => {
        formData.append("images", image.file);
      });

      formData.append("delete_images", JSON.stringify(deletedImageURLs));

      formData.append(
        "excellences",
        JSON.stringify(
          excellences
            .filter((item) => item.title_idn.trim() || item.title_en.trim())
            .map((item) => ({
              title_idn: item.title_idn.trim(),
              title_en: item.title_en.trim(),
            })),
        ),
      );

      formData.append(
        "specifications",
        JSON.stringify(
          specifications
            .filter(
              (item) =>
                item.name_idn.trim() ||
                item.name_en.trim() ||
                item.value_idn.trim() ||
                item.value_en.trim(),
            )
            .map((item) => ({
              name_idn: item.name_idn.trim(),
              name_en: item.name_en.trim(),
              value_idn: item.value_idn.trim(),
              value_en: item.value_en.trim(),
            })),
        ),
      );

      const response = await fetch(
        `${getApiBaseUrl()}/api/admin/products/${encodeURIComponent(productSlug)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || t.failed);
      }

      setToast({ type: "success", message: t.success });

      window.setTimeout(() => {
        router.push("/portal/produk/teknologi-budidaya");
        router.refresh();
      }, 3000);
    } catch (err) {
      console.error("Update aquaculture technology product error:", err);

      setToast({
        type: "error",
        message: err instanceof Error ? err.message : t.failed,
      });
    } finally {
      setSaving(false);
      setUploadingImages(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed right-6 top-20 z-[200]">
          <div
            role="status"
            className={`flex min-w-[320px] max-w-[420px] items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="size-5 shrink-0 text-green-600" />
            ) : (
              <CircleAlert className="size-5 shrink-0 text-red-600" />
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {toast.type === "success" ? t.success : t.failed}
              </p>
              <p className="mt-0.5 text-xs leading-5">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label={language === "id" ? "Tutup notifikasi" : "Close notification"}
              className="shrink-0"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t.pageTitle}
          </h1>

          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t.dashboard}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{t.product}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{t.technology}</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-brand-dark">{t.editProduct}</span>
          </div>
        </div>

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => router.push("/portal/produk/teknologi-budidaya")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t.back}
        </button>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <CircleAlert className="mt-0.5 size-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-border bg-background">
            <LoaderCircle className="size-8 animate-spin text-brand-dark" />
            <p className="mt-3 text-sm text-muted-foreground">{t.loading}</p>
          </div>
        ) : !error ? (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* INFORMASI UTAMA */}
            <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
              <div className="border-b border-border px-5 py-5 sm:px-7">
                <h2 className="text-lg font-bold text-foreground">
                  {t.productInfo}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{t.intro}</p>
              </div>

              <div className="space-y-6 px-5 py-6 sm:px-7">
                {/* KATEGORI */}
                <div>
                  <label className="block text-sm font-semibold text-foreground">
                    {t.category}
                  </label>
                  <div className="mt-2 flex h-11 items-center rounded-lg border border-border bg-muted/50 px-3.5 text-sm font-medium text-foreground">
                    {t.technology}
                  </div>
                </div>

                {/* SLUG */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="slug"
                      className="text-sm font-semibold text-foreground"
                    >
                      {t.slug} <span className="text-red-500">*</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setSlug(slugify(nameIDN));
                        setSlugEdited(true);
                        setErrors((previous) => ({ ...previous, slug: "" }));
                      }}
                      disabled={!nameIDN.trim() || saving}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-dark hover:underline disabled:opacity-50"
                    >
                      <WandSparkles className="size-3.5" />
                      {t.generateSlug}
                    </button>
                  </div>

                  <input
                    id="slug"
                    value={slug}
                    onChange={(event) => {
                      setSlug(event.target.value.toLowerCase());
                      setSlugEdited(true);
                      setErrors((previous) => ({ ...previous, slug: "" }));
                    }}
                    className={inputClass("slug")}
                    placeholder="nama-produk"
                    required
                  />

                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {t.slugHelp}
                  </p>

                  {errors.slug && (
                    <p className="mt-1 text-xs text-red-500">{errors.slug}</p>
                  )}
                </div>

                {/* NAMA DAN DESKRIPSI */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div>
                    <label
                      htmlFor="nameIDN"
                      className="block text-sm font-semibold text-foreground"
                    >
                      {t.nameIDN} *
                    </label>
                    <input
                      id="nameIDN"
                      value={nameIDN}
                      onChange={(event) =>
                        updateTextField("nameIDN", event.target.value)
                      }
                      className={inputClass("nameIDN")}
                      maxLength={255}
                      required
                    />
                    {errors.nameIDN && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.nameIDN}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="nameEN"
                      className="block text-sm font-semibold text-foreground"
                    >
                      {t.nameEN} *
                    </label>
                    <input
                      id="nameEN"
                      value={nameEN}
                      onChange={(event) =>
                        updateTextField("nameEN", event.target.value)
                      }
                      className={inputClass("nameEN")}
                      maxLength={255}
                      required
                    />
                    {errors.nameEN && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.nameEN}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="descriptionIDN"
                      className="block text-sm font-semibold text-foreground"
                    >
                      {t.descriptionIDN} *
                    </label>
                    <textarea
                      id="descriptionIDN"
                      value={descriptionIDN}
                      onChange={(event) =>
                        updateTextField("descriptionIDN", event.target.value)
                      }
                      className={`${inputClass("descriptionIDN")} min-h-36 resize-y`}
                      required
                    />
                    {errors.descriptionIDN && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.descriptionIDN}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="descriptionEN"
                      className="block text-sm font-semibold text-foreground"
                    >
                      {t.descriptionEN} *
                    </label>
                    <textarea
                      id="descriptionEN"
                      value={descriptionEN}
                      onChange={(event) =>
                        updateTextField("descriptionEN", event.target.value)
                      }
                      className={`${inputClass("descriptionEN")} min-h-36 resize-y`}
                      required
                    />
                    {errors.descriptionEN && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.descriptionEN}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void translateMainFields()}
                  disabled={translating || saving}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
                >
                  {translating ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Languages className="size-4" />
                  )}
                  {translating ? t.translating : t.translateAll}
                </button>
              </div>
            </section>

            {/* GAMBAR PRODUK */}
            <section className="rounded-xl border border-border bg-background p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {t.images}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.imageDescription}
                  </p>
                </div>
                <ImagePlus className="size-5 text-brand-dark" />
              </div>

              {/* GAMBAR LAMA */}
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    {t.existingImage}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {existingImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="overflow-hidden rounded-lg border border-border"
                      >
                        <div className="relative flex h-36 items-center justify-center bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.url}
                            alt={`Gambar produk ${index + 1}`}
                            className="h-full w-full object-contain"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            disabled={saving}
                            aria-label={t.removeImage}
                            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white text-red-600 shadow hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="p-3">
                          <p className="truncate text-xs text-muted-foreground">
                            {t.existingImage}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PILIH GAMBAR BARU */}
              <label
                htmlFor="product-images"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border px-6 py-10 text-center transition hover:border-brand-dark hover:bg-muted/40"
              >
                <ImagePlus className="mb-3 size-10 text-brand-dark" />
                <span className="text-sm font-semibold text-foreground">
                  {t.addImage}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG, WebP · Maks. 2 MB per gambar
                </span>

                <input
                  id="product-images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={
                    saving ||
                    uploadingImages ||
                    existingImages.length + images.length >= MAX_IMAGES
                  }
                  onChange={(event) => {
                    handleImageSelect(event.target.files);
                    event.currentTarget.value = "";
                  }}
                  className="sr-only"
                />
              </label>

              {imageError && (
                <p role="alert" className="mt-3 text-sm text-red-500">
                  {imageError}
                </p>
              )}

              {/* PREVIEW GAMBAR BARU */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    {t.newImage}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className="overflow-hidden rounded-lg border border-border"
                      >
                        <div className="relative flex h-36 items-center justify-center bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.preview}
                            alt={`Preview gambar baru ${index + 1}`}
                            className="h-full w-full object-contain"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            disabled={saving || uploadingImages}
                            aria-label={t.removeImage}
                            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white text-red-600 shadow hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>

                        <div className="p-3">
                          <p className="truncate text-sm font-medium text-foreground">
                            {image.file.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {(image.file.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-3 text-xs text-muted-foreground">
                {existingImages.length + images.length}/{MAX_IMAGES} gambar
              </p>
            </section>

            {/* KEUNGGULAN PRODUK */}
            <section className="rounded-xl border border-border bg-background p-5 shadow-sm sm:p-7">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-foreground">
                  {t.excellences}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.excellenceDescription}
                </p>
              </div>

              <div className="space-y-4">
                {excellences.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        {t.excellences} {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          setExcellences((previous) =>
                            previous.filter((_, i) => i !== index),
                          )
                        }
                        disabled={excellences.length === 1 || saving}
                        aria-label={t.removeExcellence}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div>
                        <div className="mb-2 flex min-h-8 items-center">
                          <label className="text-sm font-medium text-foreground">
                            {t.excellenceTitleIDN}
                          </label>
                        </div>
                        <input
                          value={item.title_idn}
                          onChange={(event) => {
                            const next = [...excellences];
                            next[index] = {
                              ...next[index],
                              title_idn: event.target.value,
                            };
                            setExcellences(next);
                            setErrors((previous) => ({
                              ...previous,
                              [`excellence-id-${index}`]: "",
                            }));
                          }}
                          className={inputClass(`excellence-id-${index}`)}
                        />
                        {errors[`excellence-id-${index}`] && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors[`excellence-id-${index}`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="mb-2 flex min-h-8 items-center justify-between gap-2">
                          <label className="text-sm font-medium text-foreground">
                            {t.excellenceTitleEN}
                          </label>
                          <button
                            type="button"
                            onClick={() => void translateExcellence(index)}
                            disabled={
                              translating || saving || !item.title_idn.trim()
                            }
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-2.5 py-1.5 text-xs font-semibold text-brand-dark transition hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {translating ? (
                              <LoaderCircle className="size-3.5 animate-spin" />
                            ) : (
                              <Languages className="size-3.5" />
                            )}
                            {translating ? t.translating : t.translate}
                          </button>
                        </div>
                        <input
                          value={item.title_en}
                          onChange={(event) => {
                            const next = [...excellences];
                            next[index] = {
                              ...next[index],
                              title_en: event.target.value,
                            };
                            setExcellences(next);
                            setErrors((previous) => ({
                              ...previous,
                              [`excellence-en-${index}`]: "",
                            }));
                          }}
                          className={inputClass(`excellence-en-${index}`)}
                        />
                        {errors[`excellence-en-${index}`] && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors[`excellence-en-${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setExcellences((previous) => [
                    ...previous,
                    createEmptyExcellence(),
                  ])
                }
                disabled={saving}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
              >
                <Plus className="size-4" />
                {t.addExcellence}
              </button>
            </section>

            {/* SPESIFIKASI PRODUK */}
            <section className="rounded-xl border border-border bg-background p-5 shadow-sm sm:p-7">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-foreground">
                  {t.specifications}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.specificationDescription}
                </p>
              </div>

              <div className="space-y-4">
                {specifications.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        {t.specifications} {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          setSpecifications((previous) =>
                            previous.filter((_, i) => i !== index),
                          )
                        }
                        disabled={specifications.length === 1 || saving}
                        aria-label={t.removeSpecification}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div>
                        <div className="mb-2 flex min-h-8 items-center">
                          <label className="text-sm font-medium text-foreground">
                            {t.specificationNameIDN}
                          </label>
                        </div>
                        <input
                          value={item.name_idn}
                          onChange={(event) => {
                            const next = [...specifications];
                            next[index] = {
                              ...next[index],
                              name_idn: event.target.value,
                            };
                            setSpecifications(next);
                            setErrors((previous) => ({
                              ...previous,
                              [`specification-id-${index}`]: "",
                            }));
                          }}
                          className={inputClass(`specification-id-${index}`)}
                        />
                        {errors[`specification-id-${index}`] && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors[`specification-id-${index}`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="mb-2 flex min-h-8 items-center justify-between gap-2">
                          <label className="text-sm font-medium text-foreground">
                            {t.specificationNameEN}
                          </label>
                          <button
                            type="button"
                            onClick={() => void translateSpecification(index)}
                            disabled={
                              translating || saving || !item.name_idn.trim()
                            }
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-2.5 py-1.5 text-xs font-semibold text-brand-dark transition hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {translating ? (
                              <LoaderCircle className="size-3.5 animate-spin" />
                            ) : (
                              <Languages className="size-3.5" />
                            )}
                            {translating ? t.translating : t.translate}
                          </button>
                        </div>
                        <input
                          value={item.name_en}
                          onChange={(event) => {
                            const next = [...specifications];
                            next[index] = {
                              ...next[index],
                              name_en: event.target.value,
                            };
                            setSpecifications(next);
                            setErrors((previous) => ({
                              ...previous,
                              [`specification-en-${index}`]: "",
                            }));
                          }}
                          className={inputClass(`specification-en-${index}`)}
                        />
                        {errors[`specification-en-${index}`] && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors[`specification-en-${index}`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div>
                        <div className="mb-2 flex min-h-8 items-center">
                          <label
                            htmlFor={`specification-value-idn-${index}`}
                            className="text-sm font-medium text-foreground"
                          >
                            {t.specificationValueIDN}
                          </label>
                        </div>
                        <input
                          id={`specification-value-idn-${index}`}
                          value={item.value_idn}
                          onChange={(event) => {
                            const next = [...specifications];
                            next[index] = {
                              ...next[index],
                              value_idn: event.target.value,
                            };
                            setSpecifications(next);
                            setErrors((previous) => ({
                              ...previous,
                              [`specification-value-idn-${index}`]: "",
                            }));
                          }}
                          className={inputClass(
                            `specification-value-idn-${index}`,
                          )}
                          placeholder={t.specificationValuePlaceholder}
                        />
                        {errors[`specification-value-idn-${index}`] && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors[`specification-value-idn-${index}`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="mb-2 flex min-h-8 items-center justify-between gap-2">
                          <label
                            htmlFor={`specification-value-en-${index}`}
                            className="text-sm font-medium text-foreground"
                          >
                            {t.specificationValueEN}
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              void translateSpecificationValue(index)
                            }
                            disabled={
                              translating || saving || !item.value_idn.trim()
                            }
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-2.5 py-1.5 text-xs font-semibold text-brand-dark transition hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {translating ? (
                              <LoaderCircle className="size-3.5 animate-spin" />
                            ) : (
                              <Languages className="size-3.5" />
                            )}
                            {translating ? t.translating : t.translate}
                          </button>
                        </div>
                        <input
                          id={`specification-value-en-${index}`}
                          value={item.value_en}
                          onChange={(event) => {
                            const next = [...specifications];
                            next[index] = {
                              ...next[index],
                              value_en: event.target.value,
                            };
                            setSpecifications(next);
                            setErrors((previous) => ({
                              ...previous,
                              [`specification-value-en-${index}`]: "",
                            }));
                          }}
                          className={inputClass(
                            `specification-value-en-${index}`,
                          )}
                          placeholder="Example: 220 Volts, Stainless steel"
                        />
                        {errors[`specification-value-en-${index}`] && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors[`specification-value-en-${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setSpecifications((previous) => [
                    ...previous,
                    createEmptySpecification(),
                  ])
                }
                disabled={saving}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
              >
                <Plus className="size-4" />
                {t.addSpecification}
              </button>
            </section>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  router.push("/portal/produk/teknologi-budidaya")
                }
                disabled={saving || translating}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
              >
                {t.cancel}
              </button>

              <button
                type="submit"
                disabled={saving || translating}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white transition hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                {saving ? t.saving : t.save}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
