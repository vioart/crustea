"use client";
import TeamMemberFormModal from "@/components/dashboard/team/team-member-form-modal";
import TeamMemberDeleteModal from "@/components/dashboard/team/team-member-delete-modal";

import {
  CheckCircle2,
  CircleAlert,
  GripVertical,
  Image as ImageIcon,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { FaLinkedinIn } from "react-icons/fa";

import {
  type DragEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useLanguage } from "@/components/language/language-provider";
import { getAuthToken } from "@/lib/auth";

// ============================================================
// TYPES
// ============================================================

type TeamMember = {
  id: number;
  name: string;
  position: string;
  photo_path: string;
  linkedin_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ModalMode = "create" | "edit" | "delete" | null;

type Toast = {
  type: "success" | "error";
  message: string;
};

// ============================================================
// TRANSLATIONS
// ============================================================

const translations = {
  id: {
    pageTitle: "Team",
    breadcrumb: "Dashboard",

    description:
      "Kelola anggota tim Crustea dan atur urutan tampilnya di website.",

    addMember: "Tambah Anggota",
    refresh: "Muat Ulang",
    loading: "Memuat anggota tim...",
    loadingError: "Gagal memuat anggota tim.",
    empty: "Belum ada anggota tim.",
    emptyDescription: "Tambahkan anggota tim untuk mulai mengelola daftar.",

    total: "Total Anggota",
    active: "Aktif",
    inactive: "Tidak Aktif",

    position: "Jabatan",
    name: "Nama Lengkap",
    photo: "Foto Anggota",
    linkedin: "LinkedIn",
    linkedinOptional: "LinkedIn (Opsional)",

    namePlaceholder: "Masukkan nama lengkap",
    positionPlaceholder: "Contoh: Software Engineer",
    linkedinPlaceholder: "https://linkedin.com/in/username",

    photoHint: "Format JPG, PNG, atau WEBP. Maksimal 2 MB.",
    changePhoto: "Ganti Foto",
    selectPhoto: "Pilih Foto",
    removePhoto: "Hapus pilihan foto",
    currentPhoto: "Foto saat ini",

    activeStatus: "Aktif",
    inactiveStatus: "Tidak Aktif",
    activate: "Aktifkan",
    deactivate: "Nonaktifkan",

    dragHint: "Geser card untuk mengubah urutan anggota.",
    savingOrder: "Menyimpan urutan...",
    orderSaved: "Urutan anggota berhasil diperbarui.",
    orderError: "Gagal memperbarui urutan anggota.",

    createTitle: "Tambah Anggota Tim",
    createDescription: "Lengkapi informasi anggota tim baru.",
    editTitle: "Edit Anggota Tim",
    editDescription: "Perbarui informasi anggota tim.",
    deleteTitle: "Hapus Anggota Tim",
    deleteDescription:
      "Apakah kamu yakin ingin menghapus anggota tim ini? Foto anggota juga dapat terhapus dari penyimpanan.",

    createSuccess: "Anggota tim berhasil ditambahkan.",
    updateSuccess: "Anggota tim berhasil diperbarui.",
    deleteSuccess: "Anggota tim berhasil dihapus.",
    statusSuccess: "Status anggota berhasil diperbarui.",

    createError: "Gagal menambahkan anggota tim.",
    updateError: "Gagal memperbarui anggota tim.",
    deleteError: "Gagal menghapus anggota tim.",
    statusError: "Gagal memperbarui status anggota.",
    authError: "Token autentikasi tidak ditemukan.",

    requiredName: "Nama wajib diisi.",
    nameTooLong: "Nama maksimal 150 karakter.",
    requiredPosition: "Jabatan wajib diisi.",
    positionTooLong: "Jabatan maksimal 100 karakter.",
    invalidLinkedin: "Masukkan URL LinkedIn yang valid.",
    requiredPhoto: "Foto anggota wajib dipilih.",
    invalidPhoto: "Format foto harus JPG, PNG, atau WEBP.",
    photoTooLarge: "Ukuran foto maksimal 2 MB.",

    save: "Simpan",
    saving: "Menyimpan...",
    cancel: "Batal",
    delete: "Hapus",
    deleting: "Menghapus...",
    close: "Tutup",

    success: "Berhasil",
    failed: "Gagal",
    closeNotification: "Tutup notifikasi",

    noPhoto: "Belum ada foto",
    confirm: "Ya, Hapus Anggota",
    validationError: "Periksa kembali data yang dimasukkan.",

    dragUnavailable: "Urutan tidak dapat diubah saat pencarian aktif.",
    unexpectedError: "Terjadi kesalahan. Silakan coba lagi.",
  },

  en: {
    pageTitle: "Team",
    breadcrumb: "Dashboard",

    description:
      "Manage Crustea team members and arrange their display order on the website.",

    addMember: "Add Member",
    refresh: "Refresh",
    loading: "Loading team members...",
    loadingError: "Failed to load team members.",
    empty: "No team members yet.",
    emptyDescription: "Add a team member to start managing the list.",

    total: "Total Members",
    active: "Active",
    inactive: "Inactive",

    position: "Position",
    name: "Full Name",
    photo: "Member Photo",
    linkedin: "LinkedIn",
    linkedinOptional: "LinkedIn (Optional)",

    namePlaceholder: "Enter full name",
    positionPlaceholder: "Example: Software Engineer",
    linkedinPlaceholder: "https://linkedin.com/in/username",

    photoHint: "JPG, PNG, or WEBP. Maximum size 2 MB.",
    changePhoto: "Change Photo",
    selectPhoto: "Choose Photo",
    removePhoto: "Remove selected photo",
    currentPhoto: "Current photo",

    activeStatus: "Active",
    inactiveStatus: "Inactive",
    activate: "Activate",
    deactivate: "Deactivate",

    dragHint: "Drag a card to change the member order.",
    savingOrder: "Saving order...",
    orderSaved: "Team member order updated successfully.",
    orderError: "Failed to update team member order.",

    createTitle: "Add Team Member",
    createDescription: "Complete the new team member's information.",
    editTitle: "Edit Team Member",
    editDescription: "Update team member information.",
    deleteTitle: "Delete Team Member",
    deleteDescription:
      "Are you sure you want to delete this team member? Their photo may also be deleted from storage.",

    createSuccess: "Team member added successfully.",
    updateSuccess: "Team member updated successfully.",
    deleteSuccess: "Team member deleted successfully.",
    statusSuccess: "Member status updated successfully.",

    createError: "Failed to add team member.",
    updateError: "Failed to update team member.",
    deleteError: "Failed to delete team member.",
    statusError: "Failed to update member status.",
    authError: "Authentication token not found.",

    requiredName: "Name is required.",
    nameTooLong: "Name must not exceed 150 characters.",
    requiredPosition: "Position is required.",
    positionTooLong: "Position must not exceed 100 characters.",
    invalidLinkedin: "Enter a valid LinkedIn URL.",
    requiredPhoto: "A member photo is required.",
    invalidPhoto: "Photo must be JPG, PNG, or WEBP.",
    photoTooLarge: "Photo size must not exceed 2 MB.",

    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting...",
    close: "Close",

    success: "Success",
    failed: "Failed",
    closeNotification: "Close notification",

    noPhoto: "No photo",
    confirm: "Yes, Delete Member",
    validationError: "Please review the entered information.",

    dragUnavailable: "Reordering is unavailable while a search is active.",
    unexpectedError: "Something went wrong. Please try again.",
  },
} as const;

// ============================================================
// CONSTANTS & HELPERS
// ============================================================

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

function getPhotoUrl(photoPath: string) {
  if (!photoPath) return "";

  if (/^https?:\/\//i.test(photoPath)) {
    return photoPath;
  }

  return `${API_URL}${photoPath.startsWith("/") ? "" : "/"}${photoPath}`;
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
// MAIN PAGE
// ============================================================

export default function TeamPage() {
  const { language } = useLanguage();

  const t = translations[language];

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const [toast, setToast] = useState<Toast | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  // ----------------------------------------------------------
  // FETCH MEMBERS
  // ----------------------------------------------------------

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch(`${API_URL}/api/admin/team`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await parseResponse(response);
      const result: TeamMember[] = data.data ?? [];

      setMembers(
        [...result].sort(
          (a, b) => a.display_order - b.display_order || a.id - b.id,
        ),
      );
    } catch (err) {
      console.error("Fetch team members error:", err);
      setError(getErrorMessage(err, t.loadingError));
    } finally {
      setLoading(false);
    }
  }, [t.authError, t.loadingError]);

  // Initial fetch: update React state only after the async request settles.
  // This avoids synchronous setState calls from inside the effect.
  useEffect(() => {
    let cancelled = false;

    const loadInitialMembers = async () => {
      try {
        // Yield before any possible state update, including the missing-token path.
        await Promise.resolve();

        const token = getAuthToken();

        if (!token) {
          throw new Error(t.authError);
        }

        const response = await fetch(`${API_URL}/api/admin/team`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await parseResponse(response);
        const result: TeamMember[] = data.data ?? [];

        if (cancelled) return;

        setMembers(
          [...result].sort(
            (a, b) => a.display_order - b.display_order || a.id - b.id,
          ),
        );
        setError("");
      } catch (err) {
        if (cancelled) return;

        console.error("Fetch team members error:", err);
        setError(getErrorMessage(err, t.loadingError));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInitialMembers();

    return () => {
      cancelled = true;
    };
  }, [t.authError, t.loadingError]);

  // ----------------------------------------------------------
  // TOAST
  // ----------------------------------------------------------

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showError = (message: string) => {
    setToast({
      type: "error",
      message,
    });
  };

  const showSuccess = (message: string) => {
    setToast({
      type: "success",
      message,
    });
  };

  // ----------------------------------------------------------
  // MODAL HANDLERS
  // ----------------------------------------------------------

  const openCreateModal = () => {
    setSelectedMember(null);
    setModalMode("create");
  };

  const openEditModal = (member: TeamMember) => {
    setSelectedMember(member);
    setModalMode("edit");
  };

  const openDeleteModal = (member: TeamMember) => {
    setSelectedMember(member);
    setModalMode("delete");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedMember(null);
  };

  const handleCreateSuccess = async () => {
    closeModal();

    await fetchMembers();

    showSuccess(t.createSuccess);
  };

  const handleEditSuccess = async () => {
    closeModal();

    await fetchMembers();

    showSuccess(t.updateSuccess);
  };

  const handleDeleteSuccess = async () => {
    closeModal();

    await fetchMembers();

    showSuccess(t.deleteSuccess);
  };

  // ----------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------

  const filteredMembers = members.filter((member) => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return true;

    return (
      member.name.toLowerCase().includes(keyword) ||
      member.position.toLowerCase().includes(keyword)
    );
  });

  // ----------------------------------------------------------
  // DRAG AND DROP
  // ----------------------------------------------------------

  const handleDragStart = (event: DragEvent<HTMLElement>, memberId: number) => {
    if (search.trim() || savingOrder) {
      event.preventDefault();
      return;
    }

    setDraggedId(memberId);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(memberId));
  };

  const handleDragOver = (event: DragEvent<HTMLElement>, targetId: number) => {
    event.preventDefault();

    if (draggedId === null || draggedId === targetId) {
      return;
    }

    setDragOverId(targetId);
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (
    event: DragEvent<HTMLElement>,
    targetId: number,
  ) => {
    event.preventDefault();

    const transferId = Number(event.dataTransfer.getData("text/plain"));
    const sourceId = transferId || draggedId || 0;

    setDragOverId(null);
    setDraggedId(null);

    if (!sourceId || sourceId === targetId || search.trim() || savingOrder) {
      return;
    }

    const previousMembers = [...members];

    const reordered = [...members];

    const sourceIndex = reordered.findIndex((member) => member.id === sourceId);

    const targetIndex = reordered.findIndex((member) => member.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) {
      return;
    }

    const [movedMember] = reordered.splice(sourceIndex, 1);

    reordered.splice(targetIndex, 0, movedMember);

    const updatedMembers = reordered.map((member, index) => ({
      ...member,
      display_order: index + 1,
    }));

    setMembers(updatedMembers);
    setSavingOrder(true);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      // Update each member's display_order.
      // Endpoint: PATCH /api/admin/team/:id/order
      for (const member of updatedMembers) {
        const response = await fetch(
          `${API_URL}/api/admin/team/${member.id}/order`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              display_order: member.display_order,
            }),
          },
        );

        await parseResponse(response);
      }

      showSuccess(t.orderSaved);
    } catch (err) {
      console.error("Reorder team members error:", err);

      // Restore the original order if the API fails.
      setMembers(previousMembers);

      const message =
        err instanceof TypeError && err.message.toLowerCase().includes("fetch")
          ? `${t.orderError} Periksa koneksi API (${API_URL || "NEXT_PUBLIC_API_URL belum diatur"}), CORS, dan log backend.`
          : getErrorMessage(err, t.orderError);

      showError(message);
    } finally {
      setSavingOrder(false);
    }
  };

  // ----------------------------------------------------------
  // ACTIVE STATUS
  // ----------------------------------------------------------

  const handleToggleStatus = async (member: TeamMember) => {
    try {
      setUpdatingStatus(member.id);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch(
        `${API_URL}/api/admin/team/${member.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_active: !member.is_active,
          }),
        },
      );

      await parseResponse(response);

      setMembers((previous) =>
        previous.map((item) =>
          item.id === member.id
            ? { ...item, is_active: !item.is_active }
            : item,
        ),
      );

      showSuccess(t.statusSuccess);
    } catch (err) {
      console.error("Update team member status error:", err);

      showError(getErrorMessage(err, t.statusError));
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      {/* TOAST */}
      {toast && (
        <div className="fixed right-4 top-20 z-[500] w-[calc(100%-2rem)] max-w-md sm:right-6">
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
            ) : (
              <CircleAlert className="mt-0.5 size-5 shrink-0 text-red-600" />
            )}

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  toast.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {toast.type === "success" ? t.success : t.failed}
              </p>

              <p className="mt-1 break-words text-xs leading-5 text-slate-600">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label={t.closeNotification}
              className="text-slate-500 hover:text-slate-800"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t.pageTitle}
            </h1>

            <div className="mt-1.5 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t.breadcrumb}</span>

              <span className="text-muted-foreground">/</span>

              <span className="font-medium text-brand-dark">{t.pageTitle}</span>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {t.description}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void fetchMembers()}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
            >
              <RefreshCw
                className={`size-4 ${loading ? "animate-spin" : ""}`}
              />
              {t.refresh}
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition hover:bg-brand-dark/90"
            >
              <Plus className="size-4" />
              {t.addMember}
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label={t.total}
            value={members.length}
            icon={<Users className="size-5" />}
          />

          <SummaryCard
            label={t.active}
            value={members.filter((member) => member.is_active).length}
            icon={<CheckCircle2 className="size-5" />}
          />

          <SummaryCard
            label={t.inactive}
            value={members.filter((member) => !member.is_active).length}
            icon={<CircleAlert className="size-5" />}
          />
        </div>

        {/* MAIN CONTENT */}
        <section className="rounded-xl border border-border bg-background shadow-sm">
          {/* SEARCH AND DRAG HINT */}
          <div className="flex flex-col gap-3 border-b border-border px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  language === "id"
                    ? "Cari nama atau jabatan..."
                    : "Search name or position..."
                }
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GripVertical className="size-4 shrink-0" />

              <span>{search.trim() ? t.dragUnavailable : t.dragHint}</span>
            </div>
          </div>

          <div className="p-5">
            {loading ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3">
                <LoaderCircle className="size-7 animate-spin text-brand-dark" />

                <p className="text-sm text-muted-foreground">{t.loading}</p>
              </div>
            ) : error ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <CircleAlert className="mb-3 size-8 text-red-500" />

                <p className="text-sm font-semibold text-foreground">
                  {t.loadingError}
                </p>

                <p className="mt-2 max-w-lg break-words text-sm text-muted-foreground">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void fetchMembers()}
                  className="mt-4 rounded-lg bg-brand-dark px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark/90"
                >
                  {t.refresh}
                </button>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
                  <Users className="size-6 text-muted-foreground" />
                </div>

                <p className="text-sm font-semibold text-foreground">
                  {t.empty}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {search ? t.emptyDescription : t.emptyDescription}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-dark px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark/90"
                  >
                    <Plus className="size-4" />
                    {t.addMember}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredMembers.map((member) => (
                  <article
                    key={member.id}
                    draggable={!search.trim() && !savingOrder}
                    onDragStart={(event) => handleDragStart(event, member.id)}
                    onDragOver={(event) => handleDragOver(event, member.id)}
                    onDrop={(event) => {
                      void handleDrop(event, member.id);
                    }}
                    onDragEnd={() => {
                      setDraggedId(null);
                      setDragOverId(null);
                    }}
                    className={`flex min-w-0 flex-col overflow-hidden rounded-xl border bg-background transition-all ${
                      draggedId === member.id
                        ? "scale-[0.98] opacity-40"
                        : "opacity-100"
                    } ${
                      dragOverId === member.id
                        ? "border-brand-dark ring-2 ring-brand-dark/20"
                        : "border-border"
                    } ${
                      !search.trim() && !savingOrder
                        ? "cursor-grab active:cursor-grabbing"
                        : ""
                    }`}
                  >
                    {/* CARD HEADER */}
                    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <GripVertical className="size-4 shrink-0 text-muted-foreground" />

                        <span className="text-xs font-semibold text-muted-foreground">
                          {language === "id" ? "Urutan" : "Order"}{" "}
                          {member.display_order}
                        </span>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          member.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            member.is_active ? "bg-green-500" : "bg-slate-400"
                          }`}
                        />

                        {member.is_active ? t.activeStatus : t.inactiveStatus}
                      </span>
                    </div>

                    {/* MEMBER IDENTITY */}
                    <div className="flex flex-1 items-center gap-4 p-4">
                      <div className="flex size-[76px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                        {member.photo_path ? (
                          <img
                            src={getPhotoUrl(member.photo_path)}
                            alt={member.name}
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="size-7 text-muted-foreground" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="break-words text-sm font-bold text-foreground">
                          {member.name}
                        </h2>

                        <p className="mt-1 break-words text-sm text-muted-foreground">
                          {member.position}
                        </p>

                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="mt-2 inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            <FaLinkedinIn className="size-3.5 shrink-0" />

                            <span className="truncate">LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* CARD ACTIONS */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/20 px-4 py-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={member.is_active}
                        aria-label={
                          language === "id"
                            ? `${member.is_active ? "Nonaktifkan" : "Aktifkan"} ${member.name}`
                            : `${member.is_active ? "Deactivate" : "Activate"} ${member.name}`
                        }
                        onClick={() => void handleToggleStatus(member)}
                        disabled={updatingStatus === member.id}
                        className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                            member.is_active ? "bg-green-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
                              member.is_active ? "translate-x-[22px]" : "translate-x-0.5"
                            }`}
                          />
                          {updatingStatus === member.id && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <LoaderCircle className="size-3 animate-spin text-slate-700" />
                            </span>
                          )}
                        </span>
                        <span>
                          {member.is_active ? t.activeStatus : t.inactiveStatus}
                        </span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(member)}
                          title={t.editTitle}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openDeleteModal(member)}
                          title={t.deleteTitle}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* ORDER SAVE INDICATOR */}
            {savingOrder && (
              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                {t.savingOrder}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ======================================================
          CREATE MODAL
      ====================================================== */}

      {modalMode === "create" && (
        <TeamMemberFormModal
          key="create"
          open
          mode="create"
          member={null}
          language={language}
          onClose={closeModal}
          onSuccess={handleCreateSuccess}
          onError={showError}
        />
      )}

      {/* ======================================================
          EDIT MODAL
      ====================================================== */}

      {modalMode === "edit" && (
        <TeamMemberFormModal
          key={`edit-${selectedMember?.id ?? "empty"}`}
          open
          mode="edit"
          member={selectedMember}
          language={language}
          onClose={closeModal}
          onSuccess={handleEditSuccess}
          onError={showError}
        />
      )}

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      <TeamMemberDeleteModal
        key={`delete-${selectedMember?.id ?? "empty"}`}
        open={modalMode === "delete"}
        member={selectedMember}
        language={language}
        onClose={closeModal}
        onSuccess={handleDeleteSuccess}
        onError={showError}
      />
    </div>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-brand-dark">
        {icon}
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{label}</p>

        <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
