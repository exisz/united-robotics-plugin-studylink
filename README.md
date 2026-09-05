# Education — United Robotics World plugin

The third official World example plugin, following the same lightweight React and one-shot backend contract as Hello World and Todo List.

This first step is intentionally a compact placeholder. The panel displays **Education**, **Not built yet**, and **Pending**, including in Capital's smallest persisted panel height. It does not load education data or call its backend.

## Artifact contract

`npm run build` creates exactly:

```text
dist/manifest.json
dist/plugin.js
dist/rpc.mjs
```

The manifest has the fixed four World V1 fields. `plugin.js` is a self-contained ESM exporting `mount(root, context)`. `rpc.mjs` is a standalone one-shot Node ESM; its placeholder `education.status` response is `{ "status": "pending" }`.

## Verify

```bash
npm ci
npm run check
```

## Immutable installation

Pin all three artifacts through the exact full commit SHA:

```text
https://cdn.jsdelivr.net/gh/exisz/united-robotics-plugin-studylink@<FULL_40_CHARACTER_GIT_SHA>/dist/manifest.json
```
