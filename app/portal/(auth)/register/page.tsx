"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    agree: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = {
      name: "",
      email: "",
      password: "",
      agree: "",
    };

    if (!name.trim()) {
      newErrors.name = "Nama wajib diisi.";
    }

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi.";
    } else if (password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
    }

    if (!agree) {
      newErrors.agree =
        "Anda harus menyetujui Syarat & Ketentuan dan Kebijakan Privasi.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal.");
      }

      toast.success("Pendaftaran berhasil", {
        description: "Anda akan dialihkan ke halaman login.",
      });

      setTimeout(() => {
        router.push("/portal/login");
      }, 2000);
    } catch (error) {
      console.error("Register error:", error);

      toast.error(error instanceof Error ? error.message : "Registrasi gagal.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-dark px-4 py-8">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[-280px] size-[700px] -translate-x-1/2 rounded-full bg-brand-secondary/30 blur-[120px]" />

        <div className="absolute -bottom-40 -left-40 size-[450px] rounded-full bg-primary/20 blur-[120px]" />

        <div className="absolute -bottom-40 -right-40 size-[450px] rounded-full bg-brand-secondary/20 blur-[120px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/40 to-black/30" />
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-[430px]">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.10] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5">
              <Image
                src="/favicon.svg"
                alt="Crustea"
                width={120}
                height={32}
                className="h-7 w-auto"
                priority
              />
            </div>
          </div>

          {/* Header */}
          <div className="mt-6 text-center">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
              Buat Akun
            </h1>

            <p className="mt-2 text-[13px] leading-5 text-white/65">
              Daftar untuk mengakses Portal Crustea
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-[12px] font-medium text-white/85"
              >
                Nama
              </label>

              <div className="relative">
                <User
                  className="absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-white/55"
                  aria-hidden="true"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Masukkan nama"
                  required
                  className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.07] pl-10 pr-4 text-[13px] text-white outline-none transition-all duration-200 placeholder:text-white/50 hover:border-white/25 focus:border-primary/60 focus:bg-white/[0.09] focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {errors.name && (
                <span className="mt-1.5 block text-[11px] leading-4 text-red-300">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[12px] font-medium text-white/85"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-white/55"
                  aria-hidden="true"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Masukkan email"
                  required
                  className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.07] pl-10 pr-4 text-[13px] text-white outline-none transition-all duration-200 placeholder:text-white/50 hover:border-white/25 focus:border-primary/60 focus:bg-white/[0.09] focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {errors.email && (
                <span className="mt-1.5 block text-[11px] leading-4 text-red-300">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[12px] font-medium text-white/85"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-white/55"
                  aria-hidden="true"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password"
                  required
                  minLength={8}
                  className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.07] pl-10 pr-11 text-[13px] text-white outline-none transition-all duration-200 placeholder:text-white/50 hover:border-white/25 focus:border-primary/60 focus:bg-white/[0.09] focus:ring-2 focus:ring-primary/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/55 transition-colors hover:text-white/90"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-[17px]" />
                  ) : (
                    <Eye className="size-[17px]" />
                  )}
                </button>
              </div>

              {errors.password && (
                <span className="mt-1.5 block text-[11px] leading-4 text-red-300">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Agreement */}
            <div className="flex items-start">
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(event) => setAgree(event.target.checked)}
                  required
                  className="mt-0.5 size-3.5 shrink-0 rounded border-white/30 bg-white/10 accent-primary"
                />

                <span className="text-[12px] leading-5 text-white/65">
                  Saya menyetujui{" "}
                  <Link
                    href="/syarat-ketentuan"
                    target="_blank"
                    className="font-medium text-white/90 transition-colors hover:text-primary"
                  >
                    Syarat & Ketentuan
                  </Link>{" "}
                  dan{" "}
                  <Link
                    href="/kebijakan-privasi"
                    target="_blank"
                    className="font-medium text-white/90 transition-colors hover:text-primary"
                  >
                    Kebijakan Privasi
                  </Link>
                  .
                </span>
              </label>
            </div>

            {errors.agree && (
              <span className="block text-[11px] leading-4 text-red-300">
                {errors.agree}
              </span>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={processing || !agree}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#7F9F1C] px-5 text-[14px] font-bold tracking-[0.08em] text-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-200 hover:bg-[#718D18] hover:shadow-[0_8px_24px_rgba(0,0,0,0.20)] disabled:cursor-not-allowed"
            >
              {processing ? "Memproses..." : "Daftar"}

              {!processing && (
                <ArrowRight className="size-4 stroke-[2.5] text-white transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 text-center">
            <p className="text-[12px] text-white/55">
              Sudah memiliki akun?{" "}
              <Link
                href="/portal/login"
                className="font-semibold text-white/90 transition-colors hover:text-primary"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
