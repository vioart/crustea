"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Check,
  ChevronDown,
  Image as ImageIcon,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";

import { getAuthToken } from "@/lib/auth";
import { useLanguage } from "@/components/language/language-provider";

// ============================================================
// TYPES
// ============================================================

type Language = "id" | "en";

export type Partner = {
  id: number;
  name: string;
  logo: string | null;
  created_at: string;
  updated_at: string;
};

export type PartnershipProject = {
  id: number;
  name_idn: string;
  name_en: string;
  description_idn: string;
  description_en: string;
  image: string | null;
  start_period: string | number;
  end_period: string | number | null;
  created_at: string;
  updated_at: string;
  partners: Partner[];
};

type PartnershipForm = {
  name_idn: string;
  name_en: string;
  description_idn: string;
  description_en: string;
  image: File | null;
  start_period: string;
  end_period: string;
  partner_ids: number[];
};

type FieldErrors = Partial<
  Record<
    | "name_idn"
    | "name_en"
    | "description_idn"
    | "description_en"
    | "image"
    | "start_period"
    | "end_period"
    | "partner_ids",
    string
  >
>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  project: PartnershipProject | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

// ============================================================
// TRANSLATIONS
// ============================================================

const translations = {
  id: {
    createTitle: "Tambah Project Kemitraan",
    editTitle: "Edit Project Kemitraan",
    createDescription: "Lengkapi informasi project kemitraan baru.",
    editDescription: "Perbarui informasi project kemitraan.",

    basicInfo: "Informasi Project",
    nameIDN: "Nama Project (Indonesia)",
    nameEN: "Nama Project (Inggris)",
    descriptionIDN: "Deskripsi (Indonesia)",
    descriptionEN: "Deskripsi (Inggris)",

    nameIDNPlaceholder: "Masukkan nama project dalam Bahasa Indonesia",
    nameENPlaceholder: "Masukkan nama project dalam Bahasa Inggris",
    descriptionIDNPlaceholder:
      "Masukkan deskripsi project dalam Bahasa Indonesia",
    descriptionENPlaceholder: "Masukkan deskripsi project dalam Bahasa Inggris",

    image: "Gambar Project",
    imageHint: "Format JPG, PNG, atau WEBP. Maksimal 2 MB.",
    selectImage: "Pilih Gambar",
    changeImage: "Ganti Gambar",
    removeImage: "Hapus pilihan gambar",
    currentImage: "Gambar saat ini",

    period: "Periode Project",
    startPeriod: "Bulan dan Tahun Mulai",
    endPeriod: "Bulan dan Tahun Berakhir",
    startPeriodPlaceholder: "Pilih bulan dan tahun mulai",
    endPeriodPlaceholder: "Pilih bulan dan tahun berakhir",
    endPeriodHint: "Kosongkan jika project masih berjalan.",

    partnerSection: "Partner Kemitraan",
    partnerHint: "Pilih satu atau beberapa partner untuk project ini.",
    searchPartner: "Cari partner...",
    loadingPartners: "Memuat daftar partner...",
    noPartners: "Belum ada data partner.",
    noPartnerMatch: "Partner tidak ditemukan.",
    selectedPartners: "partner dipilih",
    removePartner: "Hapus partner",
    retry: "Coba lagi",

    required: "Bagian ini wajib diisi.",
    requiredNameIDN: "Nama project Bahasa Indonesia wajib diisi.",
    requiredNameEN: "Nama project Bahasa Inggris wajib diisi.",
    requiredDescriptionIDN: "Deskripsi Bahasa Indonesia wajib diisi.",
    requiredDescriptionEN: "Deskripsi Bahasa Inggris wajib diisi.",
    requiredStartPeriod: "Bulan dan tahun mulai wajib diisi.",
    invalidStartPeriod: "Bulan dan tahun mulai tidak valid.",
    invalidEndPeriod: "Bulan dan tahun berakhir tidak valid.",
    endBeforeStart:
      "Periode berakhir tidak boleh lebih awal dari periode mulai.",
    invalidImage: "Format gambar harus JPG, PNG, atau WEBP.",
    imageTooLarge: "Ukuran gambar maksimal 2 MB.",

    authError: "Token autentikasi tidak ditemukan.",
    loadPartnersError: "Gagal memuat daftar partner.",
    createError: "Gagal menambahkan project kemitraan.",
    updateError: "Gagal memperbarui project kemitraan.",

    save: "Simpan",
    saving: "Menyimpan...",
    cancel: "Batal",
    close: "Tutup",
    requiredMark: "* Wajib diisi",
  },

  en: {
    createTitle: "Add Partnership Project",
    editTitle: "Edit Partnership Project",
    createDescription: "Complete the new partnership project information.",
    editDescription: "Update the partnership project information.",

    basicInfo: "Project Information",
    nameIDN: "Project Name (Indonesian)",
    nameEN: "Project Name (English)",
    descriptionIDN: "Description (Indonesian)",
    descriptionEN: "Description (English)",

    nameIDNPlaceholder: "Enter the project name in Indonesian",
    nameENPlaceholder: "Enter the project name in English",
    descriptionIDNPlaceholder: "Enter the project description in Indonesian",
    descriptionENPlaceholder: "Enter the project description in English",

    image: "Project Image",
    imageHint: "JPG, PNG, or WEBP. Maximum 2 MB.",
    selectImage: "Choose Image",
    changeImage: "Change Image",
    removeImage: "Remove selected image",
    currentImage: "Current image",

    period: "Project Period",
    startPeriod: "Start Month and Year",
    endPeriod: "End Month and Year",
    startPeriodPlaceholder: "Select start month and year",
    endPeriodPlaceholder: "Select end month and year",
    endPeriodHint: "Leave empty if the project is ongoing.",

    partnerSection: "Partnership Members",
    partnerHint: "Select one or more partners for this project.",
    searchPartner: "Search partners...",
    loadingPartners: "Loading partners...",
    noPartners: "No partner data available.",
    noPartnerMatch: "No partners found.",
    selectedPartners: "partners selected",
    removePartner: "Remove partner",
    retry: "Retry",

    required: "This field is required.",
    requiredNameIDN: "Indonesian project name is required.",
    requiredNameEN: "English project name is required.",
    requiredDescriptionIDN: "Indonesian description is required.",
    requiredDescriptionEN: "English description is required.",
    requiredStartPeriod: "Start month and year are required.",
    invalidStartPeriod: "Invalid start month and year.",
    invalidEndPeriod: "Invalid end month and year.",
    endBeforeStart: "The end period cannot be earlier than the start period.",
    invalidImage: "Image must be JPG, PNG, or WEBP.",
    imageTooLarge: "Image size must not exceed 2 MB.",

    authError: "Authentication token not found.",
    loadPartnersError: "Failed to load partners.",
    createError: "Failed to add partnership project.",
    updateError: "Failed to update partnership project.",

    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    close: "Close",
    requiredMark: "* Required",
  },
} as const;

// ============================================================
// CONSTANTS & HELPERS
// ============================================================

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const PROJECTS_API = `${API_URL}/api/admin/partnership-projects`;
const PARTNERS_API = `${API_URL}/api/admin/partners`;

// Mengubah tanggal dari API (contoh: 2025-01-01T00:00:00Z)
// menjadi format YYYY-MM.
function toMonthInputValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";

  const raw = String(value).trim();

  // Kompatibilitas jika API masih mengembalikan angka lama YYYYMM.
  if (/^\d{6}$/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}`;
  }

  // Format YYYY-MM atau tanggal ISO/RFC3339.
  const match = raw.match(/^(\d{4})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}` : "";
}

function isValidMonthValue(value: string): boolean {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  return year >= 1900 && year <= 9999 && month >= 1 && month <= 12;
}

function createInitialForm(
  project: PartnershipProject | null,
): PartnershipForm {
  return {
    name_idn: project?.name_idn ?? "",
    name_en: project?.name_en ?? "",
    description_idn: project?.description_idn ?? "",
    description_en: project?.description_en ?? "",
    image: null,
    start_period: toMonthInputValue(project?.start_period),
    end_period: toMonthInputValue(project?.end_period),
    partner_ids: project?.partners?.map((partner) => partner.id) ?? [],
  };
}

function getImageUrl(
  imagePath: string | null | undefined,
): string {
  if (!imagePath) {
    return "";
  }

  // Jika sudah berupa URL lengkap, gunakan langsung.
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  // Jika sudah diawali /uploads, gunakan langsung.
  if (imagePath.startsWith("/uploads/")) {
    return `${API_URL}${imagePath}`;
  }

  // Jika path lama diawali uploads/, tambahkan slash.
  if (imagePath.startsWith("uploads/")) {
    return `${API_URL}/${imagePath}`;
  }

  // Jika database menyimpan path dengan prefix storage/,
  // ubah menjadi prefix URL /uploads/.
  const normalizedPath = imagePath
    .replace(/^\/+/, "")
    .replace(/^storage\//, "")
    .replace(/^uploads\//, "");

  return `${API_URL}/uploads/${normalizedPath}`;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed.");
  }

  return data;
}

// ============================================================
// IMAGE PREVIEW
// ============================================================

function ProjectImagePreview({
  file,
  fallbackUrl,
  alt,
}: {
  file: File | null;
  fallbackUrl: string;
  alt: string;
}) {
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const src = objectUrl || fallbackUrl;

  const [failedSrc, setFailedSrc] = useState("");

  return (
    <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
      {src && failedSrc !== src ? (
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <ImageIcon className="size-8 text-muted-foreground" />
      )}
    </div>
  );
}

// ============================================================
// MONTH/YEAR PICKER
// ============================================================

const MONTH_OPTIONS = {
  id: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
} as const;

function MonthYearPicker({
  id,
  value,
  onChange,
  disabled,
  hasError,
  language,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  hasError: boolean;
  language: Language;
}) {
  // State lokal agar pilihan setengah jadi (hanya bulan / hanya tahun)
  // tidak hilang. Nilai awal diambil dari value saat mount (mode edit).
  const [month, setMonth] = useState(() => (value ? value.slice(5, 7) : ""));
  const [year, setYear] = useState(() => (value ? value.slice(0, 4) : ""));

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: currentYear + 15 - 1980 + 1 }, (_, i) =>
    String(currentYear + 15 - i),
  );

  // Pertahankan tahun lama yang mungkin di luar rentang default.
  const yearOptions =
    year && !years.includes(year)
      ? [year, ...years].sort((a, b) => Number(b) - Number(a))
      : years;

  // Parent hanya menerima nilai jika bulan DAN tahun sudah lengkap.
  const handleMonthChange = (nextMonth: string) => {
    setMonth(nextMonth);
    onChange(nextMonth && year ? `${year}-${nextMonth}` : "");
  };

  const handleYearChange = (nextYear: string) => {
    setYear(nextYear);
    onChange(month && nextYear ? `${nextYear}-${month}` : "");
  };

  const selectClass = `h-10 min-w-0 flex-1 rounded-lg border bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-brand-dark/10 disabled:opacity-60 ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-border focus:border-brand-dark"
  }`;

  return (
    <div className="mt-1.5 flex gap-2">
      {/* Pilihan bulan */}
      <select
        id={`${id}-month`}
        value={month}
        onChange={(event) => handleMonthChange(event.target.value)}
        disabled={disabled}
        aria-label={language === "en" ? "Month" : "Bulan"}
        className={selectClass}
      >
        <option value="">
          {language === "en" ? "Select month" : "Pilih bulan"}
        </option>

        {MONTH_OPTIONS[language].map((label, index) => (
          <option key={label} value={String(index + 1).padStart(2, "0")}>
            {label}
          </option>
        ))}
      </select>

      {/* Pilihan tahun */}
      <select
        id={`${id}-year`}
        value={year}
        onChange={(event) => handleYearChange(event.target.value)}
        disabled={disabled}
        aria-label={language === "en" ? "Year" : "Tahun"}
        className={selectClass}
      >
        <option value="">
          {language === "en" ? "Select year" : "Pilih tahun"}
        </option>

        {yearOptions.map((optionYear) => (
          <option key={optionYear} value={optionYear}>
            {optionYear}
          </option>
        ))}
      </select>
    </div>
  );
}

// ============================================================
// FORM MODAL
// ============================================================

export default function PartnershipFormModal({
  open,
  mode,
  project,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const { language } = useLanguage();

  const t = translations[language === "en" ? "en" : "id"];

  const [form, setForm] = useState<PartnershipForm>(() =>
    createInitialForm(project),
  );

  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [loadingPartners, setLoadingPartners] = useState(false);

  const [serverError, setServerError] = useState("");
  const [partnerError, setPartnerError] = useState("");

  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [partnerDropdownOpen, setPartnerDropdownOpen] = useState(false);

  // Dinaikkan saat user menekan "Coba lagi" agar fetch partner diulang.
  const [partnersFetchKey, setPartnersFetchKey] = useState(0);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const partnerDropdownRef = useRef<HTMLDivElement>(null);

  // ==========================================================
  // FETCH PARTNERS
  // ==========================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();

    async function fetchPartners() {
      try {
        setLoadingPartners(true);
        setPartnerError("");

        const token = getAuthToken();

        if (!token) {
          throw new Error(t.authError);
        }

        const response = await fetch(PARTNERS_API, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await parseResponse(response);

        if (!Array.isArray(data.data)) {
          throw new Error(t.loadPartnersError);
        }

        setPartners(data.data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setPartnerError(getErrorMessage(error, t.loadPartnersError));
      } finally {
        if (!controller.signal.aborted) {
          setLoadingPartners(false);
        }
      }
    }

    void fetchPartners();

    return () => {
      controller.abort();
    };
  }, [open, partnersFetchKey, t.authError, t.loadPartnersError]);

  // ==========================================================
  // CLOSE PARTNER DROPDOWN WHEN CLICKING OUTSIDE
  // ==========================================================

  useEffect(() => {
    if (!partnerDropdownOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        partnerDropdownRef.current &&
        !partnerDropdownRef.current.contains(event.target as Node)
      ) {
        setPartnerDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [partnerDropdownOpen]);

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (!form.name_idn.trim()) {
      nextErrors.name_idn = t.requiredNameIDN;
    }

    if (!form.name_en.trim()) {
      nextErrors.name_en = t.requiredNameEN;
    }

    if (!form.description_idn.trim()) {
      nextErrors.description_idn = t.requiredDescriptionIDN;
    }

    if (!form.description_en.trim()) {
      nextErrors.description_en = t.requiredDescriptionEN;
    }

    const validStartPeriod = isValidMonthValue(form.start_period);
    const validEndPeriod = isValidMonthValue(form.end_period);

    if (!form.start_period.trim()) {
      nextErrors.start_period = t.requiredStartPeriod;
    } else if (!validStartPeriod) {
      nextErrors.start_period = t.invalidStartPeriod;
    }

    // Periode berakhir boleh kosong untuk project yang masih berjalan.
    if (form.end_period.trim()) {
      if (!validEndPeriod) {
        nextErrors.end_period = t.invalidEndPeriod;
      } else if (validStartPeriod && form.end_period < form.start_period) {
        // Format YYYY-MM bisa dibandingkan secara leksikografis.
        nextErrors.end_period = t.endBeforeStart;
      }
    }

    if (form.image) {
      if (!ALLOWED_IMAGE_TYPES.includes(form.image.type)) {
        nextErrors.image = t.invalidImage;
      } else if (form.image.size > MAX_IMAGE_SIZE) {
        nextErrors.image = t.imageTooLarge;
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // ==========================================================
  // FORM FIELD HANDLERS
  // ==========================================================

  const handleFieldChange = (
    field:
      | "name_idn"
      | "name_en"
      | "description_idn"
      | "description_en"
      | "start_period"
      | "end_period",
    value: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      ...(field === "start_period" ? { end_period: undefined } : {}),
    }));

    setServerError("");
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      image: file,
    }));

    setErrors((previous) => ({
      ...previous,
      image: undefined,
    }));

    setServerError("");

    // Agar file yang sama dapat dipilih kembali.
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setForm((previous) => ({
      ...previous,
      image: null,
    }));

    setErrors((previous) => ({
      ...previous,
      image: undefined,
    }));

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // ==========================================================
  // PARTNER SELECTION
  // ==========================================================

  const filteredPartners = useMemo(() => {
    const keyword = partnerSearch.trim().toLowerCase();

    if (!keyword) {
      return partners;
    }

    return partners.filter((partner) =>
      partner.name.toLowerCase().includes(keyword),
    );
  }, [partners, partnerSearch]);

  const selectedPartners = useMemo(
    () =>
      form.partner_ids
        .map((id) => partners.find((partner) => partner.id === id))
        .filter((partner): partner is Partner => Boolean(partner)),
    [form.partner_ids, partners],
  );

  const togglePartner = (partnerId: number) => {
    setForm((previous) => {
      const alreadySelected = previous.partner_ids.includes(partnerId);

      return {
        ...previous,
        partner_ids: alreadySelected
          ? previous.partner_ids.filter((id) => id !== partnerId)
          : [...previous.partner_ids, partnerId],
      };
    });

    setErrors((previous) => ({
      ...previous,
      partner_ids: undefined,
    }));

    setServerError("");
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setServerError("");

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      if (mode === "edit" && !project?.id) {
        throw new Error(t.updateError);
      }

      /*
       * Data dikirim sebagai multipart/form-data agar file gambar
       * dapat ikut terkirim.
       *
       * Backend (Gin) membaca field ini dengan:
       *   c.PostForm("name_idn"), c.PostForm("name_en"), ...
       *   c.PostFormArray("partner_ids")
       *   c.FormFile("image")  -> opsional
       *
       * Jika "image" tidak dikirim saat edit, backend sebaiknya
       * mempertahankan gambar lama.
       */
      const formData = new FormData();

      formData.append("name_idn", form.name_idn.trim());
      formData.append("name_en", form.name_en.trim());
      formData.append("description_idn", form.description_idn.trim());
      formData.append("description_en", form.description_en.trim());

      // Format YYYY-MM, backend mengubahnya menjadi DATE.
      formData.append("start_period", form.start_period);

      // Kosong = project masih berjalan, jadi field tidak dikirim.
      if (form.end_period.trim()) {
        formData.append("end_period", form.end_period);
      }

      form.partner_ids.forEach((partnerId) => {
        formData.append("partner_ids", String(partnerId));
      });

      // Hanya kirim file jika user memilih gambar baru.
      if (form.image) {
        formData.append("image", form.image);
      }

      const url =
        mode === "create" ? PROJECTS_API : `${PROJECTS_API}/${project!.id}`;

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // JANGAN set "Content-Type" secara manual. Browser akan
          // mengisinya otomatis beserta boundary multipart.
        },
        body: formData,
      });

      await parseResponse(response);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Save partnership project error:", error);

      const message = getErrorMessage(
        error,
        mode === "create" ? t.createError : t.updateError,
      );

      setServerError(message);
      onError(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const handleClose = () => {
    if (saving) {
      return;
    }

    onClose();
  };

  // ==========================================================
  // STYLING
  // ==========================================================

  const labelClass = "text-sm font-medium text-foreground";

  const inputClass = (hasError: boolean) =>
    `mt-1.5 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-brand-dark/10 ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-border focus:border-brand-dark"
    }`;

  // ==========================================================
  // RENDER
  // ==========================================================

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partnership-form-title"
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2
              id="partnership-form-title"
              className="text-lg font-bold text-foreground"
            >
              {mode === "create" ? t.createTitle : t.editTitle}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "create" ? t.createDescription : t.editDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label={t.close}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {serverError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {serverError}
              </div>
            )}

            {/* PROJECT INFORMATION */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {t.basicInfo}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {t.requiredMark}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* NAME IDN */}
                <div>
                  <label htmlFor="partnership-name-idn" className={labelClass}>
                    {t.nameIDN}
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="partnership-name-idn"
                    type="text"
                    maxLength={255}
                    value={form.name_idn}
                    onChange={(event) =>
                      handleFieldChange("name_idn", event.target.value)
                    }
                    placeholder={t.nameIDNPlaceholder}
                    className={`${inputClass(Boolean(errors.name_idn))} h-10`}
                    aria-invalid={Boolean(errors.name_idn)}
                    disabled={saving}
                  />

                  {errors.name_idn && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.name_idn}
                    </p>
                  )}
                </div>

                {/* NAME EN */}
                <div>
                  <label htmlFor="partnership-name-en" className={labelClass}>
                    {t.nameEN}
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="partnership-name-en"
                    type="text"
                    maxLength={255}
                    value={form.name_en}
                    onChange={(event) =>
                      handleFieldChange("name_en", event.target.value)
                    }
                    placeholder={t.nameENPlaceholder}
                    className={`${inputClass(Boolean(errors.name_en))} h-10`}
                    aria-invalid={Boolean(errors.name_en)}
                    disabled={saving}
                  />

                  {errors.name_en && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.name_en}
                    </p>
                  )}
                </div>

                {/* DESCRIPTION IDN */}
                <div>
                  <label
                    htmlFor="partnership-description-idn"
                    className={labelClass}
                  >
                    {t.descriptionIDN}
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <textarea
                    id="partnership-description-idn"
                    rows={5}
                    maxLength={10000}
                    value={form.description_idn}
                    onChange={(event) =>
                      handleFieldChange("description_idn", event.target.value)
                    }
                    placeholder={t.descriptionIDNPlaceholder}
                    className={`${inputClass(Boolean(errors.description_idn))} resize-y py-2.5`}
                    aria-invalid={Boolean(errors.description_idn)}
                    disabled={saving}
                  />

                  {errors.description_idn && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.description_idn}
                    </p>
                  )}
                </div>

                {/* DESCRIPTION EN */}
                <div>
                  <label
                    htmlFor="partnership-description-en"
                    className={labelClass}
                  >
                    {t.descriptionEN}
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <textarea
                    id="partnership-description-en"
                    rows={5}
                    maxLength={10000}
                    value={form.description_en}
                    onChange={(event) =>
                      handleFieldChange("description_en", event.target.value)
                    }
                    placeholder={t.descriptionENPlaceholder}
                    className={`${inputClass(Boolean(errors.description_en))} resize-y py-2.5`}
                    aria-invalid={Boolean(errors.description_en)}
                    disabled={saving}
                  />

                  {errors.description_en && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.description_en}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* IMAGE */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-foreground">{t.image}</h3>

              <div className="flex flex-col gap-4 rounded-xl border border-dashed border-border p-4 sm:flex-row sm:items-center">
                <ProjectImagePreview
                  file={form.image}
                  fallbackUrl={project?.image ? getImageUrl(project.image) : ""}
                  alt={project?.name_idn ?? t.image}
                />

                <div className="min-w-0 flex-1">
                  <label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted">
                    {form.image || project?.image
                      ? t.changeImage
                      : t.selectImage}

                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      disabled={saving}
                      className="sr-only"
                    />
                  </label>

                  {form.image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={saving}
                      className="ml-2 inline-flex h-9 items-center rounded-lg px-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {t.removeImage}
                    </button>
                  )}

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {t.imageHint}
                  </p>

                  {mode === "edit" && project?.image && !form.image && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.currentImage}
                    </p>
                  )}
                </div>
              </div>

              {errors.image && (
                <p className="text-xs text-red-500">{errors.image}</p>
              )}
            </section>

            {/* PERIOD */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-foreground">{t.period}</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="partnership-start-period-month"
                    className={labelClass}
                  >
                    {t.startPeriod}
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <MonthYearPicker
                    id="partnership-start-period"
                    value={form.start_period}
                    onChange={(value) =>
                      handleFieldChange("start_period", value)
                    }
                    hasError={Boolean(errors.start_period)}
                    disabled={saving}
                    language={language === "en" ? "en" : "id"}
                  />

                  {errors.start_period && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.start_period}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="partnership-end-period-month"
                    className={labelClass}
                  >
                    {t.endPeriod}
                  </label>

                  <MonthYearPicker
                    id="partnership-end-period"
                    value={form.end_period}
                    onChange={(value) => handleFieldChange("end_period", value)}
                    hasError={Boolean(errors.end_period)}
                    disabled={saving}
                    language={language === "en" ? "en" : "id"}
                  />

                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {t.endPeriodHint}
                  </p>

                  {errors.end_period && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.end_period}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* PARTNERS */}
            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {t.partnerSection}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {t.partnerHint}
                </p>
              </div>

              {/* Selected partner chips */}
              {selectedPartners.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedPartners.map((partner) => (
                    <span
                      key={partner.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-brand-dark/20 bg-brand-dark/5 py-1.5 pl-2.5 pr-1.5 text-xs font-medium text-foreground"
                    >
                      {partner.name}

                      <button
                        type="button"
                        onClick={() => togglePartner(partner.id)}
                        disabled={saving}
                        aria-label={`${t.removePartner}: ${partner.name}`}
                        className="flex size-5 items-center justify-center rounded-md text-muted-foreground transition hover:bg-red-100 hover:text-red-600"
                      >
                        <X className="size-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Partner dropdown */}
              <div ref={partnerDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setPartnerDropdownOpen((previous) => !previous)
                  }
                  disabled={saving}
                  className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 text-left text-sm outline-none transition focus:ring-2 focus:ring-brand-dark/10 ${
                    errors.partner_ids
                      ? "border-red-400"
                      : "border-border focus:border-brand-dark"
                  }`}
                >
                  <span className="text-muted-foreground">
                    {form.partner_ids.length > 0
                      ? `${form.partner_ids.length} ${t.selectedPartners}`
                      : t.partnerHint}
                  </span>

                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                      partnerDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {partnerDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                    <div className="border-b border-border p-3">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <input
                          type="text"
                          value={partnerSearch}
                          onChange={(event) =>
                            setPartnerSearch(event.target.value)
                          }
                          placeholder={t.searchPartner}
                          className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-brand-dark"
                        />
                      </div>
                    </div>

                    <div className="max-h-56 overflow-y-auto p-1.5">
                      {loadingPartners ? (
                        <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground">
                          <LoaderCircle className="size-4 animate-spin" />
                          {t.loadingPartners}
                        </div>
                      ) : partnerError ? (
                        <div className="px-3 py-4 text-sm text-red-600">
                          <p>{partnerError}</p>

                          <button
                            type="button"
                            onClick={() =>
                              // Memicu fetch ulang tanpa menutup modal.
                              setPartnersFetchKey((previous) => previous + 1)
                            }
                            className="mt-2 font-medium underline"
                          >
                            {t.retry}
                          </button>
                        </div>
                      ) : partners.length === 0 ? (
                        <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                          {t.noPartners}
                        </p>
                      ) : filteredPartners.length === 0 ? (
                        <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                          {t.noPartnerMatch}
                        </p>
                      ) : (
                        filteredPartners.map((partner) => {
                          const selected = form.partner_ids.includes(
                            partner.id,
                          );

                          return (
                            <button
                              key={partner.id}
                              type="button"
                              onClick={() => togglePartner(partner.id)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-muted"
                            >
                              <span
                                className={`flex size-5 shrink-0 items-center justify-center rounded border ${
                                  selected
                                    ? "border-brand-dark bg-brand-dark text-white"
                                    : "border-border bg-background"
                                }`}
                              >
                                {selected && <Check className="size-3.5" />}
                              </span>

                              {partner.logo ? (
                                <img
                                  src={getImageUrl(partner.logo)}
                                  alt={partner.name}
                                  className="size-8 shrink-0 rounded-md border border-border bg-background object-contain p-0.5"
                                />
                              ) : (
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                  <ImageIcon className="size-4 text-muted-foreground" />
                                </div>
                              )}

                              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                                {partner.name}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {errors.partner_ids && (
                <p className="text-xs text-red-500">{errors.partner_ids}</p>
              )}
            </section>
          </div>

          {/* FOOTER */}
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="h-10 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white transition hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <LoaderCircle className="size-4 animate-spin" />}

              {saving ? t.saving : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
