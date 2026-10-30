"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FaLinkedinIn } from "react-icons/fa";
import { FiShare2, FiUsers } from "react-icons/fi";

type TeamMember = {
  id: number;
  name: string;
  position: string;
  photo_path: string;
  linkedin_url?: string | null;
  display_order: number;
  is_active?: boolean;
};

type ApiResponse =
  | TeamMember[]
  | {
      data?: TeamMember[];
    };

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
).replace(/\/+$/, "");

/**
 * Mengubah photo_path menjadi URL gambar yang bisa diakses browser.
 *
 * team/foto.jpg          -> API_URL/uploads/team/foto.jpg
 * uploads/team/foto.jpg  -> API_URL/uploads/team/foto.jpg
 * URL lengkap            -> digunakan langsung
 */
function resolveImageUrl(
  photoPath?: string | null,
): string | undefined {
  if (!photoPath?.trim()) {
    return undefined;
  }

  const path = photoPath.trim();

  // Jika backend mengirim URL lengkap, gunakan langsung.
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  const uploadPath = normalizedPath.startsWith("uploads/")
    ? normalizedPath
    : `uploads/${normalizedPath}`;

  return `${API_URL}/${uploadPath}`;
}

function TeamCard({
  member,
  t,
}: {
  member: TeamMember;
  t: ReturnType<typeof useTranslations<"Team.section">>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = resolveImageUrl(member.photo_path);
  const linkedinUrl = member.linkedin_url?.trim();

  return (
    <article
      className="group relative isolate aspect-[0.9] overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-border/60"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Foto anggota */}
      {imageUrl && !imageError ? (
        <Image
          src={imageUrl}
          alt={t("memberPhoto", { name: member.name })}
          fill
          unoptimized
          sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(50vw - 3rem), 352px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary via-muted to-secondary"
          aria-label={t("photoUnavailable", { name: member.name })}
        >
          <FiUsers
            className="size-16 text-muted-foreground/40"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Gradient agar teks tetap terbaca */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/25 to-transparent"
        aria-hidden="true"
      />

      {/* Informasi anggota */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white sm:p-5 lg:p-6">
        <div className="flex flex-col items-start">
          {/* Jabatan tetap menggunakan data asli dari database */}
          <p
            title={member.position}
            className="mb-2 line-clamp-2 max-w-full text-[10px] font-semibold uppercase leading-relaxed tracking-[0.08em] text-white/85 sm:text-[11px] sm:tracking-[0.1em]"
          >
            {member.position}
          </p>

          {/* Nama anggota */}
          <h3 className="text-lg font-semibold leading-tight tracking-tight sm:text-xl">
            {member.name}
          </h3>
        </div>

        {/* Tombol profil LinkedIn */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded && linkedinUrl
              ? "mt-4 max-h-16 translate-y-0 opacity-100"
              : "mt-0 max-h-0 translate-y-2 opacity-0"
          }`}
        >
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isExpanded ? 0 : -1}
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              {t("viewProfile")}
            </a>
          )}
        </div>
      </div>

      {/* Tombol sosial media */}
      <div className="absolute right-0 top-0 z-20 flex flex-col items-center rounded-bl-2xl bg-primary p-1.5">
        <button
          type="button"
          aria-label={t("toggleLinkedin", { name: member.name })}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
          className="mb-1 flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-white/80 text-white transition-colors hover:bg-white hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <FiShare2 size={16} />
        </button>

        <div
          className={`flex flex-col items-center overflow-hidden transition-all duration-300 ${
            isExpanded && linkedinUrl
              ? "max-h-12 translate-y-0 opacity-100"
              : "max-h-0 -translate-y-2 opacity-0"
          }`}
          aria-hidden={!isExpanded || !linkedinUrl}
        >
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("linkedinProfile", { name: member.name })}
              tabIndex={isExpanded ? 0 : -1}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#0A66C2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <FaLinkedinIn size={16} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function TeamSection() {
  const t = useTranslations("Team.section");

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const controllerRef = useRef<AbortController | null>(null);

  const fetchTeamMembers = useCallback(
    async (signal: AbortSignal) => {
      try {
        const response = await fetch(`${API_URL}/api/team`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal,
        });

        if (!response.ok) {
          throw new Error(
            t("fetchError", { status: response.status }),
          );
        }

        const result: ApiResponse = await response.json();

        const members = Array.isArray(result)
          ? result
          : result.data ?? [];

        // Hanya menampilkan anggota aktif dan mengikuti urutan database.
        const activeMembers = members
          .filter((member) => member.is_active !== false)
          .sort(
            (a, b) =>
              (a.display_order ?? 0) - (b.display_order ?? 0) ||
              a.id - b.id,
          );

        if (signal.aborted) {
          return;
        }

        setTeamMembers(activeMembers);
        setError("");
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        if (signal.aborted) {
          return;
        }

        console.error("Fetch public team error:", err);

        setError(
          err instanceof Error
            ? err.message
            : t("generalError"),
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [t],
  );

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    // Menjalankan fetch setelah effect selesai dieksekusi.
    const timeoutId = window.setTimeout(() => {
      void fetchTeamMembers(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();

      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    };
  }, [fetchTeamMembers]);

  const handleRetry = () => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");

    void fetchTeamMembers(controller.signal);
  };

  return (
    <section
      aria-labelledby="team-section-title"
      className="bg-background px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-4 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <FiUsers
              className="size-5 text-primary"
              aria-hidden="true"
            />
            {t("eyebrow")}
          </p>

          <h2
            id="team-section-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[40px]"
          >
            {t("title")}{" "}
            <span className="text-primary">
              {t("titleHighlight")}
            </span>
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-label={t("loading")}
            aria-busy="true"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[0.9] animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-6 text-center"
          >
            <p className="text-sm text-destructive">{error}</p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("retry")}
            </button>
          </div>
        )}

        {/* Team grid */}
        {!loading && !error && teamMembers.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <TeamCard
                key={member.id}
                member={member}
                t={t}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && teamMembers.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            {t("empty")}
          </p>
        )}
      </div>
    </section>
  );
}