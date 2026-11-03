import { useEffect } from "react";
import { TOOL_BY_KEY } from "@/utils/shortcuts";

export function useShortcuts(apiRef, { enabled = true, onOpenIcons }) {
  useEffect(() => {
    if (!enabled) return undefined;

    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target.closest?.("input, textarea, select, [contenteditable='true']")) return;

      if (event.key === "/") {
        event.preventDefault();
        event.stopPropagation();
        onOpenIcons();
        return;
      }

      const tool = TOOL_BY_KEY[event.key.toLowerCase()];
      if (!tool || !apiRef.current) return;

      event.preventDefault();
      event.stopPropagation();
      apiRef.current.setActiveTool({ type: tool });
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [apiRef, enabled, onOpenIcons]);
}