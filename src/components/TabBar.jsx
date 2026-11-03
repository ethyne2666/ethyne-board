import { useState } from "react";
import { cn } from "@/utils/cn";

export function TabBar({ tabs, activeId, onSelect, onAdd, onClose, onRename }) {
  const [editingId, setEditingId] = useState(null);

  const commit = (id, value) => {
    const name = value.trim();
    if (name) onRename(id, name);
    setEditingId(null);
  };

  return (
    <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <div
            key={tab.id}
            title="Double-click to rename. The name is used as the download file name."
            onClick={() => onSelect(tab.id)}
            onDoubleClick={() => setEditingId(tab.id)}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-2 rounded-md border px-3 py-1 text-sm",
              isActive
                ? "border-indigo-300 bg-white font-medium text-indigo-700 shadow-sm"
                : "border-transparent text-gray-600 hover:bg-gray-200"
            )}
          >
            {editingId === tab.id ? (
              <input
                autoFocus
                defaultValue={tab.name}
                onFocus={(event) => event.target.select()}
                onClick={(event) => event.stopPropagation()}
                onBlur={(event) => commit(tab.id, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") commit(tab.id, event.currentTarget.value);
                  if (event.key === "Escape") setEditingId(null);
                }}
                className="w-32 rounded border border-indigo-300 px-1 outline-none"
              />
            ) : (
              <span>{tab.name}</span>
            )}
            {isActive && editingId !== tab.id && (
              <button
                type="button"
                aria-label={`Rename ${tab.name}`}
                title="Rename"
                onClick={(event) => {
                  event.stopPropagation();
                  setEditingId(tab.id);
                }}
                className="rounded px-1 text-gray-400 hover:bg-gray-100 hover:text-indigo-600"
              >
                ✎
              </button>
            )}
            {tabs.length > 1 && (
              <button
                type="button"
                aria-label={`Close ${tab.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onClose(tab.id);
                }}
                className="rounded px-1 text-gray-400 hover:bg-gray-300 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        aria-label="New project"
        onClick={onAdd}
        className="shrink-0 rounded-md px-2 py-1 text-lg leading-none text-gray-600 hover:bg-gray-200"
      >
        +
      </button>
    </div>
  );
}