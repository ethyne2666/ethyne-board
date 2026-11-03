# Ethyne Board

A browser-based diagramming app: Excalidraw's look and drawing engine, plus Canva-style multi-project tabs, single-key tool shortcuts, a system-design / DB icon library and one-click export to PNG, JPG, PDF and SVG. Built for practising system design, database design and flow diagrams.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

```bash
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

> Excalidraw loads its hand-drawn fonts from a CDN, so the first load needs internet.

## Features

- **Multiple projects in tabs.** `+` adds one, double-click a tab to rename, `×` closes. Everything autosaves in the browser (IndexedDB), so tabs and drawings survive a refresh.
- **Excalidraw canvas.** Shapes, arrows, freehand, text, frames, images, eraser, undo/redo, zoom and pan.
- **Download** as PNG, JPG, PDF or SVG, always on a white background. Files go to your browser's Downloads folder, named after the tab.
- **Icon library.** A starter set (User, Client, CDN, API Gateway, Load Balancer, Service, Cache, Queue, Storage, Database, ER Table) is loaded into Excalidraw's Library panel. Add more by downloading a `.excalidrawlib` file from https://libraries.excalidraw.com and importing it in the Library panel. Your library is saved in the browser.

## Shortcuts

| Key | Tool | Key | Tool |
|---|---|---|---|
| V | Select | P | Pencil |
| R | Rectangle | T | Text |
| C | Circle | E | Eraser |
| D | Diamond | H | Pan |
| L | Line | F | Frame |
| A | Arrow | | |

Shortcuts are ignored while you are typing in a text box. Edit them in `src/utils/shortcuts.js`.

## Project structure

```
src/
├─ main.jsx            entry point
├─ App.jsx             lazy-loads the editor page
├─ index.css           Tailwind import
├─ pages/
│  └─ Editor.jsx       layout: tab bar, shortcuts, export, board
├─ components/
│  ├─ Board.jsx        Excalidraw wrapper + autosave + library persistence
│  ├─ TabBar.jsx       project tabs
│  ├─ ExportMenu.jsx   PNG / JPG / PDF / SVG buttons
│  └─ ShortcutsHelp.jsx
├─ hooks/
│  ├─ useTabs.js       tab state, persisted
│  └─ useShortcuts.js  single-key tool switching
└─ utils/
   ├─ storage.js       IndexedDB helpers
   ├─ exporter.js      image / PDF export
   ├─ shortcuts.js     key → tool map
   ├─ starterLibrary.js  built-in icon set
   └─ cn.js            class-name helper
```

## Stack

React 18 · Vite · Tailwind CSS 4 · `@excalidraw/excalidraw` · `idb-keyval` · `jspdf`

## Ideas for later

- Text-to-diagram (Mermaid) like Eraser's diagram-as-code
- Import / export `.excalidraw` files per tab
- Bigger icon packs (AWS, GCP, Kubernetes)
- Optional cloud sync
