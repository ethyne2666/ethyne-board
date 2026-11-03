import { cn } from "@/utils/cn";

export function ToolbarButton({ children, active = false, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium",
        active
          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}