import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

export const STARTER_VERSION = 2;

const solid = (backgroundColor) => ({ backgroundColor, fillStyle: "solid" });

const labelled = (type, text, color, width = 150, height = 70) => [
  {
    type,
    x: 0,
    y: 0,
    width,
    height,
    ...solid(color),
    ...(type === "rectangle" && { roundness: { type: 3 } }),
    label: { text, fontSize: 18 },
  },
];

const filled = (backgroundColor, fillStyle, text) => [
  {
    type: "rectangle",
    x: 0,
    y: 0,
    width: 160,
    height: 100,
    backgroundColor,
    fillStyle,
    roundness: { type: 3 },
    label: { text, fontSize: 18 },
  },
];



const DEFINITIONS = [
  { id: "fill-plain", name: "Plain Box", skeleton: filled("transparent", "solid", "Plain") },
  { id: "fill-hatch", name: "Hatch Box", skeleton: filled("#a5d8ff", "hachure", "Hatch") },
  { id: "fill-grid", name: "Grid Box", skeleton: filled("#b2f2bb", "cross-hatch", "Grid") },
  { id: "fill-zigzag", name: "Zigzag Box", skeleton: filled("#ffec99", "zigzag", "Zigzag") },
  { id: "fill-solid", name: "Solid Box", skeleton: filled("#ffc9c9", "solid", "Solid") },
  { id: "user", name: "User", skeleton: labelled("ellipse", "User", "#ffc9c9", 110, 70) },
  { id: "client", name: "Client", skeleton: labelled("rectangle", "Client", "#a5d8ff") },
  { id: "cdn", name: "CDN", skeleton: labelled("ellipse", "CDN", "#eebefa", 110, 70) },
  { id: "gateway", name: "API Gateway", skeleton: labelled("rectangle", "API Gateway", "#99e9f2", 170) },
  { id: "lb", name: "Load Balancer", skeleton: labelled("diamond", "LB", "#ffec99", 120, 90) },
  { id: "service", name: "Service", skeleton: labelled("rectangle", "Service", "#b2f2bb") },
  { id: "cache", name: "Cache", skeleton: labelled("rectangle", "Cache", "#ffd8a8", 130) },
  { id: "queue", name: "Message Queue", skeleton: labelled("rectangle", "Queue", "#d0bfff", 180, 50) },
  { id: "storage", name: "Object Storage", skeleton: labelled("rectangle", "Storage", "#c5f6fa", 150) },
  {
    id: "database",
    name: "Database",
    skeleton: [
      { type: "rectangle", x: 0, y: 25, width: 120, height: 80, ...solid("#ffd8a8") },
      { type: "ellipse", x: 0, y: 0, width: 120, height: 50, ...solid("#ffd8a8") },
      { type: "text", x: 20, y: 64, text: "Database", fontSize: 18 },
    ],
  },
  {
    id: "er-table",
    name: "ER Table",
    skeleton: [
      {
        type: "rectangle",
        x: 0,
        y: 0,
        width: 220,
        height: 40,
        ...solid("#a5d8ff"),
        label: { text: "table_name", fontSize: 18 },
      },
      { type: "rectangle", x: 0, y: 40, width: 220, height: 120 },
      { type: "text", x: 12, y: 52, text: "id            PK", fontSize: 16 },
      { type: "text", x: 12, y: 82, text: "name          string", fontSize: 16 },
      { type: "text", x: 12, y: 112, text: "created_at    timestamp", fontSize: 16 },
    ],
  },
];

export function getStarterLibrary() {
  try {
    return DEFINITIONS.map(({ id, name, skeleton }) => ({
      id: `starter-${id}`,
      name,
      status: "unpublished",
      created: Date.now(),
      elements: convertToExcalidrawElements(skeleton),
    }));
  } catch (error) {
    console.error("Could not build starter library", error);
    return [];
  }
}
