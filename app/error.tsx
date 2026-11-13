"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowRight } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAF5] px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ABC937]/10">
          <AlertTriangle
            className="h-10 w-10 text-[#658C64]"
            strokeWidth={1.4}
          />
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight text-[#05546A]">
          500
        </h1>

        <h2 className="mt-3 text-xl font-semibold text-[#05546A]">
          Terjadi Kesalahan
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Maaf, terjadi gangguan saat memproses permintaan kamu. Silakan coba
          kembali beberapa saat lagi.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ABC937] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#96B52E]"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#05546A]/15 px-6 py-3 text-sm font-semibold text-[#05546A] transition hover:bg-[#658C64]/5"
          >
            Kembali ke Beranda
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
