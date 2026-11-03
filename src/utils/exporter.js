import { exportToBlob, exportToCanvas, exportToSvg } from "@excalidraw/excalidraw";

const PADDING = 24;

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const safeName = (name) => name.replace(/[\\/:*?"<>|]+/g, "-").trim() || "diagram";

/**
 * Exports the current board with a white background and triggers a browser
 * download (lands in the user's Downloads folder).
 * @param {import("@excalidraw/excalidraw/types").ExcalidrawImperativeAPI} api
 * @param {"png" | "jpg" | "pdf" | "svg"} format
 * @param {string} name
 */
export async function exportBoard(api, format, name) {
  const elements = api.getSceneElements();
  if (!elements.length) {
    alert("Nothing to export yet — draw something first.");
    return;
  }

  const options = {
    elements,
    files: api.getFiles(),
    exportPadding: PADDING,
    appState: {
      ...api.getAppState(),
      exportBackground: true,
      viewBackgroundColor: "#ffffff",
      exportWithDarkMode: false,
    },
  };
  const file = safeName(name);

  if (format === "png") {
    download(await exportToBlob({ ...options, mimeType: "image/png" }), `${file}.png`);
    return;
  }

  if (format === "jpg") {
    const blob = await exportToBlob({ ...options, mimeType: "image/jpeg", quality: 0.95 });
    download(blob, `${file}.jpg`);
    return;
  }

  if (format === "svg") {
    const svg = await exportToSvg(options);
    download(new Blob([svg.outerHTML], { type: "image/svg+xml" }), `${file}.svg`);
    return;
  }

  const [{ jsPDF }, canvas] = await Promise.all([
    import("jspdf"),
    exportToCanvas({
      ...options,
      getDimensions: (width, height) => ({ width: width * 2, height: height * 2, scale: 2 }),
    }),
  ]);
  const pdf = new jsPDF({
    orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
    compress: true,
  });
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`${file}.pdf`);
}
