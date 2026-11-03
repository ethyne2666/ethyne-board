import { lazy, Suspense } from "react";

const Editor = lazy(() => import("@/pages/Editor"));

export default function App() {
  return (
    <Suspense
      fallback={<div className="grid h-full place-items-center text-gray-500">Loading…</div>}
    >
      <Editor />
    </Suspense>
  );
}
