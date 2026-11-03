export const TOOL_SHORTCUTS = [
  { key: "v", tool: "selection", label: "Select" },
  { key: "r", tool: "rectangle", label: "Rectangle" },
  { key: "c", tool: "ellipse", label: "Circle" },
  { key: "d", tool: "diamond", label: "Diamond" },
  { key: "l", tool: "line", label: "Line" },
  { key: "a", tool: "arrow", label: "Arrow" },
  { key: "p", tool: "freedraw", label: "Pencil" },
  { key: "t", tool: "text", label: "Text" },
  { key: "e", tool: "eraser", label: "Eraser" },
  { key: "h", tool: "hand", label: "Pan" },
  { key: "f", tool: "frame", label: "Frame" },
];

export const TOOL_BY_KEY = Object.fromEntries(TOOL_SHORTCUTS.map(({ key, tool }) => [key, tool]));
