"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
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
              Internal Server Error
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Sorry, something went wrong with the Crustea system. Please return
              to the homepage and try again later.
            </p>

            <div className="mt-7 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ABC937] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#96B52E]"
              >
                Back to Home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
