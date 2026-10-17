import { clearAuth, getAuthToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API belum dikonfigurasi.");
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options?.headers);

  if (!headers.has("Content-Type") && !(options?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data: Record<string, unknown> = {};

  try {
    const result: unknown = await response.json();

    if (result && typeof result === "object") {
      data = result as Record<string, unknown>;
    }
  } catch {
    // Respons kosong atau bukan JSON.
  }

  const message = typeof data.message === "string" ? data.message : "";

  const normalizedMessage = message.toLowerCase();

  const isPasswordEndpoint = endpoint === "/api/account/me/password";

  const isAuthError =
    !isPasswordEndpoint &&
    (response.status === 401 ||
      normalizedMessage.includes("invalid or expired token") ||
      normalizedMessage.includes("token expired") ||
      normalizedMessage.includes("invalid token"));

  if (isAuthError && token && typeof window !== "undefined") {
    const isLoginPage = window.location.pathname === "/portal/login";

    if (!isLoginPage) {
      clearAuth();
      window.location.replace("/portal/login");

      // Hentikan proses request yang sedang berjalan.
      throw new Error("Sesi berakhir. Mengarahkan ke halaman login.");
    }
  }

  if (!response.ok) {
    throw new Error(message || "Terjadi kesalahan pada API.");
  }

  return data as T;
}
