import { useCallback, useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import {
  loadLibrary,
  loadLibraryVersion,
  loadScene,
  saveLibrary,
  saveLibraryVersion,
  saveScene,
} from "@/utils/storage";
import { getStarterLibrary, STARTER_VERSION } from "@/utils/starterLibrary";

const EMPTY_SCENE = { elements: [], appState: { viewBackgroundColor: "#ffffff" } };
const SAVE_DELAY_MS = 300;

async function resolveLibrary() {
  const [saved, savedVersion] = await Promise.all([loadLibrary(), loadLibraryVersion()]);
  const starter = getStarterLibrary();
  if (!saved) return { items: starter, changed: starter.length > 0 };
  if ((savedVersion ?? 0) >= STARTER_VERSION) return { items: saved, changed: false };

  const known = new Set(saved.map((item) => item.id));
  const added = starter.filter((item) => !known.has(item.id));
  return { items: [...saved, ...added], changed: true };
}

export function Board({ tabId, onApi, onGridChange }) {
  const [initialData, setInitialData] = useState(null);
  const latestScene = useRef(null);
  const saveTimer = useRef(null);
  const libraryReady = useRef(false);
  const lastGrid = useRef(null);

  useEffect(() => {
    let active = true;
    loadScene(tabId).then((scene) => {
      if (active) setInitialData(scene ?? EMPTY_SCENE);
    });

    const flush = () => {
      if (latestScene.current) saveScene(tabId, latestScene.current);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);

    return () => {
      active = false;
      clearTimeout(saveTimer.current);
      flush();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, [tabId]);

  const handleChange = useCallback(
    (elements, appState, files) => {
      latestScene.current = {
        elements,
        files,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          gridModeEnabled: appState.gridModeEnabled,
        },
      };
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveScene(tabId, latestScene.current), SAVE_DELAY_MS);

      if (appState.gridModeEnabled !== lastGrid.current) {
        lastGrid.current = appState.gridModeEnabled;
        onGridChange(appState.gridModeEnabled);
      }
    },
    [tabId, onGridChange]
  );

  const handleApi = useCallback(
    async (api) => {
      if (!api) return;
      onApi(api);
      try {
        const { items, changed } = await resolveLibrary();
        await api.updateLibrary({ libraryItems: items, merge: false, openLibraryMenu: false });
        if (changed) {
          await saveLibrary(items);
          await saveLibraryVersion(STARTER_VERSION);
        }
      } catch (error) {
        console.error("Library init failed", error);
      }
      libraryReady.current = true;
    },
    [onApi]
  );

  const handleLibraryChange = useCallback((items) => {
    if (libraryReady.current) saveLibrary(items);
  }, []);

  if (!initialData) return null;

  return (
    <Excalidraw
      excalidrawAPI={handleApi}
      initialData={initialData}
      onChange={handleChange}
      onLibraryChange={handleLibraryChange}
    />
  );
}