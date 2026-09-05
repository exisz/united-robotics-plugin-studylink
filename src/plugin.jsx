import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import styles from "./plugin.css";

function EducationPanel() {
  return (
    <section className="ur-education" aria-label="Education plugin">
      <style>{styles}</style>
      <header className="ur-education__rail">
        <span><b>◆</b> WORLD / OFFICIAL PLUGIN</span>
        <span className="ur-education__state"><i aria-hidden="true" /> PENDING</span>
      </header>
      <div className="ur-education__body">
        <p className="ur-education__eyebrow">EDUCATION</p>
        <h2>Education</h2>
        <div className="ur-education__pending" role="status">
          <span className="ur-education__mark" aria-hidden="true">—</span>
          <div>
            <strong>Not built yet</strong>
            <p>Education is pending.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function mount(root, { invoke } = {}) {
  if (!(root instanceof Element)) throw new TypeError("Education mount root must be an Element.");
  if (typeof invoke !== "function") throw new TypeError("Education requires an invoke function.");

  let active = true;
  const reactRoot = createRoot(root);
  flushSync(() => reactRoot.render(<EducationPanel />));

  return () => {
    if (!active) return;
    active = false;
    reactRoot.unmount();
  };
}
