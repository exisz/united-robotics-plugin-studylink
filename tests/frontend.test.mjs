import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

function installDom() {
  const dom = new JSDOM("<!doctype html><div id=root></div>", { url: "https://world.test/" });
  const previous = {};
  for (const key of ["window", "document", "Element", "HTMLElement", "Node", "navigator"]) {
    previous[key] = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: dom.window[key] });
  }
  return () => {
    dom.window.close();
    for (const [key, descriptor] of Object.entries(previous)) {
      if (descriptor === undefined) delete globalThis[key];
      else Object.defineProperty(globalThis, key, descriptor);
    }
  };
}

test("mount renders the Education pending placeholder and never invokes the backend", async () => {
  const restore = installDom();
  try {
    const { mount } = await import(`../dist/plugin.js?test=${Date.now()}`);
    const root = document.querySelector("#root");
    let calls = 0;
    const cleanup = mount(root, { invoke: async () => { calls += 1; } });

    assert.equal(typeof cleanup, "function");
    assert.match(root.textContent, /Education/);
    assert.match(root.textContent, /Not built yet/);
    assert.match(root.textContent, /pending/i);
    assert.equal(calls, 0);
    assert.ok(root.querySelector("style")?.textContent.includes("ur-education"));

    cleanup();
    assert.equal(root.childNodes.length, 0);
    cleanup();
  } finally {
    restore();
  }
});

test("source contains no data request, polling, mock records, or state access", async () => {
  const source = await import("node:fs/promises").then(({ readFile }) => readFile("src/plugin.jsx", "utf8"));
  for (const forbidden of ["fetch(", "XMLHttpRequest", "WebSocket", "setTimeout", "setInterval", "useEffect", "projection.sqlite", "WORLD_PLUGIN_STATE_DIR", "syntheticDemo"]) {
    assert.equal(source.includes(forbidden), false, forbidden);
  }
  assert.doesNotMatch(source, /invoke\s*\(/);
});
