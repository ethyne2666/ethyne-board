import { useCallback, useRef, useState } from "react";
import { Board } from "@/components/Board";
import { ExportMenu } from "@/components/ExportMenu";
import { IconPicker } from "@/components/IconPicker";
import { ShortcutsHelp } from "@/components/ShortcutsHelp";
import { TabBar } from "@/components/TabBar";
import { ToolbarButton } from "@/components/ToolbarButton";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useShortcuts } from "@/hooks/useShortcuts";
import { useTabs } from "@/hooks/useTabs";
import { exportBoard } from "@/utils/exporter";
import { insertIcon } from "@/utils/insertIcon";

export default function Editor() {
  const { tabs, activeId, ready, setActiveId, addTab, closeTab, renameTab } = useTabs();
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
  const [iconsOpen, setIconsOpen] = useState(false);
  const [gridOn, setGridOn] = useState(false);
  const apiRef = useRef(null);

  const openIcons = useCallback(() => setIconsOpen(true), []);
  const closeIcons = useCallback(() => setIconsOpen(false), []);

  useShortcuts(apiRef, { enabled: !iconsOpen, onOpenIcons: openIcons });

  const handleApi = useCallback((api) => {
    apiRef.current = api;
  }, []);

  const handleExport = useCallback(
    async (format) => {
      if (!apiRef.current) return;
      const name = tabs.find((tab) => tab.id === activeId)?.name ?? "diagram";
      await exportBoard(apiRef.current, format, name);
    },
    [tabs, activeId]
  );

  const handlePick = useCallback((icon) => {
    if (apiRef.current) insertIcon(apiRef.current, icon);
    setIconsOpen(false);
  }, []);

  const toggleGrid = useCallback(() => {
    apiRef.current?.updateScene({ appState: { gridModeEnabled: !gridOn } });
  }, [gridOn]);

  if (!ready) return null;

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-100 px-2 py-1.5">
        <TabBar
          tabs={tabs}
          activeId={activeId}
          onSelect={setActiveId}
          onAdd={addTab}
          onClose={closeTab}
          onRename={renameTab}
        />
        <div className="flex items-center gap-2">
          <ToolbarButton onClick={openIcons} title="Search and insert icons (press /)">
            Icons <kbd className="ml-1 text-gray-400">/</kbd>
          </ToolbarButton>
          <ToolbarButton active={gridOn} onClick={toggleGrid} title="Toggle canvas grid">
            Grid
          </ToolbarButton>
          <ToolbarButton onClick={toggleFullscreen} title="Toggle full screen">
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </ToolbarButton>
          <ShortcutsHelp />
          <ExportMenu onExport={handleExport} />
        </div>
      </header>
      <main className="min-h-0 flex-1">
        <Board key={activeId} tabId={activeId} onApi={handleApi} onGridChange={setGridOn} />
      </main>
      <IconPicker open={iconsOpen} onClose={closeIcons} onPick={handlePick} />
    </div>
  );
}