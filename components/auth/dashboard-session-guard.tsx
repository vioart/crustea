
"use client";

import { useEffect } from "react";
import { clearAuth, getAuthToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardSessionGuard() {
  useEffect(() => {
    if (!API_URL) {
      console.error("API belum dikonfigurasi.");
      return;
    }

    const originalFetch = window.fetch;
    let redirecting = false;

    // Batasi interceptor hanya pada URL API Crustea.
    let apiOrigin: string;
    let apiPath: string;

    try {
      const apiUrl = new URL(API_URL, window.location.origin);

      apiOrigin = apiUrl.origin;
      apiPath = apiUrl.pathname.replace(/\/+$/, "");
    } catch {
      console.error("URL API Crustea tidak valid.");
      return;
    }

    const isCrusteaApi = (input: RequestInfo | URL) => {
      try {
        const requestUrl =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url;

        const url = new URL(requestUrl, window.location.origin);

        return (
          url.origin === apiOrigin &&
          (
            apiPath === "" ||
            url.pathname === apiPath ||
            url.pathname.startsWith(`${apiPath}/`)
          )
        );
      } catch {
        return false;
      }
    };

    const interceptedFetch: typeof window.fetch = async (
      input,
      init,
    ) => {
      const response = await originalFetch.call(
        window,
        input,
        init,
      );

      if (
        redirecting ||
        !isCrusteaApi(input) ||
        !getAuthToken()
      ) {
        return response;
      }

      // Periksa salinan respons agar response asli tetap
      // bisa dibaca oleh halaman yang memanggil fetch().
      let message = "";

      try {
        const data: unknown = await response.clone().json();

        if (
          data !== null &&
          typeof data === "object" &&
          "message" in data &&
          typeof data.message === "string"
        ) {
          message = data.message.toLowerCase();
        }
      } catch {
        // Respons bukan JSON atau tidak memiliki body.
      }

      const isExpiredToken =
        response.status === 401 ||
        message.includes("invalid or expired token") ||
        message.includes("token expired") ||
        message.includes("invalid token");

      if (
        isExpiredToken &&
        window.location.pathname !== "/portal/login"
      ) {
        redirecting = true;
        clearAuth();
        window.location.replace("/portal/login");
      }

      return response;
    };

    window.fetch = interceptedFetch;

    return () => {
      // Jangan menimpa interceptor lain yang mungkin
      // dipasang setelah komponen ini.
      if (window.fetch === interceptedFetch) {
        window.fetch = originalFetch;
      }
    };
  }, []);

  return null;
}
