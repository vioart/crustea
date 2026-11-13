"use client";

import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAF5] px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ABC937]/10">
          <Compass className="h-10 w-10 text-[#658C64]" strokeWidth={1.4} />
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight text-[#05546A]">
          404
        </h1>

        <h2 className="mt-3 text-xl font-semibold text-[#05546A]">
          Page Not Found
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Sorry, the page you are looking for could not be found or may have
          been moved.
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
  );
}
