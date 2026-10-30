"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  Image as ImageIcon,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";

import { useLanguage } from "@/components/language/language-provider";
import { getAuthToken } from "@/lib/auth";

import PartnershipFormModal from "@/components/dashboard/partnership-projects/partnership-form-modal";
import PartnershipViewModal from "@/components/dashboard/partnership-projects/partnership-view-modal";
import PartnershipDeleteModal from "@/components/dashboard/partnership-projects/partnership-delete-modal";

// =========================================================
// TYPES
// =========================================================

type Partner = {
  id: number;
  name: string;
  logo: string | null;
  created_at: string;
  updated_at: string;
};

type PartnershipProject = {
  id: number;
  name_idn: string;
  name_en: string;
  description_idn: string;
  description_en: string;
  image: string | null;
  start_period: number;
  end_period: number | null;
  created_at: string;
  updated_at: string;
  partners: Partner[];
};

type ToastType = "success" | "error";

type Toast = {
  type: ToastType;
  message: string;
};

type ModalMode = "create" | "edit" | "view" | "delete" | null;

type Translations = {
  pageTitle: string;
  dashboard: string;
  addProject: string;
  searchPlaceholder: string;
  rowsPerPage: string;
  number: string;
  projectName: string;
  period: string;
  partners: string;
  image: string;
  action: string;
  loading: string;
  loadFailed: string;
  notFound: string;
  notFoundDescription: string;
  view: string;
  edit: string;
  delete: string;
  closeNotification: string;
  closeActionMenu: string;
  previousPage: string;
  nextPage: string;
  openAction: string;
  showing: string;
  from: string;
  project: string;
  success: string;
  failed: string;
  projectAdded: string;
  projectUpdated: string;
  projectDeleted: string;
  authError: string;
  createError: string;
  updateError: string;
  deleteError: string;
  noImage: string;
  noPartner: string;
  ongoing: string;
  completed: string;
  upcoming: string;
  until: string;
};

const rowsPerPageOptions = [5, 10, 25, 50, 100];

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const translations: Record<"id" | "en", Translations> = {
  id: {
    pageTitle: "Project Kemitraan",
    dashboard: "Dashboard",
    addProject: "Tambah Project",
    searchPlaceholder: "Cari project kemitraan...",
    rowsPerPage: "Baris per halaman",
    number: "No.",
    projectName: "Nama Project",
    period: "Periode",
    partners: "Partner",
    image: "Gambar",
    action: "Aksi",
    loading: "Memuat data project kemitraan...",
    loadFailed: "Gagal memuat project kemitraan",
    notFound: "Project kemitraan tidak ditemukan",
    notFoundDescription: "Coba ubah kata pencarian.",
    view: "Lihat",
    edit: "Edit",
    delete: "Hapus",
    closeNotification: "Tutup notifikasi",
    closeActionMenu: "Tutup menu aksi",
    previousPage: "Halaman sebelumnya",
    nextPage: "Halaman berikutnya",
    openAction: "Buka aksi untuk",
    showing: "Menampilkan",
    from: "dari",
    project: "project",
    success: "Berhasil",
    failed: "Gagal",
    projectAdded: "Project kemitraan berhasil ditambahkan.",
    projectUpdated: "Project kemitraan berhasil diperbarui.",
    projectDeleted: "Project kemitraan berhasil dihapus.",
    authError: "Token autentikasi tidak ditemukan.",
    createError: "Gagal menambahkan project kemitraan.",
    updateError: "Gagal memperbarui project kemitraan.",
    deleteError: "Gagal menghapus project kemitraan.",
    noImage: "Tidak ada gambar",
    noPartner: "Belum ada partner",
    ongoing: "Sedang berlangsung",
    completed: "Selesai",
    upcoming: "Akan datang",
    until: "sampai",
  },

  en: {
    pageTitle: "Partnership Projects",
    dashboard: "Dashboard",
    addProject: "Add Project",
    searchPlaceholder: "Search partnership projects...",
    rowsPerPage: "Rows per page",
    number: "No.",
    projectName: "Project Name",
    period: "Period",
    partners: "Partners",
    image: "Image",
    action: "Actions",
    loading: "Loading partnership projects...",
    loadFailed: "Failed to load partnership projects",
    notFound: "No partnership projects found",
    notFoundDescription: "Try changing your search keyword.",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    closeNotification: "Close notification",
    closeActionMenu: "Close action menu",
    previousPage: "Previous page",
    nextPage: "Next page",
    openAction: "Open actions for",
    showing: "Showing",
    from: "of",
    project: "projects",
    success: "Success",
    failed: "Failed",
    projectAdded: "Partnership project successfully added.",
    projectUpdated: "Partnership project successfully updated.",
    projectDeleted: "Partnership project successfully deleted.",
    authError: "Authentication token not found.",
    createError: "Failed to add partnership project.",
    updateError: "Failed to update partnership project.",
    deleteError: "Failed to delete partnership project.",
    noImage: "No image",
    noPartner: "No partners",
    ongoing: "Ongoing",
    completed: "Completed",
    upcoming: "Upcoming",
    until: "to",
  },
};

// =========================================================
// HELPERS
// =========================================================

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function formatMonthYear(value: number | string | null) {
  if (value === null || value === undefined || value === "") {
    return "Sekarang";
  }

  // Jika API mengembalikan tanggal ISO, misalnya 2026-01-01T00:00:00Z
  if (typeof value === "string" && value.includes("-")) {
    const match = value.match(/^(\d{4})-(\d{2})/);

    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);

      if (month >= 1 && month <= 12) {
        return new Intl.DateTimeFormat("id-ID", {
          month: "long",
          year: "numeric",
        }).format(new Date(year, month - 1, 1));
      }
    }
  }

  // Jika API mengembalikan tahun berupa angka atau string angka
  const year = Number(value);

  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    return "-";
  }

  return String(year);
}

function getProjectTitle(project: PartnershipProject, language: "id" | "en") {
  return language === "id" ? project.name_idn : project.name_en;
}

function getProjectDescription(
  project: PartnershipProject,
  language: "id" | "en",
) {
  return language === "id" ? project.description_idn : project.description_en;
}

function getProjectImageUrl(image: string | null) {
  if (!image) {
    return null;
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/storage/${image.replace(/^storage\//, "")}`;
}

// =========================================================
// PAGE
// =========================================================

export default function PartnershipProjectsPage() {
  const { language } = useLanguage();
  const t = translations[language === "en" ? "en" : "id"];

  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<PartnershipProject[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [toast, setToast] = useState<Toast | null>(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [openAction, setOpenAction] = useState<number | null>(null);

  const [actionMenuPosition, setActionMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const [selectedProject, setSelectedProject] =
    useState<PartnershipProject | null>(null);

  // =======================================================
  // FETCH DATA
  // =======================================================

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch(
        `${API_URL}/api/admin/partnership-projects`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.loadFailed);
      }

      setProjects(
        Array.isArray(data.data)
          ? data.data.map((project: PartnershipProject) => ({
              ...project,
              partners: Array.isArray(project.partners) ? project.partners : [],
            }))
          : [],
      );
    } catch (error) {
      console.error("Get partnership projects error:", error);

      setError(error instanceof Error ? error.message : t.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [t.authError, t.loadFailed]);

  useEffect(() => {
    startTransition(() => {
      void fetchProjects();
    });
  }, [fetchProjects]);

  // =======================================================
  // TOAST
  // =======================================================

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  // =======================================================
  // SEARCH & PAGINATION
  // =======================================================

  const filteredProjects = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return projects;
    }

    return projects.filter((project) => {
      const titleIDN = project.name_idn?.toLowerCase() ?? "";
      const titleEN = project.name_en?.toLowerCase() ?? "";

      const descriptionIDN = project.description_idn?.toLowerCase() ?? "";

      const descriptionEN = project.description_en?.toLowerCase() ?? "";

      const partnerNames = (project.partners ?? [])
        .map((partner) => partner.name?.toLowerCase() ?? "")
        .join(" ");

      const period = `${project.start_period} ${project.end_period ?? ""}`;

      return (
        titleIDN.includes(searchValue) ||
        titleEN.includes(searchValue) ||
        descriptionIDN.includes(searchValue) ||
        descriptionEN.includes(searchValue) ||
        partnerNames.includes(searchValue) ||
        period.includes(searchValue)
      );
    });
  }, [projects, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / rowsPerPage),
  );

  // Gunakan halaman efektif tanpa setState di dalam useEffect.
  const effectivePage = Math.min(currentPage, totalPages);

  const paginatedProjects = useMemo(() => {
    const startIndex = (effectivePage - 1) * rowsPerPage;

    return filteredProjects.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProjects, effectivePage, rowsPerPage]);

  const startItem =
    filteredProjects.length === 0 ? 0 : (effectivePage - 1) * rowsPerPage + 1;

  const endItem = Math.min(
    effectivePage * rowsPerPage,
    filteredProjects.length,
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // =======================================================
  // MODAL
  // =======================================================

  const openCreateModal = () => {
    setSelectedProject(null);
    setModalMode("create");
  };

  const openEditModal = (project: PartnershipProject) => {
    setSelectedProject(project);
    setModalMode("edit");
  };

  const openViewModal = (project: PartnershipProject) => {
    setSelectedProject(project);
    setModalMode("view");
  };

  const openDeleteModal = (project: PartnershipProject) => {
    setSelectedProject(project);
    setModalMode("delete");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedProject(null);
  };

  // =======================================================
  // CRUD CALLBACKS
  // =======================================================

  const handleCreateSuccess = async () => {
    closeModal();

    await fetchProjects();

    setToast({
      type: "success",
      message: t.projectAdded,
    });
  };

  const handleCreateError = (message: string) => {
    setToast({
      type: "error",
      message: message || t.createError,
    });
  };

  const handleEditSuccess = async () => {
    closeModal();

    await fetchProjects();

    setToast({
      type: "success",
      message: t.projectUpdated,
    });
  };

  const handleEditError = (message: string) => {
    setToast({
      type: "error",
      message: message || t.updateError,
    });
  };

  const handleDeleteSuccess = async () => {
    closeModal();

    await fetchProjects();

    setToast({
      type: "success",
      message: t.projectDeleted,
    });
  };

  const handleDeleteError = (message: string) => {
    setToast({
      type: "error",
      message: message || t.deleteError,
    });
  };

  // =======================================================
  // PROJECT PERIOD
  // =======================================================

  const getPeriodStatus = (project: PartnershipProject) => {
    const currentYear = new Date().getFullYear();

    if (project.start_period > currentYear) {
      return {
        label: t.upcoming,
        className: "bg-blue-50 text-blue-700",
      };
    }

    if (project.end_period !== null && project.end_period < currentYear) {
      return {
        label: t.completed,
        className: "bg-gray-100 text-gray-600",
      };
    }

    return {
      label: t.ongoing,
      className: "bg-green-50 text-green-700",
    };
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      {/* Toast */}
      {toast && (
        <div className="fixed right-6 top-20 z-[200]">
          <div
            className={`flex min-w-[320px] max-w-[420px] items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div
              className={`mt-0.5 shrink-0 ${
                toast.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <CircleAlert className="size-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  toast.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {toast.type === "success" ? t.success : t.failed}
              </p>

              <p
                className={`mt-0.5 text-xs leading-5 ${
                  toast.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className={`shrink-0 transition-colors ${
                toast.type === "success"
                  ? "text-green-600 hover:text-green-800"
                  : "text-red-600 hover:text-red-800"
              }`}
              aria-label={t.closeNotification}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t.pageTitle}
            </h1>

            <div className="mt-1.5 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t.dashboard}</span>

              <span className="text-muted-foreground">/</span>

              <span className="font-medium text-brand-dark">{t.pageTitle}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90"
          >
            <Plus className="size-4" />
            {t.addProject}
          </button>
        </div>

        {/* Content */}
        <div className="relative rounded-xl border border-border bg-background shadow-sm">
          {/* Toolbar */}
          <div className="relative z-50 flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-[320px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
              />
            </div>

            {/* Rows per page */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="whitespace-nowrap">{t.rowsPerPage}:</span>

              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(event) =>
                    handleRowsPerPageChange(Number(event.target.value))
                  }
                  className="h-10 w-[75px] appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm font-medium text-foreground outline-none transition-colors focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                  aria-label={t.rowsPerPage}
                >
                  {rowsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto lg:overflow-x-visible">
            <table className="w-full min-w-[1000px] border-collapse lg:min-w-0 lg:table-fixed">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="w-[65px] px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground">
                    {t.number}
                  </th>

                  <th className="w-[30%] px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground">
                    {t.projectName}
                  </th>

                  <th className="w-[25%] px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground">
                    {t.period}
                  </th>

                  <th className="w-[25%] px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground">
                    {t.partners}
                  </th>

                  <th className="w-[90px] px-5 py-3 text-center text-sm font-bold tracking-wide text-foreground">
                    {t.action}
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t.loading}
                      </p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <p className="text-sm font-medium text-red-500">
                        {t.loadFailed}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {error}
                      </p>

                      <button
                        type="button"
                        onClick={() => void fetchProjects()}
                        className="mt-3 rounded-lg bg-brand-dark px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark/90"
                      >
                        Coba Lagi
                      </button>
                    </td>
                  </tr>
                ) : paginatedProjects.length > 0 ? (
                  paginatedProjects.map((project, index) => {
                    const title = getProjectTitle(project, language);
                    const description = getProjectDescription(
                      project,
                      language,
                    );

                    const imageUrl = getProjectImageUrl(project.image);
                    const status = getPeriodStatus(project);

                    return (
                      <tr
                        key={project.id}
                        className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/20"
                      >
                        {/* Number */}
                        <td className="px-5 py-3 text-sm font-medium text-muted-foreground">
                          {String(
                            (currentPage - 1) * rowsPerPage + index + 1,
                          ).padStart(2, "0")}
                        </td>

                        {/* Project */}
                        <td className="px-5 py-3">
                          <div className="flex min-w-0 items-center gap-3">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={title}
                                className="size-12 shrink-0 rounded-lg border border-border bg-muted object-cover"
                              />
                            ) : (
                              <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <ImageIcon className="size-5 text-muted-foreground" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p
                                className="truncate text-sm font-semibold text-foreground"
                                title={title}
                              >
                                {truncateText(title || "-", 65)}
                              </p>

                              <p
                                className="mt-1 truncate text-xs text-muted-foreground"
                                title={description}
                              >
                                {truncateText(description || "-", 75)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Period */}
                        <td className="px-3 py-3">
                          <p className="whitespace-nowrap text-sm font-medium text-foreground">
                            {formatMonthYear(project.start_period)} -{" "}
                            {formatMonthYear(project.end_period)}
                          </p>

                          <span
                            className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        {/* Partners */}
                        <td className="px-5 py-3">
                          {project.partners.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {project.partners.slice(0, 3).map((partner) => (
                                <span
                                  key={partner.id}
                                  className="inline-flex max-w-full truncate rounded-md border border-border bg-muted/50 px-2 py-1 text-xs font-medium text-foreground"
                                  title={partner.name}
                                >
                                  {truncateText(
                                    partner.name || `Partner #${partner.id}`,
                                    24,
                                  )}
                                </span>
                              ))}

                              {project.partners.length > 3 && (
                                <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                                  +{project.partners.length - 3}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {t.noPartner}
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-3 text-center">
                          <button
                            type="button"
                            onClick={(event) => {
                              const rect =
                                event.currentTarget.getBoundingClientRect();

                              if (openAction === project.id) {
                                setOpenAction(null);
                                setActionMenuPosition(null);
                                return;
                              }

                              const menuHeight = 130;
                              const menuGap = 4;

                              const spaceBelow =
                                window.innerHeight - rect.bottom;

                              const top =
                                spaceBelow >= menuHeight + menuGap
                                  ? rect.bottom + menuGap
                                  : rect.top - menuHeight - menuGap;

                              setOpenAction(project.id);

                              setActionMenuPosition({
                                top,
                                right: window.innerWidth - rect.right,
                              });
                            }}
                            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={`${t.openAction} ${getProjectTitle(project, language)}`}
                            aria-expanded={openAction === project.id}
                          >
                            <MoreVertical className="size-5" />
                          </button>

                          {openAction === project.id && actionMenuPosition && (
                            <>
                              {/* Overlay */}
                              <button
                                type="button"
                                aria-label={t.closeActionMenu}
                                onClick={() => {
                                  setOpenAction(null);
                                  setActionMenuPosition(null);
                                }}
                                className="fixed inset-0 z-[9998] cursor-default"
                              />

                              {/* Action Menu */}
                              <div
                                className="fixed z-[9999] w-40 overflow-hidden rounded-lg border border-border bg-background p-1.5 text-left shadow-lg"
                                style={{
                                  top: `${actionMenuPosition.top}px`,
                                  right: `${actionMenuPosition.right}px`,
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    openViewModal(project);
                                    setOpenAction(null);
                                    setActionMenuPosition(null);
                                  }}
                                  className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
                                >
                                  <Eye className="size-4" />
                                  {t.view}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    openEditModal(project);
                                    setOpenAction(null);
                                    setActionMenuPosition(null);
                                  }}
                                  className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm text-amber-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                >
                                  <Pencil className="size-4" />
                                  {t.edit}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    openDeleteModal(project);
                                    setOpenAction(null);
                                    setActionMenuPosition(null);
                                  }}
                                  className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="size-4" />
                                  {t.delete}
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <Search className="size-5" />
                        </div>

                        <p className="text-sm font-medium text-foreground">
                          {t.notFound}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {t.notFoundDescription}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              {t.showing}{" "}
              <span className="font-medium text-foreground">
                {startItem}-{endItem}
              </span>{" "}
              {t.from}{" "}
              <span className="font-medium text-foreground">
                {filteredProjects.length}
              </span>{" "}
              {t.project}
            </p>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t.previousPage}
              >
                <ChevronLeft className="size-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-brand-dark text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t.nextPage}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create & Edit Modal */}
      <PartnershipFormModal
        key={`${modalMode}-${selectedProject?.id ?? "new"}`}
        open={modalMode === "create" || modalMode === "edit"}
        mode={modalMode === "edit" ? "edit" : "create"}
        project={selectedProject}
        onClose={closeModal}
        onSuccess={
          modalMode === "edit" ? handleEditSuccess : handleCreateSuccess
        }
        onError={modalMode === "edit" ? handleEditError : handleCreateError}
      />

      {/* View Modal */}
      <PartnershipViewModal
        open={modalMode === "view"}
        project={selectedProject}
        onClose={closeModal}
      />

      {/* Delete Modal */}
      <PartnershipDeleteModal
        open={modalMode === "delete"}
        project={selectedProject}
        onClose={closeModal}
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />
    </div>
  );
}
