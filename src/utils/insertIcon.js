import { CaptureUpdateAction, convertToExcalidrawElements } from "@excalidraw/excalidraw";

const TARGET_SIZE = 96;

function toDataUrl(svg) {
  const bytes = new TextEncoder().encode(svg);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `data:image/svg+xml;base64,${btoa(binary)}`;
}

/**
 * Inserts an SVG icon from the catalog at the centre of the visible canvas
 * and selects it.
 * @param {import("@excalidraw/excalidraw/types").ExcalidrawImperativeAPI} api
 * @param {{ id: string, svg: string, width: number, height: number }} icon
 */
export function insertIcon(api, icon) {
  const fileId = `icon-${icon.id}`;
  api.addFiles([
    { id: fileId, dataURL: toDataUrl(icon.svg), mimeType: "image/svg+xml", created: Date.now() },
  ]);

  const ratio = icon.width / icon.height;
  const width = ratio >= 1 ? TARGET_SIZE : TARGET_SIZE * ratio;
  const height = ratio >= 1 ? TARGET_SIZE / ratio : TARGET_SIZE;

  const { width: viewWidth, height: viewHeight, zoom, scrollX, scrollY } = api.getAppState();
  const centerX = viewWidth / 2 / zoom.value - scrollX;
  const centerY = viewHeight / 2 / zoom.value - scrollY;

  const [element] = convertToExcalidrawElements([
    {
      type: "image",
      fileId,
      status: "saved",
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    },
  ]);

  api.updateScene({
    elements: [...api.getSceneElementsIncludingDeleted(), element],
    appState: { selectedElementIds: { [element.id]: true } },
    captureUpdate: CaptureUpdateAction.IMMEDIATELY,
  });
  api.setActiveTool({ type: "selection" });
}