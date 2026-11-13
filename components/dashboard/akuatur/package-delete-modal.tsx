
"use client";

import type { DestinationPackage } from "@/app/portal/(dashboard)/akuatur/[id]/page";

type PackageDeleteModalProps = {
  open: boolean;
  packageData: DestinationPackage | null;
  language: "id" | "en";
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function PackageDeleteModal({
  open,
  packageData,
  language,
  onClose,
}: PackageDeleteModalProps) {
  if (!open || !packageData) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-background shadow-xl">
        <div className="p-5">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-red-50 text-red-600">
            <span className="text-xl">!</span>
          </div>

          <h2 className="text-lg font-bold text-foreground">
            {language === "id" ? "Hapus Package?" : "Delete Package?"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {language === "id"
              ? `Apakah kamu yakin ingin menghapus package "${packageData.title}"?`
              : `Are you sure you want to delete "${packageData.title}"?`}
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-border bg-muted/20 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            {language === "id" ? "Batal" : "Cancel"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {language === "id" ? "Hapus" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
