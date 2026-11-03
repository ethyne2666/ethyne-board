import { useState } from "react";
import { TOOL_SHORTCUTS } from "@/utils/shortcuts";

export function ShortcutsHelp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-md px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
      >
        Shortcuts
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          {TOOL_SHORTCUTS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between px-2 py-0.5 text-sm">
              <span className="text-gray-700">{label}</span>
              <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 text-xs uppercase">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
