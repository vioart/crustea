"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { getAuthToken, getAuthUser, type AuthUser } from "@/lib/auth";

import {
  Camera,
  CheckCircle2,
  CircleAlert,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
  LoaderCircle,
  X,
} from "lucide-react";

type Notice = {
  type: "success" | "error" | "info";
  message: string;
};

type Profile = {
  name: string;
  email: string;
  avatar: string;
};

type Passwords = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ApiUser = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
).replace(/\/+$/, "");

const initialUser: AuthUser = {
  name: "",
  email: "",
  avatar: "",
};

const initialPasswords: Passwords = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getInitialAccountState() {
  const user = getAuthUser() ?? initialUser;

  return {
    user,
    profile: {
      name: user.name ?? "",
      email: user.email ?? "",
      avatar: user.avatar ?? "",
    },
    isAuthenticated: Boolean(getAuthToken()),
  };
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

function NoticeBanner({ notice }: { notice: Notice }) {
  const styles = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-sky-200 bg-sky-50 text-sky-800",
  };

  const Icon =
    notice.type === "success"
      ? CheckCircle2
      : notice.type === "error"
        ? CircleAlert
        : CheckCircle2;

  return (
    <div
      role={notice.type === "error" ? "alert" : "status"}
      className={`mt-5 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${styles[notice.type]}`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <p className="leading-5">{notice.message}</p>
    </div>
  );
}

function Toast({
  notice,
  onClose,
}: {
  notice: Notice | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(onClose, 3500);
    return () => window.clearTimeout(timer);
  }, [notice, onClose]);

  if (!notice) return null;

  const isSuccess = notice.type === "success";
  const Icon = isSuccess ? CheckCircle2 : CircleAlert;

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      aria-live={isSuccess ? "polite" : "assertive"}
      className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-top-2 fade-in duration-200"
    >
      <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 shadow-lg">
        <Icon
          className={`mt-0.5 size-5 shrink-0 ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {isSuccess ? "Berhasil" : "Terjadi kesalahan"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{notice.message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
  placeholder,
  autoComplete,
  maxLength,
  minLength,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}) {
  const inputType = showPasswordToggle && showPassword ? "text" : type;

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-foreground"
      >
        {label} <span className="text-red-600">*</span>
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          required
          maxLength={maxLength}
          minLength={minLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 disabled:cursor-not-allowed disabled:bg-muted/30 disabled:text-muted-foreground ${
            showPasswordToggle ? "pr-11" : ""
          }`}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            disabled={disabled}
            aria-label={
              showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
            }
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

async function accountRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<unknown> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Sesi login tidak ditemukan. Silakan login kembali.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const payload = result as {
      message?: string;
      error?: string;
    } | null;

    throw new Error(
      payload?.message ??
        payload?.error ??
        `Permintaan gagal (${response.status}).`,
    );
  }

  return result;
}

function normalizeUser(result: unknown): ApiUser {
  const payload = result as {
    data?: ApiUser;
    user?: ApiUser;
  } & Partial<ApiUser>;

  const user = payload?.data ?? payload?.user ?? payload;

  if (typeof user?.name !== "string" || typeof user?.email !== "string") {
    throw new Error("Format data profil dari backend tidak sesuai.");
  }

  return {
    id: user.id ?? 0,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? null,
  };
}

function getAvatarUrl(avatar: string | null | undefined) {
  if (!avatar) return "";

  // Mendukung URL eksternal dan data URL untuk pratinjau lokal.
  if (
    avatar.startsWith("http://") ||
    avatar.startsWith("https://") ||
    avatar.startsWith("data:")
  ) {
    return avatar;
  }

  // Path relatif dari backend, misalnya /uploads/users/avatar.png.
  return `${API_BASE_URL}${avatar.startsWith("/") ? "" : "/"}${avatar}`;
}

export default function PengaturanPage() {
  const [account, setAccount] = useState(getInitialAccountState);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState<Passwords>(initialPasswords);

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [profileNotice, setProfileNotice] = useState<Notice | null>(null);

  const [securityNotice, setSecurityNotice] = useState<Notice | null>(null);
  const [toast, setToast] = useState<Notice | null>(null);

  const [avatarPreview, setAvatarPreview] = useState(
    getAvatarUrl(account.profile.avatar),
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, profile, isAuthenticated } = account;

  // Ambil data terbaru dari backend saat halaman dibuka.
  useEffect(() => {
    let cancelled = false;

    async function loadAccount() {
      if (!getAuthToken()) {
        setAccount((current) => ({
          ...current,
          isAuthenticated: false,
        }));
        setLoadingAccount(false);
        return;
      }

      try {
        const result = await accountRequest("/api/account/me");
        const apiUser = normalizeUser(result);

        if (cancelled) return;

        const nextProfile = {
          name: apiUser.name,
          email: apiUser.email,
          avatar: apiUser.avatar ?? "",
        };

        setAccount((current) => ({
          ...current,
          user: {
            ...current.user,
            ...nextProfile,
          },
          profile: nextProfile,
          isAuthenticated: true,
        }));

        setAvatarPreview(getAvatarUrl(nextProfile.avatar));
      } catch (error) {
        if (cancelled) return;

        setProfileNotice({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Gagal mengambil informasi akun.",
        });
      } finally {
        if (!cancelled) {
          setLoadingAccount(false);
        }
      }
    }

    void loadAccount();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateProfile = (changes: Partial<Profile>) => {
    setAccount((current) => ({
      ...current,
      profile: {
        ...current.profile,
        ...changes,
      },
    }));
  };

  const onAvatarSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setProfileNotice({
        type: "error",
        message: "Format foto harus JPG, PNG, atau WEBP.",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileNotice({
        type: "error",
        message: "Ukuran foto maksimal 2 MB.",
      });

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      setAvatarFile(file);
      setAvatarPreview(result);
      updateProfile({ avatar: result });

      setProfileNotice({
        type: "info",
        message:
          "Pratinjau foto diperbarui. Klik Simpan perubahan untuk mengunggahnya.",
      });
    };

    reader.onerror = () => {
      setProfileNotice({
        type: "error",
        message: "Foto tidak dapat dibaca. Silakan coba kembali.",
      });
    };

    reader.readAsDataURL(file);
  };

  const submitProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileNotice(null);

    if (!profile.name.trim()) {
      setProfileNotice({
        type: "error",
        message: "Nama lengkap wajib diisi.",
      });
      return;
    }

    if (
      !profile.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)
    ) {
      setProfileNotice({
        type: "error",
        message: "Masukkan alamat email yang valid.",
      });
      return;
    }

    setSavingProfile(true);

    try {
      const formData = new FormData();
      formData.append("name", profile.name.trim());
      formData.append("email", profile.email.trim());

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const result = await accountRequest("/api/account/me", {
        method: "PUT",
        body: formData,
      });

      const updatedUser = normalizeUser(result);

      const updatedProfile = {
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar ?? "",
      };

      setAccount((current) => ({
        ...current,
        user: {
          ...current.user,
          ...updatedProfile,
        },
        profile: updatedProfile,
        isAuthenticated: true,
      }));

      setAvatarPreview(getAvatarUrl(updatedProfile.avatar));
      setAvatarFile(null);
      setEditingProfile(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setProfileNotice(null);

      setToast({
        type: "success",
        message: "Informasi akun berhasil diperbarui.",
      });
    } catch (error) {
      setProfileNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui informasi akun.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSecurityNotice(null);

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setSecurityNotice({
        type: "error",
        message: "Semua kolom kata sandi wajib diisi.",
      });
      return;
    }

    if (passwords.newPassword.length < 8) {
      setSecurityNotice({
        type: "error",
        message: "Kata sandi baru minimal 8 karakter.",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setSecurityNotice({
        type: "error",
        message: "Konfirmasi kata sandi baru tidak cocok.",
      });
      return;
    }

    if (passwords.currentPassword === passwords.newPassword) {
      setSecurityNotice({
        type: "error",
        message: "Kata sandi baru harus berbeda dari kata sandi saat ini.",
      });
      return;
    }

    setSavingPassword(true);

    try {
      await accountRequest("/api/account/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword,
        }),
      });

      setPasswords(initialPasswords);
      setEditingPassword(false);

      setSecurityNotice(null);

      setToast({
        type: "success",
        message: "Kata sandi berhasil diperbarui.",
      });
    } catch (error) {
      setSecurityNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui kata sandi.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const cancelProfileEdit = () => {
    const restoredProfile = {
      name: user.name ?? "",
      email: user.email ?? "",
      avatar: user.avatar ?? "",
    };

    setAccount((current) => ({
      ...current,
      profile: restoredProfile,
    }));

    setAvatarPreview(getAvatarUrl(restoredProfile.avatar));
    setAvatarFile(null);
    setEditingProfile(false);
    setProfileNotice(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cancelPasswordEdit = () => {
    setPasswords(initialPasswords);
    setEditingPassword(false);
    setSecurityNotice(null);
  };

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <Toast notice={toast} onClose={closeToast} />

      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header halaman */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Pengaturan Akun
          </h1>

          <nav
            aria-label="Breadcrumb"
            className="mt-2 flex flex-wrap items-center gap-2 text-sm"
          >
            <span className="text-muted-foreground">Dashboard</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-brand-dark">Pengaturan akun</span>
          </nav>
        </div>

        {!isAuthenticated && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <CircleAlert className="mt-0.5 size-5 shrink-0" />
            <p>
              Sesi akun belum terdeteksi. Silakan masuk kembali untuk mengakses
              informasi akun.
            </p>
          </div>
        )}

        {/* Informasi profil */}
        <section
          aria-labelledby="profile-heading"
          className="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
        >
          <div className="border-b border-border px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EDF4D6] text-brand-dark">
                <UserRound className="size-5" />
              </div>

              <div>
                <h2
                  id="profile-heading"
                  className="text-base font-bold text-foreground"
                >
                  Informasi akun
                </h2>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Kelola nama, email, dan foto profil akun Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {/* Identitas pengguna */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex size-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-[#F1F5ED] text-xl font-bold text-brand-dark">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials(profile.name || user.name || "User")
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-foreground">
                  {profile.name || "Nama pengguna"}
                </p>

                <p className="mt-1 flex items-center gap-2 break-all text-sm text-muted-foreground">
                  <Mail className="size-4 shrink-0" />
                  {profile.email || "Email belum tersedia"}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!editingProfile}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Camera className="size-4" />
                    Pilih foto
                  </button>

                  <span className="text-xs text-muted-foreground">
                    JPG, PNG, atau WEBP · Maks. 2 MB
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onAvatarSelected}
                    className="sr-only"
                    aria-label="Pilih foto profil"
                  />
                </div>
              </div>
            </div>

            <div className="my-6 border-t border-border" />

            {/* Form profil */}
            <form onSubmit={submitProfile}>
              <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                <Field
                  id="account-name"
                  label="Nama lengkap"
                  value={profile.name}
                  onChange={(value) => updateProfile({ name: value })}
                  disabled={!editingProfile}
                  autoComplete="name"
                  placeholder="Masukkan nama lengkap"
                  maxLength={120}
                />

                <Field
                  id="account-email"
                  label="Alamat email"
                  type="email"
                  value={profile.email}
                  onChange={(value) => updateProfile({ email: value })}
                  disabled={!editingProfile}
                  autoComplete="email"
                  placeholder="nama@perusahaan.com"
                  maxLength={254}
                />
              </div>

              {profileNotice && <NoticeBanner notice={profileNotice} />}

              <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
                {editingProfile ? (
                  <>
                    <button
                      type="button"
                      onClick={cancelProfileEdit}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      <X className="size-4" />
                      Batal
                    </button>

                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingProfile ? (
                        <>
                          <LoaderCircle className="size-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          Simpan perubahan
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProfile(true);
                      setProfileNotice(null);
                    }}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:ring-offset-2"
                  >
                    <Pencil className="size-4" />
                    Edit informasi
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Keamanan akun */}
        <section
          aria-labelledby="security-heading"
          className="mt-6 overflow-hidden rounded-xl border border-border bg-background shadow-sm"
        >
          <div className="border-b border-border px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EDF4D6] text-brand-dark">
                <ShieldCheck className="size-5" />
              </div>

              <div>
                <h2
                  id="security-heading"
                  className="text-base font-bold text-foreground"
                >
                  Keamanan akun
                </h2>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Kelola kata sandi untuk menjaga keamanan akun Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 text-muted-foreground">
                  <LockKeyhole className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Kata sandi
                  </p>

                  <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">
                    Gunakan kata sandi yang kuat dan berbeda dari layanan
                    lainnya.
                  </p>
                </div>
              </div>

              {!editingPassword && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPassword(true);
                    setSecurityNotice(null);
                  }}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <KeyRound className="size-4" />
                  Ubah kata sandi
                </button>
              )}
            </div>

            {editingPassword && (
              <form
                onSubmit={submitPassword}
                className="mt-6 border-t border-border pt-6"
              >
                <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Field
                      id="current-password"
                      label="Kata sandi saat ini"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(value) =>
                        setPasswords((current) => ({
                          ...current,
                          currentPassword: value,
                        }))
                      }
                      autoComplete="current-password"
                      placeholder="Masukkan kata sandi saat ini"
                      showPasswordToggle
                      showPassword={showPasswords.current}
                      onTogglePassword={() =>
                        setShowPasswords((current) => ({
                          ...current,
                          current: !current.current,
                        }))
                      }
                    />
                  </div>

                  <Field
                    id="new-password"
                    label="Kata sandi baru"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(value) =>
                      setPasswords((current) => ({
                        ...current,
                        newPassword: value,
                      }))
                    }
                    autoComplete="new-password"
                    placeholder="Minimal 8 karakter"
                    minLength={8}
                    showPasswordToggle
                    showPassword={showPasswords.new}
                    onTogglePassword={() =>
                      setShowPasswords((current) => ({
                        ...current,
                        new: !current.new,
                      }))
                    }
                  />

                  <Field
                    id="confirm-password"
                    label="Konfirmasi kata sandi baru"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(value) =>
                      setPasswords((current) => ({
                        ...current,
                        confirmPassword: value,
                      }))
                    }
                    autoComplete="new-password"
                    placeholder="Ulangi kata sandi baru"
                    minLength={8}
                    showPasswordToggle
                    showPassword={showPasswords.confirm}
                    onTogglePassword={() =>
                      setShowPasswords((current) => ({
                        ...current,
                        confirm: !current.confirm,
                      }))
                    }
                  />
                </div>

                {securityNotice && <NoticeBanner notice={securityNotice} />}

                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
                  <button
                    type="button"
                    onClick={cancelPasswordEdit}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <X className="size-4" />
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingPassword ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        Memperbarui...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-4" />
                        Perbarui kata sandi
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
