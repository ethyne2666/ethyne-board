import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";

const CATEGORIES = ["All", "System Design", "General", "AWS", "Azure", "GCP", "Tech"];
const MAX_RESULTS = 120;
const COLUMNS = 6;

const toSrc = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export function IconPicker({ open, onClose, onPick }) {
  const [catalog, setCatalog] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(0);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelected(0);
    if (catalog) return;
    import("@/data/iconCatalog").then((module) =>
      setCatalog(
        module.default.map((icon) => ({
          ...icon,
          haystack: `${icon.name} ${icon.category} ${icon.keywords}`.toLowerCase(),
        }))
      )
    );
  }, [open, catalog]);

  const results = useMemo(() => {
    if (!catalog) return [];
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    return catalog
      .filter(
        (icon) =>
          (category === "All" || icon.category === category) &&
          tokens.every((token) => icon.haystack.includes(token))
      )
      .slice(0, MAX_RESULTS);
  }, [catalog, query, category]);

  useEffect(() => {
    setSelected(0);
  }, [query, category]);

  useEffect(() => {
    gridRef.current?.querySelector(`[data-index="${selected}"]`)?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!open) return null;

  const onKeyDown = (event) => {
    const moves = {
      ArrowDown: COLUMNS,
      ArrowUp: -COLUMNS,
      ...(query === "" && { ArrowRight: 1, ArrowLeft: -1 }),
    };
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (results[selected]) onPick(results[selected]);
    } else if (moves[event.key]) {
      event.preventDefault();
      setSelected((index) => Math.min(Math.max(index + moves[event.key], 0), results.length - 1));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 pt-[10vh]"
      onMouseDown={onClose}
    >
      <div
        className="flex max-h-[75vh] w-[680px] max-w-[94vw] flex-col rounded-xl border border-gray-200 bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="border-b border-gray-200 p-3">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search icons — lambda, user, laptop, redis, load balancer…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {CATEGORIES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(name)}
                className={cn(
                  "rounded-full border px-3 py-0.5 text-xs",
                  category === name
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-100"
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className="min-h-[200px] flex-1 overflow-y-auto p-3">
          {!catalog && <p className="py-10 text-center text-sm text-gray-500">Loading icons…</p>}
          {catalog && catalog.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">
              Icon catalog is empty. Run <code>npm run icons</code> once, then restart.
            </p>
          )}
          {catalog && catalog.length > 0 && results.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">No icons match.</p>
          )}
          <div className="grid grid-cols-6 gap-2">
            {results.map((icon, index) => (
              <button
                key={icon.id}
                type="button"
                data-index={index}
                title={`${icon.name} · ${icon.category}`}
                onClick={() => onPick(icon)}
                onMouseEnter={() => setSelected(index)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border p-2",
                  index === selected ? "border-indigo-400 bg-indigo-50" : "border-transparent hover:bg-gray-50"
                )}
              >
                <img src={toSrc(icon.svg)} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 object-contain" />
                <span className="line-clamp-2 w-full text-center text-[11px] leading-tight text-gray-600">
                  {icon.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between border-t border-gray-200 px-3 py-1.5 text-xs text-gray-500">
          <span>↑ ↓ move · Enter insert · Esc close</span>
          <span>{results.length >= MAX_RESULTS ? `Showing first ${MAX_RESULTS} — type to narrow` : `${results.length} icons`}</span>
        </div>
      </div>
    </div>
  );
}