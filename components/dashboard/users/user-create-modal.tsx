"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Image as ImageIcon, Loader2, ShieldUser, X } from "lucide-react";

import { getAuthToken } from "@/lib/auth";
import { useLanguage } from "@/components/language/language-provider";

const translations = {
  id: {
    title: "Tambah Pengguna",
    description: "Lengkapi informasi pengguna yang akan ditambahkan.",

    name: "Nama",
    email: "Email",
    password: "Password",
    confirmPassword: "Konfirmasi Password",
    avatar: "Avatar",

    namePlaceholder: "Masukkan nama pengguna...",
    emailPlaceholder: "Masukkan email pengguna...",
    passwordPlaceholder: "Masukkan password...",
    confirmPasswordPlaceholder: "Konfirmasi password...",

    chooseFile: "Choose Files",
    noFile: "No file chosen",

    close: "Tutup modal",
    cancel: "Batal",
    save: "Simpan Pengguna",
    saving: "Menyimpan...",

    authError: "Token autentikasi tidak ditemukan.",
    createError: "Gagal menambahkan pengguna.",

    requiredName: "Nama wajib diisi.",
    requiredEmail: "Email wajib diisi.",
    invalidEmail: "Format email tidak valid.",
    requiredPassword: "Password wajib diisi.",
    requiredConfirmPassword: "Konfirmasi password wajib diisi.",
    passwordMismatch: "Konfirmasi password tidak cocok.",

    invalidFile: "File avatar harus berupa gambar.",
    fileTooLarge: "Ukuran avatar maksimal 2 MB.",
  },

  en: {
    title: "Add User",
    description: "Complete the information for the new user.",

    name: "Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    avatar: "Avatar",

    namePlaceholder: "Enter user name...",
    emailPlaceholder: "Enter user email...",
    passwordPlaceholder: "Enter password...",
    confirmPasswordPlaceholder: "Confirm password...",

    chooseFile: "Choose Files",
    noFile: "No file chosen",

    close: "Close modal",
    cancel: "Cancel",
    save: "Save User",
    saving: "Saving...",

    authError: "Authentication token not found.",
    createError: "Failed to add user.",

    requiredName: "Name is required.",
    requiredEmail: "Email is required.",
    invalidEmail: "Invalid email format.",
    requiredPassword: "Password is required.",
    requiredConfirmPassword: "Password confirmation is required.",
    passwordMismatch: "Password confirmation does not match.",
    invalidFile: "Avatar file must be an image.",
    fileTooLarge: "Avatar size must not exceed 2 MB.",
  },
};

type UserCreateModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function UserCreateModal({
  open,
  onClose,
  onSuccess,
  onError,
}: UserCreateModalProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarFileName, setAvatarFileName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  if (!open) {
    return null;
  }

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // =========================
    // VALIDASI TYPE
    // =========================

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        avatar: t.invalidFile,
      }));

      setAvatarFile(null);
      setAvatarFileName("");
      setAvatarPreview("");

      return;
    }

    // =========================
    // VALIDASI SIZE
    // =========================

    const maxFileSize = 2 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setErrors((prev) => ({
        ...prev,
        avatar: t.fileTooLarge,
      }));

      setAvatarFile(null);
      setAvatarFileName("");
      setAvatarPreview("");

      return;
    }

    // =========================
    // FILE VALID
    // =========================

    setErrors((prev) => ({
      ...prev,
      avatar: "",
    }));

    setAvatarFile(file);
    setAvatarFileName(file.name);

    // Preview saja.
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setAvatarPreview(result);
      }
    };

    reader.readAsDataURL(file);
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: errors.avatar,
    };

    // =========================
    // VALIDASI NAME
    // =========================

    if (!name.trim()) {
      newErrors.name = t.requiredName;
    }

    // =========================
    // VALIDASI EMAIL
    // =========================

    if (!email.trim()) {
      newErrors.email = t.requiredEmail;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = t.invalidEmail;
    }

    // =========================
    // VALIDASI PASSWORD
    // =========================

    if (!password.trim()) {
      newErrors.password = t.requiredPassword;
    }

    // =========================
    // VALIDASI CONFIRM PASSWORD
    // =========================

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t.requiredConfirmPassword;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch;
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);

    if (hasErrors) {
      return;
    }

    try {
      setSaving(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      // =========================
      // FORM DATA
      // =========================

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("password", password.trim());

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // =========================
      // REQUEST
      // =========================

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.createError);
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Create user error:", error);

      onError(error instanceof Error ? error.message : t.createError);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) {
      return;
    }

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAvatarFile(null);
    setAvatarFileName("");
    setAvatarPreview("");

    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    });

    onClose();
  };

  const inputClass = (error: string) =>
    `h-11 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60 ${
      error
        ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
        : "border-border focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
    }`;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[720px] overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-dark">
              <ShieldUser className="size-6" strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {t.title}
              </h2>

              <p className="mt-1 max-w-[460px] text-sm leading-5 text-muted-foreground">
                {t.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="ml-4 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t.close}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100vh-280px)] space-y-5 overflow-y-auto px-6 py-6">
            {/* Name + Email */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="user-name"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  {t.name} <span className="text-red-500">*</span>
                </label>

                <input
                  id="user-name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);

                    if (errors.name) {
                      setErrors((prev) => ({
                        ...prev,
                        name: "",
                      }));
                    }
                  }}
                  placeholder={t.namePlaceholder}
                  required
                  disabled={saving}
                  className={inputClass(errors.name)}
                />

                {errors.name && (
                  <span className="mt-1.5 block text-xs font-medium text-red-500">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="user-email"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  {t.email} <span className="text-red-500">*</span>
                </label>

                <input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);

                    if (errors.email) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                      }));
                    }
                  }}
                  placeholder={t.emailPlaceholder}
                  required
                  disabled={saving}
                  className={inputClass(errors.email)}
                />

                {errors.email && (
                  <span className="mt-1.5 block text-xs font-medium text-red-500">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Password */}
              <div>
                <label
                  htmlFor="user-password"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  {t.password} <span className="text-red-500">*</span>
                </label>

                <input
                  id="user-password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);

                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                      confirmPassword:
                        confirmPassword &&
                        event.target.value !== confirmPassword
                          ? t.passwordMismatch
                          : "",
                    }));
                  }}
                  placeholder={t.passwordPlaceholder}
                  required
                  disabled={saving}
                  className={inputClass(errors.password)}
                />

                {errors.password && (
                  <span className="mt-1.5 block text-xs font-medium text-red-500">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="user-confirm-password"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  {t.confirmPassword} <span className="text-red-500">*</span>
                </label>

                <input
                  id="user-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    const value = event.target.value;

                    setConfirmPassword(value);

                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword:
                        value && value !== password ? t.passwordMismatch : "",
                    }));
                  }}
                  placeholder={t.confirmPasswordPlaceholder}
                  required
                  disabled={saving}
                  className={inputClass(errors.confirmPassword)}
                />

                {errors.confirmPassword && (
                  <span className="mt-1.5 block text-xs font-medium text-red-500">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            {/* Avatar */}
            <div>
              <label
                htmlFor="user-avatar"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                {t.avatar}
              </label>

              <div className="flex items-center gap-5">
                {/* Avatar Preview */}
                <div className="size-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={t.avatar}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <ImageIcon className="size-9 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* File Input */}
                <label
                  htmlFor="user-avatar"
                  className={`flex h-11 min-w-0 flex-1 cursor-pointer overflow-hidden rounded-lg border bg-background transition-colors ${
                    errors.avatar
                      ? "border-red-500 ring-2 ring-red-500/10"
                      : "border-border hover:border-brand-dark"
                  }`}
                >
                  <span className="inline-flex shrink-0 items-center border-r border-border bg-muted/30 px-4 text-sm font-medium text-muted-foreground">
                    {t.chooseFile}
                  </span>

                  <span className="flex min-w-0 items-center px-3 text-sm text-muted-foreground">
                    <span className="truncate">
                      {avatarFileName || t.noFile}
                    </span>
                  </span>

                  <input
                    id="user-avatar"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    disabled={saving}
                    className="sr-only"
                  />
                </label>
              </div>

              {errors.avatar && (
                <span className="mt-1.5 block text-xs font-medium text-red-500">
                  {errors.avatar}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="h-10 rounded-lg border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t.saving}
                </>
              ) : (
                t.save
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
