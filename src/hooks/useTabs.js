import { useCallback, useEffect, useState } from "react";
import {
  deleteScene,
  loadActiveTab,
  loadTabs,
  pruneScenes,
  saveActiveTab,
  saveTabs,
} from "@/utils/storage";

const createTab = (number) => ({ id: crypto.randomUUID(), name: `Project ${number}` });

export function useTabs() {
  const [tabs, setTabs] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [savedTabs, savedActive] = await Promise.all([loadTabs(), loadActiveTab()]);
      if (cancelled) return;
      const list = savedTabs?.length ? savedTabs : [createTab(1)];
      setTabs(list);
      setActiveId(list.some((tab) => tab.id === savedActive) ? savedActive : list[0].id);
      setReady(true);
      pruneScenes(list.map((tab) => tab.id));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (ready) saveTabs(tabs);
  }, [tabs, ready]);

  useEffect(() => {
    if (ready && activeId) saveActiveTab(activeId);
  }, [activeId, ready]);

  const addTab = useCallback(() => {
    const tab = createTab(tabs.length + 1);
    setTabs((prev) => [...prev, tab]);
    setActiveId(tab.id);
  }, [tabs.length]);

  const closeTab = useCallback(
    (id) => {
      if (tabs.length === 1) return;
      if (!window.confirm("Close this project? Its drawing will be deleted.")) return;
      const remaining = tabs.filter((tab) => tab.id !== id);
      setTabs(remaining);
      deleteScene(id);
      if (activeId === id) setActiveId(remaining[0].id);
    },
    [tabs, activeId]
  );

  const renameTab = useCallback((id, name) => {
    setTabs((prev) => prev.map((tab) => (tab.id === id ? { ...tab, name } : tab)));
  }, []);

  return { tabs, activeId, ready, setActiveId, addTab, closeTab, renameTab };
}
