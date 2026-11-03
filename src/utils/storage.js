import { get, set, del, keys } from "idb-keyval";

const SCENE_PREFIX = "scene:";

export const loadTabs = () => get("tabs");
export const saveTabs = (tabs) => set("tabs", tabs);

export const loadActiveTab = () => get("activeTab");
export const saveActiveTab = (id) => set("activeTab", id);

export const loadScene = (id) => get(`${SCENE_PREFIX}${id}`);
export const saveScene = (id, scene) => set(`${SCENE_PREFIX}${id}`, scene);
export const deleteScene = (id) => del(`${SCENE_PREFIX}${id}`);

export const loadLibrary = () => get("library");
export const saveLibrary = (items) => set("library", items);

export const loadLibraryVersion = () => get("libraryVersion");
export const saveLibraryVersion = (version) => set("libraryVersion", version);

export async function pruneScenes(validIds) {
  const allKeys = await keys();
  const orphans = allKeys.filter(
    (key) =>
      typeof key === "string" &&
      key.startsWith(SCENE_PREFIX) &&
      !validIds.includes(key.slice(SCENE_PREFIX.length))
  );
  await Promise.all(orphans.map((key) => del(key)));
}
