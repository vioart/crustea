import { NextResponse } from "next/server";

const TRANSLATE_API_URL = process.env.TRANSLATE_API_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type TranslateBody = {
  q: string;
  source: string;
  target: string;
  format?: string;
};

type TranslateResponse = {
  translatedText?: string;
  message?: string;
};

const protectedTerms = [
  "Crustea AIO",
  "Eco-Aerator",
  "Smart Energy",
  "EBII System",
  "Crustea",
  "Krasty",
];

async function translatePart(
  text: string,
  body: TranslateBody,
): Promise<string> {
  if (!text) {
    return "";
  }

  const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/);

  if (!match) {
    return text;
  }

  const [, leadingSpace, content, trailingSpace] = match;

  if (!content) {
    return text;
  }

  const response = await fetch(`${TRANSLATE_API_URL}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: content,
      source: body.source,
      target: body.target,
      format: body.format ?? "text",
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as TranslateResponse;

  if (!response.ok) {
    throw new Error(data.message || "Gagal menerjemahkan.");
  }

  if (typeof data.translatedText !== "string") {
    throw new Error("Response translation tidak valid.");
  }

  return `${leadingSpace}${data.translatedText}${trailingSpace}`;
}

async function translateTextWithProtectedTerms(
  text: string,
  body: TranslateBody,
): Promise<string> {
  const terms = [...protectedTerms].sort((a, b) => b.length - a.length);

  const pattern = terms
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  const regex = new RegExp(`(${pattern})`, "gi");

  const parts = text.split(regex);

  const result: string[] = [];

  for (const part of parts) {
    if (!part) {
      continue;
    }

    const matchedTerm = terms.find(
      (term) => term.toLowerCase() === part.toLowerCase(),
    );

    if (matchedTerm) {
      result.push(matchedTerm);
      continue;
    }

    const translatedPart = await translatePart(part, body);

    result.push(translatedPart);
  }

  return result.join("");
}

export async function POST(request: Request) {
  try {
    if (!TRANSLATE_API_URL) {
      return NextResponse.json(
        {
          message: "Translation API belum dikonfigurasi.",
        },
        { status: 500 },
      );
    }

    if (!API_URL) {
      return NextResponse.json(
        {
          message: "Backend API belum dikonfigurasi.",
        },
        { status: 500 },
      );
    }

    const authorization = request.headers.get("Authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          message: "Token autentikasi diperlukan.",
        },
        { status: 401 },
      );
    }

    const authResponse = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    });

    if (!authResponse.ok) {
      return NextResponse.json(
        {
          message: "Sesi login tidak valid atau sudah kedaluwarsa.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json()) as TranslateBody;

    if (
      typeof body.q !== "string" ||
      typeof body.source !== "string" ||
      typeof body.target !== "string"
    ) {
      return NextResponse.json(
        {
          message: "Data translation tidak valid.",
        },
        { status: 400 },
      );
    }

    const text = body.q.trim();

    if (!text) {
      return NextResponse.json(
        {
          message: "Teks yang akan diterjemahkan tidak boleh kosong.",
        },
        { status: 400 },
      );
    }

    const translatedText = await translateTextWithProtectedTerms(text, body);

    return NextResponse.json({
      translatedText,
    });
  } catch (error) {
    console.error("Translation proxy error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal menghubungi translation service.",
      },
      { status: 500 },
    );
  }
}
