import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import styles from "./plugin.css";

function EducationPanel() {
  return (
    <section className="ur-education" aria-label="Education plugin">
      <style>{styles}</style>
      <div className="ur-education__placeholder" role="status">
        <strong>Education</strong>
        <span>Not built yet</span>
        <b>Pending</b>
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
