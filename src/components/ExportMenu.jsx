import { useState } from "react";
import { cn } from "@/utils/cn";

const FORMATS = [
  { id: "png", label: "PNG" },
  { id: "jpg", label: "JPG" },
  { id: "pdf", label: "PDF" },
  { id: "svg", label: "SVG" },
];

export function ExportMenu({ onExport }) {
  const [busy, setBusy] = useState(null);

  const run = async (format) => {
    setBusy(format);
    try {
      await onExport(format);
    } catch (error) {
      console.error("Export failed", error);
      alert("Export failed. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-1">
      <span className="mr-1 text-xs text-gray-500">Download</span>
      {FORMATS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          disabled={busy !== null}
          onClick={() => run(id)}
          className={cn(
            "rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100",
            busy === id && "opacity-60",
            busy !== null && "cursor-not-allowed"
          )}
        >
          {busy === id ? "…" : label}
        </button>
      ))}
    </div>
  );
}
