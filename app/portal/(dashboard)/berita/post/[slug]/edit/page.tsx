"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import ImageResize from "tiptap-extension-resize-image";
import TextAlign from "@tiptap/extension-text-align";
import TiptapLink from "@tiptap/extension-link";
import { EditorView } from "@tiptap/pm/view";
import { DOMParser as ProseMirrorDOMParser, Slice } from "@tiptap/pm/model";

import Cropper from "react-easy-crop";

import {
  ArrowLeft,
  Save,
  LoaderCircle,
  Bold,
  Italic,
  UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  List,
  ListOrdered,
  Quote,
  ImageIcon,
  Undo2,
  Redo2,
  ImagePlus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  X,
  Sparkles,
} from "lucide-react";

import { getAuthToken } from "@/lib/auth";
import { useLanguage } from "@/components/language/language-provider";

type Category = {
  id: number;
  slug: string;
  name_idn: string;
  name_en: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type CropAreaPixels = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type ToolbarButtonProps = {
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: ReactNode;
};

type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
};

const translations = {
  id: {
    pageTitle: "Edit Berita",
    dashboard: "Dashboard",
    news: "Berita",
    back: "Kembali",

    information: "Informasi Berita",
    category: "Kategori",
    selectCategory: "Pilih kategori",
    titleIDN: "Judul Bahasa Indonesia",
    titleEN: "Judul Bahasa Inggris",
    slug: "Slug",
    status: "Status",
    draft: "Draft",
    published: "Published",

    thumbnail: "Thumbnail",
    uploadThumbnail: "Upload Thumbnail",
    changeThumbnail: "Ganti Thumbnail",
    thumbnailHint: "PNG, JPG, atau WEBP. Maksimal 5MB.",

    contentIDN: "Konten Bahasa Indonesia",
    contentEN: "Konten Bahasa Inggris",

    save: "Simpan Perubahan",
    saving: "Menyimpan...",
    cancel: "Batal",

    requiredCategory: "Kategori wajib dipilih.",
    requiredTitleIDN: "Judul Bahasa Indonesia wajib diisi.",
    requiredTitleEN: "Judul Bahasa Inggris wajib diisi.",
    requiredSlug: "Slug wajib diisi.",
    requiredContentIDN: "Konten Bahasa Indonesia wajib diisi.",
    requiredContentEN: "Konten Bahasa Inggris wajib diisi.",
    requiredThumbnail: "Thumbnail wajib diisi.",

    authError: "Token autentikasi tidak ditemukan.",
    categoryError: "Gagal mengambil kategori berita.",
    updateError: "Gagal memperbarui berita.",
    updateSuccess: "Berita berhasil diperbarui.",

    invalidImage: "Format gambar tidak valid.",
    imageTooLarge: "Ukuran gambar maksimal 5MB.",

    linkPlaceholder: "https://contoh.com",
    invalidLink: "URL tidak valid.",
    selectTextForLink: "Pilih teks terlebih dahulu.",
    cancelLink: "Batal",
    applyLink: "Terapkan",

    cropThumbnail: "Atur Thumbnail",
    cancelCrop: "Batal",
    applyCrop: "Gunakan Gambar",

    loadingCategories: "Memuat kategori...",
    translate: "Terjemahkan",
    translating: "Menerjemahkan...",
    translationFailed: "Gagal menerjemahkan.",
    translationResultError: "Hasil terjemahan tidak ditemukan.",
    translationError: "Gagal menerjemahkan. Silakan coba lagi.",
  },

  en: {
    pageTitle: "Edit News",
    dashboard: "Dashboard",
    news: "News",
    back: "Back",

    information: "News Information",
    category: "Category",
    selectCategory: "Select category",
    titleIDN: "Indonesian Title",
    titleEN: "English Title",
    slug: "Slug",
    status: "Status",
    draft: "Draft",
    published: "Published",

    thumbnail: "Thumbnail",
    uploadThumbnail: "Upload Thumbnail",
    changeThumbnail: "Change Thumbnail",
    thumbnailHint: "PNG, JPG, or WEBP. Maximum 5MB.",

    contentIDN: "Indonesian Content",
    contentEN: "English Content",

    save: "Save Changes",
    saving: "Saving...",
    cancel: "Cancel",

    requiredCategory: "Category is required.",
    requiredTitleIDN: "Indonesian title is required.",
    requiredTitleEN: "English title is required.",
    requiredSlug: "Slug is required.",
    requiredContentIDN: "Indonesian content is required.",
    requiredContentEN: "English content is required.",
    requiredThumbnail: "Thumbnail is required.",

    authError: "Authentication token not found.",
    categoryError: "Failed to fetch news categories.",
    updateError: "Failed to update news.",
    updateSuccess: "News updated successfully.",

    invalidImage: "Invalid image format.",
    imageTooLarge: "Maximum image size is 5MB.",

    linkPlaceholder: "https://example.com",
    invalidLink: "Invalid URL.",
    selectTextForLink: "Select text first.",
    cancelLink: "Cancel",
    applyLink: "Apply",

    cropThumbnail: "Adjust Thumbnail",
    cancelCrop: "Cancel",
    applyCrop: "Use Image",

    loadingCategories: "Loading categories...",
    translate: "Translate",
    translating: "Translating...",
    translationFailed: "Translation failed.",
    translationResultError: "Translation result not found.",
    translationError: "Failed to translate. Please try again.",
  },
};

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        flex h-10 w-10 items-center justify-center
        rounded-xl border
        transition-all duration-200

        ${
          active
            ? `
              border-[#4E944F]
              bg-[#EEF6EA]
              text-[#4E944F]
              shadow-sm
            `
            : `
              border-transparent
              text-[#64748B]
              hover:border-[#DDE7D8]
              hover:bg-[#F8FAF7]
              hover:text-[#1E293B]
            `
        }

        disabled:cursor-not-allowed
        disabled:opacity-40
      `}
    >
      {children}
    </button>
  );
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getCroppedImage(imageSrc: string, pixelCrop: CropAreaPixels) {
  const image = new Image();

  image.src = imageSrc;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load image."));
  });

  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/jpeg",
      0.9,
    );
  });
}

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsSlug = params.slug as string;

  const { language } = useLanguage();
  const t = translations[language];

  const [loading, setLoading] = useState(false);
  const [loadingNews, setLoadingNews] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [categoryID, setCategoryID] = useState("");

  const [titleIDN, setTitleIDN] = useState("");
  const [titleEN, setTitleEN] = useState("");

  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const contentImageInputRef = useRef<HTMLInputElement | null>(null);

  const [cropImage, setCropImage] = useState<string | null>(null);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CropAreaPixels | null>(null);

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkSelection, setLinkSelection] = useState<{
    from: number;
    to: number;
  } | null>(null);

  const [translating, setTranslating] = useState<"title" | "content" | null>(
    null,
  );

  const [translateError, setTranslateError] = useState("");

  const [errors, setErrors] = useState({
    category: "",
    titleIDN: "",
    titleEN: "",
    slug: "",
    contentIDN: "",
    contentEN: "",
    thumbnail: "",
    submit: "",
  });

  /*
   |--------------------------------------------------------------------------
   | TIPTAP - INDONESIAN
   |--------------------------------------------------------------------------
   */

  const handlePasteImage = (
    view: EditorView,
    event: ClipboardEvent,
    label: string,
  ): boolean => {
    const clipboardData = event.clipboardData;

    if (!clipboardData) {
      return false;
    }

    // ============================================================
    // 1. PASTE IMAGE AS FILE / SCREENSHOT
    // ============================================================

    const items = Array.from(clipboardData.items);

    const imageItem = items.find((item) => item.type.startsWith("image/"));

    if (imageItem) {
      const file = imageItem.getAsFile();

      if (file) {
        console.log(`PASTE IMAGE FILE ${label}:`, file);

        event.preventDefault();

        void (async () => {
          const imageUrl = await uploadContentImage(file);

          if (!imageUrl) {
            return;
          }

          const imageNode = view.state.schema.nodes.image.create({
            src: imageUrl,
          });

          view.dispatch(view.state.tr.replaceSelectionWith(imageNode));
        })();

        return true;
      }
    }

    // ============================================================
    // 2. PASTE ARTICLE / WEBSITE
    // ============================================================

    const html = clipboardData.getData("text/html");

    if (!html) {
      return false;
    }

    console.log(`PASTE HTML ${label}:`, html);

    const parser = new DOMParser();

    const document = parser.parseFromString(html, "text/html");

    // Ambil semua gambar
    const images = Array.from(document.querySelectorAll("img"));

    console.log(`FOUND ${images.length} IMAGES ${label}:`, images);

    // Kalau tidak ada gambar, biarkan Tiptap menangani
    // paste HTML secara normal.
    if (images.length === 0) {
      return false;
    }

    event.preventDefault();

    void (async () => {
      try {
        // ========================================================
        // PROCESS SEMUA GAMBAR
        // ========================================================

        for (let index = 0; index < images.length; index++) {
          const image = images[index];

          const imageSrc =
            image.getAttribute("src") ||
            image.getAttribute("data-src") ||
            image.getAttribute("data-original");

          if (!imageSrc) {
            console.warn(`IMAGE ${index + 1} HAS NO SOURCE ${label}`);

            continue;
          }

          // Jangan proses data:image
          if (imageSrc.startsWith("data:")) {
            console.log(`IMAGE ${index + 1} IS DATA URL ${label}`);

            continue;
          }

          let imageUrl: string;

          try {
            imageUrl = new URL(imageSrc, window.location.href).href;
          } catch {
            console.error(`INVALID IMAGE URL ${label}:`, imageSrc);

            continue;
          }

          console.log(
            `IMPORTING IMAGE ${index + 1}/${images.length} ${label}:`,
            imageUrl,
          );
          try {
            console.log(`IMPORTING EXTERNAL IMAGE ${label}:`, imageUrl);

            const uploadedUrl = await importContentImage(imageUrl);

            if (!uploadedUrl) {
              console.warn(`FAILED TO IMPORT EXTERNAL IMAGE ${label}`);
              continue;
            }

            console.log(`IMPORTED EXTERNAL IMAGE ${label}:`, uploadedUrl);

            image.setAttribute("src", uploadedUrl);

            image.removeAttribute("data-src");
            image.removeAttribute("data-original");
            image.removeAttribute("srcset");
            image.removeAttribute("data-srcset");
          } catch (error) {
            console.error(`FAILED TO IMPORT EXTERNAL IMAGE ${label}:`, error);
          }
        }

        // ========================================================
        // AMBIL HTML YANG SUDAH DIREVISI
        // ========================================================

        const finalHTML = document.body.innerHTML;

        console.log(`FINAL PASTED HTML ${label}:`, finalHTML);

        const parserElement = document.createElement("div");
        parserElement.innerHTML = finalHTML;

        const parsedDoc = ProseMirrorDOMParser.fromSchema(
          view.state.schema,
        ).parse(parserElement);

        const slice = new Slice(parsedDoc.content, 0, 0);

        view.dispatch(view.state.tr.replaceSelection(slice));
      } catch (error) {
        console.error(`FAILED TO IMPORT ARTICLE ${label}:`, error);
      }
    })();

    return true;
  };
  const editorIDN = useEditor({
    immediatelyRender: false,

    shouldRerenderOnTransaction: true,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Underline,

      ImageResize.configure({
        inline: false,
      }),

      TiptapLink.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: "",

    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },

      handlePaste: (view, event) => {
        return handlePasteImage(view, event, "IDN");
      },
    },
  });

  /*
   |--------------------------------------------------------------------------
   | TIPTAP - ENGLISH
   |--------------------------------------------------------------------------
   */

  const editorEN = useEditor({
    immediatelyRender: false,

    shouldRerenderOnTransaction: true,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Underline,

      ImageResize.configure({
        inline: false,
      }),

      TiptapLink.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: "",

    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },

      handlePaste: (view, event) => {
        return handlePasteImage(view, event, "EN");
      },
    },
  });

  /*
   |--------------------------------------------------------------------------
   | FETCH CATEGORIES
   |--------------------------------------------------------------------------
   */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const token = getAuthToken();

        if (!token) {
          throw new Error(t.authError);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news-categories`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t.categoryError);
        }

        setCategories(data.data ?? []);
      } catch (error) {
        console.error("Get news categories error:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [t.authError, t.categoryError]);

  const normalizeContentImageUrls = (html: string) => {
    if (!html) return html;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) return html;

    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");

    const images = document.querySelectorAll("img");

    images.forEach((image) => {
      const src = image.getAttribute("src");

      if (!src) return;

      // Kalau sudah absolute URL, biarkan
      if (src.startsWith("http://") || src.startsWith("https://")) {
        return;
      }

      // Kalau relative /uploads/...
      if (src.startsWith("/uploads/")) {
        image.setAttribute("src", `${apiUrl}${src}`);
      }
    });

    return document.body.innerHTML;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoadingNews(true);

        const token = getAuthToken();

        if (!token) {
          throw new Error(t.authError);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news/${newsSlug}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const raw = await response.text();

        console.log("GET NEWS STATUS:", response.status);
        console.log("GET NEWS URL:", response.url);
        console.log("GET NEWS RAW:", raw);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${raw}`);
        }

        const data = JSON.parse(raw);

        const news = data.data;

        setCategoryID(String(news.category_id));
        setTitleIDN(news.title_idn ?? "");
        setTitleEN(news.title_en ?? "");
        setSlug(news.slug ?? "");
        setStatus(news.status ?? "draft");

        if (news.thumbnail) {
          const thumbnailUrl = news.thumbnail.startsWith("http")
            ? news.thumbnail
            : `${process.env.NEXT_PUBLIC_API_URL}${news.thumbnail}`;

          setThumbnailPreview(thumbnailUrl);
        }

        // Isi editor setelah editor tersedia
        if (editorIDN) {
          editorIDN.commands.setContent(
            normalizeContentImageUrls(news.content_idn ?? ""),
          );
        }

        if (editorEN) {
          editorEN.commands.setContent(
            normalizeContentImageUrls(news.content_en ?? ""),
          );
        }
      } catch (error) {
        console.error("Get news error:", error);

        setErrors((prev) => ({
          ...prev,
          submit:
            error instanceof Error ? error.message : "Gagal mengambil berita.",
        }));
      } finally {
        setLoadingNews(false);
      }
    };

    if (newsSlug) {
      fetchNews();
    }
  }, [newsSlug, editorIDN, editorEN, t.authError]);

  /*
   |--------------------------------------------------------------------------
   | CLEANUP THUMBNAIL PREVIEW
   |--------------------------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  /*
   |--------------------------------------------------------------------------
   | SLUG
   |--------------------------------------------------------------------------
   */

  const handleTitleIDNChange = (value: string) => {
    setTitleIDN(value);

    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  };

  /*
   |--------------------------------------------------------------------------
   | THUMBNAIL
   |--------------------------------------------------------------------------
   */

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: t.invalidImage,
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: t.imageTooLarge,
      }));
      return;
    }

    clearError("thumbnail");

    const imageUrl = URL.createObjectURL(file);

    setCropImage(imageUrl);

    setCrop({
      x: 0,
      y: 0,
    });

    setZoom(1);
    setCroppedAreaPixels(null);
  };

  /*
   |--------------------------------------------------------------------------
   | CROP
   |--------------------------------------------------------------------------
   */

  const handleCropComplete = (_: unknown, croppedPixels: CropAreaPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleApplyCrop = async () => {
    if (!cropImage || !croppedAreaPixels) {
      return;
    }

    try {
      const blob = await getCroppedImage(cropImage, croppedAreaPixels);

      if (!blob) {
        return;
      }

      const file = new File([blob], "news-thumbnail.jpg", {
        type: "image/jpeg",
      });

      const previewUrl = URL.createObjectURL(file);

      setThumbnail(file);
      setThumbnailPreview(previewUrl);

      URL.revokeObjectURL(cropImage);

      setCropImage(null);
    } catch (error) {
      console.error("Crop image error:", error);
    }
  };

  const handleCancelCrop = () => {
    if (cropImage) {
      URL.revokeObjectURL(cropImage);
    }

    setCropImage(null);
  };

  /*
   |--------------------------------------------------------------------------
   | INSERT IMAGE INTO EDITOR
   |--------------------------------------------------------------------------
   */

  const uploadContentImage = async (file: File): Promise<string | null> => {
    console.log("CONTENT IMAGE UPLOAD:", file);

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: t.invalidImage,
      }));
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: t.imageTooLarge,
      }));
      return null;
    }

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const formData = new FormData();
      formData.append("image", file);

      console.log("UPLOADING CONTENT IMAGE...");
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("FILE:", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news/content-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      console.log("CONTENT IMAGE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || t.updateError);
      }

      if (!data.url) {
        throw new Error(t.updateError);
      }

      const imageUrl = data.url.startsWith("http")
        ? data.url
        : `${process.env.NEXT_PUBLIC_API_URL}${data.url}`;

      console.log("CONTENT IMAGE URL:", imageUrl);

      return imageUrl;
    } catch (error) {
      console.error("Upload content image error:", error);

      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : t.updateError,
      }));

      return null;
    }
  };

  const importContentImage = async (
    imageUrl: string,
  ): Promise<string | null> => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news/content-image/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            url: imageUrl,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.updateError);
      }

      if (!data.url) {
        throw new Error(t.updateError);
      }

      return data.url.startsWith("http")
        ? data.url
        : `${process.env.NEXT_PUBLIC_API_URL}${data.url}`;
    } catch (error) {
      console.error("Import content image error:", error);
      return null;
    }
  };

  const addImageToEditor = async (
    editor: typeof editorIDN,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    console.log("CONTENT IMAGE SELECTED:", file);

    event.target.value = "";

    if (!file || !editor) {
      return;
    }

    const imageUrl = await uploadContentImage(file);

    if (!imageUrl) {
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({
        src: imageUrl,
      })
      .run();
  };

  /*
   |--------------------------------------------------------------------------
   | LINK
   |--------------------------------------------------------------------------
   */

  const handleOpenLink = (editor: typeof editorIDN) => {
    if (!editor) {
      return;
    }

    const { from, to } = editor.state.selection;

    setLinkError("");
    setLinkSelection({ from, to });

    if (from === to) {
      setLinkUrl("");
      setLinkError(t.selectTextForLink);
      setShowLinkInput(true);
      return;
    }

    const currentUrl = editor.getAttributes("link").href || "";

    setLinkUrl(currentUrl);
    setShowLinkInput(true);
  };

  const handleApplyLink = (editor: typeof editorIDN) => {
    if (!editor || !linkSelection) {
      return;
    }

    const value = linkUrl.trim();

    if (!value) {
      editor.chain().focus().setTextSelection(linkSelection).unsetLink().run();

      setShowLinkInput(false);
      setLinkUrl("");
      setLinkError("");

      return;
    }

    try {
      const normalizedUrl = /^https?:\/\//i.test(value)
        ? value
        : `https://${value}`;

      new URL(normalizedUrl);

      editor
        .chain()
        .focus()
        .setTextSelection(linkSelection)
        .setLink({
          href: normalizedUrl,
        })
        .run();

      setShowLinkInput(false);
      setLinkUrl("");
      setLinkError("");
      setLinkSelection(null);
    } catch {
      setLinkError(t.invalidLink);
    }
  };

  const translateTitle = async () => {
    if (!titleIDN.trim()) {
      return;
    }

    try {
      setTranslating("title");
      setTranslateError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          q: titleIDN,
          source: "id",
          target: "en",
        }),
      });

      if (!response.ok) {
        throw new Error(t.translationFailed);
      }

      const data = (await response.json()) as {
        translatedText?: string;
      };

      if (!data.translatedText) {
        throw new Error(t.translationResultError);
      }

      setTitleEN(data.translatedText);
    } catch (error) {
      console.error("Translate title error:", error);
      setTranslateError(t.translationError);
    } finally {
      setTranslating(null);
    }
  };

  const translateContent = async () => {
    if (!editorIDN || !editorEN) {
      return;
    }

    if (editorIDN.isEmpty) {
      return;
    }

    try {
      setTranslating("content");
      setTranslateError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const sourceDocument = editorIDN.getJSON() as TiptapNode;

      const translateNode = async (node: TiptapNode): Promise<TiptapNode> => {
        const translatedNode: TiptapNode = {
          ...node,
        };

        if (node.text) {
          const response = await fetch("/api/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              q: node.text,
              source: "id",
              target: "en",
            }),
          });

          if (!response.ok) {
            throw new Error(t.translationFailed);
          }

          const data = (await response.json()) as {
            translatedText?: string;
          };

          if (!data.translatedText) {
            throw new Error(t.translationResultError);
          }

          translatedNode.text = data.translatedText;
        }

        if (node.content) {
          translatedNode.content = await Promise.all(
            node.content.map((child) => translateNode(child)),
          );
        }

        return translatedNode;
      };

      const translatedDocument = await translateNode(sourceDocument);

      editorEN.commands.setContent(translatedDocument);
    } catch (error) {
      console.error("Translate content error:", error);

      setTranslateError(
        error instanceof Error ? error.message : t.translationError,
      );
    } finally {
      setTranslating(null);
    }
  };

  const clearError = (field: keyof typeof errors) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  /*
   |--------------------------------------------------------------------------
   | SUBMIT
   |--------------------------------------------------------------------------
   */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editorIDN || !editorEN) {
      return;
    }

    const validationErrors = {
      category: "",
      titleIDN: "",
      titleEN: "",
      slug: "",
      contentIDN: "",
      contentEN: "",
      thumbnail: "",
      submit: "",
    };

    if (!categoryID) {
      validationErrors.category = t.requiredCategory;
    }

    if (!titleIDN.trim()) {
      validationErrors.titleIDN = t.requiredTitleIDN;
    }

    if (!titleEN.trim()) {
      validationErrors.titleEN = t.requiredTitleEN;
    }

    if (!slug.trim()) {
      validationErrors.slug = t.requiredSlug;
    }

    const contentIDN = editorIDN.getHTML();
    const contentEN = editorEN.getHTML();

    if (!contentIDN || contentIDN === "<p></p>") {
      validationErrors.contentIDN = t.requiredContentIDN;
    }

    if (!contentEN || contentEN === "<p></p>") {
      validationErrors.contentEN = t.requiredContentEN;
    }

    if (!thumbnail && !thumbnailPreview) {
      validationErrors.thumbnail = t.requiredThumbnail;
    }

    const hasValidationError = Object.values(validationErrors).some(
      (error) => error !== "",
    );

    if (hasValidationError) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const formData = new FormData();

      formData.append("category_id", categoryID);

      formData.append("title_idn", titleIDN.trim());

      formData.append("title_en", titleEN.trim());

      formData.append("slug", slug.trim());

      formData.append("content_idn", contentIDN);

      formData.append("content_en", contentEN);

      formData.append("status", status);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news/${newsSlug}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.updateError);
      }

      router.push("/portal/berita/post");
      router.refresh();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : t.updateError,
      }));
    } finally {
      setLoading(false);
    }
  };

  /*
   |--------------------------------------------------------------------------
   | EDITOR TOOLBAR
   |--------------------------------------------------------------------------
   */

  const renderToolbar = (
    editor: typeof editorIDN,
    languageLabel: string,
    imageInputId: string,
    allowImage = false,
  ) => {
    if (!editor) {
      return null;
    }

    return (
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-white p-2">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          title="Heading 1"
          active={editor.isActive("heading", {
            level: 1,
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
        >
          <Heading1 className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", {
            level: 2,
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >
          <Heading2 className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", {
            level: 3,
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run()
          }
        >
          <Heading3 className="size-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          title="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Ordered List"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <div className="relative">
          <div onMouseDown={(event) => event.preventDefault()}>
            <ToolbarButton
              title="Link"
              active={editor.isActive("link")}
              onClick={() => handleOpenLink(editor)}
            >
              <Link2 className="size-4" />
            </ToolbarButton>
          </div>

          {showLinkInput && (
            <div
              className="
        absolute left-0 top-12 z-50
        w-[340px]
        rounded-xl
        border border-border
        bg-white
        p-3
        shadow-xl
      "
            >
              <div className="space-y-2">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(event) => {
                    setLinkUrl(event.target.value);
                    setLinkError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleApplyLink(editor);
                    }

                    if (event.key === "Escape") {
                      setShowLinkInput(false);
                      setLinkError("");
                    }
                  }}
                  autoFocus
                  placeholder={t.linkPlaceholder}
                  className="
            h-10 w-full
            rounded-lg
            border border-border
            bg-white
            px-3
            text-sm
            text-foreground
            outline-none
            transition
            placeholder:text-muted-foreground
            focus:border-brand-primary
            focus:ring-2
            focus:ring-brand-primary/20
          "
                />

                {linkError && (
                  <p className="text-xs font-medium text-red-500">
                    {linkError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkInput(false);
                      setLinkUrl("");
                      setLinkError("");
                      setLinkSelection(null);
                    }}
                    className="
              h-9 rounded-lg
              border border-border
              px-3
              text-sm font-semibold
              text-muted-foreground
              transition-colors
              hover:bg-muted
              hover:text-foreground
            "
                  >
                    {t.cancelLink}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyLink(editor)}
                    disabled={!linkSelection}
                    className="
                        h-9 rounded-lg
                        bg-brand-primary
                        px-4
                        text-sm font-semibold
                        text-white
                        transition
                        hover:brightness-95
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        "
                  >
                    {t.applyLink}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {allowImage && (
          <>
            <ToolbarButton
              title={`Insert Image ${languageLabel}`}
              onClick={() => {
                contentImageInputRef.current?.click();
              }}
            >
              <ImageIcon className="size-4" />
            </ToolbarButton>

            <input
              ref={contentImageInputRef}
              id={imageInputId}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) => addImageToEditor(editor, event)}
            />
          </>
        )}

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          title="Align Left"
          active={editor.isActive({
            textAlign: "left",
          })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Align Center"
          active={editor.isActive({
            textAlign: "center",
          })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Align Right"
          active={editor.isActive({
            textAlign: "right",
          })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Justify"
          active={editor.isActive({
            textAlign: "justify",
          })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="size-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          title="Undo"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Redo"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="size-4" />
        </ToolbarButton>
      </div>
    );
  };

  /*
   |--------------------------------------------------------------------------
   | RENDER
   |--------------------------------------------------------------------------
   */

  return (
    <>
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="border-b border-border bg-white">
          <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {t.pageTitle}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{t.dashboard}</span>

                  <span>/</span>

                  <span>{t.news}</span>

                  <span>/</span>

                  <span className="text-foreground">{t.pageTitle}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/portal/berita/post")}
                className="
                  inline-flex h-10 items-center gap-2
                  rounded-lg border border-border
                  bg-white px-4
                  text-sm font-semibold
                  text-muted-foreground
                  transition-colors
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                <ArrowLeft className="size-4" />

                {t.back}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Information */}
            <section className="rounded-2xl border border-border bg-white shadow-sm">
              <div className="border-b border-border px-6 py-5">
                <h2 className="text-base font-bold text-foreground">
                  {t.information}
                </h2>
              </div>

              <div className="grid gap-5 p-6">
                {/* Category & Status */}
                <div className="grid gap-5 lg:grid-cols-2">
                  {/* Category */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      {t.category} <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <select
                        value={categoryID}
                        onChange={(event) => {
                          setCategoryID(event.target.value);
                          clearError("category");
                        }}
                        disabled={loadingCategories}
                        className={`
                          h-11 w-full appearance-none rounded-lg
                          border
                          ${errors.category ? "border-red-500" : "border-border"}
                          bg-white px-3 pr-10
                          text-sm text-foreground
                          outline-none
                          transition
                          focus:border-brand-primary
                          focus:ring-2
                          focus:ring-brand-primary/20
                          disabled:cursor-not-allowed
                          disabled:bg-muted
                        `}
                      >
                        <option value="">
                          {loadingCategories
                            ? t.loadingCategories
                            : t.selectCategory}
                        </option>

                        {categories
                          .filter((category) => category.is_active)
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {language === "id"
                                ? category.name_idn
                                : category.name_en}
                            </option>
                          ))}
                      </select>

                      {errors.category && (
                        <span className="mt-1.5 block text-xs font-medium text-red-500">
                          {errors.category}
                        </span>
                      )}

                      <ChevronDown
                        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#658C64]"
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      {t.status} <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <select
                        value={status}
                        onChange={(event) =>
                          setStatus(event.target.value as "draft" | "published")
                        }
                        className="
                            h-11 w-full appearance-none rounded-lg
                            border border-border
                            bg-white px-3 pr-10
                            text-sm text-foreground
                            outline-none
                            transition
                            focus:border-brand-primary
                            focus:ring-2
                            focus:ring-brand-primary/20
                        "
                      >
                        <option value="draft">{t.draft}</option>
                        <option value="published">{t.published}</option>
                      </select>

                      <ChevronDown
                        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#658C64]"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Titles */}
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <div className="mb-2 flex h-8 items-center justify-between gap-3">
                      <label className="block text-sm font-semibold text-foreground">
                        {t.titleIDN} <span className="text-red-500">*</span>
                      </label>

                      <button
                        type="button"
                        onClick={translateTitle}
                        disabled={!titleIDN.trim() || translating !== null}
                        className="
                            inline-flex h-8 shrink-0
                            items-center gap-1.5
                            rounded-md
                            bg-accent
                            px-2.5
                            text-xs font-semibold
                            text-brand-dark
                            transition-colors
                            hover:bg-accent/80
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            "
                      >
                        {translating === "title" ? (
                          <LoaderCircle className="size-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="size-3.5" />
                        )}

                        {translating === "title" ? t.translating : t.translate}
                      </button>
                    </div>

                    <input
                      type="text"
                      value={titleIDN}
                      onChange={(event) => {
                        handleTitleIDNChange(event.target.value);
                        clearError("titleIDN");
                      }}
                      placeholder={t.titleIDN}
                      className={`
                        h-11 w-full rounded-lg
                        border
                        ${errors.titleIDN ? "border-red-500" : "border-border"}
                        bg-white px-3
                        text-sm text-foreground
                        outline-none
                        placeholder:text-muted-foreground
                        focus:border-brand-primary
                        focus:ring-2
                        focus:ring-brand-primary/20
                      `}
                    />

                    {errors.titleIDN && (
                      <span className="mt-1.5 block text-xs font-medium text-red-500">
                        {errors.titleIDN}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 flex h-8 items-center">
                      <label className="block text-sm font-semibold text-foreground">
                        {t.titleEN} <span className="text-red-500">*</span>
                      </label>
                    </div>

                    <input
                      type="text"
                      value={titleEN}
                      onChange={(event) => {
                        setTitleEN(event.target.value);
                        clearError("titleEN");
                      }}
                      placeholder={t.titleEN}
                      className={`
    h-11 w-full rounded-lg
    border
    ${errors.titleEN ? "border-red-500" : "border-border"}
    bg-white px-3
    text-sm text-foreground
    outline-none
    placeholder:text-muted-foreground
    focus:border-brand-primary
    focus:ring-2
    focus:ring-brand-primary/20
  `}
                    />

                    {errors.titleEN && (
                      <span className="mt-1.5 block text-xs font-medium text-red-500">
                        {errors.titleEN}
                      </span>
                    )}
                  </div>
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    {t.slug} <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={slug}
                    onChange={(event) => {
                      setSlug(event.target.value);
                      setSlugManuallyEdited(true);
                      clearError("slug");
                    }}
                    placeholder="judul-berita"
                    className={`
    h-11 w-full rounded-lg
    border
    ${errors.slug ? "border-red-500" : "border-border"}
    bg-white px-3
    text-sm text-foreground
    outline-none
    placeholder:text-muted-foreground
    focus:border-brand-primary
    focus:ring-2
    focus:ring-brand-primary/20
  `}
                  />

                  {errors.slug && (
                    <span className="mt-1.5 block text-xs font-medium text-red-500">
                      {errors.slug}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Thumbnail */}
            <section className="rounded-2xl border border-border bg-white shadow-sm">
              <div className="border-b border-border px-6 py-5">
                <h2 className="text-base font-bold text-foreground">
                  {t.thumbnail} <span className="text-red-500">*</span>
                </h2>
              </div>

              <div className="p-6">
                {thumbnailPreview ? (
                  <div className="relative mx-auto w-full max-w-[720px] overflow-hidden rounded-xl border border-border">
                    <div className="aspect-[16/9]">
                      <img
                        src={thumbnailPreview}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <label
                      htmlFor="thumbnail-upload"
                      className="
                        absolute bottom-4 right-4
                        inline-flex cursor-pointer
                        items-center gap-2
                        rounded-lg
                        bg-white/95
                        px-4 py-2.5
                        text-sm font-semibold
                        text-foreground
                        shadow-lg
                        backdrop-blur
                        transition
                        hover:bg-white
                        "
                    >
                      <ImagePlus className="size-4" />
                      {t.changeThumbnail}
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="thumbnail-upload"
                    className="
                      flex min-h-[240px]
                      cursor-pointer
                      flex-col items-center
                      justify-center
                      rounded-xl
                      border-2 border-dashed
                      border-[#DDE7D8]
                      bg-[#F8FAF7]
                      text-center
                      transition
                      hover:border-brand-primary
                      hover:bg-[#F1F5ED]
                    "
                  >
                    <div className="flex size-14 items-center justify-center rounded-full bg-white text-brand-primary shadow-sm">
                      <ImageIcon className="size-7" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-foreground">
                      {t.uploadThumbnail}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.thumbnailHint}
                    </p>
                  </label>
                )}

                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleThumbnailChange}
                />

                {errors.thumbnail && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.thumbnail}
                  </p>
                )}
              </div>
            </section>

            {/* Indonesian Editor */}
            <section className="rounded-2xl border border-border bg-white shadow-sm">
              <div className="border-b border-border px-6 py-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-bold text-foreground">
                    {t.contentIDN} <span className="text-red-500">*</span>
                  </h2>

                  <button
                    type="button"
                    onClick={translateContent}
                    disabled={
                      !editorIDN || editorIDN.isEmpty || translating !== null
                    }
                    className="
                      inline-flex h-8 shrink-0
                      items-center gap-1.5
                      rounded-md
                      bg-accent
                      px-2.5
                      text-xs font-semibold
                      text-brand-dark
                      transition-colors
                      hover:bg-accent/80
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {translating === "content" ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="size-3.5" />
                    )}

                    {translating === "content" ? t.translating : t.translate}
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="overflow-hidden rounded-xl border border-border">
                  {renderToolbar(editorIDN, "ID", "content-image-idn", true)}

                  <EditorContent editor={editorIDN} />
                </div>

                {errors.contentIDN && (
                  <span className="mt-2 block text-xs font-medium text-red-500">
                    {errors.contentIDN}
                  </span>
                )}
              </div>
            </section>

            {/* English Editor */}
            <section className="rounded-2xl border border-border bg-white shadow-sm">
              <div className="border-b border-border px-6 py-5">
                <h2 className="text-base font-bold text-foreground">
                  {t.contentEN} <span className="text-red-500">*</span>
                </h2>
              </div>

              <div className="p-6">
                <div className="overflow-hidden rounded-xl border border-border">
                  {renderToolbar(editorEN, "EN", "content-image-en")}

                  <EditorContent editor={editorEN} />
                </div>

                {errors.contentEN && (
                  <span className="mt-2 block text-xs font-medium text-red-500">
                    {errors.contentEN}
                  </span>
                )}
              </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pb-8">
              <button
                type="button"
                onClick={() => router.push("/portal/berita/post")}
                disabled={loading}
                className="
                  inline-flex h-11
                  items-center justify-center
                  rounded-lg
                  border border-border
                  bg-white
                  px-5
                  text-sm font-semibold
                  text-muted-foreground
                  transition
                  hover:bg-muted
                  hover:text-foreground
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {t.cancel}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  inline-flex h-11
                  items-center justify-center
                  gap-2
                  rounded-lg
                  bg-brand-primary
                  px-5
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:brightness-95
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    {t.saving}
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    {t.save}
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>

      {/* Crop Modal */}
      {cropImage && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleCancelCrop}
        >
          <div
            className="relative w-full max-w-[720px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-bold text-foreground">
                {t.cropThumbnail}
              </h2>

              <button
                type="button"
                onClick={handleCancelCrop}
                className="
                  inline-flex size-8
                  items-center justify-center
                  rounded-lg
                  text-muted-foreground
                  transition
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative h-[420px] bg-black">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            <div className="border-t border-border px-5 py-4">
              <label className="block text-sm font-semibold text-foreground">
                Zoom
              </label>

              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="mt-3 w-full accent-[#ABC937]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
              <button
                type="button"
                onClick={handleCancelCrop}
                className="
                  h-10 rounded-lg
                  border border-border
                  px-4
                  text-sm font-semibold
                  text-muted-foreground
                  transition
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                {t.cancelCrop}
              </button>

              <button
                type="button"
                onClick={handleApplyCrop}
                className="
                  h-10 rounded-lg
                  bg-brand-primary
                  px-5
                  text-sm font-semibold
                  text-white
                  transition
                  hover:brightness-95
                "
              >
                {t.applyCrop}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
